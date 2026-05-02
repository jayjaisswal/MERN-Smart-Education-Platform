import React, { useState, useEffect, useRef, useCallback } from "react";

const ITEMS_PER_PAGE = 10;

/**
 * InterviewQA - All-in-one reader for Interview Q&A
 * Shows ALL questions and answers with infinite scrolling
 * @param {Array} questions - Array of Q&A objects with question, answer
 * @param {String} categoryColor - Color scheme for the category
 */
// eslint-disable-next-line no-unused-vars
export default function InterviewQA({ 
  questions = [], 
  categoryColor = "from-blue-500 to-cyan-500" 
}) {
const [showAnswers, setShowAnswers] = useState(true); // Show all answers by default for cramming
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Refs to avoid stale closures and dependency issues
  const observerTarget = useRef(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(1);
  const questionsRef = useRef(questions);

  // Keep questionsRef in sync
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  // Keep refs in sync with state to avoid dependency issues
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  // Initialize with first batch of questions
  useEffect(() => {
    if (questions && questions.length > 0) {
      setDisplayedQuestions(questions.slice(0, ITEMS_PER_PAGE));
      setPage(1);
      pageRef.current = 1;
      setHasMore(questions.length > ITEMS_PER_PAGE);
    }
  }, [questions]);

  // Load more questions when scrolling to bottom - using ref to avoid recreating callback
  const loadMoreQuestions = useCallback(() => {
    // Use refs to check conditions to avoid stale closures
    if (loadingRef.current || !hasMoreRef.current) return;

    setLoading(true);
    loadingRef.current = true;
    
    // Simulate slight delay for smooth scrolling experience
    setTimeout(() => {
      const currentPage = pageRef.current;
      const currentQuestions = questionsRef.current;
      const startIdx = currentPage * ITEMS_PER_PAGE;
      const endIdx = startIdx + ITEMS_PER_PAGE;
      const newQuestions = currentQuestions.slice(startIdx, endIdx);
      
      if (newQuestions.length > 0) {
        setDisplayedQuestions(prev => [...prev, ...newQuestions]);
        setPage(prev => prev + 1);
        pageRef.current = pageRef.current + 1;
        setHasMore(endIdx < currentQuestions.length);
      } else {
        setHasMore(false);
      }
      setLoading(false);
      loadingRef.current = false;
    }, 300);
  }, []); // Empty dependency array - uses refs instead

  // Infinite scroll observer - only depends on questions.length to avoid infinite loops
  useEffect(() => {
    const currentLoading = loading;
    const currentHasMore = hasMore;
    const currentQuestions = questions;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentHasMore && !currentLoading && currentQuestions.length > 0) {
          // Check refs again at observation time
          if (!loadingRef.current && hasMoreRef.current) {
            loadMoreQuestions();
          }
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [questions.length, loadMoreQuestions]);

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-richblack-400">No Q&A available</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Controls */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-richblack-300">
          Showing <span className="text-white font-bold">{displayedQuestions.length}</span> of{" "}
          <span className="text-white font-bold">{questions.length}</span> Q&A
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r ${categoryColor} text-white`}
          >
            {showAnswers ? "Hide Answers" : "Show Answers"}
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-4">
        <div className="w-full bg-richblack-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${categoryColor} transition-all duration-300`}
            style={{ width: `${(displayedQuestions.length / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Q&A List - With infinite scrolling */}
      <div className="space-y-4">
        {displayedQuestions.map((item, index) => (
          <div 
            key={item.id || index} 
            className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden"
          >
            {/* Question - Always visible */}
            <div className="p-4 border-b border-richblack-700 flex items-start gap-3">
              <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${categoryColor} flex items-center justify-center text-white font-bold text-sm`}>
                {index + 1}
              </span>
              <h3 className="text-lg text-white font-medium flex-grow">
                {item.question}
              </h3>
            </div>

            {/* Answer - Visible based on toggle */}
            {showAnswers && (
              <div className="p-4 pt-3 bg-richblack-900">
                <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                  ✓ Answer
                </h4>
                <div className="text-white text-base whitespace-pre-wrap">
                  {item.answer}
                </div>

                {/* Explanation - Interview tips */}
                {item.interviewExplanation && (
                  <div className="mt-4 pt-3 border-t border-richblack-700">
                    <h5 className="text-blue-400 font-semibold text-sm mb-1">
                      💡 Interview Tip:
                    </h5>
                    <p className="text-richblack-300 text-sm">
                      {item.interviewExplanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Loading indicator / Load more trigger */}
      <div ref={observerTarget} className="py-8">
        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {!loading && hasMore && (
          <div className="text-center">
            <p className="text-richblack-400 text-sm">Scroll for more Q&A...</p>
          </div>
        )}
        
        {!hasMore && displayedQuestions.length > 0 && (
          <div className="text-center">
            <p className="text-green-400 font-semibold">
              ✓ All {questions.length} Q&A loaded!
            </p>
          </div>
        )}
      </div>

      {/* Bottom note */}
      <div className="mt-4 text-center p-4 bg-richblack-800 rounded-xl border border-richblack-700">
        <p className="text-richblack-400 text-sm">
          🎯 Practice all {questions.length} Q&A for your interview!
        </p>
      </div>
    </div>
  );
}
