import React, { useState, useEffect } from 'react';
import { MdSearch, MdPlayCircle, MdPerson } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { fetchAllFreeCourses } from '../../../services/operations/freeCoursesAPI';
import FreeCourseViewer from './FreeCourseViewer';
import toast from 'react-hot-toast';

const StudentCoursesPage = () => {
    const { token } = useSelector((state) => state.auth);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        loadCourses();
    }, []);

    // Filter and sort courses
    useEffect(() => {
        let filtered = [...courses];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (course) =>
                    course.title.toLowerCase().includes(query) ||
                    course.description?.toLowerCase().includes(query),
            );
        }

        // Sort
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
            console.log('Loading free courses...');
            const data = await fetchAllFreeCourses({}, token);
            console.log('Courses data received:', data);

            if (data?.success && Array.isArray(data?.data)) {
                setCourses(data.data);
            } else if (Array.isArray(data)) {
                setCourses(data);
            } else {
                console.warn('Invalid courses data format:', data);
                setCourses([]);
                toast.error('Failed to load courses - invalid data format');
            }
        } catch (error) {
            console.error('Error loading courses:', error);
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
            <div className="max-w-7xl mx-auto mb-12">
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-richblack-5 mb-3">
                        🎓 Free Learning Courses
                    </h1>
                    <p className="text-richblack-400 text-lg">
                        Access premium video courses from expert instructors - completely free
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-400 text-xl" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-richblack-800 text-richblack-5 placeholder-richblack-500 pl-12 pr-4 py-3 rounded-lg border border-richblack-700 focus:border-yellow-400 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Sort Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-richblack-400 text-sm font-medium">Sort by:</span>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: 'recent', label: 'Most Recent' },
                                { value: 'oldest', label: 'Oldest First' },
                                { value: 'title', label: 'Title (A-Z)' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSortBy(option.value)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${sortBy === option.value
                                            ? 'bg-yellow-400 text-richblack-900'
                                            : 'bg-richblack-700 text-richblack-300 hover:bg-richblack-600'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-richblack-700 border-t-yellow-400" />
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold text-richblack-200 mb-3">
                            {courses.length === 0 ? 'No courses available' : 'No courses match your search'}
                        </h2>
                        <p className="text-richblack-400">
                            {courses.length === 0
                                ? 'Courses will be added soon'
                                : 'Try adjusting your search criteria'}
                        </p>
                    </div>
                ) : (
                    <div>
                        {/* Results info */}
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-richblack-400">
                                Showing <span className="font-semibold text-yellow-400">{filteredCourses.length}</span>{' '}
                                {filteredCourses.length === 1 ? 'course' : 'courses'}
                            </p>
                        </div>

                        {/* Courses Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course) => (
                                <div
                                    key={course._id}
                                    onClick={() => setSelectedCourse(course)}
                                    className="group bg-richblack-800 rounded-lg overflow-hidden border border-richblack-700 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/20 transition-all cursor-pointer"
                                >
                                    {/* Placeholder Image */}
                                    <div className="aspect-video bg-gradient-to-br from-richblack-700 to-richblack-800 flex items-center justify-center group-hover:from-richblack-600 group-hover:to-richblack-700 transition-all relative overflow-hidden">
                                        <MdPlayCircle className="text-4xl text-yellow-400 group-hover:scale-110 transition-transform" />

                                        {/* Video count badge */}
                                        {course.structure && course.structure.length > 0 && (
                                            <div className="absolute top-3 right-3 bg-yellow-400/20 backdrop-blur-sm text-yellow-400 px-2 py-1 rounded text-xs font-semibold border border-yellow-400/30">
                                                {course.structure.length} videos
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 space-y-3">
                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-richblack-5 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                                            {course.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-richblack-400 text-sm line-clamp-2">{course.description}</p>

                                        {/* Instructor */}
                                        {course.instructor && (
                                            <div className="flex items-center gap-2 text-richblack-300 text-sm">
                                                <MdPerson className="text-yellow-400 flex-shrink-0" />
                                                <span>
                                                    {course.instructor.firstName} {course.instructor.lastName}
                                                </span>
                                            </div>
                                        )}

                                        {/* Date */}
                                        <div className="text-richblack-500 text-xs">
                                            {new Date(course.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </div>

                                        {/* View Button */}
                                        <button className="w-full mt-3 bg-yellow-400 hover:bg-yellow-500 text-richblack-900 font-semibold py-2 rounded-lg transition-colors">
                                            View Course
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCoursesPage;
