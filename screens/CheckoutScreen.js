import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  PencilSquareIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  DevicePhoneMobileIcon,
  WalletIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import { selectBasketItems, selectBasketTotal } from "../features/basketSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { useState } from "react";
import { TextInput } from "react-native-paper";
import { getPaymentMethod } from "../features/paymentMethodSlice";
import { useLanguage } from "../hooks/useLanguage";
import { useRTL } from "../hooks/useRTL";
import {
  arabicFont,
  primaryColor,
  secondaryColor,
} from "../variables/themeVariables";
import { Ionicons } from "@expo/vector-icons";
import { setVoucherDiscount } from "../features/voucherSlice";
const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { i18n } = useLanguage();
  const RTL = useRTL();
  const isRTL = RTL(i18n.t("payment"));
  const basketTotal = useSelector(selectBasketTotal);
  const items = useSelector(selectBasketItems);
  const { selectedAddress } = useSelector((state) => state.selectedAddress);
  const { voucherDiscount } = useSelector((state) => state.voucherDiscount);
  const {
    params: { restaurant },
  } = useRoute();
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const { paymentMethod } = useSelector((state) => state.paymentMethod);

  useEffect(() => {
    if (voucherDiscount !== null) {
      setDiscount(voucherDiscount?.discount);
    }
  }, [voucherDiscount]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPaymentMethod());
  }, [dispatch]);

  const formatedAddress = () => {
    return (
      selectedAddress.city +
      ", " +
      selectedAddress.district +
      ", " +
      selectedAddress.neighborhood +
      ", " +
      selectedAddress.street +
      ", Adi: " +
      selectedAddress.buildingName +
      ", No: " +
      selectedAddress.building_no +
      ", Kat: " +
      selectedAddress.floor +
      ", Daire: " +
      selectedAddress.apartment_no
    );
  };
  const { createOrder, isLoading } = useCreateOrder();
  const createNewOrder = async () => {
    const order_id = await createOrder(
      restaurant.id,
      formatedAddress(),
      paymentMethod,
      note,
      basketTotal,
      discount,
      restaurant.deliveryCost,
      items,
      voucherDiscount?.voucher,
      selectedAddress?.phone
    );
    dispatch(setVoucherDiscount(null));
    navigation.navigate("orderConfirm", { order_id });
  };
  const height = Dimensions.get("window").height;
  const mainFont = "arabic-font";

  const handlePaymentMethod = () => {
    switch (paymentMethod) {
      case "pos":
        return (
          <>
            <CreditCardIcon color={primaryColor} />
            <Text className="text-base mx-2" style={{ fontFamily: mainFont }}>
              {i18n.t("posOnDelivery")}
            </Text>
          </>
        );
      case "iban":
        return (
          <>
            <DevicePhoneMobileIcon color={primaryColor} />
            <Text className="text-base mx-2" style={{ fontFamily: mainFont }}>
              {i18n.t("ibanOnDelivery")}
            </Text>
          </>
        );

      default:
        return (
          <>
            <BanknotesIcon color={primaryColor} />
            <Text className="text-base mx-2" style={{ fontFamily: mainFont }}>
              {i18n.t("cashOnDelivery")}
            </Text>
          </>
        );
    }
  };
  return (
    <SafeAreaView style={{ height }}>
      <View className="flex-1 bg-gray-100">
        <View>
          <View
            className="flex-row justify-between space-x-2 p-3  bg-white"
            style={{ paddingTop: 50 }}
          >
            <View>
              <TouchableOpacity
                onPress={navigation.goBack}
                className="shadow bg-gray-100 rounded-full p-2 mr-4"
              >
                <ArrowLeftIcon size={20} color={primaryColor} />
              </TouchableOpacity>
            </View>
            <View>
              <Text className="text-xl" style={{ fontFamily: mainFont }}>
                {i18n.t("payment")}
              </Text>
            </View>
          </View>
        </View>
        {/* body start */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/** Orders note **/}
          <View className="bg-white rounded-md shadow-xl m-2 p-4">
            <TextInput
              label={i18n.t("notes")}
              mode="outlined"
              outlineColor="#cccc"
              textColor="gray"
              value={note}
              onChangeText={setNote}
              activeOutlineColor={secondaryColor}
              className="bg-white mb-3"
              style={{
                textAlign: "right",
              }}
              theme={{
                roundness: 5,
              }}
              multiline={true}
            />
          </View>
          <View className="shadow-xl bg-white m-2 rounded-md p-4">
            {/** Payment Method **/}
            <View
              className={`${
                isRTL ? "flex-row-reverse" : "flex-row"
              } justify-between items-center`}
            >
              <View
                className={`${
                  isRTL ? "flex-row" : "flex-row-reverse"
                }  items-center`}
              >
                <Text
                  className="mr-2 text-lg ml-2 "
                  style={{ fontFamily: mainFont }}
                >
                  {i18n.t("deliveryAddress")}
                </Text>
                <MapPinIcon color={primaryColor} />
              </View>
              {/*<View>
                <TouchableOpacity>
                  <PencilSquareIcon color={primaryColor} />
                </TouchableOpacity>
              </View>*/}
            </View>
            <View
              className={`mt-2 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              } items-center`}
            >
              <Text
                style={{ color: primaryColor }}
                className="text-lg mr-3 ml-1 capitalize"
              >
                {selectedAddress?.label}
              </Text>
              <Text className="text-gray-500 w-72">{formatedAddress()}</Text>
            </View>
          </View>
          <View className="shadow-xl bg-white m-2 rounded-md p-4">
            {/** Payment Method **/}
            <View
              className={`${
                isRTL ? "flex-row-reverse" : "flex-row"
              } justify-between items-center`}
            >
              <View
                className={`${
                  isRTL ? "flex-row" : "flex-row-reverse"
                }  items-center`}
              >
                <Text
                  className="mr-2 text-lg ml-2 "
                  style={{ fontFamily: mainFont }}
                >
                  {i18n.t("paymentMethod")}
                </Text>
                <WalletIcon color={primaryColor} />
              </View>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("PaymentSelect", { paymentMethod })
                  }
                >
                  <PencilSquareIcon color={primaryColor} />
                </TouchableOpacity>
              </View>
            </View>
            <View
              className={`mt-2 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              } items-center`}
            >
              {handlePaymentMethod()}
            </View>
          </View>
          {/** Order summary **/}
          <View>
            <View className="p-4 m-2 rounded-md bg-white mt-1 space-y-4">
              <View
                className={`${
                  isRTL ? "flex-row-reverse" : "flex-row"
                } border-b pb-2 border-gray-200 gap-1 items-center `}
              >
                <ClipboardDocumentCheckIcon color={primaryColor} />
                <Text className="text-base" style={{ fontFamily: mainFont }}>
                  {i18n.t("orderSummary")}
                </Text>
              </View>
              <View
                className={`${
                  isRTL ? "flex-row-reverse" : "flex-row"
                } justify-between`}
              >
                <Text
                  className="text-gray-400"
                  style={{ fontFamily: mainFont }}
                >
                  {i18n.t("subTotal")}
                </Text>
                <Text className="text-gray-400 px-2">₺{basketTotal}</Text>
              </View>
              <View
                className={`${
                  isRTL ? "flex-row-reverse" : "flex-row"
                } justify-between`}
              >
                <Text
                  className="text-gray-400"
                  style={{ fontFamily: mainFont }}
                >
                  {i18n.t("deliveryCost")}
                </Text>
                <Text className="text-gray-400 px-2">
                  ₺{restaurant.deliveryCost}
                </Text>
              </View>
              <View
                className={`${
                  isRTL ? "flex-row-reverse" : "flex-row"
                } justify-between`}
              >
                <Text
                  className="text-gray-400"
                  style={{ fontFamily: mainFont }}
                >
                  {i18n.t("discount")}
                </Text>
                <Text
                  style={{
                    backgroundColor: discount !== 0 ? primaryColor : "white",
                    color: discount !== 0 ? secondaryColor : "gray",
                  }}
                  className="text-gray-400 px-2 rounded-xl"
                >
                  ₺{discount}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Voucher")}
                  className="flex-row gap-2"
                >
                  <Ionicons name="pricetags-outline" size={20} color="black" />
                  <Text style={{ color: secondaryColor }}>
                    Kopun Kodu Girinz
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        {/* body end */}
      </View>
      <View className="p-5 bg-white mt-1 space-y-4">
        <View
          className={`${
            isRTL ? "flex-row-reverse" : "flex-row"
          } justify-between`}
        >
          <Text style={{ fontFamily: mainFont }}>{i18n.t("total")}</Text>
          <Text className="font-extrabold">
            ₺{basketTotal + parseInt(restaurant.deliveryCost) - discount}
          </Text>
        </View>
        <View className=" bg-white">
          <TouchableOpacity
            onPress={createNewOrder}
            disabled={isLoading}
            style={{ backgroundColor: primaryColor }}
            className="p-4 rounded-xl"
          >
            <Text
              className="text-center text-lg"
              style={{ fontFamily: arabicFont, color: secondaryColor }}
            >
              {i18n.t("createOrder")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
