const express = require("express");
const router = express.Router();
const { auth, isInstructor, isStudent } = require("../middlewares/auth");
const {
  createNotes,
  getAllNotes,
  getNotesBySubject,
  getNote,
  updateNotes,
  deleteNotes,
  getInstructorNotes,
  getAllSubjects,
} = require("../controllers/Notes");

// Instructor routes (Protected - must come before /:id)
router.post("/create", auth, isInstructor, createNotes);
router.get("/instructor/my-notes", auth, isInstructor, getInstructorNotes);
router.put("/:id", auth, isInstructor, updateNotes);
router.delete("/:id", auth, isInstructor, deleteNotes);

// Student routes (Public - accessible after authentication)
router.get("/all", auth, getAllNotes);
router.get("/subjects", auth, getAllSubjects);
router.get("/subject/:subject", auth, getNotesBySubject);
router.get("/:id", auth, getNote);

module.exports = router;
