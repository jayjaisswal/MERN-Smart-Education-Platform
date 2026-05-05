const mongoose = require("mongoose");

const freeCourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a course title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    structure: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FreeCourse", freeCourseSchema);
