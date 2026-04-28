import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAptitudeCategories } from "../../services/operations/aptitudeAPI";
import { setCategories } from "../../slices/aptitudeSlice";

const categoryIcons = {
    verbal_ability: "📚",
    arithmetic: "🔢",
    logical_reasoning: "🧠",
};

export default function AptitudePractice() {
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
        navigate(`/aptitude-topics/${category.name}`);
    };

    return (
        <div className="min-h-screen bg-richblack-900 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Aptitude Practice 🚀</h1>
                    <p className="text-richblack-300">Select a category to start practicing</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-50"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-900 border border-red-700 rounded-lg p-6 text-center">
                        <p className="text-white font-semibold">{error}</p>
                        <p className="text-red-200 text-sm mt-2">Run: npm run seed-aptitude</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center text-richblack-300">No categories available</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div
                                key={category.name}
                                onClick={() => handleCategoryClick(category)}
                                className="cursor-pointer group"
                            >
                                <div className="bg-richblack-800 rounded-lg border-2 border-richblack-700 hover:border-yellow-50 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-50/20">
                                    <div className="text-5xl mb-4">{categoryIcons[category.name]}</div>
                                    <h2 className="text-2xl font-bold text-white mb-2 capitalize">
                                        {category.displayName}
                                    </h2>
                                    <p className="text-richblack-300 text-sm mb-4">
                                        {category.count} Questions • {category.topics?.length} Topics
                                    </p>
                                    <button className="w-full bg-yellow-50 text-richblack-900 font-bold py-2 rounded-lg hover:bg-white transition-all">
                                        View Topics →
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
