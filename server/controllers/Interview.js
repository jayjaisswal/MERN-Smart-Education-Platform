const InterviewProgress = require("../models/InterviewProgress");

// Submit an interview answer
exports.submitAnswer = async (req, res) => {
  try {
    const { questionId, questionText, userAnswer, correctAnswer, isCorrect, timeTaken, category, topic, type } = req.body;
    const userId = req.user.id;

    const progress = await InterviewProgress.create({
      userId,
      questionId,
      questionText,
      userAnswer,
      correctAnswer,
      isCorrect,
      timeTaken: timeTaken || 0,
      category,
      topic,
      type: type || "mcq",
    });

    res.status(201).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("Error submitting interview answer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit answer",
    });
  }
};

// Get user performance for interview questions
exports.getUserPerformance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, topic } = req.query;

    let query = { userId };
    if (category) query.category = category;
    if (topic) query.topic = topic;

    const progress = await InterviewProgress.find(query).sort({ attemptedAt: -1 });

    // Calculate statistics
    const totalAttempted = progress.length;
    const correctAnswers = progress.filter(p => p.isCorrect).length;
    const accuracy = totalAttempted > 0 ? Math.round((correctAnswers / totalAttempted) * 100) : 0;

    // Group by category
    const categoryStats = {};
    progress.forEach(p => {
      if (!categoryStats[p.category]) {
        categoryStats[p.category] = { attempted: 0, correct: 0 };
      }
      categoryStats[p.category].attempted += 1;
      if (p.isCorrect) categoryStats[p.category].correct += 1;
    });

    // Group by topic
    const topicStats = {};
    progress.forEach(p => {
      if (!topicStats[p.topic]) {
        topicStats[p.topic] = { attempted: 0, correct: 0 };
      }
      topicStats[p.topic].attempted += 1;
      if (p.isCorrect) topicStats[p.topic].correct += 1;
    });

    res.status(200).json({
      success: true,
      data: {
        progress,
        stats: {
          totalAttempted,
          correctAnswers,
          accuracy,
          categoryStats,
          topicStats,
        },
      },
    });
  } catch (error) {
    console.error("Error getting user performance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get performance",
    });
  }
};

// Get all interview data (for admins)
exports.getAllInterviewData = async (req, res) => {
  try {
    const { category, topic, page = 1, limit = 20 } = req.query;

    let query = {};
    if (category) query.category = category;
    if (topic) query.topic = topic;

    const skip = (page - 1) * limit;

    const data = await InterviewProgress.find(query)
      .populate("userId", "firstName lastName email")
      .sort({ attemptedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await InterviewProgress.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error getting interview data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get data",
    });
  }
};

// Reset user progress for a category/topic
exports.resetProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, topic } = req.body;

    let query = { userId };
    if (category) query.category = category;
    if (topic) query.topic = topic;

    const result = await InterviewProgress.deleteMany(query);

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} records`,
    });
  } catch (error) {
    console.error("Error resetting progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset progress",
    });
  }
};

// Get leaderboard data
exports.getLeaderboard = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;

    let query = {};
    if (category) query.category = category;

    // Aggregate to get top performers
    const leaderboard = await InterviewProgress.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$userId",
          totalAttempted: { $sum: 1 },
          correctAnswers: { $sum: { $cond: ["$isCorrect", 1, 0] } },
        },
      },
      {
        $addFields: {
          accuracy: {
            $multiply: [
              { $divide: ["$correctAnswers", "$totalAttempted"] },
              100,
            ],
          },
        },
      },
      { $sort: { correctAnswers: -1, accuracy: -1 } },
      { $limit: parseInt(limit) },
    ]);

    // Populate user details
    const populatedLeaderboard = await InterviewProgress.populate(leaderboard, {
      path: "_id",
      select: "firstName lastName email",
    });

    res.status(200).json({
      success: true,
      data: populatedLeaderboard,
    });
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get leaderboard",
    });
  }
};
