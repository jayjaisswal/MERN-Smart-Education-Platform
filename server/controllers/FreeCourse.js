const FreeCourse = require("../models/FreeCourse");
const User = require("../models/User");
const toast = require("react-hot-toast");

// Get all public free courses
exports.getAllFreeCourses = async (req, res) => {
  try {
    const { search, sortBy = "recent" } = req.query;

    let filter = { isPublic: true };

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let courses = await FreeCourse.find(filter)
      .populate("instructor", "firstName lastName avatar")
      .lean()
      .exec();

    // Sort
    if (sortBy === "recent") {
      courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      courses.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "title") {
      courses.sort((a, b) => a.title.localeCompare(b.title));
    }

    return res.status(200).json({
      success: true,
      data: courses,
      count: courses.length,
    });
  } catch (error) {
    console.error("Error fetching free courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch free courses",
      error: error.message,
    });
  }
};

// Get single free course details
exports.getFreeCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await FreeCourse.findById(courseId)
      .populate("instructor", "firstName lastName avatar email")
      .lean()
      .exec();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Free course not found",
      });
    }

    if (!course.isPublic) {
      return res.status(403).json({
        success: false,
        message: "This course is not publicly available",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error fetching free course details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch free course details",
      error: error.message,
    });
  }
};

// Create free course (instructor/admin only)
exports.createFreeCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, structure } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    // Check if user is instructor or admin
    const user = await User.findById(userId);
    if (
      !user ||
      (user.accountType !== "Instructor" && user.accountType !== "Admin")
    ) {
      return res.status(403).json({
        success: false,
        message: "Only instructors or admins can create free courses",
      });
    }

    // Validate structure (if provided)
    if (structure && Array.isArray(structure)) {
      structure.forEach((item) => {
        if (item.videoUrl) {
          // Validate YouTube URLs
          const youtubeRegex =
            /^(https?:\/\/)?(www\.)?youtube\.com|youtu\.be\/.+/;
          if (!youtubeRegex.test(item.videoUrl)) {
            return res.status(400).json({
              success: false,
              message: "Invalid YouTube URL in video structure",
            });
          }
        }
      });
    }

    // Create new free course
    const newCourse = await FreeCourse.create({
      title,
      description,
      instructor: userId,
      structure: structure || [],
      isPublic: true,
    });

    // Populate instructor details
    const courseWithInstructor = await FreeCourse.findById(newCourse._id)
      .populate("instructor", "firstName lastName avatar")
      .lean()
      .exec();

    return res.status(201).json({
      success: true,
      data: courseWithInstructor,
      message: "Free course created successfully",
    });
  } catch (error) {
    console.error("Error creating free course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create free course",
      error: error.message,
    });
  }
};

// Update free course (instructor/admin only)
exports.updateFreeCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    const { title, description, structure, isPublic } = req.body;

    // Check if course exists
    const course = await FreeCourse.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Free course not found",
      });
    }

    // Check authorization
    if (course.instructor.toString() !== userId) {
      const user = await User.findById(userId);
      if (user.accountType !== "Admin") {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this course",
        });
      }
    }

    // Validate YouTube URLs if structure is being updated
    if (structure && Array.isArray(structure)) {
      structure.forEach((item) => {
        if (item.videoUrl) {
          const youtubeRegex =
            /^(https?:\/\/)?(www\.)?youtube\.com|youtu\.be\/.+/;
          if (!youtubeRegex.test(item.videoUrl)) {
            return res.status(400).json({
              success: false,
              message: "Invalid YouTube URL in video structure",
            });
          }
        }
      });
    }

    // Update course
    const updatedCourse = await FreeCourse.findByIdAndUpdate(
      courseId,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(structure && { structure }),
        ...(isPublic !== undefined && { isPublic }),
      },
      { new: true },
    )
      .populate("instructor", "firstName lastName avatar")
      .lean()
      .exec();

    return res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "Free course updated successfully",
    });
  } catch (error) {
    console.error("Error updating free course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update free course",
      error: error.message,
    });
  }
};

// Delete free course (instructor/admin only)
exports.deleteFreeCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    // Check if course exists
    const course = await FreeCourse.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Free course not found",
      });
    }

    // Check authorization
    if (course.instructor.toString() !== userId) {
      const user = await User.findById(userId);
      if (user.accountType !== "Admin") {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this course",
        });
      }
    }

    // Delete course
    await FreeCourse.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Free course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting free course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete free course",
      error: error.message,
    });
  }
};

// Get instructor's free courses
exports.getInstructorFreeCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const courses = await FreeCourse.find({ instructor: userId })
      .populate("instructor", "firstName lastName avatar")
      .lean()
      .exec();

    return res.status(200).json({
      success: true,
      data: courses,
      count: courses.length,
    });
  } catch (error) {
    console.error("Error fetching instructor free courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your free courses",
      error: error.message,
    });
  }
};
