import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import ReviewCard from "../components/ReviewCard";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import * as Animatable from "react-native-animatable";
import { ProgressBar } from "react-native-paper";
import { arabicFont, primaryColor } from "../variables/themeVariables";
import { useLanguage } from "../hooks/useLanguage";
import { StarIcon } from "react-native-heroicons/solid";
import axios from "axios";
import { FlatList } from "react-native";
import ReviewsScreenSkeleton from "../components/ReviewsScreenSkeleton";
const ReviewsScreen = () => {
  const {
    params: { id, imgUrl, title, rating, Rev_service, Rev_delivery, Rev_taste },
  } = useRoute();
  const navigation = useNavigation();
  const [reviews, setReviews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `https://cravecorner.shop/api/getReviews?restaurant_id=${id}`,
        { headers: { userAgent: "CraveMobile" } }
      );
      setReviews(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const { i18n } = useLanguage();
  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item.review_id.toString()}
      renderItem={({ item }) => {
        const {
          service,
          taste,
          delivery,
          status,
          created_at,
          review_id,
          comment,
          user_name,
        } = item;
        if (
          service === null ||
          taste === null ||
          delivery === null ||
          status == "false"
        )
          return null;
        const reviewRating = (service + taste + delivery) / 3;
        return (
          <ReviewCard
            key={review_id}
            rating={reviewRating}
            comment={comment}
            createdAt={created_at}
            userName={user_name}
          />
        );
      }}
      ListHeaderComponent={
        <>
          <View className="absolute top-14 left-5 z-10 bg-gray-100 rounded-full">
            <TouchableOpacity onPress={navigation.goBack} className="p-2">
              <ArrowLeftIcon size={20} color="#ffd700" />
            </TouchableOpacity>
          </View>

          <View>
            <Image
              source={{ uri: imgUrl }}
              className="w-full h-52"
              style={{ resizeMode: "cover" }}
            />
          </View>

          <Animatable.View
            animation="fadeInRight"
            useNativeDriver={true}
            delay={500}
            duration={500}
            easing="ease-in-out"
            className="bg-white border mb-1 border-gray-200 -mt-20 ml-2 mr-2  rounded-md shadow-xl shadow-gray-400"
          >
            <View className="px-4 pb-4">
              <View className="pt-3 flex-row items-center justify-between">
                <View className="w-60">
                  <Text className="text-2xl font-bold ">{title}</Text>
                </View>
                <View className="flex-row bg-[#ffd700] px-2 py-1 rounded-full items-center space-x-1">
                  <StarIcon color="#434340" size={22} />
                  <Text className="text-sm ">
                    <Text style={{ color: "#434340" }}>{rating}</Text>
                  </Text>
                </View>
              </View>

              <View className="gap-2 mt-2">
                <View className="gap-1">
                  <Text style={{ fontFamily: arabicFont }}>
                    {i18n.t("foodTaste")}
                  </Text>
                  <View className="flex space-x-2 flex-row items-center">
                    <ProgressBar
                      style={{ width: 280 }}
                      color={primaryColor}
                      styleAttr="Horizontal"
                      progress={Rev_taste / 10}
                    />
                    <View>
                      <Text>{Rev_taste}</Text>
                    </View>
                  </View>
                </View>
                <View className="gap-1">
                  <Text style={{ fontFamily: arabicFont }}>
                    {i18n.t("deliverySpeed")}
                  </Text>
                  <View className="flex space-x-2 flex-row items-center">
                    <ProgressBar
                      style={{ width: 280 }}
                      color={primaryColor}
                      styleAttr="Horizontal"
                      progress={Rev_delivery / 10}
                    />
                    <View>
                      <Text>{Rev_delivery}</Text>
                    </View>
                  </View>
                </View>
                <View className="gap-1">
                  <Text style={{ fontFamily: arabicFont }}>
                    {i18n.t("service")}
                  </Text>
                  <View className="flex space-x-2 flex-row items-center">
                    <ProgressBar
                      style={{ width: 280 }}
                      color={primaryColor}
                      styleAttr="Horizontal"
                      progress={Rev_service / 10}
                    />
                    <View>
                      <Text>{Rev_service}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Animatable.View>
        </>
      }
      ListFooterComponent={isLoading && <ReviewsScreenSkeleton />}
      scrollEnabled={reviews !== null}
    />
  );
};

export default ReviewsScreen;
