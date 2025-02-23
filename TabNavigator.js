import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const PlaceholderScreen = ({ name }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>{name} Screen</Text>
  </View>
);

const TabNavigator = ({ navigation }) => {
  const [activeTab, setActiveTab] = React.useState("Home");

  const renderScreen = () => {
    switch (activeTab) {
      case "Home":
        return <HomeScreen />;
      case "Category":
        return <PlaceholderScreen name="Danh mục" />;
      case "Collection":
        return <PlaceholderScreen name="Bộ Sưu Tập" />;
      case "QRPayment":
        return <PlaceholderScreen name="Thanh toán QR" />;
      case "Account":
        return <PlaceholderScreen name="Tài khoản" />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Màn hình chính */}
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Custom Bottom Tab */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("Home")}>
          <MaterialIcons name="home" size={24} color={activeTab === "Home" ? "#000" : "#888"} />
          <Text style={[styles.tabText, activeTab === "Home" && styles.activeText]}>Trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("Category")}>
          <Ionicons name="list-outline" size={24} color={activeTab === "Category" ? "#000" : "#888"} />
          <Text style={[styles.tabText, activeTab === "Category" && styles.activeText]}>Danh mục</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("Collection")}>
          <Text style={[styles.customIcon, activeTab === "Collection" && styles.activeText]}>NS</Text>
          <Text style={[styles.tabText, activeTab === "Collection" && styles.activeText]}>Bộ Sưu Tập</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("QRPayment")}>
          <FontAwesome5 name="qrcode" size={24} color={activeTab === "QRPayment" ? "#000" : "#888"} />
          <Text style={[styles.tabText, activeTab === "QRPayment" && styles.activeText]}>Thanh toán QR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("Account")}>
          <Ionicons name="person-outline" size={24} color={activeTab === "Account" ? "#000" : "#888"} />
          <Text style={[styles.tabText, activeTab === "Account" && styles.activeText]}>Tài khoản</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabButton: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 12,
    color: "#888",
  },
  activeText: {
    color: "#000",
    fontWeight: "bold",
  },
  customIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#888",
  },
});
