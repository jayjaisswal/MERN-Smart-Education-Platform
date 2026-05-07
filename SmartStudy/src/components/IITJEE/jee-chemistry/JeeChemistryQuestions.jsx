import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { getChemistryQuestionsByChapter } from "../../../services/operations/jeeChemistryAPI";

export default function JeeChemistryQuestions() {
  const { chapterName } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [numericalInputs, setNumericalInputs] = useState({});
  const [revealedQuestions, setRevealedQuestions] = useState({});

  const questionsPerPage = 5;
  const decodedChapter = useMemo(() => decodeURIComponent(chapterName || ""), [chapterName]);

  /**
   * ROBUST PARSER
   * Handles strings like "{'identifier': 'A', 'content': '...'}"
   */
  const parseOption = (opt) => {
    if (typeof opt !== "string") return opt;
    try {
      const fixedJson = opt
        .replace(/'/g, '"')
        .replace(/None/g, "null");
      return JSON.parse(fixedJson);
    } catch (e) {
      const identifier = opt.match(/identifier':\s*'([^']*)'/)?.[1] || "";
      const content = opt.match(/content':\s*'([^']*)'/)?.[1] || "";
      return { identifier, content };
    }
  };

  /**
   * CLEAN CORRECT ID
   * Ensures ["C"] or "C" or even "['C']" becomes "C"
   */
  const getCleanCorrectId = (raw) => {
    if (Array.isArray(raw)) return String(raw[0] || "");
    if (typeof raw === "string") return raw.replace(/[\[\]"']/g, "");
    return String(raw || "");
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getChemistryQuestionsByChapter(decodedChapter);
        const data = res?.data || (Array.isArray(res) ? res : []);
        setQuestions(data);
      } catch (e) {
        setError("Failed to fetch questions.");
        toast.error("Error loading questions");
      } finally {
        setLoading(false);
      }
    };
    if (decodedChapter) load();
  }, [decodedChapter]);

  // PAGINATION LOGIC
  const totalPages = Math.max(1, Math.ceil(questions.length / questionsPerPage));
  const currentQuestions = useMemo(() => {
    const start = (currentPage - 1) * questionsPerPage;
    return questions.slice(start, start + questionsPerPage);
  }, [questions, currentPage]);

  const handleOptionClick = (qId, clickedId, correctOptionRaw) => {
    if (revealedQuestions[qId]) return;

    const correctId = getCleanCorrectId(correctOptionRaw);

    setSelectedOptions((prev) => ({ ...prev, [qId]: clickedId }));
    setRevealedQuestions((prev) => ({ ...prev, [qId]: true }));

    if (clickedId === correctId) {
      toast.success("Correct Answer!");
    } else {
      toast.error("Wrong Answer!");
    }
  };

  const handleNumericalSubmit = (qId, expectedAnswer) => {
    const userAnswer = numericalInputs[qId]?.trim().toLowerCase();
    const cleanExpected = String(expectedAnswer).trim().toLowerCase();
    if (!userAnswer) return toast.error("Please enter an answer");

    setRevealedQuestions((prev) => ({ ...prev, [qId]: true }));
    if (userAnswer === cleanExpected) {
      toast.success("Correct!");
    } else {
      toast.error(`Incorrect. Answer is ${expectedAnswer}`);
    }
  };

  if (error) return <div className="text-white p-10 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-richblack-900 py-10 text-white font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-10 border-b border-richblack-700 pb-6">
          <h1 className="text-3xl font-extrabold text-yellow-50">
            {decodedChapter.replace(/-/g, " ")}
          </h1>
          <p className="text-richblack-300 mt-2">
            Practice Session | Page {currentPage} of {totalPages}
          </p>
        </header>

        {loading ? (
          <div className="text-center py-20 animate-pulse text-xl">Loading Questions...</div>
        ) : (
          <div className="space-y-10">
            {currentQuestions.map((q, idx) => {
              const qId = q.question_id || q._id;
              const isRevealed = revealedQuestions[qId];
              const userSelection = selectedOptions[qId];
              const correctId = getCleanCorrectId(q.correct_option);

              // DETECT OPTION FORMAT: Array of objects vs Array of strings
              const isModernFormat = Array.isArray(q.options) &&
                typeof q.options[0] === 'object' &&
                !q.options[0].identifier;

              const normalizedOptions = isModernFormat
                ? Object.entries(q.options[0])
                  .filter(([key]) => key !== "_id")
                  .map(([key, val]) => ({ identifier: key, content: val }))
                : (q.options || []).map(opt => parseOption(opt));

              return (
                <div key={qId} className="bg-richblack-800 p-8 rounded-2xl border border-richblack-700 shadow-lg">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-900/30 text-blue-200 text-[10px] px-2 py-1 rounded uppercase tracking-wider border border-blue-800">
                      {q.topic?.replace(/-/g, " ")}
                    </span>
                    <span className="bg-richblack-700 text-richblack-200 text-[10px] px-2 py-1 rounded uppercase tracking-wider">
                      {q.paper_id}
                    </span>
                  </div>

                  <div className="text-lg leading-relaxed mb-8">
                    <span className="text-yellow-100 font-bold mr-3">
                      Q{(currentPage - 1) * questionsPerPage + idx + 1}.
                    </span>
                    {q.question}
                  </div>

                  {normalizedOptions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {normalizedOptions.map((opt, i) => {
                        const isCorrect = opt.identifier === correctId;
                        const isSelected = userSelection === opt.identifier;

                        let btnStyle = "bg-richblack-700 border-richblack-600 hover:bg-richblack-600";
                        if (isRevealed) {
                          if (isCorrect) btnStyle = "bg-green-900/40 border-green-500 text-green-50";
                          else if (isSelected) btnStyle = "bg-red-900/40 border-red-500 text-red-50";
                          else btnStyle = "opacity-40 border-richblack-700";
                        }

                        return (
                          <button
                            key={i}
                            disabled={isRevealed}
                            onClick={() => handleOptionClick(qId, opt.identifier, q.correct_option)}
                            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 ${btnStyle}`}
                          >
                            <span className="font-black text-yellow-100">{opt.identifier}.</span>
                            <span>{opt.content}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 max-w-sm">
                      <input
                        type="text"
                        placeholder="Enter numerical answer..."
                        disabled={isRevealed}
                        value={numericalInputs[qId] || ""}
                        onChange={(e) => setNumericalInputs({ ...numericalInputs, [qId]: e.target.value })}
                        className="bg-richblack-900 border border-richblack-600 p-3 rounded-lg focus:outline-none focus:border-yellow-100 text-white"
                      />
                      {!isRevealed && (
                        <button
                          onClick={() => handleNumericalSubmit(qId, q.answer)}
                          className="bg-yellow-100 text-black font-bold py-2 rounded-lg hover:bg-yellow-200 transition-all"
                        >
                          Check Answer
                        </button>
                      )}
                    </div>
                  )}

                  {isRevealed && (
                    <div className="mt-8 p-6 bg-richblack-900 rounded-xl border-l-4 border-yellow-400 animate-fadeIn">
                      <div className="text-yellow-100 font-bold mb-2 flex items-center gap-2">
                        <span>Solution</span>
                        {normalizedOptions.length === 0 && (
                          <span className="text-white font-normal ml-4 bg-richblack-700 px-2 py-0.5 rounded text-sm">
                            Correct Answer: {q.answer}
                          </span>
                        )}
                      </div>
                      <p className="text-richblack-100 text-sm italic leading-relaxed">
                        {q.solution && q.solution.length > 500
                          ? q.solution.slice(738)
                          : q.solution || "No explanation available."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* PAGINATION CONTROLS */}
{/* PAGINATION CONTROLS */}
<div className="flex flex-wrap justify-center items-center gap-3 py-10">
  {/* Previous Button */}
  <button
    disabled={currentPage === 1}
    onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo(0, 0); }}
    className="px-4 py-2 bg-richblack-800 rounded-lg border border-richblack-700 disabled:opacity-20 hover:bg-richblack-700 transition-all text-sm"
  >
    Prev
  </button>

  {/* Page Numbers - Sliding Window */}
  <div className="flex gap-1 sm:gap-2">
    {(() => {
      const pages = [];
      const range = 1; // Number of pages to show before/after current page

      for (let i = 1; i <= totalPages; i++) {
        // Always show first page, last page, current page, and pages within range
        if (
          i === 1 || 
          i === totalPages || 
          (i >= currentPage - range && i <= currentPage + range)
        ) {
          pages.push(
            <button
              key={i}
              onClick={() => { setCurrentPage(i); window.scrollTo(0, 0); }}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg transition-all text-sm ${
                currentPage === i
                  ? "bg-yellow-100 text-black font-bold scale-110 shadow-lg"
                  : "bg-richblack-800 text-richblack-200 border border-richblack-700 hover:bg-richblack-700"
              }`}
            >
              {i}
            </button>
          );
        } 
        // Show dots if there is a gap
        else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
          pages.push(
            <span key={i} className="text-richblack-400 self-center px-1">
              ...
            </span>
          );
        }
      }
      return pages;
    })()}
  </div>

  {/* Next Button */}
  <button
    disabled={currentPage === totalPages}
    onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo(0, 0); }}
    className="px-4 py-2 bg-richblack-800 rounded-lg border border-richblack-700 disabled:opacity-20 hover:bg-richblack-700 transition-all text-sm"
  >
    Next
  </button>
</div>
          </div>
        )}
      </div>
    </div>
  );
}