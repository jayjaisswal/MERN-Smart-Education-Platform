const Arithmetic = require("../models/Arithmetic");
const VerbalAbility = require("../models/VerbalAbility");
const LogicalReasoning = require("../models/LogicalReasoning");
const AptitudeProgress = require("../models/AptitudeProgress");

// 1. Centralized Model Mapping to prevent mismatching
const CATEGORY_MAP = {
  arithmetic: {
    model: Arithmetic,
    displayName: "Arithmetic",
  },
  verbal_ability: {
    model: VerbalAbility,
    displayName: "Verbal Ability",
  },
  logical_reasoning: {
    model: LogicalReasoning,
    displayName: "Logical Reasoning",
  },
};

const getModelByCategory = (category) => {
  return CATEGORY_MAP[category]?.model || null;
};

// --- ADMIN CONTROLLERS ---

// Create aptitude questions (admin)
exports.createAptitudeQuestions = async (req, res) => {
  try {
    const { questions, category } = req.body;

    const Model = getModelByCategory(category);
    if (!Model) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid category. Must be arithmetic, verbal_ability, or logical_reasoning",
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions array is required and cannot be empty",
      });
    }

    const createdQuestions = await Model.insertMany(questions);

    return res.status(201).json({
      success: true,
      message: `${createdQuestions.length} questions created in ${category}`,
      data: createdQuestions,
    });
  } catch (error) {
    console.error("Error creating questions:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// --- USER CONTROLLERS ---

// Get all categories, total counts, and unique topics per category
exports.getAllCategories = async (req, res) => {
  try {
    const categories = Object.keys(CATEGORY_MAP);

    const categoryDetails = await Promise.all(
      categories.map(async (key) => {
        const Model = CATEGORY_MAP[key].model;
        const [count, topics] = await Promise.all([
          Model.countDocuments(),
          Model.distinct("topic"),
        ]);

        return {
          name: key,
          displayName: CATEGORY_MAP[key].displayName,
          count,
          topics: topics.filter(Boolean).sort(), // Removes nulls and sorts alphabetically
        };
      }),
    );

    return res.status(200).json({
      success: true,
      data: categoryDetails,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get questions by category/topic with strict filtering
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const { category, page = 1, limit = 5, topic } = req.query;

    const Model = getModelByCategory(category);
    if (!Model) {
      return res
        .status(400)
        .json({ success: false, message: "Valid category is required" });
    }

    const query = {};
    if (topic) {
      query.topic = topic; // Restricts search to only this specific topic
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [questions, totalCount] = await Promise.all([
      Model.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .select("-correctOption") // Security: Do not send answer to client
        .lean(),
      Model.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      category,
      topic: topic || "all",
      data: questions,
      pagination: {
        totalQuestions: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        questionsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Submit answer and save progress
exports.submitAnswer = async (req, res) => {
  try {
    const { questionId, userAnswer, timeTaken, category } = req.body;
    const userId = req.user.id;

    if (!questionId || userAnswer === undefined || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const Model = getModelByCategory(category);
    if (!Model) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    const question = await Model.findById(questionId);
    if (!question) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Question not found in this category",
        });
    }

    const isCorrect = question.correctOption === parseInt(userAnswer);

    const progress = await AptitudeProgress.create({
      userId,
      questionId,
      userAnswer: parseInt(userAnswer),
      isCorrect,
      timeTaken: parseInt(timeTaken) || 0,
      category,
    });

    return res.status(201).json({
      success: true,
      data: {
        isCorrect,
        correctOption: question.correctOption,
        explanation: question.explanation,
        topic: question.topic,
        progress,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get user performance with category breakdown
exports.getUserPerformance = async (req, res) => {
  try {
    const userId = req.user.id;
    const allProgress = await AptitudeProgress.find({ userId }).lean();

    if (!allProgress.length) {
      return res.status(200).json({
        success: true,
        message: "No attempts yet",
        data: { totalAttempts: 0, accuracy: 0, categoryStats: [] },
      });
    }

    const stats = Object.keys(CATEGORY_MAP).map((catKey) => {
      const catData = allProgress.filter((p) => p.category === catKey);
      const correct = catData.filter((p) => p.isCorrect).length;
      return {
        category: catKey,
        displayName: CATEGORY_MAP[catKey].displayName,
        attempts: catData.length,
        correct,
        accuracy: catData.length
          ? ((correct / catData.length) * 100).toFixed(2)
          : 0,
      };
    });

    const totalAttempts = allProgress.length;
    const totalCorrect = allProgress.filter((p) => p.isCorrect).length;

    return res.status(200).json({
      success: true,
      data: {
        totalAttempts,
        totalCorrect,
        overallAccuracy: ((totalCorrect / totalAttempts) * 100).toFixed(2),
        categoryStats: stats,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get specific question (Admin) - Requires category to prevent mismatch
exports.getQuestionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.query;

    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category query param is required" });
    }

    const Model = getModelByCategory(category);
    const question = await Model?.findById(id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    return res.status(200).json({ success: true, data: question });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
