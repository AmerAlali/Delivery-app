import { View } from "react-native";
import React, { memo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

const ReviewsScreenSkeleton = () => {
  return (
    <View className="mx-4">
      {/********** restaurants Skeleton **********/}
      <View className="flex-row-reverse justify-between mb-4">
        <View>
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-28 rounded-md"
            LinearGradient={LinearGradient}
          />
        </View>
        <View className="gap-2">
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-32 rounded-md"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-full rounded-md"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-20 rounded-md"
            LinearGradient={LinearGradient}
          />
        </View>
      </View>
      <View className="flex-row-reverse justify-between mb-4">
        <View>
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-28 rounded-md"
            LinearGradient={LinearGradient}
          />
        </View>
        <View className="gap-2">
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-32 rounded-md"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-full rounded-md"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-20 rounded-md"
            LinearGradient={LinearGradient}
          />
        </View>
      </View>
      <View className="flex-row-reverse justify-between mb-4">
        <View>
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-28 rounded-md"
            LinearGradient={LinearGradient}
          />
        </View>
        <View className="gap-2">
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-32 rounded-md"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-full rounded-md"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-20 rounded-md"
            LinearGradient={LinearGradient}
          />
        </View>
      </View>
      <View className="flex-row-reverse justify-between mb-4">
        <View>
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-28 rounded-md"
            LinearGradient={LinearGradient}
          />
        </View>
        <View className="gap-2">
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-32 rounded-md"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-full rounded-md"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-20 rounded-md"
            LinearGradient={LinearGradient}
          />
        </View>
      </View>
      <View className="flex-row-reverse justify-between mb-4">
        <View>
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-28 rounded-md"
            LinearGradient={LinearGradient}
          />
        </View>
        <View className="gap-2">
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-32 rounded-md"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-full rounded-md"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-20 rounded-md"
            LinearGradient={LinearGradient}
          />
        </View>
      </View>
      <View className="flex-row-reverse justify-between mb-4">
        <View>
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-28 rounded-md"
            LinearGradient={LinearGradient}
          />
        </View>
        <View className="gap-2">
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-32 rounded-md"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-full rounded-md"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-4 w-20 rounded-md"
            LinearGradient={LinearGradient}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(ReviewsScreenSkeleton);
