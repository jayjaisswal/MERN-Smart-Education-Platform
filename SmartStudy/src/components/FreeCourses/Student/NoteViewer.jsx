import React, { useState } from 'react';
import { MdClose, MdViewWeek, MdChevronLeft, MdChevronRight } from 'react-icons/md';

const NoteViewer = ({ note, onClose, allNotes, onSelectNote }) => {
    const [fullScreenMode, setFullScreenMode] = useState(false);

    const convertGoogleDriveUrl = (url) => {
        let fileId = '';
        let isFolder = false;

        if (url.includes('drive.google.com')) {
            let match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
            if (match) {
                fileId = match[1];
                isFolder = false;
            } else {
                match = url.match(/\/folders\/([a-zA-Z0-9-_]+)/);
                if (match) {
                    fileId = match[1];
                    isFolder = true;
                }
            }
        } else if (url.length > 20 && /^[a-zA-Z0-9-_]+$/.test(url)) {
            fileId = url;
            isFolder = false;
        }

        if (!fileId) {
            return null;
        }

        if (isFolder) {
            return `https://drive.google.com/embeddedfolderview?id=${fileId}`;
        } else {
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
    };

    const currentIndex = allNotes.findIndex(n => n._id === note._id);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < allNotes.length - 1;

    const handlePrevious = () => {
        if (hasPrevious) {
            onSelectNote(allNotes[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        if (hasNext) {
            onSelectNote(allNotes[currentIndex + 1]);
        }
    };

    const embedUrl = convertGoogleDriveUrl(note.googleDriveUrl);

    // Fullscreen Mode
    if (fullScreenMode) {
        return (
            <div className="fixed inset-0 z-50 bg-richblack-900 flex flex-col">
                {/* Header */}
                <div className="bg-richblack-800 border-b border-richblack-700 p-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-white font-bold text-lg">{note.title}</h2>
                        <p className="text-richblack-400 text-sm mt-1">{note.subject}</p>
                    </div>
                    <button
                        onClick={() => setFullScreenMode(false)}
                        className="p-2 hover:bg-richblack-700 rounded-lg transition-colors"
                    >
                        <MdClose size={24} className="text-white" />
                    </button>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 overflow-hidden">
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title={note.title}
                            className="w-full h-full border-none"
                            sandbox="allow-same-origin allow-scripts"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-richblack-400">
                            Unable to load document
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Normal View
    return (
        <div className="fixed inset-0 z-50 bg-richblack-900/95 flex items-center justify-center p-4">
            <div className="bg-richblack-800 rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-richblack-700 border-b border-richblack-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-richblack-5 mb-2">
                            {note.title}
                        </h2>
                        <div className="flex items-center gap-3 text-sm text-richblack-400">
                            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full">
                                {note.subject}
                            </span>
                            <span>📅 {new Date(note.createdAt).toLocaleDateString()}</span>
                            <span>👤 {note.instructor?.firstName} {note.instructor?.lastName}</span>
                        </div>
                        {note.description && (
                            <p className="text-richblack-300 mt-3">{note.description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-richblack-600 rounded-lg transition-colors ml-4"
                    >
                        <MdClose size={24} className="text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 flex gap-6 overflow-hidden">
                    {/* PDF Viewer */}
                    <div className="flex-1 bg-richblack-900 flex flex-col">
                        <div className="flex items-center justify-between px-6 py-3 bg-richblack-700 border-b border-richblack-600">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevious}
                                    disabled={!hasPrevious}
                                    className={`p-2 rounded-lg transition-colors ${hasPrevious
                                            ? 'bg-richblack-600 hover:bg-richblack-500 text-white'
                                            : 'bg-richblack-700 text-richblack-500 cursor-not-allowed'
                                        }`}
                                    title="Previous note"
                                >
                                    <MdChevronLeft size={20} />
                                </button>
                                <span className="text-richblack-400 text-sm font-medium">
                                    {currentIndex + 1} / {allNotes.length}
                                </span>
                                <button
                                    onClick={handleNext}
                                    disabled={!hasNext}
                                    className={`p-2 rounded-lg transition-colors ${hasNext
                                            ? 'bg-richblack-600 hover:bg-richblack-500 text-white'
                                            : 'bg-richblack-700 text-richblack-500 cursor-not-allowed'
                                        }`}
                                    title="Next note"
                                >
                                    <MdChevronRight size={20} />
                                </button>
                            </div>
                            <button
                                onClick={() => setFullScreenMode(true)}
                                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-richblack-900 px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <MdViewWeek /> Fullscreen
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            {embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    title={note.title}
                                    className="w-full h-full border-none"
                                    sandbox="allow-same-origin allow-scripts"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-richblack-400">
                                    Unable to load document
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Other Notes */}
                    <div className="w-72 bg-richblack-900 border-l border-richblack-700 flex flex-col overflow-hidden">
                        <div className="px-4 py-3 border-b border-richblack-700">
                            <h3 className="text-lg font-bold text-richblack-5">
                                Related Notes ({allNotes.length})
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {allNotes.map((n, index) => (
                                <div
                                    key={n._id}
                                    onClick={() => onSelectNote(n)}
                                    className={`p-3 border-b border-richblack-700 cursor-pointer transition-all ${n._id === note._id
                                            ? 'bg-yellow-400/20 border-l-4 border-l-yellow-400'
                                            : 'hover:bg-richblack-800'
                                        }`}
                                >
                                    <p className="text-sm font-medium text-richblack-5 line-clamp-2">
                                        {index + 1}. {n.title}
                                    </p>
                                    <p className="text-xs text-richblack-400 mt-1">{n.subject}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteViewer;
