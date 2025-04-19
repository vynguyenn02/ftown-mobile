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
  const { theme } = useContext(ThemeContext);
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
        setProfile(response.data);
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
  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["userToken", "accountId"]);
    navigation.replace("Login");
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
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info */}
        <View style={[styles.card, { backgroundColor: CARD }]}>          
          <View style={styles.userInfoContainer}>
            <Image source={{ uri: imagePath }} style={styles.avatar} />
            <View style={styles.userTextContainer}>
              <Text style={[styles.userName, { color: TEXT }]}>{fullName}</Text>
              <Text style={[styles.userPhone, { color: SUBTEXT }]}>{phoneNumber}</Text>
            </View>
            <View style={[styles.coinContainer, { backgroundColor: ACCENT }]}>              
              <Text style={[styles.coinText, { color: BG }]}>{loyaltyPoints}</Text>
            </View>
          </View>
        </View>

        {/* Orders */}
        <View style={[styles.card, { backgroundColor: CARD }]}>          
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
              <Ionicons
                name="checkmark-done-circle-outline"
                size={28}
                color={ACCENT}
              />
              <Text style={[styles.orderStatusLabel, { color: TEXT }]}>Đã giao</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderStatusItem}
              onPress={() => handleOrderStatus("Return")}
            >
              <Ionicons name="refresh-circle-outline" size={28} color={ACCENT} />
              <Text style={[styles.orderStatusLabel, { color: TEXT }]}>Đổi/Trả</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Settings */}
        <View style={[styles.card, { backgroundColor: CARD }]}>          
          <TouchableOpacity style={styles.menuItem} onPress={handleAddressBook}>
            <Ionicons
              name="location-outline"
              size={24}
              color={ACCENT}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuText, { color: TEXT }]}>Sổ địa chỉ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handlePersonalInfo}>
            <Ionicons
              name="person-outline"
              size={24}
              color={ACCENT}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuText, { color: TEXT }]}>Thông tin cá nhân</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: ACCENT }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: BG }]}>Đăng xuất</Text>
        </TouchableOpacity>

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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfoContainer: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  userTextContainer: { flex: 1, marginLeft: 12 },
  userName: { fontSize: 18, fontWeight: "600" },
  userPhone: { fontSize: 14, marginTop: 4 },
  coinContainer: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  coinText: { fontWeight: "600" },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  viewAllText: { fontSize: 14 },
  orderStatusRow: { flexDirection: "row", justifyContent: "space-around" },
  orderStatusItem: { alignItems: "center", flex: 1 },
  orderStatusLabel: { marginTop: 6, fontSize: 13 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  menuIcon: { marginRight: 12 },
  menuText: { fontSize: 16, fontWeight: "500" },
  logoutButton: { paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 8 },
  logoutText: { fontSize: 16, fontWeight: "600" },
});
