import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getBasketItems = createAsyncThunk(
  "basket/getBasketItems",
  async (_, { getState }) => {
    const { items } = getState().basket;
    if (items.length > 0) {
      return items;
    }
    try {
      const items = await AsyncStorage.getItem("basket");
      return items !== null ? JSON.parse(items) : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }
);

// Async function to save basket items to AsyncStorage
const saveBasketItems = (items) => {
  AsyncStorage.setItem("basket", JSON.stringify(items));
};

const initialState = { items: [] };

const basketSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    addToBasket(state, action) {
      state.items = state.items.filter(
        (item) => item.restaurant_id === action.payload.restaurant_id
      );
      const { id, quantity } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index >= 0) {
        state.items[index].quantity += quantity;
      } else {
        state.items = [...state.items, action.payload];
      }
      saveBasketItems(state.items); // Save basket items to AsyncStorage
    },
    removeFromBasket(state, action) {
      const { id, quantity } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index >= 0) {
        if (state.items[index].quantity > quantity) {
          state.items[index].quantity -= quantity;
        } else {
          state.items.splice(index, 1);
        }
      } else {
        console.warn("can't remove product ");
      }
      saveBasketItems(state.items); // Save basket items to AsyncStorage
    },
    updateBasketItem(state, action) {
      const { id, quantity } = action.payload;
      console.log(id, quantity);
      const index = state.items.findIndex((item) => item.id === id);
      if (index >= 0) {
        state.items[index].quantity = quantity;
      }
      if (index >= 0 && quantity === 0) {
        state.items.splice(index, 1);
      }
      saveBasketItems(state.items); // Save basket items to AsyncStorage
    },

    clearBasketItems(state) {
      state.items = [];
      saveBasketItems(state.items); // Save basket items to AsyncStorage
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBasketItems.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const {
  addToBasket,
  removeFromBasket,
  clearBasketItems,
  activeRestaurantBasket,
  updateBasketItem,
} = basketSlice.actions;

export const selectBasketItems = (state) => state.basket.items;

export const selectBasketItemsWithId = (state, id) =>
  state.basket.items.filter((item) => item.id === id);

export const selectBasketTotal = (state) =>
  state.basket.items.reduce(
    (total, item) => (total += item.price * item.quantity),
    0
  );
export const totalBasketItems = (state) =>
  state.basket.items.reduce((total, item) => (total += item.quantity), 0);
export default basketSlice.reducer;
