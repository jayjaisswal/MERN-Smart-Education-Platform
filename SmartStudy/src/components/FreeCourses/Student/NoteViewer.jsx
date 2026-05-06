import React, { useState, useMemo } from "react";
import {
  MdClose,
  MdChevronLeft,
  MdChevronRight,
  MdFullscreen,
  MdMenu,
} from "react-icons/md";

const NoteViewer = ({ note, onClose, allNotes, onSelectNote }) => {
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(
    note?.subject || null
  );
  const [showSidebar, setShowSidebar] = useState(false);

  // 🔥 Convert Google Drive URL
  const convertGoogleDriveUrl = (url) => {
    let fileId = "";

    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match) fileId = match[1];
    } else if (/^[a-zA-Z0-9-_]+$/.test(url)) {
      fileId = url;
    }

    if (!fileId) return null;

    return `https://drive.google.com/file/d/${fileId}/preview?embedded=true&rm=minimal`;
  };

  const embedUrl = convertGoogleDriveUrl(note.googleDriveUrl);

  // 🔥 Get all subjects
  const subjects = [...new Set(allNotes.map((n) => n.subject))];

  // 🔥 Group ONLY selected subject
  const groupedNotes = useMemo(() => {
    if (!selectedSubject) return {};

    const data = {};

    allNotes
      .filter((n) => n.subject === selectedSubject)
      .forEach((n) => {
        const chapter = n.chapter || "General";

        if (!data[chapter]) data[chapter] = [];
        data[chapter].push(n);
      });

    return data;
  }, [allNotes, selectedSubject]);

  // 🔥 Sort chapters
  const sortedChapters = Object.entries(groupedNotes).sort(([a], [b]) => {
    const numA = parseInt(a.match(/\d+/));
    const numB = parseInt(b.match(/\d+/));
    return (numA || 0) - (numB || 0);
  });

  // 🔥 Navigation inside chapter
  const filteredNotes = useMemo(() => {
    if (!note.chapter) return [note];

    return allNotes.filter(
      (n) =>
        n.subject === note.subject &&
        n.chapter === note.chapter
    );
  }, [note, allNotes]);

  const currentIndex = filteredNotes.findIndex((n) => n._id === note._id);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onSelectNote(filteredNotes[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredNotes.length - 1) {
      onSelectNote(filteredNotes[currentIndex + 1]);
    }
  };

  // 🔥 FULLSCREEN MODE
  if (fullScreenMode) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="flex justify-between items-center p-3 border-b border-richblack-700">
          <h2 className="text-white text-sm">{note.title}</h2>

          <button onClick={() => setFullScreenMode(false)}>
            <MdClose className="text-white" size={22} />
          </button>
        </div>

        <iframe
          src={embedUrl}
          className="w-full h-full"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-richblack-900 flex flex-col">

      {/* 🔥 SUBJECT SELECTOR (hidden when viewing PDF) */}
      {!note && (
        <div className="flex gap-2 p-3 border-b border-richblack-700 overflow-x-auto">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                selectedSubject === subject
                  ? "bg-indigo-500 text-white"
                  : "bg-richblack-800 text-richblack-300 hover:bg-richblack-700"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-1">

        {/* 🔥 DESKTOP SIDEBAR */}
        <div className="hidden md:flex w-72 flex-col border-r border-richblack-700 bg-richblack-900 overflow-y-auto">

          <div className="p-4 border-b border-richblack-700">
            <h3 className="text-sm text-richblack-400">
              📂 {selectedSubject || "Select Subject"}
            </h3>
          </div>

          {sortedChapters.map(([chapter, notes]) => (
            <div key={chapter} className="ml-2">

              <div className="px-4 py-1 text-sm text-indigo-300">
                📘 {chapter}
              </div>

              {notes.map((n) => (
                <div
                  key={n._id}
                  onClick={() => onSelectNote(n)}
                  className={`px-6 py-2 cursor-pointer text-sm transition ${
                    n._id === note._id
                      ? "bg-indigo-500/20 text-indigo-300 border-l-2 border-indigo-400"
                      : "text-richblack-300 hover:bg-richblack-800"
                  }`}
                >
                  📄 {n.title}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 🔥 MOBILE SIDEBAR DRAWER */}
        {showSidebar && (
          <div className="fixed inset-0 z-50 bg-black/70 md:hidden">
            <div className="w-72 h-full bg-richblack-900 p-4 overflow-y-auto">

              <button
                onClick={() => setShowSidebar(false)}
                className="mb-3 text-white"
              >
                <MdClose size={22} />
              </button>

              <h3 className="text-richblack-400 mb-3">
                📂 {selectedSubject}
              </h3>

              {sortedChapters.map(([chapter, notes]) => (
                <div key={chapter}>

                  <div className="text-indigo-300 text-sm">
                    📘 {chapter}
                  </div>

                  {notes.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => {
                        onSelectNote(n);
                        setShowSidebar(false);
                      }}
                      className="text-sm py-1 text-richblack-300"
                    >
                      📄 {n.title}
                    </div>
                  ))}

                </div>
              ))}

            </div>
          </div>
        )}

        {/* 🔥 MAIN CONTENT */}
        <div className="flex-1 flex flex-col">

          {/* HEADER */}
          <div className="flex justify-between items-center p-4 border-b border-richblack-700">

            {/* MOBILE MENU */}
            <button
              className="md:hidden p-2 bg-richblack-800 rounded"
              onClick={() => setShowSidebar(true)}
            >
              <MdMenu className="text-white" size={22} />
            </button>

            <div className="flex-1 ml-3">
              <h2 className="text-white font-semibold">{note.title}</h2>
              <p className="text-xs text-richblack-400">
                {note.subject} • {note.chapter}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                className="p-2 bg-richblack-800 rounded"
              >
                <MdChevronLeft />
              </button>

              <button
                onClick={handleNext}
                className="p-2 bg-richblack-800 rounded"
              >
                <MdChevronRight />
              </button>

              <button
                onClick={() => setFullScreenMode(true)}
                className="p-2 bg-indigo-500/20 text-indigo-300 rounded"
              >
                <MdFullscreen />
              </button>

              <button
                onClick={onClose}
                className="p-2 text-red-400"
              >
                <MdClose />
              </button>
            </div>
          </div>

          {/* PDF VIEW */}
          <div className="flex-1">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-richblack-400">
                Failed to load PDF
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FULLSCREEN BUTTON */}
      <div className="md:hidden fixed bottom-5 right-5">
        <button
          onClick={() => setFullScreenMode(true)}
          className="px-4 py-2 bg-indigo-500 text-white rounded-full"
        >
          Fullscreen
        </button>
      </div>
    </div>
  );
};

export default NoteViewer;