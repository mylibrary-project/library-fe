import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./bookSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    book: bookReducer,
    user: userReducer,
  },
});

export default store;
