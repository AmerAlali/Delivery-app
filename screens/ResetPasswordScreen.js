import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Modal, TextInput as Input } from "react-native-paper";
import { useLanguage } from "../hooks/useLanguage";
import {
  arabicFont,
  primaryColor,
  secondaryColor,
} from "../variables/themeVariables";
import LoadingOverlay from "../components/LoadingOverlay";
import axios from "axios";
import { Keyboard } from "react-native";
import { API_URL } from "@env";

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { i18n } = useLanguage();

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_URL}/ForgotPass_OTP?email=${email.replace(" ", "")}`,
        {
          headers: {
            userAgent: "CraveMobile",
          },
        }
      );
      if (response.data?.success) {
        navigation.navigate("OtpScreen", { email });
      } else if (response.data?.error) {
        Keyboard.dismiss();
        setIsModalOpen(true);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  // Validate email
  const handleEmailValidation = () => {
    if (!email) {
      setEmailError(i18n.t("noEmailError"));
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(i18n.t("validEmailError"));
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const handeLogin = async () => {
    // Check if there are any validation errors before logging in
    if (handleEmailValidation()) {
      await handleSendOtp();
    }
  };

  return (
    <View
      className=" h-full items-center pt-8  overflow-hidden tracking-wide"
      style={{ backgroundColor: primaryColor }}
    >
      <Image source={require("../assets/user-img.png")} className="h-36 w-36" />
      <View
        className="bg-[#fdfdfd] mt-6 h-full w-full p-6"
        style={{ borderTopLeftRadius: 45, borderTopRightRadius: 45 }}
      >
        <View>
          <Text className=" text-center text-2xl  font-bold text-gray-500 mb-4">
            {i18n.t("resetPassword")}
          </Text>
          <Input
            label={i18n.t("email")}
            mode="outlined"
            outlineColor="#cccc"
            textColor="gray"
            activeOutlineColor={secondaryColor}
            className="bg-white mb-3"
            theme={{ roundness: 5 }}
            value={email}
            onBlur={handleEmailValidation}
            onChangeText={setEmail}
            error={!!emailError}
          />
          {emailError ? (
            <Text className="text-red-800">{emailError}</Text>
          ) : null}

          <TouchableOpacity
            onPress={handeLogin}
            style={{ backgroundColor: primaryColor }}
            className="p-3 text-center mt-2 rounded-md"
          >
            <Text
              style={{ color: secondaryColor }}
              className="text-base text-center"
            >
              {i18n.t("continue")}
            </Text>
          </TouchableOpacity>
          {/*
            <Text className="text-red-800 mt-3 ">
              {i18n.t("wrongPasswordEmailError")}
            </Text>
          */}
        </View>
      </View>
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
              {i18n.t("emailNotFound")}
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalOpen(!isModalOpen)}
              className={`p-2 mt-4 w-full rounded-md`}
              style={{ backgroundColor: "#ffd700" }}
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

export default ResetPasswordScreen;
