const fs = require("fs");
const path = require("path");

// Read the Arithmetic.json file
const arithmeticPath = path.join(
  __dirname,
  "../data/Aptitude/Arithmetic.json"
);
const data = JSON.parse(fs.readFileSync(arithmeticPath, "utf8"));

// Function to determine topic based on question content
function detectTopic(question, explanation) {
  const q = question.toLowerCase();
  const e = explanation.toLowerCase();

  // Check for specific keywords
  if (
    q.includes("prime") ||
    q.includes("divisible") ||
    q.includes("factor") ||
    q.includes("hcf") ||
    q.includes("lcm") ||
    q.includes("remainder") ||
    q.includes("quotient") ||
    q.includes("digit")
  ) {
    return "Numbers";
  }

  if (
    q.includes("series") ||
    q.includes("sum") ||
    q.includes("natural number") ||
    q.includes("progression") ||
    (q.includes("+") && q.includes("..."))
  ) {
    return "Series";
  }

  if (
    q.includes("x") ||
    q.includes("multiply") ||
    q.includes("calculate") ||
    q.includes("?") ||
    q.includes("common factor") ||
    q.includes("algebraic")
  ) {
    return "Simplification";
  }

  // Default
  return "Numbers";
}

// Function to convert answer letter to number
function convertAnswerToNumber(answer) {
  const map = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
  };
  return map[answer] || 0;
}

// Function to verify answer matches option
function verifyAnswer(options, answer) {
  const ansNum = convertAnswerToNumber(answer);
  if (ansNum >= options.length) {
    console.warn(`Answer ${answer} (${ansNum}) exceeds options length ${options.length}`);
    return 0; // Default to first option if mismatch
  }
  return ansNum;
}

// Process and fix the data
const fixedData = data.map((item, index) => {
  const topic = detectTopic(item.question, item.explanation);
  const correctOption = verifyAnswer(item.options, item.answer);

  // Debug info for mismatches
  if (convertAnswerToNumber(item.answer) !== correctOption) {
    console.log(
      `[Q${index + 1}] Answer mismatch - Original: ${item.answer} (${convertAnswerToNumber(
        item.answer
      )}), Verified: ${correctOption}`
    );
  }

  return {
    category: topic,
    topic: topic,
    question: item.question,
    options: item.options,
    answer: item.answer,
    correctOption: correctOption,
    explanation: item.explanation,
    difficulty: item.difficulty || "medium",
    source: item.source || null,
  };
});

// Write back the fixed data
fs.writeFileSync(arithmeticPath, JSON.stringify(fixedData, null, 2), "utf8");
console.log(`\n✅ Fixed ${fixedData.length} questions in Arithmetic.json`);
console.log(
  "\nTopic Distribution:"
);
const topicCount = {};
fixedData.forEach((q) => {
  topicCount[q.topic] = (topicCount[q.topic] || 0) + 1;
});
Object.entries(topicCount).forEach(([topic, count]) => {
  console.log(`  - ${topic}: ${count} questions`);
});
