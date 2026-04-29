const mongoose = require("mongoose");
require("dotenv").config();

const Arithmetic = require("../models/Arithmetic");
const VerbalAbility = require("../models/VerbalAbility");
const LogicalReasoning = require("../models/LogicalReasoning");

const cleanupDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected to MongoDB");

    // Cleanup function
    const cleanupModel = async (Model, modelName) => {
      console.log(`\n🔧 Cleaning ${modelName}...`);
      const questions = await Model.find({});
      console.log(`   Found ${questions.length} records`);

      let fixed = 0;
      let updated = [];

      for (let q of questions) {
        let hasIssue = false;

        // Ensure correctOption is a number and within bounds
        if (!Number.isInteger(q.correctOption) || q.correctOption < 0 || q.correctOption >= q.options.length) {
          // Try to infer from options if available
          if (Array.isArray(q.options) && q.options.length > 0) {
            q.correctOption = 0; // Default to first option if invalid
            hasIssue = true;
          }
        }

        // Ensure topic is a valid string
        if (!q.topic || typeof q.topic !== "string") {
          q.topic = "General";
          hasIssue = true;
        }

        // Ensure options is an array with valid strings
        if (!Array.isArray(q.options) || q.options.length === 0) {
          console.log(`   ⚠️  Q: "${q.question.substring(0, 50)}..." has no options`);
          continue;
        }

        // Ensure explanation exists
        if (!q.explanation || typeof q.explanation !== "string") {
          q.explanation = "No explanation available";
          hasIssue = true;
        }

        if (hasIssue) {
          await Model.findByIdAndUpdate(q._id, {
            correctOption: q.correctOption,
            topic: q.topic,
            explanation: q.explanation,
          });
          fixed++;
          updated.push({
            question: q.question.substring(0, 50),
            correctOption: q.correctOption,
            topic: q.topic,
          });
        }
      }

      console.log(`   ✅ Fixed ${fixed} records in ${modelName}`);
      if (fixed > 0) {
        console.log(`\n   First 3 fixes:`);
        updated.slice(0, 3).forEach((u) => {
          console.log(`     - "${u.question}..." → Option: ${u.correctOption}, Topic: ${u.topic}`);
        });
      }

      return fixed;
    };

    const arithmeticFixed = await cleanupModel(Arithmetic, "Arithmetic");
    const verbalFixed = await cleanupModel(VerbalAbility, "VerbalAbility");
    const logicalFixed = await cleanupModel(LogicalReasoning, "LogicalReasoning");

    const totalFixed = arithmeticFixed + verbalFixed + logicalFixed;

    console.log(`\n✨ Cleanup complete! Fixed ${totalFixed} records total`);

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

cleanupDatabase();
