import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { memo, useCallback } from "react";
import { HomeIcon, TrashIcon } from "react-native-heroicons/outline";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { deleteAddress } from "../features/addressSlice";
import {
  primaryColor,
  secondaryColor,
  arabicFont,
} from "../variables/themeVariables";
import { API_URL } from "@env";
import { AntDesign } from "@expo/vector-icons";
const AdressCard = ({
  id,
  city,
  street,
  district,
  neighborhood,
  buildingName,
  buildingNo,
  apartmentNo,
  discription,
  floor,
}) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleAddressDelete = useCallback(() => {
    axios
      .delete(`${API_URL}/user/address/delete`, {
        headers: {
          Authorization: "Bearer " + user.token,
          "Content-Type": "application/json",
        },
        data: {
          address_id: id,
        },
      })
      .then((response) => dispatch(deleteAddress(response.data)));
  }, []);
  return (
    <View
      className="p-4 flex-row justify-between items-center border-b-2 border-gray-50"
      style={{
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        elevation: 1,
      }}
    >
      <View className="flex-row items-center space-x-2">
        <AntDesign name="home" size={27} color={secondaryColor} />
        <View>
          <Text className="text-lg w-60">{discription}</Text>
          <Text className="text-md text-gray-500 w-60">
            {city},{district}, {neighborhood},{street},{buildingName}, No:{" "}
            {buildingNo}, Daire: {apartmentNo}, Kat: {floor}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          Alert.alert("هل انت متأكد", "من حذف هذا العنوان؟", [
            {
              text: "لا, إلغاء",
            },
            {
              text: "نعم",
              onPress: () => handleAddressDelete(),
            },
          ])
        }
      >
        <TrashIcon size={25} color={secondaryColor} />
      </TouchableOpacity>
    </View>
  );
};

export default memo(AdressCard);
