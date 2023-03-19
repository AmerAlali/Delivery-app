import { View, Text, ScrollView } from "react-native";
import React, { memo } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "react-native-heroicons/outline";
import RestaurantCard from "./RestaurantCard";
import { useRTL } from "../hooks/useRTL";
import { useLanguage } from "../hooks/useLanguage";

const FeaturedRow = ({ title, restaurants }) => {
  const { i18n } = useLanguage();
  const mainFont = "arabic-font";
  const mainColor = "black";
  const RTL = useRTL();
  const isRTL = RTL(i18n.t(title));
  const arrowIcon = isRTL ? (
    <ArrowLeftIcon color={mainColor} />
  ) : (
    <ArrowRightIcon color={mainColor} />
  );

  return (
    <View>
      <View
        className={`mt-4  item-center justify-between px-4 ${
          isRTL ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {arrowIcon}
        <Text
          style={{ fontFamily: mainFont }}
          className={`text-lg ${!isRTL && "font-extrabold text-xl"}`}
        >
          {title}
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        className="pt-4"
      >
        {/* ResturantCards.... */}
        {restaurants.map((restaurant) => {
          return (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              imgUrl={
                restaurant.image
                  ? `https://cravecorner.shop/public/storage/${restaurant.image}`
                  : "https://img.freepik.com/premium-vector/spoon-plate-icon-logo-template-vector-illustration_757387-417.jpg?w=826"
              }
              title={restaurant.name}
              rating={restaurant.rating !== "0" ? restaurant.rating : 10}
              genre={restaurant.keywords}
              adress={restaurant.neighborhood}
              short_description="This is a Test description"
              dishes={restaurants}
              activity={restaurant.activity}
              isdiscounted={restaurant.isdiscounted}
              res_keywords={restaurant.res_keywords}
              deliveryLimit={restaurant.deliveryLimit}
              deliveryCost={restaurant.deliveryCost}
              CategoryName={title}
              mind_time={restaurant.mind_time}
              maxDeliveryTime={restaurant.maxd_time}
              reviews={restaurant.reviews}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default memo(FeaturedRow);
