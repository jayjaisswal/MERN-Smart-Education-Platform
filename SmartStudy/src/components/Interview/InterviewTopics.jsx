import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// Topic structure for each interview category
const interviewTopics = {
  dbms: [
    { id: "interview-qa", title: "Most Asked Interview Q&A", icon: "💬", count: 30, color: "from-blue-500 to-cyan-500" },
    { id: "multiple-choice", title: "Multiple Choice Questions", icon: "📝", count: 50, color: "from-green-500 to-emerald-500" },
    { id: "sql-queries", title: "Most Asked SQL Queries", icon: "🔍", count: 30, color: "from-purple-500 to-violet-500" },
    { id: "deadlock", title: "Deadlock", icon: "🔒", count: 15, color: "from-red-500 to-orange-500" },
    { id: "locking", title: "Locking", icon: "🔐", count: 10, color: "from-pink-500 to-rose-500" },
  ],
  "computer-networking": [
    { id: "interview-qa", title: "Most Asked Interview Q&A", icon: "💬", count: 20, color: "from-blue-500 to-cyan-500" },
    { id: "multiple-choice", title: "Multiple Choice Questions", icon: "📝", count: 115, color: "from-green-500 to-emerald-500" },
    { id: "osi-model", title: "OSI Model", icon: "📊", count: 15, color: "from-purple-500 to-violet-500" },
  ],
  "operating-system": [
    { id: "interview-qa", title: "Most Asked Interview Q&A", icon: "💬", count: 25, color: "from-blue-500 to-cyan-500" },
    { id: "multiple-choice", title: "Multiple Choice Questions", icon: "📝", count: 40, color: "from-green-500 to-emerald-500" },
  ],
  sdlc: [
    { id: "interview-qa", title: "Most Asked Interview Q&A", icon: "💬", count: 20, color: "from-blue-500 to-cyan-500" },
    { id: "multiple-choice", title: "Multiple Choice Questions", icon: "📝", count: 30, color: "from-green-500 to-emerald-500" },
  ],
  oops: [
    { id: "interview-qa", title: "Most Asked Interview Q&A", icon: "💬", count: 25, color: "from-blue-500 to-cyan-500" },
    { id: "multiple-choice", title: "Multiple Choice Questions", icon: "📝", count: 35, color: "from-green-500 to-emerald-500" },
  ],
  cpp: [
    { id: "interview-qa", title: "Most Asked Interview Q&A", icon: "💬", count: 30, color: "from-blue-500 to-cyan-500" },
    { id: "multiple-choice", title: "Multiple Choice Questions", icon: "📝", count: 45, color: "from-green-500 to-emerald-500" },
  ],
  python: [
    { id: "interview-qa", title: "Most Asked Interview Q&A", icon: "💬", count: 35, color: "from-blue-500 to-cyan-500" },
    { id: "multiple-choice", title: "Multiple Choice Questions", icon: "📝", count: 50, color: "from-green-500 to-emerald-500" },
  ],
  numpy: [
    { id: "interview-qa", title: "Most Asked Interview Q&A", icon: "💬", count: 20, color: "from-blue-500 to-cyan-500" },
    { id: "multiple-choice", title: "Multiple Choice Questions", icon: "📝", count: 30, color: "from-green-500 to-emerald-500" },
  ],
  pandas: [
    { id: "interview-qa", title: "Most Asked Interview Q&A", icon: "💬", count: 25, color: "from-blue-500 to-cyan-500" },
    { id: "multiple-choice", title: "Multiple Choice Questions", icon: "📝", count: 35, color: "from-green-500 to-emerald-500" },
  ],
  "machine-learning": [
    { id: "interview-qa", title: "Most Asked Interview Q&A", icon: "💬", count: 40, color: "from-blue-500 to-cyan-500" },
    { id: "multiple-choice", title: "Multiple Choice Questions", icon: "📝", count: 60, color: "from-green-500 to-emerald-500" },
  ],
};

export default function InterviewTopics() {
  const { category } = useParams();
  const navigate = useNavigate();

  const topics = interviewTopics[category] || [];
  const categoryTitle = category?.replace("-", " ").toUpperCase() || "Interview";

  return (
    <div className="w-full py-12 px-4 bg-gradient-to-br from-richblack-800 to-richblack-900 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Back Button & Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/interview")}
            className="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
          >
            ← Back to Interview Topics
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">
            {categoryTitle} Practice
          </h1>
          <p className="text-richblack-300">{topics.length} question types available</p>
        </div>

        {/* Topics Grid */}
        {topics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => navigate(`/interview/${category}/${topic.id}`)}
                className="cursor-pointer group"
              >
                <div className="bg-richblack-800 border border-richblack-700 hover:border-richblack-500 rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-richblack-700/50">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl mb-4`}>
                    {topic.icon}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white mb-2">
                    {topic.title}
                  </h2>

                  {/* Count */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-richblack-400">
                      {topic.count} Questions
                    </span>
                    <span className={`text-sm font-semibold bg-gradient-to-r ${topic.color} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity`}>
                      Start →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
            <p className="text-richblack-300 mb-6">This topic is under development</p>
            <button
              onClick={() => navigate("/interview")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}

        {/* Features Info */}
        <div className="mt-12 bg-richblack-800 rounded-xl p-6 border border-richblack-700">
          <h3 className="text-xl font-bold text-white mb-4">What You'll Get</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="text-white font-semibold">Company-Specific Questions</p>
                <p className="text-richblack-400 text-sm">Questions from TCS, Infosys, Wipro & more</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="text-white font-semibold">Detailed Explanations</p>
                <p className="text-richblack-400 text-sm">Learn with in-depth answers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="text-white font-semibold">Track Your Progress</p>
                <p className="text-richblack-400 text-sm">Monitor your performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
