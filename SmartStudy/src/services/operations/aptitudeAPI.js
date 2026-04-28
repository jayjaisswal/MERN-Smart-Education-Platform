import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { aptitudeEndpoints } from "../apis";

const {
  GET_CATEGORIES_API,
  GET_QUESTIONS_API,
  SUBMIT_ANSWER_API,
  GET_PERFORMANCE_API,
  GET_QUESTION_DETAILS_API,
} = aptitudeEndpoints;

// Get all aptitude categories
export async function getAptitudeCategories() {
  const toastId = toast.loading("Loading categories...");
  try {
    const response = await apiConnector("GET", GET_CATEGORIES_API);
    console.log("GET_APTITUDE_CATEGORIES API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    console.error("GET_APTITUDE_CATEGORIES API ERROR............", error);
    toast.dismiss(toastId);
    toast.error("Failed to fetch categories");
    return [];
  }
}

// Get questions by category with pagination
export async function getAptitudeQuestions(
  category,
  page = 1,
  limit = 5,
  topic = null,
) {
  const toastId = toast.loading("Loading questions...");
  try {
    let url = `${GET_QUESTIONS_API}?category=${category}&page=${page}&limit=${limit}`;
    if (topic) {
      url += `&topic=${topic}`;
    }

    const response = await apiConnector("GET", url);
    console.log("GET_APTITUDE_QUESTIONS API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    console.error("GET_APTITUDE_QUESTIONS API ERROR............", error);
    toast.dismiss(toastId);
    toast.error("Failed to fetch questions");
    return null;
  }
}

// Submit answer and save progress
export async function submitAptitudeAnswer(
  questionId,
  userAnswer,
  timeTaken,
  category,
  token,
) {
  try {
    const response = await apiConnector(
      "POST",
      SUBMIT_ANSWER_API,
      {
        questionId,
        userAnswer: parseInt(userAnswer),
        timeTaken: parseInt(timeTaken),
        category,
      },
      {
        Authorization: `Bearer ${token}`,
      },
    );
    console.log("SUBMIT_ANSWER API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error) {
    console.error("SUBMIT_ANSWER API ERROR............", error);
    toast.error("Failed to submit answer");
    return null;
  }
}

// Get user performance
export async function getUserAptitudePerformance(token, category = null) {
  const toastId = toast.loading("Loading performance...");
  try {
    let url = GET_PERFORMANCE_API;
    if (category) {
      url += `?category=${category}`;
    }

    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("GET_USER_PERFORMANCE API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    console.error("GET_USER_PERFORMANCE API ERROR............", error);
    toast.dismiss(toastId);
    toast.error("Failed to fetch performance");
    return null;
  }
}

// Get specific question details
export async function getAptitudeQuestionDetails(questionId) {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_QUESTION_DETAILS_API}/${questionId}`,
    );
    console.log("GET_QUESTION_DETAILS API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error) {
    console.error("GET_QUESTION_DETAILS API ERROR............", error);
    return null;
  }
}
