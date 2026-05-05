const Notes = require("../models/Notes");
const User = require("../models/User");

// Create a new note (Instructor only)
exports.createNotes = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      googleDriveUrl,
      videoUrl,
      videoTitle,
      tags,
    } = req.body;
    const instructorId = req.user.id;

    // Validate required fields
    if (!title || !googleDriveUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const newNote = await Notes.create({
      title,
      description,
      subject,
      googleDriveUrl,
      videoUrl,
      videoTitle,
      tags: tags || [],
      instructor: instructorId,
      isPublished: true,
    });

    // Populate instructor details
    await newNote.populate("instructor", "firstName lastName email");

    res.status(201).json({
      success: true,
      data: newNote,
      message: "Note created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all published notes (Students)
exports.getAllNotes = async (req, res) => {
  try {
    const { subject, search, sortBy } = req.query;

    let filter = { isPublished: true };

    // Filter by subject
    if (subject) {
      filter.subject = subject;
    }

    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sortBy === "rating") {
      sortOption = { rating: -1 };
    } else if (sortBy === "views") {
      sortOption = { views: -1 };
    }

    const notes = await Notes.find(filter)
      .populate("instructor", "firstName lastName email profileImage")
      .sort(sortOption)
      .lean();

    res.status(200).json({
      success: true,
      data: notes,
      count: notes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get notes by subject
exports.getNotesBySubject = async (req, res) => {
  try {
    const { subject } = req.params;

    const notes = await Notes.find({
      subject,
      isPublished: true,
    })
      .populate("instructor", "firstName lastName email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: notes,
      count: notes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single note
exports.getNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Notes.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true },
    ).populate("instructor", "firstName lastName email profileImage");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update note (Instructor only)
exports.updateNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      subject,
      googleDriveUrl,
      videoUrl,
      videoTitle,
      isPublished,
      tags,
    } = req.body;

    const note = await Notes.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Check if user is instructor
    if (note.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this note",
      });
    }

    const updatedNote = await Notes.findByIdAndUpdate(
      id,
      {
        title: title || note.title,
        description: description || note.description,
        subject: subject || note.subject,
        googleDriveUrl: googleDriveUrl || note.googleDriveUrl,
        videoUrl: videoUrl || note.videoUrl,
        videoTitle: videoTitle || note.videoTitle,
        isPublished: isPublished !== undefined ? isPublished : note.isPublished,
        tags: tags || note.tags,
      },
      { new: true },
    ).populate("instructor", "firstName lastName email");

    res.status(200).json({
      success: true,
      data: updatedNote,
      message: "Note updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete note (Instructor only)
exports.deleteNotes = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Notes.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Check if user is instructor
    if (note.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this note",
      });
    }

    await Notes.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get instructor's notes
exports.getInstructorNotes = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const notes = await Notes.find({ instructor: instructorId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: notes,
      count: notes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = [
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
    ];

    const subjectsWithCount = await Promise.all(
      subjects.map(async (subject) => {
        const count = await Notes.countDocuments({
          subject,
          isPublished: true,
        });
        return { subject, count };
      }),
    );

    res.status(200).json({
      success: true,
      data: subjectsWithCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
