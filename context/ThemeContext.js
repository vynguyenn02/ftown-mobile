import React, { createContext, useState, useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";
import { LightTheme, DarkTheme } from "../theme/theme";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === "dark");

  useEffect(() => {
    setIsDarkMode(systemScheme === "dark");
  }, [systemScheme]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = useMemo(() => {
    return isDarkMode ? DarkTheme : LightTheme;
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
