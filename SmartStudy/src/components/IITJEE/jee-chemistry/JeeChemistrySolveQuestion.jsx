import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getChemistryQuestionById } from "../../../services/operations/jeeChemistryAPI";

export default function JeeChemistrySolveQuestion() {
  const { questionId } = useParams();
  const navigate = useNavigate();

  const decodedQuestionId = useMemo(
    () => decodeURIComponent(questionId || ""),
    [questionId]
  );

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getChemistryQuestionById(decodedQuestionId);
        setQuestion(res?.data || res);
      } catch (e) {
        console.error(e);
        setError("Failed to load question.");
      }
      setLoading(false);
      setSelectedIndex(null);
      setShowResult(false);
    };

    if (decodedQuestionId) load();
  }, [decodedQuestionId]);

  const correctIndex = useMemo(() => {
    if (!question?.correct_option || !question?.options?.length) return null;

    // Backend stores correct_option as array of strings (option content?)
    // We'll match by option content.
    const correctSet = new Set(question.correct_option);

    const idx = question.options.findIndex((opt) => correctSet.has(opt.content));
    return idx >= 0 ? idx : null;
  }, [question]);

  const handleSelect = (idx) => {
    setSelectedIndex(idx);
    setShowResult(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-richblack-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-50" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-richblack-900 flex justify-center items-center px-4">
        <div className="bg-red-900 border border-red-700 rounded-lg p-6 text-center">
          <p className="text-white font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-richblack-900 flex justify-center items-center">
        <div className="text-white">Question not found.</div>
      </div>
    );
  }

  const options = question.options || [];

  return (
    <div className="min-h-screen bg-richblack-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-yellow-300 hover:text-yellow-200 flex items-center gap-2"
          >
            ← Back
          </button>
          <div className="bg-gradient-to-r from-richblack-800 to-richblack-700 rounded-xl p-5 border border-richblack-600">
            <p className="text-cyan-200 text-sm font-semibold capitalize">
              {question.chapter ? question.chapter.replace(/-/g, " ") : "Chemistry"}
            </p>
            <h1 className="text-2xl font-bold text-cyan-50 mt-2">
              {question.question}
            </h1>
          </div>
        </div>

        <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
          <h3 className="text-cyan-200 font-bold mb-4">Choose the correct option</h3>

          <div className="space-y-3">
            {options.map((opt, idx) => {
              const isCorrect = showResult && correctIndex === idx;
              const isWrongSelected =
                showResult && selectedIndex === idx && correctIndex !== idx;

              return (
                <button
                  key={opt.identifier || idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showResult}
                  className={`w-full text-left flex items-start gap-4 p-4 border-2 rounded-lg transition-all ${
                    isCorrect
                      ? "bg-green-500/20 border-green-500/60 cursor-not-allowed"
                      : isWrongSelected
                      ? "bg-red-500/20 border-red-500/60 cursor-not-allowed"
                      : showResult
                      ? "bg-richblack-700 border-richblack-600 cursor-not-allowed opacity-70"
                      : "border-richblack-500 hover:border-cyan-400 hover:bg-richblack-700/50 cursor-pointer"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                      isCorrect
                        ? "border-green-500 bg-green-500/20"
                        : isWrongSelected
                        ? "border-red-500 bg-red-500/20"
                        : "border-richblack-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`font-bold ${
                        isCorrect
                          ? "text-green-200"
                          : isWrongSelected
                          ? "text-red-200"
                          : "text-white"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}.
                    </p>
                    <p
                      className={`mt-1 ${
                        isCorrect
                          ? "text-green-100"
                          : isWrongSelected
                          ? "text-red-100"
                          : "text-white"
                      }`}
                    >
                      {opt.content}
                    </p>
                  </div>

                  {isCorrect && <span className="ml-auto text-green-400 font-bold">✓</span>}
                  {isWrongSelected && <span className="ml-auto text-red-400 font-bold">✗</span>}
                </button>
              );
            })}
          </div>
        </div>

        {showResult && (
          <div className="mt-5">
            {selectedIndex === correctIndex ? (
              <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-5">
                <p className="text-green-200 font-bold">✅ Correct</p>
                {question.solution && (
                  <div className="mt-3">
                    <p className="text-green-200 font-semibold">Solution</p>
                    <p className="text-richblack-100 mt-2 leading-relaxed">{question.solution}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-5">
                <p className="text-red-200 font-bold">❌ Incorrect</p>
                {question.solution && (
                  <div className="mt-3">
                    <p className="text-red-200 font-semibold">Solution</p>
                    <p className="text-richblack-100 mt-2 leading-relaxed">{question.solution}</p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => navigate(-1)}
              className="mt-5 w-full bg-yellow-400 hover:bg-yellow-500 text-richblack-900 font-bold py-2 rounded-lg transition-all"
            >
              Back to Questions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

