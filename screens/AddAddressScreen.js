import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Button, Image, Modal } from "react-native";
import { MapPinIcon, XMarkIcon } from "react-native-heroicons/solid";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { TouchableOpacity } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingOverlay from "../components/LoadingOverlay";
import Lottie from "lottie-react-native";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { useValidateAddress } from "../hooks/useValidateAddress";
import { useLanguage } from "../hooks/useLanguage";

export default function AddAddressScreen() {
  const mainColor = "#000000"
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [splashLoading, setSplashLoading] = useState(null);
  const {i18n} = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { validateAddress } = useValidateAddress();
  const mapRef = useRef(null);
  const mainFont = "arabic-font";

  const navigation = useNavigation();

  const animationRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      animationRef.current?.play();
    }
  }, [isOpen]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      setSelectedLocation({ latitude, longitude });
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.001,
        },
        500
      );
    })();
  }, []);

  const handleGetAddress = async (latitude, longitude) => {
    try {
      setSplashLoading(true);
      const response = await axios.post(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAqFPn1icSrIlBjMXKcrYftXNcdXqU9mDw`
      );
      const data = await response.data;

      if (data.status === "OK") {
        const addressComponents = data.results[0].address_components;
        const postalCodeComponent = addressComponents.find((component) =>
          component.types.includes("postal_code")
        );
        const postalCode = postalCodeComponent
          ? postalCodeComponent.long_name
          : "";

        const supportCheck = await validateAddress(
          longitude,
          latitude,
          postalCode
        );

        if (supportCheck.id !== null) {
          const cityComponent = await addressComponents.find(
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
          const buildingNumberComponent = addressComponents.find((component) =>
            component.types.includes("street_number")
          );
          const route = routeComponent ? routeComponent.long_name : "";
          const BuildingNo = buildingNumberComponent
            ? buildingNumberComponent.long_name
            : "";
          const city = (await cityComponent) ? cityComponent.long_name : "";
          const district = (await districtComponent)
            ? districtComponent.long_name
            : "";
          const neighborhood = (await neighborhoodComponent)
            ? neighborhoodComponent.long_name
            : "";
          const Address = {
            city: city,
            district: district,
            neighborhood: neighborhood,
            street: route,
            building_no: BuildingNo,
            PostCode: postalCode,
            lng: longitude,
            lat: latitude,
            neighborhoodID: supportCheck.id,
          };
          navigation.navigate("AddressForm", { Address });
        } else {
          setIsOpen(true);
        }
        setSplashLoading(null);
      }
    } catch (error) {
      console.error(error);
      setSplashLoading(null);
    }
  };

  const handleAutoDetect = async () => {
    let { coords } = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;
    setSelectedLocation({ latitude, longitude });
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.001,
      },
      50
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/************* cancel button  *************/}
      <TouchableOpacity
        onPress={navigation.goBack}
        style={{
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.4,

          elevation: 3,
        }}
        className="absolute z-10 top-14 left-5 bg-gray-50  rounded-full p-2"
      >
        <XMarkIcon size={20} color={mainColor} />
      </TouchableOpacity>
      {/************* map component  *************/}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: selectedLocation?.latitude || 38.9637,
          longitude: selectedLocation?.longitude || 35.2433,
          latitudeDelta: 0.002,
          longitudeDelta: 0.001,
        }}
        onUserLocationChange={(event) => {
          setSelectedLocation(event.nativeEvent.coordinate);
        }}
        onRegionChangeComplete={(region) => {
          setSelectedLocation(region);
        }}
      ></MapView>
      {/************* current location button  *************/}
      <View style={{ position: "absolute", left: "43.5%", top: "40%" }}>
        <Image
          style={{ width: 48, height: 48 }}
          source={require("../assets/marker.png")}
        />
      </View>
      <View className="absolute bottom-36 right-5">
        <TouchableOpacity
          className="bg-gray-50 rounded-full border border-gray-50 p-4"
          style={{
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.4,

            elevation: 3,
          }}
          onPress={handleAutoDetect}
        >
          <MapPinIcon size={30} color={mainColor} />
        </TouchableOpacity>
      </View>
      {/************* continue button  *************/}
      <View className="bg-white p-5">
        <TouchableOpacity
          className="p-4 rounded-md"
          style={{backgroundColor: mainColor}}
          onPress={() => {
            handleGetAddress(
              selectedLocation.latitude,
              selectedLocation.longitude
            );
          }}
          disabled={!selectedLocation}
        >
          <Text
            className="text-center text-lg text-white"
            style={{ fontFamily: mainFont }}
          >
            {i18n.t("continue")}
          </Text>
        </TouchableOpacity>
      </View>
      {/************* Loading Overlay *************/}
      {splashLoading && <LoadingOverlay />}
      {/************* Error modal *************/}
      <Modal
        transparent={true}
        onDismiss={() => setIsOpen(!isOpen)}
        visible={isOpen}
        animationType="fade"
      >
        <View className=" bg-[#0000005d] flex-1 justify-center">
          <View className="bg-white m-10 items-center rounded-md p-5">
            <Text
              className="text-center text-lg"
              style={{ fontFamily: mainFont }}
            >
              {i18n.t("unsupported")}
            </Text>
            <Lottie
              ref={animationRef}
              style={{
                width: 200,
                height: 200,
              }}
              // Find more Lottie files at https://lottiefiles.com/featured
              source={require("../assets/39612-location-animation.json")}
            />
            <TouchableOpacity
              onPress={() => setIsOpen(!isOpen)}
              className="p-2 mt-2 w-full rounded-md"
              style={{backgroundColor: mainColor}}
            >
              <Text
                className="text-center text-lg text-white"
                style={{ fontFamily: mainFont }}
              >
                {i18n.t("ok")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
