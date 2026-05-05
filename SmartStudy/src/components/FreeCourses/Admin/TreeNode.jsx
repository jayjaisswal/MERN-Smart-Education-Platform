import React from 'react';
import { AiOutlineDelete, AiOutlineFile, AiOutlineFolder, AiOutlineEdit } from 'react-icons/ai';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';

const TreeNode = ({
    node,
    expanded,
    expandedFolders,
    onToggle,
    onAddFile,
    onAddFolder,
    onDelete,
    onRename,
    onUpdateLink,
    editingNodeId,
    setEditingNodeId,
    editingValue,
    setEditingValue,
    editingLink,
    setEditingLink,
}) => {
    const isFolder = node.type === 'folder';
    const isEditingName = editingNodeId === `name_${node.id}`;
    const isEditingLink = editingNodeId === `link_${node.id}`;

    return (
        <div>
            <div className="flex items-center gap-2 px-2 py-1 hover:bg-richblack-700 rounded cursor-pointer group">
                {isFolder && (
                    <button
                        onClick={() => onToggle(node.id)}
                        className="p-0"
                    >
                        {expanded ? (
                            <MdKeyboardArrowDown className="text-yellow-400" />
                        ) : (
                            <MdKeyboardArrowRight className="text-yellow-400" />
                        )}
                    </button>
                )}

                {isFolder ? (
                    <AiOutlineFolder className="text-yellow-400 flex-shrink-0" />
                ) : (
                    <AiOutlineFile className="text-blue-400 flex-shrink-0" />
                )}

                {isEditingName ? (
                    <input
                        autoFocus
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => {
                            onRename(node.id, editingValue || node.name);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onRename(node.id, editingValue || node.name);
                            }
                        }}
                        className="flex-1 bg-richblack-600 text-richblack-5 px-2 py-1 rounded text-sm"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span
                        className="flex-1 text-richblack-5 text-sm"
                        onDoubleClick={() => {
                            setEditingNodeId(`name_${node.id}`);
                            setEditingValue(node.name);
                        }}
                    >
                        {node.name}
                    </span>
                )}

                {!isFolder && node.link && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        {node.contentType}
                    </span>
                )}

                {/* Actions */}
                <div className="gap-1 hidden group-hover:flex ml-auto">
                    {isFolder && (
                        <>
                            <button
                                onClick={() => onAddFile(node.id)}
                                title="Add Resource"
                                className="p-1 hover:bg-richblack-600 rounded text-richblack-300 hover:text-richblack-5"
                            >
                                <AiOutlineFile size={16} />
                            </button>
                            <button
                                onClick={() => onAddFolder(node.id)}
                                title="Add Subfolder"
                                className="p-1 hover:bg-richblack-600 rounded text-richblack-300 hover:text-richblack-5"
                            >
                                <AiOutlineFolder size={16} />
                            </button>
                        </>
                    )}
                    {!isFolder && (
                        <button
                            onClick={() => {
                                setEditingNodeId(`link_${node.id}`);
                                setEditingLink(node.link);
                            }}
                            title="Edit Link"
                            className="p-1 hover:bg-richblack-600 rounded text-richblack-300 hover:text-richblack-5"
                        >
                            <AiOutlineEdit size={16} />
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(node.id, node.parentId)}
                        title="Delete"
                        className="p-1 hover:bg-red-600 rounded text-richblack-300 hover:text-white"
                    >
                        <AiOutlineDelete size={16} />
                    </button>
                </div>
            </div>

            {/* Link Input for Files */}
            {!isFolder && isEditingLink && (
                <div className="ml-6 px-2 py-2 bg-richblack-700 rounded mt-1">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Paste YouTube link or PDF URL..."
                        value={editingLink}
                        onChange={(e) => setEditingLink(e.target.value)}
                        onBlur={() => {
                            onUpdateLink(node.id, editingLink);
                            setEditingNodeId(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onUpdateLink(node.id, editingLink);
                                setEditingNodeId(null);
                            }
                        }}
                        className="w-full bg-richblack-600 text-richblack-5 placeholder-richblack-400 rounded px-2 py-1 border border-richblack-500 focus:outline-none focus:border-yellow-400 text-sm"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Children */}
            {isFolder && expanded && node.children && (
                <div className="ml-4 border-l border-richblack-600">
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            expanded={expandedFolders.has(child.id)}
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
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeNode;
