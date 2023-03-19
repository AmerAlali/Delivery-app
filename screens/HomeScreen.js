import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from "react-native";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  UserIcon,
  PlusIcon,
  Bars3BottomRightIcon,
} from "react-native-heroicons/outline";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import axios from "axios";

import Categories from "../components/Categories";
import FeaturedRow from "../components/FeaturedRow";
import HomeScreenSkeleton from "../components/HomeScreenSkeleton";
import SearchRestaurantCard from "../components/SearchRestaurantCard";
import SelectAddress from "../components/SelectAddress";

import { getNeighborhoodID } from "../features/neighborhoodSlice";
import { setLoading } from "../features/skeletonSlice";
import { getSelectedAddress } from "../features/selectedAddressSlice";
import { setRestaurants } from "../features/restaurantsSlice";
import { getUserToken } from "../features/userSlice";
import { useAddress } from "../hooks/useAddress";
import { setVisible } from "../features/bottomSheetSlice";
import { clearBasketItems, getBasketItems } from "../features/basketSlice";
import StarRating from "react-native-star-rating-widget";
import { Modal } from "react-native-paper";
import { useLanguage } from "../hooks/useLanguage";

const HomeScreen = () => {
  const { i18n } = useLanguage();
  const navigation = useNavigation();
  // main font and main color
  const mainFont = "arabic-font";
  const mainColor = "black";
  // states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [rating, setRating] = useState({
    foodTaste: 0,
    deliverySpeed: 0,
    services: 0,
  });

  //redux selectors
  const { user } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.loading);
  const { restaurants } = useSelector((state) => state.restaurants);
  const { neighborhoodID } = useSelector((state) => state.neighborhoodID);
  const { selectedAddress } = useSelector((state) => state.selectedAddress);
  const { visible } = useSelector((state) => state.bottomSheet);
  const { addresses } = useSelector((state) => state.addresses);
  const items = useSelector((state) => state.basket.items);

  //get the stored information from the Async Storage
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserToken());
    dispatch(getNeighborhoodID());
    dispatch(getSelectedAddress());
    dispatch(getBasketItems());
  }, [dispatch]);

  // fetch addresses
  const fetchAddresses = useAddress();
  useEffect(() => {
    if (!addresses && user) {
      fetchAddresses(user);
    }
  }, [user]);

  // fetch restaurants
  const fetchRestaurants = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://cravecorner.shop/api/showRestaurants?neigh_id=${neighborhoodID[0]}`,
        {
          headers: {
            userAgent: "CraveMobile",
          },
        }
      );
      dispatch(setRestaurants(response.data));
    } catch (error) {
      dispatch(setRestaurants(null));
    } finally {
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 500);
    }
  }, [neighborhoodID]);

  // check if neighborhoodID dosen't equal null to fetch the restaurants
  useEffect(() => {
    if (neighborhoodID !== null) {
      dispatch(setLoading(true));
      fetchRestaurants();
    }
  }, [neighborhoodID]);

  //if there items in the basket check if there's a restauarnt with the active basket items, and check if the activity of the restaurant
  useEffect(() => {
    if (items.length !== 0 && restaurants !== null) {
      const activeRestaurant = restaurants.find(
        (restaurant) => restaurant.id === items[0].restaurant_id
      );
      if (activeRestaurant === undefined) {
        dispatch(clearBasketItems());
      } else if (activeRestaurant.activity === false) {
        dispatch(clearBasketItems());
      }
    }
  }, [restaurants]);

  // bottom sheet
  const bottomSheetRef = useRef(null);
  // bottom sheet backdrop
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
  // bottom sheet snappoints
  const snapPoints = useMemo(() => ["25%", "50", "80%"], []);

  // handle opening the bottom sheet
  const handleBottomSheetOpen = () => {
    if (user !== null) {
      bottomSheetRef.current?.expand();
      dispatch(setVisible(true));
    }
  };
  // handle closing the bottom sheet
  const handleCloseBottomSheet = useCallback(() => {
    dispatch(setVisible(false));
  }, []);

  // review functions
  const handleCheckingLastOrder = async () => {
    const response = await axios.get(
      `https://cravecorner.shop/api/lastOrder?token=${user.token}`
    );
    if (response.data !== "null") {
      setIsReviewModalOpen(true);
      setLastOrder(response.data);
    } else {
      return;
    }
  };
  // Function to update any property of the rating object
  const handleRatingChange = (name, value) => {
    setRating((prevState) => ({ ...prevState, [name]: parseInt(value) }));
  };
  useEffect(() => {
    if (user !== null && loading === false) {
      handleCheckingLastOrder();
    }
  }, [user, loading]);
  const handleSendingReview = () => {
    axios.post("https://cravecorner.shop/api/storeReview", {
      token: user.token,
      taste: rating.foodTaste * 2,
      order_id: lastOrder.order_id,
      service: rating.services * 2,
      delivery: rating.deliverySpeed * 2,
    });
    setLastOrder(null);
    setIsReviewModalOpen(false);
    handleRatingChange("foodTaste", 0);
    handleRatingChange("deliverySpeed", 0);
    handleRatingChange("services", 0);
  };

  // prevent the user to go back to find addresses page
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <SafeAreaView className="bg-white pt-5">
      {/* HEADER */}
      <View className="flex-row pb-3 item-center mx-4 space-x-2">
        <Image
          source={{ uri: "https://links.papareact.com/wru" }}
          className="h-7 w-7 bg-gray-300 p-4 rounded-full"
        />
        <View className="flex-1">
          <Text className="font-bold text-gray-400">
            {i18n.t("deliverNow")}
          </Text>
          <TouchableOpacity
            disabled={loading}
            className=" "
            onPress={handleBottomSheetOpen}
          >
            {selectedAddress ? (
              <View className=" w-60">
                <Text className="font-bold capitalize text-lg">
                  {selectedAddress.label ? selectedAddress.label : "Ev"}
                </Text>
                <View className="flex-row">
                  <Text className="text-gray-500 capitalize">
                    {selectedAddress.neighborhood}, {selectedAddress.street},{" "}
                    {selectedAddress.building_no}
                  </Text>
                  <ChevronDownIcon size={22} color={mainColor} />
                </View>
              </View>
            ) : (
              <View className="flex-row mt-3">
                <Text style={{ fontFamily: mainFont }} className="text-base">
                  {i18n.t("addressPlaceholder")}
                </Text>
                <ChevronDownIcon size={22} color={mainColor} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          disabled={loading}
          onPress={() => {
            navigation.openDrawer();
          }}
        >
          <Bars3BottomRightIcon size={35} color={mainColor} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="flex-row items-center space-x-2 pb-2 mx-4">
        <View
          className="flex-row items-center space-x-2 flex-1 bg-gray-200 rounded-3xl p-3"
          style={{ direction: "rtl" }}
        >
          <MagnifyingGlassIcon color="gray" size={20} />
          <TextInput
            placeholder={i18n.t("searchPlaceholder")}
            keyboardType="default"
            style={{
              flex: 1,
              direction: "rtl",
              marginRight: 10,
              fontFamily: mainFont,
            }}
            onFocus={() => {
              loading === false &&
                navigation.navigate("Search", { restaurants });
            }}
          />
        </View>
      </View>

      {/* Body */}
      {loading === true && <HomeScreenSkeleton />}
      <View className="h-full">
        {restaurants && restaurants.length !== 0 && (
          <ScrollView className="bg-gray-100">
            <View className="pb-36">
              {/* Categories */}
              <Categories restaurants={restaurants} />

              {restaurants && (
                <FeaturedRow
                  title={i18n.t("popular")}
                  key={1}
                  id={1}
                  restaurants={restaurants.slice(0, 8)}
                />
              )}
              {restaurants && (
                <FeaturedRow
                  title={i18n.t("discounted")}
                  key={2}
                  id={2}
                  restaurants={restaurants.filter(
                    (res) => res.isdiscounted === "true"
                  )}
                />
              )}
              <View className="p-3 mb-44 mt-2">
                <Text
                  style={{ fontFamily: mainFont }}
                  className="text-xl font-semibold mb-2"
                >
                  {i18n.t("allRestaurants")}
                </Text>
                {restaurants &&
                  restaurants.map((restaurant) => {
                    return (
                      <SearchRestaurantCard
                        key={restaurant.id}
                        id={restaurant.id}
                        imgUrl={
                          restaurant.image
                            ? `https://cravecorner.shop/public/storage/${restaurant.image}`
                            : "https://img.freepik.com/premium-vector/spoon-plate-icon-logo-template-vector-illustration_757387-417.jpg?w=826"
                        }
                        title={restaurant.name}
                        rating={restaurant.rating}
                        adress={restaurant.neighborhood}
                        activity={restaurant.activity}
                        res_keywords={restaurant.res_keywords}
                        isdiscounted={restaurant.isdiscounted}
                        mind_time={restaurant.mind_time}
                        maxDeliveryTime={restaurant.maxd_time}
                        reviews={restaurant.reviews}
                        deliveryLimit={restaurant.deliveryLimit}
                        deliveryCost={restaurant.deliveryCost}
                      />
                    );
                  })}
              </View>
            </View>
          </ScrollView>
        )}
        {loading === false && !restaurants ? (
          <View className="flex mt-20 items-center">
            <Image
              source={require("../assets/world.png")}
              className="h-44 w-44"
            />
            <Text
              style={{ fontFamily: mainFont }}
              className="text-center text-lg text-gray-700 "
            >
              عذراً نحن لم نصل إلى هنا بعد
            </Text>
            <Text
              style={{ fontFamily: mainFont, color: mainColor }}
              className="text-center text-lg "
            >
              ولكننا نعمل على الوصول إلى جميع المناطق
            </Text>
          </View>
        ) : null}
      </View>
      {/* Bottom Sheet modal */}
      {visible && (
        <View
          className={
            "absolute w-full h-full top-0 bottom-0 left-0 right-0 z-50"
          }
        >
          <BottomSheet
            ref={bottomSheetRef}
            backdropComponent={renderBackdrop}
            animateOnMount={true}
            index={1}
            snapPoints={snapPoints}
            onClose={handleCloseBottomSheet}
            enablePanDownToClose={true}
          >
            <BottomSheetScrollView showsVerticalScrollIndicator={false}>
              <View className=" pb-36">
                <TouchableOpacity
                  onPress={() => navigation.navigate("addAddress")}
                  className="px-6 py-4 flex-row items-center justify-end gap-4"
                >
                  <Text
                    style={{ fontFamily: mainFont }}
                    className={`text-[${mainColor}] text-base`}
                  >
                    {i18n.t("addNewAddress")}
                  </Text>
                  <PlusIcon size={22} color={mainColor} />
                </TouchableOpacity>
                <SelectAddress />
                <Text> </Text>
              </View>
            </BottomSheetScrollView>
          </BottomSheet>
        </View>
      )}
      {/** Review Modal **/}
      {lastOrder && loading === false && (
        <Modal
          transparent={true}
          onDismiss={() => setIsReviewModalOpen(!isReviewModalOpen)}
          visible={isReviewModalOpen}
          animationType="fade"
          style={{ marginTop: -120 }}
        >
          <View className=" flex-1 justify-center">
            <View className="bg-white m-4 rounded-md p-4">
              <Text
                className="text-center text-lg"
                style={{ fontFamily: mainFont }}
              >
                قيم طلبك من {lastOrder.restaurant_title}
              </Text>
              <View className="mt-2  items-center">
                <Text style={{ fontFamily: mainFont }} className="text-base">
                  لذة الطعام
                </Text>
                <StarRating
                  rating={rating.foodTaste}
                  color={mainColor}
                  starSize={45}
                  onChange={(value) => handleRatingChange("foodTaste", value)}
                />
              </View>
              <View className="mt-3 items-center">
                <Text style={{ fontFamily: mainFont }} className="text-base ">
                  سرعة التوصيل
                </Text>
                <StarRating
                  rating={rating.deliverySpeed}
                  color={mainColor}
                  starSize={45}
                  onChange={(value) =>
                    handleRatingChange("deliverySpeed", value)
                  }
                />
              </View>
              <View className="mt-3  items-center">
                <Text style={{ fontFamily: mainFont }} className="text-base">
                  الخدمات
                </Text>
                <StarRating
                  rating={rating.services}
                  color={mainColor}
                  starSize={45}
                  onChange={(value) => handleRatingChange("services", value)}
                />
              </View>
              <TouchableOpacity
                disabled={
                  rating.deliverySpeed === 0 ||
                  rating.foodTaste === 0 ||
                  rating.services === 0
                }
                onPress={() => handleSendingReview()}
                className={`p-2 mt-4 bg-[mainColor] w-full rounded-md`}
              >
                <Text
                  className="text-center text-lg text-white"
                  style={{ fontFamily: "arabic-font" }}
                >
                  قيم
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
