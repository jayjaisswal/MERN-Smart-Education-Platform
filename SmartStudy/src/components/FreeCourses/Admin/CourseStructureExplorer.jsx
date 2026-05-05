import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import TreeNode from './TreeNode';

const CourseStructureExplorer = ({
    courseStructure,
    expandedFolders,
    editingNodeId,
    setEditingNodeId,
    editingValue,
    setEditingValue,
    editingLink,
    setEditingLink,
    onAddFolder,
    onAddFile,
    onToggle,
    onDelete,
    onRename,
    onUpdateLink,
}) => {
    return (
        <div className="bg-richblack-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-richblack-5">
                    Course Structure
                </h2>
                <button
                    onClick={() => onAddFolder()}
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-richblack-900 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <AiOutlinePlus /> Chapter
                </button>
            </div>

            {/* Tree View */}
            <div className="space-y-1 max-h-80 overflow-y-auto p-3 bg-richblack-900 rounded-lg">
                {courseStructure.length === 0 ? (
                    <p className="text-richblack-400 text-center py-6">
                        No chapters yet. Click "Add Chapter" to start.
                    </p>
                ) : (
                    courseStructure.map((node) => (
                        <TreeNode
                            key={node.id}
                            node={node}
                            expanded={expandedFolders.has(node.id)}
                            expandedFolders={expandedFolders}
                            onToggle={onToggle}
                            onAddFile={onAddFile}
                            onAddFolder={onAddFolder}
                            onDelete={onDelete}
                            onRename={onRename}
                            onUpdateLink={onUpdateLink}
                            editingNodeId={editingNodeId}
                            setEditingNodeId={setEditingNodeId}
                            editingValue={editingValue}
                            setEditingValue={setEditingValue}
                            editingLink={editingLink}
                            setEditingLink={setEditingLink}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CourseStructureExplorer;
