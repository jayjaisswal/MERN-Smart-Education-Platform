import React, { useState, useEffect, useCallback } from 'react';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineFile } from 'react-icons/ai';
import { MdClose, MdViewWeek, MdEdit, MdOpenInNew, MdExpandMore, MdExpandLess } from 'react-icons/md';
import toast from 'react-hot-toast';
import { createNote, updateNote, deleteNote, fetchInstructorNotes } from '../../../services/operations/notesAPI';
import { useSelector } from 'react-redux';
import AllNotesManager from './AllNotesManager';
import NestedNoteForm from "./NestedNoteForm";

const Notes = () => {
    const { token } = useSelector((state) => state.auth);
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedChapterNote, setSelectedChapterNote] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAllNotesManager, setShowAllNotesManager] = useState(false);
    const [expandedChapters, setExpandedChapters] = useState({});
    const [fullScreenMode, setFullScreenMode] = useState(false);

    // Load instructor's notes
    const loadNotes = useCallback(async () => {
        if (!token) return;

        setLoading(true);
        try {
            const data = await fetchInstructorNotes(token);
            if (data && data.data && Array.isArray(data.data)) {
                setNotes(data.data);
                if (data.data.length > 0) {
                    setSelectedNote(data.data[0]);
                }
            } else if (Array.isArray(data)) {
                setNotes(data);
                if (data.length > 0) {
                    setSelectedNote(data[0]);
                }
            }
        } catch (error) {
            console.error('Error loading notes:', error);
            toast.error('Failed to load your notes');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    const convertGoogleDriveUrl = (url) => {
        if (!url) return null;
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

        if (!fileId) return null;

        if (isFolder) {
            return `https://drive.google.com/embeddedfolderview?id=${fileId}`;
        } else {
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
    };

    const toggleChapter = (noteId, chapterIndex) => {
        const key = `${noteId}-${chapterIndex}`;
        setExpandedChapters(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleDeleteNote = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            const response = await deleteNote(id, token);
            if (response?.data?.success) {
                setNotes(notes.filter(note => note._id !== id));
                if (selectedNote?._id === id) {
                    setSelectedNote(null);
                    setSelectedChapter(null);
                    setSelectedChapterNote(null);
                }
                toast.success('Note deleted successfully');
            } else {
                toast.error(response?.data?.message || 'Failed to delete note');
            }
        } catch (error) {
            toast.error('Error deleting note');
        }
    };

    const handleSaveNote = async (noteData) => {
        try {
            let response;
            if (isEditing && editingNoteId) {
                // Update existing note
                response = await updateNote(editingNoteId, noteData, token);
                if (response?.data?.success && response?.data?.data) {
                    setNotes(notes.map(n => n._id === editingNoteId ? response.data.data : n));
                    setSelectedNote(response.data.data);
                    setIsEditing(false);
                    setEditingNoteId(null);
                    toast.success('Note updated successfully');
                } else {
                    toast.error(response?.data?.message || 'Failed to update note');
                }
            } else {
                // Create new note
                response = await createNote(noteData, token);
                if (response?.data?.success && response?.data?.data) {
                    setNotes([...notes, response.data.data]);
                    setSelectedNote(response.data.data);
                    setIsAdding(false);
                    toast.success('Note created successfully');
                } else {
                    toast.error(response?.data?.message || 'Failed to create note');
                }
            }
        } catch (error) {
            console.error('Error saving note:', error);
            toast.error('Error saving note');
        }
    };

    const handleEditNote = (note) => {
        setSelectedNote(note);
        setIsEditing(true);
        setEditingNoteId(note._id);
        setIsAdding(false);
        setSelectedChapter(null);
        setSelectedChapterNote(null);
    };

    // Get current display note (single or chapter note)
    const getCurrentUrl = () => {
        if (selectedChapterNote !== null && selectedChapter !== null && selectedNote?.chapters) {
            const chapter = selectedNote.chapters[selectedChapter];
            return chapter?.notes[selectedChapterNote]?.googleDriveUrl;
        }
        return selectedNote?.googleDriveUrl;
    };

    const getCurrentTitle = () => {
        if (selectedChapterNote !== null && selectedChapter !== null && selectedNote?.chapters) {
            return selectedNote.chapters[selectedChapter]?.notes[selectedChapterNote]?.title;
        }
        return selectedNote?.title;
    };

    if (loading) {
        return <div className="min-h-screen bg-richblack-900 pt-20 flex items-center justify-center"><p className="text-white">Loading...</p></div>;
    }

    // Fullscreen Mode
    if (fullScreenMode && selectedNote) {
        const embedUrl = convertGoogleDriveUrl(getCurrentUrl());
        return (
            <div className="fixed inset-0 z-50 bg-richblack-900 flex flex-col">
                <div className="bg-richblack-800 border-b border-richblack-700 p-4 flex items-center justify-between">
                    <h2 className="text-white font-bold text-lg truncate">{getCurrentTitle()}</h2>
                    <button
                        onClick={() => setFullScreenMode(false)}
                        className="p-2 hover:bg-richblack-700 rounded-lg transition-colors flex-shrink-0"
                    >
                        <MdClose size={24} className="text-white" />
                    </button>
                </div>
                <div className="flex-1 overflow-hidden">
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title={getCurrentTitle()}
                            className="w-full h-full border-none"
                            sandbox="allow-same-origin allow-scripts"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-richblack-400">
                            No document available
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-richblack-900 pt-20 pb-10">
            <div className="w-11/12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-richblack-5 mb-2">
                        📚 Study Notes
                    </h1>
                    <p className="text-richblack-300 text-sm md:text-base">
                        Manage your notes with chapters and Google Drive files
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
                    {/* SIDEBAR - Notes List */}
                    <div className="lg:col-span-2 bg-richblack-800 rounded-lg p-4 md:p-6 h-fit lg:sticky lg:top-24">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-richblack-5">
                                Notes ({notes.length})
                            </h2>
                        </div>

                        <button
                            onClick={() => {
                                setIsAdding(!isAdding);
                                setIsEditing(false);
                                setEditingNoteId(null);
                                if (!isAdding) {
                                    setSelectedNote(null);
                                    setSelectedChapter(null);
                                    setSelectedChapterNote(null);
                                }
                            }}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-richblack-900 font-semibold py-2 rounded-lg mb-4 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            <AiOutlinePlus /> Add Note
                        </button>

                        {/* Add/Edit Note Form */}
                        {(isAdding || isEditing) && (
                            <div className="mb-4 pb-4 border-b border-richblack-700">
                                <NestedNoteForm
                                    initialData={isEditing ? selectedNote : null}
                                    isEditing={isEditing}
                                    onSave={handleSaveNote}
                                    onCancel={() => {
                                        setIsAdding(false);
                                        setIsEditing(false);
                                        setEditingNoteId(null);
                                    }}
                                />
                            </div>
                        )}

                        {/* Notes List */}
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {notes.length === 0 ? (
                                <p className="text-richblack-400 text-center py-4 text-sm">
                                    No notes yet
                                </p>
                            ) : (
                                notes.map((note, idx) => (
                                    <div
                                        key={note._id}
                                        className={`p-3 rounded-lg cursor-pointer transition-all group ${selectedNote?._id === note._id
                                            ? 'bg-yellow-600'
                                            : 'bg-richblack-700 hover:bg-richblack-600'
                                            }`}
                                    >
                                        <div
                                            className="flex items-start justify-between gap-2"
                                            onClick={() => {
                                                setSelectedNote(note);
                                                setSelectedChapter(null);
                                                setSelectedChapterNote(null);
                                            }}
                                        >
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
                                                {note.chapters && note.chapters.length > 0 && (
                                                    <p className="text-yellow-300 text-xs mt-1">
                                                        📂 {note.chapters.length} chapters
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditNote(note);
                                                    }}
                                                    className="p-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
                                                    title="Edit"
                                                >
                                                    <MdEdit size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteNote(note._id);
                                                    }}
                                                    className="p-1 bg-red-600 hover:bg-red-700 rounded text-white"
                                                    title="Delete"
                                                >
                                                    <AiOutlineDelete size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* MAIN AREA - Note Details & Viewer */}
                    <div className="lg:col-span-3">
                        {selectedNote ? (
                            <div className="bg-richblack-800 rounded-lg overflow-hidden flex flex-col h-[600px]">
                                {/* Header */}
                                <div className="bg-richblack-700 border-b border-richblack-600 px-4 md:px-6 py-3 md:py-4 flex items-start justify-between gap-3 flex-wrap">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base md:text-lg font-bold text-richblack-5 truncate">
                                            {getCurrentTitle()}
                                        </h3>
                                        {selectedNote.description && (
                                            <p className="text-richblack-400 text-xs md:text-sm mt-1 line-clamp-2">
                                                {selectedNote.description}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setFullScreenMode(true)}
                                        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-richblack-900 px-3 md:px-4 py-1 md:py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap flex-shrink-0"
                                    >
                                        <MdViewWeek size={18} /> Fullscreen
                                    </button>
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 flex overflow-hidden">
                                    {/* Chapters List (if available) */}
                                    {selectedNote.chapters && selectedNote.chapters.length > 0 && (
                                        <div className="w-32 md:w-40 bg-richblack-900 border-r border-richblack-600 overflow-y-auto p-2">
                                            <p className="text-richblack-300 text-xs font-semibold px-2 py-1 mb-2">CHAPTERS</p>
                                            {selectedNote.chapters.map((chapter, chIdx) => {
                                                const isExpanded = expandedChapters[`${selectedNote._id}-${chIdx}`];
                                                return (
                                                    <div key={chIdx} className="mb-1">
                                                        <button
                                                            onClick={() => toggleChapter(selectedNote._id, chIdx)}
                                                            className="w-full flex items-center gap-1 p-2 text-left text-xs text-richblack-300 hover:bg-richblack-700 rounded transition-colors"
                                                        >
                                                            {isExpanded ? <MdExpandLess size={14} /> : <MdExpandMore size={14} />}
                                                            <span className="truncate">{chapter.name || `Chapter ${chIdx + 1}`}</span>
                                                        </button>
                                                        {isExpanded && (
                                                            <div className="ml-2 space-y-1">
                                                                {chapter.notes.map((noteItem, noteIdx) => (
                                                                    <button
                                                                        key={noteIdx}
                                                                        onClick={() => {
                                                                            setSelectedChapter(chIdx);
                                                                            setSelectedChapterNote(noteIdx);
                                                                        }}
                                                                        className={`w-full text-left px-2 py-1 text-xs rounded transition-colors truncate ${selectedChapter === chIdx && selectedChapterNote === noteIdx
                                                                            ? 'bg-yellow-500 text-richblack-900 font-semibold'
                                                                            : 'text-richblack-400 hover:bg-richblack-700 hover:text-richblack-300'
                                                                            }`}
                                                                    >
                                                                        {noteItem.title}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* PDF Viewer */}
                                    <div className="flex-1 bg-richblack-900">
                                        {convertGoogleDriveUrl(getCurrentUrl()) ? (
                                            <iframe
                                                src={convertGoogleDriveUrl(getCurrentUrl())}
                                                title={getCurrentTitle()}
                                                className="w-full h-full border-none"
                                                sandbox="allow-same-origin allow-scripts"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-richblack-400">
                                                <div className="text-center">
                                                    <AiOutlineFile size={48} className="mx-auto mb-2 opacity-50" />
                                                    <p>No document available</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
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

            {/* All Notes Manager Modal */}
            {showAllNotesManager && (
                <AllNotesManager
                    notes={notes}
                    token={token}
                    onClose={() => setShowAllNotesManager(false)}
                    onEdit={() => { }}
                    onDelete={(noteId) => {
                        setNotes(notes.filter(n => n._id !== noteId));
                    }}
                />
            )}
        </div>
    );
};

export default Notes;
