import React from 'react';
import { AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';

const MyCoursesList = ({
    myCourses,
    selectedCourse,
    onNewCourse,
    onSelectCourse,
    onTogglePrivacy,
    onDeleteCourse,
}) => {
    return (
        <div className="bg-richblack-800 rounded-lg p-6">
            <h2 className="text-lg font-bold text-richblack-5 mb-4">
                My Courses ({myCourses.length})
            </h2>

            <button
                onClick={onNewCourse}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-richblack-900 font-semibold py-2 rounded-lg mb-4 transition-colors flex items-center justify-center gap-2"
            >
                <AiOutlinePlus /> New Course
            </button>

            <div className="space-y-2 max-h-96 overflow-y-auto">
                {myCourses.length === 0 ? (
                    <p className="text-richblack-400 text-center py-4">
                        No courses yet
                    </p>
                ) : (
                    myCourses.map((course) => (
                        <div
                            key={course.id}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${selectedCourse?.id === course.id
                                    ? 'bg-yellow-600'
                                    : 'bg-richblack-700 hover:bg-richblack-600'
                                }`}
                            onClick={() => onSelectCourse(course)}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-richblack-5 text-sm font-medium truncate">
                                        {course.name}
                                    </p>
                                    <p className="text-richblack-400 text-xs">
                                        {course.structure.length} chapters
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onTogglePrivacy(course.id);
                                        }}
                                        className="p-1 bg-richblack-600 hover:bg-richblack-500 rounded text-xs text-richblack-300"
                                        title={course.isPublic ? 'Make Private' : 'Make Public'}
                                    >
                                        {course.isPublic ? '🌍' : '🔒'}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteCourse(course.id);
                                        }}
                                        className="p-1 bg-red-600 hover:bg-red-500 rounded text-xs"
                                    >
                                        <AiOutlineDelete className="text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyCoursesList;
