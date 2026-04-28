import React, { useState } from "react";
import { useSelector } from "react-redux";
import { submitAptitudeAnswer } from "../../services/operations/aptitudeAPI";
import { toast } from "react-hot-toast";

export default function QuestionItem({ question, questionNumber, category, topic }) {
    const { auth } = useSelector((state) => state);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [userAnswer, setUserAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [timeStarted] = useState(Date.now());
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (selectedAnswer === null) {
            toast.error("Please select an answer");
            return;
        }

        if (!auth.token) {
            toast.error("Please login to submit answers");
            return;
        }

        const timeTaken = Math.ceil((Date.now() - timeStarted) / 1000);
        const correct = selectedAnswer === question.correctOption;

        const result = await submitAptitudeAnswer(
            question._id,
            selectedAnswer,
            timeTaken,
            category,
            auth.token
        );

        if (result) {
            setUserAnswer(selectedAnswer);
            setIsCorrect(correct);
            setSubmitted(true);
            toast.success(correct ? "✅ Correct!" : "❌ Incorrect");
        }
    };

    return (
        <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-6 hover:border-yellow-50/50 transition-all">
            {/* Question Header */}
            <div className="mb-6">
                <div className="text-sm text-richblack-300 mb-2">
                    <span className="font-bold text-yellow-50">Q{questionNumber}</span>
                    <span className="mx-2">•</span>
                    <span className="capitalize">{topic.replace(/[-_]/g, " ")}</span>
                    <span className="mx-2">•</span>
                    <span className="font-bold capitalize text-yellow-100">{question.difficulty}</span>
                </div>
                <p className="text-white font-semibold text-lg">{question.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-6">
                {question.options.map((option, index) => (
                    <label
                        key={index}
                        className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedAnswer === index
                                ? "bg-yellow-50/10 border-yellow-50"
                                : submitted && index === question.correctOption
                                    ? "bg-green-50/10 border-green-400"
                                    : submitted && index === userAnswer && !isCorrect
                                        ? "bg-red-50/10 border-red-400"
                                        : "border-richblack-600 hover:border-richblack-500"
                            }`}
                    >
                        <input
                            type="radio"
                            name={`answer-${questionNumber}`}
                            value={index}
                            checked={selectedAnswer === index}
                            onChange={() => setSelectedAnswer(index)}
                            disabled={submitted}
                            className="mt-1"
                        />
                        <div className="flex-1">
                            <p className="font-bold text-white">
                                {String.fromCharCode(65 + index)}.
                            </p>
                            <p className="text-richblack-100 text-sm">{option}</p>
                        </div>
                        {submitted && index === question.correctOption && (
                            <span className="text-green-400 font-bold">✓</span>
                        )}
                        {submitted && index === userAnswer && !isCorrect && (
                            <span className="text-red-400 font-bold">✗</span>
                        )}
                    </label>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-richblack-600">
                {!submitted ? (
                    <>
                        <button
                            onClick={handleSubmit}
                            disabled={selectedAnswer === null}
                            className="flex-1 bg-yellow-50 text-richblack-900 font-bold py-2 rounded-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Answer
                        </button>
                        <button
                            onClick={() => setShowAnswer(!showAnswer)}
                            className="px-4 py-2 text-yellow-50 border border-yellow-50 rounded-lg hover:bg-yellow-50 hover:text-richblack-900 transition-all font-semibold"
                        >
                            {showAnswer ? "Hide Answer" : "Show Answer"}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => {
                            setSelectedAnswer(null);
                            setSubmitted(false);
                            setIsCorrect(null);
                            setShowAnswer(false);
                        }}
                        className="flex-1 bg-richblack-600 text-white font-bold py-2 rounded-lg hover:bg-richblack-700 transition-all"
                    >
                        Retry Question
                    </button>
                )}
                <span className="text-richblack-400 text-xs whitespace-nowrap">
                    Difficulty: <span className="font-bold capitalize">{question.difficulty}</span>
                </span>
            </div>

            {/* Answer Section */}
            {showAnswer && !submitted && (
                <div className="mt-6 pt-6 border-t border-richblack-600 bg-richblack-900 p-4 rounded">
                    <p className="text-richblack-200 text-sm mb-2">
                        <span className="font-bold text-yellow-50">Correct Answer:</span>
                    </p>
                    <p className="text-white mb-3">{question.options[question.correctOption]}</p>
                    <p className="text-richblack-300 text-sm">
                        <span className="font-bold text-yellow-50">Explanation:</span>
                    </p>
                    <p className="text-richblack-200 text-sm mt-2">{question.explanation}</p>
                </div>
            )}

            {/* Explanation After Submit */}
            {submitted && (
                <div className="mt-6 pt-6 border-t border-richblack-600">
                    <div className={`mb-4 p-4 rounded-lg ${isCorrect ? "bg-green-50/10 border border-green-400" : "bg-red-50/10 border border-red-400"}`}>
                        <p className={`font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                            {isCorrect ? "✅ Correct Answer!" : "❌ Incorrect Answer"}
                        </p>
                    </div>
                    <div className="bg-richblack-900 p-4 rounded">
                        <p className="text-yellow-50 font-bold mb-2">Explanation:</p>
                        <p className="text-richblack-100 text-sm">{question.explanation}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
