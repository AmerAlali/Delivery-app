import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
} from "react-native-heroicons/outline";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import SearchRestaurantCard from "../components/SearchRestaurantCard";
import { primaryColor, secondaryColor } from "../variables/themeVariables";
import { useLanguage } from "../hooks/useLanguage";
import { useRTL } from "../hooks/useRTL";
const SearchScreen = () => {
  const { i18n } = useLanguage();
  const [SearchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState();
  const [timerId, setTimerId] = useState(null);
  const [searchFailed, setSearchFailed] = useState(null);
  const navigation = useNavigation();
  const RTL = useRTL();

  const {
    params: { restaurants },
  } = useRoute();
  const searchResults = (term) => {
    setSearchTerm(term);
    // Clear the previous timer
    if (timerId !== null) {
      setResults([]);
      setSearchFailed(null);
      clearTimeout(timerId);
    }
    setTimerId(
      setTimeout(() => {
        if (term !== "") {
          executeSearch(term);
        }
      }, 500)
    );
  };
  const noResultsText = RTL(i18n.t("searchPlaceholder"))
    ? `${`"` + SearchTerm + `"`}` + " " + i18n.t("noSearchResults")
    : i18n.t("noSearchResults") + " " + `${`"` + SearchTerm + `"`}`;

  const executeSearch = (term) => {
    if (restaurants !== null && restaurants.length !== 0) {
      const searchResults = restaurants.filter((res) =>
        res.name.toLowerCase().includes(term.replaceAll(" ", "").toLowerCase())
      );
      if (searchResults.length >= 1) {
        setResults(searchResults);
        setSearchFailed(null);
      } else if (searchResults.length === 0) {
        setSearchFailed(true);
      }
    }
  };

  return (
    <SafeAreaView>
      <View>
        {/* Search */}
        <View
          className=" flex-row-reverse items-center space-x-2 p-3  bg-white"
          style={{ direction: "ltr", paddingTop: 50 }}
        >
          <View
            className="flex-row items-center space-x-2 flex-1 bg-gray-200 rounded-3xl p-3"
            style={{ direction: "rtl" }}
          >
            <MagnifyingGlassIcon color="gray" size={20} />
            <TextInput
              placeholder={i18n.t("searchPlaceholder")}
              autoFocus={true}
              keyboardType="default"
              value={SearchTerm}
              style={{ flex: 1, direction: "rtl", marginRight: 10 }}
              onChangeText={searchResults}
            />
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
        <View className="bg-gray-100 py-4 px-3 h-full pb-16">
          {searchFailed === true && (
            <View>
              <Text
                style={{ fontFamily: "arabic-font" }}
                className="text-lg text-center mt-4 text-gray-600"
              >
                {noResultsText}
              </Text>
            </View>
          )}
          <ScrollView>
            {results?.map((restaurant) => {
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
                  deliveryLimit={restaurant.deliveryLimit}
                  deliveryCost={restaurant.deliveryCost}
                  CategoryName={"search"}
                  mind_time={restaurant.mind_time}
                  maxDeliveryTime={restaurant.maxd_time}
                  reviews={restaurant.reviews}
                />
              );
            })}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
