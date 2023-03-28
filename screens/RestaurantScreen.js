import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon, StarIcon } from "react-native-heroicons/solid";
import axios from "axios";
import BasketIcon from "../components/BasketIcon";
import RestaurantCategories from "../components/RestaurantCategories";
import { MotiView } from "moti";
import RestaurantDishesSkeleton from "../components/RestaurantDishesSkeleton";
import * as Animatable from "react-native-animatable";
import { SharedElement } from "react-navigation-shared-element";
import { primaryColor, secondaryColor } from "../variables/themeVariables";
const mainFont = "arabic-font";
const RestaurantScreen = () => {
  const navigation = useNavigation();
  const [restaurantCategories, setRestaurantCategories] = useState(null);
  const [sectionHeights, setSectionHeights] = useState([]);
  const [flatListHeaderHeight, setFlatListHeaderHeight] = useState(null);
  const [loading, setIsLoading] = useState(null);

  const {
    params: {
      id,
      imgUrl,
      title,
      rating,
      res_keywords,
      deliveryLimit,
      deliveryCost,
      mind_time,
      maxDeliveryTime,
      CategoryName,
      Rev_service,
      Rev_delivery,
      Rev_taste,
    },
  } = useRoute();

  useEffect(() => {
    try {
      setIsLoading(true);
      axios
        .get(
          `https://cravecorner.shop/api/restaurantCategories?restaruant_id=${id}`,
          {
            headers: {
              userAgent: "CraveMobile",
            },
          }
        )
        .then((response) => {
          setRestaurantCategories(response.data);
          setIsLoading(null);
        });
    } catch (error) {
      setIsLoading(null);
    }
  }, []);
  const flatListRef = useRef(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const scrollToCategory = (index) => {
    if (index >= 0) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewOffset: flatListHeaderHeight - 120,
      });
    }
  };

  const [scrollY] = useState(new Animated.Value(0));

  const handleScroll = useCallback(
    (event) => {
      const scrollOffset = event.nativeEvent.contentOffset.y;
      scrollY.setValue(scrollOffset);
      const offsetY =
        event.nativeEvent.contentOffset.y - (flatListHeaderHeight - 160);
      let sectionIndex = 0;
      let totalHeight = 0;
      // Find the index of the section that the user has scrolled to
      for (let i = 0; i < sectionHeights.length; i++) {
        totalHeight += sectionHeights[i];
        if (offsetY < totalHeight) {
          sectionIndex = i;
          break;
        }
      }
      setActiveTabIndex(sectionIndex);
    },
    [sectionHeights, scrollY]
  );
  const headerOpacity = scrollY.interpolate({
    inputRange: [180, 190],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const tabsOpacity = scrollY.interpolate({
    inputRange: [240, 250],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const handleSectionLayout = (event, index) => {
    const { height } = event.nativeEvent.layout;
    // Update the section height array
    setSectionHeights((prevState) => {
      const newState = [...prevState];
      newState[index] = height;
      return newState;
    });
  };

  const tabsRef = useRef(null);
  React.useEffect(() => {
    if (!restaurantCategories || restaurantCategories.length === 0) {
      return;
    }

    let index = activeTabIndex;
    if (activeTabIndex >= restaurantCategories.length) {
      index = restaurantCategories.length - 1;
    }

    tabsRef.current?.scrollToIndex({
      index: index,
      animated: true,
      viewPosition: 0.5,
    });
  }, [activeTabIndex, restaurantCategories]);
  const flatListHeader = () => {
    return (
      <View
        onLayout={(e) => setFlatListHeaderHeight(e.nativeEvent.layout.height)}
      >
        <SharedElement
          id={`restaurant.${id}.image.${CategoryName}`}
          waitFor={[`restaurant.${id}.image.${CategoryName}`]}
          className="relative"
        >
          <Image
            source={{ uri: imgUrl }}
            className="w-full h-52"
            style={{ resizeMode: "cover" }}
          />
        </SharedElement>
        <Animatable.View
          animation="fadeInLeft"
          useNativeDriver={true}
          delay={800}
          duration={500}
          easing="ease-in-out"
          className="bg-white border border-gray-200 -mt-20 ml-2 mr-2 rounded-md shadow-xl shadow-gray-400"
        >
          <View className="px-4 pt-6">
            <View className="flex-row justify-between  items-center">
              <Text className="text-3xl font-bold ">{title}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Reviews", {
                    id,
                    imgUrl,
                    title,
                    rating,
                    Rev_service,
                    Rev_delivery,
                    Rev_taste,
                  })
                }
                className="flex-row px-2 py-1 rounded-full items-center space-x-1"
                style={{ backgroundColor: primaryColor }}
              >
                <StarIcon color="#434340" opacity={1} size={22} />
                <Text className="text-sm ">
                  <Text style={{ color: "#434340" }}>{rating}</Text>
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row space-x-2 my-1">
              <View className="flex-row items-center space-x-1"></View>
            </View>
            <View>
              <Text
                style={{ fontFamily: mainFont }}
                className="text-black mb-1"
              >
                {res_keywords && res_keywords.map((keyword) => keyword + " . ")}
              </Text>
            </View>
            <View className="flex-row gap-6 pb-3">
              <View className="space-y-2 items-center">
                <Text>₺{deliveryLimit}</Text>
                <Text className="text-gray-500 text-xs">Min</Text>
              </View>
              <View className="space-y-2 items-center">
                <Text>₺{deliveryCost}</Text>
                <Text className="text-gray-500 text-xs">Delivery</Text>
              </View>
              <View className="space-y-2 items-center">
                <Text>{mind_time + " - " + maxDeliveryTime + " dk"}</Text>
                <Text className="text-gray-500 text-xs">Delivery Time</Text>
              </View>
            </View>
          </View>
        </Animatable.View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      {!loading && <BasketIcon />}
      <Animatable.View
        animation="fadeInLeft"
        useNativeDriver={true}
        delay={800}
        duration={500}
        easing="ease-in-out"
        className="absolute top-14 left-5 z-10 bg-gray-100 rounded-full"
      >
        <TouchableOpacity onPress={navigation.goBack} className="p-2">
          <ArrowLeftIcon size={20} color={secondaryColor} />
        </TouchableOpacity>
      </Animatable.View>
      <Animated.View
        style={{
          opacity: headerOpacity,
          position: "absolute",
          backgroundColor: "white",
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          zIndex: 1,
        }}
      >
        <View>
          <Text className="text-xl absolute top-14 left-20">{title}</Text>
        </View>
      </Animated.View>
      <Animated.View
        style={{
          opacity: tabsOpacity,
          position: "absolute",
          backgroundColor: "white",
          top: 90,
          left: 0,
          right: 0,
          height: 70,
          zIndex: 1,
        }}
        className="border-b border-gray-200"
      >
        {/*** Restaurant Cateogires ***/}
        <View className="bg-white p-4">
          <FlatList
            style={{ transform: [{ scaleX: -1 }] }}
            horizontal
            inverted
            ref={tabsRef}
            showsHorizontalScrollIndicator={false}
            data={
              restaurantCategories &&
              restaurantCategories.filter(
                (category) =>
                  category.status === "True" && category.products.length !== 0
              )
            }
            keyExtractor={(item) => item.category_id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  scrollToCategory(index);
                  //tabsRef.current?.scrollToIndex({ index, animated: true });
                }}
              >
                <MotiView
                  style={{
                    backgroundColor:
                      activeTabIndex === index ? primaryColor : "#ffff",
                  }}
                  animate={{
                    opacity: activeTabIndex === index ? 1 : 0.6,
                  }}
                  className={`px-4 py-1 rounded-full`}
                >
                  <Text
                    style={{ fontFamily: mainFont, color: secondaryColor }}
                    className={`text-base `}
                  >
                    {item.Category_name}
                  </Text>
                </MotiView>
              </TouchableOpacity>
            )}
          />
        </View>
      </Animated.View>
      <FlatList
        data={
          restaurantCategories &&
          restaurantCategories.filter(
            (category) =>
              category.status === "True" && category.products.length !== 0
          )
        }
        keyExtractor={(category) => category.category_id}
        ListHeaderComponent={flatListHeader()}
        renderItem={({ item: Category, index }) => (
          <View
            key={Category.category_id}
            onLayout={(event) => handleSectionLayout(event, index)}
          >
            <RestaurantCategories
              title={Category.Category_name}
              dishes={Category.products}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        ListFooterComponent={loading && <RestaurantDishesSkeleton />}
        onScroll={handleScroll}
        scrollEnabled={restaurantCategories !== null}
        ref={flatListRef}
        contentContainerStyle={{ paddingBottom: 200 }}
      />
    </View>
  );
};

export default RestaurantScreen;
