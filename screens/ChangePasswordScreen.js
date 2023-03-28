import { View, Text, Image, TouchableOpacity, BackHandler } from "react-native";
import React, { useState } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
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
import { Octicons } from "@expo/vector-icons";
import { API_URL } from "@env";

const ChangePasswordScreen = () => {
  const {
    params: { email },
  } = useRoute();

  if (!email || email === undefined) {
    navigation.navigate("Home");
  }
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { i18n } = useLanguage();
  const arabicRegex = /[\u0600-\u06FF]/;

  const handeLogin = async () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChangePassword = async () => {
    if (handlePasswordValidation()) {
      await axios
        .post(
          `${API_URL}/UpdatePass`,
          {
            email: email,
            password: newPassword,
          },
          { headers: { userAgent: "CraveMobile" } }
        )
        .then((response) => {
          setIsModalOpen(true);
        });
    }
  };
  const handlePasswordValidation = () => {
    let isPasswordValid = true;
    if (!newPassword) {
      setPasswordError(i18n.t("noPasswordError"));
      isPasswordValid = false;
    } else if (newPassword.length < 6) {
      setPasswordError("Password length must be at least 6 characters");
      isPasswordValid = false;
    } else if (arabicRegex.test(newPassword)) {
      setPasswordError("Password must not be in arabic language");
      isPasswordValid = false;
    } else {
      isPasswordValid = true;
      setPasswordError("");
    }
    return isPasswordValid;
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Login");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

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
            {i18n.t("newPassword")}
          </Text>
          <Input
            label={i18n.t("newPasswordInputLabel")}
            mode="outlined"
            outlineColor="#cccc"
            textColor="gray"
            activeOutlineColor={secondaryColor}
            value={newPassword}
            secureTextEntry={true}
            error={!!passwordError}
            onChangeText={setNewPassword}
            className="bg-white mb-3"
            theme={{ roundness: 5 }}
          />
          {passwordError ? (
            <Text className="text-red-800">{passwordError}</Text>
          ) : null}
          <TouchableOpacity
            onPress={handleChangePassword}
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
        </View>
      </View>
      <Modal
        transparent={true}
        onDismiss={() => navigation.navigate("Login")}
        visible={isModalOpen}
        animationType="fade"
        style={{ marginTop: -60 }}
      >
        <View className=" flex-1 justify-center">
          <View className="bg-white items-center m-4 rounded-md p-4">
            <Octicons
              style={{
                backgroundColor: primaryColor,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 99999,
              }}
              name="check"
              size={30}
              color="black"
            />
            <Text
              className="text-lg text-center"
              style={{ fontFamily: arabicFont, color: secondaryColor }}
            >
              {i18n.t("passwordChangedSuccessfully")}
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
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

export default ChangePasswordScreen;
