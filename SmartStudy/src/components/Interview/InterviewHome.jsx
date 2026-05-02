import React from "react";
import { useNavigate } from "react-router-dom";

// Interview categories with their icons and descriptions
const interviewCategories = [
  {
    id: "dbms",
    title: "DBMS",
    description: "Master Database Management Systems - From normalization to transactions, locks to queries.",
    icon: "🗄️",
    color: "from-blue-500 to-cyan-500",
    topics: ["Most Asked Interview Q&A", "Multiple Choice", "Most Asked SQL Queries", "Deadlock", "Locking"]
  },
  {
    id: "computer-networking",
    title: "Computer Networks",
    description: "OSI, TCP/IP, protocols, and networking fundamentals.",
    icon: "🌐",
    color: "from-green-500 to-emerald-500",
    topics: ["Most Asked Interview Q&A", "Multiple Choice", "OSI Model"]
  },
  {
    id: "operating-system",
    title: "Operating System",
    description: "Process management, memory, CPU scheduling, and OS concepts.",
    icon: "💻",
    color: "from-purple-500 to-violet-500",
    topics: ["Most Asked Interview Q&A", "Multiple Choice"]
  },
  {
    id: "sdlc",
    title: "SDLC",
    description: "Software Development Life Cycle - Models, methodologies, and best practices.",
    icon: "🔄",
    color: "from-orange-500 to-amber-500",
    topics: ["Most Asked Interview Q&A", "Multiple Choice"]
  },
  {
    id: "stlc",
    title: "STLC",
    description: "Software Testing Life Cycle - Models, methodologies, and best practices.",
    icon: "🧪",
    color: "from-green-500 to-emerald-500",
    topics: ["Most Asked Interview Q&A", "Multiple Choice"]
  },
  {
    id: "oops",
    title: "OOPS",
    description: "Object-Oriented Programming concepts - Encapsulation, inheritance, polymorphism.",
    icon: "🏗️",
    color: "from-pink-500 to-rose-500",
    topics: ["Most Asked Interview Q&A", "Multiple Choice"]
  },
  // {
  //   id: "cpp",
  //   title: "C++",
  //   description: "C++ programming fundamentals, STL, and advanced concepts.",
  //   icon: "⚡",
  //   color: "from-indigo-500 to-blue-500",
  //   topics: ["Most Asked Interview Q&A", "Multiple Choice"]
  // },
  // {
  //   id: "python",
  //   title: "Python",
  //   description: "Python programming, data structures, and algorithms.",
  //   icon: "🐍",
  //   color: "from-yellow-500 to-green-500",
  //   topics: ["Most Asked Interview Q&A", "Multiple Choice"]
  // },
  // {
  //   id: "numpy",
  //   title: "NumPy",
  //   description: "Numerical Python - Arrays, matrices, and numerical computing.",
  //   icon: "🔢",
  //   color: "from-teal-500 to-cyan-500",
  //   topics: ["Most Asked Interview Q&A", "Multiple Choice"]
  // },
  // {
  //   id: "pandas",
  //   title: "Pandas",
  //   description: "Data manipulation and analysis with Pandas dataframe.",
  //   icon: "📊",
  //   color: "from-red-500 to-pink-500",
  //   topics: ["Most Asked Interview Q&A", "Multiple Choice"]
  // },
  // {
  //   id: "machine-learning",
  //   title: "Machine Learning",
  //   description: "ML algorithms, supervised and unsupervised learning.",
  //   icon: "🤖",
  //   color: "from-cyan-500 to-blue-500",
  //   topics: ["Most Asked Interview Q&A", "Multiple Choice"]
  // },
];

export default function InterviewHome() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/interview/${categoryId}`);
  };

  return (
    <div className="w-full py-12 px-4 bg-gradient-to-br from-richblack-800 to-richblack-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Interview Preparation 🚀
          </h1>
          <p className="text-xl text-richblack-300 max-w-2xl mx-auto">
            Ace your technical interviews with our comprehensive practice questions and answers
          </p>
        </div>

{/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group cursor-pointer"
            >
              <div className="bg-richblack-800 border border-richblack-700 hover:border-richblack-500 rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-richblack-700/50 h-full flex flex-col">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl mb-4`}>
                  {category.icon}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-2">
                  {category.title}
                </h2>

                {/* Description */}
                <p className="text-richblack-300 text-sm mb-4 flex-grow">
                  {category.description}
                </p>

                {/* Topics Preview */}
                <div className="flex flex-wrap gap-2">
                  {category.topics.slice(0, 3).map((topic, index) => (
                    <span
                      key={index}
                      className="text-xs bg-richblack-700 text-richblack-300 px-2 py-1 rounded-md"
                    >
                      {topic}
                    </span>
                  ))}
                  {category.topics.length > 3 && (
                    <span className="text-xs text-richblack-400 px-2 py-1">
                      +{category.topics.length - 3} more
                    </span>
                  )}
                </div>

                {/* Start Button */}
                <button className={`w-full mt-4 bg-gradient-to-r ${category.color} text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100`}>
                  Start Practice →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-richblack-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-xl font-bold text-white mb-2">Multiple Choice Questions</h3>
            <p className="text-richblack-300 text-sm">Practice with hundreds of MCQs from top companies</p>
          </div>
          <div className="bg-richblack-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="text-xl font-bold text-white mb-2">Detailed Explanations</h3>
            <p className="text-richblack-300 text-sm">Every answer comes with in-depth explanations</p>
          </div>
          <div className="bg-richblack-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">Company-Specific</h3>
            <p className="text-richblack-300 text-sm">Questions asked by TCS, Infosys, Wipro and more</p>
          </div>
        </div>
      </div>
    </div>
  );
}
