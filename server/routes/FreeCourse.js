const express = require("express");
const router = express.Router();

const {
  getAllFreeCourses,
  getFreeCourseDetails,
  createFreeCourse,
  updateFreeCourse,
  deleteFreeCourse,
  getInstructorFreeCourses,
} = require("../controllers/FreeCourse");

const { auth, isAdmin } = require("../middlewares/auth");

// Public routes
router.get("/all", getAllFreeCourses);
router.get("/:courseId", getFreeCourseDetails);

// Protected routes (instructor/admin only)
router.post("/create", auth, isAdmin, createFreeCourse);
router.put("/:courseId", auth, isAdmin, updateFreeCourse);
router.delete("/:courseId", auth, isAdmin, deleteFreeCourse);
router.get("/instructor/my-courses", auth, isAdmin, getInstructorFreeCourses);

module.exports = router;
