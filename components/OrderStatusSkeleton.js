import { View } from "react-native";
import React, { memo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

const OrderStatusSkeleton = () => {
  const orderShimmerPlaceHolder = () => {
    return (
      <>
        {/********** lottie Skeleton **********/}
        <View className="flex-1 items-center mt-10">
          <ShimmerPlaceHolder
            className=" w-56 h-44 rounded-md "
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            className=" w-56 h-8 rounded-md mt-5 "
            LinearGradient={LinearGradient}
          />
        </View>
        <View className=" mt-10 flex-1 items-end">
          <ShimmerPlaceHolder
            className=" w-40 h-4 rounded-md mb-2"
            LinearGradient={LinearGradient}
          />
        </View>
        <ShimmerPlaceHolder
          className=" w-full h-10 mb-2 rounded-md "
          LinearGradient={LinearGradient}
        />
        <ShimmerPlaceHolder
          className=" w-full h-10 mb-2 rounded-md "
          LinearGradient={LinearGradient}
        />
        <ShimmerPlaceHolder
          className=" w-full h-10 mb-2 rounded-md "
          LinearGradient={LinearGradient}
        />
        <ShimmerPlaceHolder
          className=" w-full h-10 mb-2 rounded-md "
          LinearGradient={LinearGradient}
        />
        <ShimmerPlaceHolder
          className=" w-full h-10 mb-2 rounded-md "
          LinearGradient={LinearGradient}
        />
        <ShimmerPlaceHolder
          className=" w-full h-10 mb-2 rounded-md "
          LinearGradient={LinearGradient}
        />
      </>
    );
  };
  return <View className="m-2">{orderShimmerPlaceHolder()}</View>;
};

export default memo(OrderStatusSkeleton);
