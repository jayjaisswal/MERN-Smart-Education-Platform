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
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [timeStarted] = useState(Date.now());
    const [userAnswer, setUserAnswer] = useState(null);
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

    const handleSubmit = async () => {
        if (selectedAnswer === null) {
            toast.error("Please select an answer");
            return;
        }

        if (!auth.token) {
            toast.error("Please login to submit answers");
            navigate("/login");
            return;
        }

        const timeTaken = Math.ceil((Date.now() - timeStarted) / 1000);
        const correct = selectedAnswer === question.correctOption;

        const result = await submitAptitudeAnswer(
            questionId,
            selectedAnswer,
            timeTaken,
            category,
            auth.token
        );

        if (result) {
            setUserAnswer(selectedAnswer);
            setIsCorrect(correct);
            setShowAnswer(true);
            toast.success(correct ? "✅ Correct!" : "❌ Incorrect");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-richblack-900 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-50"></div>
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
                        className="mb-4 text-yellow-50 hover:text-yellow-100 flex items-center gap-2"
                    >
                        ← Back
                    </button>
                    <div className="bg-richblack-800 rounded-lg p-4 border border-richblack-700">
                        <p className="text-richblack-300 text-sm capitalize">
                            Q{questionNumber} • {topic.replace(/[-_]/g, " ")}
                        </p>
                        <h1 className="text-2xl font-bold text-white mt-2">{question.question}</h1>
                    </div>
                </div>

                {/* Options */}
                <div className="bg-richblack-800 rounded-lg p-6 border border-richblack-700 mb-6">
                    <h3 className="text-white font-bold mb-4">Choose the correct option:</h3>
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <label
                                key={index}
                                className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAnswer === index
                                        ? "bg-yellow-50/10 border-yellow-50"
                                        : showAnswer && index === question.correctOption
                                            ? "bg-green-50/10 border-green-400"
                                            : showAnswer && index === userAnswer && !isCorrect
                                                ? "bg-red-50/10 border-red-400"
                                                : "border-richblack-600 hover:border-richblack-500"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="answer"
                                    value={index}
                                    checked={selectedAnswer === index}
                                    onChange={() => setSelectedAnswer(index)}
                                    disabled={showAnswer}
                                    className="mt-1"
                                />
                                <div>
                                    <p className="font-bold text-white">
                                        {String.fromCharCode(65 + index)}.
                                    </p>
                                    <p className="text-richblack-100">{option}</p>
                                </div>
                                {showAnswer && index === question.correctOption && (
                                    <span className="ml-auto text-green-400 font-bold">✓</span>
                                )}
                                {showAnswer && index === userAnswer && !isCorrect && (
                                    <span className="ml-auto text-red-400 font-bold">✗</span>
                                )}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Submit or Show Answer Button */}
                {!showAnswer ? (
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-yellow-50 text-richblack-900 font-bold py-3 rounded-lg hover:bg-white transition-all mb-4"
                    >
                        Submit Answer
                    </button>
                ) : (
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-yellow-50 text-richblack-900 font-bold py-3 rounded-lg hover:bg-white transition-all mb-4"
                    >
                        Back to Questions
                    </button>
                )}

                {/* Explanation */}
                {showAnswer && (
                    <div className="bg-richblack-800 rounded-lg p-6 border border-richblack-700">
                        <div className={`mb-4 p-4 rounded-lg ${isCorrect ? "bg-green-50/10 border border-green-400" : "bg-red-50/10 border border-red-400"}`}>
                            <p className={`font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                                {isCorrect ? "✅ Correct Answer!" : "❌ Incorrect Answer"}
                            </p>
                        </div>
                        <div>
                            <p className="text-yellow-50 font-bold mb-2">Explanation:</p>
                            <p className="text-richblack-100">{question.explanation}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
