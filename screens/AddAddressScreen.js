import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { StyleSheet, Text, View, Image, Modal } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  XMarkIcon,
  ArrowLeftIcon,
} from "react-native-heroicons/solid";
import { MapPinIcon as MapPinIconOutline } from "react-native-heroicons/outline";
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
import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
  primaryColor,
  secondaryColor,
  arabicFont,
} from "../variables/themeVariables";
import { GoogleMapsApiKey } from "@env";
import { Searchbar } from "react-native-paper";
import { Dimensions } from "react-native";

export default function AddAddressScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [splashLoading, setSplashLoading] = useState(null);
  const { i18n } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { validateAddress } = useValidateAddress();
  const mapRef = useRef(null);

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
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    })();
  }, []);

  const handleGetAddress = async (latitude, longitude) => {
    try {
      setSplashLoading(true);
      const response = await axios.post(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GoogleMapsApiKey}`
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
      500
    );
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [googleAutoCompleteResults, setGoogleAutoCompleteResults] =
    useState(null);

  const handleGoogleAutoComplete = useCallback(
    async (query) => {
      setSearchQuery(query);
      const response = await axios.post(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GoogleMapsApiKey}&input=${query}&components=country:tr`
      );
      setGoogleAutoCompleteResults(response.data.predictions);
    },
    [searchQuery]
  );
  const handleGoogleAutoCompleteLangLat = async (address) => {
    bottomSheetRef.current?.close();
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GoogleMapsApiKey}`
    );
    const { lat, lng } = response.data.results[0]?.geometry?.location;
    setSelectedLocation({ latitude: lat, longitude: lng });
    mapRef.current.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.002,
        longitudeDelta: 0.001,
      },
      500
    );
  };
  const height = Dimensions.get("window").height;
  // bottom sheet
  const bottomSheetRef = useRef(null);

  const handleBottomSheetOpen = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  // bottom sheet backdrop
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );
  // bottom sheet snappoints
  const snapPoints = useMemo(() => ["25%", "50", "60%"], []);

  //lottie
  const mapIconRef = useRef(null);
  useEffect(() => {
    mapIconRef.current?.play();
  }, []);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ height: height }}>
        {/** google autoComplete Bottom Sheet **/}
        <BottomSheetModal
          ref={bottomSheetRef}
          backdropComponent={renderBackdrop}
          animateOnMount={true}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
        >
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            <View className="p-4">
              <View className="flex-row items-center gap-3 justify-between">
                <TouchableOpacity
                  onPress={navigation.goBack}
                  style={{
                    backgroundColor: "#fff",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.4,

                    elevation: 3,
                  }}
                  className="bg-gray-50 rounded-full p-2"
                >
                  <ArrowLeftIcon size={20} color={secondaryColor} />
                </TouchableOpacity>
                <Searchbar
                  className="bg-gray-200 flex-1 text-gray-700 items-center rounded-md"
                  clearButtonMode="always"
                  style={{ height: 45 }}
                  onChangeText={handleGoogleAutoComplete}
                  value={searchQuery}
                  inputStyle={{
                    alignSelf: "center",
                    textAlignVertical: "center",
                    color: "#737373",
                  }}
                  textAlignVertical="center"
                />
              </View>
              <View className="flex-1 mt-2">
                {googleAutoCompleteResults?.map((results) => (
                  <TouchableOpacity
                    key={results?.place_id}
                    onPress={() =>
                      handleGoogleAutoCompleteLangLat(results?.description)
                    }
                    className="flex-row items-center p-1 py-2 space-x-5"
                  >
                    <MapPinIconOutline size={25} color={primaryColor} />
                    <View>
                      <Text className=" font-medium">
                        {results?.structured_formatting.main_text}
                      </Text>
                      <Text className="text-gray-500">
                        {results?.structured_formatting.secondary_text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </BottomSheetScrollView>
        </BottomSheetModal>
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
          <XMarkIcon size={20} color={secondaryColor} />
        </TouchableOpacity>
        {/************* Search button  *************/}
        <TouchableOpacity
          onPress={handleBottomSheetOpen}
          style={{
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.4,

            elevation: 3,
          }}
          className="absolute z-10 top-14 right-5 bg-gray-50  rounded-full p-2"
        >
          <MagnifyingGlassIcon color={secondaryColor} size={20} />
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
        <View style={{ position: "absolute", left: "43.5%", top: "42%" }}>
          <Lottie
            ref={mapIconRef}
            style={{
              width: 70,
              height: 70,
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../assets/mapPinIcon.json")}
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
            <MapPinIcon size={30} color={primaryColor} />
          </TouchableOpacity>
        </View>
        {/************* continue button  *************/}
        <View className="bg-white p-5">
          <TouchableOpacity
            className="p-4 rounded-md"
            style={{ backgroundColor: primaryColor }}
            onPress={() => {
              handleGetAddress(
                selectedLocation.latitude,
                selectedLocation.longitude
              );
            }}
            disabled={!selectedLocation}
          >
            <Text
              className="text-center text-lg"
              style={{ fontFamily: arabicFont, color: secondaryColor }}
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
          onDismiss={() => setIsOpen(false)}
          visible={isOpen === true}
          animationType="fade"
        >
          <View className=" bg-[#0000005d] flex-1 justify-center">
            <View className="bg-white m-10 items-center rounded-md p-5">
              <Text
                className="text-center text-lg"
                style={{ fontFamily: arabicFont }}
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
                onPress={() => setIsOpen(false)}
                className="p-2 mt-2 w-full rounded-md"
                style={{ backgroundColor: primaryColor }}
              >
                <Text
                  className="text-center text-lg"
                  style={{ fontFamily: arabicFont, color: secondaryColor }}
                >
                  {i18n.t("ok")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flex: 1,
    height: "100%",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
  },
  listView: {
    backgroundColor: "#fff",
  },
  separator: {
    backgroundColor: "#eaeaea",
    height: 1,
  },
  map: {
    flex: 1,
  },
});
