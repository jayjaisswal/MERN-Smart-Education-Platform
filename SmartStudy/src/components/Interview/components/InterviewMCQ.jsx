import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { resetInterviewProgress } from "../../../services/operations/interviewAPI";
import { toast } from "react-hot-toast";

/**
 * InterviewMCQ - MCQ component with options, submit, show answer
 * Features pagination with 5 questions per page
 * @param {Array} questions - Array of MCQ objects
 * @param {String} category - Category identifier
 * @param {String} topic - Topic identifier
 * @param {Function} onAnswerSave - Callback to save answers to backend
 * @param {String} categoryColor - Color scheme
 */
export default function InterviewMCQ({ 
  questions = [], 
  category = "", 
  topic = "",
  onAnswerSave,
  categoryColor = "from-blue-500 to-cyan-500"
}) {
  const { auth } = useSelector((state) => state.profile);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageAnswers, setPageAnswers] = useState({}); // { questionIndex: answer }
  const [pageSubmitted, setPageSubmitted] = useState({}); // { questionIndex: true }
  const [showAnswers, setShowAnswers] = useState(false);
  
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

  // Reset state when page changes
  useEffect(() => {
    setPageAnswers({});
    setPageSubmitted({});
    setShowAnswers(false);
  }, [currentPage]);

  const handleAnswerSelect = (questionIndex, answer) => {
    if (!showAnswers) {
      setPageAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    }
  };

  const handlePageSubmit = async () => {
    if (Object.keys(pageAnswers).length === 0) return;

    // Mark all questions as submitted for this page
    const newSubmitted = { ...pageSubmitted };
    const newAnswers = { ...pageAnswers };
    
    // Save all answers
    for (const [qIdxStr, answer] of Object.entries(pageAnswers)) {
      const qIdx = parseInt(qIdxStr);
      const question = currentQuestions[qIdx];
      if (question) {
        const isCorrect = answer === question.answer;
        newSubmitted[qIdx] = true;

        // Save to backend if callback provided
        if (onAnswerSave) {
          try {
            await onAnswerSave({
              questionId: question.id,
              userAnswer: answer,
              isCorrect,
              category,
              topic,
              userId: auth?.user?._id
            });
          } catch (error) {
            console.error("Error saving answer:", error);
          }
        }
      }
    }

    setPageSubmitted(newSubmitted);
    setPageAnswers(newAnswers);
    setShowAnswers(true);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleReset = async () => {
    setPageAnswers({});
    setPageSubmitted({});
    setCurrentPage(1);
    setShowAnswers(false);

    if (auth?.token && category && topic) {
      try {
        await resetInterviewProgress(auth.token, category, topic);
        toast.success("Progress reset successfully");
      } catch (error) {
        console.error("Error resetting progress:", error);
        toast.error("Failed to reset progress on server");
      }
    }
  };

  // Calculate score
  const totalAnswered = Object.keys(pageSubmitted).length;
  const correctInPage = Object.entries(pageSubmitted).filter(([idx, isSub]) => {
    const qIdx = parseInt(idx);
    const question = currentQuestions[qIdx];
    const userAns = pageAnswers[qIdx];
    return isSub && question && userAns === question.answer;
  }).length;

  if (!currentQuestions || currentQuestions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-richblack-400">No questions available</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Stats Bar */}
      <div className="bg-richblack-800 rounded-xl p-4 mb-6 flex justify-between items-center">
        <div className="flex gap-4">
          <span className="text-richblack-300">
            Page: <span className="text-white font-bold">{currentPage}</span>/{totalPages}
          </span>
          <span className="text-richblack-300">
            Questions: <span className="text-white font-bold">{totalAnswered}</span>/{currentQuestions.length}
          </span>
          <span className="text-richblack-300">
            Correct: <span className="text-green-400 font-bold">{correctInPage}</span>
          </span>
        </div>
        <button
          onClick={handleReset}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Reset ↻
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm text-richblack-400 mb-2">
          <span>Questions {startIndex + 1}-{Math.min(startIndex + questionsPerPage, questions.length)} of {questions.length}</span>
          <span>{Math.round((currentPage / totalPages) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-richblack-700 rounded-full h-2">
          <div
            className={`bg-gradient-to-r ${categoryColor} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6 mb-6">
        {currentQuestions.map((question, idx) => {
          const globalIndex = startIndex + idx;
          const selectedAnswer = pageAnswers[idx];
          const isSubmitted = pageSubmitted[idx];
          
          return (
            <div key={question.id || idx} className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
              <div className="p-4 border-b border-richblack-700 flex items-start gap-3">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold bg-gradient-to-r ${categoryColor} text-white flex-shrink-0`}>
                  {idx + 1}
                </span>
                <h3 className="text-lg text-white font-medium mt-0.5">
                  {question.question}
                </h3>
              </div>

              {/* Options */}
              <div className="p-4 pt-2">
                {question.options && Array.isArray(question.options) ? (
                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => {
                      let optionClass = "bg-richblack-700 hover:border-richblack-500 ";
                      
                      if (showAnswers) {
                        if (option === question.answer) {
                          optionClass = "bg-green-900 border-2 border-green-500 ";
                        } else if (option === selectedAnswer && option !== question.answer) {
                          optionClass = "bg-red-900 border-2 border-red-500 ";
                        }
                      } else if (selectedAnswer === option) {
                        optionClass = "bg-blue-900 border-2 border-blue-500 ";
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswerSelect(idx, option)}
                          disabled={showAnswers}
                          className={`w-full text-left p-3 rounded-lg transition-all ${optionClass} border-2 border-transparent text-white text-sm`}
                        >
                          <span className="font-semibold mr-2">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {/* Explanation */}
                {showAnswers && isSubmitted && question.explanation && (
                  <div className="mt-3 p-3 bg-richblack-900 rounded-lg">
                    <h4 className="text-white text-sm font-semibold mb-1">Explanation:</h4>
                    <p className="text-richblack-300 text-sm">{question.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        {!showAnswers ? (
          <button
            onClick={handlePageSubmit}
            disabled={Object.keys(pageAnswers).length === 0}
            className={`px-8 py-3 rounded-lg font-semibold ${
              Object.keys(pageAnswers).length > 0
                ? `bg-gradient-to-r ${categoryColor} text-white`
                : "bg-richblack-700 text-richblack-400 cursor-not-allowed"
            }`}
          >
            Submit Page ({Object.keys(pageAnswers).length}/{currentQuestions.length})
          </button>
        ) : (
          <div className="flex gap-4 w-full justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentPage === 1
                  ? "bg-richblack-700 text-richblack-400"
                  : `bg-gradient-to-r ${categoryColor} text-white`
              }`}
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentPage === totalPages
                  ? "bg-richblack-700 text-richblack-400"
                  : `bg-gradient-to-r ${categoryColor} text-white`
              }`}
            >
              {currentPage === totalPages ? "Finish" : "Next →"}
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-2">
        <div className="flex gap-1 flex-wrap justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`min-w-[40px] px-3 py-2 rounded-lg font-semibold transition-all ${
                currentPage === page
                  ? `bg-gradient-to-r ${categoryColor} text-white`
                  : "bg-richblack-700 text-richblack-300 hover:bg-richblack-600"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
