import { View, Text, TouchableOpacity, Image, I18nManager } from "react-native";
import React, { useCallback, useState, memo } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ArrowLeftIcon,
  PlusCircleIcon,
  MinusCircleIcon,
} from "react-native-heroicons/solid";
import { addToBasket } from "../features/basketSlice";
import { useDispatch } from "react-redux";
import { useRTL } from "../hooks/useRTL";
import { useLanguage } from "../hooks/useLanguage";

const mainFont = "arabic-font";
const mainColor = "#000000";
const ProductScreen = () => {
  const {
    params: { id, name, description, price, img, restaurant_id, discount },
  } = useRoute();
  const {i18n} = useLanguage();
  const checkIfRTL = useRTL();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // add quantity
  const handleAddingQuantity = useCallback(() => {
    setQuantity(quantity + 1);
  }, [quantity]);
  // remove quantity
  const handleRemovingQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }, [quantity]);

  //save item to basket
  const addItemToBasket = useCallback(() => {
    const discountedPrice = parseInt(price - discount);
    console.log(discountedPrice);
    navigation.goBack();
    dispatch(
      addToBasket({
        id,
        name,
        quantity,
        price: discountedPrice,
        img,
        restaurant_id,
      })
    );
  }, [quantity]);
  return (
    <View className="flex-1 bg-white justify-between">
      <View>
        <TouchableOpacity
          onPress={navigation.goBack}
          className="absolute top-14 left-5 z-10 bg-gray-100 rounded-full p-2"
        >
          <ArrowLeftIcon size={20} color={mainColor} />
        </TouchableOpacity>
        <Image
          style={{ resizeMode: "cover" }}
          source={require("../assets/placeholder.jpg")}
          className=" h-60  w-full"
        />
        <View
          style={{ borderTopRightRadius: 35, borderTopLeftRadius: 35 }}
          className="-mt-10 py-8 px-5 bg-white shadow"
        >
          <Text className={`text-2xl mb-1`} style={{ fontFamily: mainFont }}>
            {name}
          </Text>
          <Text className="text-gray-600 mb-1" style={{ fontFamily: mainFont }}>
            {description}
          </Text>
          <Text
            className={`text-base text-gray-500 ${
              checkIfRTL(name) && "text-right"
            }`}
          >
            ₺{price - discount}
          </Text>
        </View>
      </View>
      <View className="bg-white w-full">
        <View className="flex-row-reverse items-center gap-2 justify-center">
          <TouchableOpacity
            className="p-2 rounded-full"
            onPress={handleAddingQuantity}
          >
            <PlusCircleIcon
              color={mainColor}
              //color={items.length > 0 ? "#00CCBB" : "gray"}
              size={35}
            />
          </TouchableOpacity>
          <Text className="text-3xl w-16 text-center font-bold">
            {quantity}
          </Text>
          <TouchableOpacity
            className="p-2 rounded-full"
            disabled={quantity === 1}
            onPress={handleRemovingQuantity}
          >
            <MinusCircleIcon
              color={quantity > 1 ? mainColor : "gray"}
              size={35}
            />
          </TouchableOpacity>
        </View>
        <View className="border-t mt-2 border-gray-200 p-5">
          <TouchableOpacity
            onPress={addItemToBasket}
            style={{backgroundColor: mainColor}}
            className={`p-4 border-t ${checkIfRTL(i18n.t("addToBasket")) ? "flex-row-reverse" : "flex-row"} items-center justify-center border-gray-100 rounded-md`}
          >
            <Text
              style={{ fontFamily: mainFont }}
              className="text-center text-white text-lg"
            >
              {i18n.t("addToBasket")}
            </Text>
            <Text className="text-white text-lg">
              
              {checkIfRTL(i18n.t("addToBasket")) ? "₺" + quantity * (price - discount) + " . " : " . ₺" + quantity * (price - discount)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(ProductScreen);
