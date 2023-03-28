import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import SearchRestaurantCard from "../components/SearchRestaurantCard";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";
import { arabicFont, secondaryColor } from "../variables/themeVariables";
import { API_URL } from "@env";

const ResultsScreen = () => {
  const navigation = useNavigation();
  const { neighborhoodID } = useSelector((state) => state.neighborhoodID);
  const [restaurants, setRestaurants] = useState(null);

  const {
    params: { title, category_id },
  } = useRoute();
  const fetchRestaurantsByCategory = async () => {
    const response = await axios.get(
      `${API_URL}/fetchByCategory?category_id=${category_id}}&neigh_id=${neighborhoodID[0]}`,
      { headers: { userAgent: "CraveMobile" } }
    );
    setRestaurants(response.data);
  };
  useEffect(() => {
    fetchRestaurantsByCategory();
  }, []);

  return (
    <SafeAreaView className="bg-white">
      {/********** Header **********/}
      <View className="p-5 py-4 border-b border-[#d8dad9] bg-white shadow-xs">
        <View className=" flex-row-reverse justify-between items-center">
          <View>
            <Text
              style={{ fontFamily: arabicFont }}
              className="text-lg text-center"
            >
              {title}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={navigation.goBack}
              className="shadow bg-gray-100 rounded-full p-2 mr-4"
            >
              <ArrowLeftIcon size={20} color={secondaryColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {
        <ScrollView
          className="p-3 bg-gray-100"
          showsVerticalScrollIndicator={false}
        >
          <View className="pb-36">
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
                    Rev_service={restaurant.Rev_service}
                    Rev_delivery={restaurant.Rev_delivery}
                    Rev_taste={restaurant.Rev_taste}
                  />
                );
              })}
          </View>
        </ScrollView>
      }
    </SafeAreaView>
  );
};

export default ResultsScreen;
