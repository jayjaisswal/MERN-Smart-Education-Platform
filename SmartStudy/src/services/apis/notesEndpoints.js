// Notes API endpoints
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const notesEndpoints = {
  // Student endpoints
  GET_ALL_NOTES: `${BASE_URL}/api/v1/notes/all`,
  GET_ALL_SUBJECTS: `${BASE_URL}/api/v1/notes/subjects`,
  GET_NOTES_BY_SUBJECT: `${BASE_URL}/api/v1/notes/subject`,
  GET_SINGLE_NOTE: `${BASE_URL}/api/v1/notes`,

  // Instructor endpoints
  CREATE_NOTES: `${BASE_URL}/api/v1/notes/create`,
  UPDATE_NOTES: `${BASE_URL}/api/v1/notes`,
  DELETE_NOTES: `${BASE_URL}/api/v1/notes`,
  GET_INSTRUCTOR_NOTES: `${BASE_URL}/api/v1/notes/instructor/my-notes`,
};
