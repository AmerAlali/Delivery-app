import { View, Text } from "react-native";
import React, { memo } from "react";
import DishRow from "./DishRow";
const mainFont = "arabic-font";
const RestaurantCategories = ({ dishes, title }) => {
  return (
    <View>
      <View className="bg-gray-50">
        <Text
          style={{ fontFamily: mainFont }}
          className="px-4 pt-6 mb-3 text-xl"
        >
          {title}
        </Text>
        {/* DishRows */}
        {dishes &&
          dishes.map((dish) => (
            <DishRow
              restaurant_id={dish.restaurant_id}
              key={dish.product_id}
              id={dish.product_id}
              name={dish.product_title}
              description={dish.product_description}
              price={parseInt(dish.product_price)}
              discount={parseInt(dish.product_discount)}
              img={dish.product_image}
            />
          ))}
      </View>
    </View>
  );
};

export default memo(RestaurantCategories);
