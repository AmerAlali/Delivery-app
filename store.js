import { configureStore } from "@reduxjs/toolkit";
import addressReducer from "./features/addressSlice";
import basketReducer from "./features/basketSlice";
import userReducer from "./features/userSlice";
import neighborhoodReducer from "./features/neighborhoodSlice";
import restaurantrsReducer from "./features/restaurantsSlice";
import bottomSheetReducer from "./features/bottomSheetSlice";
import selectedAddressReducer from "./features/selectedAddressSlice";
import skeletonReducer from "./features/skeletonSlice";
import paymentMethodReducer from "./features/paymentMethodSlice";
export const store = configureStore({
  reducer: {
    basket: basketReducer,
    user: userReducer,
    neighborhoodID: neighborhoodReducer,
    addresses: addressReducer,
    restaurants: restaurantrsReducer,
    bottomSheet: bottomSheetReducer,
    selectedAddress: selectedAddressReducer,
    loading: skeletonReducer,
    paymentMethod: paymentMethodReducer,
  },
});
