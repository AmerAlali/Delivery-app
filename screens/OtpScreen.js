import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Modal, TextInput } from "react-native-paper";
import { useLanguage } from "../hooks/useLanguage";
import {
  arabicFont,
  primaryColor,
  secondaryColor,
} from "../variables/themeVariables";
import LoadingOverlay from "../components/LoadingOverlay";
import { useNavigation, useRoute } from "@react-navigation/native";
import OTPTextInput from "react-native-otp-textinput";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { API_URL } from "@env";

import axios from "axios";

const OtpScreen = () => {
  const { i18n } = useLanguage();
  const {
    params: { email },
  } = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const navigation = useNavigation();
  const goBackTimeoutRef = useRef(null);
  const handleGoBack = () => {
    clearTimeout(goBackTimeoutRef.current);
    navigation.goBack();
  };

  const validateOtp = async () => {
    Keyboard.dismiss();
    try {
      const response = await axios.get(
        `${API_URL}/validate_otp?email=${email}&otp=${otp}`,
        { headers: { userAgent: "CraveMobile" } }
      );
      if (response.data?.success) {
        clearTimeout(goBackTimeoutRef.current);
        navigation.navigate("ChangePassword", { email });
      }
    } catch (error) {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    if (otp.length === 4) {
      validateOtp();
    }
  }, [otp]);

  useEffect(() => {
    goBackTimeoutRef.current = setTimeout(() => {
      handleGoBack();
    }, 60000);

    return () => {
      clearTimeout(goBackTimeoutRef.current);
    };
  }, [otp, navigation]);
  return (
    <View
      className=" h-full items-center pt-8  overflow-hidden tracking-wide"
      style={{ backgroundColor: primaryColor }}
    >
      <Image source={require("../assets/user-img.png")} className="h-36 w-36" />
      <ScrollView
        className="bg-[#fdfdfd] mt-6 h-full w-full p-6"
        style={{ borderTopLeftRadius: 45, borderTopRightRadius: 45 }}
      >
        <View>
          <Text className=" text-center text-2xl  font-bold text-gray-500 mb-5">
            {i18n.t("enterOtp")}
          </Text>
          <View className="flex-row gap-3 mb-3 items-center justify-center">
            <OTPTextInput
              handleTextChange={setOtp}
              inputCount={4}
              keyboardType="numeric"
              autoFocusOnLoad={false}
              autoFocus={false}
              tintColor="black"
              offTintColor="black"
              className="border border-gray-600 text-center w-12 h-12"
            />
          </View>

          <TouchableOpacity
            onPress={validateOtp}
            disabled={otp.length === 4 ? false : true}
            style={{
              backgroundColor: otp.length === 4 ? primaryColor : "#cccccc",
            }}
            className="p-3 text-center mt-2 rounded-md"
          >
            <Text
              style={{ color: secondaryColor }}
              className="text-base text-center"
            >
              {i18n.t("continue")}
            </Text>
          </TouchableOpacity>
          <View className="items-center mt-10">
            <CountdownCircleTimer
              isPlaying
              size={100}
              strokeWidth={8}
              duration={60}
              colors={[primaryColor, "#F7B801", "#A30000", "#A30000"]}
              colorsTime={[7, 5, 2, 0]}
            >
              {({ remainingTime }) => (
                <Text className="text-2xl">{remainingTime}</Text>
              )}
            </CountdownCircleTimer>
          </View>
        </View>
      </ScrollView>
      <Modal
        transparent={true}
        onDismiss={() => setIsModalOpen(!isModalOpen)}
        visible={isModalOpen}
        animationType="fade"
        style={{ marginTop: -60 }}
      >
        <View className=" flex-1 justify-center">
          <View className="bg-white m-4 rounded-md p-4">
            <Text
              className="text-lg text-center"
              style={{ fontFamily: arabicFont, color: secondaryColor }}
            >
              {i18n.t("otpNotCorrect")}
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalOpen(!isModalOpen)}
              className={`p-2 mt-4 w-full rounded-md`}
              style={{ backgroundColor: primaryColor }}
            >
              <Text
                className="text-center text-lg text-gray-900"
                style={{ fontFamily: arabicFont }}
              >
                {i18n.t("ok")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/************* Loading Overlay *************/}
      {isLoading && <LoadingOverlay />}
    </View>
  );
};

export default OtpScreen;
