import React from 'react';
import { useFreeCourseManagement } from './useFreeCourseManagement';
import MyCoursesList from './MyCoursesList';
import CourseDetailsForm from './CourseDetailsForm';
import CourseStructureExplorer from './CourseStructureExplorer';

const CreateFreeCourse = () => {
    const {
        // State
        courseName,
        setCourseName,
        courseDescription,
        setCourseDescription,
        isPublic,
        setIsPublic,
        courseStructure,
        expandedFolders,
        editingNodeId,
        setEditingNodeId,
        editingValue,
        setEditingValue,
        editingLink,
        setEditingLink,
        myCourses,
        selectedCourse,
        editingCourseId,

        // Methods
        toggleFolder,
        addFolder,
        addFile,
        deleteNode,
        renameNode,
        updateFileLink,
        saveCourse,
        editCourse,
        deleteCourse,
        toggleCoursePrivacy,
        createNewCourse,
    } = useFreeCourseManagement();

    return (
        <div className="min-h-screen bg-richblack-900 pt-20 pb-10">
            <div className="w-11/12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-richblack-5 mb-2">
                        Create Free Course
                    </h1>
                    <p className="text-richblack-300">
                        Build your course structure with chapters and resources
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* My Courses List */}
                    <MyCoursesList
                        myCourses={myCourses}
                        selectedCourse={selectedCourse}
                        onNewCourse={createNewCourse}
                        onSelectCourse={editCourse}
                        onTogglePrivacy={toggleCoursePrivacy}
                        onDeleteCourse={deleteCourse}
                    />

                    {/* Main Editor */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Course Details Form */}
                        <CourseDetailsForm
                            editingCourseId={editingCourseId}
                            courseName={courseName}
                            setCourseName={setCourseName}
                            courseDescription={courseDescription}
                            setCourseDescription={setCourseDescription}
                            isPublic={isPublic}
                            setIsPublic={setIsPublic}
                            onSave={saveCourse}
                        />

                        {/* Course Structure Explorer */}
                        <CourseStructureExplorer
                            courseStructure={courseStructure}
                            expandedFolders={expandedFolders}
                            editingNodeId={editingNodeId}
                            setEditingNodeId={setEditingNodeId}
                            editingValue={editingValue}
                            setEditingValue={setEditingValue}
                            editingLink={editingLink}
                            setEditingLink={setEditingLink}
                            onAddFolder={addFolder}
                            onAddFile={addFile}
                            onToggle={toggleFolder}
                            onDelete={deleteNode}
                            onRename={renameNode}
                            onUpdateLink={updateFileLink}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateFreeCourse;
