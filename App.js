import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import AppStack from "./navigator/AppStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "./context/ThemeContext"; // ✅ Thêm ThemeProvider

export default function App() {
  useEffect(() => {
    AsyncStorage.removeItem("userToken");
  }, []);

  return (
    <ThemeProvider>
      <StatusBar animated={true} />
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </ThemeProvider>
  );
}
