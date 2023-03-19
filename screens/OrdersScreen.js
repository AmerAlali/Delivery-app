import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { XMarkIcon } from "react-native-heroicons/solid";
import OrderCard from "../components/OrderCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useSelector } from "react-redux";
import OrderScreenSkeleton from "../components/OrderScreenSkeleton";
import { useLanguage } from "../hooks/useLanguage";

const mainColor = "#000000";
const mainFont = "arabic-font";
const OrdersScreen = () => {
  const { user } = useSelector((state) => state.user);
  const {i18n} = useLanguage();
  const [orders, setOrders] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios.get(
        `https://cravecorner.shop/api/userOrders?token=${user.token}`,
        { token: user.token }
      );
      setOrders(response.data);
      setIsLoading(false);
    };
    if (user !== null) {
      fetchOrders();
    }
  }, [user]);
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View>
        {/***** Header *****/}
        <View
          className="flex-row justify-between border-b items-center border-gray-200 shadow space-x-2 p-3 bg-white"
          style={{ paddingTop: 40 }}
        >
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              className="shadow rounded-full p-3 mr-4"
            >
              <XMarkIcon size={25} color={mainColor} />
            </TouchableOpacity>
          </View>
          <View>
            <Text className="text-xl" style={{ fontFamily: mainFont }}>
              {i18n.t("previousOrders")}
            </Text>
          </View>
        </View>
      </View>
      {isLoading && <OrderScreenSkeleton />}
      {orders && orders.length !== 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {orders.map((order) => (
            <OrderCard key={order.order_id} orderInfo={order} />
          ))}
        </ScrollView>
      ) : (
        <View className="mt-16">
          <Text
            className="text-2xl text-gray-600 text-center"
            style={{ fontFamily: mainFont }}
          >
            {i18n.t("noPreviousOrders")}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrdersScreen;
