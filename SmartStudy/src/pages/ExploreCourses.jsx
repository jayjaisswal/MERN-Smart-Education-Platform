import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { courseEndpoints } from "../services/apis";
import Footer from "../components/common/Footer";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

const ExploreCourses = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query") || "";
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [displayedCourses, setDisplayedCourses] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    // Filter states
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [searchName, setSearchName] = useState(query);
    const [sortBy, setSortBy] = useState("name");

    const navigate = useNavigate();
    const observerTarget = useRef(null);
    const coursesPerPage = 12;

    // Fetch all courses on mount
    useEffect(() => {
        const fetchAllCourses = async () => {
            setLoading(true);
            try {
                const response = await apiConnector(
                    "GET",
                    courseEndpoints.GET_ALL_COURSE_API
                );
                if (response?.data?.data) {
                    setCourses(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                toast.error("Failed to load courses");
            } finally {
                setLoading(false);
            }
        };
        fetchAllCourses();
    }, []);

    // Filter and sort courses
    useEffect(() => {
        let filtered = courses.filter((course) => {
            const matchesSearch =
                searchName === "" ||
                course.courseName?.toLowerCase().includes(searchName.toLowerCase()) ||
                course.courseDescription
                    ?.toLowerCase()
                    .includes(searchName.toLowerCase()) ||
                course.tag?.some((tag) =>
                    tag.name?.toLowerCase().includes(searchName.toLowerCase())
                );

            const matchesPrice =
                course.price >= priceRange.min && course.price <= priceRange.max;

            return matchesSearch && matchesPrice;
        });

        // Sort courses
        if (sortBy === "price-low") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === "name") {
            filtered.sort((a, b) =>
                a.courseName.localeCompare(b.courseName)
            );
        } else if (sortBy === "rating") {
            filtered.sort((a, b) => (b.ratingAndReviews?.length || 0) - (a.ratingAndReviews?.length || 0));
        }

        setFilteredCourses(filtered);
        setPage(1);
        setDisplayedCourses(filtered.slice(0, coursesPerPage));
        setHasMore(filtered.length > coursesPerPage);
    }, [courses, searchName, priceRange, sortBy]);

    // Infinite scroll - load more courses
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !loading &&
                    displayedCourses.length > 0
                ) {
                    loadMoreCourses();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading, displayedCourses]);

    const loadMoreCourses = useCallback(() => {
        const nextPage = page + 1;
        const startIdx = page * coursesPerPage;
        const endIdx = startIdx + coursesPerPage;

        const newCourses = filteredCourses.slice(startIdx, endIdx);

        setDisplayedCourses((prev) => [...prev, ...newCourses]);
        setPage(nextPage);
        setHasMore(endIdx < filteredCourses.length);
    }, [page, filteredCourses, coursesPerPage]);



    return (
        <>
            <div className="min-h-screen bg-richblack-900 pt-20 pb-10">
                <div className="w-11/12 max-w-maxContent mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-4xl font-bold text-richblack-5 mb-4">
                            Explore Courses
                        </h1>
                        <p className="text-richblack-300 text-sm md:text-base">
                            {query
                                ? `Search results for "${query}"`
                                : "Browse all available courses"}
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar Filters */}
                        <div className="w-full lg:w-80 bg-richblack-800 rounded-lg p-6 h-fit lg:sticky lg:top-24">
                            <h2 className="text-xl font-bold text-richblack-5 mb-6">
                                Filters
                            </h2>

                            {/* Search by Name */}
                            <div className="mb-6">
                                <label className="block text-richblack-200 font-semibold mb-3">
                                    Search by Name
                                </label>
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-3 text-richblack-400" />
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                        className="w-full bg-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-lg pl-10 pr-4 py-2 border border-richblack-600 focus:outline-none focus:border-yellow-400"
                                    />
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <label className="block text-richblack-200 font-semibold mb-3">
                                    Price Range
                                </label>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-richblack-300 text-sm">
                                            Min: ₹{priceRange.min}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100000"
                                            step="1000"
                                            value={priceRange.min}
                                            onChange={(e) =>
                                                setPriceRange({
                                                    ...priceRange,
                                                    min: parseInt(e.target.value),
                                                })
                                            }
                                            className="w-full accent-yellow-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-richblack-300 text-sm">
                                            Max: ₹{priceRange.max}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100000"
                                            step="1000"
                                            value={priceRange.max}
                                            onChange={(e) =>
                                                setPriceRange({
                                                    ...priceRange,
                                                    max: parseInt(e.target.value),
                                                })
                                            }
                                            className="w-full accent-yellow-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-richblack-200 font-semibold mb-3">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full bg-richblack-700 text-richblack-5 rounded-lg px-4 py-2 border border-richblack-600 focus:outline-none focus:border-yellow-400"
                                >
                                    <option value="name">Name (A-Z)</option>
                                    <option value="price-low">Price (Low to High)</option>
                                    <option value="price-high">Price (High to Low)</option>
                                    <option value="rating">Most Rated</option>
                                </select>
                            </div>
                        </div>

                        {/* Courses Grid */}
                        <div className="flex-1">
                            {loading && displayedCourses.length === 0 ? (
                                <div className="grid place-items-center h-96">
                                    <div className="spinner"></div>
                                </div>
                            ) : displayedCourses.length === 0 ? (
                                <div className="grid place-items-center h-96 bg-richblack-800 rounded-lg">
                                    <div className="text-center">
                                        <p className="text-richblack-300 text-xl mb-2">
                                            No courses found
                                        </p>
                                        <p className="text-richblack-400 text-sm">
                                            Try adjusting your filters
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                                        {displayedCourses.map((course) => (
                                            <div
                                                key={course._id}
                                                className="bg-richblack-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col"
                                            >
                                                {/* Course Image */}
                                                <div className="h-40 overflow-hidden bg-richblack-700">
                                                    <img
                                                        src={course.thumbnail}
                                                        alt={course.courseName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Course Info */}
                                                <div className="p-4 flex flex-col flex-1">
                                                    <h3 className="text-richblack-5 font-semibold mb-2 line-clamp-2">
                                                        {course.courseName}
                                                    </h3>

                                                    <p className="text-richblack-300 text-sm mb-3 line-clamp-2">
                                                        {course.courseDescription}
                                                    </p>

                                                    {/* Footer */}
                                                    <div className="mt-auto flex items-center justify-between">
                                                        <span className="text-yellow-400 font-bold text-lg">
                                                            ₹{course.price}
                                                        </span>
                                                        <button
                                                            onClick={() => navigate(`/courses/${course._id}`)}
                                                            className="bg-yellow-400 hover:bg-yellow-500 text-richblack-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Loading indicator for infinite scroll */}
                                    {hasMore && (
                                        <div ref={observerTarget} className="flex justify-center py-8">
                                            <div className="spinner"></div>
                                        </div>
                                    )}

                                    {/* End message */}
                                    {!hasMore && displayedCourses.length > 0 && (
                                        <div className="text-center py-8">
                                            <p className="text-richblack-400">
                                                No more courses to load
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ExploreCourses;
