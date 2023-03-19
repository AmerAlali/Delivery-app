import { View, Text } from "react-native";
import React, { memo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

const HomeScreenSkeleton = () => {
  return (
    <View className="ml-4">
      {/********** categories Skeleton **********/}
      <View className="flex-row space-x-2">
        <ShimmerPlaceHolder
          shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
          className="w-28 rounded h-20"
          LinearGradient={LinearGradient}
        />
        <ShimmerPlaceHolder
          shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
          className="w-28 rounded h-20"
          LinearGradient={LinearGradient}
        />
        <ShimmerPlaceHolder
          shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
          className="w-28 rounded h-20"
          LinearGradient={LinearGradient}
        />
        <ShimmerPlaceHolder
          shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
          className="w-28 rounded h-20"
          LinearGradient={LinearGradient}
        />
        <ShimmerPlaceHolder
          shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
          className="w-28 rounded h-20"
          LinearGradient={LinearGradient}
        />
      </View>
      {/********** restaurants Skeleton **********/}
      <View className="my-4 mr-4">
        <ShimmerPlaceHolder
          shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
          className=" w-full h-6 rounded"
          LinearGradient={LinearGradient}
        />
      </View>
      <View className="flex-row space-x-2">
        <View>
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-36 w-64 rounded"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className="my-2 h-4 w-28 rounded"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className="my-1 h-3 w-20 rounded"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className="my-1 h-3 w-32 rounded"
            LinearGradient={LinearGradient}
          />
        </View>
        <View>
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-36 w-64 rounded"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className="my-2 h-4 w-28 rounded"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className="my-1 h-3 w-20 rounded"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className="my-1 h-3 w-32 rounded"
            LinearGradient={LinearGradient}
          />
        </View>
      </View>
      {/********** restaurants Skeleton **********/}
      <View className="my-4 mr-4">
        <ShimmerPlaceHolder
          shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
          className=" w-full h-6 rounded"
          LinearGradient={LinearGradient}
        />
      </View>
      <View className="flex-row space-x-2">
        <View>
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-36 w-64 rounded"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className="my-2 h-4 w-28 rounded"
            LinearGradient={LinearGradient}
          />
        </View>
        <View>
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-36 w-64 rounded"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className="my-2 h-4 w-28 rounded"
            LinearGradient={LinearGradient}
          />
        </View>
      </View>
      {/********** restaurants Skeleton **********/}
      <View className="my-4 mr-4">
        <ShimmerPlaceHolder
          shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
          className=" w-full h-6 rounded"
          LinearGradient={LinearGradient}
        />
      </View>
      <View className="flex-row space-x-2">
        <View>
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-36 w-64 rounded"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className="my-2 h-4 w-28 rounded"
            LinearGradient={LinearGradient}
          />
        </View>
        <View>
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className=" h-36 w-64 rounded"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerColors={["#f0f0f0", "#ffffff", "#f0f0f0"]}
            className="my-2 h-4 w-28 rounded"
            LinearGradient={LinearGradient}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(HomeScreenSkeleton);
