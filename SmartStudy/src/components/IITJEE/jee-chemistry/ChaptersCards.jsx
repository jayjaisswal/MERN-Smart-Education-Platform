import React from "react";
import { useNavigate } from "react-router-dom";
import { chemistryJeeMainsChaptersEnum } from "./jeeChemistryChapterEnum";

const chapterIcons = {
  hydrogen: "💧",
  "solid-state": "🧊",
  solutions: "🧪",
  thermodynamics: "♨️",
};

function prettyChapterName(slug) {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export default function ChaptersCards() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-richblack-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">JEE Main Chemistry</h1>
          <p className="text-richblack-300">Select a chapter to start practicing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chemistryJeeMainsChaptersEnum.map((chapter) => (
            <div
              key={chapter}
              onClick={() =>
                navigate(`/jee-chemistry/${encodeURIComponent(chapter)}`)
              }
              className="cursor-pointer group rounded-2xl border border-richblack-700 bg-gradient-to-br from-richblack-800 to-richblack-700 hover:border-yellow-400 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10"
            >
              <div className="px-6 py-7">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{chapterIcons[chapter] || "📘"}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-200 transition-colors">
                      {prettyChapterName(chapter)}
                    </h3>
                    <p className="text-richblack-300 text-sm mt-2">
                      Practice questions for this chapter
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-richblack-900 font-bold py-2 rounded-lg transition-all">
                    Practice Chapter →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

