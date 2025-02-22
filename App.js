import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { AsyncStorageProvider } from "./context/AsyncStorageContext"; // Cập nhật đường dẫn đúng
import AppStack from "./navigator/AppStack";
import { StripeProvider } from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY } from "@env";

export default function App() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLIC_KEY}>
      <>
        <StatusBar animated={true} />
        <NavigationContainer>
          <AsyncStorageProvider>
            <AppStack />
          </AsyncStorageProvider>
        </NavigationContainer>
      </>
    </StripeProvider>
  );
}
