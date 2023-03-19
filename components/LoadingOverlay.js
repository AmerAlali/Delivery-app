import { View } from "react-native";
import React from "react";
import Lottie from "lottie-react-native";
import { useRef, memo, useEffect } from "react";

const LoadingOverlay = () => {
  const animationRef = useRef(null);
  useEffect(() => {
    animationRef.current?.play();
  }, []);
  return (
    <View className=" absolute bottom-0 w-full h-full bg-[#6e6e6e7e]">
      <View className="flex-1 justify-center items-center align-middle">
        <Lottie
          ref={animationRef}
          style={{
            width: 200,
            height: 200,
          }}
          // Find more Lottie files at https://lottiefiles.com/featured
          source={require("../assets/98744-green-spinner.json")}
        />
      </View>
    </View>
  );
};

export default memo(LoadingOverlay);
