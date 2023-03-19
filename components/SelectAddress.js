import React, { useEffect, memo } from "react";
import { RadioButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setNeighborhoodID } from "../features/neighborhoodSlice";
import { setVisible } from "../features/bottomSheetSlice";
import { setSelectedAddress } from "../features/selectedAddressSlice";

const SelectAddress = () => {
  const { selectedAddress } = useSelector((state) => state.selectedAddress);
  const { user } = useSelector((state) => state.user);
  const [value, setValue] = React.useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedAddress && user) {
      setValue(selectedAddress.id);
    }
  }, [selectedAddress]);
  const { addresses } = useSelector((state) => state.addresses);

  const handleChangingAddress = (value) => {
    dispatch(setVisible(false));
    const address = addresses.filter((address) => address.id === value);
    AsyncStorage.setItem("selectedAddress", JSON.stringify(address[0]));
    AsyncStorage.setItem(
      "neighborhoodID",
      JSON.stringify([address[0].neighborhoodID, Date.now()])
    );
    dispatch(setSelectedAddress(address[0]));
    dispatch(setNeighborhoodID([address[0].neighborhoodID, Date.now()]));
  };
  const AddressFormat = (address) =>
    address.neighborhood +
    ", " +
    address.street +
    ", " +
    address.buildingName +
    ", No:" +
    address.building_no +
    ", " +
    address.district;

  return (
    <RadioButton.Group
      onValueChange={(value) => {
        setValue(value);
        handleChangingAddress(value);
      }}
      value={value}
    >
      {addresses &&
        addresses.map((address) => {
          return (
            <React.Fragment key={address.id}>
              <Text className="mt-2 ml-4 capitalize text-lg font-bold ">
                {address.discription}
              </Text>
              <RadioButton.Item
                className=""
                color="#00ccbc"
                label={`${AddressFormat(address)}`}
                labelVariant="labelLarge"
                labelStyle={{ color: "#474747" }}
                value={address.id}
              />
            </React.Fragment>
          );
        })}
    </RadioButton.Group>
  );
};

export default memo(SelectAddress);
