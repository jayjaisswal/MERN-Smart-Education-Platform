import { apiConnector } from "../apiConnector";
import { notesEndpoints } from "./notesEndpoints";
import toast from "react-hot-toast";

const {
  GET_ALL_NOTES,
  GET_ALL_SUBJECTS,
  GET_NOTES_BY_SUBJECT,
  GET_SINGLE_NOTE,
  CREATE_NOTES,
  UPDATE_NOTES,
  DELETE_NOTES,
  GET_INSTRUCTOR_NOTES,
} = notesEndpoints;

// Student Operations

export const fetchAllNotes = async (filters = {}) => {
  try {
    let url = GET_ALL_NOTES;
    const params = new URLSearchParams();

    if (filters.subject) params.append("subject", filters.subject);
    if (filters.search) params.append("search", filters.search);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);

    if (params.toString()) url += "?" + params.toString();

    const response = await apiConnector("GET", url);
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    toast.error(error.response?.data?.message || "Failed to fetch notes");
    return null;
  }
};

export const fetchAllSubjects = async () => {
  try {
    const response = await apiConnector("GET", GET_ALL_SUBJECTS);
    return response.data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return null;
  }
};

export const fetchNotesBySubject = async (subject) => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_NOTES_BY_SUBJECT}/${subject}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notes by subject:", error);
    toast.error("Failed to fetch notes for this subject");
    return null;
  }
};

export const fetchSingleNote = async (noteId) => {
  try {
    const response = await apiConnector("GET", `${GET_SINGLE_NOTE}/${noteId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching note:", error);
    toast.error("Failed to fetch note details");
    return null;
  }
};

// Instructor Operations

export const createNote = async (noteData, token) => {
  try {
    const response = await apiConnector("POST", CREATE_NOTES, noteData, {
      Authorization: `Bearer ${token}`,
    });
    toast.success("Note created successfully");
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    toast.error(error.response?.data?.message || "Failed to create note");
    return null;
  }
};

export const updateNote = async (noteId, noteData, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      `${UPDATE_NOTES}/${noteId}`,
      noteData,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    toast.success("Note updated successfully");
    return response.data;
  } catch (error) {
    console.error("Error updating note:", error);
    toast.error(error.response?.data?.message || "Failed to update note");
    return null;
  }
};

export const deleteNote = async (noteId, token) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_NOTES}/${noteId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    toast.success("Note deleted successfully");
    return response.data;
  } catch (error) {
    console.error("Error deleting note:", error);
    toast.error(error.response?.data?.message || "Failed to delete note");
    return null;
  }
};

export const fetchInstructorNotes = async (token) => {
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_NOTES, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching instructor notes:", error);
    toast.error("Failed to fetch your notes");
    return null;
  }
};
