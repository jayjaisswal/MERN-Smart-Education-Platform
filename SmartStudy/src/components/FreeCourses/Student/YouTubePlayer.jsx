import React from 'react';
import { MdClose, MdExpand } from 'react-icons/md';

const YouTubePlayer = ({ url, title, onClose, fullscreen = false }) => {
    
    const extractVideoId = (youtubeUrl) => {
        if (!youtubeUrl) return null;
        try {
            const input = String(youtubeUrl).trim();
            if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
            
            // Clean URL and handle playlist links
            const urlObj = new URL(input.startsWith('http') ? input : `https://${input}`);
            if (urlObj.hostname.includes('youtube.com')) {
                return urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
            }
            if (urlObj.hostname === 'youtu.be') {
                return urlObj.pathname.substring(1);
            }
            return null;
        } catch (e) { return null; }
    };

    const videoId = extractVideoId(url);

    if (!videoId) {
        return (
            <div className="bg-richblack-800 rounded-lg flex items-center justify-center w-full aspect-video">
                <p className="text-richblack-400">Invalid YouTube URL</p>
            </div>
        );
    }

    // THE FIX: Use youtube-nocookie and add ORIGIN + ENABLEJSAPI
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&autoplay=1`;

    const PlayerFrame = () => (
        <iframe
            src={embedUrl}
            title={title || 'YouTube Video'}
            className="w-full h-full rounded-lg"
            frameBorder="0"
            // Adding extra permissions for better compatibility
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
        />
    );

    if (fullscreen) {
        return (
            <div className="fixed inset-0 z-[200] bg-richblack-900 flex flex-col">
                <div className="bg-richblack-800 border-b border-richblack-700 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-richblack-5 font-semibold">{title || 'Video Player'}</h3>
                    <button onClick={onClose} className="text-richblack-300 hover:text-yellow-400">
                        <MdClose size={28} />
                    </button>
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-6xl aspect-video shadow-2xl">
                        <PlayerFrame />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-3">
            {title && <p className="text-richblack-200 font-medium px-1">{title}</p>}
            <div className="relative group rounded-lg overflow-hidden bg-richblack-800 border border-richblack-700 aspect-video">
                <PlayerFrame />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onClose}
                        className="bg-yellow-400 text-richblack-900 p-2 rounded-full shadow-lg"
                    >
                        <MdExpand size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default YouTubePlayer;