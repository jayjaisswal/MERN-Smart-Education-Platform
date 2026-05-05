import React from 'react';
import { MdArrowForward } from 'react-icons/md';

const subjectIcons = {
    Physics: '⚛️',
    Chemistry: '🧪',
    Biology: '🔬',
    Mathematics: '📐',
    English: '📖',
    History: '📜',
    Geography: '🗺️',
    Economics: '💹',
    'Computer Science': '💻',
    General: '📚',
};

const SubjectCard = ({ subject, count, onSelect }) => {
    const icon = subjectIcons[subject] || '📚';

    return (
        <div
            onClick={onSelect}
            className="group bg-gradient-to-br from-richblack-800 to-richblack-700 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-richblack-700 hover:to-richblack-600 border border-richblack-700 hover:border-yellow-400"
        >
            {/* Header with Icon */}
            <div className="px-6 py-8 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 group-hover:from-yellow-500 group-hover:to-orange-500 transition-all">
                <div className="text-6xl mb-4">{icon}</div>
                <h3 className="text-2xl font-bold text-richblack-900 group-hover:text-black transition-colors">
                    {subject}
                </h3>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
                {/* Stats */}
                <div className="mb-6">
                    <p className="text-richblack-300 text-sm">Available Notes & Lectures</p>
                    <p className="text-3xl font-bold text-yellow-400 mt-1">{count}</p>
                </div>

                {/* Description based on subject */}
                <p className="text-richblack-400 text-sm mb-6 line-clamp-2">
                    {getSubjectDescription(subject)}
                </p>

                {/* Action Button */}
                <button className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-richblack-900 font-semibold py-3 rounded-lg transition-all group/btn">
                    <span>Explore Notes</span>
                    <MdArrowForward className="group-hover/btn:translate-x-1 transition-transform" size={20} />
                </button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400 opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity" />
        </div>
    );
};

const getSubjectDescription = (subject) => {
    const descriptions = {
        Physics: 'Master fundamental and advanced physics concepts with detailed notes',
        Chemistry: 'Learn organic, inorganic, and physical chemistry systematically',
        Biology: 'Comprehensive notes covering botany, zoology, and molecular biology',
        Mathematics: 'From algebra to calculus - complete mathematical foundation',
        English: 'Literature, grammar, and communication skills in one place',
        History: 'Understanding historical events, periods, and civilizations',
        Geography: 'Physical and human geography across the globe',
        Economics: 'Economic principles, markets, and policy fundamentals',
        'Computer Science': 'Programming, algorithms, and computer science fundamentals',
        General: 'Miscellaneous educational materials and resources',
    };
    return descriptions[subject] || 'Quality educational content';
};

export default SubjectCard;
