import React from 'react';
import { MdClose, MdExpand, MdVolumeUp } from 'react-icons/md';

const YouTubePlayer = ({ url, title, onClose, fullscreen = false }) => {
    // Extract YouTube video ID from various URL formats
    const extractVideoId = (youtubeUrl) => {
        if (!youtubeUrl) return null;

        try {
            // Handle youtu.be format
            if (youtubeUrl.includes('youtu.be/')) {
                const match = youtubeUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
                return match ? match[1] : null;
            }

            // Handle youtube.com format
            if (youtubeUrl.includes('youtube.com')) {
                // Handle v= parameter
                const urlParams = new URL(youtubeUrl).searchParams;
                const videoId = urlParams.get('v');
                if (videoId) return videoId;

                // Handle /embed/ format
                const match = youtubeUrl.match(/\/embed\/([a-zA-Z0-9_-]+)/);
                if (match) return match[1];
            }

            // Return null if invalid
            return null;
        } catch (error) {
            console.error('Error extracting video ID:', error);
            return null;
        }
    };

    const videoId = extractVideoId(url);

    if (!videoId) {
        return (
            <div
                className={`bg-richblack-800 border border-richblack-700 rounded-lg flex flex-col items-center justify-center ${fullscreen ? 'w-full h-full' : 'w-full aspect-video'
                    }`}
            >
                <p className="text-richblack-400 text-center">Invalid YouTube URL</p>
            </div>
        );
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

    if (fullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-richblack-900/95 flex flex-col">
                {/* Header */}
                <div className="bg-richblack-800 border-b border-richblack-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <h3 className="text-richblack-5 font-semibold truncate flex-1">{title || 'Video Player'}</h3>
                    <button
                        onClick={onClose}
                        className="text-richblack-300 hover:text-yellow-400 transition-colors"
                    >
                        <MdClose size={24} />
                    </button>
                </div>

                {/* Video Container */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-6xl aspect-video">
                        <iframe
                            src={embedUrl}
                            title={title || 'YouTube Video'}
                            className="w-full h-full rounded-lg"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Regular player (not fullscreen)
    return (
        <div className="w-full space-y-3">
            {title && (
                <p className="text-richblack-200 font-medium text-base px-1">{title}</p>
            )}
            <div className="relative group rounded-lg overflow-hidden bg-richblack-800 border border-richblack-700">
                <div className="aspect-video">
                    <iframe
                        src={embedUrl}
                        title={title || 'YouTube Video'}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                {/* Overlay with fullscreen button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                        onClick={onClose}
                        className="bg-yellow-400 hover:bg-yellow-500 text-richblack-900 rounded-full p-3 transition-colors"
                        title="Fullscreen"
                    >
                        <MdExpand size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default YouTubePlayer;
