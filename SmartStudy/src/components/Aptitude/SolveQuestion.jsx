import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { submitAptitudeAnswer, getAptitudeQuestionDetails } from "../../services/operations/aptitudeAPI";
import { toast } from "react-hot-toast";

export default function SolveQuestion() {
    const { questionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useSelector((state) => state);

    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [disabledOptions, setDisabledOptions] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(true);
    const [timeStarted] = useState(Date.now());
    const [isCorrect, setIsCorrect] = useState(null);

    const { questionNumber, category, topic } = location.state || {};

    useEffect(() => {
        const fetchQuestion = async () => {
            setLoading(true);
            const data = await getAptitudeQuestionDetails(questionId);
            if (data) {
                setQuestion(data);
            }
            setLoading(false);
        };

        fetchQuestion();
    }, [questionId]);

    const handleAnswerClick = async (index) => {
        // Don't allow clicking if this option is already disabled or if already answered correctly
        if (disabledOptions.includes(index) || isCorrect) return;

        const timeTaken = Math.ceil((Date.now() - timeStarted) / 1000);

        if (!auth.token) {
            toast.error("Please login to submit answers");
            navigate("/login");
            return;
        }

        const result = await submitAptitudeAnswer(
            questionId,
            index,
            timeTaken,
            category,
            auth.token
        );

        console.log("Submit Result:", result);

        if (result) {
            setSelectedAnswer(index);
            // Use the server's determination of correctness
            const correct = result.isCorrect;
            setIsCorrect(correct);
            setShowResult(true);

            if (correct) {
                console.log("✅ Correct answer!");
            } else {
                // Only disable this wrong option
                setDisabledOptions([...disabledOptions, index]);
                toast.error("❌ Incorrect");
            }
        }
    };

    const handleRetry = () => {
        setSelectedAnswer(null);
        setShowResult(false);
        setDisabledOptions([]);
        setIsCorrect(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-richblack-900 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="min-h-screen bg-richblack-900 flex justify-center items-center">
                <div className="text-white">Question not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-richblack-900 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-4 text-green-400 hover:text-green-300 flex items-center gap-2"
                    >
                        ← Back
                    </button>
                    <div className="bg-gradient-to-r from-richblack-800 to-richblack-700 rounded-lg p-4 border-2 border-cyan-400">
                        <p className="text-cyan-300 text-sm capitalize font-semibold">
                            Q{questionNumber} • {topic.replace(/[-_]/g, " ")}
                        </p>
                        <h1 className="text-2xl font-bold text-cyan-50 mt-2">{question.question}</h1>
                    </div>
                </div>

                {/* Options */}
                <div className="bg-richblack-800 rounded-lg p-6 border border-richblack-700 mb-6">
                    <h3 className="text-cyan-300 font-bold mb-4 text-lg">Choose the correct option:</h3>
                    <div className="space-y-3">
                        {question.options.map((option, index) => {
                            const correctOptionIndex = parseInt(question.correctOption);
                            const isCorrectAnswer = index === correctOptionIndex;
                            const isUserSelected = selectedAnswer === index;
                            const isDisabled = disabledOptions.includes(index);
                            const isCorrectSelected = isUserSelected && isCorrect;
                            const isWrongSelected = isUserSelected && !isCorrect && showResult;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerClick(index)}
                                    disabled={isDisabled || isCorrect === true}
                                    className={`w-full flex items-start gap-4 p-4 border-2 rounded-lg transition-all text-left ${isDisabled && !isCorrectSelected
                                            ? "cursor-not-allowed opacity-50 border-richblack-600 bg-richblack-700"
                                            : isCorrectSelected
                                                ? "bg-green-500/20 border-green-500 cursor-not-allowed"
                                                : isWrongSelected
                                                    ? "bg-red-500/20 border-red-500 cursor-not-allowed"
                                                    : isCorrect === true
                                                        ? "cursor-not-allowed border-richblack-500 opacity-50"
                                                        : "border-richblack-500 hover:border-cyan-400 hover:bg-richblack-700/50 cursor-pointer"
                                        }`}
                                >
                                    <div className="mt-1">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isCorrectSelected
                                                ? "border-green-500 bg-green-500/20"
                                                : isWrongSelected
                                                    ? "border-red-500 bg-red-500/20"
                                                    : isDisabled
                                                        ? "border-richblack-500"
                                                        : "border-richblack-400"
                                            }`}>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-bold ${isCorrectSelected
                                                ? "text-green-300"
                                                : isWrongSelected
                                                    ? "text-red-300"
                                                    : "text-cyan-200"
                                            }`}>
                                            {String.fromCharCode(65 + index)}.
                                        </p>
                                        <p className={`${isCorrectSelected
                                                ? "text-green-100"
                                                : isWrongSelected
                                                    ? "text-red-100"
                                                    : "text-white"
                                            }`}>{option}</p>
                                    </div>
                                    {isCorrectSelected && (
                                        <span className="ml-auto text-green-400 font-bold text-lg">✓</span>
                                    )}
                                    {isWrongSelected && (
                                        <span className="ml-auto text-red-400 font-bold text-lg">✗</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Back to Questions Button - Only show after correct answer */}
                {showResult && isCorrect && (
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-lg hover:from-green-400 hover:to-green-500 transition-all mb-4 shadow-lg"
                    >
                        Back to Questions
                    </button>
                )}

                {/* Retry Button - Only show after wrong answer */}
                {showResult && !isCorrect && (
                    <button
                        onClick={handleRetry}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all mb-4 shadow-lg"
                    >
                        Retry Question
                    </button>
                )}

                {/* Correct Answer Section */}
                {showResult && isCorrect && (
                    <div className="bg-richblack-800 rounded-lg p-6 border-2 border-green-500">
                        <div className="mb-4 p-4 rounded-lg bg-green-500/20 border-2 border-green-500">
                            <p className="font-bold text-lg text-green-400">
                                ✅ Correct Answer!
                            </p>
                        </div>
                        <div>
                            <p className="text-green-400 font-bold mb-2 text-lg">Explanation:</p>
                            <p className="text-richblack-100 leading-relaxed">{question.explanation}</p>
                        </div>
                    </div>
                )}

                {/* Incorrect Answer Section */}
                {showResult && !isCorrect && (
                    <div className="bg-richblack-800 rounded-lg p-6 border-2 border-red-500">
                        <div className="mb-4 p-4 rounded-lg bg-red-500/20 border-2 border-red-500">
                            <p className="font-bold text-lg text-red-400">
                                ✗ Incorrect Answer
                            </p>
                        </div>
                        <div className="text-richblack-300">
                            <p className="text-sm">Please try again or select another option.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
