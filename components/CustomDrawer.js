import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View } from "react-native";
import { ImageBackground } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { TouchableOpacity } from "react-native";
import {
  ArrowRightCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";
import { useLanguage } from "../hooks/useLanguage";
import { useRTL } from "../hooks/useRTL";
import { Linking } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { logout } from "../features/userSlice";
import { setAddress } from "../features/addressSlice";
import { setSelectedAddress } from "../features/selectedAddressSlice";
import { setNeighborhoodID } from "../features/neighborhoodSlice";
import { DrawerActions, useNavigation } from "@react-navigation/native";

const CustomDrawer = (props) => {
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const dispatch = useDispatch();
  const { i18n } = useLanguage();
  const RTL = useRTL();
  const arrowIcon = RTL(i18n.t("logout")) ? (
    <ChevronLeftIcon size={25} color={mainColor}></ChevronLeftIcon>
  ) : (
    <ChevronRightIcon size={25} color={mainColor}></ChevronRightIcon>
  );

  const cardIconText = RTL(i18n.t("logout"))
    ? "flex-row align-middle space-x-2"
    : "flex-row-reverse align-middle";

  const cardsClasses = RTL(i18n.t("logout"))
    ? "p-4 flex-row-reverse justify-between items-center"
    : "p-4 flex-row justify-between items-center";
  const mainFont = "arabic-font";
  const mainColor = "#2C3333";
  useEffect(() => {
    if (user) {
      axios
        .post(
          "https://cravecorner.shop/api/getUser",
          { token: user.token },
          {
            headers: {
              Authorization: "Bearer " + user.token,
            },
          }
        )
        .then((response) => setUserInfo(response.data));
    }
  }, [user]);
  const handleLogoutUser = async (token) => {
    try {
      await axios.get(`https://cravecorner.shop/api/logout?token=${token}`);
    } catch (error) {
      return;
    }
  };
  async function LogoutUser() {
    if (user) {
      handleLogoutUser(user.token);
    }
    await SecureStore.deleteItemAsync("user");
    dispatch(logout());
    //clear the addresses
    dispatch(setAddress(null));
    //When the user logout the NeighborhoodIDByFindLocation will replace neighborhoodID
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
    setUserInfo(null);
    navigation.dispatch(DrawerActions.jumpTo("Main"));
  }
  return (
    <View className="flex-1">
      <View className="bg-[#ffd700] h-10 -mb-8"></View>
      <View
        style={{
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.3,
          shadowRadius: 3.05,
          elevation: 3,
        }}
        className="bg-[#ffd700] left-5 px-5 rounded-md absolute z-10 top-44 mt-1"
      >
        <Text className="text-xl font-bold  text-gray-600">
          {userInfo?.name} Alali
        </Text>
      </View>
      <DrawerContentScrollView {...props}>
        <ImageBackground
          source={require("../assets/cold_smooth__tasty._1.png")}
          className="h-40 w-full"
        />

        <View className="flex-1 mt-4 ">
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      {/************* logout button *************/}
      <View>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://wa.me/message/AKUADL6BIMUXH1")
          }
          className={cardsClasses}
        >
          <View className={cardIconText}>
            <Text style={{ fontFamily: mainFont }} className="text-lg ml-3">
              {i18n.t("contactLabel")}
            </Text>
            <AntDesign name="contacts" size={24} color="black" />
          </View>
          <View>{arrowIcon}</View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => (user ? LogoutUser() : navigation.navigate("Login"))}
          className={cardsClasses}
        >
          <View className={cardIconText}>
            <Text style={{ fontFamily: mainFont }} className="text-lg ml-3">
              {user ? i18n.t("logout") : i18n.t("login")}
            </Text>
            <ArrowRightCircleIcon
              size={24}
              color={mainColor}
            ></ArrowRightCircleIcon>
          </View>
          <View>{arrowIcon}</View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
