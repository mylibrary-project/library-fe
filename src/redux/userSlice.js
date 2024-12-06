import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    userInfoList: [],
    isLoggedIn: false,
    currentUser: null,
    jwtToken: null,
    role: null,
  },
  reducers: {
    addUserInfo: (state, action) => {
      state.userInfoList.push(action.payload);
    },
    clearUserInfo: (state) => {
      state.userInfoList = [];
    },
    login: (state, action) => {
      state.isLoggedIn = true;
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = null;
      state.jwtToken = null;
      state.currentUser = null;
    },
    saveJwtToken: (state, action) => {
      state.jwtToken = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const {
  addUserInfo,
  clearUserInfo,
  login,
  logout,
  saveJwtToken,
  setRole,
} = userSlice.actions;
export default userSlice.reducer;
