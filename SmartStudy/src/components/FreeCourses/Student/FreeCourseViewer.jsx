import React, { useState, useEffect } from 'react';
import { MdClose, MdChevronRight, MdChevronLeft, MdPlayCircle, MdPerson, MdDateRange } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { fetchFreeCourseDetails } from '../../../services/operations/freeCoursesAPI';
import YouTubePlayer from './YouTubePlayer';
import toast from 'react-hot-toast';

const FreeCourseViewer = ({ courseId, onClose, allCourses = [], currentCourseIndex = 0 }) => {
    const { token } = useSelector((state) => state.auth);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        loadCourseDetails();
    }, [courseId]);

    const loadCourseDetails = async () => {
        try {
            setLoading(true);
            console.log('Loading course details for:', courseId);
            const data = await fetchFreeCourseDetails(courseId, token);
            console.log('Course details received:', data);

            if (data?.success && data?.data) {
                setCourse(data.data);
                setSelectedVideoIndex(0);
            } else if (data?.data) {
                setCourse(data.data);
                setSelectedVideoIndex(0);
            } else {
                toast.error('Failed to load course details');
            }
        } catch (error) {
            console.error('Error loading course details:', error);
            toast.error('Failed to load course details');
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateVideo = (direction) => {
        if (!course?.structure) return;

        const newIndex = selectedVideoIndex + direction;
        if (newIndex >= 0 && newIndex < course.structure.length) {
            setSelectedVideoIndex(newIndex);
        }
    };

    const handleNavigateCourse = (direction) => {
        const newIndex = currentCourseIndex + direction;
        if (newIndex >= 0 && newIndex < allCourses.length) {
            const newCourse = allCourses[newIndex];
            // Update courseId and reload
            window.location.hash = `course-${newCourse._id}`;
            // In a real app, you'd use a routing mechanism here
        }
    };

    const currentVideo = course?.structure?.[selectedVideoIndex];

    return (
        <div className="fixed inset-0 z-50 bg-richblack-900/95 overflow-auto">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="fixed top-4 right-4 z-50 bg-richblack-800 hover:bg-richblack-700 text-richblack-5 p-2 rounded-full transition-colors shadow-lg"
            >
                <MdClose size={28} />
            </button>

            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-richblack-700 border-t-yellow-400" />
                </div>
            ) : (
                course && (
                    <div className="max-w-7xl mx-auto p-4 md:p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-richblack-5 mb-3">{course.title}</h1>
                            <p className="text-richblack-300 text-lg mb-4">{course.description}</p>

                            {/* Course Info */}
                            <div className="flex flex-wrap gap-6 text-richblack-300">
                                {course.instructor && (
                                    <div className="flex items-center gap-2">
                                        <MdPerson className="text-yellow-400 text-xl flex-shrink-0" />
                                        <span>
                                            {course.instructor.firstName} {course.instructor.lastName}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <MdDateRange className="text-yellow-400 text-xl flex-shrink-0" />
                                    <span>
                                        {new Date(course.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <MdPlayCircle className="text-yellow-400 text-xl flex-shrink-0" />
                                    <span>{course.structure?.length || 0} videos</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        {course.structure && course.structure.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Video Player */}
                                <div className="lg:col-span-2 space-y-4">
                                    {currentVideo?.videoUrl ? (
                                        <YouTubePlayer
                                            url={currentVideo.videoUrl}
                                            title={currentVideo.title || `Video ${selectedVideoIndex + 1}`}
                                            onClose={() => setFullscreen(!fullscreen)}
                                            fullscreen={fullscreen}
                                        />
                                    ) : (
                                        <div className="aspect-video bg-richblack-800 rounded-lg border border-richblack-700 flex items-center justify-center">
                                            <p className="text-richblack-400">Video not available</p>
                                        </div>
                                    )}

                                    {/* Video Navigation */}
                                    <div className="flex items-center justify-between gap-4">
                                        <button
                                            onClick={() => handleNavigateVideo(-1)}
                                            disabled={selectedVideoIndex === 0}
                                            className="flex items-center gap-2 px-4 py-2 bg-richblack-700 hover:bg-richblack-600 disabled:opacity-50 disabled:cursor-not-allowed text-richblack-5 rounded-lg transition-colors"
                                        >
                                            <MdChevronLeft size={20} />
                                            Previous
                                        </button>

                                        <span className="text-richblack-300">
                                            Video {selectedVideoIndex + 1} of {course.structure.length}
                                        </span>

                                        <button
                                            onClick={() => handleNavigateVideo(1)}
                                            disabled={selectedVideoIndex === course.structure.length - 1}
                                            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-richblack-900 rounded-lg transition-colors font-semibold"
                                        >
                                            Next
                                            <MdChevronRight size={20} />
                                        </button>
                                    </div>

                                    {/* Video Details */}
                                    {currentVideo?.title && (
                                        <div className="bg-richblack-800 rounded-lg p-4 border border-richblack-700">
                                            <h3 className="text-lg font-semibold text-richblack-5 mb-2">{currentVideo.title}</h3>
                                            {currentVideo.description && (
                                                <p className="text-richblack-400">{currentVideo.description}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Playlist Sidebar */}
                                <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-4 h-fit">
                                    <h3 className="text-lg font-bold text-richblack-5 mb-4">Course Content</h3>

                                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                        {course.structure.map((video, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedVideoIndex(index)}
                                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors border ${index === selectedVideoIndex
                                                    ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400'
                                                    : 'border-richblack-700 text-richblack-300 hover:bg-richblack-700'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <MdPlayCircle className="flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium truncate">
                                                            {video.title || `Video ${index + 1}`}
                                                        </p>
                                                        <p className="text-xs opacity-75">
                                                            {index === selectedVideoIndex ? 'Playing' : `Video ${index + 1}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-richblack-800 rounded-lg border border-richblack-700">
                                <p className="text-richblack-400 text-lg">No videos added to this course yet</p>
                            </div>
                        )}

                        {/* Course Navigation (if multiple courses) */}
                        {allCourses.length > 1 && (
                            <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-richblack-700">
                                <button
                                    onClick={() => handleNavigateCourse(-1)}
                                    disabled={currentCourseIndex === 0}
                                    className="flex items-center gap-2 px-4 py-2 bg-richblack-700 hover:bg-richblack-600 disabled:opacity-50 disabled:cursor-not-allowed text-richblack-5 rounded-lg transition-colors"
                                >
                                    <MdChevronLeft size={20} />
                                    Previous Course
                                </button>

                                <span className="text-richblack-300 text-sm">
                                    Course {currentCourseIndex + 1} of {allCourses.length}
                                </span>

                                <button
                                    onClick={() => handleNavigateCourse(1)}
                                    disabled={currentCourseIndex === allCourses.length - 1}
                                    className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-richblack-900 rounded-lg transition-colors font-semibold"
                                >
                                    Next Course
                                    <MdChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default FreeCourseViewer;
