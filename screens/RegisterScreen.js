import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput as Input } from "react-native-paper";
import { useRegister } from "../hooks/useRegister";
import { useLanguage } from "../hooks/useLanguage";
import { primaryColor, secondaryColor } from "../variables/themeVariables";
import * as Google from "expo-auth-session/providers/google";
import LoadingOverlay from "../components/LoadingOverlay";

const RegisterScreen = () => {
  const { i18n } = useLanguage();
  const mainColor = "#000000";
  const [email, setEmail] = useState("");
  const [fullname, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullnameError, setFullnameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { Register, error, isLoading, googleLogin } = useRegister();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "539381058338-lh30c6ss38ij22bu5uiu9igdkup7ttdv.apps.googleusercontent.com",
    iosClientId:
      "539381058338-lhdjhiousmq14og0rnq89mn4juglnibe.apps.googleusercontent.com",
    expoClientId: "",
  });

  useEffect(() => {
    const handleGoogleLogin = async () => {
      if (response?.type === "success") {
        await googleLogin(response.authentication.idToken);
      }
    };
    handleGoogleLogin();
  }, [response]);

  // Validate email
  const handleEmailValidation = () => {
    if (!email) {
      setEmailError(i18n.t("noEmailError"));
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(i18n.t("validEmailError"));
    } else {
      setEmailError("");
    }
  };
  // Validate password

  const handlePasswordValidation = () => {
    if (!password) {
      setPasswordError(i18n.t("noPasswordError"));
    } else {
      setPasswordError("");
    }
  };
  // Validate Phone number
  const handlePhoneValidation = () => {
    if (!phone) {
      setPhoneError(i18n.t("noPhoneNumberError"));
    } else if (!/^([+]90|0)?(5\d{9})$/.test(phone)) {
      setPhoneError(i18n.t("validPhoneNumberError"));
    } else {
      setPhoneError("");
    }
  };

  const handleFullnameValidation = () => {
    if (!fullname) {
      setFullnameError(i18n.t("noFullnameError"));
    } else if (/[\u0600-\u06FF]/.test(fullname)) {
      setFullnameError(i18n.t("arabicFullnameError"));
    } else {
      setFullnameError("");
    }
  };

  const handeLogin = async () => {
    handleEmailValidation();
    handlePasswordValidation();
    handlePhoneValidation();
    handleFullnameValidation();
    // Check if there are any validation errors before logging in
    if (!emailError && !passwordError && !phoneError && !fullnameError) {
      await Register(fullname, email, phone, password);
    }
  };

  return (
    <View
      className="h-full items-center pt-8  overflow-hidden tracking-wide"
      style={{ backgroundColor: primaryColor }}
    >
      <Image source={require("../assets/user-img.png")} className="h-36 w-36" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="bg-[#fdfdfd] mt-6 h-full w-full p-6"
        style={{ borderTopLeftRadius: 45, borderTopRightRadius: 45 }}
      >
        <View>
          <Text className=" text-center text-2xl  font-bold text-gray-500 mb-4">
            {i18n.t("createAccount")}
          </Text>
          <Input
            label={i18n.t("fullname")}
            mode="outlined"
            outlineColor="#cccc"
            textColor="gray"
            activeOutlineColor={mainColor}
            className="bg-white mb-3"
            theme={{ roundness: 5 }}
            value={fullname}
            onBlur={handleFullnameValidation}
            onChangeText={setFullName}
            error={!!fullnameError}
          />
          {fullnameError ? (
            <Text className="text-red-800">{fullnameError}</Text>
          ) : null}
          <Input
            label={i18n.t("email")}
            mode="outlined"
            outlineColor="#cccc"
            textColor="gray"
            activeOutlineColor={mainColor}
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
          <Input
            label={i18n.t("phoneNumber")}
            mode="outlined"
            outlineColor="#cccc"
            textColor="gray"
            activeOutlineColor={mainColor}
            className="bg-white mb-3"
            theme={{ roundness: 5 }}
            value={phone}
            keyboardType="phone-pad"
            onBlur={handlePhoneValidation}
            onChangeText={setPhone}
            error={!!phoneError}
          />
          {phoneError ? (
            <Text className="text-red-800">{phoneError}</Text>
          ) : null}
          <Input
            label={i18n.t("password")}
            mode="outlined"
            secureTextEntry={true}
            theme={{ roundness: 5 }}
            outlineColor="#cccc"
            textColor="gray"
            error={!!passwordError}
            activeOutlineColor={mainColor}
            className="bg-white mb-3"
            value={password}
            focusable={true}
            onBlur={handlePasswordValidation}
            onChangeText={setPassword}
          />
          {passwordError ? (
            <Text className="text-red-800">{passwordError}</Text>
          ) : null}

          <TouchableOpacity
            onPress={handeLogin}
            disabled={isLoading}
            style={{ backgroundColor: primaryColor }}
            className="p-3 text-center mt-2 rounded-md"
          >
            <Text
              style={{ color: secondaryColor }}
              className="text-base text-center"
            >
              {i18n.t("createAccount")}
            </Text>
          </TouchableOpacity>
          {error && <Text className="text-red-500 mt-3 ">{error}</Text>}
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center" }}
          className="mt-3"
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "#cccc",
              opacity: 1,
            }}
          />
          <View>
            <Text style={{ width: 50, textAlign: "center", color: "#cccc" }}>
              {i18n.t("or")}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "#cccc",
              opacity: 1,
            }}
          />
        </View>
        <View className="mt-4 flex-row items-center justify-center space-x-4">
          <TouchableOpacity
            disabled={!request}
            onPress={() => promptAsync()}
            className="p-3 flex-row items-center justify-around bg-[#f8f8f8] space-x-3 w-full rounded-md shadow"
          >
            <Image
              source={require("../assets/google.png")}
              className="h-8 w-8"
            />
            <Text className="pr-12 text-base">Continue With Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/************* Loading Overlay *************/}
      {isLoading === true && <LoadingOverlay />}
    </View>
  );
};

export default RegisterScreen;
