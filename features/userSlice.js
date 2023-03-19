import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserToken.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { login, logout } = userSlice.actions;

export const getUserToken = createAsyncThunk("user/getUserToken", async () => {
  //const value = await AsyncStorage.getItem("user");
  const user = await SecureStore.getItemAsync("user");
  return JSON.parse(user);
});

export default userSlice.reducer;
