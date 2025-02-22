import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const AsyncStorageContext = createContext();

export const useAsyncStorage = () => {
  return useContext(AsyncStorageContext);
};

export const AsyncStorageProvider = ({ children }) => {
  const navigation = useNavigation();

  const [data, setData] = useState(null);

  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("your_key");
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load data from AsyncStorage:", error);
    }
  };

  const saveData = async (value) => {
    try {
      await AsyncStorage.setItem("your_key", JSON.stringify(value));
      setData(value);
    } catch (error) {
      console.error("Failed to save data to AsyncStorage:", error);
    }
  };

  const removeItems = async (itemIds) => {
    try {
      const currentData = await AsyncStorage.getItem("your_key");
      if (currentData) {
        const parsedData = JSON.parse(currentData);
        const updatedData = parsedData.filter(
          (item) => !itemIds.includes(item._id)
        );
        await AsyncStorage.setItem("your_key", JSON.stringify(updatedData));
        setData(updatedData);
      }
    } catch (error) {
      console.error("Failed to remove items from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("expToken");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <AsyncStorageContext.Provider
      value={{ data, saveData, removeItems, logout }}
    >
      {children}
    </AsyncStorageContext.Provider>
  );
};
