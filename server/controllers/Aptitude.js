const Aptitude = require("../models/Aptitude");
const AptitudeProgress = require("../models/AptitudeProgress");

// Create aptitude questions (admin)
exports.createAptitudeQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions array is required and cannot be empty",
      });
    }

    const createdQuestions = await Aptitude.insertMany(questions);

    return res.status(201).json({
      success: true,
      message: `${createdQuestions.length} questions created successfully`,
      data: createdQuestions,
    });
  } catch (error) {
    console.error("Error creating questions:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating questions",
      error: error.message,
    });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Aptitude.distinct("category");

    const categoryDetails = await Promise.all(
      categories.map(async (cat) => {
        const count = await Aptitude.countDocuments({ category: cat });
        const topics = await Aptitude.distinct("topic", { category: cat });
        return {
          name: cat,
          displayName:
            cat === "verbal_ability"
              ? "Verbal Ability"
              : cat === "arithmetic"
                ? "Arithmetic"
                : "Logical Reasoning",
          count,
          topics,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      data: categoryDetails,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// Get questions by category with pagination
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const { category, page = 1, limit = 5, topic } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const skip = (page - 1) * limit;
    const query = { category };

    if (topic) {
      query.topic = topic;
    }

    const [questions, totalCount] = await Promise.all([
      Aptitude.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .select("-correctOption"), // Hide correct answer from frontend
      Aptitude.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      data: questions,
      pagination: {
        totalQuestions: totalCount,
        totalPages,
        currentPage: parseInt(page),
        questionsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching questions",
      error: error.message,
    });
  }
};

// Submit answer and save progress
exports.submitAnswer = async (req, res) => {
  try {
    const { questionId, userAnswer, timeTaken, category } = req.body;
    const userId = req.user.id;

    if (!questionId || userAnswer === undefined || !timeTaken || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const question = await Aptitude.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const isCorrect = question.correctOption === parseInt(userAnswer);

    const progress = await AptitudeProgress.create({
      userId,
      questionId,
      userAnswer: parseInt(userAnswer),
      isCorrect,
      timeTaken: parseInt(timeTaken),
      category,
    });

    return res.status(201).json({
      success: true,
      message: "Answer submitted successfully",
      data: {
        isCorrect,
        correctOption: question.correctOption,
        explanation: question.explanation,
        progress,
      },
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting answer",
      error: error.message,
    });
  }
};

// Get user performance
exports.getUserPerformance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.query;

    const query = { userId };
    if (category) {
      query.category = category;
    }

    const allProgress = await AptitudeProgress.find(query);

    if (allProgress.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No attempts yet",
        data: {
          totalAttempts: 0,
          correct: 0,
          incorrect: 0,
          accuracy: 0,
          averageTime: 0,
          categoryStats: [],
        },
      });
    }

    const totalAttempts = allProgress.length;
    const correct = allProgress.filter((p) => p.isCorrect).length;
    const incorrect = totalAttempts - correct;
    const accuracy = ((correct / totalAttempts) * 100).toFixed(2);
    const averageTime = Math.round(
      allProgress.reduce((sum, p) => sum + p.timeTaken, 0) / totalAttempts,
    );

    // Category wise stats
    const categories = ["verbal_ability", "arithmetic", "logical_reasoning"];
    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const catProgress = allProgress.filter((p) => p.category === cat);
        if (catProgress.length === 0) {
          return {
            category: cat,
            attempts: 0,
            correct: 0,
            accuracy: 0,
          };
        }
        return {
          category: cat,
          attempts: catProgress.length,
          correct: catProgress.filter((p) => p.isCorrect).length,
          accuracy: (
            (catProgress.filter((p) => p.isCorrect).length /
              catProgress.length) *
            100
          ).toFixed(2),
        };
      }),
    );

    return res.status(200).json({
      success: true,
      data: {
        totalAttempts,
        correct,
        incorrect,
        accuracy,
        averageTime,
        categoryStats,
      },
    });
  } catch (error) {
    console.error("Error fetching performance:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching performance",
      error: error.message,
    });
  }
};

// Get specific question with details (for admin)
exports.getQuestionDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Aptitude.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching question",
      error: error.message,
    });
  }
};
