import { Text } from "react-native";
import React from "react";
import Lottie from "lottie-react-native";
import { useRef } from "react";
import { useEffect } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackHandler } from "react-native";

const OrderConfirmScreen = () => {
  const {
    params: { order_id },
  } = useRoute();
  const navigatedFrom = "OrderConfirm";
  const navigation = useNavigation();
  const animationRef = useRef(null);
  useEffect(() => {
    animationRef.current?.play();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("OrderStatus", { order_id, navigatedFrom });
    }, 3000);
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center align-middle">
      <Lottie
        ref={animationRef}
        style={{
          width: 250,
          height: 250,
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require("../assets/95088-success.json")}
      />
      <Text style={{ fontFamily: "arabic-font" }} className="text-3xl">
        لقد أخذنا طلبك!
      </Text>
    </SafeAreaView>
  );
};

export default OrderConfirmScreen;
