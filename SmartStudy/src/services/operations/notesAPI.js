import { apiConnector } from "../apiConnector";
import { notesEndpoints } from "../apis/notesEndpoints";
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

export const fetchAllNotes = async (filters = {}, token) => {
  try {
    let url = GET_ALL_NOTES;
    const params = new URLSearchParams();

    if (filters.subject) params.append("subject", filters.subject);
    if (filters.search) params.append("search", filters.search);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);

    if (params.toString()) url += "?" + params.toString();

    console.log("fetchAllNotes - token:", token?.substring(0, 20) + "...");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiConnector("GET", url, null, headers);
    console.log("fetchAllNotes response:", response?.data);

    // Handle both direct response and nested data
    if (response?.data?.success && response?.data?.data) {
      return response?.data;
    } else if (Array.isArray(response?.data)) {
      return { success: true, data: response?.data };
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    console.error("Error response:", error.response?.data);
    toast.error(error.response?.data?.message || "Failed to fetch notes");
    return null;
  }
};

export const fetchAllSubjects = async (token) => {
  try {
    console.log("fetchAllSubjects - token:", token?.substring(0, 20) + "...");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiConnector("GET", GET_ALL_SUBJECTS, null, headers);
    console.log("fetchAllSubjects response:", response);
    console.log("fetchAllSubjects response.data:", response?.data);

    // Handle both direct response and nested data
    if (response?.data?.success && response?.data?.data) {
      return response?.data; // Return the whole API response object
    } else if (Array.isArray(response?.data)) {
      return { success: true, data: response?.data };
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    console.error("Error response:", error.response?.data);
    return null;
  }
};

export const fetchNotesBySubject = async (subject, token) => {
  try {
    console.log(
      `fetchNotesBySubject(${subject}) - token:`,
      token?.substring(0, 20) + "...",
    );
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiConnector(
      "GET",
      `${GET_NOTES_BY_SUBJECT}/${subject}`,
      null,
      headers,
    );
    console.log(`fetchNotesBySubject(${subject}) response:`, response?.data);

    if (response?.data?.success && response?.data?.data) {
      return response?.data;
    } else if (Array.isArray(response?.data)) {
      return { success: true, data: response?.data };
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching notes by subject:", error);
    console.error("Error response:", error.response?.data);
    toast.error(
      error.response?.data?.message || "Failed to fetch notes for this subject",
    );
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
    console.log("Creating note with payload:", noteData);
    console.log("Token:", token);
    const response = await apiConnector("POST", CREATE_NOTES, noteData, {
      Authorization: `Bearer ${token}`,
    });
    console.log("Create note response:", response);
    return response; // Return the whole response object (component handles toasts)
  } catch (error) {
    console.error("Error creating note:", error);
    console.error("Error details:", error.response?.data);
    return error.response; // Return error response so component can handle it
  }
};

export const updateNote = async (noteId, noteData, token) => {
  try {
    console.log("Updating note:", noteId, "with payload:", noteData);
    const response = await apiConnector(
      "PUT",
      `${UPDATE_NOTES}/${noteId}`,
      noteData,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    console.log("Update note response:", response);
    return response; // Return the whole response object (component handles toasts)
  } catch (error) {
    console.error("Error updating note:", error);
    console.error("Error details:", error.response?.data);
    return error.response; // Return error response so component can handle it
  }
};

export const deleteNote = async (noteId, token) => {
  try {
    console.log("Deleting note:", noteId);
    const response = await apiConnector(
      "DELETE",
      `${DELETE_NOTES}/${noteId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    console.log("Delete note response:", response);
    return response; // Return the whole response object (component handles toasts)
  } catch (error) {
    console.error("Error deleting note:", error);
    console.error("Error details:", error.response?.data);
    return error.response; // Return error response so component can handle it
  }
};

export const fetchInstructorNotes = async (token) => {
  try {
    console.log(
      "Fetching instructor notes with token:",
      token?.substring(0, 20) + "...",
    );
    const response = await apiConnector("GET", GET_INSTRUCTOR_NOTES, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("fetchInstructorNotes response:", response?.data);

    // Handle both direct response and nested data
    if (response?.data?.success && response?.data?.data) {
      return response?.data; // Return the whole API response object
    } else if (Array.isArray(response?.data)) {
      return { success: true, data: response?.data };
    } else if (response?.data?.data && Array.isArray(response?.data?.data)) {
      return response?.data;
    }

    console.warn("Unexpected response format:", response?.data);
    return response?.data;
  } catch (error) {
    console.error("Error fetching instructor notes:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    toast.error(error.response?.data?.message || "Failed to fetch your notes");
    return null;
  }
};
