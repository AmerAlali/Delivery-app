import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  BackHandler,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import Lottie from "lottie-react-native";
import { ScrollView } from "react-native";
import { useRTL } from "../hooks/useRTL";
import axios from "axios";
import OrderStatusSkeleton from "../components/OrderStatusSkeleton";
import { useLanguage } from "../hooks/useLanguage";
import { arabicFont, primaryColor } from "../variables/themeVariables";

const mainColor = "#00ccbc";
const mainFont = "arabic-font";
const OrderStatusScreen = () => {
  const {
    params: { order_id, navigatedFrom },
  } = useRoute();
  const [refreshing, setRefreshing] = useState(false);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { i18n } = useLanguage();
  const navigation = useNavigation();

  const fetchOrder = async () => {
    const response = await axios.get(
      `https://cravecorner.shop/api/userOrderWithID?id=${order_id}`,
      { headers: { userAgent: "CraveMobile" } }
    );
    setOrder(response.data[0]);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  useEffect(() => {
    fetchOrder();
  }, [order_id]);

  const handleRefresh = () => {
    setRefreshing(true);
    // fetch new data
    fetchOrder();
    setRefreshing(false);
  };
  if (navigatedFrom !== "OrdersScreen") {
    useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          navigation.navigate("Home");
          return true;
        };

        BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () =>
          BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      }, [])
    );
  }

  const handleStatusText = useCallback(() => {
    if (order?.order_status === "new") {
      return i18n.t("waitingForRestaurantAccept");
    } else if (order?.order_status === "accepted") {
      return "يتم تجهيز طلبك";
    } else if (order?.order_status === "onWay") {
      return "خرج طلبك للتوصيل";
    } else if (order?.order_status === "handed") {
      return "تم تسليم الطلب";
    } else if (order?.order_status == "canceled") {
      return "للأسف تم رفض طلبك ";
    }
  }, [order, refreshing]);
  const handleChangeLottieAnimation = useCallback(() => {
    if (order?.order_status === "new") {
      return require("../assets/new.json");
    } else if (order?.order_status === "accepted") {
      return require("../assets/foodPreparing.json");
    } else if (order?.order_status === "onWay") {
      return require("../assets/onWay.json");
    } else if (order?.order_status === "handed") {
      return require("../assets/handed.json");
    } else if (order?.order_status == "canceled") {
      return require("../assets/canceled.json");
    }
  }, [order, refreshing]);

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

  const animationRef = useRef(null);
  const isRtl = useRTL();
  useEffect(() => {
    animationRef.current?.play();
  }, [order, !isLoading]);
  return (
    <SafeAreaView className="bg-white flex-1">
      <View>
        {/***** Header *****/}
        <View className="p-5 py-4 border-b border-[#d8dad9] bg-white shadow-xs">
          <View className=" flex-row-reverse justify-between items-center">
            <View>
              <Text
                style={{ fontFamily: arabicFont }}
                className="text-lg text-center"
              >
                {i18n.t("orderStatus")}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigatedFrom === "OrdersScreen"
                    ? navigation.navigate("Orders")
                    : navigation.navigate("Home")
                }
                className="shadow bg-gray-100 rounded-full p-2 mr-4"
              >
                <ArrowLeftIcon size={20} color={primaryColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/***** Body *****/}
        {isLoading === false ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                colors={[primaryColor]}
                tintColor={mainColor}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            <View className=" mt-10 mb-36">
              {/***** Order status gif *****/}
              <View className="flex-1 items-center">
                {order?.order_status && (
                  <Lottie
                    ref={animationRef}
                    style={{
                      width: 200,
                      height: 200,
                    }}
                    // Find more Lottie files at https://lottiefiles.com/featured
                    source={handleChangeLottieAnimation()}
                  />
                )}
                <Text
                  className="text-2xl mt-6 px-3 text-center"
                  style={{ fontFamily: arabicFont }}
                >
                  {handleStatusText()}
                </Text>
              </View>
              {/***** Order details *****/}
              <View className="mt-4">
                <Text
                  className="text-base px-4 my-2"
                  style={{ fontFamily: mainFont }}
                >
                  {i18n.t("orderInfo")}
                </Text>
                <View className="bg-white w-full p-4 justify-between">
                  <View className="border-b flex-row-reverse justify-between pb-4 border-gray-300">
                    <Text
                      className="text-base"
                      style={{ fontFamily: mainFont }}
                    >
                      {i18n.t("restaurant")}
                    </Text>

                    <Text
                      className={"text-gray-900 text-base"}
                      style={{ fontFamily: mainFont }}
                    >
                      {order?.restaurant_title}
                    </Text>
                  </View>
                  <View className="border-b flex-row-reverse py-4 justify-between pb-4 border-gray-300">
                    <Text
                      className="text-base"
                      style={{ fontFamily: mainFont }}
                    >
                      {i18n.t("orders")}
                    </Text>
                    <View>
                      {order?.products.map((product) => (
                        <Text
                          className="text-base"
                          key={product.product_id}
                          style={{ fontFamily: mainFont }}
                        >
                          {product.quantity + "x " + product.product_title}
                        </Text>
                      ))}
                    </View>
                  </View>
                  <View className="border-b flex-row-reverse py-4 justify-between pb-4 border-gray-300">
                    <Text
                      className="text-base"
                      style={{ fontFamily: mainFont }}
                    >
                      {i18n.t("orderDate")}
                    </Text>
                    <View>
                      <Text
                        className="text-gray-900 text-base"
                        style={{ fontFamily: mainFont }}
                      >
                        {formatDate(order?.created_At)}
                      </Text>
                    </View>
                  </View>
                  <View className="border-b py-4 justify-between pb-4 border-gray-300">
                    <Text
                      className="text-base mb-2"
                      style={{ fontFamily: mainFont }}
                    >
                      {i18n.t("deliveryAddress")}
                    </Text>
                    <View>
                      <Text className="text-base text-gray-900">
                        {order?.address}
                      </Text>
                    </View>
                  </View>
                  <View className="border-b flex-row-reverse py-4 justify-between pb-4 border-gray-300">
                    <Text
                      className="text-base"
                      style={{ fontFamily: mainFont }}
                    >
                      {i18n.t("total")}
                    </Text>
                    <View>
                      <Text className="text-base text-gray-900 w-60">
                        ₺{order?.total}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : (
          <OrderStatusSkeleton />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderStatusScreen;
