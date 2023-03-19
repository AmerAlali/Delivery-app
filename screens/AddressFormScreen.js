import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PencilSquareIcon, MapPinIcon } from "react-native-heroicons/outline";
import { TextInput as Input, HelperText } from "react-native-paper";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAddress } from "../features/addressSlice";

import axios from "axios";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setSelectedAddress } from "../features/selectedAddressSlice";
import { setNeighborhoodID } from "../features/neighborhoodSlice";
import { useLanguage } from "../hooks/useLanguage";

const AddressFormScreen = () => {
  const {
    params: { Address },
  } = useRoute();
  const navigation = useNavigation();
  const {i18n} = useLanguage();
  const mainColor = "#000000"
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [newAddress, setNewAddress] = useState({
    token: user.token,
    city: Address.city,
    district: Address.district,
    street: Address.street,
    building_no: Address.building_no,
    lng: Address.lng,
    lat: Address.lat,
    PostCode: Address.PostCode,
    apartment_no: "",
    buildingName: "",
    discription: "",
    floor: "",
    phone: "",
    neighborhood: Address.neighborhood,
    label: "",
    neighborhoodID: Address.neighborhoodID,
  });

  const handleAddressChange = (key, value) => {
    setNewAddress((prevAddress) => ({ ...prevAddress, [key]: value }));
  };
  const handleSaveAddress = async () => {
    await axios
      .post("https://cravecorner.shop/api/user/address/add", newAddress, {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      })
      .then((response) => {
        dispatch(addAddress(response.data));
        const newAddress = response.data;
        dispatch(setSelectedAddress(newAddress));
        AsyncStorage.setItem("selectedAddress", JSON.stringify(newAddress));
        AsyncStorage.setItem(
          "neighborhoodID",
          JSON.stringify([Address.neighborhoodID, Date.now()])
        );
        dispatch(setNeighborhoodID([Address.neighborhoodID, Date.now()]));
        navigation.navigate("Home");
      })
      .catch((error) => console.error(error.message));
  };
  return (
    <SafeAreaView className="bg-white h-full p-4">
      <ScrollView>
        <View className="flex-1 mb-4">
          <View className=" py-4 border-b border-[#d8dad9] bg-white shadow-xs">
            <View className=" flex-row-reverse justify-between items-center">
              <View>
                <Text className="text-lg text-center text-gray-500">
                  {i18n.t("addNewAddress")}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={navigation.goBack}
                  className="shadow bg-gray-100 rounded-full p-2 mr-4"
                >
                  <ArrowLeftIcon size={20} color={mainColor} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View className="">
          <View className="flex-row justify-between items-center">
            <View className="flex-row align-middle space-x-2">
              <MapPinIcon size={25} color={mainColor}></MapPinIcon>
              <Text className="text-base text-gray-500 w-64">
                {newAddress.city + " , " + newAddress.district}
              </Text>
            </View>
            <TouchableOpacity onPress={navigation.goBack}>
              <PencilSquareIcon size={25} color={mainColor}></PencilSquareIcon>
            </TouchableOpacity>
          </View>
          <View className="mt-4">
            <View className="flex flex-row gap-2">
              <View className="flex-1">
                <Input
                  label={i18n.t("neighborhood")}
                  mode="outlined"
                  outlineColor="#cccc"
                  textColor="gray"
                  activeOutlineColor={mainColor}
                  className="bg-white mb-3"
                  theme={{ roundness: 5 }}
                  value={newAddress.neighborhood}
                  onChangeText={(value) =>
                    handleAddressChange("neighborhood", value)
                  }
                  style={{ minWidth: "100%" }}
                />
              </View>
              <View className="flex-1 ">
                <Input
                  label={i18n.t("street")}
                  mode="outlined"
                  outlineColor="#cccc"
                  textColor="gray"
                  activeOutlineColor={mainColor}
                  className="bg-white mb-3"
                  theme={{ roundness: 5 }}
                  value={newAddress.street}
                  onChangeText={(value) => handleAddressChange("street", value)}
                  style={{ minWidth: "100%" }}
                />
              </View>
            </View>
            <View>
              <Input
                label={i18n.t("buildingName")}
                mode="outlined"
                outlineColor="#cccc"
                textColor="gray"
                activeOutlineColor={mainColor}
                className="bg-white mb-3"
                theme={{ roundness: 5 }}
                value={newAddress.buildingName}
                onChangeText={(value) =>
                  handleAddressChange("buildingName", value)
                }
              />
            </View>
            <View className="flex flex-row gap-2">
              <View className="flex-1">
                <Input
                  label={i18n.t("buildingNumber")}
                  mode="outlined"
                  outlineColor="#cccc"
                  textColor="gray"
                  activeOutlineColor={mainColor}
                  className="bg-white mb-3"
                  theme={{ roundness: 5 }}
                  style={{ minWidth: "100%" }} // set a fixed width of 100%
                  value={newAddress.building_no}
                  onChangeText={(value) =>
                    handleAddressChange("building_no", value)
                  }
                />
              </View>
              <View className="flex-1">
                <Input
                  label={i18n.t("apartmentNumber")}
                  mode="outlined"
                  outlineColor="#cccc"
                  textColor="gray"
                  activeOutlineColor={mainColor}
                  className="bg-white mb-3"
                  theme={{ roundness: 5 }}
                  keyboardType={"number-pad"}
                  style={{ minWidth: "100%" }} // set a fixed width of 100%
                  value={newAddress.apartment_no}
                  onChangeText={(value) =>
                    handleAddressChange("apartment_no", value)
                  }
                />
              </View>
              <View className="flex-1">
                <Input
                  label={i18n.t("floor")}
                  mode="outlined"
                  outlineColor="#cccc"
                  textColor="gray"
                  activeOutlineColor={mainColor}
                  className="bg-white mb-3"
                  theme={{ roundness: 5 }}
                  keyboardType={"number-pad"}
                  style={{ minWidth: "100%" }} // set a fixed width of 100%
                  value={newAddress.floor}
                  onChangeText={(value) => handleAddressChange("floor", value)}
                />
              </View>
            </View>
            <View>
              <Input
                label={i18n.t("phoneNumber")}
                mode="outlined"
                outlineColor="#cccc"
                textColor="gray"
                activeOutlineColor={mainColor}
                className="bg-white mb-3"
                theme={{ roundness: 5 }}
                keyboardType={"phone-pad"}
                value={newAddress.phone}
                onChangeText={(value) => handleAddressChange("phone", value)}
              />
            </View>
            <View>
              <Input
                label={i18n.t("addressDescription")}
                mode="outlined"
                outlineColor="#cccc"
                textColor="gray"
                activeOutlineColor={mainColor}
                className="bg-white mb-3"
                theme={{ roundness: 5 }}
                value={newAddress.discription}
                onChangeText={(value) =>
                  handleAddressChange("discription", value)
                }
              />
            </View>
            <View>
              <Input
                label={i18n.t("addressTitle")}
                mode="outlined"
                outlineColor="#cccc"
                textColor="gray"
                activeOutlineColor={mainColor}
                className="bg-white mb-3"
                theme={{ roundness: 5 }}
                value={newAddress.label}
                onChangeText={(value) => handleAddressChange("label", value)}
              />
            </View>
          </View>
        </View>
        <View className="bg-white mt-16">
          <TouchableOpacity
            onPress={handleSaveAddress}
            className="p-4 rounded-md"
            style={{backgroundColor: mainColor}}
          >
            <Text className="text-center text-lg text-white">{i18n.t("saveAddress")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddressFormScreen;
