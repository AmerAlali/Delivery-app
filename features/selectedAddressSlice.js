import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getSelectedAddress = createAsyncThunk(
  "selectedAddress/getSelectedAddress",
  async () => {
    const value = await AsyncStorage.getItem("selectedAddress");
    return JSON.parse(value);
  }
);

export const selectedAddressSlice = createSlice({
  name: "selectedAddress",
  initialState: {
    selectedAddress: null,
  },
  reducers: {
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSelectedAddress.fulfilled, (state, action) => {
      state.selectedAddress = action.payload;
    });
  },
});

export const { setSelectedAddress } = selectedAddressSlice.actions;

export default selectedAddressSlice.reducer;
