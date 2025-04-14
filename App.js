import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import AppStack from "./navigator/AppStack";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ thêm dòng này

export default function App() {
  useEffect(() => {
    AsyncStorage.removeItem("userToken");
  }, []);

  return (
    <>
      <StatusBar animated={true} />
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </>
  );
}
