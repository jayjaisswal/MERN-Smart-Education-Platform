// Notes API endpoints
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const notesEndpoints = {
  // Student endpoints
  GET_ALL_NOTES: `${BASE_URL}/notes/all`,
  GET_ALL_SUBJECTS: `${BASE_URL}/notes/subjects`,
  GET_NOTES_BY_SUBJECT: `${BASE_URL}/notes/subject`,
  GET_SINGLE_NOTE: `${BASE_URL}/notes`,

  // Instructor endpoints
  CREATE_NOTES: `${BASE_URL}/notes/create`,
  UPDATE_NOTES: `${BASE_URL}/notes`,
  DELETE_NOTES: `${BASE_URL}/notes`,
  GET_INSTRUCTOR_NOTES: `${BASE_URL}/notes/instructor/my-notes`,
};
