const mongoose = require("mongoose");

const interviewProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      index: true,
    },
    questionText: {
      type: String,
    },
    userAnswer: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: String,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    timeTaken: {
      type: Number, // in seconds
      default: 0,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["mcq", "qa", "quiz"],
      default: "mcq",
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound indexes for user queries
interviewProgressSchema.index({ userId: 1, category: 1 });
interviewProgressSchema.index({ userId: 1, category: 1, topic: 1 });
interviewProgressSchema.index({ userId: 1, attemptedAt: -1 });

module.exports = mongoose.model("InterviewProgress", interviewProgressSchema);
