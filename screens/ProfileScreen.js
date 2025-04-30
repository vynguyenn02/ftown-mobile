import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import profileApi from "../api/profileApi";
import { ThemeContext } from "../context/ThemeContext";

const ProfileScreen = ({ navigation }) => {
  const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
  const [refresh, setRefresh] = useState(false); // Force re-render

  const handleToggleTheme = () => {
    toggleTheme();
    setRefresh(prev => !prev); // Trigger re-render
  };

  const ACCENT = theme.primary;
  const BG = theme.background;
  const CARD = theme.card;
  const TEXT = theme.text;
  const SUBTEXT = theme.subtext;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accountId = await AsyncStorage.getItem("accountId");
        if (!accountId) throw new Error("Không tìm thấy accountId");
        const response = await profileApi.getProfile(accountId);
        setProfile(response);
      } catch (error) {
        console.error("Lỗi load profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleViewAllOrders = () => navigation.navigate("OrderScreen");
  const handleOrderStatus = (status) => navigation.navigate("OrderScreen", { status });
  const handleAddressBook = () => navigation.navigate("AddressScreen");
  const handlePersonalInfo = () => navigation.navigate("ProfileInfoScreen");
  const handleFavoriteStyle = () => {
    navigation.navigate("FavoriteStyleScreen"); 
  };
  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: BG }]}>
        <ActivityIndicator size="large" color={ACCENT} />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={[styles.errorContainer, { backgroundColor: BG }]}>
        <Text style={[styles.errorText, { color: TEXT }]}>Không tải được thông tin người dùng.</Text>
      </SafeAreaView>
    );
  }

  const { fullName, phoneNumber, imagePath, loyaltyPoints } = profile;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: BG }]}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Thông tin người dùng */}
        <View style={[styles.card, { backgroundColor: CARD, borderColor: "#FFFFFF33" }]}>
          <View style={styles.userInfoContainer}>
            <Image source={{ uri: imagePath }} style={styles.avatar} />
            <View style={styles.userTextContainer}>
              <Text style={[styles.userName, { color: TEXT }]}>{fullName}</Text>
              <Text style={[styles.userPhone, { color: SUBTEXT }]}>{phoneNumber}</Text>
            </View>
              {loyaltyPoints > 0 && (
                <View style={[styles.coinContainer, { backgroundColor: ACCENT }]}>
                  <Text style={[styles.coinText, { color: BG }]}>{loyaltyPoints}</Text>
                </View>
              )}
          </View>
        </View>

        {/* Đơn hàng */}
        <View style={[styles.card, { backgroundColor: CARD, borderColor: "#FFFFFF33" }]}>
          <View style={styles.orderHeader}>
            <Text style={[styles.sectionTitle, { color: TEXT }]}>Đơn của tôi</Text>
            <TouchableOpacity onPress={handleViewAllOrders}>
              <Text style={[styles.viewAllText, { color: ACCENT }]}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.orderStatusRow}>
            <TouchableOpacity
              style={styles.orderStatusItem}
              onPress={() => handleOrderStatus("Pending Confirmed")}
            >
              <MaterialIcons name="pending-actions" size={28} color={ACCENT} />
              <Text style={[styles.orderStatusLabel, { color: TEXT }]}>Chờ xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderStatusItem}
              onPress={() => handleOrderStatus("Delivered")}
            >
              <Ionicons name="checkmark-done-circle-outline" size={28} color={ACCENT} />
              <Text style={[styles.orderStatusLabel, { color: TEXT }]}>Đã giao</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderStatusItem}
              onPress={() => navigation.navigate("ReturnableScreen")}
            >
              <Ionicons name="refresh-circle-outline" size={28} color={ACCENT} />
              <Text style={[styles.orderStatusLabel, { color: TEXT }]}>Đổi/Trả</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: CARD, borderColor: "#FFFFFF33" }]}>
          <TouchableOpacity style={styles.menuItem} onPress={handleAddressBook}>
            <Ionicons name="location-outline" size={24} color={ACCENT} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: TEXT }]}>Sổ địa chỉ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handlePersonalInfo}>
            <Ionicons name="person-outline" size={24} color={ACCENT} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: TEXT }]}>Thông tin cá nhân</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleFavoriteStyle}>
            <Ionicons name="color-palette-outline" size={24} color={ACCENT} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: TEXT }]}>Phong cách yêu thích</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleToggleTheme}>
            <Ionicons
              name={isDarkMode ? "sunny-outline" : "moon-outline"}
              size={24}
              color={ACCENT}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuText, { color: TEXT }]}>
              {isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16 },
  contentContainer: { padding: 16, paddingBottom: 40 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  userInfoContainer: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 1, borderColor: "#ccc" },
  userTextContainer: { flex: 1, marginLeft: 14 },
  userName: { fontSize: 18, fontWeight: "600" },
  userPhone: { fontSize: 14, marginTop: 4 },
  coinContainer: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  coinText: { fontWeight: "600" },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  viewAllText: { fontSize: 14 },
  orderStatusRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  orderStatusItem: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
  },
  orderStatusLabel: { marginTop: 6, fontSize: 13, textAlign: "center" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.6,
    borderBottomColor: "#5555",
  },
  menuIcon: { marginRight: 12 },
  menuText: { fontSize: 16, fontWeight: "500" },
});
