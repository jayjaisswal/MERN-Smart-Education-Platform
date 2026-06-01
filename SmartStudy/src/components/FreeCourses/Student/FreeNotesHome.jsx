import React, { useState, useEffect } from 'react';
import { MdSearch, MdSort, MdClose, MdOutlineArrowOutward, MdCalendarToday } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { fetchAllNotes } from '../../../services/operations/notesAPI';
import NoteViewer from './NoteViewer';
import toast from 'react-hot-toast';

const FreeNotesHome = () => {
    const { token } = useSelector((state) => state.auth);
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);
    const [sortBy, setSortBy] = useState('recent');

    useEffect(() => {
        loadNotes();
    }, [token]);

    useEffect(() => {
        applyFiltersAndSort();
    }, [notes, searchQuery, sortBy]);

    const loadNotes = async () => {
        try {
            setLoading(true);
            const notesData = await fetchAllNotes({}, token);
            if (notesData?.data && Array.isArray(notesData.data)) {
                setNotes(notesData.data);
            } else {
                setNotes([]);
                toast.error('Failed to load notes');
            }
        } catch (error) {
            console.error('Error loading notes:', error);
            toast.error('Failed to load notes library');
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...notes];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(note =>
                note.title.toLowerCase().includes(query) ||
                note.description?.toLowerCase().includes(query)
            );
        }

        if (sortBy === 'recent') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'oldest') {
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortBy === 'title') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        setFilteredNotes(filtered);
    };

    const NoteCard = ({ note }) => (
        <div
            onClick={() => setSelectedNote(note)}
            className="group relative flex flex-col justify-between p-5 bg-richblack-800/40 hover:bg-richblack-800/80 rounded-xl cursor-pointer border border-richblack-700/60 hover:border-indigo-500/50 transition-all duration-200 active:scale-[0.98]"
        >
            <div>
                {/* Header Title & Action Anchor */}
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-richblack-5 text-base line-clamp-1 group-hover:text-indigo-400 transition duration-200">
                        {note.title}
                    </h3>
                    <div className="text-richblack-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                        <MdOutlineArrowOutward size={18} />
                    </div>
                </div>

                {/* Snappy, shallow description */}
                <p className="text-sm text-richblack-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {note.description || "No description provided for this resource."}
                </p>
            </div>

            {/* Micro-Footer Metadata Row */}
            <div className="flex items-center justify-between mt-5 pt-3 border-t border-richblack-800/80 text-xs text-richblack-400">
                <span className="flex items-center gap-1.5 font-medium">
                    <MdCalendarToday size={13} className="text-richblack-500" />
                    {new Date(note.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </span>
                
                <span className="text-[11px] font-medium tracking-wide text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                    PDF Resource
                </span>
            </div>
        </div>
    );

    if (selectedNote) {
        return (
            <NoteViewer
                note={selectedNote}
                onClose={() => setSelectedNote(null)}
                allNotes={filteredNotes}
                onSelectNote={setSelectedNote}
            />
        );
    }

    return (
        <div className="min-h-screen bg-richblack-900 py-10 px-4 sm:px-6 lg:px-8 text-richblack-5">
            <div className="max-w-7xl mx-auto">
                
                {/* Header & Controls Matrix */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-richblack-5 tracking-tight flex items-center gap-2">
                            <span>📚</span> Free Notes Library
                        </h1>
                        <p className="text-richblack-400 text-sm mt-1">
                            Accessing <span className="text-indigo-400 font-semibold">{notes.length}</span> curated resources
                        </p>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Interactive Dynamic Search */}
                        <div className="relative flex-1 md:w-72">
                            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-richblack-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-9 py-2 bg-richblack-800/50 text-sm text-richblack-5 placeholder-richblack-500 rounded-lg border border-richblack-700/80 focus:border-indigo-500/80 focus:bg-richblack-800 outline-none transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-richblack-400 hover:text-pink-400 transition"
                                >
                                    <MdClose size={16} />
                                </button>
                            )}
                        </div>

                        {/* Streamlined Sort */}
                        <div className="relative flex items-center bg-richblack-800/50 rounded-lg border border-richblack-700/80 px-2.5">
                            <MdSort size={16} className="text-richblack-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent pl-1.5 pr-2 py-2 text-sm text-richblack-300 font-medium outline-none cursor-pointer hover:text-richblack-5 transition appearance-none"
                            >
                                <option value="recent">Recent</option>
                                <option value="oldest">Oldest</option>
                                <option value="title">A-Z</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Indicator */}
                {searchQuery && (
                    <div className="mb-4 text-xs text-richblack-400 font-medium animate-fadeIn">
                        Showing <span className="text-indigo-400">{filteredNotes.length}</span> matching results
                    </div>
                )}

                {/* Optimized Layout Grid */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <div className="animate-spin rounded-full h-9 w-9 border-2 border-indigo-500 border-r-transparent"></div>
                    </div>
                ) : filteredNotes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredNotes.map((note) => (
                            <NoteCard key={note._id} note={note} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] bg-richblack-800/10 border border-dashed border-richblack-800 rounded-2xl p-6">
                        <div className="text-4xl mb-2">📭</div>
                        <h3 className="text-lg font-semibold text-richblack-300">No notes found</h3>
                        <p className="text-richblack-500 text-sm max-w-xs text-center mt-1">
                            We couldn't find anything matching your request. Try alternative terms.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreeNotesHome;