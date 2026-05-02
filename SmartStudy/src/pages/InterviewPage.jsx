import React, { useState, useEffect, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { InterviewQA, InterviewMCQ, InterviewQuiz } from "../components/Interview/components";
import { submitInterviewAnswer, resetInterviewProgress } from "../services/operations/interviewAPI";
import { toast } from "react-hot-toast";

// Import actual JSON data files
import dbmsMCQ from "../data/interview/dbms-mcq.json";
import dbmsTheory from "../data/interview/dbms-theory.json";
import numpyMCQ from "../data/interview/ML/numpy-mcq.json";
import pandasMCQ from "../data/interview/ML/pandas-mcq.json";
import pythonMCQ from "../data/interview/Programming/python-mcq.json";
import tcsMCQ from "../data/interview/IT-Companywise/tcs-mcq.json";
import iitJeePhysics from "../data/interview/IIT-JEE/physics-pyq.json";
import neetPhysics from "../data/interview/NEET/physics-pyq.json";

// Map categories to topics with their data files
const dataMap = {
dbms: {
    title: "DBMS (Database Management System)",
    icon: "🗄️",
    color: "from-blue-500 to-cyan-500",
    topics: [
      { id: "mcq", title: "DBMS MCQ", data: dbmsMCQ },
      { id: "theory", title: "DBMS Theory & QA", data: dbmsTheory },
    ],
  },
  "it-interview": {
    title: "IT Interview Prep",
    icon: "💾",
    color: "from-blue-500 to-cyan-500",
    topics: [
      { id: "dbms", title: "DBMS", data: dbmsMCQ },
      { id: "dbms-qa", title: "DBMS Q&A", data: dbmsTheory },
    ],
  },
  "machine-learning": {
    title: "Machine Learning & AI",
    icon: "🤖",
    color: "from-cyan-500 to-blue-500",
    topics: [
      { id: "numpy", title: "NumPy", data: numpyMCQ },
      { id: "pandas", title: "Pandas", data: pandasMCQ },
      { id: "ml-basics", title: "ML Basics", data: dbmsMCQ },
    ],
  },
  python: {
    title: "Programming Languages",
    icon: "🐍",
    color: "from-yellow-500 to-green-500",
    topics: [
      { id: "python", title: "Python", data: pythonMCQ },
      { id: "java", title: "Java", data: dbmsMCQ },
      { id: "cpp", title: "C++", data: dbmsMCQ },
      { id: "javascript", title: "JavaScript", data: dbmsMCQ },
    ],
  },
  "it-companywise": {
    title: "IT Company Wise",
    icon: "🏢",
    color: "from-purple-500 to-pink-500",
    topics: [
      { id: "tcs", title: "TCS", data: tcsMCQ },
      { id: "infosys", title: "Infosys", data: dbmsMCQ },
      { id: "wipro", title: "Wipro", data: dbmsMCQ },
      { id: "accenture", title: "Accenture", data: dbmsMCQ },
      { id: "capgemini", title: "Capgemini", data: dbmsMCQ },
    ],
  },
  "iit-jee": {
    title: "IIT JEE PYQ",
    icon: "📚",
    color: "from-orange-500 to-red-500",
    topics: [
      { id: "physics", title: "Physics", data: iitJeePhysics },
      { id: "chemistry", title: "Chemistry", data: dbmsMCQ },
      { id: "mathematics", title: "Mathematics", data: dbmsMCQ },
    ],
  },
neet: {
    title: "NEET PYQ",
    icon: "🏥",
    color: "from-red-500 to-pink-500",
    topics: [
      { id: "physics", title: "Physics", data: neetPhysics },
      { id: "chemistry", title: "Chemistry", data: dbmsMCQ },
      { id: "biology", title: "Biology", data: dbmsMCQ },
    ],
  },
};

// Fallback data for categories without JSON files
const fallbackData = {
  mcq: dbmsMCQ.slice(0, 50),
  "interview-qa": dbmsTheory.slice(0, 30),
};

export default function InterviewPage() {
  const { category, topic, type } = useParams();
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.profile);

  const [questions, setQuestions] = useState([]);
  const [currentType, setCurrentType] = useState(type || "mcq");
  const [loading, setLoading] = useState(true);

  const categoryData = dataMap[category];
  const currentTopic = categoryData?.topics?.find(t => t.id === topic);

// Load data when category/topic changes
  useEffect(() => {
    setLoading(true);

    let loadedQuestions = [];

    if (topic && currentTopic) {
      // Load actual topic data from dataMap
      if (currentType === "mcq" || currentType === "quiz") {
        loadedQuestions = currentTopic.data || fallbackData.mcq;
      } else if (currentType === "qa") {
        loadedQuestions = currentTopic.data || fallbackData["interview-qa"];
      }
    } else if (category && !topic && categoryData?.topics?.length > 0) {
      // Use first topic's data as default when category is selected but no topic
      const firstTopic = categoryData.topics[0];
      loadedQuestions = firstTopic?.data || fallbackData.mcq;
    }

    setQuestions(loadedQuestions);
    setLoading(false);
  }, [category, topic, currentType, categoryData, currentTopic]);

  // Handle answer save to backend
  const handleAnswerSave = async (data) => {
    if (!auth?.token) {
      toast.error("Please login to save your progress");
      return;
    }

    try {
      await submitInterviewAnswer({
        ...data,
        category: category,
        topic: topic,
      }, auth.token);
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  // Handle quiz submit
  const handleQuizSubmit = async (data) => {
    if (!auth?.token) {
      toast.error("Please login to save your progress");
      return;
    }

    try {
      await submitInterviewAnswer({
        ...data,
        category: category,
        topic: topic || "quiz",
        type: "quiz",
      }, auth.token);
    } catch (error) {
      console.error("Error saving quiz answer:", error);
    }
  };

  // If no category specified, show topics list
  if (!topic) {
    if (!categoryData) {
      return (
        <div className="min-h-screen bg-richblack-900 py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-6xl mb-4">🔧</div>
            <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
            <p className="text-richblack-300 mb-6">This section is under development</p>
            <button
              onClick={() => navigate("/interview")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to IT Interview Prep
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full py-12 px-4 bg-gradient-to-br from-richblack-800 to-richblack-900 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/interview")}
              className="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
              ← Back to Interview Topics
            </button>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <span>{categoryData.icon}</span>
              {categoryData.title}
            </h1>
            <p className="text-richblack-300">Choose a topic to practice</p>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryData.topics.map((topicItem) => (
              <div
                key={topicItem.id}
                onClick={() => navigate(`/interview/${category}/${topicItem.id}`)}
                className="cursor-pointer group"
              >
                <div className="bg-richblack-800 border border-richblack-700 hover:border-richblack-500 rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-richblack-700/50 h-full">
                  <h2 className="text-xl font-bold text-white mb-2">
                    {topicItem.title}
                  </h2>
                  <div className="flex gap-2 mt-3">
                    <span className={`text-xs bg-gradient-to-r ${categoryData.color} bg-clip-text text-transparent`}>
                      MCQ →
                    </span>
                    <span className={`text-xs bg-gradient-to-r ${categoryData.color} bg-clip-text text-transparent`}>
                      Quiz →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If topic specified but no type, show type selection
  if (topic && !type) {
    return (
      <div className="min-h-screen bg-richblack-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/interview/${category}`)}
              className="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
              ← Back to {categoryData.title}
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">
              {currentTopic?.title || topic}
            </h1>
            <p className="text-richblack-300">Choose practice type</p>
          </div>

          {/* Practice Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Interview Q&A */}
            <div
              onClick={() => navigate(`/interview/${category}/${topic}/qa`)}
              className="cursor-pointer group"
            >
              <div className="bg-richblack-800 border border-richblack-700 hover:border-richblack-500 rounded-xl p-6 transition-all">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryData.color} flex items-center justify-center text-2xl mb-4`}>
                  📝
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Interview Q&A</h2>
                <p className="text-richblack-400 text-sm mb-4">Read and understand interview questions and answers</p>
                <span className={`text-sm font-semibold bg-gradient-to-r ${categoryData.color} bg-clip-text text-transparent`}>
                  Start Reading →
                </span>
              </div>
            </div>

            {/* MCQ Practice */}
            <div
              onClick={() => navigate(`/interview/${category}/${topic}/mcq`)}
              className="cursor-pointer group"
            >
              <div className="bg-richblack-800 border border-richblack-700 hover:border-richblack-500 rounded-xl p-6 transition-all">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryData.color} flex items-center justify-center text-2xl mb-4`}>
                  📋
                </div>
                <h2 className="text-xl font-bold text-white mb-2">MCQ Practice</h2>
                <p className="text-richblack-400 text-sm mb-4">Practice multiple choice questions</p>
                <span className={`text-sm font-semibold bg-gradient-to-r ${categoryData.color} bg-clip-text text-transparent`}>
                  Start Practice →
                </span>
              </div>
            </div>

            {/* Quiz */}
            <div
              onClick={() => navigate(`/interview/${category}/${topic}/quiz`)}
              className="cursor-pointer group"
            >
              <div className="bg-richblack-800 border border-richblack-700 hover:border-richblack-500 rounded-xl p-6 transition-all">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryData.color} flex items-center justify-center text-2xl mb-4`}>
                  ⏱️
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Take Quiz</h2>
                <p className="text-richblack-400 text-sm mb-4">Timed quiz with 25 questions</p>
                <span className={`text-sm font-semibold bg-gradient-to-r ${categoryData.color} bg-clip-text text-transparent`}>
                  Start Quiz →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render based on type
  return (
    <div className="min-h-screen bg-richblack-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/interview/${category}/${topic}`)}
            className="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2"
          >
            ← Back to {currentTopic?.title || topic}
          </button>
          <h1 className="text-2xl font-bold text-white">
            {currentType === "qa" && "Interview Q&A"}
            {currentType === "mcq" && "MCQ Practice"}
            {currentType === "quiz" && "Quiz"}
            {" - "}{currentTopic?.title || topic}
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {currentType === "qa" && (
              <InterviewQA
                questions={questions}
                onAnswerSave={handleAnswerSave}
                categoryColor={categoryData?.color || "from-blue-500 to-cyan-500"}
              />
            )}
            {(currentType === "mcq" || !currentType) && (
              <InterviewMCQ
                questions={questions}
                category={category}
                topic={topic}
                onAnswerSave={handleAnswerSave}
                categoryColor={categoryData?.color || "from-blue-500 to-cyan-500"}
              />
            )}
            {currentType === "quiz" && (
              <InterviewQuiz
                questions={questions}
                category={category}
                topic={topic}
                onQuizSubmit={handleQuizSubmit}
                categoryColor={categoryData?.color || "from-blue-500 to-cyan-500"}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
