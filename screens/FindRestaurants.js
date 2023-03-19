import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocation } from "../hooks/useLocation";
import { useValidateAddress } from "../hooks/useValidateAddress";
import { setNeighborhoodID } from "../features/neighborhoodSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import LoadingOverlay from "../components/LoadingOverlay";

const FindRestaurants = () => {
  const { getUserLocation, isLoading } = useLocation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [splashLoading, setSplashLoading] = useState(null);
  const { validateAddress } = useValidateAddress();
  const getLocation = async () => {
    try {
      setSplashLoading(true);
      const Address = await getUserLocation();
      const neigh_id = await validateAddress(
        Address.lng,
        Address.lat,
        Address.postCode
      );
      Address.neighborhoodID = neigh_id.id;
      console.log(Address);
      await AsyncStorage.setItem(
        "neighborhoodID",
        JSON.stringify([neigh_id.id, Date.now()])
      );
      dispatch(setNeighborhoodID([neigh_id.id, Date.now()]));
      await AsyncStorage.setItem(
        "AddressByFindLocation",
        JSON.stringify(Address)
      );
      await AsyncStorage.setItem("selectedAddress", JSON.stringify(Address));
      navigation.navigate("Home");
      setSplashLoading(null);
    } catch (error) {
      setSplashLoading(null);
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white flex-1 items-center justify-center">
      <View className="mb-6 rounded-xl">
        <Image
          source={require("../assets/location.png")}
          className=" h-56 w-56 rounded-3xl bg-white"
        />
      </View>
      <View>
        <Text className="text-3xl text-center">إبحث الأن عن مطاعم</Text>
        <Text className="text-3xl text-center">بالقرب منك!</Text>
      </View>
      <View className="absolute bottom-10">
        <TouchableOpacity
          onPress={getLocation}
          disabled={isLoading}
          className="bg-[#00ccbc] w-80 p-4 shadow rounded-md"
        >
          <Text className="text-center text-base text-white">
            السماح بالوصول إلى الموقع
          </Text>
        </TouchableOpacity>
      </View>
      {/************* Loading Overlay *************/}
      {splashLoading && <LoadingOverlay />}
    </SafeAreaView>
  );
};

export default FindRestaurants;
