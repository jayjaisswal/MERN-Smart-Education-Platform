import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducer/index";

const store = configureStore({
  reducer: rootReducer,
})

export default store; 