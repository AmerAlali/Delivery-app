import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
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
} from "react-native-heroicons/solid";
import { selectBasketItems, selectBasketTotal } from "../features/basketSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { useState } from "react";
import LoadingOverlay from "../components/LoadingOverlay";
import { TextInput } from "react-native-paper";
import { getPaymentMethod } from "../features/paymentMethodSlice";
import { useLanguage } from "../hooks/useLanguage";
import { useRTL } from "../hooks/useRTL";
const CheckoutScreen = () => {
  const mainColor = "#000000";
  const navigation = useNavigation();
  const { i18n } = useLanguage();
  const RTL = useRTL();
  const isRTL = RTL(i18n.t("payment"));
  const basketTotal = useSelector(selectBasketTotal);
  const items = useSelector(selectBasketItems);
  const { selectedAddress } = useSelector((state) => state.selectedAddress);
  const {
    params: { restaurant },
  } = useRoute();
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const { paymentMethod } = useSelector((state) => state.paymentMethod);

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
      items
    );

    navigation.navigate("orderConfirm", { order_id });
  };
  const height = Dimensions.get("window").height;
  const mainFont = "arabic-font";

  const handlePaymentMethod = () => {
    switch (paymentMethod) {
      case "pos":
        return (
          <>
            <CreditCardIcon color={mainColor} />
            <Text className="text-base mx-2" style={{ fontFamily: mainFont }}>
              {i18n.t("posOnDelivery")}
            </Text>
          </>
        );
      case "iban":
        return (
          <>
            <DevicePhoneMobileIcon color={mainColor} />
            <Text className="text-base mx-2" style={{ fontFamily: mainFont }}>
              {i18n.t("ibanOnDelivery")}
            </Text>
          </>
        );

      default:
        return (
          <>
            <BanknotesIcon color={mainColor} />
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
                <ArrowLeftIcon size={20} color={mainColor} />
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
        <View>
          {/** Orders note **/}
          <View className="bg-white rounded-md shadow-xl m-2 p-4">
            <TextInput
              label={i18n.t("notes")}
              mode="outlined"
              outlineColor="#cccc"
              textColor="gray"
              value={note}
              onChangeText={setNote}
              activeOutlineColor={mainColor}
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
                  {i18n.t("paymentMethod")}
                </Text>
                <WalletIcon color={mainColor} />
              </View>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("PaymentSelect", { paymentMethod })
                  }
                >
                  <PencilSquareIcon color={mainColor} />
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
                <ClipboardDocumentCheckIcon color={mainColor} />
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
                <Text className="text-gray-400">₺{basketTotal}</Text>
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
                <Text className="text-gray-400">
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
                <Text className="text-gray-400">₺{discount}</Text>
              </View>
            </View>
          </View>
        </View>
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
            style={{ backgroundColor: mainColor }}
            className="p-4 rounded-xl"
          >
            <Text
              className="text-white text-center text-lg"
              style={{ fontFamily: mainFont }}
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
