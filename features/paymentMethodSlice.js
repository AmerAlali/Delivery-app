import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getPaymentMethod = createAsyncThunk(
  "paymentMethod/getPaymentMethod",
  async () => {
    const value = await AsyncStorage.getItem("paymentMethod");
    if (value !== null) {
      return value;
    } else {
      return "cash";
    }
  }
);

export const paymentMethodSlice = createSlice({
  name: "paymentMethod",
  initialState: {
    paymentMethod: null,
  },
  reducers: {
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPaymentMethod.fulfilled, (state, action) => {
      state.paymentMethod = action.payload;
    });
  },
});

export const { setPaymentMethod } = paymentMethodSlice.actions;

export default paymentMethodSlice.reducer;
