import React, { useState, useMemo, useEffect } from "react";
import {
    MdClose,
    MdChevronLeft,
    MdChevronRight,
    MdFullscreen,
    MdFullscreenExit,
    MdMenu,
    MdExpandMore,
    MdChevronRight as MdChevronRightIcon,
} from "react-icons/md";

const NotesViewer = ({ note, onClose, allNotes, onSelectNote }) => {
    const [fullScreenMode, setFullScreenMode] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [expandedChapters, setExpandedChapters] = useState({});

    // 🔥 1. Group Data for the Accordion
    const groupedNotes = useMemo(() => {
        const data = {};
        allNotes.forEach((mainNote) => {
            if (mainNote.chapters && mainNote.chapters.length > 0) {
                mainNote.chapters.forEach((ch) => {
                    if (!data[ch.name]) data[ch.name] = [];
                    ch.notes.forEach((subNote) => {
                        data[ch.name].push({
                            ...subNote,
                            chapterName: ch.name
                        });
                    });
                });
            } else {
                const chapter = "General";
                if (!data[chapter]) data[chapter] = [];
                data[chapter].push(mainNote);
            }
        });
        return data;
    }, [allNotes]);

    const sortedChapters = Object.entries(groupedNotes).sort(([a], [b]) => {
        const numA = parseInt(a.match(/\d+/));
        const numB = parseInt(b.match(/\d+/));
        return (numA || 0) - (numB || 0);
    });

    // 🔥 2. NAVIGATION & AUTO-LOAD LOGIC
    const flatViewableNotes = useMemo(() => {
        const list = [];
        allNotes.forEach((mainNote) => {
            if (mainNote.chapters && mainNote.chapters.length > 0) {
                mainNote.chapters.forEach(ch =>
                    ch.notes.forEach(sn => list.push({ ...sn, chapterName: ch.name }))
                );
            } else {
                list.push(mainNote);
            }
        });
        return list;
    }, [allNotes]);

    // FIX: If 'note' is passed but it's just a container, auto-select the first PDF
    useEffect(() => {
        if (note && !note.googleDriveUrl && flatViewableNotes.length > 0) {
            onSelectNote(flatViewableNotes[0]);
        }
    }, [note, flatViewableNotes, onSelectNote]);

    const currentIndex = flatViewableNotes.findIndex((n) => n._id === note?._id);
    const handlePrevious = () => currentIndex > 0 && onSelectNote(flatViewableNotes[currentIndex - 1]);
    const handleNext = () => currentIndex < flatViewableNotes.length - 1 && onSelectNote(flatViewableNotes[currentIndex + 1]);

    // 🔥 3. Default Chapter 1 Open
    useEffect(() => {
        if (sortedChapters.length > 0) {
            const firstChapterName = sortedChapters[0][0];
            setExpandedChapters(prev => ({ ...prev, [firstChapterName]: true }));
        }
    }, [allNotes]);

    // 🔥 4. URL Conversion & Security
    const convertGoogleDriveUrl = (url) => {
        if (!url) return null;
        let fileId = "";
        if (url.includes("/d/")) {
            fileId = url.split("/d/")[1].split("/")[0];
        } else if (url.includes("id=")) {
            fileId = url.split("id=")[1].split("&")[0];
        } else {
            fileId = url;
        }
        return `https://drive.google.com/file/d/${fileId}/preview?embedded=true&rm=minimal`;
    };

    const embedUrl = convertGoogleDriveUrl(note?.googleDriveUrl);
    const toggleChapter = (name) => setExpandedChapters(prev => ({ ...prev, [name]: !prev[name] }));

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-richblack-900">
            <div className="p-4 border-b border-richblack-700 bg-richblack-800 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h3 className="text-richblack-5 font-bold text-lg truncate">Notes Explorer</h3>
                </div>
                <button className="md:hidden text-richblack-200" onClick={() => setShowSidebar(false)}>
                    <MdClose size={24} />
                </button>
            </div>

            <div className="py-2 overflow-y-auto flex-1">
                {sortedChapters.map(([name, notes]) => (
                    <div key={name} className="border-b border-richblack-800 last:border-0">
                        <button
                            onClick={() => toggleChapter(name)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-richblack-800 transition"
                        >
                            <div className="flex items-center gap-2 text-indigo-300 font-medium text-sm text-left">
                                {expandedChapters[name] ? <MdExpandMore size={20} className="shrink-0" /> : <MdChevronRightIcon size={20} className="shrink-0" />}
                                <span className="truncate">📘 {name}</span>
                            </div>
                        </button>
                        {expandedChapters[name] && (
                            <div className="bg-richblack-900/40">
                                {notes.map((n) => (
                                    <div
                                        key={n._id}
                                        onClick={() => { onSelectNote(n); setShowSidebar(false); }}
                                        className={`px-10 py-2.5 cursor-pointer text-sm flex items-center gap-3 transition-all ${n._id === note?._id
                                                ? "bg-indigo-500/20 text-indigo-200 border-l-4 border-indigo-500"
                                                : "text-richblack-400 hover:text-richblack-5 hover:bg-richblack-800"
                                            }`}
                                    >
                                        📄 {n.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 bg-richblack-900 flex flex-col overflow-hidden">
            <div className="flex flex-1 relative overflow-hidden">

                {/* MOBILE SIDEBAR OVERLAY */}
                {showSidebar && (
                    <div className="fixed inset-0 bg-black/70 md:hidden z-[60]" onClick={() => setShowSidebar(false)} />
                )}

                {/* SIDEBAR */}
                <div className={`fixed md:relative z-[70] w-72 h-full border-r border-richblack-700 transition-transform duration-300 ease-in-out
          ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                    <SidebarContent />
                </div>

                {/* MAIN VIEWER AREA */}
                <div className={`flex-1 flex flex-col h-full bg-black transition-all duration-300 ${fullScreenMode ? "fixed inset-0 z-[80]" : "relative"}`}>

                    {/* TOP NAV BAR */}
                    <div className="flex justify-between items-center p-2.5 md:p-3 border-b border-richblack-700 bg-richblack-900">
                        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                            <button className="md:hidden p-2 bg-richblack-800 rounded text-white hover:bg-richblack-700 shrink-0" onClick={() => setShowSidebar(true)}>
                                <MdMenu size={20} />
                            </button>
                            <div className="truncate">
                                <h2 className="text-white font-semibold text-xs md:text-sm truncate leading-tight">
                                    {note?.title || "Select a note"}
                                </h2>
                                <p className="text-[9px] md:text-[10px] text-richblack-400 uppercase tracking-tighter truncate">
                                    {note?.chapterName ? `📘 ${note?.chapterName}` : ""}
                                </p>
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

                    {/* IFRAME CONTAINER */}
                    <div className="flex-1 bg-richblack-900 relative">
                        {embedUrl ? (
                            <iframe
                                src={embedUrl}
                                className="w-full h-full border-0"
                                title={note?.title}
                                sandbox="allow-scripts allow-same-origin allow-forms"
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-richblack-400 gap-3 p-4 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2" />
                                <p className="text-sm">Please select a chapter file to view...</p>
                            </div>
                        )}
                    </div>

                    {/* 🔥 MOBILE-ONLY FULLSCREEN TOGGLE (Float) */}
                    <button
                        onClick={() => setFullScreenMode(!fullScreenMode)}
                        className="md:hidden fixed bottom-6 right-6 z-[90] p-4 bg-indigo-600 text-white rounded-full shadow-2xl active:scale-90 transition-transform"
                    >
                        {fullScreenMode ? <MdFullscreenExit size={24} /> : <MdFullscreen size={24} />}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default NotesViewer;
