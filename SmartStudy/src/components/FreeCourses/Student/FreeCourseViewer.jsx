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
    
    // Real-time clock displays
    const [currentTimeDisplay, setCurrentTimeDisplay] = useState("0:00");
    const [totalDurationDisplay, setTotalDurationDisplay] = useState("0:00");
    
    // Hover & Touch position time state variables
    const [hoverTimeDisplay, setHoverTimeDisplay] = useState("");
    const [hoverPositionStyle, setHoverPositionStyle] = useState({ display: 'none', left: '0px' });
    
    // Double tap timestamp reference for fast skip trigger tracking on screens
    const lastTapRef = useRef({ time: 0, x: 0, y: 0 });
    
    // Retain user timestamp history mapping state
    const [playbackHistory, setPlaybackHistory] = useState({});
    
    const playerContainerRef = useRef(null);
    const speedMenuRef = useRef(null);
    const progressBarRef = useRef(null);
    
    // API references
    const playerRef = useRef(null); 
    const intervalRef = useRef(null);

    // Dynamic type evaluation context block
    const resourceUrl = selectedResource?.videoUrl || selectedResource?.link || "";
    const isVideo = selectedResource?.contentType === 'video' || resourceUrl.includes('youtube.com') || resourceUrl.includes('youtu.be');

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

    // Hotkey Keyboard Router (Spacebar, Left Arrow, Right Arrow)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedResource || !playerRef.current || !isVideo) return;
            const activeEl = document.activeElement?.tagName.toLowerCase();
            if (activeEl === 'input' || activeEl === 'textarea') return;

            if (e.code === 'Space') {
                e.preventDefault(); 
                handlePlayPause();
            }
            
            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                skipBackward();
            }

            if (e.code === 'ArrowRight') {
                e.preventDefault();
                skipForward();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedResource, isPlaying, isVideo]); 

    // Skip Handlers Shared via Buttons / Hotkeys / Double Taps
    const skipBackward = () => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
            const current = playerRef.current.getCurrentTime();
            const newTime = Math.max(0, current - 10);
            playerRef.current.seekTo(newTime, true);
            toast.success("← 10s", { duration: 500, id: "skip-toast" });
        }
    };

    const skipForward = () => {
        if (playerRef.current && playerRef.current.getCurrentTime && playerRef.current.getDuration) {
            const current = playerRef.current.getCurrentTime();
            const total = playerRef.current.getDuration();
            const newTime = Math.min(total, current + 10);
            playerRef.current.seekTo(newTime, true);
            toast.success("10s →", { duration: 500, id: "skip-toast" });
        }
    };

    // Mobile/Desktop Double Tap Screen Interaction Router Hook
    const handleStageInteractionTouch = (e) => {
        if (!isVideo || !playerRef.current) return;
        
        const now = Date.now();
        const doubleTapDelay = 300;
        const currentTouch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        
        const touchX = currentTouch.clientX - rect.left;
        const widthPercentage = touchX / rect.width;

        if (now - lastTapRef.current.time < doubleTapDelay) {
            if (widthPercentage <= 0.35) {
                skipBackward();
            } else if (widthPercentage >= 0.65) {
                skipForward();
            } else {
                handlePlayPause();
            }
        }
        lastTapRef.current = { time: now, x: currentTouch.clientX, y: currentTouch.clientY };
    };

    // Helper to format raw seconds to human readable clock strings
    const formatTimeDisplay = (timeInSeconds) => {
        if (isNaN(timeInSeconds) || timeInSeconds === null) return "0:00";
        const mins = Math.floor(timeInSeconds / 60);
        const secs = Math.floor(timeInSeconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Universal coordinate calculator for Hover & Touch Movements
    const calculateTimeAtTrackCoordinate = (clientX, targetElement) => {
        const rect = targetElement.getBoundingClientRect();
        const coordinateX = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, coordinateX / rect.width));
        const totalDuration = playerRef.current ? playerRef.current.getDuration() : 0;
        
        return {
            timeStr: formatTimeDisplay(percentage * totalDuration),
            percentage: percentage,
            styleLeft: `${Math.max(10, Math.min(rect.width - 10, coordinateX))}px`
        };
    };

    const handleProgressBarMouseMove = (e) => {
        if (!progressBarRef.current || !playerRef.current || !playerRef.current.getDuration) return;
        const { timeStr, styleLeft } = calculateTimeAtTrackCoordinate(e.clientX, progressBarRef.current);
        setHoverTimeDisplay(timeStr);
        setHoverPositionStyle({ display: 'block', left: styleLeft });
    };

    const handleProgressBarTouchMove = (e) => {
        if (!progressBarRef.current || !playerRef.current || !playerRef.current.getDuration) return;
        e.preventDefault();
        const touch = e.touches[0];
        const { timeStr, styleLeft } = calculateTimeAtTrackCoordinate(touch.clientX, progressBarRef.current);
        setHoverTimeDisplay(timeStr);
        setHoverPositionStyle({ display: 'block', left: styleLeft });
    };

    const handleProgressBarMouseLeave = () => {
        setHoverPositionStyle({ display: 'none', left: '0px' });
    };

    // Non-passive touch listener on progress bar so preventDefault works and tooltip shows
    useEffect(() => {
        const el = progressBarRef.current;
        if (!el) return;
        const onTouchMove = (e) => {
            if (!playerRef.current || !playerRef.current.getDuration) return;
            e.preventDefault();
            const touch = e.touches[0];
            const { timeStr, styleLeft } = calculateTimeAtTrackCoordinate(touch.clientX, el);
            setHoverTimeDisplay(timeStr);
            setHoverPositionStyle({ display: 'block', left: styleLeft });
        };
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        return () => el.removeEventListener('touchmove', onTouchMove);
    }, [progressBarRef.current]);

    // Save position before changing video resource
    const saveCurrentPosition = () => {
        if (selectedResource && isVideo && playerRef.current && playerRef.current.getCurrentTime) {
            const currentTimestamp = playerRef.current.getCurrentTime();
            setPlaybackHistory(prev => ({
                ...prev,
                [selectedResource.id]: currentTimestamp
            }));
        }
    };

    const handleResourceSelection = (resource) => {
        saveCurrentPosition();
        setSelectedResource(resource);
    };

    // Helper to translate default viewable drive urls into embedded layout targets cleanly
    const formatGoogleDriveEmbedUrl = (url) => {
        if (!url) return "";
        if (url.includes('/view')) return url.replace('/view', '/preview');
        if (url.includes('open?id=')) return url.replace('open?id=', 'file/d/') + '/preview';
        return url;
    };

    // Load/Reinitialize YouTube API Player when selected resource changes
    useEffect(() => {
        if (!selectedResource || !isVideo) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        
        setIsPlaying(true);
        setProgress(0);
        setPlaybackSpeed(1);
        setShowSpeedMenu(false);
        setCurrentTimeDisplay("0:00");
        setTotalDurationDisplay("0:00");
        if (intervalRef.current) clearInterval(intervalRef.current);

        const videoId = getYouTubeId(resourceUrl);
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
                    playsinline: 1, 
                    vq: 'hd1080'
                },
                events: {
                    onReady: (event) => {
                        event.target.setVolume(volume);
                        
                        const savedTime = playbackHistory[selectedResource.id] || 0;
                        if (savedTime > 0) {
                            event.target.seekTo(savedTime, true);
                        }
                        
                        event.target.playVideo();
                        
                        intervalRef.current = setInterval(() => {
                            if (playerRef.current && playerRef.current.getCurrentTime && playerRef.current.getDuration) {
                                const current = playerRef.current.getCurrentTime();
                                const total = playerRef.current.getDuration();
                                
                                setCurrentTimeDisplay(formatTimeDisplay(current));
                                if (total > 0) {
                                    setTotalDurationDisplay(formatTimeDisplay(total));
                                    setProgress((current / total) * 100);
                                }
                            }
                        }, 250);
                    },
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
                        if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
                    }
                }
            });
        };

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = initPlayer;
        } else {
            initPlayer();
        }
    }, [selectedResource, isVideo]);

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

    const handleTimelineNavigation = (e) => {
        if (!progressBarRef.current || !playerRef.current || !playerRef.current.getDuration) return;

        e.preventDefault();
        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        if (!clientX) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = clientX - rect.left;
        const clickPercentage = Math.max(0, Math.min(1, clickX / rect.width));
        
        const totalDuration = playerRef.current.getDuration();
        const seekToSeconds = clickPercentage * totalDuration;

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
                    toast.error("Fullscreen restricted on this mobile engine");
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
                            onSelect={handleResourceSelection} 
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
                        {/* CHANGED: visible on all screen sizes with responsive max-width */}
                        <p className="text-sm font-medium text-richblack-50 truncate max-w-[180px] sm:max-w-[300px]">
                            {course?.title}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-pink-700/20 text-richblack-5 rounded-full transition-all">
                        <MdClose size={24} />
                    </button>
                </div>

                {/* Main player/content viewing area */}
                <div className="flex-1 overflow-y-auto p-2 sm:p-6 lg:p-10">
                    <div className="max-w-4xl mx-auto w-full">
                        
                        {/* Responsive Media Stage Container */}
                        <div 
                            ref={playerContainerRef}
                            tabIndex="0"
                            onTouchStart={handleStageInteractionTouch}
                            className={`relative w-full bg-black rounded-lg sm:rounded-xl border border-richblack-700 shadow-2xl group focus:outline-none ${isVideo ? 'aspect-video' : 'h-[75vh]'}`}
                        >
                            {selectedResource ? (
                                isVideo ? (
                                    <>
                                        {/* YOUTUBE VIDEO VIEWER VIEWPORTS — clipped independently */}
                                        <div className="absolute inset-0 overflow-hidden rounded-lg sm:rounded-xl z-10">
                                            <div className="absolute top-[-25%] left-[-1%] w-[102%] h-[150%] pointer-events-none select-none">
                                                <div 
                                                    id={`yt-player-${selectedResource.id}`} 
                                                    className="w-full h-full" 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="absolute inset-0 bg-transparent z-20 cursor-default" />

                                        {/* CHANGED: opacity-100 always on mobile, hover-reveal only on sm+ */}
                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 pt-8 flex flex-col gap-2.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-30">
                                            
                                            <div className="w-full pr-4 sm:pr-0">
                                                <div 
                                                    ref={progressBarRef}
                                                    onClick={handleTimelineNavigation}
                                                    onTouchEnd={handleTimelineNavigation}
                                                    onMouseMove={handleProgressBarMouseMove}
                                                    onTouchMove={handleProgressBarTouchMove}
                                                    onMouseLeave={handleProgressBarMouseLeave}
                                                    onTouchCancel={handleProgressBarMouseLeave}
                                                    onTouchEnd={(e) => { handleTimelineNavigation(e); handleProgressBarMouseLeave(); }}
                                                    // CHANGED: always h-2.5, removed sm:h-2 sm:hover:h-2.5
                                                    className="w-full bg-richblack-600 h-2.5 rounded-full relative cursor-pointer group/timeline transition-all"
                                                >
                                                    {/* Live Timestamp Preview Box */}
                                                    <div 
                                                        className="absolute bg-richblack-800 border border-richblack-600 text-white font-mono text-xs px-2 py-1 rounded shadow-xl pointer-events-none -translate-x-1/2 z-50"
                                                        style={{
                                                            ...hoverPositionStyle,
                                                            bottom: '18px',
                                                        }}
                                                    >
                                                        {hoverTimeDisplay}
                                                    </div>

                                                    <div 
                                                        className="bg-yellow-50 h-full rounded-full relative"
                                                        style={{ width: `${progress}%` }}
                                                    >
                                                        {/* CHANGED: removed sm:scale-0, thumb always visible */}
                                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-yellow-50 rounded-full scale-100 transition-transform shadow-md" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2.5 sm:gap-4">
                                                    {/* Play/Pause Button */}
                                                    <button 
                                                        onClick={handlePlayPause}
                                                        className="p-1.5 bg-yellow-100 text-richblack-900 rounded-full hover:scale-105 transition-transform"
                                                    >
                                                        {isPlaying ? <MdPause size={18} /> : <MdPlayArrow size={18} />}
                                                    </button>

                                                    {/* CHANGED: volume slider w-16 on mobile (was w-12) */}
                                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                                        <button onClick={handleToggleMute} className="text-richblack-100 hover:text-yellow-50">
                                                            {isMuted ? <MdVolumeMute size={20} /> : <MdVolumeUp size={20} />}
                                                        </button>
                                                        <input 
                                                            type="range" 
                                                            min="0" 
                                                            max="100" 
                                                            value={isMuted ? 0 : volume} 
                                                            onChange={handleVolumeChange}
                                                            className="w-16 sm:w-20 h-1 bg-richblack-600 rounded-lg appearance-none cursor-pointer accent-yellow-50"
                                                        />
                                                    </div>

                                                    {/* Live Time Tracking Display */}
                                                    <div className="text-[11px] sm:text-sm text-richblack-100 font-mono tracking-wide select-none">
                                                        <span>{currentTimeDisplay}</span>
                                                        <span className="mx-1 text-richblack-600">/</span>
                                                        <span>{totalDurationDisplay}</span>
                                                    </div>

                                                    {/* Speed Selector Menu Dropdown */}
                                                    <div className="relative" ref={speedMenuRef}>
                                                        <button 
                                                            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                                            className="flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold bg-richblack-700/80 hover:bg-richblack-600 text-richblack-100 hover:text-yellow-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded transition-colors"
                                                        >
                                                            <MdSpeed size={14} />
                                                            <span>{playbackSpeed}x</span>
                                                        </button>
                                                        
                                                        {showSpeedMenu && (
                                                            <div className="absolute bottom-full left-0 mb-2 bg-richblack-800 border border-richblack-600 rounded-lg overflow-hidden shadow-xl flex flex-col min-w-[65px]">
                                                                {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                                                                    <button
                                                                        key={speed}
                                                                        onClick={() => changeSpeed(speed)}
                                                                        className={`text-[11px] sm:text-xs px-2.5 py-1.5 text-left transition-colors font-medium
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
                                                </div>

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
                                    /* DYNAMIC GOOGLE DRIVE LINK / PDF EMBED VIEW STAGE CONTAINER */
                                    <div className="absolute inset-0 w-full h-full bg-richblack-800 z-10 overflow-hidden rounded-lg sm:rounded-xl">
                                        {resourceUrl ? (
                                            <>
                                                <iframe
                                                    key={resourceUrl}
                                                    src={formatGoogleDriveEmbedUrl(resourceUrl)}
                                                    className="w-full h-full border-0"
                                                    title={selectedResource.name}
                                                    allow="autoplay"
                                                    allowFullScreen
                                                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                                                />
                                                {/* Overlay to block Google Drive top-right popout/open button */}
                                                <div className="absolute top-0 right-0 w-24 h-10 z-20 cursor-default" />
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-richblack-400 text-sm">
                                                No content URL available for this resource.
                                            </div>
                                        )}
                                    </div>
                                )
                            ) : (
                                <div className="flex items-center justify-center h-full text-richblack-400 font-medium px-4 text-center text-sm">
                                    Select a lesson from the menu to begin
                                </div>
                            )}
                        </div>

                        {/* Content Description Info Box Panel */}
                        <div className="mt-3 sm:mt-6 bg-richblack-800 p-4 sm:p-6 rounded-xl border border-richblack-700">
                            <h2 className="text-lg sm:text-2xl font-semibold text-richblack-5">
                                {selectedResource?.name || "Welcome"}
                            </h2>
                            <div className="h-[1px] bg-richblack-700 my-2.5 sm:my-4"></div>
                            <p className="text-richblack-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                                {course?.description || "No supplemental details provided for this section."}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreeCourseViewer;