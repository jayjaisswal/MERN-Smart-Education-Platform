const mongoose = require("mongoose");

const aptitudeProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aptitude",
      required: true,
      index: true,
    },
    userAnswer: {
      type: Number,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    timeTaken: {
      type: Number, // in seconds
      required: true,
    },
    category: {
      type: String,
      enum: ["verbal_ability", "arithmetic", "logical_reasoning"],
      required: true,
      index: true,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Compound index for user queries
aptitudeProgressSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model("AptitudeProgress", aptitudeProgressSchema);
