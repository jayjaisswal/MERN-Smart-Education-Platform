const AptitudeQuestion = require("../models/AptitudeQuestion");
const AptitudeProgress = require("../models/AptitudeProgress");

// ================================
// CREATE QUESTIONS (ADMIN)
// ================================
exports.createAptitudeQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions array is required",
      });
    }

    const createdQuestions =
      await AptitudeQuestion.insertMany(questions);

    return res.status(201).json({
      success: true,
      message: `${createdQuestions.length} questions created successfully`,
      data: createdQuestions,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================================
// GET ALL CATEGORIES
// SAME RESPONSE AS OLD CONTROLLER
// ================================
exports.getAllCategories = async (req, res) => {
  try {
    const questions = await AptitudeQuestion.find(
      {},
      { category: 1 }
    ).lean();

    const categoryMap = {};

    questions.forEach((q) => {
      if (!q.category || q.category.length < 2) return;

      const mainCategory = q.category[1];
      const topic = q.category[2];

      if (!categoryMap[mainCategory]) {
        categoryMap[mainCategory] = {
          name: mainCategory
            .toLowerCase()
            .replace(/\s+/g, "_"),
          displayName: mainCategory,
          count: 0,
          topics: [],
        };
      }

      categoryMap[mainCategory].count++;

      if (
        topic &&
        !categoryMap[mainCategory].topics.includes(
          topic
        )
      ) {
        categoryMap[mainCategory].topics.push(topic);
      }
    });

    return res.status(200).json({
      success: true,
      data: Object.values(categoryMap),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================================
// GET QUESTIONS BY CATEGORY/TOPIC
// ================================
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const {
      category,
      topic,
      page = 1,
      limit = 5,
    } = req.query;

    const query = {};

    if (topic) {
      query.category = topic;
    } else if (category) {
      query.category = category;
    }

    const skip =
      (parseInt(page) - 1) * parseInt(limit);

    const [questions, totalCount] =
      await Promise.all([
        AptitudeQuestion.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .select("-correct_option")
          .lean(),

        AptitudeQuestion.countDocuments(query),
      ]);

    return res.status(200).json({
      success: true,
      category: category || "all",
      topic: topic || "all",
      data: questions,
      pagination: {
        totalQuestions: totalCount,
        totalPages: Math.ceil(
          totalCount / parseInt(limit)
        ),
        currentPage: parseInt(page),
        questionsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================================
// SUBMIT ANSWER
// ================================
exports.submitAnswer = async (req, res) => {
  try {
    const {
      questionId,
      userAnswer,
      timeTaken,
    } = req.body;

    const userId = req.user.id;

    if (!questionId || userAnswer === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const question =
      await AptitudeQuestion.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const isCorrect =
      question.correct_option === userAnswer;

    const progress =
      await AptitudeProgress.create({
        userId,
        questionId,
        userAnswer,
        isCorrect,
        timeTaken: Number(timeTaken) || 0,
        category:
          question.category?.[1] || "Unknown",
        topic:
          question.category?.[2] || "Unknown",
      });

    return res.status(201).json({
      success: true,
      data: {
        isCorrect,
        correctOption:
          question.correct_option,
        explanation:
          question.explanation,
        progress,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================================
// USER PERFORMANCE
// ================================
exports.getUserPerformance = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const allProgress =
      await AptitudeProgress.find({
        userId,
      }).lean();

    if (!allProgress.length) {
      return res.status(200).json({
        success: true,
        message: "No attempts yet",
        data: {
          totalAttempts: 0,
          accuracy: 0,
          categoryStats: [],
        },
      });
    }

    const statsMap = {};

    allProgress.forEach((attempt) => {
      const cat = attempt.category;

      if (!statsMap[cat]) {
        statsMap[cat] = {
          category: cat,
          displayName: cat,
          attempts: 0,
          correct: 0,
        };
      }

      statsMap[cat].attempts++;

      if (attempt.isCorrect) {
        statsMap[cat].correct++;
      }
    });

    const categoryStats =
      Object.values(statsMap).map((item) => ({
        ...item,
        accuracy:
          item.attempts > 0
            ? (
                (item.correct /
                  item.attempts) *
                100
              ).toFixed(2)
            : 0,
      }));

    const totalAttempts =
      allProgress.length;

    const totalCorrect =
      allProgress.filter(
        (item) => item.isCorrect
      ).length;

    return res.status(200).json({
      success: true,
      data: {
        totalAttempts,
        totalCorrect,
        overallAccuracy: (
          (totalCorrect /
            totalAttempts) *
          100
        ).toFixed(2),
        categoryStats,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================================
// GET QUESTION DETAILS
// ================================
exports.getQuestionDetails = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const question =
      await AptitudeQuestion.findById(id);

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
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};