import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useSelector } from "react-redux";

import axios from "axios";
import { useLanguage } from "../hooks/useLanguage";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { secondaryColor } from "../variables/themeVariables";
import { API_URL } from "@env";
const ProfileScreen = () => {
  const navigation = useNavigation();
  const { i18n } = useLanguage();
  const { user } = useSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState([]);
  useEffect(() => {
    axios
      .post(
        `${API_URL}/getUser`,
        { token: user.token },
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      )
      .then((response) => setUserInfo(response.data));
  }, []);

  return (
    <SafeAreaView className="bg-gray-100 h-full">
      <View className="p-5 py-4 border-b border-[#d8dad9] bg-white shadow-xs">
        <View className=" flex-row-reverse justify-between items-center">
          <View>
            <Text className="text-lg text-center">
              {i18n.t("profileLabel")}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={navigation.goBack}
              className="shadow bg-gray-100 rounded-full p-2 mr-4"
            >
              <ArrowLeftIcon size={20} color={secondaryColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="mt-3 ">
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
          <MaterialCommunityIcons
            name="email-multiple-outline"
            size={24}
            color="black"
          />
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
          <Feather name="user" size={24} color="black" />
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
          <Feather name="smartphone" size={24} color="black" />
          <Text className="text-lg">{userInfo?.phone}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
