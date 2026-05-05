import React, { useState, useEffect } from 'react';
import { MdSearch, MdFilter, MdClose, MdOpenInNew } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { fetchAllNotes, fetchAllSubjects } from '../../../services/operations/notesAPI';
import NoteViewer from './NoteViewer';
import toast from 'react-hot-toast';

const FreeNotesHome = () => {
    const { token } = useSelector((state) => state.auth);
    const [notes, setNotes] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [selectedNote, setSelectedNote] = useState(null);
    const [sortBy, setSortBy] = useState('recent');
    const [showFilters, setShowFilters] = useState(false);

    // Load all notes and subjects
    useEffect(() => {
        loadNotesAndSubjects();
    }, [token]);

    // Filter and sort notes
    useEffect(() => {
        applyFiltersAndSort();
    }, [notes, searchQuery, selectedSubject, sortBy]);

    const loadNotesAndSubjects = async () => {
        try {
            setLoading(true);

            // Fetch all notes
            const notesData = await fetchAllNotes({}, token);
            console.log('Notes data:', notesData);

            if (notesData?.data && Array.isArray(notesData.data)) {
                setNotes(notesData.data);
            } else {
                setNotes([]);
                toast.error('Failed to load notes');
            }

            // Fetch subjects
            const subjectsData = await fetchAllSubjects(token);
            console.log('Subjects data:', subjectsData);

            if (subjectsData?.data && Array.isArray(subjectsData.data)) {
                const uniqueSubjects = subjectsData.data.map(item => item.subject);
                setSubjects(uniqueSubjects);
            }
        } catch (error) {
            console.error('Error loading notes and subjects:', error);
            toast.error('Failed to load notes library');
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...notes];

        // Filter by subject
        if (selectedSubject !== 'All') {
            filtered = filtered.filter(note => note.subject === selectedSubject);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(note =>
                note.title.toLowerCase().includes(query) ||
                note.description?.toLowerCase().includes(query)
            );
        }

        // Sort
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
            className="group bg-richblack-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-300 cursor-pointer border border-richblack-700 hover:border-yellow-400"
        >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-yellow-400/20 to-purple-600/20 p-4 border-b border-richblack-700">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-richblack-5 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                            {note.title}
                        </h3>
                        <p className="text-sm text-richblack-400 mt-2 line-clamp-2">
                            {note.description || 'No description available'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
                {/* Subject Badge */}
                <div className="flex items-center gap-2">
                    <span className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded-full">
                        {note.subject}
                    </span>
                </div>

                {/* Instructor Info */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-purple-600 flex items-center justify-center text-richblack-900 font-bold text-sm">
                        {note.instructor?.firstName?.charAt(0)}{note.instructor?.lastName?.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-richblack-300 font-medium">
                            {note.instructor?.firstName} {note.instructor?.lastName}
                        </p>
                        <p className="text-xs text-richblack-400">
                            {note.instructor?.email}
                        </p>
                    </div>
                </div>

                {/* Date */}
                <div className="flex items-center justify-between text-xs text-richblack-400">
                    <span>
                        📅 {new Date(note.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </div>

            {/* Hover Action */}
            <div className="bg-richblack-700 px-4 py-3 border-t border-richblack-600 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm text-richblack-300">Click to view PDF</span>
                <MdOpenInNew className="text-yellow-400" size={18} />
            </div>
        </div>
    );

    // Show note viewer modal
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
        <div className="min-h-screen bg-richblack-900 py-8 px-4 md:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-richblack-5 mb-3">
                        📚 Free Notes Library
                    </h1>
                    <p className="text-richblack-400 text-lg">
                        Browse {notes.length} study notes from expert instructors • Organized by subject
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-richblack-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search notes by title or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-richblack-800 text-richblack-5 placeholder-richblack-400 rounded-lg border border-richblack-700 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-richblack-400 hover:text-richblack-300"
                        >
                            <MdClose size={20} />
                        </button>
                    )}
                </div>

                {/* Filters Section */}
                <div className="flex flex-wrap items-center gap-4 bg-richblack-800 p-4 rounded-lg border border-richblack-700">
                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-richblack-900 font-semibold rounded-lg transition-colors"
                    >
                        <MdFilter size={20} />
                        Filters
                    </button>

                    {/* Subject Filter */}
                    {showFilters && (
                        <div className="w-full md:w-auto flex flex-col gap-2">
                            <label className="text-richblack-300 text-sm font-medium">Subject:</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedSubject('All')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedSubject === 'All'
                                            ? 'bg-yellow-400 text-richblack-900'
                                            : 'bg-richblack-700 text-richblack-300 hover:bg-richblack-600'
                                        }`}
                                >
                                    All Subjects
                                </button>
                                {subjects.map((subject) => (
                                    <button
                                        key={subject}
                                        onClick={() => setSelectedSubject(subject)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedSubject === subject
                                                ? 'bg-yellow-400 text-richblack-900'
                                                : 'bg-richblack-700 text-richblack-300 hover:bg-richblack-600'
                                            }`}
                                    >
                                        {subject}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sort Filter */}
                    {showFilters && (
                        <div className="w-full md:w-auto">
                            <label className="text-richblack-300 text-sm font-medium block mb-2">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 bg-richblack-700 text-richblack-5 rounded-lg border border-richblack-600 focus:border-yellow-400 focus:outline-none transition-all"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="oldest">Oldest First</option>
                                <option value="title">Title (A-Z)</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mt-4 text-richblack-400 text-sm">
                    Found <span className="text-yellow-400 font-semibold">{filteredNotes.length}</span> note{filteredNotes.length !== 1 ? 's' : ''}
                    {selectedSubject !== 'All' && ` in ${selectedSubject}`}
                </div>
            </div>

            {/* Notes Grid */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex items-center justify-center min-h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-400 border-r-2 border-transparent"></div>
                    </div>
                ) : filteredNotes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.map((note) => (
                            <NoteCard key={note._id} note={note} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-96">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-2xl font-bold text-richblack-300 mb-2">No notes found</h3>
                        <p className="text-richblack-400 text-center max-w-md">
                            {searchQuery || selectedSubject !== 'All'
                                ? 'Try adjusting your search or filters to find more notes'
                                : 'No notes available at the moment'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreeNotesHome;
