import React, { useState } from 'react';
import { MdViewWeek, MdVolumeOff, MdVolumeMute } from 'react-icons/md';

const NotesViewer = ({ note, fullscreen = false, onFullscreen }) => {
    const [videoMuted, setVideoMuted] = useState(false);

    // Format drive URL for embed
    const getEmbedUrl = (url) => {
        if (url.includes('/folders/')) {
            const match = url.match(/\/folders\/([a-zA-Z0-9-_]+)/);
            if (match) return `https://drive.google.com/embeddedfolderview?id=${match[1]}`;
        }
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
        return url;
    };

    const embedUrl = getEmbedUrl(note.googleDriveUrl);

    return (
        <div className="h-full w-full flex flex-col bg-richblack-900">
            {/* Header */}
            {!fullscreen && (
                <div className="bg-richblack-800 border-b border-richblack-700 px-6 py-4">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-richblack-5 mb-1">{note.title}</h2>
                        {note.description && (
                            <p className="text-richblack-400 text-sm">{note.description}</p>
                        )}
                    </div>

                    {note.instructor && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-richblack-400">By</span>
                            <span className="text-yellow-400 font-medium">
                                {note.instructor.firstName} {note.instructor.lastName}
                            </span>
                            <span className="text-richblack-500">•</span>
                            <span className="text-richblack-400">{note.views} views</span>
                        </div>
                    )}
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 flex gap-4 p-4 overflow-hidden">
                {/* PDF Viewer */}
                {note.googleDriveUrl && (
                    <div className={`rounded-lg overflow-hidden border border-richblack-700 ${note.videoUrl ? 'w-3/5' : 'w-full'
                        } flex flex-col h-full`}>
                        <div className="flex-1 bg-richblack-800">
                            <iframe
                                src={embedUrl}
                                title={note.title}
                                className="w-full h-full border-none"
                                sandbox="allow-same-origin allow-scripts"
                            />
                        </div>
                    </div>
                )}

                {/* Video Player */}
                {note.videoUrl && (
                    <div className={`rounded-lg overflow-hidden border border-richblack-700 ${note.googleDriveUrl ? 'w-2/5' : 'w-full h-full'
                        } flex flex-col`}>
                        <div className="relative bg-richblack-800 flex-1">
                            {note.videoUrl.includes('youtube.com') || note.videoUrl.includes('youtu.be') ? (
                                <YoutubePlayer
                                    url={note.videoUrl}
                                    muted={videoMuted}
                                    title={note.videoTitle || note.title}
                                />
                            ) : (
                                <VideoPlayer
                                    url={note.videoUrl}
                                    muted={videoMuted}
                                    title={note.videoTitle || note.title}
                                />
                            )}
                            <button
                                onClick={() => setVideoMuted(!videoMuted)}
                                className="absolute top-4 right-4 p-2 bg-richblack-900 hover:bg-richblack-800 rounded-lg transition-colors z-10"
                                title={videoMuted ? 'Unmute' : 'Mute'}
                            >
                                {videoMuted ? (
                                    <MdVolumeMute size={20} className="text-yellow-400" />
                                ) : (
                                    <MdVolumeOff size={20} className="text-richblack-400" />
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            {!fullscreen && (
                <div className="bg-richblack-800 border-t border-richblack-700 px-6 py-3 text-sm text-richblack-400 flex justify-between items-center">
                    <div className="space-x-4">
                        <span>📅 {new Date(note.createdAt).toLocaleDateString()}</span>
                        {note.tags.length > 0 && (
                            <span>🏷️ {note.tags.join(', ')}</span>
                        )}
                    </div>
                    {onFullscreen && (
                        <button
                            onClick={onFullscreen}
                            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-richblack-900 px-3 py-2 rounded font-medium transition-colors text-xs"
                        >
                            <MdViewWeek /> Fullscreen
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const YoutubePlayer = ({ url, muted, title }) => {
    let videoId = '';

    if (url.includes('youtube.com')) {
        const match = url.match(/[?&]v=([^&]+)/);
        videoId = match ? match[1] : '';
    } else if (url.includes('youtu.be')) {
        const match = url.match(/youtu\.be\/([^?]+)/);
        videoId = match ? match[1] : '';
    }

    if (!videoId) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-richblack-400">Invalid YouTube URL</p>
            </div>
        );
    }

    return (
        <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?mute=${muted ? 1 : 0}`}
            title={title}
            frame Border="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="border-none"
        />
    );
};

const VideoPlayer = ({ url, muted, title }) => {
    return (
        <video
            width="100%"
            height="100%"
            controls
            muted={muted}
            className="w-full h-full object-contain"
        >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
};

export default NotesViewer;
