const fs = require("fs");
const path = require("path");

// Shuffle array
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Read JSON files
const arithmeticPath = path.join(__dirname, "../data/Aptitude/Arithmetic.json");
const verbalPath = path.join(__dirname, "../data/Aptitude/verbal_ability.json");
const logicalPath = path.join(
  __dirname,
  "../data/Aptitude/logicalReasoning.json",
);

const arithmeticData = JSON.parse(fs.readFileSync(arithmeticPath, "utf8"));
const verbalData = JSON.parse(fs.readFileSync(verbalPath, "utf8"));
const logicalData = JSON.parse(fs.readFileSync(logicalPath, "utf8"));

// Get unique topics
const getTopics = (data) => [
  ...new Set(data.map((q) => q.category || q.topic)),
];

// Redistribute questions across topics with variable distribution
const redistributeQuestions = (data, topicList) => {
  const shuffled = shuffle(data);
  const result = [];
  const questionsPerTopic = Math.ceil(shuffled.length / topicList.length);
  let questionIndex = 0;

  // Assign questions to topics with variable distribution
  topicList.forEach((topic, idx) => {
    // Add variable number of questions (between 50-150% of average)
    const variance = idx % 3 === 0 ? 0.5 : idx % 3 === 1 ? 1.2 : 1;
    const count = Math.ceil(questionsPerTopic * variance);

    for (let i = 0; i < count && questionIndex < shuffled.length; i++) {
      const question = {
        ...shuffled[questionIndex],
        category: topic,
        topic: topic,
      };
      result.push(question);
      questionIndex++;
    }
  });

  // Add remaining questions to last topic
  while (questionIndex < shuffled.length) {
    const question = {
      ...shuffled[questionIndex],
      category: topicList[topicList.length - 1],
      topic: topicList[topicList.length - 1],
    };
    result.push(question);
    questionIndex++;
  }

  return result;
};

// Process each category
const arithmeticTopics = getTopics(arithmeticData);
const verbalTopics = getTopics(verbalData);
const logicalTopics = getTopics(logicalData);

const newArithmetic = redistributeQuestions(arithmeticData, arithmeticTopics);
const newVerbal = redistributeQuestions(verbalData, verbalTopics);
const newLogical = redistributeQuestions(logicalData, logicalTopics);

// Save redistributed data
fs.writeFileSync(arithmeticPath, JSON.stringify(newArithmetic, null, 2));
fs.writeFileSync(verbalPath, JSON.stringify(newVerbal, null, 2));
fs.writeFileSync(logicalPath, JSON.stringify(newLogical, null, 2));

console.log("✅ Questions redistributed with variable distribution!");
console.log("\n=== New Distribution ===\n");

// Show statistics
console.log("Arithmetic Topics:");
const arithmeticTopicStats = {};
newArithmetic.forEach((q) => {
  const topic = q.topic;
  arithmeticTopicStats[topic] = (arithmeticTopicStats[topic] || 0) + 1;
});
Object.entries(arithmeticTopicStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([topic, count]) => {
    console.log(`  ${topic}: ${count} questions`);
  });

console.log("\nVerbal Ability Topics:");
const verbalTopicStats = {};
newVerbal.forEach((q) => {
  const topic = q.topic;
  verbalTopicStats[topic] = (verbalTopicStats[topic] || 0) + 1;
});
Object.entries(verbalTopicStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([topic, count]) => {
    console.log(`  ${topic}: ${count} questions`);
  });

console.log("\nLogical Reasoning Topics:");
const logicalTopicStats = {};
newLogical.forEach((q) => {
  const topic = q.topic;
  logicalTopicStats[topic] = (logicalTopicStats[topic] || 0) + 1;
});
Object.entries(logicalTopicStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([topic, count]) => {
    console.log(`  ${topic}: ${count} questions`);
  });
