const mongoose = require("mongoose");

const arithmeticSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      index: true,
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
      max: 4,
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
    source: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

arithmeticSchema.index({ topic: 1, question: 1 });

module.exports = mongoose.model("Arithmetic", arithmeticSchema);
