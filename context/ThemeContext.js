// src/context/ThemeContext.js
import React, { createContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { LightTheme, DarkTheme } from "../theme/theme";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState(systemScheme === "dark" ? DarkTheme : LightTheme);

  const toggleTheme = () => {
    setTheme((prev) => (prev.mode === "light" ? DarkTheme : LightTheme));
  };

  useEffect(() => {
    // Sync theme if system changes
    setTheme(systemScheme === "dark" ? DarkTheme : LightTheme);
  }, [systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
