import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { MaterialIcons, FontAwesome, Feather } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Header = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current; // Sidebar bắt đầu từ ngoài màn hình (bên phải)

  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSidebarVisible(false));
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.logo}>FUNKYTOWN</Text>
        <TouchableOpacity onPress={openSidebar}>
          <MaterialIcons name="menu" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Sidebar */}
      {isSidebarVisible && (
        <View style={styles.overlay}>
          <Pressable style={styles.overlayTouchable} onPress={closeSidebar} />
          <Animated.View
            style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
          >
            <TouchableOpacity style={styles.closeButton} onPress={closeSidebar}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>

            {/* User Info */}
            <View style={styles.userInfo}>
              <Text style={styles.userWelcome}>Welcome,</Text>
              <Text style={styles.userName}>Justin Nainggolan ▼</Text>
            </View>

            {/* Sidebar Menu */}
            <TouchableOpacity style={styles.menuItem}>
              <FontAwesome name="shopping-bag" size={20} color="black" />
              <Text style={styles.menuText}>MY ORDER</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>5</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <FontAwesome name="heart" size={20} color="black" />
              <Text style={styles.menuText}>WISHLIST</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>11</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Feather name="percent" size={20} color="black" />
              <Text style={styles.menuText}>PROMO & DISCOUNT</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Feather name="gift" size={20} color="black" />
              <Text style={styles.menuText}>SEND A GIFT</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Feather name="settings" size={20} color="black" />
              <Text style={styles.menuText}>SETTINGS</Text>
            </TouchableOpacity>

            {/* Bottom Buttons */}
            <View style={styles.bottomButtons}>
              <TouchableOpacity style={styles.bottomButton}>
                <Text style={styles.bottomButtonText}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomButton}>
                <Text style={styles.bottomButtonText}>FAQ</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.customerServiceButton}>
              <Text style={styles.customerServiceText}>Customer Service</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#412C2C",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10,
    flexDirection: "row",
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    width: "75%",
    height: "100%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 20,
    zIndex: 11,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  userInfo: {
    marginBottom: 20,
  },
  userWelcome: {
    fontSize: 14,
    color: "#777",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  badge: {
    backgroundColor: "#f39c12",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  bottomButton: {
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  bottomButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  customerServiceButton: {
    backgroundColor: "#412C2C",
    paddingVertical: 10,
    marginTop: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  customerServiceText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
