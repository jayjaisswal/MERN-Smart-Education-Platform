import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetInterviewProgress } from "../../../services/operations/interviewAPI";
import { toast } from "react-hot-toast";

/**
 * InterviewQuiz - Quiz component with 25 questions, timer, prev/next, progress indicators
 * @param {Array} questions - Array of quiz questions (will use first 25)
 * @param {String} category - Category identifier
 * @param {String} topic - Topic identifier
 * @param {Function} onQuizSubmit - Callback to submit quiz results to backend
 * @param {String} categoryColor - Color scheme
 * @param {Number} timePerQuestion - Time in seconds per question (default 60)
 */
export default function InterviewQuiz({ 
  questions = [], 
  category = "", 
  topic = "",
  onQuizSubmit,
  categoryColor = "from-blue-500 to-cyan-500",
  timePerQuestion = 60
}) {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.profile);
  
  // Use first 25 questions
  const quizQuestions = questions.slice(0, 25);
  const totalQuestions = quizQuestions.length;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(timePerQuestion);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answerResults, setAnswerResults] = useState({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Timer
  useEffect(() => {
    if (!quizStarted || quizComplete) return;
    if (answeredQuestions.has(currentQuestionIndex)) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit as unanswered
          handleAutoSubmit();
          return timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizComplete, currentQuestionIndex, answeredQuestions]);

  // Auto-submit current answer
  const handleAutoSubmit = useCallback(() => {
    if (!answeredQuestions.has(currentQuestionIndex) && selectedAnswers[currentQuestionIndex]) {
      handleSubmitAnswer(selectedAnswers[currentQuestionIndex]);
    } else {
      // Move to next question if no answer selected
      handleSkip();
    }
  }, [currentQuestionIndex, answeredQuestions, selectedAnswers]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimeRemaining(timePerQuestion);
  };

  const handleAnswerSelect = (answer) => {
    if (!answeredQuestions.has(currentQuestionIndex)) {
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: answer
      }));
    }
  };

  const handleSubmitAnswer = async (answer) => {
    const isCorrect = answer === currentQuestion.answer;
    
    // Save to state
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
    setAnsweredQuestions(prev => new Set(prev).add(currentQuestionIndex));
    setAnswerResults(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        isCorrect,
        correctOption: currentQuestion.answer,
        selectedOption: answer
      }
    }));

    // Save to backend
    if (onQuizSubmit) {
      onQuizSubmit({
        questionId: currentQuestion.id,
        userAnswer: answer,
        isCorrect,
        category,
        topic,
        userId: auth?.user?._id,
        timeTaken: timePerQuestion - timeRemaining
      });
    }

    // Auto-move to next question after a brief delay
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeRemaining(timePerQuestion);
      } else {
        handleFinishQuiz();
      }
    }, 1000);
  };

  const handleSkip = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(timePerQuestion);
    } else {
      handleFinishQuiz();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(timePerQuestion);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTimeRemaining(timePerQuestion);
    }
  };

  const handleQuestionJump = (index) => {
    setCurrentQuestionIndex(index);
    setTimeRemaining(timePerQuestion);
  };

  const handleFinishQuiz = () => {
    setQuizComplete(true);
    setShowResults(true);
  };

