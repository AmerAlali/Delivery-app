import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getNeighborhoodID = createAsyncThunk(
  "neighborhoodID/getNeighborhoodID",
  async () => {
    const value = await AsyncStorage.getItem("neighborhoodID");
    return JSON.parse(value);
  }
);

export const neighborhoodSlice = createSlice({
  name: "neighborhoodID",
  initialState: {
    neighborhoodID: null,
  },
  reducers: {
    setNeighborhoodID: (state, action) => {
      state.neighborhoodID = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNeighborhoodID.fulfilled, (state, action) => {
      state.neighborhoodID = action.payload;
    });
  },
});

export const { setNeighborhoodID } = neighborhoodSlice.actions;

export default neighborhoodSlice.reducer;
