import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { memo } from "react";
import { StarIcon } from "react-native-heroicons/solid";
import { TruckIcon } from "react-native-heroicons/outline";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../hooks/useLanguage";
import { SharedElement } from "react-navigation-shared-element";

const RestaurantCard = ({
  id,
  imgUrl,
  title,
  rating,
  genre,
  adress,
  short_description,
  dishes,
  activity,
  isdiscounted,
  res_keywords,
  deliveryLimit,
  deliveryCost,
  mind_time,
  maxDeliveryTime,
  CategoryName,
  reviews,
}) => {
  const navigation = useNavigation();
  const mainFont = "arabic-font";
  const { i18n } = useLanguage();
  const mainColor = "black";
  const navgiateToResScreen = () => {
    if (activity === "true") {
      navigation.navigate("Restaurant", {
        id,
        imgUrl,
        title,
        rating,
        genre,
        adress,
        short_description,
        dishes,
        res_keywords,
        deliveryLimit,
        deliveryCost,
        mind_time,
        maxDeliveryTime,
        CategoryName,
        reviews,
      });
    }
  };
  return (
    <TouchableOpacity
      onPress={navgiateToResScreen}
      className="bg-white mr-3 w-64 shadow rounded-md overflow-hidden"
    >
      <SharedElement id={`restaurant.${id}.image.${CategoryName}`}>
        <Image
          source={{ uri: imgUrl }}
          className="h-36 w-64"
          style={{ resizeMode: "cover" }}
        />
      </SharedElement>

      <View className="px-3 pb-4">
        <View className="flex-row items-center justify-between pt-2">
          <Text
            style={{ fontFamily: mainFont }}
            className="font-bold text-lg mt-2 "
          >
            {title}
          </Text>
        </View>
        <View className="flex-row mt-2">
          <View className="flex-row gap-2 items-center">
            <Ionicons name="timer-outline" size={12} color="black" />
            <Text className="text-xs">
              {mind_time && mind_time}
              {maxDeliveryTime && " - " + maxDeliveryTime + " dk"}
            </Text>
            <Text className="text-gray-200"> | </Text>
          </View>
          <View className="flex-row gap-2 items-center">
            <MaterialIcons name="motorcycle" size={13} color="black" />
            <Text className="text-xs">
              {deliveryCost !== "0" ? "₺" + deliveryCost : "Free"}
            </Text>
            <Text className="text-gray-200"> | </Text>
          </View>
          <View className="flex-row gap-2 items-center">
            <Text className="text-xs">Min: </Text>
            <Text>₺{deliveryLimit}</Text>
          </View>
        </View>
      </View>
      {activity === "false" ? (
        <View className="h-36   w-full absolute bg-[#1b1b1b96] ">
          <Text
            style={{ fontFamily: mainFont }}
            className="text-center text-white text-2xl font-semibold top-16"
          >
            مغلق حالياً
          </Text>
        </View>
      ) : null}
      {isdiscounted === "true" && activity === "true" ? (
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
          className="w-18 absolute rounded-br-2xl pl-2 pr-10 top-32 bg-[#ffd700]"
        >
          <Text
            className="text-[#434340] text-base"
            style={{ fontFamily: mainFont }}
          >
            {i18n.t("discounted")}
          </Text>
        </View>
      ) : null}
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
        className="flex-row absolute z-10 bg-[#ffffff] px-2 py-1 rounded-l-full right-0 top-32 item-center space-x-1"
      >
        <StarIcon color="#ffd700" size={20}></StarIcon>
        <Text style={{ color: "#434340" }} className=" font-extrabold">
          {rating}
        </Text>
        <Text className="text-[#434340]" style={{ fontSize: 13 }}>
          ({reviews})
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(RestaurantCard);
