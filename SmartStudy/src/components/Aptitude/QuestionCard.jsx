import React, { useState, useEffect } from "react";

export default function QuestionCard({
    question,
    onSubmit,
    isAnswered,
    userAnswer,
    selectedAnswer,
    setSelectedAnswer,
    correctOption,
    timeRemaining,
}) {
    const [localAnswer, setLocalAnswer] = useState(selectedAnswer);
    const resolvedCorrectOption = Number.isInteger(correctOption)
        ? correctOption
        : question.correctOption;

    useEffect(() => {
        setLocalAnswer(selectedAnswer);
    }, [selectedAnswer]);

    const handleOptionChange = (index) => {
        if (!isAnswered) {
            setLocalAnswer(index);
            setSelectedAnswer(index);
        }
    };

    const getOptionClass = (index) => {
        let baseClass =
            "w-full p-4 mb-3 text-left border-2 rounded-lg cursor-pointer transition-all duration-200 font-semibold";

        if (isAnswered) {
            if (index === resolvedCorrectOption) {
                return baseClass + " border-green-500 bg-green-50 text-green-900";
            } else if (index === userAnswer && userAnswer !== resolvedCorrectOption) {
                return baseClass + " border-red-500 bg-red-50 text-red-900";
            } else {
                return baseClass + " border-gray-300 bg-gray-50 text-gray-900";
            }
        } else if (localAnswer === index) {
            return baseClass + " border-purple-600 bg-purple-50 text-purple-900";
        } else {
            return baseClass + " border-gray-300 hover:border-purple-400 bg-white hover:bg-purple-50";
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            {/* Timer */}
            <div className="mb-6 flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-700">Question</div>
                <div
                    className={`text-lg font-bold px-4 py-2 rounded-lg ${timeRemaining <= 10 && timeRemaining > 0
                        ? "bg-red-100 text-red-600 animate-pulse"
                        : timeRemaining === 0
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                >
                    ⏱️ {Math.floor(timeRemaining / 60)}:
                    {(timeRemaining % 60).toString().padStart(2, "0")}s
                </div>
            </div>

            {/* Question Text */}
            <div className="mb-6">
                <p className="text-xl font-bold text-gray-900 mb-2">
                    {question.question}
                </p>
                <p className="text-sm text-gray-500">
                    Topic: <span className="font-semibold text-gray-700">{question.topic}</span>
                </p>
            </div>

            {/* Options */}
            <div className="mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-4">
                    Select the correct option:
                </p>
                {question.options.map((option, index) => (
                    <label key={index} className={getOptionClass(index)}>
                        <input
                            type="radio"
                            name="answer"
                            value={index}
                            checked={localAnswer === index}
                            onChange={() => handleOptionChange(index)}
                            disabled={isAnswered}
                            className="mr-3"
                        />
                        <span>{String.fromCharCode(65 + index)}.</span> {option}
                    </label>
                ))}
            </div>

            {/* Explanation (shown after answer) */}
            {isAnswered && (
                <div
                    className={`p-4 rounded-lg ${userAnswer === resolvedCorrectOption
                        ? "bg-green-50 border border-green-200"
                        : "bg-yellow-50 border border-yellow-200"
                        }`}
                >
                    <p className="font-bold mb-2 text-gray-900">
                        {userAnswer === resolvedCorrectOption
                            ? "✅ Correct!"
                            : "❌ Incorrect"}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">Explanation:</span> {question.explanation}
                    </p>
                </div>
            )}

            {/* Submit Button */}
            {!isAnswered && (
                <button
                    onClick={() => onSubmit(localAnswer)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                    Submit Answer
                </button>
            )}
        </div>
    );
}
