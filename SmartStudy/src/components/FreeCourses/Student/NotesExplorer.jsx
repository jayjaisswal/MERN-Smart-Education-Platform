import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MdClose, MdExpandMore, MdChevronRight } from 'react-icons/md';
import { AiOutlineFile, AiOutlinePlayCircle } from 'react-icons/ai';
import { fetchNotesBySubject, fetchSingleNote } from '../../../services/operations/notesAPI';
import NotesViewer from './NotesViewer';
import toast from 'react-hot-toast';

const NotesExplorer = ({ selectedSubject, onClose, onSubjectSelect }) => {
    const { token } = useSelector((state) => state.auth);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState(new Set());
    const [fullscreenNote, setFullscreenNote] = useState(null);

    useEffect(() => {
        if (selectedSubject && token) {
            loadNotesBySubject(selectedSubject);
        }
    }, [selectedSubject, token]);

    const loadNotesBySubject = async (subject) => {
        setLoading(true);
        try {
            const data = await fetchNotesBySubject(subject, token);
            if (data?.data && Array.isArray(data.data)) {
                setNotes(data.data);
                if (data.data.length > 0) {
                    setSelectedNote(data.data[0]);
                }
            } else {
                console.warn('Invalid notes data:', data);
                setNotes([]);
            }
        } catch (error) {
            console.error('Error loading notes:', error);
            setNotes([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleFolder = (folderId) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId);
        } else {
            newExpanded.add(folderId);
        }
        setExpandedFolders(newExpanded);
    };

    return (
        <div className="fixed inset-0 z-40 bg-richblack-900 bg-opacity-50 lg:bg-opacity-0 flex">
            {/* Sidebar */}
            <div className="w-full md:w-96 bg-richblack-900 border-r border-richblack-700 flex flex-col h-full overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-richblack-800 border-b border-richblack-700 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-richblack-5 font-bold text-lg">
                            📂 {selectedSubject || 'Subjects'}
                        </h3>
                        <p className="text-richblack-400 text-sm">{notes.length} notes available</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-richblack-700 rounded-lg transition-colors"
                    >
                        <MdClose size={20} className="text-richblack-400 hover:text-richblack-200" />
                    </button>
                </div>

                {/* Search/Filter would go here */}
                <div className="px-4 py-3 bg-richblack-800">
                    <input
                        type="text"
                        placeholder="Filter notes..."
                        className="w-full bg-richblack-700 text-richblack-5 placeholder-richblack-500 rounded px-3 py-2 text-sm border border-richblack-600 focus:border-yellow-400 focus:outline-none"
                    />
                </div>

                {/* Notes List - VS Code Explorer Style */}
                <div className="flex-1 overflow-y-auto px-2 py-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-richblack-700 border-t-yellow-400" />
                        </div>
                    ) : notes.length === 0 ? (
                        <p className="text-richblack-400 text-center py-8 text-sm">
                            No notes in this subject
                        </p>
                    ) : (
                        notes.map((note) => (
                            <NoteItem
                                key={note._id}
                                note={note}
                                isSelected={selectedNote?._id === note._id}
                                onSelect={() => setSelectedNote(note)}
                                onFullscreen={() => setFullscreenNote(note)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Main Viewer Area - Desktop Only */}
            {selectedNote && !fullscreenNote && (
                <div className="hidden lg:flex flex-1 flex-col bg-richblack-800">
                    <NotesViewer
                        note={selectedNote}
                        onFullscreen={() => setFullscreenNote(selectedNote)}
                    />
                </div>
            )}

            {/* Fullscreen Viewer */}
            {fullscreenNote && (
                <div className="fixed inset-0 z-50 bg-richblack-900 flex flex-col">
                    <div className="flex items-center justify-end px-6 py-4 bg-richblack-800 border-b border-richblack-700">
                        <button
                            onClick={() => setFullscreenNote(null)}
                            className="p-2 hover:bg-richblack-700 rounded-lg transition-colors"
                        >
                            <MdClose size={24} className="text-richblack-400 hover:text-richblack-200" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <NotesViewer note={fullscreenNote} fullscreen />
                    </div>
                </div>
            )}

            {/* Mobile Viewer - Show when note is selected */}
            {selectedNote && !fullscreenNote && (
                <div className="lg:hidden fixed inset-0 z-50 bg-richblack-900 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 bg-richblack-800 border-b border-richblack-700">
                        <h4 className="text-richblack-5 font-semibold truncate">{selectedNote.title}</h4>
                        <button
                            onClick={() => setSelectedNote(null)}
                            className="p-2 hover:bg-richblack-700 rounded-lg"
                        >
                            <MdClose size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <NotesViewer
                            note={selectedNote}
                            onFullscreen={() => setFullscreenNote(selectedNote)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const NoteItem = ({ note, isSelected, onSelect, onFullscreen }) => {
    const hasVideo = note.videoUrl;

    return (
        <div
            onClick={onSelect}
            className={`p-3 rounded-lg cursor-pointer transition-all mb-2 flex items-start gap-3 ${isSelected
                ? 'bg-yellow-600 text-richblack-900'
                : 'bg-richblack-800 text-richblack-300 hover:bg-richblack-700'
                }`}
        >
            {/* Icon */}
            <div className="flex-shrink-0 pt-1">
                {hasVideo ? (
                    <AiOutlinePlayCircle size={18} className="text-blue-400" />
                ) : (
                    <AiOutlineFile size={18} className="text-yellow-400" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm truncate ${isSelected ? 'text-richblack-900' : 'text-richblack-5'}`}>
                    {note.title}
                </p>
                {note.description && (
                    <p className={`text-xs line-clamp-1 mt-1 ${isSelected ? 'text-richblack-800' : 'text-richblack-400'}`}>
                        {note.description}
                    </p>
                )}
            </div>

            {/* Status Badge */}
            {hasVideo && (
                <div className={`text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0 ${isSelected ? 'bg-richblack-900 text-yellow-400' : 'bg-richblack-700 text-blue-400'
                    }`}>
                    📹
                </div>
            )}
        </div>
    );
};

export default NotesExplorer;
