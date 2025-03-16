// TabNavigator.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import CartScreen from "./screens/CartScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import OrderScreen from "./screens/OrderScreen";
import ProfileScreen from "./screens/ProfileScreen"; // 1) Import ProfileScreen
import AddressScreen from "./screens/AddressScreen"; // 2) Import AddressScreen
import ProfileInfoScreen from "./screens/ProfileInfoScreen";
const Stack = createNativeStackNavigator();

// Màn hình placeholder cho Liked
const PlaceholderScreen = ({ title }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>{title} Screen</Text>
  </View>
);

const TabContent = ({
  activeTab,
  setActiveTab,
  navigation,
  cartItems,
  setCartItems,
}) => {
  // Dựa trên activeTab => render màn hình tương ứng
  const renderScreen = () => {
    switch (activeTab) {
      case "Home":
        return <HomeScreen navigation={navigation} />;
      case "Cart":
        return (
          <CartScreen
            cartItems={cartItems}
            setCartItems={setCartItems}
            navigation={navigation}
          />
        );
      case "Liked":
        return <PlaceholderScreen title="Liked" />;
      case "Profile":
        // 3) Truyền navigation vào ProfileScreen
        return (
          <ProfileScreen
            navigation={navigation}
          />
        );
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  const ACTIVE_COLOR = "#7E6C6C";

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Custom Bottom Tab */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("Home")}>
          <Ionicons
            name="home"
            size={24}
            color={activeTab === "Home" ? ACTIVE_COLOR : "#888"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "Home" && { color: ACTIVE_COLOR, fontWeight: "bold" },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("Cart")}>
          <Ionicons
            name="cart-outline"
            size={24}
            color={activeTab === "Cart" ? ACTIVE_COLOR : "#888"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "Cart" && { color: ACTIVE_COLOR, fontWeight: "bold" },
            ]}
          >
            Cart
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("Liked")}>
          <Ionicons
            name="heart-outline"
            size={24}
            color={activeTab === "Liked" ? ACTIVE_COLOR : "#888"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "Liked" && { color: ACTIVE_COLOR, fontWeight: "bold" },
            ]}
          >
            Liked
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("Profile")}>
          <Ionicons
            name="person-outline"
            size={24}
            color={activeTab === "Profile" ? ACTIVE_COLOR : "#888"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "Profile" && { color: ACTIVE_COLOR, fontWeight: "bold" },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TabNavigator = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [cartItems, setCartItems] = useState([]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs">
        {(props) => (
          <TabContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cartItems={cartItems}
            setCartItems={setCartItems}
            {...props}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ProductDetailScreen">
        {(props) => (
          <ProductDetailScreen
            {...props}
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        )}
      </Stack.Screen>

      {/* Đăng ký CheckoutScreen */}
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />

      {/* Đăng ký OrderScreen */}
      <Stack.Screen name="OrderScreen" component={OrderScreen} />

      {/* 4) Đăng ký AddressScreen */}
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="ProfileInfoScreen" component={ProfileInfoScreen} />
    </Stack.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenContainer: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    height: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabButton: { alignItems: "center", justifyContent: "center" },
  tabText: { fontSize: 12, color: "#888", marginTop: 4 },
  placeholderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  placeholderText: { fontSize: 20, color: "#333" },
});
