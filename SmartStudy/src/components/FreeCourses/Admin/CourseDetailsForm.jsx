import React from 'react';

const CourseDetailsForm = ({
    editingCourseId,
    courseName,
    setCourseName,
    courseDescription,
    setCourseDescription,
    isPublic,
    setIsPublic,
    onSave,
}) => {
    return (
        <div className="bg-richblack-800 rounded-lg p-6">
            <h2 className="text-lg font-bold text-richblack-5 mb-4">
                {editingCourseId ? 'Edit Course' : 'New Course'}
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-richblack-200 font-medium mb-2">
                        Course Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Python Basics"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="w-full bg-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-lg px-4 py-2 border border-richblack-600 focus:outline-none focus:border-yellow-400"
                    />
                </div>

                <div>
                    <label className="block text-richblack-200 font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        placeholder="Course description..."
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        rows="3"
                        className="w-full bg-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-lg px-4 py-2 border border-richblack-600 focus:outline-none focus:border-yellow-400"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="w-4 h-4 accent-yellow-400"
                        />
                        <label htmlFor="isPublic" className="text-richblack-200">
                            Make Public
                        </label>
                    </div>
                    <button
                        onClick={onSave}
                        className="bg-yellow-400 hover:bg-yellow-500 text-richblack-900 font-semibold px-6 py-2 rounded-lg transition-colors"
                    >
                        {editingCourseId ? 'Update' : 'Save'} Course
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsForm;
