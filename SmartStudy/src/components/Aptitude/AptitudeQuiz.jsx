import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import QuestionCard from "./QuestionCard";
import { getAptitudeQuestions, submitAptitudeAnswer } from "../../services/operations/aptitudeAPI";
import { setCurrentQuestions, setPagination } from "../../slices/aptitudeSlice";
import { toast } from "react-hot-toast";

export default function AptitudeQuiz() {
    const { category } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { auth } = useSelector((state) => state);
    const { currentQuestions, currentPage, totalPages, questionsPerPage } = useSelector(
        (state) => state.aptitude
    );

    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
    const [timePerQuestion, setTimePerQuestion] = useState({});
    const [startTime, setStartTime] = useState(Date.now());
    const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds per question
    const [answerResults, setAnswerResults] = useState({});

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            const data = await getAptitudeQuestions(category, currentPage, questionsPerPage);
            if (data) {
                dispatch(setCurrentQuestions(data.data));
                dispatch(setPagination(data.pagination));
            }
            setLoading(false);
        };

        fetchQuestions();
    }, [category, currentPage]);

    // Timer logic
    useEffect(() => {
        if (loading || answeredQuestions.has(currentQuestionIndex)) {
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    // Auto-submit if time runs out
                    handleAutoSubmitAnswer();
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestionIndex, loading, answeredQuestions]);

    const resetTimer = () => {
        setTimeRemaining(60);
        setStartTime(Date.now());
    };

    const handleSubmitAnswer = async (answer) => {
        if (!auth.token) {
            toast.error("Please login to submit answers");
            navigate("/login");
            return;
        }

        const timeTaken = 60 - timeRemaining;
        setSelectedAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: answer,
        }));
        setAnsweredQuestions((prev) => new Set(prev).add(currentQuestionIndex));
        setTimePerQuestion((prev) => ({
            ...prev,
            [currentQuestionIndex]: timeTaken,
        }));

        // Submit to backend
        const question = currentQuestions[currentQuestionIndex];
        const result = await submitAptitudeAnswer(
            question._id,
            answer,
            timeTaken,
            category,
            auth.token
        );

        if (result) {
            setAnswerResults((prev) => ({
                ...prev,
                [currentQuestionIndex]: {
                    isCorrect: result.isCorrect,
                    correctOption: result.correctOption,
                },
            }));
            toast.success(result.isCorrect ? "Correct! 🎉" : "Incorrect, try the next one!");
        }
    };

    const handleAutoSubmitAnswer = () => {
        if (!answeredQuestions.has(currentQuestionIndex) && selectedAnswers[currentQuestionIndex] !== undefined) {
            handleSubmitAnswer(selectedAnswers[currentQuestionIndex]);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            resetTimer();
        } else if (currentPage < totalPages) {
            dispatch(setPagination({
                ...{},
                currentPage: currentPage + 1,
                totalPages,
                totalQuestions: currentPage * questionsPerPage,
                questionsPerPage,
            }));
            setCurrentQuestionIndex(0);
            resetTimer();
        } else {
            toast.success("All questions completed!");
            navigate(`/aptitude-performance`);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            resetTimer();
        }
    };

    const handleSkipQuestion = () => {
        handleNextQuestion();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (currentQuestions.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">No questions available</h1>
                    <button
                        onClick={() => navigate("/aptitude")}
                        className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                    >
                        Back to Categories
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isCurrentAnswered = answeredQuestions.has(currentQuestionIndex);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 capitalize">
                                {category.replace("_", " ")} Practice
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Question {(currentPage - 1) * questionsPerPage + currentQuestionIndex + 1} of{" "}
                                {totalPages * questionsPerPage}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/aptitude")}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                        >
                            Exit
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                            style={{
                                width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`,
                            }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <QuestionCard
                    question={currentQuestion}
                    onSubmit={handleSubmitAnswer}
                    isAnswered={isCurrentAnswered}
                    userAnswer={selectedAnswers[currentQuestionIndex]}
                    selectedAnswer={selectedAnswers[currentQuestionIndex]}
                    setSelectedAnswer={(answer) => {
                        setSelectedAnswers((prev) => ({
                            ...prev,
                            [currentQuestionIndex]: answer,
                        }));
                    }}
                    correctOption={answerResults[currentQuestionIndex]?.correctOption}
                    timeRemaining={timeRemaining}
                />

                {/* Navigation Buttons */}
                <div className="flex gap-4 justify-between mt-8">
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0 && currentPage === 1}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        ← Previous
                    </button>

                    {isCurrentAnswered ? (
                        <button
                            onClick={handleNextQuestion}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all"
                        >
                            {currentQuestionIndex === currentQuestions.length - 1 && currentPage === totalPages
                                ? "Finish"
                                : "Next Question →"}
                        </button>
                    ) : (
                        <button
                            onClick={handleSkipQuestion}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all"
                        >
                            Skip Question ➤
                        </button>
                    )}
                </div>

                {/* Question Navigation Grid */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <p className="font-bold text-gray-900 mb-4">Question Navigation</p>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                        {currentQuestions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentQuestionIndex(index);
                                    resetTimer();
                                }}
                                className={`py-2 px-3 rounded-lg font-bold transition-all ${index === currentQuestionIndex
                                    ? "bg-purple-600 text-white"
                                    : answeredQuestions.has(index)
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
