import React, { useState } from "react";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import toast from "react-hot-toast";

const SUBJECTS = [
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "English",
  "History",
  "Geography",
  "Economics",
  "Computer Science",
  "General",
];

const NestedNoteForm = ({ onSave, onCancel, initialData, isEditing }) => {
  const [subject, setSubject] = useState(initialData?.subject || "Physics");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [useChapters, setUseChapters] = useState(
    initialData?.chapters && initialData.chapters.length > 0 ? true : false
  );

  // Chapters structure
  const [chapters, setChapters] = useState(() => {
    if (initialData?.chapters && initialData.chapters.length > 0) {
      return initialData.chapters.map((ch, idx) => ({
        id: idx,
        name: ch.name || "",
        notes: ch.notes.map((n, nIdx) => ({
          id: nIdx,
          title: n.title || "",
          url: n.googleDriveUrl || "",
        })),
        expanded: true,
      }));
    }
    return [
      {
        id: Date.now(),
        name: "",
        notes: [{ id: Date.now(), title: "", url: "" }],
        expanded: true,
      },
    ];
  });

  // Single note (if not using chapters)
  const [singleNote, setSingleNote] = useState({
    title: initialData?.title || "",
    url: initialData?.googleDriveUrl || "",
  });

  // Add new chapter
  const addChapter = () => {
    setChapters([
      ...chapters,
      {
        id: Date.now(),
        name: "",
        notes: [{ id: Date.now(), title: "", url: "" }],
        expanded: true,
      },
    ]);
  };

  // Remove chapter
  const removeChapter = (chapterId) => {
    setChapters(chapters.filter((ch) => ch.id !== chapterId));
  };

  // Toggle chapter expansion
  const toggleChapter = (chapterId) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId ? { ...ch, expanded: !ch.expanded } : ch
      )
    );
  };

  // Update chapter name
  const updateChapterName = (chapterId, name) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId ? { ...ch, name } : ch
      )
    );
  };

  // Add note to chapter
  const addNoteToChapter = (chapterId) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? {
            ...ch,
            notes: [
              ...ch.notes,
              { id: Date.now(), title: "", url: "" },
            ],
          }
          : ch
      )
    );
  };

  // Remove note from chapter
  const removeNoteFromChapter = (chapterId, noteId) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? {
            ...ch,
            notes: ch.notes.filter((n) => n.id !== noteId),
          }
          : ch
      )
    );
  };

  // Update note in chapter
  const updateNoteInChapter = (chapterId, noteId, field, value) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? {
            ...ch,
            notes: ch.notes.map((n) =>
              n.id === noteId ? { ...n, [field]: value } : n
            ),
          }
          : ch
      )
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Please enter a note title");
      return;
    }

    if (useChapters) {
      // Validate chapters
      const validChapters = chapters.filter(
        (ch) => ch.notes && ch.notes.length > 0
      );
      if (validChapters.length === 0) {
        toast.error("Please add at least one chapter with notes");
        return;
      }

      const processedChapters = validChapters.map((ch) => ({
        name: ch.name.trim() || null,
        notes: ch.notes
          .filter((n) => n.title.trim() && n.url.trim())
          .map((n) => ({
            title: n.title.trim(),
            googleDriveUrl: n.url.trim(),
          })),
      }));

      // Filter out chapters with no valid notes
      const finalChapters = processedChapters.filter(
        (ch) => ch.notes.length > 0
      );

      if (finalChapters.length === 0) {
        toast.error("Please add at least one valid note");
        return;
      }

      onSave({
        title: title.trim(),
        description: description.trim(),
        subject,
        chapters: finalChapters,
        isPublished: true,
      });
    } else {
      // Single note mode
      if (!singleNote.title.trim() || !singleNote.url.trim()) {
        toast.error("Please enter both note title and URL");
        return;
      }

      onSave({
        title: title.trim(),
        description: description.trim(),
        subject,
        googleDriveUrl: singleNote.url.trim(),
        chapters: [],
        isPublished: true,
      });
    }
  };

  return (
    <div className="bg-richblack-700 p-4 rounded-lg space-y-4 w-full max-w-3xl">
      {/* TITLE */}
      <div>
        <label className="text-xs text-richblack-300">
          Note Collection Title *
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Physics Notes - Mechanics"
          className="w-full mt-1 bg-richblack-600 text-white p-2 rounded text-sm"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="text-xs text-richblack-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description..."
          rows="2"
          className="w-full mt-1 bg-richblack-600 text-white p-2 rounded text-sm"
        />
      </div>

      {/* SUBJECT */}
      <div>
        <label className="text-xs text-richblack-300">Subject *</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full mt-1 bg-richblack-600 text-white p-2 rounded text-sm"
        >
          {SUBJECTS.map((sub) => (
            <option key={sub}>{sub}</option>
          ))}
        </select>
      </div>

      {/* TOGGLE CHAPTERS VS SINGLE NOTE */}
      <div className="flex gap-4 bg-richblack-600 p-3 rounded">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={useChapters}
            onChange={() => setUseChapters(true)}
            className="w-4 h-4"
          />
          <span className="text-sm">Organize by Chapters</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={!useChapters}
            onChange={() => setUseChapters(false)}
            className="w-4 h-4"
          />
          <span className="text-sm">Single Note</span>
        </label>
      </div>

      {/* CHAPTERS MODE */}
      {useChapters && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {chapters.map((chapter, chapterIdx) => (
            <div
              key={chapter.id}
              className="bg-richblack-600 p-3 rounded border border-richblack-500"
            >
              {/* CHAPTER HEADER */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="text-richblack-300 hover:text-white"
                  type="button"
                >
                  {chapter.expanded ? <MdExpandLess /> : <MdExpandMore />}
                </button>
                <input
                  placeholder={`Chapter ${chapterIdx + 1} name (optional)`}
                  value={chapter.name}
                  onChange={(e) => updateChapterName(chapter.id, e.target.value)}
                  className="flex-1 bg-richblack-500 p-2 rounded text-white text-sm"
                />
                {chapters.length > 1 && (
                  <button
                    onClick={() => removeChapter(chapter.id)}
                    className="bg-red-500 hover:bg-red-600 p-2 rounded text-white"
                    type="button"
                  >
                    <AiOutlineDelete size={16} />
                  </button>
                )}
              </div>

              {/* NOTES IN CHAPTER */}
              {chapter.expanded && (
                <div className="space-y-2 ml-6 bg-richblack-500 p-3 rounded">
                  {chapter.notes.map((note) => (
                    <div key={note.id} className="space-y-2">
                      <input
                        placeholder="Note title"
                        value={note.title}
                        onChange={(e) =>
                          updateNoteInChapter(
                            chapter.id,
                            note.id,
                            "title",
                            e.target.value
                          )
                        }
                        className="w-full bg-richblack-400 p-2 rounded text-white text-sm"
                      />
                      <div className="flex gap-2">
                        <input
                          placeholder="Google Drive URL or File ID"
                          value={note.url}
                          onChange={(e) =>
                            updateNoteInChapter(
                              chapter.id,
                              note.id,
                              "url",
                              e.target.value
                            )
                          }
                          className="flex-1 bg-richblack-400 p-2 rounded text-white text-sm"
                        />
                        {chapter.notes.length > 1 && (
                          <button
                            onClick={() =>
                              removeNoteFromChapter(chapter.id, note.id)
                            }
                            className="bg-red-500 hover:bg-red-600 p-2 rounded text-white"
                            type="button"
                          >
                            <AiOutlineDelete size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => addNoteToChapter(chapter.id)}
                    className="w-full flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-white text-sm"
                    type="button"
                  >
                    <AiOutlinePlus size={16} /> Add Note to Chapter
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addChapter}
            className="w-full flex items-center justify-center gap-1 bg-indigo-500 hover:bg-indigo-600 py-2 rounded text-white text-sm"
            type="button"
          >
            <AiOutlinePlus size={16} /> Add Chapter
          </button>
        </div>
      )}

      {/* SINGLE NOTE MODE */}
      {!useChapters && (
        <div className="bg-richblack-600 p-3 rounded space-y-2">
          <input
            placeholder="Note title"
            value={singleNote.title}
            onChange={(e) =>
              setSingleNote({ ...singleNote, title: e.target.value })
            }
            className="w-full bg-richblack-500 p-2 rounded text-white text-sm"
          />
          <input
            placeholder="Google Drive URL or File ID"
            value={singleNote.url}
            onChange={(e) =>
              setSingleNote({ ...singleNote, url: e.target.value })
            }
            className="w-full bg-richblack-500 p-2 rounded text-white text-sm"
          />
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 py-2 rounded text-white text-sm font-medium"
          type="button"
        >
          {isEditing ? "Update Note" : "Save Note"}
        </button>

        <button
          onClick={onCancel}
          className="bg-richblack-500 hover:bg-richblack-400 py-2 rounded text-white text-sm"
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NestedNoteForm;