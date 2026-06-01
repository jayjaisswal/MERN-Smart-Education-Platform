import React, { useState, useEffect, useRef } from 'react';
import { 
    MdClose, MdMenu, MdFolder, MdInsertDriveFile, 
    MdPlayCircleOutline, MdKeyboardArrowDown, MdKeyboardArrowRight,
    MdPlayArrow, MdPause, MdFullscreen, MdVolumeUp, MdVolumeMute,
    MdSpeed
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // UI Player Custom States
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0); // Added to store total video length in seconds
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    
    const playerContainerRef = useRef(null);
    const iframeRef = useRef(null);
    const speedMenuRef = useRef(null);
    const progressBarRef = useRef(null); // Added to target bounds for timeline navigation coordinates

    useEffect(() => {
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (speedMenuRef.current && !speedMenuRef.current.contains(event.target)) {
                setShowSpeedMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset player states on video switch
    useEffect(() => {
        setIsPlaying(true);
        setProgress(0);
        setVideoDuration(0);
        setPlaybackSpeed(1);
        setShowSpeedMenu(false);
    }, [selectedResource]);

    // Handle incoming tracking analytics frame messages from YouTube embed
    useEffect(() => {
        const handlePlayerMessages = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.event === 'infoDelivery' && data.info) {
                    // Update total duration if received from the API stream
                    if (data.info.duration) {
                        setVideoDuration(data.info.duration);
                    }
                    // Update current live progress visual slider line
                    if (data.info.currentTime && data.info.duration) {
                        const currentProgress = (data.info.currentTime / data.info.duration) * 100;
                        setProgress(currentProgress);
                    } else if (data.info.currentTime && videoDuration) {
                        const currentProgress = (data.info.currentTime / videoDuration) * 100;
                        setProgress(currentProgress);
                    }
                }
            } catch (e) {
                // Ignore safe noise
            }
        };

        window.addEventListener('message', handlePlayerMessages);
        return () => window.removeEventListener('message', handlePlayerMessages);
    }, [videoDuration]);

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
                return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&disablekb=1&enablejsapi=1&vq=hd1080&origin=${encodeURIComponent(origin)}`;
            }
        }
        if (url.includes('drive.google.com')) {
            return url.replace(/\/view.*|\/edit.*/, '/preview');
        }
        return url;
    };

    const postToIframe = (command, args = []) => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: command, args: args }),
                '*'
            );
        }
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            postToIframe('pauseVideo');
            setIsPlaying(false);
        } else {
            postToIframe('playVideo');
            setIsPlaying(true);
        }
    };

    const handleVolumeChange = (e) => {
        const val = parseInt(e.target.value);
        setVolume(val);
        setIsMuted(val === 0);
        postToIframe('setVolume', [val]);
    };

    const handleToggleMute = () => {
        if (isMuted) {
            postToIframe('unMute');
            setIsMuted(false);
            postToIframe('setVolume', [volume || 50]);
        } else {
            postToIframe('mute');
            setIsMuted(true);
        }
    };

    const changeSpeed = (speed) => {
        setPlaybackSpeed(speed);
        postToIframe('setPlaybackRate', [speed]);
        setShowSpeedMenu(false);
    };

    // ADDED: Navigation click handler function to rewrite active timestamp on hidden player
    const handleTimelineNavigation = (e) => {
        if (!progressBarRef.current || !videoDuration) return;

        // Get bounding geometry of custom tracking bar container
        const rect = progressBarRef.current.getBoundingClientRect();
        // Calculate dynamic horizontal distance coordinate from starting boundary point
        const clickX = e.clientX - rect.left;
        // Turn positional coordinate into percentage factor
        const clickPercentage = Math.max(0, Math.min(1, clickX / rect.width));
        // Compute corresponding timeline target match location point index
        const seekToSeconds = clickPercentage * videoDuration;

        // Instantly seek video frame to chosen location timestamp through background API
        postToIframe('seekTo', [seekToSeconds, true]);
        setProgress(clickPercentage * 100);
        
        // Force track layout back into absolute streaming pattern state automatically
        if (!isPlaying) {
            postToIframe('playVideo');
            setIsPlaying(true);
        }
    };

    const handleFullscreen = () => {
        if (playerContainerRef.current) {
            if (!document.fullscreenElement) {
                playerContainerRef.current.requestFullscreen().catch(() => {
                    toast.error("Error enabling fullscreen");
                });
            } else {
                document.exitFullscreen();
            }
        }
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
                        <div 
                            ref={playerContainerRef}
                            className="relative w-full aspect-video bg-black rounded-lg sm:rounded-xl overflow-hidden border border-richblack-700 shadow-2xl group"
                        >
                            {selectedResource ? (
                                <>
                                    <iframe
                                        ref={iframeRef}
                                        key={selectedResource.id}
                                        src={getEmbedUrl(selectedResource)}
                                        className="absolute inset-0 w-full h-full border-0 select-none pointer-events-none"
                                        allow="autoplay; fullscreen; encrypted-media; gyroscope; picture-in-picture"
                                        title={selectedResource.name}
                                    />
                                    
                                    {/* ABSOLUTE 100% BLANKET SHIELD LAYER */}
                                    <div className="absolute inset-0 bg-transparent z-40 cursor-default" />

                                    {/* UI CUSTOM PANEL TOOLBAR OVERLAY */}
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 pt-10 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                                        
                                        {/* CHANGED: Clickable Progress Tracking Timeline Wrapper Container bar */}
                                        <div 
                                            ref={progressBarRef}
                                            onClick={handleTimelineNavigation}
                                            className="w-full bg-richblack-600 h-2 hover:h-2.5 rounded-full relative cursor-pointer group/timeline transition-all"
                                        >
                                            <div 
                                                className="bg-yellow-50 h-full rounded-full transition-all duration-100 ease-linear relative"
                                                style={{ width: `${progress}%` }}
                                            >
                                                {/* Visual scrubber handle indicator node tip circle */}
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-yellow-50 rounded-full scale-0 group-hover/timeline:scale-100 transition-transform shadow-md" />
                                            </div>
                                        </div>

                                        {/* Bottom Action Line Controls */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {/* Play/Pause Button */}
                                                <button 
                                                    onClick={handlePlayPause}
                                                    className="p-1.5 bg-yellow-100 text-richblack-900 rounded-full hover:scale-105 transition-transform"
                                                >
                                                    {isPlaying ? <MdPause size={20} /> : <MdPlayArrow size={20} />}
                                                </button>

                                                {/* Volume Control Elements */}
                                                <div className="flex items-center gap-2 group/vol">
                                                    <button onClick={handleToggleMute} className="text-richblack-100 hover:text-yellow-50">
                                                        {isMuted ? <MdVolumeMute size={22} /> : <MdVolumeUp size={22} />}
                                                    </button>
                                                    <input 
                                                        type="range" 
                                                        min="0" 
                                                        max="100" 
                                                        value={isMuted ? 0 : volume} 
                                                        onChange={handleVolumeChange}
                                                        className="w-14 sm:w-20 h-1 bg-richblack-600 rounded-lg appearance-none cursor-pointer accent-yellow-50"
                                                    />
                                                </div>

                                                {/* Speed Menu */}
                                                <div className="relative" ref={speedMenuRef}>
                                                    <button 
                                                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                                        className="flex items-center gap-1 text-xs font-semibold bg-richblack-700/80 hover:bg-richblack-600 text-richblack-100 hover:text-yellow-50 px-2 py-1 rounded transition-colors"
                                                    >
                                                        <MdSpeed size={16} />
                                                        <span>{playbackSpeed}x</span>
                                                    </button>
                                                    
                                                    {showSpeedMenu && (
                                                        <div className="absolute bottom-full left-0 mb-2 bg-richblack-800 border border-richblack-600 rounded-lg overflow-hidden shadow-xl flex flex-col min-w-[70px]">
                                                            {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                                                                <button
                                                                    key={speed}
                                                                    onClick={() => changeSpeed(speed)}
                                                                    className={`text-xs px-3 py-1.5 text-left transition-colors font-medium
                                                                        ${playbackSpeed === speed 
                                                                            ? 'bg-yellow-100 text-richblack-900 font-bold' 
                                                                            : 'text-richblack-100 hover:bg-richblack-700'}`}
                                                                >
                                                                    {speed}x
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <span className="text-xs sm:text-sm font-medium text-richblack-25 select-none truncate max-w-[100px] sm:max-w-xs">
                                                    {selectedResource.name}
                                                </span>
                                            </div>

                                            {/* Fullscreen Trigger */}
                                            <button 
                                                onClick={handleFullscreen}
                                                className="p-1.5 text-richblack-100 hover:text-yellow-50 hover:bg-richblack-700/50 rounded-lg transition-colors"
                                            >
                                                <MdFullscreen size={22} />
                                            </button>
                                        </div>
                                    </div>
                                </>
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