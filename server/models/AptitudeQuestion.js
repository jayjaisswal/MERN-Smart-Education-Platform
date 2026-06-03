const mongoose = require("mongoose");

const aptitudeQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
    },

    correct_option: {
      type: String,
      required: true,
    },

    answer: String,
    explanation: String,

    source_site: String,
    date: String,

    category: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AptitudeQuestion",
  aptitudeQuestionSchema
);