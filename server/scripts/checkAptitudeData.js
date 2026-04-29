const mongoose = require("mongoose");
require("dotenv").config();

const database = require("../config/database");
const Arithmetic = require("../models/Arithmetic");
const VerbalAbility = require("../models/VerbalAbility");
const LogicalReasoning = require("../models/LogicalReasoning");

const checkData = async () => {
  try {
    await database.connect();
    console.log("Connected to database\n");

    // Check document counts
    const arithmeticCount = await Arithmetic.countDocuments();
    const verbalCount = await VerbalAbility.countDocuments();
    const logicalCount = await LogicalReasoning.countDocuments();

    console.log("Document Counts:");
    console.log(`- Arithmetic: ${arithmeticCount}`);
    console.log(`- Verbal Ability: ${verbalCount}`);
    console.log(`- Logical Reasoning: ${logicalCount}`);
    console.log(`- Total: ${arithmeticCount + verbalCount + logicalCount}\n`);

    // Check collection names
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("Available Collections:");
    collections.forEach((col) => console.log(`- ${col.name}`));

    // Sample documents from each
    console.log("\n=== Sample Documents ===\n");

    if (arithmeticCount > 0) {
      const sampleArithmetic = await Arithmetic.findOne().limit(1);
      console.log("Arithmetic Sample:");
      console.log(JSON.stringify(sampleArithmetic, null, 2));
    } else {
      console.log("❌ No Arithmetic documents found");
    }

    console.log("\n---\n");

    if (verbalCount > 0) {
      const sampleVerbal = await VerbalAbility.findOne().limit(1);
      console.log("Verbal Ability Sample:");
      console.log(JSON.stringify(sampleVerbal, null, 2));
    } else {
      console.log("❌ No Verbal Ability documents found");
    }

    console.log("\n---\n");

    if (logicalCount > 0) {
      const sampleLogical = await LogicalReasoning.findOne().limit(1);
      console.log("Logical Reasoning Sample:");
      console.log(JSON.stringify(sampleLogical, null, 2));
    } else {
      console.log("❌ No Logical Reasoning documents found");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error checking data:", error);
    process.exit(1);
  }
};

checkData();
