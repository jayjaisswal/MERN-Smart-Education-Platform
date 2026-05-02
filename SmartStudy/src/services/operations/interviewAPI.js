import { apiConnector } from "../apiConnector";
import { interviewEndpoints } from "../apis";

// Submit an interview answer
export const submitInterviewAnswer = async (data, token) => {
  try {
    const response = await apiConnector(
      "POST",
      interviewEndpoints.SUBMIT_ANSWER_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  } catch (error) {
    console.error("Error submitting interview answer:", error);
    throw error;
  }
};

// Get user performance for interview
export const getInterviewPerformance = async (token, category, topic) => {
  try {
    let queryParams = "";
    if (category) queryParams += `category=${category}`;
    if (topic) queryParams += queryParams ? `&topic=${topic}` : `topic=${topic}`;

    const response = await apiConnector(
      "GET",
      `${interviewEndpoints.GET_PERFORMANCE_API}${queryParams ? `?${queryParams}` : ""}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message);
  } catch (error) {
    console.error("Error getting interview performance:", error);
    throw error;
  }
};

// Get interview data
export const getInterviewData = async (token, category, topic, page = 1, limit = 20) => {
  try {
    let queryParams = `page=${page}&limit=${limit}`;
    if (category) queryParams += `&category=${category}`;
    if (topic) queryParams += `&topic=${topic}`;

    const response = await apiConnector(
      "GET",
      `${interviewEndpoints.GET_DATA_API}?${queryParams}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message);
  } catch (error) {
    console.error("Error getting interview data:", error);
    throw error;
  }
};

// Reset interview progress
export const resetInterviewProgress = async (token, category, topic) => {
  try {
    const response = await apiConnector(
      "DELETE",
      interviewEndpoints.RESET_PROGRESS_API,
      { category, topic },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      return response.data;
    }

    throw new Error(response.data.message);
  } catch (error) {
    console.error("Error resetting progress:", error);
    throw error;
  }
};

// Get leaderboard
export const getLeaderboard = async (token, category, limit = 10) => {
  try {
    let queryParams = `limit=${limit}`;
    if (category) queryParams += `&category=${category}`;

    const response = await apiConnector(
      "GET",
      `${interviewEndpoints.GET_LEADERBOARD_API}?${queryParams}`,
      null
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message);
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    throw error;
  }
};
