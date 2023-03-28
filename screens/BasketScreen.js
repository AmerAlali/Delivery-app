import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBasketItems,
  selectBasketTotal,
  updateBasketItem,
} from "../features/basketSlice";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "react-native-heroicons/solid";
import { ScrollView } from "react-native";
import { removeFromBasket } from "../features/basketSlice";
import { Modal } from "react-native-paper";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
import { useLanguage } from "../hooks/useLanguage";
import { useRTL } from "../hooks/useRTL";
import {
  primaryColor,
  secondaryColor,
  arabicFont,
} from "../variables/themeVariables";

const BasketScreen = () => {
  const navigation = useNavigation();
  const { i18n } = useLanguage();
  const RTL = useRTL();
  const isRTL = RTL(i18n.t("basket"));
  const items = useSelector(selectBasketItems);
  const basketTotal = useSelector(selectBasketTotal);
  const { user } = useSelector((state) => state.user);
  const [groupedItemInBasket, setGroupedItemInBasket] = useState({});
  const dispatch = useDispatch();
  const { restaurants } = useSelector((state) => state.restaurants);
  const [restaurant, setRestaurant] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(null);

  useEffect(() => {
    const groupedItems = items.reduce((results, item) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});
    setGroupedItemInBasket(groupedItems);
    if (items.length !== 0) {
      setRestaurant(
        restaurants.find(
          (restaurant) => restaurant.id == items[0].restaurant_id
        )
      );
    }
    if (items.length === 0) {
      navigation.goBack();
    }
  }, [items]);

  const bottomSheetRef = useRef(null);

  const mainFont = "arabic-font";
  const mainColor = "#000000";
  // variables
  const snapPoints = useMemo(() => ["40%"], []);

  const handleAddingQuantity = useCallback(() => {
    setQuantity(quantity + 1);
  }, [quantity]);
  // remove quantity
  const handleRemovingQuantity = useCallback(() => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  }, [quantity]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleUpdateItem = () => {
    if (quantity === selectedItem.quantity) {
      setIsBottomSheetOpen(null);
      return;
    } else {
      setIsBottomSheetOpen(null);
      const { id } = selectedItem;
      dispatch(
        updateBasketItem({
          id,
          quantity,
        })
      );
    }
  };

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);
  const bottomSheet = useCallback(
    () =>
      isBottomSheetOpen && (
        <View style={styles.container} className={"absolute w-full h-full"}>
          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            animateOnMount={true}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            onClose={() => setIsBottomSheetOpen(null)}
          >
            <View style={styles.contentContainer}>
              <View className="flex justify-center items-center">
                <View className="mb-4 mt-4">
                  <Text className="text-lg" style={{ fontFamily: mainFont }}>
                    {selectedItem.name}
                  </Text>
                </View>
                <View className="flex-row-reverse items-center gap-2 justify-center">
                  <TouchableOpacity
                    className="p-2 rounded-full"
                    onPress={handleAddingQuantity}
                  >
                    <PlusCircleIcon color={primaryColor} size={35} />
                  </TouchableOpacity>
                  <Text className="text-3xl w-16 text-center font-bold">
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    className="p-2 rounded-full"
                    disabled={quantity === 0}
                    onPress={handleRemovingQuantity}
                  >
                    <MinusCircleIcon
                      color={quantity > 0 ? primaryColor : "gray"}
                      size={35}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  className={`${
                    isRTL ? "flex-row-reverse" : "flex-row"
                  } justify-center gap-2`}
                >
                  <Text
                    className="text-center text-gray-600 text-lg"
                    style={{ fontFamily: mainFont }}
                  >
                    {i18n.t("price")}:
                  </Text>
                  <Text
                    className="text-center text-gray-600 text-lg"
                    style={{ fontFamily: mainFont }}
                  >
                    ₺{quantity * selectedItem.price}
                  </Text>
                </View>
              </View>
              <View className="border-t mt-2 border-gray-200 p-5">
                <TouchableOpacity
                  onPress={handleUpdateItem}
                  style={{ backgroundColor: primaryColor }}
                  className={`p-4 border-t flex-row-reverse items-center justify-center border-gray-100 rounded-md`}
                >
                  <Text
                    style={{ fontFamily: arabicFont, color: secondaryColor }}
                    className=" text-lg text-center"
                  >
                    {quantity !== 0
                      ? i18n.t("update")
                      : i18n.t("deleteFromBasket")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheet>
        </View>
      ),
    [quantity, isBottomSheetOpen]
  );

  if (!restaurant) return;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-gray-100">
        <View
          className="p-5 py-8 border-b bg-white shadow-xs"
          style={{ borderColor: primaryColor }}
        >
          <View>
            <View>
              <Text className="text-lg font-bold text-center">
                {i18n.t("basket")}
              </Text>
              <Text className="text-center text-gray-400">
                {restaurant && restaurant.name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={navigation.goBack}
              className="rounded-full bg-gray-100 absolute top-3 right-5"
            >
              <XCircleIcon color={primaryColor} height={50} width={50} />
            </TouchableOpacity>
          </View>
        </View>
        {/*<View className="flex-row items-center space-x-4 px-4 py-3 bg-white my-5">
          <Image
            source={{
              uri: "https://links.papareact.com/wru",
            }}
            className="h-7 w-9 bg-gray-300 p-4 rounded-full"
          />
          <Text className="flex-1">Deliver in 50-75min</Text>
          <TouchableOpacity>
            <Text className="text-[#00ccbc]">تعديل</Text>
          </TouchableOpacity>
          </View>*/}

        <ScrollView className="mt-4">
          {Object.entries(groupedItemInBasket).map(([key, item]) => (
            <TouchableOpacity
              onPress={() => {
                setQuantity(item[0]?.quantity);
                setSelectedItem(item[0]);
                setIsBottomSheetOpen(true);
              }}
              key={key}
              className="flex-row items-center space-x-3 bg-white py-2 px-5"
            >
              <Text style={{ color: primaryColor }}>{item[0]?.quantity} x</Text>
              <Image
                source={{
                  uri: `https://cravecorner.shop/public/storage/${item[0]?.img}`,
                }}
                className="h-12 w-12 rounded-full"
              />
              <Text className="flex-1">{item[0]?.name}</Text>
              <Text className="text-gray-600">{item[0]?.price}₺</Text>

              <TouchableOpacity>
                <Text
                  className="text-xs"
                  style={{ color: primaryColor }}
                  onPress={() =>
                    dispatch(removeFromBasket({ id: parseInt(key), quantity }))
                  }
                >
                  حذف
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View className="p-5 bg-white mt-1 space-y-4">
        <View
          className={`${
            isRTL ? "flex-row-reverse" : "flex-row"
          } justify-between`}
        >
          <Text className="text-gray-400">{i18n.t("subTotal")}</Text>
          <Text className="text-gray-400">₺{basketTotal}</Text>
        </View>
        <View
          className={`${
            isRTL ? "flex-row-reverse" : "flex-row"
          } justify-between`}
        >
          <Text className="text-gray-400">{i18n.t("deliveryCost")}</Text>
          <Text className="text-gray-400">
            ₺{restaurant && restaurant.deliveryCost}
          </Text>
        </View>
        <View
          className={`${
            isRTL ? "flex-row-reverse" : "flex-row"
          } justify-between`}
        >
          <Text className="font-extrabold">{i18n.t("total")}</Text>
          <Text className="font-extrabold">
            ₺{basketTotal + parseInt(restaurant.deliveryCost)}
          </Text>
        </View>
        <View className=" bg-white">
          <TouchableOpacity
            style={{ backgroundColor: primaryColor }}
            className="p-4 rounded-xl"
            onPress={() => {
              if (user) {
                if (
                  basketTotal + parseInt(restaurant.deliveryCost) >=
                  parseInt(restaurant.deliveryLimit)
                ) {
                  navigation.navigate("Checkout", { restaurant });
                } else {
                  setIsOpen(true);
                }
              } else {
                navigation.navigate("Login");
              }
            }}
          >
            <Text
              style={{ color: secondaryColor }}
              className="text-center text-xl"
            >
              {i18n.t("confirmBasket")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        transparent={true}
        onDismiss={() => setIsOpen(!isOpen)}
        visible={isOpen}
        animationType="fade"
      >
        <View className=" flex-1 justify-center">
          <View className="bg-white m-10 rounded-md p-5">
            <Text
              className="text-center text-lg"
              style={{ fontFamily: "arabic-font" }}
            >
              عذراً يجب عليك إتمام الحد الأدنى للطلب
            </Text>
            <TouchableOpacity
              onPress={() => setIsOpen(!isOpen)}
              className="p-2 mt-2 w-full rounded-md"
              style={{ backgroundColor: mainColor }}
            >
              <Text
                className="text-center text-lg text-white"
                style={{ fontFamily: "arabic-font" }}
              >
                حسناً
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {bottomSheet()}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
});

export default BasketScreen;
