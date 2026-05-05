import React, { useState, useEffect } from 'react';
import { MdSearch } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { fetchAllNotes, fetchAllSubjects } from '../../../services/operations/notesAPI';
import SubjectCard from './SubjectCard';
import NotesExplorer from './NotesExplorer';
import toast from 'react-hot-toast';

const StudentNotesPage = () => {
    const { token } = useSelector((state) => state.auth);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [notesCount, setNotesCount] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (token) {
            loadSubjects();
        } else {
            toast.error('Please login to access notes');
            setLoading(false);
        }
    }, [token]);

    const loadSubjects = async () => {
        try {
            setLoading(true);
            console.log('Loading subjects with token:', token?.substring(0, 20) + '...');
            const data = await fetchAllSubjects(token);
            console.log('Subjects data received:', data);

            if (data?.data && Array.isArray(data.data)) {
                // Extract subjects and build count map from the response
                const subjectList = data.data.map(item => item.subject);
                const countMap = {};
                data.data.forEach(item => {
                    countMap[item.subject] = item.count || 0;
                });
                setSubjects(subjectList);
                setNotesCount(countMap);
            } else {
                console.warn('Invalid subjects data format:', data);
                setSubjects([]);
                toast.error('Failed to load subjects - invalid data format');
            }
        } catch (error) {
            console.error('Error loading subjects:', error);
            toast.error('Failed to load subjects');
        } finally {
            setLoading(false);
        }
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedSubject) {
        return (
            <NotesExplorer
                selectedSubject={selectedSubject}
                onClose={() => setSelectedSubject(null)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-richblack-900 py-8 px-4 md:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-richblack-5 mb-3">
                        📚 Study Notes Library
                    </h1>
                    <p className="text-richblack-400 text-lg">
                        Access comprehensive notes and lectures from expert instructors
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-2xl">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-400 text-xl" />
                    <input
                        type="text"
                        placeholder="Search subjects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-richblack-800 text-richblack-5 placeholder-richblack-500 pl-12 pr-4 py-3 rounded-lg border border-richblack-700 focus:border-yellow-400 focus:outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-richblack-700 border-t-yellow-400" />
                    </div>
                ) : filteredSubjects.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-richblack-400 text-xl">
                            {searchQuery ? 'No subjects found matching your search' : 'No subjects available'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSubjects.map((subject) => (
                            <SubjectCard
                                key={subject}
                                subject={subject}
                                count={notesCount[subject] || 0}
                                onSelect={() => setSelectedSubject(subject)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentNotesPage;
