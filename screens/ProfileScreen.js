import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeftIcon,
  InboxIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  MapPinIcon,
  ArrowRightOnRectangleIcon,
  ArrowRightCircleIcon,
  GiftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
  AdjustmentsHorizontalIcon,
} from "react-native-heroicons/outline";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../features/userSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setSelectedAddress } from "../features/selectedAddressSlice";
import { setNeighborhoodID } from "../features/neighborhoodSlice";
import { setAddress } from "../features/addressSlice";
import LoadingOverlay from "../components/LoadingOverlay";
import * as SecureStore from "expo-secure-store";
import { useLanguage } from "../hooks/useLanguage";
import { useRTL } from "../hooks/useRTL";
import { AntDesign } from "@expo/vector-icons";
import { Linking } from "react-native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { i18n } = useLanguage();
  const RTL = useRTL();
  const { user } = useSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState([]);
  const [splashLoading, setSplashLoading] = useState(null);
  const mainFont = "arabic-font";
  const mainColor = "#2C3333";
  const dispatch = useDispatch();

  const handleLogoutUser = async (token) => {
    try {
      await axios.get(`https://cravecorner.shop/api/logout?token=${token}`);
    } catch (error) {
      return;
    }
  };
  const arrowIcon = RTL(i18n.t("logout")) ? (
    <ChevronLeftIcon size={25} color={mainColor}></ChevronLeftIcon>
  ) : (
    <ChevronRightIcon size={25} color={mainColor}></ChevronRightIcon>
  );
  const cardsClasses = RTL(i18n.t("logout"))
    ? "p-4 flex-row-reverse justify-between items-center"
    : "p-4 flex-row justify-between items-center";
  const cardIconText = RTL(i18n.t("logout"))
    ? "flex-row align-middle space-x-2"
    : "flex-row-reverse align-middle";

  useEffect(() => {
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
  }, []);
  async function LogoutUser() {
    setSplashLoading(true);
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
    setTimeout(() => {
      setSplashLoading(null);
    }, 500);
    navigation.navigate("Home");
  }

  return (
    <SafeAreaView className="bg-gray-50 h-full">
      <View className="flex-row bg-white p-3 border-b border-[#d8dad9]">
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            className="shadow bg-gray-100 rounded-full p-2 mr-4"
          >
            <ArrowLeftIcon size={20} color={mainColor} />
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-3">
        {/************* user's Email *************/}
        <View
          className="p-4 flex-row items-center space-x-2"
          style={{
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.5,
            elevation: 1,
          }}
        >
          <InboxIcon size={25} color={mainColor}></InboxIcon>
          <Text className="text-lg">{userInfo.email}</Text>
        </View>
        {/************* user's name *************/}
        <View
          className="p-4 flex-row items-center space-x-2"
          style={{
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.5,
            elevation: 1,
          }}
        >
          <UserIcon size={25} color={mainColor}></UserIcon>
          <Text className="text-lg">{userInfo.name}</Text>
        </View>
        {/************* user's phone number *************/}
        <View
          className="p-4 flex-row items-center space-x-2"
          style={{
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.5,
            elevation: 1,
          }}
        >
          <DevicePhoneMobileIcon
            size={25}
            color={mainColor}
          ></DevicePhoneMobileIcon>
          <Text className="text-lg">{userInfo?.phone}</Text>
        </View>
      </View>
      <View className="mt-3">
        {/************* user's adresses *************/}
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Adresses")}
            className={cardsClasses}
            style={{
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.5,
              elevation: 1,
            }}
          >
            <View className={cardIconText}>
              <Text style={{ fontFamily: mainFont }} className="text-lg ml-2">
                {i18n.t("myAddresses")}
              </Text>
              <MapPinIcon size={25} color={mainColor}></MapPinIcon>
            </View>
            <View>{arrowIcon}</View>
          </TouchableOpacity>
        </View>
        {/************* user's orders *************/}
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Orders")}
            className={cardsClasses}
            style={{
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.5,
              elevation: 1,
            }}
          >
            <View className={cardIconText}>
              <Text style={{ fontFamily: mainFont }} className="text-lg ml-2">
                {i18n.t("previousOrders")}
              </Text>
              <ShoppingBagIcon size={25} color={mainColor}></ShoppingBagIcon>
            </View>
            <View>{arrowIcon}</View>
          </TouchableOpacity>
        </View>
        {/************* Offers  *************/}
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Orders")}
            className={cardsClasses}
            style={{
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.5,
              elevation: 1,
            }}
          >
            <View className={cardIconText}>
              <Text style={{ fontFamily: mainFont }} className="text-lg ml-2">
                {i18n.t("offersLabel")}
              </Text>
              <GiftIcon size={25} color={mainColor}></GiftIcon>
            </View>
            <View>{arrowIcon}</View>
          </TouchableOpacity>
        </View>
        {/************* Contact Us  *************/}
        <View>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://wa.me/message/AKUADL6BIMUXH1")
            }
            className={cardsClasses}
            style={{
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.5,
              elevation: 1,
            }}
          >
            <View className={cardIconText}>
              <Text style={{ fontFamily: mainFont }} className="text-lg ml-2">
                {i18n.t("contactLabel")}
              </Text>
              <AntDesign name="contacts" size={24} color="black" />
            </View>
            <View>{arrowIcon}</View>
          </TouchableOpacity>
        </View>
        {/************* Settings  *************/}
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            className={cardsClasses}
            style={{
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.5,
              elevation: 1,
            }}
          >
            <View className={cardIconText}>
              <Text style={{ fontFamily: mainFont }} className="text-lg ml-2">
                {i18n.t("settingsLabel")}
              </Text>
              <AdjustmentsHorizontalIcon size={24} color="black" />
            </View>
            <View>{arrowIcon}</View>
          </TouchableOpacity>
        </View>
        {/************* logout button *************/}
        <View>
          <TouchableOpacity
            onPress={() => LogoutUser()}
            className={cardsClasses}
            style={{
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.5,
              elevation: 1,
            }}
          >
            <View className={cardIconText}>
              <Text style={{ fontFamily: mainFont }} className="text-lg ml-2">
                {i18n.t("logout")}
              </Text>
              <ArrowRightCircleIcon
                size={25}
                color={mainColor}
              ></ArrowRightCircleIcon>
            </View>
            <View>{arrowIcon}</View>
          </TouchableOpacity>
        </View>
      </View>
      {/************* Loading Overlay *************/}
      {splashLoading && <LoadingOverlay />}
    </SafeAreaView>
  );
};

export default ProfileScreen;
