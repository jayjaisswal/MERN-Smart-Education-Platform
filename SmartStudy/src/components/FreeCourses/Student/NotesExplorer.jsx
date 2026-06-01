import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MdClose } from 'react-icons/md';
import { AiOutlineFile } from 'react-icons/ai';
import { fetchAllNotes } from '../../../services/operations/notesAPI';
import NoteViewer from './NoteViewer';
import toast from 'react-hot-toast';

const NotesExplorer = ({ selectedSubject, onClose, onSubjectSelect }) => {
    const { token } = useSelector((state) => state.auth);
    const [allNotes, setAllNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    useEffect(() => {
        if (token) {
            loadAllNotes();
        }
    }, [token]);

    const loadAllNotes = async () => {
        setLoading(true);
        try {
            const data = await fetchAllNotes({}, token);
            if (data?.data && Array.isArray(data.data)) {
                setAllNotes(data.data);
                if (data.data.length > 0) {
                    setSelectedNote(data.data[0]);
                }
            } else {
                setAllNotes([]);
            }
        } catch (error) {
            console.error('Error loading notes:', error);
            toast.error('Failed to load notes');
            setAllNotes([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-40 bg-richblack-900 bg-opacity-50 lg:bg-opacity-0 flex">
            {/* Sidebar - Notes List */}
            <div className="w-full md:w-96 bg-richblack-900 border-r border-richblack-700 flex flex-col h-full overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-richblack-800 border-b border-richblack-700 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-richblack-5 font-bold text-lg">📚 Notes</h3>
                        <p className="text-richblack-400 text-sm">{allNotes.length} notes</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-richblack-700 rounded-lg transition-colors"
                    >
                        <MdClose size={20} className="text-richblack-400 hover:text-richblack-200" />
                    </button>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto px-2 py-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-richblack-700 border-t-yellow-400" />
                        </div>
                    ) : allNotes.length === 0 ? (
                        <p className="text-richblack-400 text-center py-8 text-sm">No notes available</p>
                    ) : (
                        allNotes.map((note) => (
                            <NoteItem
                                key={note._id}
                                note={note}
                                isSelected={selectedNote?._id === note._id}
                                onSelect={() => setSelectedNote(note)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Main Viewer - Desktop Only */}
            {selectedNote && (
                <div className="hidden lg:flex flex-1 flex-col bg-richblack-800">
                    <NoteViewer
                        note={selectedNote}
                        allNotes={allNotes}
                        onSelectNote={setSelectedNote}
                        onClose={onClose}
                    />
                </div>
            )}
        </div>
    );
};

const NoteItem = ({ note, isSelected, onSelect }) => {
    const hasChapters = note.chapters && note.chapters.length > 0;

    return (
        <div
            onClick={onSelect}
            className={`p-3 rounded-lg cursor-pointer transition-all mb-2 flex items-start gap-3 ${isSelected
                ? 'bg-yellow-600 text-richblack-900'
                : 'bg-richblack-800 text-richblack-300 hover:bg-richblack-700'
                }`}
        >
            <div className="flex-shrink-0 pt-1">
                <AiOutlineFile size={18} className="text-yellow-400" />
            </div>

            <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm truncate ${isSelected ? 'text-richblack-900' : 'text-richblack-5'}`}>
                    {note.title}
                </p>
                {note.description && (
                    <p className={`text-xs line-clamp-1 mt-1 ${isSelected ? 'text-richblack-800' : 'text-richblack-400'}`}>
                        {note.description}
                    </p>
                )}
                {hasChapters && (
                    <p className={`text-xs mt-1 ${isSelected ? 'text-richblack-900 font-semibold' : 'text-yellow-300'}`}>
                        📂 {note.chapters.length} chapters
                    </p>
                )}
            </div>
        </div>
    );
};

export default NotesExplorer;



