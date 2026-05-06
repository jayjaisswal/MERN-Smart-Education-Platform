const express = require('express');
const router = express.Router();
const questionController = require('../controllers/ChemistryJeeMains');

// GET /api/questions/chapter/alcohols-phenols-and-ethers
router.get('/chapter/:chapterName', questionController.getQuestionsByChapter);

// GET /api/questions/q/1lh03g9az
router.get('/q/:id', questionController.getQuestionById);

module.exports = router;