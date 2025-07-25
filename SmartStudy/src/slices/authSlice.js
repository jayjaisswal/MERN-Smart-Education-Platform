import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  loading: false,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
  // token: localStorage.getItem ("token") || null //, due to "" give error
};

const authSlice = createSlice({
      name: "auth",
      initialState: initialState,
      reducers: {
        setSignupData(state, value) {
          state.signupData = value.payload;
          // console.log(state.signupData);
        },
        
        setLoading(state, value) {
          state.loading = value.payload;
        },
        setToken(state, value) {
          state.token = value.payload;
        },
      },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;