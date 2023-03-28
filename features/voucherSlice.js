import { createSlice } from "@reduxjs/toolkit";

export const voucherSlice = createSlice({
  name: "voucherDiscount",
  initialState: {
    voucherDiscount: null,
  },
  reducers: {
    setVoucherDiscount: (state, action) => {
      state.voucherDiscount = action.payload;
    },
  },
});

export const { setVoucherDiscount } = voucherSlice.actions;

export default voucherSlice.reducer;
