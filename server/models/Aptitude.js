const mongoose = require("mongoose");

const aptitudeSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["verbal_ability", "arithmetic", "logical_reasoning"],
      index: true,
    },
    topic: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length >= 2 && v.length <= 5;
        },
        message: "Options must be between 2 and 5",
      },
    },
    correctOption: {
      type: Number,
      required: true,
      min: 0,
    },
    explanation: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Aptitude", aptitudeSchema);
