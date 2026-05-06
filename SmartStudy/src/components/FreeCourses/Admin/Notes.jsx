import React, { useState, useEffect, useCallback } from 'react';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineFile } from 'react-icons/ai';
import { MdClose, MdViewWeek, MdEdit, MdOpenInNew } from 'react-icons/md';
import toast from 'react-hot-toast';
import { createNote, updateNote, deleteNote, fetchInstructorNotes } from '../../../services/operations/notesAPI';
import { useSelector } from 'react-redux';
import AllNotesManager from './AllNotesManager';
import NestedNoteForm from "./NestedNoteForm";

const SUBJECTS = [
    'Physics', 'Chemistry', 'Biology', 'Mathematics',
    'English', 'History', 'Geography', 'Economics',
    'Computer Science', 'General'
];

const Notes = () => {
    const { token } = useSelector((state) => state.auth);
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAllNotesManager, setShowAllNotesManager] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: 'General',
        googleDriveUrl: '',
        isPublished: true
    });
    const [fullScreenMode, setFullScreenMode] = useState(false);

    // Load instructor's notes using useCallback
    const loadNotes = useCallback(async () => {
        if (!token) {
            console.warn('No token available');
            return;
        }

        setLoading(true);
        try {
            console.log('Fetching instructor notes with token:', token.substring(0, 20) + '...');
            const data = await fetchInstructorNotes(token);
            console.log('Fetched notes data:', data);

            if (data && data.data && Array.isArray(data.data)) {
                setNotes(data.data);
                if (data.data.length > 0) {
                    setSelectedNote(data.data[0]);
                }
            } else if (Array.isArray(data)) {
                // Handle case where data is directly an array
                setNotes(data);
                if (data.length > 0) {
                    setSelectedNote(data[0]);
                }
            } else {
                console.warn('Unexpected data format:', data);
                setNotes([]);
                toast.error('Failed to load notes - unexpected data format');
            }
        } catch (error) {
            console.error('Error loading notes:', error);
            setNotes([]);
            toast.error('Failed to load your notes');
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Load instructor's notes on mount
    useEffect(() => {
        loadNotes();
    }, [loadNotes]);
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
            toast.error('Invalid Google Drive URL or File ID');
            return null;
        }

        if (isFolder) {
            return `https://drive.google.com/embeddedfolderview?id=${fileId}`;
        } else {
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
    };

    // Add or update note
    const handleSaveNote = async () => {
        if (!formData.title.trim()) {
            toast.error('Please enter note title');
            return;
        }
        if (!formData.subject) {
            toast.error('Please select a subject');
            return;
        }
        if (!formData.googleDriveUrl.trim()) {
            toast.error('Please enter Google Drive URL or File ID');
            return;
        }

        const embedUrl = convertGoogleDriveUrl(formData.googleDriveUrl);
        if (!embedUrl) return;

        const notePayload = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            subject: formData.subject,
            googleDriveUrl: formData.googleDriveUrl.trim(),
            isPublished: formData.isPublished
        };

        if (selectedNote && isAdding) {
            // Update existing note
            console.log('Updating note:', selectedNote._id);
            const response = await updateNote(selectedNote._id, notePayload, token);
            console.log('Update response:', response);

            if (response?.data?.success && response?.data?.data) {
                const updatedNote = response.data.data;
                setNotes(notes.map(n => n._id === selectedNote._id ? updatedNote : n));
                setSelectedNote(updatedNote);
                setFormData({
                    title: '',
                    description: '',
                    subject: 'General',
                    googleDriveUrl: '',
                    isPublished: true
                });
                setIsAdding(false);
                toast.success('Note updated successfully');
            } else {
                toast.error(response?.data?.message || 'Failed to update note');
            }
        } else {
            // Create new note
            console.log('Creating new note');
            const response = await createNote(notePayload, token);
            console.log('Create response:', response);

            if (response?.data?.success && response?.data?.data) {
                const newNote = response.data.data;
                setNotes([...notes, newNote]);
                setSelectedNote(newNote);
                setFormData({
                    title: '',
                    description: '',
                    subject: 'General',
                    googleDriveUrl: '',
                    isPublished: true
                });
                setIsAdding(false);
                toast.success('Note created successfully');
            } else {
                console.error('Create failed:', response?.data?.message);
                toast.error(response?.data?.message || 'Failed to create note');
            }
        }
    };

    // Delete note
    const handleDeleteNote = async (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            const response = await deleteNote(id, token);
            console.log('Delete response:', response);
            if (response?.data?.success) {
                setNotes(notes.filter(note => note._id !== id));
                if (selectedNote?._id === id) {
                    setSelectedNote(null);
                }
                toast.success('Note deleted successfully');
            } else {
                toast.error(response?.data?.message || 'Failed to delete note');
            }
        }
    };

    // Handle edit note
    const handleEditNote = (note) => {
        setFormData({
            title: note.title,
            description: note.description || '',
            subject: note.subject,
            googleDriveUrl: note.googleDriveUrl,
            isPublished: note.isPublished
        });
        setSelectedNote(note);
        setIsAdding(true);
    };

    // Handle edit note from AllNotesManager
    const handleEditFromManager = (note) => {
        handleEditNote(note);
        setShowAllNotesManager(false);
    };

    // Handle delete note from AllNotesManager
    const handleDeleteFromManager = (noteId) => {
        setNotes(notes.filter(note => note._id !== noteId));
        if (selectedNote?._id === noteId) {
            setSelectedNote(null);
        }
    };

    // Get only 5 latest notes for sidebar
    const latestNotes = notes.slice(-5).reverse();

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
                        {selectedNote?.googleDriveUrl ? (
                            <iframe
                                src={convertGoogleDriveUrl(selectedNote.googleDriveUrl)}
                                title={selectedNote.title}
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
                                    onClick={() => {
                                        setIsAdding(!isAdding);
                                        if (!isAdding) {
                                            // Clear form when starting to add a new note
                                            setSelectedNote(null);
                                            setFormData({
                                                title: '',
                                                description: '',
                                                subject: 'General',
                                                googleDriveUrl: '',
                                                isPublished: true
                                            });
                                        }
                                    }}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-richblack-900 font-semibold py-2 rounded-lg mb-4 transition-colors flex items-center justify-center gap-2"
                                >
                                    <AiOutlinePlus /> Add Note
                                </button>

                                {/* Add Note Form */}
                                {isAdding && (
  <NestedNoteForm
    onSave={async (noteData) => {
      const response = await createNote(noteData, token);

      if (response?.data?.success && response?.data?.data) {
        const newNote = response.data.data;
        setNotes((prev) => [...prev, newNote]);
        setSelectedNote(newNote);
      }
    }}
    onCancel={() => {
      setIsAdding(false);
    }}
  />
)}

                                {/* Notes List */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-semibold text-richblack-300">
                                            Latest Notes ({latestNotes.length})
                                        </h3>
                                        {notes.length > 5 && (
                                            <button
                                                onClick={() => setShowAllNotesManager(true)}
                                                className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                                                title={`Manage all ${notes.length} notes`}
                                            >
                                                <MdOpenInNew size={14} />
                                                All ({notes.length})
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {latestNotes.length === 0 ? (
                                            <p className="text-richblack-400 text-center py-4 text-sm">
                                                No notes yet
                                            </p>
                                        ) : (
                                            latestNotes.map((note) => (
                                                <div
                                                    key={note._id}
                                                    className={`p-3 rounded-lg cursor-pointer transition-all group ${selectedNote?._id === note._id
                                                        ? 'bg-yellow-600'
                                                        : 'bg-richblack-700 hover:bg-richblack-600'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedNote(note)}>
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
                                                        <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditNote(note);
                                                                }}
                                                                className="p-1 bg-blue-600 hover:bg-blue-700 rounded"
                                                                title="Edit"
                                                            >
                                                                <MdEdit className="text-white" size={14} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteNote(note._id);
                                                                }}
                                                                className="p-1 bg-red-600 hover:bg-red-700 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                            >
                                                                <AiOutlineDelete className="text-white" size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
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
                                            {selectedNote.googleDriveUrl ? (
                                                <iframe
                                                    src={convertGoogleDriveUrl(selectedNote.googleDriveUrl)}
                                                    title={selectedNote.title}
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

            {/* All Notes Manager Modal */}
            {showAllNotesManager && (
                <AllNotesManager
                    notes={notes}
                    token={token}
                    onClose={() => setShowAllNotesManager(false)}
                    onEdit={handleEditFromManager}
                    onDelete={handleDeleteFromManager}
                />
            )}
        </div>
    );
};

export default Notes;