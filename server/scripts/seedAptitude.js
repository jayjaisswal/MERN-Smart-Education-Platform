const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const Arithmetic = require("../models/Arithmetic");
const VerbalAbility = require("../models/VerbalAbility");
const LogicalReasoning = require("../models/LogicalReasoning");
const database = require("../config/database");

// Import JSON data
const verbalAbilityData = require("../data/Aptitude/verbal_ability.json");
const arithmeticData = require("../data/Aptitude/Arithmetic.json");
const logicalReasoningData = require("../data/Aptitude/logicalReasoning.json");

// Map categories
const categoryMap = {
  verbal_ability: "verbal_ability",
  arithmetic: "arithmetic",
  logical_reasoning: "logical_reasoning",
};

// Format data
// Convert letter answer (A, B, C, D) to index
const letterToIndex = (letter) => {
  const mapping = { A: 0, B: 1, C: 2, D: 3, E: 4 };
  return mapping[letter.toUpperCase()] !== undefined
    ? mapping[letter.toUpperCase()]
    : 0;
};

const formatQuestion = (data) => {
  // Skip if no question or options
  if (!data.question || !data.options || data.options.length === 0) {
    return null;
  }

  let topic = data.category || data.topic || "general";

  // Convert answer from letter to index
  let correctOption = 0;
  if (data.answer) {
    correctOption = letterToIndex(data.answer);
  }

  return {
    topic: topic,
    question: data.question,
    options: data.options,
    correctOption: correctOption,
    explanation: data.explanation || "",
    difficulty: data.difficulty || "medium",
  };
};

const seedDatabase = async () => {
  try {
    await database.connect();
    console.log("Connected to database");

    // Clear existing data from all models
    await Promise.all([
      Arithmetic.deleteMany({}),
      VerbalAbility.deleteMany({}),
      LogicalReasoning.deleteMany({}),
    ]);
    console.log("Cleared existing aptitude questions from all models");

    // Format and prepare questions by category
    const verbalAbilityQuestions = verbalAbilityData
      .map((q) => formatQuestion(q))
      .filter((q) => q !== null);

    const arithmeticQuestions = arithmeticData
      .map((q) => formatQuestion(q))
      .filter((q) => q !== null);

    const logicalReasoningQuestions = logicalReasoningData
      .map((q) => formatQuestion(q))
      .filter((q) => q !== null);

    // Remove duplicates and organize by topic with variable distribution
    const organizeByTopic = (questions) => {
      const topicGroups = {};
      const seen = new Set();

      questions.forEach((q) => {
        const key = `${q.topic}|${q.question}|${q.options.join("|")}`;
        if (!seen.has(key)) {
          seen.add(key);
          if (!topicGroups[q.topic]) {
            topicGroups[q.topic] = [];
          }
          topicGroups[q.topic].push(q);
        }
      });

      return topicGroups;
    };

    const verbalTopicGroups = organizeByTopic(verbalAbilityQuestions);
    const arithmeticTopicGroups = organizeByTopic(arithmeticQuestions);
    const logicalTopicGroups = organizeByTopic(logicalReasoningQuestions);

    // Flatten back to arrays
    const uniqueVerbalAbility = Object.values(verbalTopicGroups).flat();
    const uniqueArithmetic = Object.values(arithmeticTopicGroups).flat();
    const uniqueLogicalReasoning = Object.values(logicalTopicGroups).flat();

    console.log(
      `\nFormatting Statistics:
- Verbal Ability: ${verbalAbilityQuestions.length} → ${uniqueVerbalAbility.length} (after deduplication)
- Arithmetic: ${arithmeticQuestions.length} → ${uniqueArithmetic.length} (after deduplication)
- Logical Reasoning: ${logicalReasoningQuestions.length} → ${uniqueLogicalReasoning.length} (after deduplication)`,
    );

    // Insert questions into respective models
    const [verbalResult, arithmeticResult, logicalResult] = await Promise.all([
      VerbalAbility.insertMany(uniqueVerbalAbility),
      Arithmetic.insertMany(uniqueArithmetic),
      LogicalReasoning.insertMany(uniqueLogicalReasoning),
    ]);

    const totalInserted =
      verbalResult.length + arithmeticResult.length + logicalResult.length;

    console.log(`\nSuccessfully inserted ${totalInserted} questions total:
- Verbal Ability: ${verbalResult.length} questions
- Arithmetic: ${arithmeticResult.length} questions
- Logical Reasoning: ${logicalResult.length} questions`);

    // Get statistics from all models
    const verbalTopics = await VerbalAbility.aggregate([
      {
        $group: {
          _id: "$topic",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const arithmeticTopics = await Arithmetic.aggregate([
      {
        $group: {
          _id: "$topic",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const logicalTopics = await LogicalReasoning.aggregate([
      {
        $group: {
          _id: "$topic",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    console.log("\n=== Topics Per Category ===");

    console.log(`\narithmetic: ${uniqueArithmetic.length} questions`);
    arithmeticTopics.forEach((topic) => {
      console.log(`  - ${topic._id}: ${topic.count} questions`);
    });

    console.log(
      `\nlogical_reasoning: ${uniqueLogicalReasoning.length} questions`,
    );
    logicalTopics.forEach((topic) => {
      console.log(`  - ${topic._id}: ${topic.count} questions`);
    });

    console.log(`\nverbal_ability: ${uniqueVerbalAbility.length} questions`);
    verbalTopics.forEach((topic) => {
      console.log(`  - ${topic._id}: ${topic.count} questions`);
    });

    mongoose.connection.close();
    console.log(
      "\n✅ Database seeding completed successfully with 3 separate models!",
    );
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
