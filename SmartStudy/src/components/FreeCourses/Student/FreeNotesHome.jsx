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
            className="group relative bg-richblack-800/70 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer border border-richblack-700 hover:border-indigo-400/60 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
        >
            {/* Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 blur-xl"></div>

            {/* Header */}
            <div className="relative p-5 border-b border-richblack-700">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-richblack-5 line-clamp-2 group-hover:text-indigo-300 transition">
                            {note.title}
                        </h3>

                        <p className="text-sm text-richblack-400 mt-2 line-clamp-2">
                            {note.description || "No description available"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="relative p-5 space-y-4">
                {/* Subject */}
                <div className="flex items-center justify-between">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-400/10 text-indigo-300 border border-indigo-400/30">
                        {note.subject}
                    </span>

                    {/* Icon */}
                    <MdOpenInNew
                        className="text-richblack-400 group-hover:text-indigo-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                        size={20}
                    />
                </div>

                {/* Date */}
                <div className="flex items-center justify-between text-xs text-richblack-400">
                    <span className="flex items-center gap-1">
                        📅
                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </span>

                    {/* Status */}
                    <span className="text-green-400 text-[10px] bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                        Ready
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="relative px-5 py-3 border-t border-richblack-700 flex items-center justify-between bg-richblack-800/50 backdrop-blur-md">
                <span className="text-sm text-richblack-300 group-hover:text-indigo-300 transition">
                    Open PDF
                </span>

                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-400/10 group-hover:bg-indigo-400 transition">
                    <MdOpenInNew className="text-indigo-400 group-hover:text-black" />
                </div>
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
<div className="max-w-7xl mx-auto mb-12 px-2">

  {/* Header */}
  <div className="mb-10">
    <h1 className="text-4xl md:text-5xl font-bold text-richblack-5 mb-2 tracking-tight">
      📚 Free Notes Library
    </h1>
    <p className="text-richblack-400 text-lg">
      Browse <span className="text-indigo-400 font-semibold">{notes.length}</span> notes • Organized by subject
    </p>
  </div>

  {/* Search */}
  <div className="relative mb-8">
    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-400" size={20} />

    <input
      type="text"
      placeholder="Search notes..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-12 pr-10 py-3 bg-richblack-800/70 backdrop-blur-md text-richblack-5 placeholder-richblack-500 rounded-xl border border-richblack-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none transition-all"
    />

    {searchQuery && (
      <button
        onClick={() => setSearchQuery("")}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-richblack-400 hover:text-red-400 transition"
      >
        <MdClose size={20} />
      </button>
    )}
  </div>

  {/* Filters */}
  <div className="bg-richblack-800/60 backdrop-blur-md p-5 rounded-2xl border border-richblack-700 space-y-4">

    {/* Top Row */}
    <div className="flex items-center justify-between flex-wrap gap-3">

      {/* Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition"
      >
        <MdFilter size={18} />
        Filters
      </button>

      {/* Sort */}
      {showFilters && (
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-richblack-700 text-richblack-5 rounded-lg border border-richblack-600 focus:border-indigo-400 outline-none transition"
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title (A-Z)</option>
        </select>
      )}
    </div>

    {/* Subjects */}
    {showFilters && (
      <div>
        <p className="text-richblack-400 text-sm mb-2">Subjects</p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSubject("All")}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
              selectedSubject === "All"
                ? "bg-indigo-500/20 text-indigo-300 border-indigo-400"
                : "bg-richblack-700 text-richblack-300 border-richblack-600 hover:bg-richblack-600"
            }`}
          >
            All
          </button>

          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                selectedSubject === subject
                  ? "bg-indigo-500/20 text-indigo-300 border-indigo-400"
                  : "bg-richblack-700 text-richblack-300 border-richblack-600 hover:bg-richblack-600"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
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
