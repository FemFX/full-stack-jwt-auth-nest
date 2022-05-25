import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkAuth, login, logout, register } from "./auth.actionCreator";

const initialState = {
  user: undefined,
  isAuth: false,
  error: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [login.fulfilled.type]: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = "";
      state.isAuth = true;
      localStorage.setItem("token", action.payload.accessToken);
    },
    [login.pending.type]: (state) => {
      state.isLoading = true;
    },
    [login.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    [register.fulfilled.type]: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = "";
      state.isAuth = true;
      localStorage.setItem("token", action.payload.accessToken);
    },
    [register.pending.type]: (state) => {
      state.isLoading = true;
    },
    [register.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    [logout.fulfilled.type]: (state) => {
      state.isLoading = false;
      state.user = null;
      state.error = "";
      state.isAuth = false;
      localStorage.removeItem("token");
    },
    [logout.pending.type]: (state) => {
      state.isLoading = true;
    },
    [logout.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    [checkAuth.fulfilled.type]: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = "";
      state.isAuth = true;
      localStorage.setItem("token", action.payload.accessToken);
    },
    [checkAuth.pending.type]: (state) => {
      state.isLoading = true;
    },
    [checkAuth.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default authSlice.reducer;
