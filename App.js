import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";

import AppStack from "./navigator/AppStack";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

export default function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <StatusBar animated />
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
        <Toast />
      </ThemeProvider>
    </NotificationProvider>
  );
}
