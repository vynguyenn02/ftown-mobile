import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, LogBox } from 'react-native';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppStack from './navigator/AppStack';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Tắt warning chứa “spreading a "key" prop into JSX”
LogBox.ignoreLogs([
  'A props object containing a "key" prop is being spread into JSX',
]);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationProvider>
        <ThemeProvider>
          <StatusBar animated />
          <NavigationContainer>
            <AppStack />
          </NavigationContainer>
          <Toast />
        </ThemeProvider>
      </NotificationProvider>
    </GestureHandlerRootView>
  );
}
