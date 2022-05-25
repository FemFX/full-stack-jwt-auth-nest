import { createAsyncThunk } from "@reduxjs/toolkit";
import { IAuthResponse } from "../../../types/authResponse";
import { IPayload } from "../../../types/payload";
import { $api } from "../../../utils/axios";
import axios from "axios";

export const login = createAsyncThunk(
  "auth/login",
  async (payload: IPayload, thunkAPI) => {
    try {
      const { data } = await $api.post<IAuthResponse>("/login", payload);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const register = createAsyncThunk(
  "auth/register",
  async (payload: IPayload, thunkAPI) => {
    try {
      const { data } = await $api.post<IAuthResponse>("/register", payload);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",
  async (payload, thunkAPI) => {
    try {
      const { data } = await $api.post("/logout");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (payload, thunkAPI) => {
    try {
      const { data } = await $api.get("/users");
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("http://localhost:4000/user/refresh", {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
