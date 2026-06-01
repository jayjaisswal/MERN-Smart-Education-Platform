import React, { useState, useCallback, useMemo } from 'react';
import { MdSearch, MdClose, MdEdit, MdDelete, MdClear } from 'react-icons/md';
import toast from 'react-hot-toast';
import { deleteNote } from '../../../services/operations/notesAPI';

const AllNotesManager = ({ notes, token, onClose, onEdit, onDelete }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [dateFilter, setDateFilter] = useState('All');
    const [publishedFilter, setPublishedFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Get date filter function
    const getDateFilterFunction = (filter) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(today);
        thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return (date) => {
            const noteDate = new Date(date);
            const noteDateOnly = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate());

            switch (filter) {
                case 'today':
                    return noteDateOnly.getTime() === today.getTime();
                case 'week':
                    return noteDate >= thisWeek && noteDate <= now;
                case 'month':
                    return noteDate >= thisMonth && noteDate <= now;
                case 'All':
                default:
                    return true;
            }
        };
    };

    // Filter and sort notes
    const filteredNotes = useMemo(() => {
        let filtered = [...notes];

        // Filter by published status
        if (publishedFilter !== 'All') {
            const isPublished = publishedFilter === 'published';
            filtered = filtered.filter(note => note.isPublished === isPublished);
        }

        // Filter by date
        const dateFilterFn = getDateFilterFunction(dateFilter);
        filtered = filtered.filter(note => dateFilterFn(note.createdAt));

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

        return filtered;
    }, [notes, searchQuery, sortBy, dateFilter, publishedFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
    const paginatedNotes = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredNotes.slice(startIndex, endIndex);
    }, [filteredNotes, currentPage]);

    const handleDelete = async (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            const response = await deleteNote(noteId, token);
            if (response?.data?.success) {
                toast.success('Note deleted successfully');
                onDelete(noteId);
            } else {
                toast.error(response?.data?.message || 'Failed to delete note');
            }
        }
    };

    // Check if any filters are active
    const hasActiveFilters = searchQuery || dateFilter !== 'All' || publishedFilter !== 'All';

    const resetFilters = () => {
        setSearchQuery('');
        setDateFilter('All');
        setPublishedFilter('All');
        setCurrentPage(1);
    };

    return (
        <div className="fixed inset-0 z-50 bg-richblack-900/95 flex items-center justify-center p-4">
            <div className="bg-richblack-800 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
                {/* Header - Fixed */}
                <div className="bg-richblack-700 border-b-2 border-yellow-400/30 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-richblack-5">Manage All Notes</h2>
                        <p className="text-richblack-400 text-sm mt-1">
                            Total: <span className="text-yellow-400 font-semibold">{notes.length}</span> • Showing: <span className="text-yellow-400 font-semibold">{filteredNotes.length}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-richblack-600 rounded-lg transition-colors flex-shrink-0"
                    >
                        <MdClose size={24} className="text-white" />
                    </button>
                </div>

                {/* Search and Filters - Fixed, Optimized Layout */}
                <div className="bg-richblack-800 border-b border-richblack-600 px-6 py-4 space-y-4 flex-shrink-0">
                    {/* Search Bar - Takes full width */}
                    <div className="relative w-full">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-richblack-400 pointer-events-none" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title or description..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-3 bg-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-lg border border-richblack-600 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400/30 text-base"
                        />
                    </div>

                    {/* Filters Grid - 3 columns layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {/* Date Filter */}
                        <div>
                            <label className="text-richblack-300 text-xs font-semibold block mb-2 uppercase tracking-wide">Date Created</label>
                            <select
                                value={dateFilter}
                                onChange={(e) => {
                                    setDateFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-3 py-2 bg-richblack-700 text-richblack-5 rounded-lg border border-richblack-600 focus:border-yellow-400 focus:outline-none text-sm hover:border-richblack-500 transition-colors"
                            >
                                <option value="All">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>

                        {/* Published Status Filter */}
                        <div>
                            <label className="text-richblack-300 text-xs font-semibold block mb-2 uppercase tracking-wide">Status</label>
                            <select
                                value={publishedFilter}
                                onChange={(e) => {
                                    setPublishedFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-3 py-2 bg-richblack-700 text-richblack-5 rounded-lg border border-richblack-600 focus:border-yellow-400 focus:outline-none text-sm hover:border-richblack-500 transition-colors"
                            >
                                <option value="All">All Status</option>
                                <option value="published">Published</option>
                                <option value="unpublished">Unpublished</option>
                            </select>
                        </div>

                        {/* Sort Filter */}
                        <div>
                            <label className="text-richblack-300 text-xs font-semibold block mb-2 uppercase tracking-wide">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-3 py-2 bg-richblack-700 text-richblack-5 rounded-lg border border-richblack-600 focus:border-yellow-400 focus:outline-none text-sm hover:border-richblack-500 transition-colors"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="oldest">Oldest First</option>
                                <option value="title">Title (A-Z)</option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 px-4 py-2 bg-richblack-700 hover:bg-richblack-600 text-richblack-300 rounded-lg transition-colors text-sm font-medium w-fit"
                        >
                            <MdClear size={16} />
                            Clear All Filters
                        </button>
                    )}
                </div>

                {/* Notes Table - Scrollable */}
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-richblack-700 z-10">
                            <tr className="border-b-2 border-yellow-400/30">
                                <th className="px-6 py-3 text-left text-richblack-300 font-semibold">Title</th>
                                <th className="px-6 py-3 text-left text-richblack-300 font-semibold min-w-[80px]">Status</th>
                                <th className="px-6 py-3 text-left text-richblack-300 font-semibold min-w-[120px]">Date</th>
                                <th className="px-6 py-3 text-center text-richblack-300 font-semibold min-w-[100px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedNotes.length > 0 ? (
                                paginatedNotes.map((note) => (
                                    <tr key={note._id} className="border-b border-richblack-700 hover:bg-richblack-700/50 transition-colors">
                                        <td className="px-6 py-4 text-richblack-5 font-medium max-w-sm truncate">
                                            {note.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${note.isPublished
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-orange-500/20 text-orange-400'
                                                }`}>
                                                {note.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-richblack-400 whitespace-nowrap">
                                            {new Date(note.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => onEdit(note)}
                                                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <MdEdit className="text-white" size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(note._id)}
                                                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <MdDelete className="text-white" size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-richblack-400">
                                        No notes found matching your filters
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - Fixed */}
                {totalPages > 1 && (
                    <div className="bg-richblack-700 border-t border-richblack-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
                        <div className="text-richblack-400 text-sm">
                            Page <span className="text-yellow-400 font-semibold">{currentPage}</span> of <span className="text-yellow-400 font-semibold">{totalPages}</span> • {filteredNotes.length} total results
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1
                                    ? 'bg-richblack-600 text-richblack-500 cursor-not-allowed'
                                    : 'bg-yellow-400 hover:bg-yellow-500 text-richblack-900'
                                    }`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === totalPages
                                    ? 'bg-richblack-600 text-richblack-500 cursor-not-allowed'
                                    : 'bg-yellow-400 hover:bg-yellow-500 text-richblack-900'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllNotesManager;
