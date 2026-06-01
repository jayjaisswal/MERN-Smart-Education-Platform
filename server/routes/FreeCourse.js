const express = require("express");
const router = express.Router();

const {
  
  createFreeCourse,
  getAllFreeCourses,
  getFreeCourseDetails,
  updateFreeCourse,
  deleteFreeCourse,
  getInstructorFreeCourses,
} = require("../controllers/FreeCourse");

const { auth, isAdmin } = require("../middlewares/auth");



// Protected routes (instructor/admin only)
router.post("/create", auth, isAdmin, createFreeCourse);
router.put("/:courseId", auth, isAdmin, updateFreeCourse);
router.delete("/:courseId", auth, isAdmin, deleteFreeCourse);
router.get("/instructor/my-courses", auth, isAdmin, getInstructorFreeCourses);


// Public routes
router.get("/all", getAllFreeCourses);
router.get("/:courseId", getFreeCourseDetails);


module.exports = router;
