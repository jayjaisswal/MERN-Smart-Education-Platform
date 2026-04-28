const express = require("express");
const router = express.Router();
const {
  createAptitudeQuestions,
  getAllCategories,
  getQuestionsByCategory,
  submitAnswer,
  getUserPerformance,
  getQuestionDetails,
} = require("../controllers/Aptitude");
const { auth } = require("../middlewares/auth");

// Public routes
router.get("/categories", getAllCategories);
router.get("/questions", getQuestionsByCategory);
router.get("/question/:id", getQuestionDetails);

// Protected routes (require authentication)
router.post("/submit", auth, submitAnswer);
router.get("/performance", auth, getUserPerformance);

// Admin routes - to seed data
router.post("/create", auth, createAptitudeQuestions);

module.exports = router;
