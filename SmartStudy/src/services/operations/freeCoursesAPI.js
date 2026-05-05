import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const freeCoursesEndpoints = {
  // Student endpoints
  GET_ALL_FREE_COURSES: `${BASE_URL}/free-courses/all`,
  GET_FREE_COURSE_DETAILS: `${BASE_URL}/free-courses`,

  // Instructor/Admin endpoints
  CREATE_FREE_COURSE: `${BASE_URL}/free-courses/create`,
  UPDATE_FREE_COURSE: `${BASE_URL}/free-courses`,
  DELETE_FREE_COURSE: `${BASE_URL}/free-courses`,
  GET_INSTRUCTOR_FREE_COURSES: `${BASE_URL}/free-courses/instructor/my-courses`,
};

const {
  GET_ALL_FREE_COURSES,
  GET_FREE_COURSE_DETAILS,
  CREATE_FREE_COURSE,
  UPDATE_FREE_COURSE,
  DELETE_FREE_COURSE,
  GET_INSTRUCTOR_FREE_COURSES,
} = freeCoursesEndpoints;

// Student Operations

export const fetchAllFreeCourses = async (filters = {}, token) => {
  try {
    let url = GET_ALL_FREE_COURSES;
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);

    if (params.toString()) url += "?" + params.toString();

    console.log("fetchAllFreeCourses - url:", url);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiConnector("GET", url, null, headers);
    console.log("fetchAllFreeCourses response:", response?.data);

    if (response?.data?.success && response?.data?.data) {
      return response?.data;
    } else if (Array.isArray(response?.data)) {
      return { success: true, data: response?.data };
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching free courses:", error);
    console.error("Error response:", error.response?.data);
    toast.error(
      error.response?.data?.message || "Failed to fetch free courses",
    );
    return null;
  }
};

export const fetchFreeCourseDetails = async (courseId, token) => {
  try {
    console.log("fetchFreeCourseDetails - courseId:", courseId);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiConnector(
      "GET",
      `${GET_FREE_COURSE_DETAILS}/${courseId}`,
      null,
      headers,
    );
    console.log("fetchFreeCourseDetails response:", response?.data);

    if (response?.data?.success && response?.data?.data) {
      return response?.data;
    } else if (response?.data) {
      return { success: true, data: response?.data };
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching free course details:", error);
    console.error("Error response:", error.response?.data);
    toast.error(
      error.response?.data?.message || "Failed to fetch course details",
    );
    return null;
  }
};

// Instructor/Admin Operations

export const createFreeCourse = async (courseData, token) => {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await apiConnector(
      "POST",
      CREATE_FREE_COURSE,
      courseData,
      headers,
    );
    console.log("createFreeCourse response:", response?.data);

    if (response?.data?.success) {
      toast.success("Free course created successfully");
      return response?.data;
    }

    toast.error(response?.data?.message || "Failed to create free course");
    return response?.data;
  } catch (error) {
    console.error("Error creating free course:", error);
    console.error("Error response:", error.response?.data);
    toast.error(
      error.response?.data?.message || "Failed to create free course",
    );
    return null;
  }
};

export const updateFreeCourse = async (courseId, courseData, token) => {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await apiConnector(
      "PUT",
      `${UPDATE_FREE_COURSE}/${courseId}`,
      courseData,
      headers,
    );
    console.log("updateFreeCourse response:", response?.data);

    if (response?.data?.success) {
      toast.success("Free course updated successfully");
      return response?.data;
    }

    toast.error(response?.data?.message || "Failed to update free course");
    return response?.data;
  } catch (error) {
    console.error("Error updating free course:", error);
    console.error("Error response:", error.response?.data);
    toast.error(
      error.response?.data?.message || "Failed to update free course",
    );
    return null;
  }
};

export const deleteFreeCourse = async (courseId, token) => {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await apiConnector(
      "DELETE",
      `${DELETE_FREE_COURSE}/${courseId}`,
      null,
      headers,
    );
    console.log("deleteFreeCourse response:", response?.data);

    if (response?.data?.success) {
      toast.success("Free course deleted successfully");
      return response?.data;
    }

    toast.error(response?.data?.message || "Failed to delete free course");
    return response?.data;
  } catch (error) {
    console.error("Error deleting free course:", error);
    console.error("Error response:", error.response?.data);
    toast.error(
      error.response?.data?.message || "Failed to delete free course",
    );
    return null;
  }
};

export const fetchInstructorFreeCourses = async (token) => {
  try {
    console.log(
      "fetchInstructorFreeCourses - token:",
      token?.substring(0, 20) + "...",
    );
    const headers = { Authorization: `Bearer ${token}` };
    const response = await apiConnector(
      "GET",
      GET_INSTRUCTOR_FREE_COURSES,
      null,
      headers,
    );
    console.log("fetchInstructorFreeCourses response:", response?.data);

    if (response?.data?.success && response?.data?.data) {
      return response?.data;
    } else if (Array.isArray(response?.data)) {
      return { success: true, data: response?.data };
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching instructor free courses:", error);
    console.error("Error response:", error.response?.data);
    toast.error(
      error.response?.data?.message || "Failed to fetch your free courses",
    );
    return null;
  }
};
