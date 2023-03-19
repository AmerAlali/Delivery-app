import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";

const CategoryCard = ({ imgUrl, title, restaurants }) => {
  const mainFont = "arabic-font";
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className="relative mr-2"
      onPress={() => {
        navigation.navigate("Results", {
          title,
          restaurants,
        });
      }}
    >
      <Image source={{ uri: imgUrl }} className="h-20 w-28 rounded"></Image>
      <Text
        style={{ fontFamily: mainFont }}
        className="absolute bottom-1 left-1 text-white capitalize"
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(CategoryCard);
