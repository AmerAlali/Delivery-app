import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { TextInput as Input } from "react-native-paper";
import { useLogin } from "../hooks/useLogin";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import LoadingOverlay from "../components/LoadingOverlay";
import { useLanguage } from "../hooks/useLanguage";
import { primaryColor, secondaryColor } from "../variables/themeVariables";
import { androidClientId, iosClientId, expoClientId } from "@env";
WebBrowser.maybeCompleteAuthSession();
const LoginScreen = () => {
  const mainColor = "#000000";
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login, isLoading, error, googleLogin } = useLogin();
  const { i18n } = useLanguage();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId,
    iosClientId,
    expoClientId,
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
  const handeLogin = async () => {
    handleEmailValidation();
    handlePasswordValidation();
    // Check if there are any validation errors before logging in
    if (!emailError && !passwordError) {
      await login(email, password);
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
            {i18n.t("welcomeAgain")}
          </Text>
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
              {i18n.t("login")}
            </Text>
          </TouchableOpacity>
          {error && (
            <Text className="text-red-800 mt-3 ">
              {i18n.t("wrongPasswordEmailError")}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate("ResetPassword")}
            className="p-3 text-center"
          >
            <Text style={{ color: secondaryColor }} className="text-base">
              {i18n.t("forgotPassword")}
            </Text>
          </TouchableOpacity>
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
        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          className="text-center mt-8"
        >
          <Text>
            {i18n.t("noAccount")}
            <Text style={{ color: mainColor }} className="mr-1">
              {" "}
              {i18n.t("createAccount")}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
      {/************* Loading Overlay *************/}
      {isLoading === true && <LoadingOverlay />}
    </View>
  );
};

export default LoginScreen;
