const fs = require("fs");
const path = require("path");

// Read the current Arithmetic.json
const arithmeticData = require("../data/Aptitude/Arithmetic.json");

// Function to classify question topic based on content
const classifyTopic = (question, explanation) => {
  const q = question.toLowerCase();
  const e = explanation ? explanation.toLowerCase() : "";

  // Keywords mapping for accurate topic classification
  const keywords = {
    "divisibility": ["divisible", "divisor", "remainder", "factor", "hcf", "lcm"],
    "numbers": ["prime", "number", "digit", "even", "odd", "face value", "place value"],
    "sequences": ["series", "sum", "progression", "natural", "arithmetic", "geometric"],
    "arithmetic-operations": ["add", "subtract", "multiply", "divide", "+", "-", "x"],
    "fractions": ["fraction", "reciprocal", "numerator", "denominator"],
    "algebraic-expressions": ["expression", "equation", "formula", "algebra"],
  };

  let scores = {};
  for (let topic in keywords) {
    scores[topic] = 0;
    keywords[topic].forEach(keyword => {
      if (q.includes(keyword)) scores[topic]++;
      if (e.includes(keyword)) scores[topic]++;
    });
  }

  // Find topic with highest score
  let bestTopic = "Numbers";
  let maxScore = 0;
  for (let topic in scores) {
    if (scores[topic] > maxScore) {
      maxScore = scores[topic];
      bestTopic = topic.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  return maxScore > 0 ? bestTopic : "Numbers";
};

// Correct the data
const correctedData = arithmeticData.map((item, index) => {
  const topic = classifyTopic(item.question, item.explanation);
  
  return {
    category: "arithmetic", // Fixed category
    topic: topic,
    question: item.question,
    options: item.options,
    answer: item.answer,
    explanation: item.explanation || "",
    difficulty: item.difficulty || "medium",
    source: item.source || null,
  };
});

// Log changes
const changes = {
  total: arithmeticData.length,
  corrected: correctedData.filter((item, idx) => {
    const orig = arithmeticData[idx];
    return (orig.topic || orig.category) !== item.topic;
  }).length,
  topics: {},
};

correctedData.forEach(item => {
  if (!changes.topics[item.topic]) {
    changes.topics[item.topic] = 0;
  }
  changes.topics[item.topic]++;
});

console.log("\n✅ Topic Classification Summary:");
console.log(`Total Questions: ${changes.total}`);
console.log(`Corrected: ${changes.corrected}`);
console.log("\n📊 New Topic Distribution:");
Object.entries(changes.topics).forEach(([topic, count]) => {
  console.log(`  ${topic}: ${count} questions`);
});

// Save corrected data
const outputPath = path.join(__dirname, "../data/Aptitude/Arithmetic_corrected.json");
fs.writeFileSync(outputPath, JSON.stringify(correctedData, null, 2));

console.log(`\n✅ Corrected data saved to: server/data/Aptitude/Arithmetic_corrected.json`);
console.log("\nSample corrections:");
correctedData.slice(0, 5).forEach((item, idx) => {
  const original = arithmeticData[idx];
  if ((original.topic || original.category) !== item.topic) {
    console.log(`  Q${idx + 1}: "${item.question.substring(0, 50)}..."`);
    console.log(`    Old: ${original.topic || original.category}`);
    console.log(`    New: ${item.topic}\n`);
  }
});

module.exports = { correctedData, changes };
