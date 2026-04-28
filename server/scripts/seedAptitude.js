const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const Aptitude = require("../models/Aptitude");
const database = require("../config/database");

// Import JSON data
const verbalAbilityData = require("../../SmartStudy/src/data/Aptitude/verbal_ability.json");
const arithmeticData = require("../../SmartStudy/src/data/Aptitude/Arithmetic.json");
const logicalReasoningData = require("../../SmartStudy/src/data/Aptitude/logicalReasoning.json");

// Map categories
const categoryMap = {
  verbal_ability: "verbal_ability",
  arithmetic: "arithmetic",
  logical_reasoning: "logical_reasoning",
};

// Format data
// Extract correct answer from explanation
const extractAnswerFromExplanation = (explanation, options) => {
  if (!explanation) return null;

  const explanationText = explanation.toLowerCase().trim();

  // Look for last option mention or value after "=" or "is"
  let answer = null;

  // Check each option to see if it appears in explanation
  for (let i = options.length - 1; i >= 0; i--) {
    const option = options[i];
    if (explanation.includes(option)) {
      answer = option;
      break;
    }
  }

  // If no option found, try to extract the final answer value
  if (!answer) {
    // Look for pattern after last "="
    const equalMatches = explanation.match(/=\s*([^=\n]+)/g);
    if (equalMatches) {
      const lastMatch = equalMatches[equalMatches.length - 1];
      const extracted = lastMatch.replace(/=\s*/, "").trim();
      // Check if extracted value matches any option
      for (let i = 0; i < options.length; i++) {
        if (options[i].includes(extracted) || extracted.includes(options[i])) {
          answer = options[i];
          break;
        }
      }
      if (!answer && extracted) {
        answer = extracted;
      }
    }
  }

  return answer;
};

const formatQuestion = (data, categoryName) => {
  // Skip if no question or options
  if (!data.question || !data.options || data.options.length === 0) {
    return null;
  }

  let category = categoryName;
  let topic = data.category || data.topic || "general";

  // Extract correct answer
  let correctAnswer = data.answer ? data.answer.trim() : "";
  if (!correctAnswer) {
    correctAnswer = extractAnswerFromExplanation(
      data.explanation,
      data.options,
    );
  }

  if (!correctAnswer) {
    return null; // Skip questions without answer
  }

  // Find correct option index
  let correctOption = 0;
  for (let i = 0; i < data.options.length; i++) {
    if (
      data.options[i].includes(correctAnswer) ||
      correctAnswer.includes(data.options[i])
    ) {
      correctOption = i;
      break;
    }
  }

  return {
    category: category,
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

    // Clear existing data
    await Aptitude.deleteMany({});
    console.log("Cleared existing aptitude questions");

    // Format and prepare questions - filter out null values
    const allQuestions = [
      ...verbalAbilityData
        .map((q) => formatQuestion(q, "verbal_ability"))
        .filter((q) => q !== null),
      ...arithmeticData
        .map((q) => formatQuestion(q, "arithmetic"))
        .filter((q) => q !== null),
      ...logicalReasoningData
        .map((q) => formatQuestion(q, "logical_reasoning"))
        .filter((q) => q !== null),
    ];

    console.log(`Preparing to insert ${allQuestions.length} questions...`);

    if (allQuestions.length === 0) {
      console.log("No valid questions to insert!");
      mongoose.connection.close();
      process.exit(1);
    }

    // Insert questions
    const result = await Aptitude.insertMany(allQuestions);
    console.log(`Successfully inserted ${result.length} questions`);

    // Log statistics
    const categories = await Aptitude.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    console.log("\n=== Category Statistics ===");
    categories.forEach((cat) => {
      console.log(`${cat._id}: ${cat.count} questions`);
    });

    // Log topics per category
    const topicStats = await Aptitude.aggregate([
      {
        $group: {
          _id: { category: "$category", topic: "$topic" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.category": 1, "_id.topic": 1 },
      },
    ]);

    console.log("\n=== Topics Per Category ===");
    let currentCategory = null;
    topicStats.forEach((stat) => {
      if (stat._id.category !== currentCategory) {
        currentCategory = stat._id.category;
        console.log(`\n${currentCategory}:`);
      }
      console.log(`  - ${stat._id.topic}: ${stat.count} questions`);
    });

    mongoose.connection.close();
    console.log("\n✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
