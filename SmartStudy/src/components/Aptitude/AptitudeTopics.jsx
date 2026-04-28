import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAptitudeQuestions } from "../../services/operations/aptitudeAPI";
import { toast } from "react-hot-toast";

export default function AptitudeTopics() {
    const { category } = useParams();
    const navigate = useNavigate();
    const { auth } = useSelector((state) => state);
    const { categories } = useSelector((state) => state.aptitude);

    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState(null);

    useEffect(() => {
        // Get unique topics for this category
        const currentCategory = categories.find((c) => c.name === category);
        if (currentCategory && currentCategory.topics) {
            setTopics(currentCategory.topics);
        }
        setLoading(false);
    }, [category, categories]);

    if (loading) {
        return (
            <div className="min-h-screen bg-richblack-900 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-50"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-richblack-900 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/aptitude")}
                        className="mb-4 text-yellow-50 hover:text-yellow-100 flex items-center gap-2"
                    >
                        ← Back to Categories
                    </button>
                    <h1 className="text-4xl font-bold text-white capitalize">
                        {category.replace("_", " ")} Practice
                    </h1>
                    <p className="text-richblack-300 mt-2">{topics.length} Topics</p>
                </div>

                {/* Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topics.map((topic, index) => (
                        <div
                            key={topic}
                            onClick={() => navigate(`/aptitude-questions/${category}/${topic}`)}
                            className="bg-richblack-800 border-2 border-richblack-700 hover:border-yellow-50 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-yellow-50/20"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-yellow-50 text-richblack-900 font-bold rounded-full w-12 h-12 flex items-center justify-center">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-bold capitalize line-clamp-2">{topic}</h3>
                                    <p className="text-richblack-400 text-sm">Click to practice</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {topics.length === 0 && (
                    <div className="text-center text-richblack-300 py-12">
                        No topics found for this category
                    </div>
                )}
            </div>
        </div>
    );
}
