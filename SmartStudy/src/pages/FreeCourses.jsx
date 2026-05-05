import React, { useState } from 'react';
import { AiOutlineFile, AiOutlineFolder } from 'react-icons/ai';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { FaYoutube, FaFilePdf, FaLink } from 'react-icons/fa';

const FreeCourses = () => {
    // Mock data - will come from API
    const [courses] = useState([
        {
            id: 1,
            name: 'Python Basics',
            description: 'Learn Python programming from scratch',
            isPublic: true,
            structure: [
                {
                    id: 'ch1',
                    name: 'Chapter 1: Introduction',
                    type: 'folder',
                    children: [
                        {
                            id: 'l1',
                            name: 'What is Python?',
                            type: 'file',
                            link: 'https://youtu.be/dQw4w9WgXcQ',
                            contentType: 'video',
                        },
                        {
                            id: 'l2',
                            name: 'Setup Guide',
                            type: 'file',
                            link: 'https://example.com/setup.pdf',
                            contentType: 'pdf',
                        },
                    ],
                },
                {
                    id: 'ch2',
                    name: 'Chapter 2: Variables',
                    type: 'folder',
                    children: [
                        {
                            id: 'l3',
                            name: 'Variables Explained',
                            type: 'file',
                            link: 'https://youtu.be/dQw4w9WgXcQ',
                            contentType: 'video',
                        },
                    ],
                },
            ],
        },
    ]);

    const [selectedItem, setSelectedItem] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState(new Set());

    const toggleFolder = (id) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedFolders(newExpanded);
    };

    const renderResource = (item) => {
        if (!item || !item.link) return null;

        const urlObj = new URL(item.link);
        let videoId = null;

        // Extract YouTube video ID
        if (item.link.includes('youtube.com') || item.link.includes('youtu.be')) {
            if (item.link.includes('youtube.com')) {
                videoId = urlObj.searchParams.get('v');
            } else {
                videoId = item.link.split('youtu.be/')[1];
            }
        }

        if (item.contentType === 'video' && videoId) {
            return (
                <div className="w-full aspect-video">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={item.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            );
        }

        if (item.contentType === 'pdf') {
            return (
                <div className="w-full h-[600px]">
                    <iframe
                        src={item.link}
                        width="100%"
                        height="100%"
                        title={item.name}
                    ></iframe>
                </div>
            );
        }

        return (
            <div className="bg-richblack-700 rounded-lg p-6 text-center">
                <FaLink className="text-4xl text-yellow-400 mx-auto mb-4" />
                <p className="text-richblack-200 mb-4">External Link</p>
                <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-yellow-400 hover:bg-yellow-500 text-richblack-900 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                    Open Link
                </a>
            </div>
        );
    };

    const CourseCard = ({ course }) => (
        <div className="bg-richblack-800 rounded-lg overflow-hidden flex h-96">
            {/* Sidebar Explorer */}
            <div className="w-64 bg-richblack-900 border-r border-richblack-700 overflow-y-auto">
                <div className="p-4 border-b border-richblack-700">
                    <h3 className="text-richblack-5 font-semibold text-sm truncate">
                        {course.name}
                    </h3>
                </div>
                <TreeExplorer
                    items={course.structure}
                    expandedFolders={expandedFolders}
                    onToggle={toggleFolder}
                    onSelectItem={setSelectedItem}
                    selectedItem={selectedItem}
                />
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-richblack-800 p-6 overflow-y-auto">
                {selectedItem ? (
                    <div>
                        <h4 className="text-xl font-bold text-richblack-5 mb-4">
                            {selectedItem.name}
                        </h4>
                        {renderResource(selectedItem)}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <AiOutlineFolder className="text-6xl text-richblack-500 mx-auto mb-4" />
                            <p className="text-richblack-400">
                                Select a resource from the sidebar to view content
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-richblack-900 pt-20 pb-10">
            <div className="w-11/12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-richblack-5 mb-2">
                        Free Courses
                    </h1>
                    <p className="text-richblack-300">
                        Access our collection of free learning materials
                    </p>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Tree Explorer Component
const TreeExplorer = ({
    items,
    expandedFolders,
    onToggle,
    onSelectItem,
    selectedItem,
}) => {
    return (
        <div className="space-y-1 text-sm">
            {items.map((item) => (
                <TreeItem
                    key={item.id}
                    item={item}
                    expandedFolders={expandedFolders}
                    onToggle={onToggle}
                    onSelectItem={onSelectItem}
                    selectedItem={selectedItem}
                />
            ))}
        </div>
    );
};

// Tree Item Component
const TreeItem = ({
    item,
    expandedFolders,
    onToggle,
    onSelectItem,
    selectedItem,
}) => {
    const isFolder = item.type === 'folder';
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedItem?.id === item.id;

    return (
        <div>
            <div
                onClick={() => {
                    if (isFolder) {
                        onToggle(item.id);
                    } else {
                        onSelectItem(item);
                    }
                }}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded hover:bg-richblack-700 transition-colors ${isSelected ? 'bg-richblack-700' : ''
                    }`}
            >
                {isFolder && (
                    <button className="p-0">
                        {isExpanded ? (
                            <MdKeyboardArrowDown className="text-yellow-400" size={16} />
                        ) : (
                            <MdKeyboardArrowRight className="text-yellow-400" size={16} />
                        )}
                    </button>
                )}

                {isFolder ? (
                    <AiOutlineFolder className="text-yellow-400 flex-shrink-0" size={16} />
                ) : (
                    <ResourceIcon contentType={item.contentType} />
                )}

                <span className="text-richblack-200 truncate text-xs font-medium">
                    {item.name}
                </span>
            </div>

            {isFolder && isExpanded && item.children && (
                <div className="ml-2 border-l border-richblack-600 pl-1">
                    <TreeExplorer
                        items={item.children}
                        expandedFolders={expandedFolders}
                        onToggle={onToggle}
                        onSelectItem={onSelectItem}
                        selectedItem={selectedItem}
                    />
                </div>
            )}
        </div>
    );
};

// Resource Icon Component
const ResourceIcon = ({ contentType }) => {
    switch (contentType) {
        case 'video':
            return <FaYoutube className="text-red-500 flex-shrink-0" size={14} />;
        case 'pdf':
            return <FaFilePdf className="text-red-600 flex-shrink-0" size={14} />;
        default:
            return <FaLink className="text-blue-400 flex-shrink-0" size={14} />;
    }
};

export default FreeCourses;
