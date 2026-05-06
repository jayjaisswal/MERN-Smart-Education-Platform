import React, { useState } from "react";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";

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

const NestedNoteForm = ({ onSave, onCancel }) => {
  const [subject, setSubject] = useState("Physics");
  const [chapter, setChapter] = useState("Chapter 1");

  const [notesList, setNotesList] = useState([
    { title: "", url: "" },
  ]);

  const addNote = () => {
    setNotesList([...notesList, { title: "", url: "" }]);
  };

  const removeNote = (index) => {
    setNotesList(notesList.filter((_, i) => i !== index));
  };

  const updateNote = (index, field, value) => {
    const updated = [...notesList];
    updated[index][field] = value;
    setNotesList(updated);
  };

  const handleSave = () => {
    notesList.forEach((note) => {
      if (!note.title || !note.url) return;

      onSave({
        title: note.title.trim(),
        subject,
        chapter,
        googleDriveUrl: note.url.trim(),
        isPublished: true,
      });
    });
  };

  return (
    <div className="bg-richblack-700 p-3 rounded-lg space-y-4 w-full">

      {/* SUBJECT */}
      <div>
        <label className="text-xs text-richblack-300">Subject</label>
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

      {/* CHAPTER */}
      <div>
        <label className="text-xs text-richblack-300">Chapter</label>
        <input
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          placeholder="Chapter 1"
          className="w-full mt-1 bg-richblack-600 text-white p-2 rounded text-sm"
        />
      </div>

      {/* NOTES */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {notesList.map((note, index) => (
          <div
            key={index}
            className="bg-richblack-600 p-2 rounded space-y-2"
          >
            <input
              placeholder="Note title"
              value={note.title}
              onChange={(e) =>
                updateNote(index, "title", e.target.value)
              }
              className="w-full bg-richblack-500 p-2 rounded text-white text-sm"
            />

            <input
              placeholder="Drive URL"
              value={note.url}
              onChange={(e) =>
                updateNote(index, "url", e.target.value)
              }
              className="w-full bg-richblack-500 p-2 rounded text-white text-sm"
            />

            <button
              onClick={() => removeNote(index)}
              className="w-full bg-red-500 py-1 rounded text-white text-sm"
            >
              <AiOutlineDelete />
            </button>
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-2">

        <button
          onClick={addNote}
          className="flex items-center justify-center gap-1 bg-indigo-500 py-2 rounded text-white text-sm"
        >
          <AiOutlinePlus /> Add Row
        </button>

        <button
          onClick={handleSave}
          className="bg-green-600 py-2 rounded text-white text-sm"
        >
          Save All
        </button>

        <button
          onClick={onCancel}
          className="bg-richblack-500 py-2 rounded text-white text-sm"
        >
          Cancel
        </button>

      </div>
    </div>
  );
};

export default NestedNoteForm;