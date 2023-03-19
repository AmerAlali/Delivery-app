import { View } from "react-native";
import React, { memo } from "react";
import AdressCard from "./AdressCard";
import { useSelector } from "react-redux";
const Adresses = () => {
  const { addresses } = useSelector((state) => state.addresses);

  return (
    <View>
      {addresses &&
        addresses.map((address) => {
          return (
            <AdressCard
              key={address.id}
              id={address.id}
              lng={address.lng}
              PostCode={address.PostCode}
              lat={address.lat}
              city={address.city}
              street={address.street}
              district={address.district}
              neighborhood={address.neighborhood}
              buildingName={address.buildingName}
              buildingNo={address.building_no}
              apartmentNo={address.apartment_no}
              discription={address.discription}
              floor={address.floor}
              phone={address.phone}
            />
          );
        })}
    </View>
  );
};

export default memo(Adresses);
