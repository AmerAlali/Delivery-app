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
import {
  primaryColor,
  secondaryColor,
  arabicFont,
} from "../variables/themeVariables";
const BasketIcon = () => {
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
        className="mx-5 px-4 py-3 rounded-lg flex-row items-center space-x-1"
        style={{ backgroundColor: primaryColor }}
      >
        <Text
          className="text-white font-extrabold rounded-xl text-lg  py-1 px-3"
          style={{
            borderWidth: 0.9,
            color: secondaryColor,
            borderColor: secondaryColor,
          }}
        >
          {totalQuantity}
        </Text>
        <Text
          style={{ fontFamily: arabicFont, color: secondaryColor }}
          className="flex-1  font-extrabold text-lg text-center"
        >
          {i18n.t("goToBasket")}
        </Text>
        <Text
          style={{ color: secondaryColor }}
          className="text-lg font-extrabold"
        >
          ₺{basketTotal}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(BasketIcon);
