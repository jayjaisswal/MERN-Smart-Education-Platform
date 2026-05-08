import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import parse, { domToReact } from "html-react-parser";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { getChemistryQuestionsByChapter } from "../../../services/operations/jeeChemistryAPI";

/**
 * COMPONENT: FormattedText
 * Precision handling for multi-line Chemistry LaTeX and arrows
 */
const FormattedText = ({ text, block = false }) => {
  if (!text) return null;

  /**
   * REAGENT NORMALIZER: 
   * This is the most critical part. It captures the broken \buildrel patterns
   * and converts them into standard KaTeX arrows.
   */
  const normalizeChemistry = (raw) => {
    let processed = String(raw);

    // 1. Convert Unicode arrows to LaTeX command for consistency
    processed = processed.replace(/⟶/g, "\\longrightarrow ");

    // 2. Handle the specific \buildrel pattern you are seeing:
    // This regex looks for: \buildrel [ANYTHING] \over \longrightarrow
    // And converts it to: \xrightarrow{ANYTHING}
    const buildRelRegex = /\\buildrel\s*(.*?)\s*\\over\s*\\longrightarrow/g;
    processed = processed.replace(buildRelRegex, "\\xrightarrow{$1}");

    // 3. Fallback for the simpler \buildrel [ANYTHING] ⟶ pattern
    const buildRelSimpleRegex = /\\buildrel\s*(.*?)\s*\\longrightarrow/g;
    processed = processed.replace(buildRelSimpleRegex, "\\xrightarrow{$1}");

    // 4. Clean up fragmented math (e.g., reagents sitting on newlines)
    // We check if LaTeX-like commands exist but are not wrapped in $$
    if (
      (processed.includes("\\buildrel") || 
       processed.includes("\\xrightarrow") || 
       processed.includes("\\longrightarrow")) && 
      !processed.includes("$$")
    ) {
      // Flatten newlines so the reaction stays on one horizontal line
      const flattened = processed.replace(/\n+/g, " ").trim();
      processed = `$$ ${flattened} $$`;
    }

    return processed;
  };

  // Clean HTML and run the chemistry normalizer
  const cleanHtml = normalizeChemistry(text)
    .replace(/<style([\s\S]*?)<\/style>/gi, "")
    .replace(/&nbsp;/g, " ")
    .trim();

  const parseOptions = {
    replace: (domNode) => {
      // Handle the reconstructed LaTeX blocks
      if (domNode.type === "text" && domNode.data.includes("$$")) {
        const parts = domNode.data.split(/(\$\$.*?\$\$)/gs);
        
        return (
          <>
            {parts.map((part, i) => {
              if (part.startsWith("$$") && part.endsWith("$$")) {
                const math = part.substring(2, part.length - 2).trim();
                
                return (
                  <span key={i} className="inline-block py-2 max-w-full overflow-x-auto align-middle no-scrollbar">
                    {/* Using BlockMath for questions makes the \xrightarrow look better (larger) */}
                    {block ? (
                      <BlockMath math={math} />
                    ) : (
                      <InlineMath math={math} />
                    )}
                  </span>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </>
        );
      }

      // Responsive Table Handling
      if (domNode.name === "table") {
        return (
          <div className="my-4 overflow-x-auto rounded-xl border border-richblack-600">
            <table className="w-full border-collapse bg-richblack-900/50 text-sm">
              {domToReact(domNode.children, parseOptions)}
            </table>
          </div>
        );
      }
    },
  };

  return (
    <div className="formatted-content break-words leading-relaxed">
      {parse(cleanHtml, parseOptions)}
    </div>
  );
};

export default function JeeChemistryQuestions() {
  const { chapterName } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [revealedQuestions, setRevealedQuestions] = useState({});

  const questionsPerPage = 5;
  const decodedChapter = useMemo(() => decodeURIComponent(chapterName || ""), [chapterName]);

  const getCleanCorrectId = (raw) => {
    if (Array.isArray(raw)) return String(raw[0] || "");
    return String(raw || "").replace(/[\[\]"']/g, "");
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
    clickedId === correctId ? toast.success("Correct!") : toast.error("Incorrect");
  };

  if (error) return <div className="text-white p-10 text-center font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-richblack-900 py-10 text-white font-sans selection:bg-yellow-100/30">
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-10 border-b border-richblack-700 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-yellow-50 capitalize tracking-tight">
              {decodedChapter.replace(/-/g, " ")}
            </h1>
            <p className="text-richblack-300 mt-1 text-sm font-medium">JEE Preparation • {questions.length} Questions Found</p>
          </div>
          <div className="bg-richblack-800 px-4 py-1.5 rounded-full border border-richblack-600 text-xs text-richblack-200">
            Page {currentPage} of {totalPages}
          </div>
        </header>

        {loading ? (
          <div className="text-center py-24 flex flex-col items-center gap-6">
            <div className="w-10 h-10 border-4 border-yellow-50 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-richblack-200 text-lg animate-pulse tracking-wide">Rendering chemical formulas...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {currentQuestions.map((q, idx) => {
              const qId = q.question_id || q._id;
              const isRevealed = revealedQuestions[qId];
              const userSelection = selectedOptions[qId];
              const correctId = getCleanCorrectId(q.correct_option);
              const normalizedOptions = Array.isArray(q.options) ? q.options : [];

              
              
              // Dynamic Question Numbering
              const questionNumber = ((currentPage - 1) * questionsPerPage) + idx + 1;



              return (
                <div key={qId} className="bg-richblack-800 p-6 md:p-8 rounded-3xl border border-richblack-700 shadow-2xl transition-all duration-300 hover:border-richblack-500">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-cyan-900/30 text-cyan-300 text-[10px] px-3 py-1 rounded-full border border-cyan-800 font-bold uppercase tracking-widest">
                      {q.topic?.replace(/-/g, " ")}
                    </span>
                    <span className="bg-richblack-700 text-green-600 text-[10px] px-3 py-1 rounded-full font-bold uppercase">
                      {q.paper_id}
                    </span>
                  </div>

                  <div className="text-lg md:text-xl leading-normal mb-8 text-richblack-5">
                    <div className="flex items-start">
                        <span className="text-yellow-100 font-black mr-3 text-2xl">
                        Q.{questionNumber}
                        </span>
                        <div className="flex-1">
                            <FormattedText text={q.question} block={true} />
                        </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {normalizedOptions.map((opt, i) => {
                      const isCorrect = opt.identifier === correctId;
                      const isSelected = userSelection === opt.identifier;

                      let btnStyle = "bg-richblack-700/40 border-richblack-600 hover:bg-richblack-700 hover:border-richblack-400";
                      if (isRevealed) {
                        if (isCorrect) btnStyle = "bg-green-900/30 border-green-500 text-green-50";
                        else if (isSelected) btnStyle = "bg-red-900/30 border-red-500 text-red-50";
                        else btnStyle = "opacity-40 border-richblack-700 pointer-events-none";
                      }

                      return (
                        <button
                          key={i}
                          disabled={isRevealed}
                          onClick={() => handleOptionClick(qId, opt.identifier, q.correct_option)}
                          className={`group p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-start gap-4 ${btnStyle}`}
                        >
                          <div className={`w-7 h-7 flex-shrink-0 rounded-lg border-2 flex items-center justify-center text-xs font-black ${
                            isRevealed && isCorrect ? "bg-green-500 border-green-500 text-white" :
                            isRevealed && isSelected ? "bg-red-500 border-red-500 text-white" :
                            "border-richblack-500 text-richblack-400"
                          }`}>
                            {opt.identifier}
                          </div>
                          <div className="text-base md:text-lg flex-1">
                            <FormattedText text={opt.content} />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {isRevealed && (
                    <div className="mt-8 p-6 bg-richblack-900/80 rounded-2xl border-l-4 border-yellow-200 animate-in fade-in slide-in-from-top-2 duration-500">
                      <h4 className="text-yellow-100 font-black text-xs uppercase tracking-widest mb-4">Mechanism & Solution</h4>
                      <div className="text-richblack-100 text-sm md:text-base leading-relaxed">
                        <FormattedText text={q.solution} block={true} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex justify-center items-center gap-2 py-10">
              <button
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-2.5 bg-richblack-800 rounded-xl border border-richblack-600 disabled:opacity-20 hover:bg-richblack-700 transition-all font-bold text-sm"
              >
                Prev
              </button>
              
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                    return (
                      <button
                        key={i}
                        onClick={() => { setCurrentPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-10 h-10 rounded-xl font-bold transition-all text-sm ${
                          currentPage === pageNum ? "bg-yellow-100 text-black shadow-lg" : "bg-richblack-800 border border-richblack-700 hover:border-richblack-500"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={i} className="text-richblack-600 self-end px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-2.5 bg-richblack-800 rounded-xl border border-richblack-600 disabled:opacity-20 hover:bg-richblack-700 transition-all font-bold text-sm"
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