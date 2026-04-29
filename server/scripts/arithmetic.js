const mongoose = require("mongoose");
const fs = require("fs");
const Arithmetic = require("../models/Arithmetic"); // Check path

const MONGO_URI = "mongodb+srv://studyOnline:xTjAHm5vzfFaqhAh@studyonline.cpis2j7.mongodb.net/StudyOnline";
const FILE_PATH = "..data/Aptitude/Arithmetic.json";

async function importData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    // 1. Read the file
    const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
    
    console.log(`Starting import of ${data.length} records...`);

    // 2. Insert in chunks (batches of 1000) for better performance
    const chunkSize = 1000;
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      await Arithmetic.insertMany(chunk, { ordered: false });
      console.log(`Progress: ${i + chunk.length} / ${data.length} uploaded`);
    }

    console.log("Import complete! Success.");
    process.exit();
  } catch (error) {
    console.error("Error during import:", error);
    process.exit(1);
  }
}

importData();