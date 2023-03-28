import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  CreditCardIcon,
  BanknotesIcon,
  XMarkIcon,
  DevicePhoneMobileIcon,
} from "react-native-heroicons/outline";
import { RadioButton } from "react-native-paper";
import { useDispatch } from "react-redux";
import { setPaymentMethod } from "../features/paymentMethodSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../hooks/useLanguage";
import { useRTL } from "../hooks/useRTL";
import { primaryColor } from "../variables/themeVariables";
const mainFont = "arabic-font";
const mainColor = "#000000";
const CustomRadioButton = ({ label, value, Icon, onPress, checked, isRTL }) => {
  return (
    <TouchableOpacity onPress={onPress} className="">
      <View
        className={`${
          isRTL ? "flex-row-reverse" : "flex-row"
        } justify-between items-center bg-gray-50 p-3`}
      >
        <View
          className={`${
            isRTL ? "flex-row" : "flex-row-reverse"
          } items-center gap-2`}
        >
          <Text style={{ fontFamily: mainFont }}>{label}</Text>
          <Icon size={24} color={checked ? primaryColor : "#000"} />
        </View>
        <RadioButton color={primaryColor} value={value} />
      </View>
    </TouchableOpacity>
  );
};
const PaymentSelectScreen = () => {
  const {
    params: { paymentMethod },
  } = useRoute();
  const { i18n } = useLanguage();

  const RTL = useRTL();
  const isRTL = RTL(i18n.t("paymentMethod"));

  const [value, setValue] = React.useState(paymentMethod);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handlePress = async (newValue) => {
    setValue(newValue);
    dispatch(setPaymentMethod(newValue));
    AsyncStorage.setItem("paymentMethod", newValue);
    navigation.goBack();
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View>
        {/*** Header ***/}
        <View
          className="flex-row justify-between shadow space-x-2 p-3 border-b border-gray-100 mb-4  bg-white"
          style={{ paddingTop: 50 }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack({ value })}
            className="shadow bg-gray-100 rounded-full p-2 mr-4"
          >
            <XMarkIcon size={20} color={mainColor} />
          </TouchableOpacity>
          <Text style={{ fontFamily: mainFont }} className="text-lg">
            {i18n.t("paymentMethod")}
          </Text>
        </View>
        {/*** Radio Buttons ***/}
        <RadioButton.Group onValueChange={setValue} value={value}>
          <CustomRadioButton
            label={i18n.t("cashOnDelivery")}
            value="cash"
            Icon={BanknotesIcon}
            onPress={() => handlePress("cash")}
            checked={value === "cash"}
            isRTL={isRTL}
          />
          <CustomRadioButton
            label={i18n.t("posOnDelivery")}
            value="pos"
            Icon={CreditCardIcon}
            onPress={() => handlePress("pos")}
            checked={value === "pos"}
            isRTL={isRTL}
          />
          <CustomRadioButton
            label={i18n.t("ibanOnDelivery")}
            value="iban"
            Icon={DevicePhoneMobileIcon}
            onPress={() => handlePress("iban")}
            checked={value === "iban"}
            isRTL={isRTL}
          />
        </RadioButton.Group>
      </View>
    </SafeAreaView>
  );
};

export default PaymentSelectScreen;
