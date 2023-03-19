import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./store";
import { Provider as PaperProvider } from "react-native-paper";
import { TailwindProvider } from "tailwindcss-react-native";
import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import {
  UserIcon,
  HomeIcon,
  ShoppingBagIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import CustomDrawer from "./components/CustomDrawer";
import OffersScreen from "./screens/OffersScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { useLanguage } from "./hooks/useLanguage";
import * as SecureStore from "expo-secure-store";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
SplashScreen.preventAutoHideAsync();
const HomeStackNav = createSharedElementStackNavigator();
const RestaurantScreenStack = createSharedElementStackNavigator();

function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNav.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStackNav.Screen
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
      <HomeStackNav.Screen name="Search" component={SearchScreen} />
    </HomeStackNav.Navigator>
  );
}
function RestaurantStack() {
  return (
    <RestaurantScreenStack.Navigator
      initialRouteName="RestaurantScreen"
      screenOptions={{ headerShown: false }}
    ></RestaurantScreenStack.Navigator>
  );
}

function DrawerScreens() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const checkLoginStatus = async () => {
    const token = await SecureStore.getItemAsync("user");
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
          drawerActiveBackgroundColor: "white",
          drawerIcon: ({ color, size }) => (
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
              drawerIcon: ({ color, size }) => (
                <Feather name="user" size={24} color="black" />
              ),
            }}
          />
          <Drawer.Screen
            name="Orders"
            component={OrdersScreen}
            options={{
              drawerActiveTintColor: "black",
              drawerLabel: i18n.t("previousOrders"),
              unmountOnBlur: true,
              drawerIcon: ({ color, size }) => (
                <ShoppingBagIcon size={24} color="black" />
              ),
            }}
          />
          <Drawer.Screen
            name="Adresses"
            component={AdressesScreen}
            options={{
              drawerActiveTintColor: "black",
              drawerLabel: i18n.t("myAddresses"),
              drawerIcon: ({ color, size }) => (
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
          drawerLabel: i18n.t("offersLabel"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="gift-outline" size={24} color="black" />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerActiveTintColor: "black",
          drawerLabel: i18n.t("settingsLabel"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ios-settings-outline" size={24} color="black" />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [backupNeighborhoodID, setBackupNeighborhoodID] = useState(false);

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
                  initialRouteName={!backupNeighborhoodID && "Home"}
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
                  <Stack.Screen name="Register" component={RegisterScreen} />
                  <Stack.Screen name="Results" component={ResultsScreen} />
                  <Stack.Screen name="Checkout" component={CheckoutScreen} />
                  <Stack.Screen
                    name="PaymentSelect"
                    component={PaymentSelectScreen}
                  />
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
