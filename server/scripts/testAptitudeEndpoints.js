const mongoose = require("mongoose");
require("dotenv").config();

const database = require("../config/database");
const Arithmetic = require("../models/Arithmetic");
const VerbalAbility = require("../models/VerbalAbility");
const LogicalReasoning = require("../models/LogicalReasoning");

const testEndpoints = async () => {
  try {
    await database.connect();
    console.log("Connected to database\n");

    // Test getAllCategories equivalent
    console.log("=== Testing getAllCategories ===\n");

    const categoryDetails = await Promise.all([
      (async () => {
        const count = await Arithmetic.countDocuments();
        const topics = await Arithmetic.distinct("topic");
        return {
          name: "arithmetic",
          displayName: "Arithmetic",
          count,
          topics,
        };
      })(),
      (async () => {
        const count = await VerbalAbility.countDocuments();
        const topics = await VerbalAbility.distinct("topic");
        return {
          name: "verbal_ability",
          displayName: "Verbal Ability",
          count,
          topics,
        };
      })(),
      (async () => {
        const count = await LogicalReasoning.countDocuments();
        const topics = await LogicalReasoning.distinct("topic");
        return {
          name: "logical_reasoning",
          displayName: "Logical Reasoning",
          count,
          topics,
        };
      })(),
    ]);

    console.log(JSON.stringify(categoryDetails, null, 2));

    // Test getQuestionsByCategory for each category
    console.log("\n=== Testing getQuestionsByCategory ===\n");

    for (const cat of categoryDetails) {
      const Model =
        cat.name === "arithmetic"
          ? Arithmetic
          : cat.name === "verbal_ability"
            ? VerbalAbility
            : LogicalReasoning;

      const questions = await Model.find()
        .skip(0)
        .limit(2)
        .select("-correctOption");

      console.log(`\n${cat.displayName} (first 2 questions):`);
      console.log(JSON.stringify(questions, null, 2).substring(0, 500));
    }

    process.exit(0);
  } catch (error) {
    console.error("Error testing endpoints:", error);
    process.exit(1);
  }
};

testEndpoints();
