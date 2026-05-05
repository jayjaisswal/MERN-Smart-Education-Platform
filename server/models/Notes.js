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
    // For video lectures
    videoUrl: {
      type: String,
      default: null,
    },
    videoTitle: {
      type: String,
      default: null,
    },
    // Access control
    isPublished: {
      type: Boolean,
      default: false,
    },
    accessibleTo: {
      type: [String],
      enum: ["All", "VIP"],
      default: ["All"],
    },
    // Statistics
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    // Tags for search
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notes", notesSchema);
