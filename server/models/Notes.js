const mongoose = require("mongoose");

// Chapter schema with nested notes
const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: null,
  },
  notes: [
    {
      title: {
        type: String,
        required: [true, "Please provide a note title"],
        trim: true,
      },
      googleDriveUrl: {
        type: String,
        required: [true, "Please provide Google Drive URL"],
      },
      order: {
        type: Number,
        default: 0,
      },
    },
  ],
  order: {
    type: Number,
    default: 0,
  },
});

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
    // Keep for backward compatibility - single note without chapters
    googleDriveUrl: {
      type: String,
      default: null,
    },
    // New: nested chapters structure
    chapters: [chapterSchema],
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
