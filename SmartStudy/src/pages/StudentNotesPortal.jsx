import React, { useState, useEffect } from 'react';
import { AiOutlineFile, AiOutlineSearch } from 'react-icons/ai';
import { fetchAllSubjects } from '../../../services/operations/notesAPI';
import SubjectCard from './SubjectCard';
import NotesExplorer from './NotesExplorer';
import toast from 'react-hot-toast';

const StudentNotesPortal = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [explorerOpen, setExplorerOpen] = useState(false);

    useEffect(() => {
        const loadSubjects = async () => {
            setLoading(true);
            const data = await fetchAllSubjects();
            if (data?.data) {
                // Filter to only show subjects with notes
                const subjectsWithNotes = data.data.filter(s => s.count > 0);
                setSubjects(subjectsWithNotes);
            }
            setLoading(false);
        };
        loadSubjects();
    }, []);

    // Filter subjects by search
    const filteredSubjects = subjects.filter(s =>
        s.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-richblack-900 pt-20 pb-10">
            {/* Sidebar Explorer */}
            {explorerOpen && (
                <NotesExplorer
                    selectedSubject={selectedSubject}
                    onClose={() => setExplorerOpen(false)}
                    onSubjectSelect={setSelectedSubject}
                />
            )}

            {/* Main Content */}
            <div className="w-11/12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-richblack-5 mb-3">
                        📚 Study Notes & Lectures
                    </h1>
                    <p className="text-richblack-300 text-lg">
                        Access PDF notes and video lectures from instructors
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8 flex gap-4 items-center flex-wrap">
                    <div className="flex-1 min-w-[250px] relative">
                        <AiOutlineSearch className="absolute left-4 top-3 text-richblack-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search subjects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-richblack-800 text-richblack-5 placeholder-richblack-400 rounded-lg pl-12 pr-4 py-3 border border-richblack-700 focus:border-yellow-400 focus:outline-none transition-colors"
                        />
                    </div>

                    <button
                        onClick={() => setExplorerOpen(!explorerOpen)}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${explorerOpen
                                ? 'bg-yellow-400 text-richblack-900'
                                : 'bg-richblack-700 text-richblack-200 hover:bg-richblack-600'
                            }`}
                    >
                        {explorerOpen ? '📂 Close Explorer' : '📂 Open Explorer'}
                    </button>
                </div>

                {/* Subject Cards Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-richblack-700 border-t-yellow-400" />
                    </div>
                ) : filteredSubjects.length === 0 ? (
                    <div className="text-center py-20">
                        <AiOutlineFile size={64} className="text-richblack-700 mx-auto mb-4" />
                        <p className="text-richblack-400 text-xl">
                            {searchQuery ? 'No subjects found' : 'No notes available yet'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSubjects.map((subject) => (
                            <SubjectCard
                                key={subject.subject}
                                subject={subject.subject}
                                count={subject.count}
                                onSelect={() => {
                                    setSelectedSubject(subject.subject);
                                    setExplorerOpen(true);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentNotesPortal;
