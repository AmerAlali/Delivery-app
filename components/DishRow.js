import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { memo, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRTL } from "../hooks/useRTL";
const DishRow = ({
  id,
  name,
  description,
  price,
  img,
  restaurant_id,
  discount,
}) => {
  const mainFont = "arabic-font";

  const navigation = useNavigation();

  /*const removeItemFromBasket = useCallback(() => {
    if (!itemsLength) return;
    console.log("???");
    dispatch(removeFromBasket({ id, quantity }));
  }, [items]);*/

  const handleNavigateToProductScreen = useCallback(() => {
    navigation.navigate("ProductDetails", {
      id,
      name,
      description,
      price,
      discount,
      img,
      restaurant_id,
    });
  });
  const checkIfRTL = useRTL();
  return (
    <View>
      <TouchableOpacity
        onPress={handleNavigateToProductScreen}
        className="bg-white border p-4 border-gray-200"
      >
        <View className={checkIfRTL(name) ? `flex-row-reverse` : "flex-row"}>
          <View className="flex-1 or-2">
            <Text style={{ fontFamily: mainFont }} className="text-lg mb-1">
              {name}
            </Text>
            <Text style={{ fontFamily: mainFont }} className="text-gray-400">
              {description}
            </Text>
            <Text
              style={{ fontFamily: mainFont }}
              className={
                checkIfRTL(name)
                  ? "text-gray-400 mt-2 text-right"
                  : "text-gray-400 mt-2"
              }
            >
              ₺{price - discount}
            </Text>
          </View>
          {img && (
            <View>
              <Image
                style={{ borderWidth: 1, borderColor: "#F3F3F4" }}
                source={{
                  uri: `https://cravecorner.shop/public/storage/${img}`,
                }}
                className="h-20 w-20 bg-gray-300 p-4 rounded-lg"
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default memo(DishRow);
