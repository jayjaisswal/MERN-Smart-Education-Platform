import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  currentCategory: null,
  currentQuestions: [],
  currentPage: 1,
  totalPages: 0,
  totalQuestions: 0,
  questionsPerPage: 5,
  userPerformance: null,
  loading: false,
};

const aptitudeSlice = createSlice({
  name: "aptitude",
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
    },
    setCurrentCategory(state, action) {
      state.currentCategory = action.payload;
    },
    setCurrentQuestions(state, action) {
      state.currentQuestions = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setPagination(state, action) {
      state.totalPages = action.payload.totalPages;
      state.totalQuestions = action.payload.totalQuestions;
      state.questionsPerPage = action.payload.questionsPerPage;
      state.currentPage = action.payload.currentPage;
    },
    setUserPerformance(state, action) {
      state.userPerformance = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    resetAptitude(state) {
      return initialState;
    },
  },
});

export const {
  setCategories,
  setCurrentCategory,
  setCurrentQuestions,
  setCurrentPage,
  setPagination,
  setUserPerformance,
  setLoading,
  resetAptitude,
} = aptitudeSlice.actions;

export default aptitudeSlice.reducer;
