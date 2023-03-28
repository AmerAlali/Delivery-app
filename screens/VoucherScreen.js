import { View, Text, Keyboard } from "react-native";
import React, { useState } from "react";
import {
  arabicFont,
  primaryColor,
  secondaryColor,
} from "../variables/themeVariables";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../hooks/useLanguage";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { TouchableOpacity } from "react-native";
import { Modal, TextInput } from "react-native-paper";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setVoucherDiscount } from "../features/voucherSlice";

const VoucherScreen = () => {
  const navigation = useNavigation();
  const { i18n } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [VoucherText, setVoucherText] = useState("");
  const { user } = useSelector((state) => state.user);
  const { voucherDiscount } = useSelector((state) => state.voucherDiscount);
  const [errorMessage, setErrorMessage] = useState("");

  const handleValidateVoucher = async () => {
    console.log(voucherDiscount?.voucher);
    /*if (voucherDiscount?.voucher === VoucherText.replace(" ", "")) {
      Keyboard.dismiss();
      setErrorMessage(i18n.t("voucherAlreadyUsed"));
      setIsModalOpen(true);
      return;
    }*/
    try {
      console.log(user.token);
      Keyboard.dismiss();
      if (VoucherText.replace(" ", "").length >= 1) {
        const response = await axios.get(
          `https://cravecorner.shop/api/validate_voucher?voucher=${VoucherText.replace(
            " ",
            ""
          )}&token=${user.token}`,
          { headers: { userAgent: "CraveMobile" } }
        );
        if (response.data?.discount) {
          dispatch(
            setVoucherDiscount({
              discount: response.data?.discount,
              voucher: VoucherText,
            })
          );
          navigation.goBack();
        } else if (response.data?.used) {
          setErrorMessage(i18n.t("voucherAlreadyUsed"));
          setIsModalOpen(true);
        } else {
          setErrorMessage(i18n.t("VoucherNotValid"));
          setIsModalOpen(true);
        }
      }
    } catch (error) {
      setErrorMessage(i18n.t("VoucherNotValid"));
      setIsModalOpen(true);
    }
  };

  return (
    <View className="flex-1 pt-7 bg-white">
      {/********** Header **********/}
      <View className="p-5 py-4 border-b border-[#d8dad9] bg-white shadow-xs">
        <View className=" flex-row-reverse justify-between items-center">
          <View>
            <Text
              style={{ fontFamily: arabicFont }}
              className="text-lg text-center"
            >
              {i18n.t("Voucher")}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={navigation.goBack}
              className="shadow bg-gray-100 rounded-full p-2 mr-4"
            >
              <ArrowLeftIcon size={20} color={primaryColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/********** Voucher Input **********/}
      <View className="bg-gray-50 flex-1">
        <View className="bg-white p-4 m-2 shadow rounded-lg">
          <TextInput
            label={i18n.t("Voucher")}
            mode="outlined"
            outlineColor="#cccc"
            textColor="gray"
            value={VoucherText}
            onChangeText={setVoucherText}
            activeOutlineColor={secondaryColor}
            className="bg-white mb-3"
            theme={{
              roundness: 5,
            }}
          />
          <TouchableOpacity
            onPress={handleValidateVoucher}
            className={`p-2 mt-2 w-full rounded-md`}
            style={{ backgroundColor: primaryColor }}
          >
            <Text
              className="text-center text-lg text-gray-900"
              style={{ fontFamily: arabicFont }}
            >
              {i18n.t("applyVoucher")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/********** Voucher Error **********/}
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
              className="text-lg"
              style={{ fontFamily: arabicFont, color: secondaryColor }}
            >
              {errorMessage}
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalOpen(!isModalOpen)}
              className={`p-2 mt-4 w-full rounded-md`}
              style={{ backgroundColor: "#ffd700" }}
            >
              <Text
                className="text-center text-lg text-gray-900"
                style={{ fontFamily: "arabic-font" }}
              >
                {i18n.t("cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VoucherScreen;
