// screens/ProfileInfoScreen.js
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Ví dụ: Màn hình hiển thị thông tin cá nhân
const ProfileInfoScreen = ({ navigation }) => {
  // Dữ liệu mô phỏng
  const userName = "Nguyễn Ngọc Tường Vy";
  const userPhone = "0387 502 824";
  const userGender = "Thêm thông tin";
  const userBirthday = "21/12/2002";
  const userAvatar = "https://picsum.photos/200";

  // Xử lý nút "Chỉnh sửa"
  const handleEditInfo = () => {
    alert("Chỉnh sửa thông tin cá nhân");
  };

  // Xử lý đổi ảnh đại diện
  const handleChangeAvatar = () => {
    alert("Đổi ảnh đại diện");
  };

  // Điều hướng tab bar
  const goToHome = () => {
    // Di chuyển về Tab chính + tab Home
    navigation.navigate("MainTabs", { activeTab: "Home" });
  };
  const goToCart = () => {
    navigation.navigate("MainTabs", { activeTab: "Cart" });
  };
  const goToLiked = () => {
    navigation.navigate("MainTabs", { activeTab: "Liked" });
  };
  const goToProfile = () => {
    // Quay lại tab Profile
    navigation.navigate("MainTabs", { activeTab: "Profile" });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Thanh Top Bar có nút back */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Thông tin cá nhân</Text>
        {/* Chừa 1 view để icon canh giữa */}
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Phần trên (ảnh đại diện, nền màu) */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          <TouchableOpacity onPress={handleChangeAvatar}>
            <Text style={styles.changeAvatarText}>Thay đổi ảnh đại diện</Text>
          </TouchableOpacity>
        </View>

        {/* Thông tin chi tiết */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Họ và tên</Text>
            <Text style={styles.infoValue}>{userName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số điện thoại</Text>
            <Text style={styles.infoValue}>{userPhone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Giới tính</Text>
            <Text style={styles.infoValue}>{userGender}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày sinh</Text>
            <Text style={styles.infoValue}>{userBirthday}</Text>
          </View>
        </View>

        {/* Nút Chỉnh sửa */}
        <TouchableOpacity style={styles.editButton} onPress={handleEditInfo}>
          <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>

        {/* Khoảng trống */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Thanh Tab Bar ở dưới */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabButton} onPress={goToHome}>
          <Ionicons name="home" size={24} color="#888" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={goToCart}>
          <Ionicons name="cart-outline" size={24} color="#888" />
          <Text style={styles.tabText}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={goToLiked}>
          <Ionicons name="heart-outline" size={24} color="#888" />
          <Text style={styles.tabText}>Liked</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={goToProfile}>
          <Ionicons name="person-outline" size={24} color="#888" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Thanh top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  backButton: {
    paddingRight: 10,
  },

  // Header container
  headerContainer: {
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ccc",
    marginBottom: 8,
  },
  changeAvatarText: {
    fontSize: 14,
    color: "#fff",
    textDecorationLine: "underline",
  },

  // Info container
  infoContainer: {
    backgroundColor: "#fff",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  // Nút Chỉnh sửa
  editButton: {
    marginHorizontal: 16,
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 30,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Tab Bar
  tabBar: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
});
