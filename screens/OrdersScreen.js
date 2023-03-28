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
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import {
  arabicFont,
  primaryColor,
  secondaryColor,
} from "../variables/themeVariables";
const OrdersScreen = () => {
  const { user } = useSelector((state) => state.user);
  const { i18n } = useLanguage();
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
    <View className="flex-1 pt-7 bg-white">
      <View className="p-5 py-4 border-b border-[#d8dad9] bg-white shadow-xs">
        <View className=" flex-row-reverse justify-between items-center">
          <View>
            <Text
              style={{ fontFamily: arabicFont }}
              className="text-lg text-center"
            >
              {i18n.t("previousOrders")}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={navigation.goBack}
              className="shadow bg-gray-100 rounded-full p-2 mr-4"
            >
              <ArrowLeftIcon size={20} color={secondaryColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {isLoading && <OrderScreenSkeleton />}
      {orders && orders.length !== 0 ? (
        <ScrollView
          className="bg-gray-100"
          showsVerticalScrollIndicator={false}
        >
          {orders.map((order) => (
            <OrderCard key={order.order_id} orderInfo={order} />
          ))}
        </ScrollView>
      ) : (
        <View className="mt-16">
          <Text
            className="text-2xl text-gray-600 text-center"
            style={{ fontFamily: arabicFont }}
          >
            {i18n.t("noPreviousOrders")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default OrdersScreen;
