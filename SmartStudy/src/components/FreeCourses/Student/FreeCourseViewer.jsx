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
    
    // UI Player States
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    
    const playerContainerRef = useRef(null);
    const speedMenuRef = useRef(null);
    const progressBarRef = useRef(null);
    
    // API instances
    const playerRef = useRef(null); 
    const intervalRef = useRef(null);

    // Clean up tracking timer on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (playerRef.current && playerRef.current.destroy) playerRef.current.destroy();
        };
    }, []);

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

    // Close speed dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (speedMenuRef.current && !speedMenuRef.current.contains(event.target)) {
                setShowSpeedMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load/Reinitialize YouTube API Player when selected resource changes
    useEffect(() => {
        if (!selectedResource) return;
        
        // Reset local controller states
        setIsPlaying(true);
        setProgress(0);
        setPlaybackSpeed(1);
        setShowSpeedMenu(false);
        if (intervalRef.current) clearInterval(intervalRef.current);

        const videoId = getYouTubeId(selectedResource.videoUrl || selectedResource.link || "");
        if (!videoId) return;

        const initPlayer = () => {
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }

            playerRef.current = new window.YT.Player(`yt-player-${selectedResource.id}`, {
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    rel: 0,
                    modestbranding: 1,
                    showinfo: 0,
                    iv_load_policy: 3,
                    disablekb: 1,
                    vq: 'hd1080'
                },
                events: {
                    onReady: (event) => {
                        event.target.setVolume(volume);
                        event.target.playVideo();
                        
                        // Start an interval timer to update the progress bar securely
                        intervalRef.current = setInterval(() => {
                            if (playerRef.current && playerRef.current.getCurrentTime && playerRef.current.getDuration) {
                                const current = playerRef.current.getCurrentTime();
                                const total = playerRef.current.getDuration();
                                if (total > 0) {
                                    setProgress((current / total) * 100);
                                }
                            }
                        }, 250);
                    },
                    onStateChange: (event) => {
                        // Keep track of internal player state pauses
                        if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
                        if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
                    }
                }
            });
        };

        // Inject the official script if it hasn't been loaded yet
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = initPlayer;
        } else {
            initPlayer();
        }
    }, [selectedResource]);

    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

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

    const handlePlayPause = () => {
        if (!playerRef.current) return;
        if (isPlaying) {
            playerRef.current.pauseVideo();
            setIsPlaying(false);
        } else {
            playerRef.current.playVideo();
            setIsPlaying(true);
        }
    };

    const handleVolumeChange = (e) => {
        const val = parseInt(e.target.value);
        setVolume(val);
        setIsMuted(val === 0);
        if (playerRef.current && playerRef.current.setVolume) {
            playerRef.current.setVolume(val);
        }
    };

    const handleToggleMute = () => {
        if (!playerRef.current) return;
        if (isMuted) {
            playerRef.current.unMute();
            setIsMuted(false);
            playerRef.current.setVolume(volume || 50);
        } else {
            playerRef.current.mute();
            setIsMuted(true);
        }
    };

    const changeSpeed = (speed) => {
        setPlaybackSpeed(speed);
        if (playerRef.current && playerRef.current.setPlaybackRate) {
            playerRef.current.setPlaybackRate(speed);
        }
        setShowSpeedMenu(false);
    };

    // FIXED: Guarantees navigation seeking happens smoothly via the internal Player reference API
    const handleTimelineNavigation = (e) => {
        if (!progressBarRef.current || !playerRef.current || !playerRef.current.getDuration) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickPercentage = Math.max(0, Math.min(1, clickX / rect.width));
        
        const totalDuration = playerRef.current.getDuration();
        const seekToSeconds = clickPercentage * totalDuration;

        // Force a hard jump update directly to the player instance
        playerRef.current.seekTo(seekToSeconds, true);
        setProgress(clickPercentage * 100);
        
        if (!isPlaying) {
            playerRef.current.playVideo();
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
                                    {/* FIXED: Target placeholder node element used to bind the native JavaScript API script anchor instantiation */}
                                    <div 
                                        id={`yt-player-${selectedResource.id}`} 
                                        className="absolute inset-0 w-full h-full pointer-events-none select-none" 
                                    />
                                    
                                    {/* ABSOLUTE 100% BLANKET SHIELD LAYER */}
                                    <div className="absolute inset-0 bg-transparent z-40 cursor-default" />

                                    {/* UI CUSTOM PANEL TOOLBAR OVERLAY */}
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 pt-10 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                                        
                                        {/* Clickable Progress Tracking Timeline */}
                                        <div 
                                            ref={progressBarRef}
                                            onClick={handleTimelineNavigation}
                                            className="w-full bg-richblack-600 h-2 hover:h-2.5 rounded-full relative cursor-pointer group/timeline transition-all"
                                        >
                                            <div 
                                                className="bg-yellow-50 h-full rounded-full relative"
                                                style={{ width: `${progress}%` }}
                                            >
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