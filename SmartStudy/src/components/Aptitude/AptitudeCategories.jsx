import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAptitudeCategories } from "../../services/operations/aptitudeAPI";
import { setCategories, setCurrentCategory } from "../../slices/aptitudeSlice";

const categoryIcons = {
    verbal_ability: "📚",
    arithmetic: "🔢",
    logical_reasoning: "🧠",
};

const categoryDescriptions = {
    verbal_ability: "Master English grammar, vocabulary, and comprehension skills.",
    arithmetic: "Practice calculation, ratios, percentages, and more.",
    logical_reasoning: "Sharpen your analytical and logical thinking abilities.",
};

export default function AptitudeCategories() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.aptitude);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAptitudeCategories();
                if (data && data.length > 0) {
                    dispatch(setCategories(data));
                } else {
                    setError("No categories found. Please ensure backend is running and data is seeded.");
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError("Failed to load categories. Check backend connection.");
            }
            setLoading(false);
        };

        if (categories.length === 0) {
            fetchCategories();
        } else {
            setLoading(false);
        }
    }, []);

    const handleCategoryClick = (category) => {
        dispatch(setCurrentCategory(category.name));
        navigate(`/aptitude-practice/${category.name}`);
    };

    return (
        <div className="w-full py-12 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Master Aptitude 🚀
                    </h1>
                    <p className="text-xl text-gray-600">
                        Practice questions from multiple categories and track your progress
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-700 font-semibold">{error}</p>
                        <p className="text-red-600 text-sm mt-2">Make sure to run: npm run seed-aptitude</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <p className="text-yellow-700 font-semibold">No categories available</p>
                        <p className="text-yellow-600 text-sm mt-2">Please run the database seed script first</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div
                                key={category.name}
                                onClick={() => handleCategoryClick(category)}
                                className="cursor-pointer group h-full"
                            >
                                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 h-full flex flex-col">
                                    <div className="text-6xl mb-4">{categoryIcons[category.name]}</div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {category.displayName}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                                        {categoryDescriptions[category.name]}
                                    </p>
                                    <div className="flex justify-between items-center bg-purple-50 rounded-lg p-3 mb-4">
                                        <span className="text-sm font-semibold text-gray-700">
                                            {category.count} Questions
                                        </span>
                                        <span className="text-sm font-semibold text-purple-600">
                                            {category.topics?.length} Topics
                                        </span>
                                    </div>
                                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 group-hover:shadow-lg">
                                        Start Practice →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
