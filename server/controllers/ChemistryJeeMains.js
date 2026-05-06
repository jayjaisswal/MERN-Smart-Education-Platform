const Question = require('../models/chemistryJeeMains');

exports.getQuestionsByChapter = async (req, res) => {
  try {
    const { chapterName } = req.params;
    const questions = await Question.find({ chapter: chapterName });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findOne({ question_id: req.params.id });
    if (!question) return res.status(404).json({ message: "Not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};