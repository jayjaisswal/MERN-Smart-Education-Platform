const express = require("express");
const router = express.Router();
const { auth, isAdmin, isStudent } = require("../middlewares/auth");
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

// Admin routes (Protected - must come before /:id)
router.post("/create", auth, isAdmin, createNotes);
router.get("/instructor/my-notes", auth, isAdmin, getInstructorNotes);
router.put("/:id", auth, isAdmin, updateNotes);
router.delete("/:id", auth, isAdmin, deleteNotes);

// Student routes (Public - accessible after authentication)
router.get("/all", auth, getAllNotes);
router.get("/subjects", auth, getAllSubjects);
router.get("/subject/:subject", auth, getNotesBySubject);
router.get("/:id", auth, getNote);

module.exports = router;
