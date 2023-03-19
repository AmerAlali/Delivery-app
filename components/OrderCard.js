import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState, memo } from "react";
import { useRTL } from "../hooks/useRTL";
import { useNavigation } from "@react-navigation/native";
import { ArrowPathIcon } from "react-native-heroicons/outline";
import { useDispatch, useSelector } from "react-redux";
import { addToBasket, clearBasketItems } from "../features/basketSlice";
import { useLanguage } from "../hooks/useLanguage";

const OrderCard = ({ orderInfo }) => {
  const { restaurants } = useSelector((state) => state.restaurants);
  const {i18n} = useLanguage();
  const [restaurantID, setRestaurantID] = useState(null);
  const {
    restaurant_title,
    order_id,
    restaurant_location,
    total,
    products,
    restaurant_activity,
    created_At,
    restaurant_id,
  } = orderInfo;
  useEffect(() => {
    if (restaurants) {
      const foundRestaurant = restaurants.find(
        (restaurant) => restaurant.id == restaurant_id
      );
      if (foundRestaurant) {
        setRestaurantID(foundRestaurant.id);
      }
    }
  }, []);
  const mainColor = "#000000";
  const mainFont = "arabic-font";

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    let hours = date.getHours();
    const minutes = ("0" + date.getMinutes()).slice(-2);
    let timePeriod = "AM";
    if (hours > 12) {
      hours -= 12;
      timePeriod = "PM";
    }
    const time = `${hours}:${minutes} ${timePeriod}`;
    const formattedDate = `${day}.${month}.${year} . ${time}`;
    return formattedDate;
  };
  const navigatedFrom = "OrdersScreen";
  const isRtl = useRTL();
  const buttonBgColor =
    restaurant_activity === "true" && restaurantID !== null
      ? mainColor
      : "#969696";
  const dispatch = useDispatch();

  const handleCreatingNewOrder = () => {
    if (restaurant_activity === "true" && restaurantID !== null) {
      dispatch(clearBasketItems());
      products.map((product) => {
        const { product_id, product_title, product_price, quantity } = product;
        dispatch(
          addToBasket({
            id: parseInt(product_id),
            name: product_title,
            quantity: parseInt(quantity),
            price: parseInt(product_price),
            img: "",
            restaurant_id: parseInt(restaurant_id),
          })
        );
      });
      navigation.navigate("Basket");
    }
  };

  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("OrderStatus", { order_id, navigatedFrom })
      }
      className="p-5 m-2 border border-gray-100 shadow rounded-md bg-white"
    >
      <View
        className={
          !isRtl(restaurant_title)
            ? "flex-row items-center"
            : "flex-row-reverse items-center "
        }
      >
        <Text className={`text-[${mainColor}] text-base`}>
          {restaurant_title}
        </Text>
        <Text className={`text-[${mainColor}] text-base`}>
          {" "}
          {`( ${restaurant_location} )`}
        </Text>
      </View>
      <View className="mt-1">
        {products.map((product) => (
          <Text
            key={product.product_id}
            style={{ fontFamily: mainFont }}
            className="text-sm text-gray-600"
          >
            {product.quantity + "x " + product.product_title}
          </Text>
        ))}
      </View>
      <View className="mt-1 flex-row">
        <Text className="text-gray-600">{formatDate(created_At)}</Text>
        <Text className={`text-[${mainColor}]`}> . ₺{total}</Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={handleCreatingNewOrder}
          disabled={restaurant_activity === "false" || restaurantID === null}
          style={{ backgroundColor: buttonBgColor }}
          className={`flex-row-reverse gap-2 items-center justify-center p-1 rounded-md mt-3`}
        >
          <Text
            className="text-base text-white"
            style={{ fontFamily: mainFont }}
          >
            {i18n.t("orderAgain")}
          </Text>
          <ArrowPathIcon size={20} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default memo(OrderCard);
