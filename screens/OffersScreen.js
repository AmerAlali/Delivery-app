import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useLanguage } from "../hooks/useLanguage";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { arabicFont, primaryColor } from "../variables/themeVariables";
import { ScrollView } from "react-native";

const OffersScreen = () => {
  const { i18n } = useLanguage();
  const navigation = useNavigation();
  return (
    <View className="flex-1 pt-7 bg-white">
      {/********** Header **********/}
      <View className="p-5 py-4 border-b border-[#d8dad9] bg-white shadow-xs">
        <View className=" flex-row-reverse justify-between items-center">
          <View>
            <Text
              style={{ fontFamily: arabicFont }}
              className="text-lg text-center"
            >
              {i18n.t("offersLabel")}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={navigation.goBack}
              className="shadow bg-gray-100 rounded-full p-2 mr-4"
            >
              <ArrowLeftIcon size={20} color={primaryColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView>
        <View className="flex-1 bg-gray-50 p-3 gap-2">
          <TouchableOpacity className="bg-white p-2 shadow rounded-md">
            <Image
              source={{
                uri: "https://cravecorner.shop/public/storage/images/cV2gcQFHq7Jq8qHLwQWghyhcrT7HmuyIhNCiGmPr.png",
              }}
              className="h-36 rounded-md w-full]"
            />
            <Text className="mt-2">Up to 10% discount on each order!</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white p-2 shadow rounded-md">
            <Image
              source={{
                uri: "https://cravecorner.shop/public/storage/images/cV2gcQFHq7Jq8qHLwQWghyhcrT7HmuyIhNCiGmPr.png",
              }}
              className="h-36 rounded-md w-full]"
            />
            <Text className="mt-2">Up to 10% discount on each order!</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white p-2 shadow rounded-md">
            <Image
              source={{
                uri: "https://cravecorner.shop/public/storage/images/cV2gcQFHq7Jq8qHLwQWghyhcrT7HmuyIhNCiGmPr.png",
              }}
              className="h-36 rounded-md w-full]"
            />
            <Text className="mt-2">Up to 10% discount on each order!</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white p-2 shadow rounded-md">
            <Image
              source={{
                uri: "https://cravecorner.shop/public/storage/images/cV2gcQFHq7Jq8qHLwQWghyhcrT7HmuyIhNCiGmPr.png",
              }}
              className="h-36 rounded-md w-full]"
            />
            <Text className="mt-2">Up to 10% discount on each order!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default OffersScreen;
