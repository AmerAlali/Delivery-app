import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import SearchRestaurantCard from "../components/SearchRestaurantCard";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const ResultsScreen = () => {
  const navigation = useNavigation();
  const {
    params: { title, restaurants },
  } = useRoute();

  const filterRestaurants = restaurants.filter((res) => {
    const resKeywords = res.res_keywords;
    const isResKeywordArray = Array.isArray(resKeywords);
    if (isResKeywordArray) {
      const includesTitle = resKeywords.some((keyword) =>
        keyword.includes(title)
      );
      return includesTitle;
    }
    return false;
  });

  return (
    <SafeAreaView className="bg-gray-100">
      <View
        className=" flex-row-reverse justify-between items-center space-x-2 p-3  bg-white"
        style={{ direction: "ltr", paddingTop: 50 }}
      >
        <Text className="text-lg mr-1">{title}</Text>
        <TouchableOpacity
          onPress={navigation.goBack}
          className="shadow bg-gray-100 rounded-full p-2"
        >
          <ArrowLeftIcon size={20} color="#00ccbc" />
        </TouchableOpacity>
      </View>
      <ScrollView className="p-3">
        {filterRestaurants.map((element) => {
          return (
            <SearchRestaurantCard
              key={element.id}
              id={element.id}
              imgUrl={`https://cravecorner.shop/public/storage/${element.image}`}
              title={element.name}
              rating={4.5}
              genre={element.keywords}
              adress={element.neighborhood}
              short_description="This is a Test description"
              res_keywords={element.res_keywords}
              activity={element.activity}
              isdiscounted={element.isdiscounted}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultsScreen;
