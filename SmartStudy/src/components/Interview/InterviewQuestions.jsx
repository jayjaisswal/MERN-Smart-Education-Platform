import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Import interview data from local files
import dbmsMCQ from "../../data/interview/dbms-mcq.json";
import dbmsTheory from "../../data/interview/dbms-theory.json";
import cnMCQ from "../../data/interview/cn-mcq.json";

// Import InterviewQA component for Q&A topic
import InterviewQA from "./components/InterviewQA";

// Map of category and topic to data
const interviewData = {
  dbms: {
    "interview-qa": dbmsTheory,
    "multiple-choice": dbmsMCQ,
    "sql-queries": generateSQLQuestions(),
    deadlock: generateDeadlockQuestions(),
    locking: generateLockingQuestions(),
  },
  "computer-networking": {
    "interview-qa": generateCNTheoryQuestions(),
    "multiple-choice": cnMCQ,
    "osi-model": generateOSIQuestions(),
  },
};

// Generate sample questions for topics without data files
function generateSQLQuestions() {
  const sqlQuestions = [
    {
      id: 1,
      question: "Find the second highest salary from the Employee table.",
      answer: "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
      explanation: "Using subquery to find the second highest salary"
    },
    {
      id: 2,
      question: "Find employees with duplicate salaries.",
      answer: "SELECT salary FROM Employee GROUP BY salary HAVING COUNT(*) > 1;",
      explanation: "GROUP BY with HAVING clause to find duplicates"
    },
    {
      id: 3,
      question: "Fetch employees who belong to IT department.",
      answer: "SELECT * FROM Employee WHERE department = 'IT';",
      explanation: "Basic WHERE clause filtering"
    },
    {
      id: 4,
      question: "Find the average salary of employees.",
      answer: "SELECT AVG(salary) AS avg_salary FROM Employee;",
      explanation: "Using AVG aggregate function"
    },
    {
      id: 5,
      question: "Find employee(s) earning the highest salary.",
      answer: "SELECT * FROM Employee WHERE salary = (SELECT MAX(salary) FROM Employee);",
      explanation: "Subquery with MAX function"
    }
  ];
  return sqlQuestions;
}

function generateDeadlockQuestions() {
  return [
    {
      id: 1,
      question: "What is a deadlock in DBMS?",
      options: ["Transaction timeout", "Circular wait condition", "Network failure", "Index failure"],
      answer: "Circular wait condition",
      explanation: "Deadlock occurs when two or more transactions wait indefinitely for each other to release resources."
    },
    {
      id: 2,
      question: "How many necessary conditions cause a deadlock?",
      options: ["1", "2", "3", "4"],
      answer: "4",
      explanation: "Four conditions: Mutual exclusion, Hold and wait, No preemption, Circular wait."
    },
    {
      id: 3,
      question: "Which technique is used to prevent deadlock?",
      options: ["Lock ordering", "Indexing", "Denormalization", "View creation"],
      answer: "Lock ordering",
      explanation: "Consistent lock ordering prevents circular wait condition."
    }
  ];
}

function generateLockingQuestions() {
  return [
    {
      id: 1,
      question: "Which lock allows multiple transactions to read the same data?",
      options: ["Exclusive lock", "Shared lock", "Binary lock", "Intent lock"],
      answer: "Shared lock",
      explanation: "Shared locks allow concurrent read access but block writes."
    },
    {
      id: 2,
      question: "Which lock prevents both read and write?",
      options: ["Shared lock", "Exclusive lock", "Read lock", "None"],
      answer: "Exclusive lock",
      explanation: "Exclusive locks prevent any other access to the data."
    }
  ];
}

function generateCNTheoryQuestions() {
  return [
    {
      id: 1,
      question: "Explain the OSI model layers from top to bottom.",
      answer: "Application → Presentation → Session → Transport → Network → Data Link → Physical",
      explanation: "Remember: All People Seem To Need Data Processing"
    },
    {
      id: 2,
      question: "What is the difference between TCP and UDP?",
      answer: "TCP is connection-oriented and reliable, UDP is connectionless and faster but unreliable.",
      explanation: "TCP ensures delivery with acknowledgments, UDP does not."
    }
  ];
}

