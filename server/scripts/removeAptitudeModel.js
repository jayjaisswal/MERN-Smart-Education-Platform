const mongoose = require("mongoose");
require("dotenv").config();

const database = require("../config/database");

const removeAptitudeModel = async () => {
  try {
    await database.connect();
    console.log("Connected to database");

    // Drop the Aptitude collection if it exists
    try {
      await mongoose.connection.collection("aptitudes").drop();
      console.log("✅ Dropped 'aptitudes' collection from database");
    } catch (error) {
      if (error.message.includes("ns not found")) {
        console.log("ℹ️  'aptitudes' collection does not exist");
      } else {
        throw error;
      }
    }

    console.log("\n✅ Aptitude model successfully removed from database!");
    console.log(
      "   All 3 separate models (Arithmetic, VerbalAbility, LogicalReasoning) remain intact.",
    );

    process.exit(0);
  } catch (error) {
    console.error("Error removing Aptitude model:", error);
    process.exit(1);
  }
};

removeAptitudeModel();
