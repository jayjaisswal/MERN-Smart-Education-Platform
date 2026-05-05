const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      required: [true, "Please select a subject"],
      enum: [
        "Physics",
        "Chemistry",
        "Biology",
        "Mathematics",
        "English",
        "History",
        "Geography",
        "Economics",
        "Computer Science",
        "General",
      ],
      default: "General",
    },
    googleDriveUrl: {
      type: String,
      required: [true, "Please provide Google Drive URL"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notes", notesSchema);
