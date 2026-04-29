const axios = require("axios");

const BASE_URL = "http://localhost:4000/api/v1";

const testAPI = async () => {
  try {
    console.log("Testing Aptitude API Endpoints\n");

    // Test 1: Get Categories
    console.log("1️⃣  Testing GET /aptitude/categories");
    const categoriesResponse = await axios.get(
      `${BASE_URL}/aptitude/categories`,
    );
    console.log("✅ Categories Response:");
    console.log(JSON.stringify(categoriesResponse.data, null, 2));

    // Test 2: Get Questions for Arithmetic
    console.log(
      "\n2️⃣  Testing GET /aptitude/questions?category=arithmetic&page=1&limit=5",
    );
    const questionsResponse = await axios.get(
      `${BASE_URL}/aptitude/questions?category=arithmetic&page=1&limit=5`,
    );
    console.log("✅ Questions Response:");
    console.log(`
- Success: ${questionsResponse.data.success}
- Total Questions: ${questionsResponse.data.pagination.totalQuestions}
- Current Page: ${questionsResponse.data.pagination.currentPage}
- Questions Count: ${questionsResponse.data.data.length}
- First Question: ${questionsResponse.data.data[0]?.question?.substring(0, 50)}...`);

    // Test 3: Get Questions for Verbal Ability
    console.log(
      "\n3️⃣  Testing GET /aptitude/questions?category=verbal_ability&page=1&limit=5",
    );
    const verbalResponse = await axios.get(
      `${BASE_URL}/aptitude/questions?category=verbal_ability&page=1&limit=5`,
    );
    console.log("✅ Verbal Ability Response:");
    console.log(`
- Success: ${verbalResponse.data.success}
- Total Questions: ${verbalResponse.data.pagination.totalQuestions}
- Questions Count: ${verbalResponse.data.data.length}`);

    // Test 4: Get Questions for Logical Reasoning
    console.log(
      "\n4️⃣  Testing GET /aptitude/questions?category=logical_reasoning&page=1&limit=5",
    );
    const logicalResponse = await axios.get(
      `${BASE_URL}/aptitude/questions?category=logical_reasoning&page=1&limit=5`,
    );
    console.log("✅ Logical Reasoning Response:");
    console.log(`
- Success: ${logicalResponse.data.success}
- Total Questions: ${logicalResponse.data.pagination.totalQuestions}
- Questions Count: ${logicalResponse.data.data.length}`);

    console.log("\n✅ All API endpoints are working correctly!");
    process.exit(0);
  } catch (error) {
    console.error("❌ API Test Error:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
    }
    process.exit(1);
  }
};

// Wait for server to be ready
setTimeout(() => {
  testAPI();
}, 2000);
