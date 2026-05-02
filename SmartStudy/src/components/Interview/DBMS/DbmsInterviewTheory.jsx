import React from "react";
import InterviewQA from "../components/InterviewQA";

// Import DBMS theory questions data
import dbmsTheory from "../../../data/interview/dbms-theory.json";

const DbmsInterviewTheory = () => {
  return (
    <div className="min-h-screen bg-richblack-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🗄️ DBMS Interview Q&A
          </h1>
          <p className="text-richblack-300">
            Master database concepts for your technical interview
          </p>
        </div>

        {/* Display all DBMS Theory Q&A */}
        <InterviewQA
          questions={dbmsTheory}
          categoryColor="from-blue-500 to-cyan-500"
        />
      </div>
    </div>
  );
};

export default DbmsInterviewTheory;
