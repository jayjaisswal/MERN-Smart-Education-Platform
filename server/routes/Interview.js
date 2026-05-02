const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  submitAnswer,
  getUserPerformance,
  getAllInterviewData,
  resetProgress,
  getLeaderboard,
} = require("../controllers/Interview");

// Public routes
router.get("/leaderboard", getLeaderboard);

// Protected routes (require authentication)
router.post("/submit", auth, submitAnswer);
router.get("/performance", auth, getUserPerformance);
router.get("/data", auth, getAllInterviewData);
router.delete("/reset", auth, resetProgress);

module.exports = router;
