import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

// Note: backend chemistry routes are under `/api/v1/chemistry-jee-mains`
const chemistryBase = `${import.meta.env.VITE_BASE_URL}/chemistry-jee-mains`;

export const jeeChemistryEndpoints = {
  GET_QUESTIONS_BY_CHAPTER: `${chemistryBase}/chapter`,
  GET_QUESTION_BY_ID: `${chemistryBase}/q`,
};

export const getChemistryQuestionsByChapter = async (chapterName) => {
  const res = await apiConnector(
    "GET",
    jeeChemistryEndpoints.GET_QUESTIONS_BY_CHAPTER + `/${encodeURIComponent(chapterName)}`
  );
  return res;
};

export const getChemistryQuestionById = async (questionId) => {
  const res = await apiConnector(
    "GET",
    jeeChemistryEndpoints.GET_QUESTION_BY_ID + `/${encodeURIComponent(questionId)}`
  );
  return res;
};

