import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import TabNavigator from "../TabNavigator";
import OrderScreen from "../screens/OrderScreen";
import AddressScreen from "../screens/AddressScreen"; 
import CreateAddressScreen from "../screens/CreateAddressScreen";  
import EditAddressScreen from "../screens/EditAddressScreen"; 
import OrderDetailScreen from "../screens/OrderDetailScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import SelectAddressScreen from "../screens/SelectAddressScreen";
const Stack = createNativeStackNavigator();

const AppStack = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        console.log("Token from storage:", token);
        setInitialRoute(token ? "HomeScreen" : "Login");
      } catch (error) {
        console.log("Error checking token:", error);
        setInitialRoute("Login");
      }
    };

    checkToken();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ gestureEnabled: false, headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="HomeScreen" component={TabNavigator} />
      <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="SelectAddressScreen" component={SelectAddressScreen} />
      <Stack.Screen name="OrderScreen" component={OrderScreen} />
      <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
      {/* ✅ Màn hình địa chỉ */}
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="CreateAddressScreen" component={CreateAddressScreen} />
      <Stack.Screen name="EditAddressScreen" component={EditAddressScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
