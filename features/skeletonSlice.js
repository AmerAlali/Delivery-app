import { createSlice } from "@reduxjs/toolkit";

export const skeletonSlice = createSlice({
  name: "loading",
  initialState: {
    loading: true,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = skeletonSlice.actions;

export default skeletonSlice.reducer;
