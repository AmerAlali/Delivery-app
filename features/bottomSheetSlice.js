import { createSlice } from "@reduxjs/toolkit";

export const bottomSheetSlice = createSlice({
  name: "visible",
  initialState: {
    visible: null,
  },
  reducers: {
    setVisible: (state, action) => {
      state.visible = action.payload;
    },
  },
});

export const { setVisible } = bottomSheetSlice.actions;

export default bottomSheetSlice.reducer;
