import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineFile } from 'react-icons/ai';
import { MdClose, MdViewWeek } from 'react-icons/md';
import toast from 'react-hot-toast';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ title: '', googleDriveUrl: '', description: '' });
    const [fullScreenMode, setFullScreenMode] = useState(false);

    // Convert Google Drive URL to embed format
    const convertGoogleDriveUrl = (url) => {
        let fileId = '';
        let isFolder = false;

        // Extract file/folder ID from different Google Drive URL formats
        if (url.includes('drive.google.com')) {
            // Try to match file pattern first: /d/FILE_ID/
            let match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
            if (match) {
                fileId = match[1];
                isFolder = false;
            } else {
                // Try to match folder pattern: /folders/FOLDER_ID
                match = url.match(/\/folders\/([a-zA-Z0-9-_]+)/);
                if (match) {
                    fileId = match[1];
                    isFolder = true;
                }
            }
        } else if (url.length > 20 && /^[a-zA-Z0-9-_]+$/.test(url)) {
            // Direct ID (file or folder)
            fileId = url;
            isFolder = false; // Assume file by default
        }

        if (!fileId) {
            toast.error('Invalid Google Drive URL or File ID');
            return null;
        }

        // Return appropriate embed URL based on type
        if (isFolder) {
            // For folders
            return `https://drive.google.com/embeddedfolderview?id=${fileId}`;
        } else {
            // For files - preview mode (read-only)
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
    };

    // Add new note
    const handleAddNote = () => {
        if (!formData.title.trim()) {
            toast.error('Please enter note title');
            return;
        }
        if (!formData.googleDriveUrl.trim()) {
            toast.error('Please enter Google Drive URL or File ID');
            return;
        }

        const embedUrl = convertGoogleDriveUrl(formData.googleDriveUrl);
        if (!embedUrl) return;

        const newNote = {
            id: Date.now(),
            title: formData.title,
            description: formData.description,
            embedUrl,
            createdAt: new Date().toISOString(),
        };

        setNotes([...notes, newNote]);
        setFormData({ title: '', googleDriveUrl: '', description: '' });
        setIsAdding(false);
        toast.success('Note added successfully!');
    };

    // Delete note
    const handleDeleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
        if (selectedNote?.id === id) {
            setSelectedNote(null);
        }
        toast.success('Note deleted');
    };

    return (
        <div className="min-h-screen bg-richblack-900">
            {/* Fullscreen PDF Reader Mode */}
            {fullScreenMode && selectedNote && (
                <div className="fixed inset-0 z-50 bg-richblack-900 flex flex-col">
                    {/* Header */}
                    <div className="bg-richblack-800 border-b border-richblack-700 p-4 flex items-center justify-between">
                        <h2 className="text-white font-bold text-lg">{selectedNote.title}</h2>
                        <button
                            onClick={() => setFullScreenMode(false)}
                            className="p-2 hover:bg-richblack-700 rounded-lg transition-colors"
                        >
                            <MdClose size={24} className="text-white" />
                        </button>
                    </div>

                    {/* PDF Viewer - Full Height */}
                    <div className="flex-1 overflow-hidden">
                        <iframe
                            src={selectedNote.embedUrl}
                            title={selectedNote.title}
                            className="w-full h-full border-none"
                            sandbox="allow-same-origin allow-scripts"
                        />
                    </div>
                </div>
            )}

            {/* Normal View */}
            {!fullScreenMode && (
                <div className="min-h-screen bg-richblack-900 pt-20 pb-10">
                    <div className="w-11/12 max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-richblack-5 mb-2">
                                📚 Study Notes
                            </h1>
                            <p className="text-richblack-300">
                                Read-only PDF notes from Google Drive
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Notes List - Left Sidebar */}
                            <div className="bg-richblack-800 rounded-lg p-6 h-fit">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-richblack-5">
                                        Notes ({notes.length})
                                    </h2>
                                </div>

                                <button
                                    onClick={() => setIsAdding(!isAdding)}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-richblack-900 font-semibold py-2 rounded-lg mb-4 transition-colors flex items-center justify-center gap-2"
                                >
                                    <AiOutlinePlus /> Add Note
                                </button>

                                {/* Add Note Form */}
                                {isAdding && (
                                    <div className="bg-richblack-700 p-4 rounded-lg mb-4 space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Note title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-richblack-600 text-richblack-5 placeholder-richblack-400 rounded px-3 py-2 text-sm border border-richblack-500 focus:border-yellow-400 focus:outline-none"
                                        />
                                        <textarea
                                            placeholder="Description (optional)"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows="2"
                                            className="w-full bg-richblack-600 text-richblack-5 placeholder-richblack-400 rounded px-3 py-2 text-sm border border-richblack-500 focus:border-yellow-400 focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Google Drive File ID or URL"
                                            value={formData.googleDriveUrl}
                                            onChange={(e) => setFormData({ ...formData, googleDriveUrl: e.target.value })}
                                            className="w-full bg-richblack-600 text-richblack-5 placeholder-richblack-400 rounded px-3 py-2 text-sm border border-richblack-500 focus:border-yellow-400 focus:outline-none"
                                        />
                                        <p className="text-xs text-richblack-400">
                                            Paste: https://drive.google.com/file/d/FILE_ID/view
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleAddNote}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium text-sm"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setIsAdding(false)}
                                                className="flex-1 bg-richblack-600 hover:bg-richblack-500 text-richblack-300 py-2 rounded font-medium text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Notes List */}
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {notes.length === 0 ? (
                                        <p className="text-richblack-400 text-center py-4 text-sm">
                                            No notes yet
                                        </p>
                                    ) : (
                                        notes.map((note) => (
                                            <div
                                                key={note.id}
                                                className={`p-3 rounded-lg cursor-pointer transition-all group ${selectedNote?.id === note.id
                                                    ? 'bg-yellow-600'
                                                    : 'bg-richblack-700 hover:bg-richblack-600'
                                                    }`}
                                                onClick={() => setSelectedNote(note)}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <AiOutlineFile className="flex-shrink-0 text-blue-400" />
                                                            <p className="text-richblack-5 text-sm font-medium truncate">
                                                                {note.title}
                                                            </p>
                                                        </div>
                                                        {note.description && (
                                                            <p className="text-richblack-400 text-xs mt-1 line-clamp-2">
                                                                {note.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteNote(note.id);
                                                        }}
                                                        className="p-1 bg-red-600 hover:bg-red-700 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                    >
                                                        <AiOutlineDelete className="text-white" size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* PDF Viewer - Main Area */}
                            <div className="lg:col-span-3">
                                {selectedNote ? (
                                    <div className="bg-richblack-800 rounded-lg overflow-hidden h-[600px] flex flex-col">
                                        {/* Toolbar */}
                                        <div className="bg-richblack-700 border-b border-richblack-600 px-6 py-4 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-richblack-5">
                                                    {selectedNote.title}
                                                </h3>
                                                {selectedNote.description && (
                                                    <p className="text-richblack-400 text-sm mt-1">
                                                        {selectedNote.description}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setFullScreenMode(true)}
                                                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-richblack-900 px-4 py-2 rounded-lg font-medium transition-colors"
                                            >
                                                <MdViewWeek /> Fullscreen
                                            </button>
                                        </div>

                                        {/* PDF Iframe */}
                                        <div className="flex-1 bg-richblack-900">
                                            <iframe
                                                src={selectedNote.embedUrl}
                                                title={selectedNote.title}
                                                className="w-full h-full border-none"
                                                sandbox="allow-same-origin allow-scripts"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-richblack-800 rounded-lg h-[600px] flex items-center justify-center">
                                        <div className="text-center">
                                            <AiOutlineFile size={64} className="text-richblack-700 mx-auto mb-4" />
                                            <p className="text-richblack-400 text-lg">
                                                Select a note to view
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notes;