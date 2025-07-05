// src/state/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userDataStr = localStorage.getItem("userData");
const userData = userDataStr ? JSON.parse(userDataStr) : null;

const initialState = {
  auth: userData ? true : false,
  admin: userData?.role === "admin",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.auth = action.payload.auth;
      state.admin = action.payload.admin;
    },
    logout(state) {
      state.auth = false;
      state.admin = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
