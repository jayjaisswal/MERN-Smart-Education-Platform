import React, { useState, useEffect } from 'react';
import { 
    MdClose, MdMenu, MdFolder, MdInsertDriveFile, 
    MdPlayCircleOutline, MdKeyboardArrowDown, MdKeyboardArrowRight 
} from 'react-icons/md';
import { useSelector } from 'react-redux';
import { fetchFreeCourseDetails } from '../../../services/operations/freeCoursesAPI';
import toast from 'react-hot-toast';

const SidebarItem = ({ item, level = 0, onSelect, selectedId, closeMobileSidebar }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isFolder = item.type === 'folder';
    const isSelected = selectedId === item.id;

    const handleToggle = () => {
        if (isFolder) {
            setIsOpen(!isOpen);
        } else {
            onSelect(item);
            // Close sidebar on mobile after selection
            if (window.innerWidth < 768) closeMobileSidebar();
        }
    };

    return (
        <div className="w-full">
            <div
                onClick={handleToggle}
                className={`flex items-center gap-2 py-3 px-3 cursor-pointer transition-all duration-200 rounded-md my-1
                    ${isSelected 
                        ? 'bg-yellow-100 text-richblack-900 font-bold shadow-md' 
                        : 'text-richblack-300 hover:bg-richblack-800 hover:text-richblack-5'}
                `}
                style={{ paddingLeft: `${level * 12 + 12}px` }}
            >
                {isFolder ? (
                    <>
                        {isOpen ? <MdKeyboardArrowDown size={18} /> : <MdKeyboardArrowRight size={18} />}
                        <MdFolder className="text-yellow-400 flex-shrink-0" size={20} />
                    </>
                ) : (
                    <div className="w-5 flex justify-center">
                        {item.contentType === 'video' || item.link?.includes('youtube') 
                            ? <MdPlayCircleOutline size={20} className="text-caribbeangreen-200" /> 
                            : <MdInsertDriveFile size={18} className="text-blue-200" />
                        }
                    </div>
                )}
                <span className="truncate text-sm select-none">{item.name}</span>
            </div>

            {isFolder && isOpen && item.children && (
                <div className="border-l border-richblack-700 ml-4">
                    {item.children.map((child) => (
                        <SidebarItem 
                            key={child.id} 
                            item={child} 
                            level={level + 1} 
                            onSelect={onSelect} 
                            selectedId={selectedId}
                            closeMobileSidebar={closeMobileSidebar}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const FreeCourseViewer = ({ courseId, onClose }) => {
    const { token } = useSelector((state) => state.auth);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedResource, setSelectedResource] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile

    useEffect(() => {
        // Open sidebar by default only on large screens
        if (window.innerWidth >= 1024) setIsSidebarOpen(true);
        
        const loadData = async () => {
            try {
                setLoading(true);
                const response = await fetchFreeCourseDetails(courseId, token);
                if (response?.data) {
                    setCourse(response.data);
                    const firstFile = findFirstFile(response.data.structure);
                    setSelectedResource(firstFile);
                }
            } catch (err) {
                toast.error("Error loading course content");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [courseId, token]);

    const findFirstFile = (nodes) => {
        if (!nodes) return null;
        for (let node of nodes) {
            if (node.type === 'file') return node;
            if (node.children) {
                const found = findFirstFile(node.children);
                if (found) return found;
            }
        }
        return null;
    };

    const getEmbedUrl = (resource) => {
        if (!resource) return null;
        const url = resource.videoUrl || resource.link || "";
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            const videoId = (match && match[2].length === 11) ? match[2] : null;
            if (videoId) {
                const origin = window.location.origin;
                return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(origin)}`;
            }
        }
        if (url.includes('drive.google.com')) {
            return url.replace(/\/view.*|\/edit.*/, '/preview');
        }
        return url;
    };

    if (loading) return (
        <div className="fixed inset-0 z-[100] bg-richblack-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-100"></div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex bg-richblack-900 text-white overflow-hidden font-inter">
            
            {/* MOBILE OVERLAY BACKDROP */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-[110] md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <div className={`
                fixed md:relative z-[120] md:z-auto
                h-full transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full md:translate-x-0 md:w-0'}
                border-r border-richblack-700 bg-richblack-800 flex flex-col overflow-hidden
            `}>
                <div className="p-4 border-b border-richblack-700 bg-richblack-900 h-14 flex items-center justify-between">
                    <h2 className="font-bold text-yellow-50 truncate">Course Content</h2>
                    <button className="md:hidden text-richblack-200" onClick={() => setIsSidebarOpen(false)}>
                        <MdClose size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {course?.structure?.map((item) => (
                        <SidebarItem 
                            key={item.id} 
                            item={item} 
                            onSelect={setSelectedResource} 
                            selectedId={selectedResource?.id}
                            closeMobileSidebar={() => setIsSidebarOpen(false)}
                        />
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col relative min-w-0 bg-richblack-900">
                
                {/* Header Nav */}
                <div className="h-14 border-b border-richblack-700 flex items-center justify-between px-4 bg-richblack-800 shadow-md">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                            className="p-2 hover:bg-richblack-700 rounded-lg text-richblack-100"
                        >
                            <MdMenu size={24} />
                        </button>
                        <p className="text-sm font-medium text-richblack-50 truncate max-w-[150px] sm:max-w-[300px]">
                            {course?.title}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-pink-700/20 text-richblack-5 rounded-full transition-all">
                        <MdClose size={24} />
                    </button>
                </div>

                {/* Player container */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-10">
                    <div className="max-w-4xl mx-auto w-full">
                        {/* Responsive Video Container */}
                        <div className="relative w-full aspect-video bg-black rounded-lg sm:rounded-xl overflow-hidden border border-richblack-700 shadow-2xl">
                            {selectedResource ? (
                                <iframe
                                    key={selectedResource.id}
                                    src={getEmbedUrl(selectedResource)}
                                    className="absolute inset-0 w-full h-full border-0"
                                    allow="autoplay; fullscreen; encrypted-media; gyroscope; picture-in-picture"
                                    title={selectedResource.name}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-richblack-400 font-medium px-4 text-center">
                                    Select a lesson from the menu to begin
                                </div>
                            )}
                        </div>

                        {/* Content Info */}
                        <div className="mt-4 sm:mt-6 bg-richblack-800 p-4 sm:p-6 rounded-xl border border-richblack-700">
                            <h2 className="text-xl sm:text-2xl font-semibold text-richblack-5">
                                {selectedResource?.name || "Welcome"}
                            </h2>
                            <div className="h-[1px] bg-richblack-700 my-3 sm:my-4"></div>
                            <p className="text-richblack-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                                {course?.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreeCourseViewer;