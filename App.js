import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./store";
import { Provider as PaperProvider } from "react-native-paper";
import { TailwindProvider } from "tailwindcss-react-native";
import { StatusBar } from "expo-status-bar";
import { ShoppingBagIcon } from "react-native-heroicons/outline";
/********************** Screens ***********************/
import HomeScreen from "./screens/HomeScreen";
import RestaurantScreen from "./screens/RestaurantScreen";
import BasketScreen from "./screens/BasketScreen";
import ResultsScreen from "./screens/ResultsScreen";
import SearchScreen from "./screens/SearchScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import PaymentSelectScreen from "./screens/PaymentSelectScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AdressesScreen from "./screens/AdressesScreen";
import AddAddressScreen from "./screens/AddAddressScreen";
import AddressFormScreen from "./screens/AddressFormScreen";
import RegisterScreen from "./screens/RegisterScreen";
import FindRestaurants from "./screens/FindRestaurants";
import OrderConfirmScreen from "./screens/OrderConfirmScreen";
import ProductScreen from "./screens/ProductScreen";
import OrderStatusScreen from "./screens/OrderStatusScreen";
import OrdersScreen from "./screens/OrdersScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import CustomDrawer from "./components/CustomDrawer";
import OffersScreen from "./screens/OffersScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { useLanguage } from "./hooks/useLanguage";
import * as Localization from "expo-localization";
import * as Notifications from "expo-notifications";
import ReviewsScreen from "./screens/ReviewsScreen";
import VoucherScreen from "./screens/VoucherScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import OtpScreen from "./screens/OtpScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
SplashScreen.preventAutoHideAsync();
const SharedElementStack = createSharedElementStackNavigator();

function HomeStack() {
  return (
    <SharedElementStack.Navigator screenOptions={{ headerShown: false }}>
      <SharedElementStack.Screen name="HomeScreen" component={HomeScreen} />
      <SharedElementStack.Screen
        name="Restaurant"
        component={RestaurantScreen}
        sharedElements={(route, otherRoute, showing) => {
          const { id, CategoryName } = route.params;
          return [
            {
              id: `restaurant.${id}.image.${CategoryName}`,
              animation: "move",
            },
          ];
        }}
      />
      <SharedElementStack.Screen name="Search" component={SearchScreen} />
    </SharedElementStack.Navigator>
  );
}

function DrawerScreens() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("user");
    setIsLoggedIn(token);
  };
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const { i18n } = useLanguage();
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      defaultStatus="closed"
      screenOptions={{
        headerShown: false,
        drawerLabelStyle: { marginLeft: -22, fontSize: 18 },
        gestureEnabled: true,
        gestureDirection: "horizontal",
        edgeWidth: 0,
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Main"
        component={HomeStack}
        options={{
          drawerActiveTintColor: "black",
          drawerItemStyle: { display: "none" },
          drawerLabelStyle: { fontFamily: "arabic-font", fontSize: 15 },
          drawerActiveBackgroundColor: "white",
          drawerIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      {isLoggedIn !== null && (
        <>
          <Drawer.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              drawerActiveTintColor: "black",
              drawerLabel: i18n.t("profileLabel"),
              drawerLabelStyle: { fontFamily: "arabic-font", fontSize: 15 },
              drawerIcon: () => <Feather name="user" size={24} color="black" />,
            }}
          />
          <Drawer.Screen
            name="Orders"
            component={OrdersScreen}
            options={{
              drawerActiveTintColor: "black",
              drawerLabel: i18n.t("previousOrders"),
              drawerLabelStyle: { fontFamily: "arabic-font", fontSize: 15 },
              unmountOnBlur: true,
              drawerIcon: () => <ShoppingBagIcon size={24} color="black" />,
            }}
          />
          <Drawer.Screen
            name="Adresses"
            component={AdressesScreen}
            options={{
              drawerActiveTintColor: "black",
              drawerLabelStyle: { fontFamily: "arabic-font", fontSize: 15 },
              drawerLabel: i18n.t("myAddresses"),
              drawerIcon: () => (
                <Ionicons name="ios-location-outline" size={24} color="black" />
              ),
            }}
          />
        </>
      )}
      <Drawer.Screen
        name="Offers"
        component={OffersScreen}
        options={{
          drawerActiveTintColor: "black",
          drawerLabelStyle: { fontFamily: "arabic-font", fontSize: 15 },
          drawerLabel: i18n.t("offersLabel"),
          drawerIcon: () => (
            <Ionicons name="gift-outline" size={24} color="black" />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerActiveTintColor: "black",
          drawerLabelStyle: { fontFamily: "arabic-font", fontSize: 15 },
          drawerLabel: i18n.t("settingsLabel"),
          drawerIcon: () => (
            <Ionicons name="ios-settings-outline" size={24} color="black" />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  const [backupNeighborhoodID, setBackupNeighborhoodID] = useState(false);

  const { setLanguage } = useLanguage();
  const [fontsLoaded] = useFonts({
    "arabic-font": require("./assets/fonts/Almarai-Regular.ttf"),
  });

  useEffect(() => {
    const isFontsLoaded = async () => {
      if (fontsLoaded === true) {
        await SplashScreen.hideAsync();
      }
    };
    isFontsLoaded();
  }, [fontsLoaded]);

  useEffect(() => {
    const getDefaultLanguage = () => {
      AsyncStorage.getItem("DefaultLanguage").then((response) => {
        if (response === null) {
          const locale = Localization.locale.split("-")[0];
          if (locale === "ar" || locale === "en" || locale === "tr") {
            setLanguage(locale);
          } else {
            setLanguage("tr");
          }
        }
        if (response !== null && response !== undefined) {
          setLanguage(response);
        }
      });
    };
    getDefaultLanguage();
  }, []);

  useEffect(() => {
    const getBackupNeighborhoodID = async () => {
      const response = await AsyncStorage.getItem("AddressByFindLocation");
      setBackupNeighborhoodID(response);
    };
    getBackupNeighborhoodID();
  }, [backupNeighborhoodID]);

  if (!fontsLoaded || backupNeighborhoodID === false) return null;
  //if (backupNeighborhoodID === false && fontsLoaded === false) return;

  return (
    <NavigationContainer>
      <Provider store={store}>
        <TailwindProvider>
          <PaperProvider>
            <BottomSheetModalProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack.Navigator
                  initialRouteName={
                    backupNeighborhoodID === null ? "FindRestaurants" : "Home"
                  }
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  {!backupNeighborhoodID && (
                    <Stack.Screen
                      name="FindRestaurants"
                      component={FindRestaurants}
                    />
                  )}
                  <Stack.Screen name="Home" component={DrawerScreens} />

                  {/**** Restaurant screens ****/}
                  <Stack.Screen
                    name="ProductDetails"
                    component={ProductScreen}
                  />
                  <Stack.Screen name="Results" component={ResultsScreen} />
                  <Stack.Screen name="Checkout" component={CheckoutScreen} />
                  <Stack.Screen
                    name="PaymentSelect"
                    component={PaymentSelectScreen}
                  />
                  <Stack.Screen name="Voucher" component={VoucherScreen} />
                  <Stack.Screen name="Reviews" component={ReviewsScreen} />
                  <Stack.Screen name="Basket" component={BasketScreen} />
                  {/*** Orders screens ***/}
                  <Stack.Screen
                    name="orderConfirm"
                    component={OrderConfirmScreen}
                  />
                  <Stack.Screen
                    name="OrderStatus"
                    component={OrderStatusScreen}
                  />
                  <Stack.Screen name="Orders" component={OrdersScreen} />
                  {/**** auth screens ****/}
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen
                    name="ResetPassword"
                    component={ResetPasswordScreen}
                  />
                  <Stack.Screen name="OtpScreen" component={OtpScreen} />
                  <Stack.Screen
                    name="ChangePassword"
                    component={ChangePasswordScreen}
                  />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                  {/**** profile screens ****/}

                  {/**** Addresses screens ****/}
                  <Stack.Screen name="Adresses" component={AdressesScreen} />
                  <Stack.Screen
                    name="addAddress"
                    component={AddAddressScreen}
                  />
                  <Stack.Screen
                    name="AddressForm"
                    component={AddressFormScreen}
                  />
                </Stack.Navigator>
              </GestureHandlerRootView>
            </BottomSheetModalProvider>
          </PaperProvider>
        </TailwindProvider>
      </Provider>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}
