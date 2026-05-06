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
  const [selectedOptions, setSelectedOptions] = useState({}); // { qId: 'A' }
  const [numericalInputs, setNumericalInputs] = useState({}); // { qId: 'value' }
  const [revealedQuestions, setRevealedQuestions] = useState({}); // { qId: true }

  const questionsPerPage = 5;
  const decodedChapter = useMemo(() => decodeURIComponent(chapterName || ""), [chapterName]);

  /**
   * ROBUST PARSER
   * Cleans strings like "{'identifier': 'A'}" into valid objects
   */
  const parseOption = (opt) => {
    if (typeof opt !== "string") return opt;
    try {
      const fixedJson = opt
        .replace(/'/g, '"') // Replace single quotes with double quotes
        .replace(/None/g, "null"); // Handle Python-style None if present
      return JSON.parse(fixedJson);
    } catch (e) {
      // Manual fallback using regex if JSON is malformed
      const identifier = opt.match(/identifier':\s*'([^']*)'/)?.[1] || "";
      const content = opt.match(/content':\s*'([^']*)'/)?.[1] || "";
      return { identifier, content };
    }
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

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(questions.length / questionsPerPage));
  const currentQuestions = useMemo(() => {
    const start = (currentPage - 1) * questionsPerPage;
    return questions.slice(start, start + questionsPerPage);
  }, [questions, currentPage]);

  // HANDLE MCQ CLICK
  const handleOptionClick = (qId, clickedId, correctOptionRaw) => {
    if (revealedQuestions[qId]) return;

    let correctId = "";
    try {
      const parsed = JSON.parse(correctOptionRaw);
      correctId = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch (e) {
      correctId = correctOptionRaw?.replace(/[\[\]"']/g, "") || "";
    }

    setSelectedOptions((prev) => ({ ...prev, [qId]: clickedId }));
    setRevealedQuestions((prev) => ({ ...prev, [qId]: true }));

    if (clickedId === correctId) {
      toast.success("Correct Answer!");
    } else {
      toast.error("Wrong Answer!");
    }
  };

  // HANDLE NUMERICAL SUBMIT
  const handleNumericalSubmit = (qId, expectedAnswer) => {
    const userAnswer = numericalInputs[qId]?.trim().toLowerCase();
    const cleanExpected = String(expectedAnswer).trim().toLowerCase();

    if (!userAnswer) return toast.error("Please enter an answer");

    setRevealedQuestions((prev) => ({ ...prev, [qId]: true }));
    if (userAnswer === cleanExpected) {
      toast.success("Numerical Correct!");
    } else {
      toast.error(`Incorrect. The answer is ${expectedAnswer}`);
    }
  };

  if (error) return <div className="text-white p-10 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-richblack-900 py-10 text-white font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-10 border-b border-richblack-700 pb-6">
          <h1 className="text-3xl font-extrabold text-yellow-50">{decodedChapter.replace(/-/g, " ")}</h1>
          <p className="text-richblack-300 mt-2">Practice Session | Page {currentPage} of {totalPages}</p>
        </header>

        {loading ? (
          <div className="text-center py-20 animate-pulse text-xl">Loading Questions...</div>
        ) : (
          <div className="space-y-10">
            {currentQuestions.map((q, idx) => {
              const qId = q.question_id || q._id;
              const isRevealed = revealedQuestions[qId];
              const userSelection = selectedOptions[qId];
              const hasOptions = q.options && q.options.length > 0;

              // Parse Correct Option ID
              let correctId = "";
              try {
                const parsed = JSON.parse(q.correct_option);
                correctId = Array.isArray(parsed) ? parsed[0] : parsed;
              } catch (e) {
                correctId = q.correct_option?.replace(/[\[\]"']/g, "");
              }

              return (
                <div key={qId} className="bg-richblack-800 p-8 rounded-2xl border border-richblack-700 shadow-lg">
                  {/* Topic & Paper Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-900/30 text-blue-200 text-[10px] px-2 py-1 rounded uppercase tracking-wider border border-blue-800">
                      {q.topic?.replace(/-/g, " ")}
                    </span>
                    <span className="bg-richblack-700 text-richblack-200 text-[10px] px-2 py-1 rounded uppercase tracking-wider">
                      {q.paper_id}
                    </span>
                  </div>

                  {/* Question Text */}
                  <div className="text-lg leading-relaxed mb-8">
                    <span className="text-yellow-100 font-bold mr-3">
                      Q{(currentPage - 1) * questionsPerPage + idx + 1}.
                    </span>
                    {q.question}
                  </div>

                  {/* Interaction Area */}
                  {hasOptions ? (
                    /* MCQ LAYOUT */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((optStr, i) => {
                        const opt = parseOption(optStr);
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
                    /* NUMERICAL LAYOUT (If no options exist) */
                    <div className="flex flex-col gap-4 max-w-sm">
                      <input
                        type="text"
                        placeholder="Enter numerical answer..."
                        disabled={isRevealed}
                        value={numericalInputs[qId] || ""}
                        onChange={(e) => setNumericalInputs({ ...numericalInputs, [qId]: e.target.value })}
                        className="bg-richblack-900 border border-richblack-600 p-3 rounded-lg focus:outline-none focus:border-yellow-100"
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

                  {/* Solution & Correct Answer Section */}
                  {isRevealed && (
                    <div className="mt-8 p-6 bg-richblack-900 rounded-xl border-l-4 border-yellow-400 animate-fadeIn">
                      <div className="text-yellow-100 font-bold mb-2 flex items-center gap-2">
                        <span>Solution</span>
                        {!hasOptions && <span className="text-white font-normal ml-4 bg-richblack-700 px-2 py-0.5 rounded text-sm">Correct Answer: {q.answer}</span>}
                      </div>
                      <p className="text-richblack-100 text-sm italic leading-relaxed">
                        {q.solution || "No explanation available."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-4 py-10">
              <button
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo(0,0); }}
                className="px-6 py-2 bg-richblack-800 rounded-full border border-richblack-700 disabled:opacity-20 hover:bg-richblack-700 transition-all"
              >
                Previous
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentPage(i + 1); window.scrollTo(0,0); }}
                    className={`w-10 h-10 rounded-full transition-all ${
                      currentPage === i + 1 
                        ? "bg-yellow-100 text-black font-bold scale-110 shadow-[0_0_15px_rgba(255,214,10,0.3)]" 
                        : "bg-richblack-800 text-richblack-200 border border-richblack-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo(0,0); }}
                className="px-6 py-2 bg-richblack-800 rounded-full border border-richblack-700 disabled:opacity-20 hover:bg-richblack-700 transition-all"
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