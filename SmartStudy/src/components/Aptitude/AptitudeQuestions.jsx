import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAptitudeQuestions } from "../../services/operations/aptitudeAPI";
import QuestionItem from "./QuestionItem";

export default function AptitudeQuestions() {
    const { category, topic } = useParams();
    const navigate = useNavigate();
    const { auth } = useSelector((state) => state);

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const questionsPerPage = 4;

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const data = await getAptitudeQuestions(
                    category,
                    currentPage,
                    questionsPerPage,
                    topic
                );
                if (data) {
                    setQuestions(data.data);
                    setTotalPages(data.pagination.totalPages);
                    setTotalQuestions(data.pagination.totalQuestions);
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
            setLoading(false);
        };

        fetchQuestions();
    }, [category, topic, currentPage]);

    const decodedTopic = decodeURIComponent(topic);

    return (
        <div className="min-h-screen bg-richblack-900 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(`/aptitude-topics/${category}`)}
                        className="mb-4 text-yellow-50 hover:text-yellow-100 flex items-center gap-2"
                    >
                        ← Back to Topics
                    </button>
                    <h1 className="text-3xl font-bold text-white capitalize">
                        {decodedTopic}
                    </h1>
                    <p className="text-richblack-300 mt-2">{totalQuestions} Questions</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-50"></div>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="text-center text-richblack-300 py-12">
                        No questions found
                    </div>
                ) : (
                    <>
                        {/* Questions List */}
                        <div className="space-y-3 mb-8">
                            {questions.map((question, index) => (
                                <QuestionItem
                                    key={question._id}
                                    question={question}
                                    questionNumber={(currentPage - 1) * questionsPerPage + index + 1}
                                    category={category}
                                    topic={topic}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-richblack-800 text-white rounded-lg hover:bg-richblack-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 rounded-lg ${currentPage === page
                                            ? "bg-yellow-50 text-richblack-900 font-bold"
                                            : "bg-richblack-800 text-white hover:bg-richblack-700"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-richblack-800 text-white rounded-lg hover:bg-richblack-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