const handleReset = async () => {
    // Reset local state
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setAnsweredQuestions(new Set());
    setTimeRemaining(timePerQuestion);
    setQuizStarted(false);
    setQuizComplete(false);
    setAnswerResults({});
    setShowResults(false);

    // Reset backend progress if user is logged in
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

  // Calculate results
  const attemptedCount = answeredQuestions.size;
  const correctCount = Object.values(answerResults).filter(r => r?.isCorrect).length;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <div className="w-full">
        <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Quiz?</h2>
          <p className="text-richblack-300 mb-2">{totalQuestions} Questions</p>
          <p className="text-richblack-300 mb-2">{timePerQuestion} seconds per question</p>
          <p className="text-richblack-300 mb-6">Total time: {Math.round((totalQuestions * timePerQuestion) / 60)} minutes</p>
          
          <button
            onClick={handleStartQuiz}
            className={`px-8 py-3 rounded-lg font-semibold bg-gradient-to-r ${categoryColor} text-white hover:opacity-90`}
          >
            Start Quiz 🚀
          </button>
        </div>
      </div>
    );
  }

  // Quiz Results Screen
  if (quizComplete && showResults) {
    return (
      <div className="w-full">
        <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-8 text-center">
          <div className="text-6xl mb-4">
            {scorePercentage >= 70 ? "🎉" : scorePercentage >= 50 ? "👍" : "💪"}
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
          
          <div className="text-5xl font-bold text-white mb-2">{scorePercentage}%</div>
          <p className="text-richblack-300 mb-2">
            You got {correctCount} out of {totalQuestions} correct
          </p>
          <p className="text-richblack-400 mb-6">
            {scorePercentage >= 70 ? "Excellent work! You've mastered this topic!" :
             scorePercentage >= 50 ? "Good effort! Keep practicing!" :
             "Keep learning! You'll improve!"}
          </p>

          {/* Question Review */}
          <div className="text-left mb-6">
            <h3 className="text-white font-semibold mb-3">Question Review:</h3>
            <div className="grid grid-cols-5 md:grid-cols-5 gap-2">
              {quizQuestions.map((q, index) => {
                const result = answerResults[index];
                const isCorrect = result?.isCorrect;
                const isAnswered = answeredQuestions.has(index);
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setShowResults(false);
                      setCurrentQuestionIndex(index);
                    }}
                    className={`py-2 px-3 rounded-lg font-bold transition-all ${
                      isCorrect ? "bg-green-600 text-white" :
                      isAnswered ? "bg-red-600 text-white" :
                      "bg-richblack-700 text-richblack-400"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReset}
              className={`px-6 py-2 rounded-lg font-semibold bg-gradient-to-r ${categoryColor} text-white`}
            >
              Try Again
            </button>
            <button
              onClick={() => {
                handleReset();
                // Navigate back to topics
              }}
              className="bg-richblack-700 text-white px-6 py-2 rounded-lg hover:bg-richblack-600"
            >
              Back to Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <div className="text-richblack-400">No questions available</div>
      </div>
    );
  }

  const isCurrentAnswered = answeredQuestions.has(currentQuestionIndex);

  return (
    <div className="w-full">
      {/* Header Stats */}
      <div className="bg-richblack-800 rounded-xl p-4 mb-6 flex justify-between items-center">
        <div className="flex gap-4">
          <span className="text-richblack-300">
            Question: <span className="text-white font-bold">{currentQuestionIndex + 1}/{totalQuestions}</span>
          </span>
          <span className="text-richblack-300">
            Attempted: <span className="text-green-400 font-bold">{attemptedCount}</span>
          </span>
        </div>
        
        {/* Timer */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          timeRemaining <= 10 ? "bg-red-600" : `bg-gradient-to-r ${categoryColor}`
        } text-white font-bold`}>
          <span>⏱️</span>
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-richblack-700 rounded-full h-2">
          <div
            className={`bg-gradient-to-r ${categoryColor} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden mb-6">
        <div className="p-6 border-b border-richblack-700">
          <h3 className="text-xl text-white font-semibold">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Options */}
        <div className="p-6">
          {currentQuestion.options && Array.isArray(currentQuestion.options) ? (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                let optionClass = "bg-richblack-700 hover:border-richblack-500 ";
                
                if (isCurrentAnswered) {
                  if (option === currentQuestion.answer) {
                    optionClass = "bg-green-900 border-2 border-green-500 ";
                  } else if (option === selectedAnswers[currentQuestionIndex]) {
                    optionClass = "bg-red-900 border-2 border-red-500 ";
                  }
                } else if (selectedAnswers[currentQuestionIndex] === option) {
                  optionClass = "bg-blue-900 border-2 border-blue-500 ";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isCurrentAnswered}
                    className={`w-full text-left p-4 rounded-lg transition-all ${optionClass} border-2 border-transparent text-white`}
                  >
                    <span className="font-semibold mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          ) : currentQuestion.options && typeof currentQuestion.options === 'object' ? (
            <div className="space-y-3">
              {Object.entries(currentQuestion.options).map(([key, value], index) => {
                let optionClass = "bg-richblack-700 hover:border-richblack-500 ";
                
                if (isCurrentAnswered) {
                  if (key === currentQuestion.answer) {
                    optionClass = "bg-green-900 border-2 border-green-500 ";
                  } else if (key === selectedAnswers[currentQuestionIndex]) {
                    optionClass = "bg-red-900 border-2 border-red-500 ";
                  }
                } else if (selectedAnswers[currentQuestionIndex] === key) {
                  optionClass = "bg-blue-900 border-2 border-blue-500 ";
                }

                return (
                  <button
                    key={key}
                    onClick={() => handleAnswerSelect(key)}
                    disabled={isCurrentAnswered}
                    className={`w-full text-left p-4 rounded-lg transition-all ${optionClass} border-2 border-transparent text-white`}
                  >
                    <span className="font-semibold mr-3">{key}.</span>
                    {value}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Explanation after answering */}
        {isCurrentAnswered && currentQuestion.explanation && (
          <div className="p-6 bg-richblack-900 border-t border-richblack-700">
            <h4 className="text-white font-semibold mb-2">Explanation:</h4>
            <p className="text-richblack-300">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mb-6">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded-lg font-semibold ${
            currentQuestionIndex === 0
              ? "bg-richblack-700 text-richblack-400"
              : "bg-richblack-700 text-white hover:bg-richblack-600"
          }`}
        >
          ← Previous
        </button>

        <button
          onClick={handleFinishQuiz}
          className="px-4 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700"
        >
          Finish Quiz
        </button>

        {!isCurrentAnswered ? (
          <button
            onClick={() => handleSubmitAnswer(selectedAnswers[currentQuestionIndex])}
            disabled={!selectedAnswers[currentQuestionIndex]}
            className={`px-4 py-2 rounded-lg font-semibold ${
              selectedAnswers[currentQuestionIndex]
                ? `bg-gradient-to-r ${categoryColor} text-white`
                : "bg-richblack-700 text-richblack-400 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentQuestionIndex === totalQuestions - 1
                ? "bg-richblack-700 text-richblack-400"
                : `bg-gradient-to-r ${categoryColor} text-white`
            }`}
          >
            Next →
          </button>
        )}
      </div>

      {/* Question Navigation Grid */}
      <div className="bg-richblack-800 rounded-xl p-4 border border-richblack-700">
        <p className="text-white font-semibold mb-3">Question Navigation</p>
        <div className="grid grid-cols-5 md:grid-cols-5 gap-2">
          {quizQuestions.map((q, index) => {
            const isAttempted = answeredQuestions.has(index);
            const isCorrect = answerResults[index]?.isCorrect;
            
            return (
              <button
                key={index}
                onClick={() => handleQuestionJump(index)}
                className={`py-2 px-3 rounded-lg font-bold transition-all ${
                  index === currentQuestionIndex
                    ? `bg-gradient-to-r ${categoryColor} text-white`
                    : isAttempted
                    ? isCorrect
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                    : "bg-richblack-700 text-richblack-300 hover:bg-richblack-600"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
