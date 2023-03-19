import { useState } from "react";
import axios from "axios";
import * as Location from "expo-location";

export const useLocation = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      const [addressRes] = await Promise.all([
        axios.post(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAqFPn1icSrIlBjMXKcrYftXNcdXqU9mDw`
        ),
      ]);

      const { data } = addressRes;
      if (data.status === "OK") {
        const addressComponents = data.results[0].address_components;
        const cityComponent = addressComponents.find(
          (component) =>
            component.types.includes("locality") ||
            component.types.includes("administrative_area_level_1")
        );
        const districtComponent = addressComponents.find((component) =>
          component.types.includes("administrative_area_level_2")
        );
        const neighborhoodComponent = addressComponents.find(
          (component) =>
            component.types.includes("administrative_area_level_3") ||
            component.types.includes("administrative_area_level_4")
        );
        const routeComponent = addressComponents.find((component) =>
          component.types.includes("route")
        );
        const postalCodeComponent = addressComponents.find((component) =>
          component.types.includes("postal_code")
        );
        const buildingNumberComponent = addressComponents.find((component) =>
          component.types.includes("street_number")
        );
        const route = routeComponent?.long_name || "";
        const postalCode = postalCodeComponent?.long_name || "";
        const buildingNo = buildingNumberComponent?.long_name || "";
        const city = cityComponent?.long_name || "";
        const district = districtComponent?.long_name || "";
        const neighborhood = neighborhoodComponent?.long_name || "";
        const Address = {
          city,
          district,
          neighborhood,
          street: route,
          building_no: buildingNo,
          postCode: postalCode,
          lng: longitude,
          lat: latitude,
          neighborhoodID: null,
        };
        setIsLoading(false);
        return Address;
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setError(error);
    }
  };

  return { getUserLocation, isLoading, error };
};
