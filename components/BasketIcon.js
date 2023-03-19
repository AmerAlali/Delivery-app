import { View, Text, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import {
  selectBasketItems,
  selectBasketTotal,
  totalBasketItems,
} from "../features/basketSlice";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../hooks/useLanguage";

const BasketIcon = () => {
  const mainFont = "arabic-font";
  const { i18n } = useLanguage();
  const items = useSelector(selectBasketItems);
  const navigation = useNavigation();
  const basketTotal = useSelector(selectBasketTotal);
  const totalQuantity = useSelector(totalBasketItems);

  if (items.length === 0) return null;
  return (
    <View className="absolute bottom-7 w-full z-50">
      <TouchableOpacity
        onPress={() => navigation.navigate("Basket")}
        className="mx-5 bg-[#020202] px-4 py-3 rounded-lg flex-row items-center space-x-1"
      >
        <Text
          className="text-white font-extrabold rounded-xl text-lg border-white py-1 px-3"
          style={{ borderWidth: 0.9 }}
        >
          {totalQuantity}
        </Text>
        <Text
          style={{ fontFamily: mainFont }}
          className="flex-1 text-white font-extrabold text-lg text-center"
        >
          {i18n.t("goToBasket")}
        </Text>
        <Text className="text-lg text-white font-extrabold">
          ₺{basketTotal}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(BasketIcon);
