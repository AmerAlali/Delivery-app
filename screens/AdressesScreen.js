import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon, HomeIcon } from "react-native-heroicons/solid";
import { ScrollView } from "react-native";
import { useLayoutEffect } from "react";
import Adresses from "../components/Adresses";
import { useLanguage } from "../hooks/useLanguage";

const AdressesScreen = () => {
  const navigation = useNavigation();
  const {i18n} = useLanguage();
  const mainColor = "#000000";
  const mainFont = "arabic-font";
  return (
    <SafeAreaView className="flex-1 mt-7 bg-white">
      <View className="flex-1 bg-gray-100">
        <View className="p-5 py-4 border-b border-[#d8dad9] bg-white shadow-xs">
          <View className=" flex-row-reverse justify-between items-center">
            <View>
              <Text
                style={{ fontFamily: mainFont }}
                className="text-lg text-center"
              >
                {i18n.t("myAddresses")}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={navigation.goBack}
                className="shadow bg-gray-100 rounded-full p-2 mr-4"
              >
                <ArrowLeftIcon size={20} color={mainColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView className="mt-3">
          <Adresses />
        </ScrollView>
      </View>
      <View className="p-5 bg-white mt-1 space-y-4">
        <View className=" bg-white">
          <TouchableOpacity
            style={{ backgroundColor: mainColor }}
            className="p-4 rounded-xl"
            onPress={() => navigation.navigate("addAddress")}
          >
            <Text className="text-white text-center text-xl">{i18n.t("addNewAddress")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AdressesScreen;
