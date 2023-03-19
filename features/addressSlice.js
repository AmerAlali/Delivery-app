import { createSlice } from "@reduxjs/toolkit";

export const addressSlice = createSlice({
  name: "addresses",
  initialState: {
    addresses: null,
  },
  reducers: {
    setAddress: (state, action) => {
      state.addresses = action.payload;
    },
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (address) => address.id !== action.payload.id
      );
    },
    addAddress: (state, action) => {
      state.addresses = [...state.addresses, action.payload];
    },
  },
});

export const { setAddress, deleteAddress, addAddress } = addressSlice.actions;

export default addressSlice.reducer;
