import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import TabNavigator from "../TabNavigator"; // Import Tab Navigation

const Stack = createNativeStackNavigator();

const AppStack = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setInitialRoute(token ? "Main" : "Login");
      } catch (error) {
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
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HomeScreen" component={TabNavigator} options={{ headerShown: false }} />
      {/* <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: false }} /> */}
      <Stack.Screen name="ProductDetailScreen" component={TabNavigator}  />

    </Stack.Navigator>
  );
};

export default AppStack;
