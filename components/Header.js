import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import profileApi from "../api/profileApi";
import { ThemeContext } from "../context/ThemeContext";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Header = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [profile, setProfile] = useState(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accountId = await AsyncStorage.getItem("accountId");
        if (accountId) {
          const res = await profileApi.getProfile(accountId);
          setProfile(res.data);
        }
      } catch (err) {
        console.error("Lỗi lấy thông tin khách hàng:", err);
      }
    };
    fetchProfile();
  }, []);

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

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["userToken", "accountId"]);
    navigation.replace("Login");
  };

  return (
    <>
      <View style={[styles.header, { backgroundColor: theme.background }]}>        
        <Text style={[styles.logo, { color: theme.text }]}>FUNKYTOWN</Text>
        <TouchableOpacity onPress={openSidebar}>
          <MaterialIcons name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {isSidebarVisible && (
        <View style={styles.overlay}>
          <Pressable style={styles.overlayTouchable} onPress={closeSidebar} />
          <Animated.View
            style={[
              styles.sidebar,
              { backgroundColor: theme.card, transform: [{ translateX: slideAnim }] },
            ]}
          >
            <TouchableOpacity style={styles.closeButton} onPress={closeSidebar}>
              <MaterialIcons name="close" size={24} color={theme.text} />
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <Text style={[styles.userWelcome, { color: theme.subtext }]}>Xin chào,</Text>
              <Text style={[styles.userName, { color: theme.text }]}>              
                {profile?.fullName || "Người dùng"} ▼
              </Text>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("OrderScreen")}
            >
              <FontAwesome name="shopping-bag" size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Đơn hàng</Text>
              <View style={[styles.badge, { backgroundColor: theme.primary }]}>                
                <Text style={[styles.badgeText, { color: theme.text }]}>5</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <FontAwesome name="heart" size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Yêu thích</Text>
              <View style={[styles.badge, { backgroundColor: theme.primary }]}>                
                <Text style={[styles.badgeText, { color: theme.text }]}>11</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.bottomButtons}>
              <TouchableOpacity
                style={[styles.bottomButton, { borderColor: theme.border }]}
              >
                <Text
                  style={[styles.bottomButtonText, { color: theme.text }]}
                >
                  Giới thiệu
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bottomButton, { borderColor: theme.border }]}
              >
                <Text
                  style={[styles.bottomButtonText, { color: theme.text }]}
                >
                  FAQ
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.customerServiceButton, { backgroundColor: theme.primary }]}
            >
              <Text
                style={[styles.customerServiceText, { color: theme.text }]}
              >
                Liên hệ hỗ trợ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: theme.primary }]}
              onPress={handleLogout}
            >
              <Text style={[styles.logoutText, { color: theme.text }]}>Đăng xuất</Text>
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
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  bottomButton: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  bottomButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  customerServiceButton: {
    paddingVertical: 10,
    marginTop: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  customerServiceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    paddingVertical: 10,
    marginTop: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
