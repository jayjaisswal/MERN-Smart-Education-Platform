import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../../services/apiConnector";
import { courseEndpoints } from "../../services/apis";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBox = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // Fetch all courses on mount
    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const response = await apiConnector(
                    "GET",
                    courseEndpoints.GET_ALL_COURSE_API
                );
                if (response?.data?.data) {
                    setAllCourses(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchAllCourses();
    }, []);

    // Filter courses based on search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSuggestions([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = allCourses.filter((course) => {
            const matchesName = course.courseName?.toLowerCase().includes(query);
            const matchesDescription = course.courseDescription
                ?.toLowerCase()
                .includes(query);
            const matchesCategory = course.category?.name
                ?.toLowerCase()
                .includes(query);
            const matchesTags = course.tag?.some((tag) =>
                tag.name?.toLowerCase().includes(query)
            );
            return matchesName || matchesDescription || matchesCategory || matchesTags;
        });

        setSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
    }, [searchQuery, allCourses]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSuggestionClick = (course) => {
        navigate(`/courses/${course._id}`);
        setSearchQuery("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/explore-courses?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }


const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
};

return (
    <div ref={searchRef} className="relative hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
                <FaSearch className="absolute left-3 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search courses, tags..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => searchQuery && setShowSuggestions(true)}
                    className="w-64 bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-10 py-2 border border-gray-700 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 text-gray-400 hover:text-white transition"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50 max-h-96 overflow-y-auto">
                    {suggestions.map((course) => (
                        <button
                            key={course._id}
                            type="button"
                            onClick={() => handleSuggestionClick(course)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0 flex items-start gap-3"
                        >
                            <img
                                src={course.thumbnail}
                                alt={course.courseName}
                                className="w-12 h-12 rounded object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold truncate">
                                    {course.courseName}
                                </p>
                                <p className="text-gray-400 text-sm truncate">
                                    {course.courseDescription?.substring(0, 50)}...
                                </p>
                                {course.tag && course.tag.length > 0 && (
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                        {course.tag.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag._id}
                                                className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded"
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                        {course.tag.length > 2 && (
                                            <span className="text-xs text-gray-400">
                                                +{course.tag.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No results message */}
            {showSuggestions && searchQuery && suggestions.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50 p-4 text-center text-gray-400">
                    No courses found for "{searchQuery}"
                </div>
            )}
        </form>
    </div>
);
}


export default SearchBox;
