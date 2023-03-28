import { View, Text } from "react-native";
import { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  primaryColor,
  secondaryColor,
  arabicFont,
} from "../variables/themeVariables";
import moment from "moment";
import "moment/locale/tr";
import "moment/locale/ar";
import { useLanguage } from "../hooks/useLanguage";
const ReviewCard = ({ rating, comment, createdAt, userName }) => {
  const { i18n } = useLanguage();
  // Calculate the number of full, half, and empty stars to display
  const fullStars = Math.floor(rating / 2);
  const hasHalfStar = Math.round(rating / 2) !== fullStars;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Create an array of full star icons
  const fullStarIcons = Array.from({ length: fullStars }, (_, index) => (
    <Ionicons
      name="star"
      key={`full_${index}`}
      size={20}
      color={primaryColor}
    />
  ));
  moment.locale(i18n.locale);
  const dateString = createdAt;
  const date = moment(dateString);

  const relativeTime = date.fromNow();
  console.log(relativeTime);

  // Create a half star icon if necessary
  const halfStarIcon = (
    <Ionicons name="star-half" size={20} color={primaryColor} />
  );

  // Create an array of empty star icons
  const emptyStarIcons =
    emptyStars !== 0 &&
    Array.from({ length: emptyStars }, (_, index) => (
      <Ionicons
        name="star-outline"
        key={`empty_${index}`}
        size={20}
        color={primaryColor}
      />
    ));

  return (
    <View className="shadow p-3 my-1 mx-2 rounded-md border border-gray-100 bg-white">
      <View className="flex-row-reverse justify-between items-center">
        <View className="flex-row">
          {fullStarIcons}
          {hasHalfStar === true && halfStarIcon}
          {emptyStarIcons}
        </View>
        <Text className="text-base">{userName}</Text>
      </View>
      <View className="mt-2">
        {comment && (
          <Text style={{ fontFamily: arabicFont, color: secondaryColor }}>
            {comment}
          </Text>
        )}
      </View>
      <Text
        style={{ fontFamily: arabicFont }}
        className="text-xs mt-1 text-gray-500"
      >
        {relativeTime}
      </Text>
    </View>
  );
};

export default memo(ReviewCard);