function generateOSIQuestions() {
  return [
    {
      id: 1,
      question: "Which layer handlesRouting?",
      options: ["Data Link", "Network", "Transport", "Application"],
      answer: "Network",
      explanation: "The Network layer handles logical addressing and routing."
    },
    {
      id: 2,
      question: "Which layer is responsible for encryption?",
      options: ["Session", "Presentation", "Application", "Transport"],
      answer: "Presentation",
      explanation: "The Presentation layer handles encryption, compression, and data formatting."
    }
  ];
}

// Color schemes for different topics
const topicColors = {
  dbms: "from-blue-500 to-cyan-500",
  "computer-networking": "from-green-500 to-emerald-500",
  "operating-system": "from-purple-500 to-violet-500",
  sdlc: "from-orange-500 to-amber-500",
  oops: "from-pink-500 to-rose-500",
  cpp: "from-indigo-500 to-blue-500",
  python: "from-yellow-500 to-green-500",
  numpy: "from-teal-500 to-cyan-500",
  pandas: "from-red-500 to-pink-500",
  "machine-learning": "from-cyan-500 to-blue-500",
};

export default function InterviewQuestions() {
  const { category, topic } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 5;

  // Calculate pagination values
  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);

  useEffect(() => {
    setLoading(true);
    // Load questions based on category and topic
    const categoryData = interviewData[category];

    if (categoryData && categoryData[topic]) {
      setQuestions(categoryData[topic]);
    } else {
      // Generate sample questions for topics without data
      setQuestions(generateSampleQuestions(category, topic));
    }

    setLoading(false);
    // Reset state
    setCurrentPage(0);
    setSelectedAnswers({});
    setRevealedAnswers({});
    setScore(0);
    setQuizComplete(false);
  }, [category, topic]);

  const generateSampleQuestions = (cat, top) => {
    // Generate placeholder questions for topics without data
    const sampleQuestions = [];
    for (let i = 1; i <= 10; i++) {
      sampleQuestions.push({
        id: i,
        question: `Sample question ${i} for ${cat} - ${top}`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: "Option A",
        explanation: "This is a sample explanation for the answer.",
      });
    }
    return sampleQuestions;
  };

  // Handle option click - immediately show right/wrong
  const handleOptionClick = (questionIndex, option) => {
    const actualIndex = startIndex + questionIndex;
    const currentQ = questions[actualIndex];
    
    if (revealedAnswers[actualIndex] !== undefined) return; // Already revealed

    const isCorrect = option === currentQ.answer;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [actualIndex]: option
    }));
    
    setRevealedAnswers(prev => ({
      ...prev,
      [actualIndex]: isCorrect
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentPage(0);
    setSelectedAnswers({});
    setRevealedAnswers({});
    setScore(0);
    setQuizComplete(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Reset answers for new page if needed
    setSelectedAnswers({});
    setRevealedAnswers({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-richblack-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-richblack-900 flex justify-center items-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Questions Yet</h2>
          <p className="text-richblack-300 mb-6">Questions for this topic are coming soon</p>
          <button
            onClick={() => navigate(`/interview/${category}`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-richblack-900 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-richblack-800 rounded-xl p-8 border border-richblack-700">
            <div className="text-6xl mb-4">
              {percentage >= 70 ? "🎉" : percentage >= 50 ? "👍" : "💪"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
            <div className="text-5xl font-bold text-white mb-2">{percentage}%</div>
            <p className="text-richblack-300 mb-2">
              You scored {score} out of {questions.length}
            </p>
            <p className="text-richblack-400 mb-6">
              {percentage >= 70
                ? "Great job! You've mastered this topic!"
                : percentage >= 50
                  ? "Good effort! Keep practicing!"
                  : "Keep learning! You'll improve!"}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate(`/interview/${category}`)}
                className="bg-richblack-700 text-white px-6 py-2 rounded-lg hover:bg-richblack-600"
              >
                Back to Topics
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const colorScheme = topicColors[category] || "from-blue-500 to-cyan-500";

  // If topic is "interview-qa", render InterviewQA component (article-style Q&A reader)
  if (topic === "interview-qa") {
    return (
      <div className="min-h-screen bg-richblack-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate(`/interview/${category}`)}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-4"
            >
              ← Back to {category?.replace("-", " ")} Topics
            </button>
            <h1 className="text-2xl font-bold text-white">
              Interview Q&A - {category?.replace("-", " ")}
            </h1>
            <p className="text-richblack-300">Read and understand interview questions and answers</p>
          </div>

          {/* Render InterviewQA component */}
          <InterviewQA
            questions={questions}
            onAnswerSave={() => { }}
            categoryColor={colorScheme}
          />
        </div>
      </div>
    );
  }

// Otherwise, render quiz interface for MCQ practice with pagination
  return (
    <div className="min-h-screen bg-richblack-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/interview/${category}`)}
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-4"
          >
            ← Back to Topics
          </button>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white capitalize">
              {category?.replace("-", " ")}
            </h1>
            <div className="text-richblack-400">
              Page {currentPage + 1} of {totalPages}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-richblack-700 rounded-full h-2 mt-4">
            <div
              className={`bg-gradient-to-r ${colorScheme} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Questions - Show 5 per page */}
        <div className="space-y-4 mb-6">
          {currentQuestions.map((currentQ, questionIndex) => {
            const actualIndex = startIndex + questionIndex;
            const isRevealed = revealedAnswers[actualIndex] !== undefined;
            const selectedOption = selectedAnswers[actualIndex];

            return (
              <div key={actualIndex} className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
                <div className={`text-sm font-semibold bg-gradient-to-r ${colorScheme} bg-clip-text text-transparent mb-4`}>
                  Question {actualIndex + 1}
                </div>
                <h2 className="text-xl text-white font-semibold mb-4">
                  {currentQ.question}
                </h2>

                {/* Options */}
                {currentQ.options && Array.isArray(currentQ.options) ? (
                  <div className="space-y-3">
                    {currentQ.options.map((option, optIndex) => {
                      let optionClass = "bg-richblack-700 ";

                      if (isRevealed) {
                        if (option === currentQ.answer) {
                          optionClass = "bg-green-900 border-2 border-green-500 ";
                        } else if (option === selectedOption) {
                          optionClass = "bg-red-900 border-2 border-red-500 ";
                        }
                      } else if (selectedOption === option) {
                        optionClass = "bg-blue-900 border-2 border-blue-500 ";
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleOptionClick(questionIndex, option)}
                          disabled={isRevealed}
                          className={`w-full text-left p-4 rounded-lg transition-all ${optionClass} hover:border-blue-400 text-white`}
                        >
                          <span className="font-semibold mr-3">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                ) : currentQ.options ? (
                  // Handle object options (like in CN_multipleChoice.json)
                  <div className="space-y-3">
                    {Object.entries(currentQ.options).map(([key, value]) => {
                      let optionClass = "bg-richblack-700 ";

                      if (isRevealed) {
                        if (key === currentQ.answer) {
                          optionClass = "bg-green-900 border-2 border-green-500 ";
                        } else if (key === selectedOption) {
                          optionClass = "bg-red-900 border-2 border-red-500 ";
                        }
                      } else if (selectedOption === key) {
                        optionClass = "bg-blue-900 border-2 border-blue-500 ";
                      }

                      return (
                        <button
                          key={key}
                          onClick={() => handleOptionClick(questionIndex, key)}
                          disabled={isRevealed}
                          className={`w-full text-left p-4 rounded-lg transition-all ${optionClass} hover:border-blue-400 text-white`}
                        >
                          <span className="font-semibold mr-3">{key}.</span>
                          {value}
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {/* Explanation - Show after answering */}
                {isRevealed && currentQ.explanation && (
                  <div className="mt-4 pt-4 border-t border-richblack-700">
                    <h4 className="text-green-400 font-semibold mb-2">
                      {revealedAnswers[actualIndex] ? "✓ Correct!" : "✗ Incorrect"}
                    </h4>
                    <p className="text-richblack-300">{currentQ.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentPage === i
                  ? `bg-gradient-to-r ${colorScheme} text-white`
                  : "bg-richblack-700 text-white hover:bg-richblack-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className={`px-6 py-3 rounded-lg font-semibold bg-gradient-to-r ${colorScheme} text-white`}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
