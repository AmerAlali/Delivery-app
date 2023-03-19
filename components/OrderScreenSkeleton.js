import { View, Text } from "react-native";
import React, { memo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

const OrderScreenSkeleton = () => {
  const orderShimmerPlaceHolder = () => {
    return (
      <>
        {/********** order Skeleton **********/}
        <View className="p-4 mb-3 bg-white shadow rounded-md">
          <ShimmerPlaceHolder
            className=" w-64 h-5 rounded"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            className=" w-40 mt-2 h-4 rounded"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            className=" w-44 mt-2 h-4 rounded"
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            className=" w-full mt-2 h-9 rounded-md"
            LinearGradient={LinearGradient}
          />
        </View>
      </>
    );
  };
  return (
    <View className="m-2">
      {orderShimmerPlaceHolder()}
      {orderShimmerPlaceHolder()}
      {orderShimmerPlaceHolder()}
      {orderShimmerPlaceHolder()}
      {orderShimmerPlaceHolder()}
    </View>
  );
};

export default memo(OrderScreenSkeleton);
