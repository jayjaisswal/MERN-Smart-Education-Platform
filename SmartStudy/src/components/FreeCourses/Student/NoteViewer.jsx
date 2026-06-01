import React, { useState, useMemo, useEffect } from "react";
import {
  MdClose,
  MdChevronLeft,
  MdChevronRight,
  MdFullscreen,
  MdFullscreenExit,
  MdMenu,
  MdExpandMore,
  MdDownload,
  MdChevronRight as MdChevronRightIcon,
} from "react-icons/md";

const NoteViewer = ({ note, onClose, allNotes, onSelectNote }) => {
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [parentNotebook, setParentNotebook] = useState(null);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (note?.chapters && note.chapters.length > 0) {
      setParentNotebook(note);
    } else if (!parentNotebook && note) {
      setParentNotebook(note);
    }
  }, [note]);

  const chapters = useMemo(() => {
    if (!parentNotebook?.chapters || parentNotebook.chapters.length === 0) return [];
    return parentNotebook.chapters;
  }, [parentNotebook?.chapters]);

  useEffect(() => {
    if (chapters.length > 0) {
      const firstChapter = chapters[0];
      setExpandedChapters((prev) => {
        if (Object.keys(prev).length > 0) return prev;
        return { [firstChapter.name]: true };
      });
      if (note && !note.googleDriveUrl && !note.chapterName && firstChapter.notes && firstChapter.notes.length > 0) {
        onSelectNote({ ...firstChapter.notes[0], chapterName: firstChapter.name });
      }
    }
  }, [chapters]);

  useEffect(() => {
    setIframeLoading(true);
    setIframeKey(prev => prev + 1);
  }, [note?._id]);

  const flatViewableNotes = useMemo(() => {
    const list = [];
    if (parentNotebook?.chapters && parentNotebook.chapters.length > 0) {
      parentNotebook.chapters.forEach(ch =>
        ch.notes?.forEach(n => list.push({ ...n, chapterName: ch.name }))
      );
    } else if (note?.googleDriveUrl) {
      list.push(note);
    }
    return list;
  }, [parentNotebook, note?.googleDriveUrl]);

  const currentIndex = flatViewableNotes.findIndex((n) => n._id === note?._id);
  const handlePrevious = () => currentIndex > 0 && onSelectNote(flatViewableNotes[currentIndex - 1]);
  const handleNext = () => currentIndex < flatViewableNotes.length - 1 && onSelectNote(flatViewableNotes[currentIndex + 1]);

  const getDrivePaths = (url) => {
    if (!url) return { embedUrl: null, downloadUrl: null };
    let fileId = "";
    if (url.includes("/d/")) {
      fileId = url.split("/d/")[1].split("/")[0];
    } else if (url.includes("id=")) {
      fileId = url.split("id=")[1].split("&")[0];
    } else {
      fileId = url;
    }
    return {
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    };
  };

  const { embedUrl, downloadUrl } = useMemo(() => getDrivePaths(note?.googleDriveUrl), [note?.googleDriveUrl]);
  const toggleChapter = (name) => setExpandedChapters(prev => ({ ...prev, [name]: !prev[name] }));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-richblack-900 w-full overflow-hidden">
      <div className="p-4 border-b border-richblack-700 bg-richblack-800 flex justify-between items-center gap-2 w-full min-w-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-richblack-5 font-bold text-lg truncate block w-full" title={parentNotebook?.title || note?.title}>
            {parentNotebook?.title || note?.title}
          </h3>
        </div>
        <button className="md:hidden text-richblack-200 shrink-0 p-1 hover:bg-richblack-700 rounded transition" onClick={() => setShowSidebar(false)}>
          <MdClose size={24} />
        </button>
      </div>

      <div className="py-2 overflow-y-auto flex-1 w-full">
        {chapters.length === 0 ? (
          <p className="text-richblack-400 text-center py-8 text-sm">No chapters available</p>
        ) : (
          chapters.map((chapter) => (
            <div key={chapter._id} className="border-b border-richblack-800 last:border-0 w-full">
              <button
                onClick={() => toggleChapter(chapter.name)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-richblack-800 transition"
              >
                <div className="flex items-center gap-2 text-indigo-300 font-medium text-sm text-left min-w-0 flex-1">
                  {expandedChapters[chapter.name] ? <MdExpandMore size={20} className="shrink-0" /> : <MdChevronRightIcon size={20} className="shrink-0" />}
                  <span className="truncate block flex-1">📘 {chapter.name}</span>
                </div>
              </button>
              {expandedChapters[chapter.name] && (
                <div className="bg-richblack-900/40 w-full">
                  {chapter.notes && chapter.notes.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => {
                        onSelectNote({ ...n, chapterName: chapter.name });
                        setShowSidebar(false);
                      }}
                      className={`px-10 py-2.5 cursor-pointer text-sm flex items-center gap-3 transition-all ${n._id === note?._id
                        ? "bg-indigo-500/20 text-indigo-200 border-l-4 border-indigo-500"
                        : "text-richblack-400 hover:text-richblack-5 hover:bg-richblack-800"
                        }`}
                    >
                      <span className="truncate block">📄 {n.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-richblack-900 flex flex-col overflow-hidden">
      <div className="flex flex-1 relative overflow-hidden">

        {showSidebar && (
          <div className="fixed inset-0 bg-black/70 md:hidden z-[60]" onClick={() => setShowSidebar(false)} />
        )}

        <div className={`fixed md:relative z-[70] w-72 h-full border-r border-richblack-700 transition-transform duration-300 ease-in-out overflow-hidden
          ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <SidebarContent />
        </div>

        <div className={`flex-1 flex flex-col h-full bg-black transition-all duration-300 ${fullScreenMode ? "fixed inset-0 z-[80]" : "relative"}`}>

          <div className="flex justify-between items-center p-2.5 md:p-3 border-b border-richblack-700 bg-richblack-900">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <button className="md:hidden p-2 bg-richblack-800 rounded text-white hover:bg-richblack-700 shrink-0" onClick={() => setShowSidebar(true)}>
                <MdMenu size={20} />
              </button>
              <div className="truncate min-w-0 flex-1">
                <h2 className="text-white font-semibold text-xs md:text-sm truncate leading-tight">
                  {note?.title || "Select a note"}
                </h2>
                {note?.chapterName && (
                  <p className="text-[9px] md:text-[10px] text-richblack-400 uppercase tracking-tighter truncate mt-0.5">
                    {note?.chapterName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-3 shrink-0">
              <div className="flex items-center bg-richblack-800 rounded-lg p-0.5">
                <button onClick={handlePrevious} className="p-1.5 hover:bg-richblack-700 rounded text-white transition disabled:opacity-30" disabled={currentIndex <= 0}>
                  <MdChevronLeft size={18} />
                </button>
                <div className="w-[1px] h-4 bg-richblack-600 mx-0.5" />
                <button onClick={handleNext} className="p-1.5 hover:bg-richblack-700 rounded text-white transition disabled:opacity-30" disabled={currentIndex >= flatViewableNotes.length - 1}>
                  <MdChevronRight size={18} />
                </button>
              </div>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-richblack-800 text-richblack-100 border border-richblack-700 rounded-lg hover:bg-richblack-700 hover:text-white transition flex items-center justify-center"
                  title="Download PDF Document File"
                >
                  <MdDownload size={18} />
                </a>
              )}

              <button
                onClick={() => setFullScreenMode(!fullScreenMode)}
                className="p-2 bg-indigo-500/10 text-indigo-300 rounded-lg hover:bg-indigo-500/20 transition hidden md:flex"
                title="Desktop Fullscreen"
              >
                {fullScreenMode ? <MdFullscreenExit size={18} /> : <MdFullscreen size={18} />}
              </button>

              <button onClick={onClose} className="p-2 text-pink-400 hover:bg-pink-900/10 rounded-lg transition">
                <MdClose size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-richblack-900 relative overflow-hidden">
            {iframeLoading && (
              <div className="absolute inset-0 z-10 bg-richblack-950 flex flex-col items-center justify-center text-richblack-400 gap-3 p-4 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-r-transparent" />
                <p className="text-sm font-medium tracking-wide text-richblack-200">Loading Document...</p>
                <p className="text-xs text-richblack-500">Please wait while the PDF loads completely</p>
              </div>
            )}

            {embedUrl ? (
              <div className="relative w-full h-full">
                <iframe
                  key={iframeKey}
                  src={embedUrl}
                  onLoad={() => setIframeLoading(false)}
                  className={`w-full h-full border-0 transition-opacity duration-300 ${iframeLoading ? "opacity-0" : "opacity-100"}`}
                  title={note?.title}
                  allow="autoplay"
                />
                
                {/* CRITICAL FIX: Transparency Layer covering Google's top nav action bar completely.
                  Instead of a tiny ugly black block, this covers the top 54px with an invisible pane.
                  Using `pointer-events: all` blocks clicks from ever reaching the pop-out button underneath,
                  making it impossible for users to open the tab link.
                */}
                {!iframeLoading && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "54px",
                      zIndex: 10,
                      backgroundColor: "transparent",
                      pointerEvents: "all",
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-richblack-400 p-4 text-center">
                <p className="text-sm">No valid documentation frame linked.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NoteViewer;