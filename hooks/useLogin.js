import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../features/userSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useAddress } from "./useAddress";
import { setSelectedAddress } from "../features/selectedAddressSlice";
import { setNeighborhoodID } from "../features/neighborhoodSlice";
import * as Notifications from "expo-notifications";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const fetchAddresses = useAddress();

  const handleSelectingLastAddress = async (response) => {
    const addresses = await fetchAddresses(response.data);
    console.log(addresses);

    if (addresses !== undefined && addresses.length !== 0) {
      for (let i = addresses.length - 1; i >= 0; i--) {
        const address = addresses[i];
        if (address.neighborhoodID !== null) {
          const lastAddress = address;
          dispatch(setSelectedAddress(lastAddress));
          AsyncStorage.setItem("selectedAddress", JSON.stringify(lastAddress));
          dispatch(setNeighborhoodID([address.neighborhoodID, Date.now()]));
          AsyncStorage.setItem(
            "neighborhoodID",
            JSON.stringify([address.neighborhoodID, Date.now()])
          );
          break;
        }
      }
    } else if (addresses !== undefined && addresses.length === 0) {
      await AsyncStorage.getItem("AddressByFindLocation").then((response) => {
        const { neighborhoodID } = JSON.parse(response);
        dispatch(setSelectedAddress(JSON.parse(response)));
        dispatch(setNeighborhoodID([neighborhoodID, Date.now()]));
        AsyncStorage.setItem(
          "neighborhoodID",
          JSON.stringify([neighborhoodID, Date.now()])
        );
        AsyncStorage.setItem("selectedAddress", response);
      });
    }
    navigation.navigate("Home");
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const handleSendingDeviceToken = async (user) => {
    const DeviceID = await Notifications.getDevicePushTokenAsync();
    console.log(DeviceID);
    console.log(user);
    if (DeviceID) {
      await axios.post(
        "https://cravecorner.shop/api/storeDeviceIDs",
        {
          device_id: DeviceID.data,
          token: user.token,
        },
        { headers: { userAgent: "CraveMobile" } }
      );
    }
  };

  const googleLogin = useMemo(
    () => async (idToken) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          `https://cravecorner.shop/api/googleAuth`,
          { token: idToken },
          { headers: { userAgent: "CraveMobile" } }
        );

        // Save the user to local storage
        //await AsyncStorage.setItem("user", JSON.stringify(response.data));
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
        await handleSendingDeviceToken(response.data);
        // Update the user
        dispatch(loginAction(response.data));

        await handleSelectingLastAddress(response);

        // Navigate the user to the home screen
        setIsLoading(false);
        setError(null);
      } catch (error) {
        setIsLoading(false);
        setError(error.response.data.error);
      }
    },
    [dispatch, navigation]
  );

  const login = useMemo(
    () => async (email, password) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          "https://cravecorner.shop/api/login",
          { email, password },
          { headers: { userAgent: "CraveMobile" } }
        );

        // Save the user to local storage
        //await AsyncStorage.setItem("user", JSON.stringify(response.data));
        await AsyncStorage.setItem("user", JSON.stringify(response.data));

        // Update the user
        dispatch(loginAction(response.data));

        await handleSendingDeviceToken(response.data);

        await handleSelectingLastAddress(response);

        // Navigate the user to the home screen
        setIsLoading(false);
        setError(null);
      } catch (error) {
        setIsLoading(false);
        setError(error.response.data.error);
      }
    },
    [dispatch, navigation]
  );

  return { login, googleLogin, isLoading, error };
};
