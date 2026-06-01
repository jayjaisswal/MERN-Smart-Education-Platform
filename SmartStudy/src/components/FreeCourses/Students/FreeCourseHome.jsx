import React, { useState, useEffect } from 'react';
import { MdSearch, MdPlayCircle, MdPerson } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { fetchAllFreeCourses } from '../../../services/operations/freeCoursesAPI';
import FreeCourseViewer from '../Student/FreeCourseViewer';
import toast from 'react-hot-toast';

const FreeCourseHome = () => {
    const { token } = useSelector((state) => state.auth);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Default high-quality placeholder image for courses without a thumbnail
    const defaultPlaceholder = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";

    useEffect(() => {
        loadCourses();
    }, []);

    // Filter and sort courses
    useEffect(() => {
        let filtered = [...courses];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (course) =>
                    course.title.toLowerCase().includes(query) ||
                    course.description?.toLowerCase().includes(query),
            );
        }

        if (sortBy === 'recent') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'oldest') {
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortBy === 'title') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        setFilteredCourses(filtered);
    }, [courses, searchQuery, sortBy]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const data = await fetchAllFreeCourses({}, token);
            if (data?.success && Array.isArray(data?.data)) {
                setCourses(data.data);
            } else if (Array.isArray(data)) {
                setCourses(data);
            } else {
                setCourses([]);
            }
        } catch (error) {
            toast.error('Failed to load courses');
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    if (selectedCourse) {
        return (
            <FreeCourseViewer
                courseId={selectedCourse._id}
                onClose={() => setSelectedCourse(null)}
                allCourses={filteredCourses}
                currentCourseIndex={filteredCourses.findIndex((c) => c._id === selectedCourse._id)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-richblack-900 py-8 px-4 md:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-10">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-richblack-5 mb-2 tracking-tight">
                        🎓 Free Learning Courses
                    </h1>
                    <p className="text-richblack-400 text-base">
                        Access premium video training collections instantly.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-richblack-800 pb-6">
                    <div className="relative w-full md:max-w-md">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-500 text-xl" />
                        <input
                            type="text"
                            placeholder="Search video courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-richblack-800 text-richblack-5 placeholder-richblack-500 pl-11 pr-4 py-2.5 rounded-lg border border-richblack-700/60 focus:border-yellow-400 focus:outline-none transition-colors text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                        <span className="text-richblack-500 text-xs font-medium uppercase tracking-wider">Sort:</span>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-richblack-800 text-richblack-200 border border-richblack-700/60 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400 cursor-pointer"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="oldest">Oldest First</option>
                            <option value="title">Title (A-Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-richblack-700 border-t-yellow-400" />
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-16">
                        <h2 className="text-xl font-medium text-richblack-300">
                            {courses.length === 0 ? 'No video courses published yet' : 'No matches found'}
                        </h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
                        {filteredCourses.map((course) => (
                            <div
                                key={course._id}
                                onClick={() => setSelectedCourse(course)}
                                className="group cursor-pointer flex flex-col w-full"
                            >
                                {/* Video Thumbnail Canvas */}
                                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-richblack-800 border border-richblack-800/50">
                                    {/* The Thumbnail Image */}
                                    <img 
                                        src={course.thumbnail || defaultPlaceholder} 
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                                        loading="lazy"
                                    />

                                    {/* Dark film and Play Button Overlay on Hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                                        <div className="bg-yellow-400 text-richblack-900 p-3 rounded-full shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-200">
                                            <MdPlayCircle className="text-2xl" />
                                        </div>
                                    </div>

                                    {/* Video Count Badge Overlaid (Bottom Right) */}
                                    {course.structure && course.structure.length > 0 && (
                                        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide z-20">
                                            {course.structure.length} EPISODES
                                        </div>
                                    )}
                                </div>

                                {/* Video Info Metadata Block */}
                                <div className="mt-2.5 flex flex-col space-y-1">
                                    {/* Title */}
                                    <h3 className="text-sm font-semibold text-richblack-5 line-clamp-2 group-hover:text-yellow-400 transition-colors duration-150 leading-tight">
                                        {course.title}
                                    </h3>

                                    {/* Short Description */}
                                    <p className="text-richblack-400 text-xs line-clamp-1 leading-normal">
                                        {course.description}
                                    </p>

                                    {/* Instructor & Date Inline Row */}
                                    <div className="flex items-center gap-1.5 text-[11px] text-richblack-500 font-medium pt-0.5">
                                        {course.instructor && (
                                            <>
                                                <span className="text-richblack-300 truncate max-w-[140px]">
                                                    {course.instructor.firstName} {course.instructor.lastName}
                                                </span>
                                                <span className="text-richblack-700">•</span>
                                            </>
                                        )}
                                        <span>
                                            {new Date(course.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreeCourseHome;