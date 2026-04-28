import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserAptitudePerformance } from "../../services/operations/aptitudeAPI";

export default function AptitudePerformance() {
    const navigate = useNavigate();
    const { auth } = useSelector((state) => state);
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        if (!auth.token) {
            navigate("/login");
            return;
        }

        const fetchPerformance = async () => {
            setLoading(true);
            const data = await getUserAptitudePerformance(auth.token, selectedCategory);
            setPerformance(data);
            setLoading(false);
        };

        fetchPerformance();
    }, [selectedCategory, auth.token]);

    if (!auth.token) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Your Aptitude Performance 📊
                    </h1>
                    <p className="text-xl text-gray-600">
                        Track your progress and improve with every attempt
                    </p>
                </div>

                {/* Overall Stats Cards */}
                {performance && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            {/* Total Attempts */}
                            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    {performance.totalAttempts}
                                </div>
                                <p className="text-gray-600 font-semibold">Total Attempts</p>
                            </div>

                            {/* Correct Answers */}
                            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                                <div className="text-4xl font-bold text-green-600 mb-2">
                                    {performance.correct}
                                </div>
                                <p className="text-gray-600 font-semibold">Correct Answers</p>
                            </div>

                            {/* Incorrect Answers */}
                            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                                <div className="text-4xl font-bold text-red-600 mb-2">
                                    {performance.incorrect}
                                </div>
                                <p className="text-gray-600 font-semibold">Incorrect Answers</p>
                            </div>

                            {/* Accuracy */}
                            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                                <div className="text-4xl font-bold text-purple-600 mb-2">
                                    {performance.accuracy}%
                                </div>
                                <p className="text-gray-600 font-semibold">Accuracy</p>
                            </div>
                        </div>

                        {/* Average Time */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                ⏱️ Average Time Per Question: {performance.averageTime}s
                            </h2>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-purple-600 h-3 rounded-full"
                                    style={{
                                        width: `${Math.min((performance.averageTime / 60) * 100, 100)}%`,
                                    }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Keep trying to beat your personal best!
                            </p>
                        </div>

                        {/* Category Performance */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Performance by Category 📈
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {performance.categoryStats.map((stat) => (
                                    <div
                                        key={stat.category}
                                        className="border-2 border-gray-200 rounded-lg p-6 hover:border-purple-400 transition-all"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 capitalize">
                                                {stat.category.replace("_", " ")}
                                            </h3>
                                            <button
                                                onClick={() => setSelectedCategory(stat.category)}
                                                className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-all"
                                            >
                                                View
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600">Attempts</span>
                                                    <span className="font-bold text-gray-900">{stat.attempts}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600">Correct</span>
                                                    <span className="font-bold text-green-600">{stat.correct}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600">Accuracy</span>
                                                    <span className="font-bold text-purple-600">{stat.accuracy}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                                                        style={{ width: `${stat.accuracy}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-8 justify-center">
                            <button
                                onClick={() => navigate("/aptitude")}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                            >
                                Start New Practice
                            </button>
                            <button
                                onClick={() => navigate("/home")}
                                className="bg-gray-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-gray-700 transition-all"
                            >
                                Back to Home
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
