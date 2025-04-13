import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { AsyncStorageProvider } from "./context/AsyncStorageContext";
import AppStack from "./navigator/AppStack";
import { StripeProvider } from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Thêm dòng này

export default function App() {
  useEffect(() => {
    AsyncStorage.removeItem("userToken"); // 👈 Chạy 1 lần để xóa token cũ
  }, []);

  return (
    <StripeProvider publishableKey={STRIPE_PUBLIC_KEY}>
      <NavigationContainer>
        <AsyncStorageProvider>
          <StatusBar animated={true} />
          <AppStack />
        </AsyncStorageProvider>
      </NavigationContainer>
    </StripeProvider>
  );
}
