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
import Header from "../components/Header"; 
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }) => {
  const userName = "Nguyễn Ngọc Tường Vy";
  const userPhone = "0387 502 824";
  const userAvatar = "https://picsum.photos/200"; 
  const userCoin = 109;

  const handleViewAllOrders = () => {
    navigation.navigate("OrderScreen");
  };

  const handleOrderStatus = (status) => {
    alert(`Xem đơn hàng: ${status}`);
  };

  const handleAddressBook = () => {
    // Điều hướng sang AddressScreen
    navigation.navigate("AddressScreen");
  };

  const handlePersonalInfo = () => {
    navigation.navigate("ProfileInfoScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Thông tin user */}
        <View style={styles.userInfoContainer}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userPhone}>{userPhone}</Text>
          </View>
          <View style={styles.coinContainer}>
            <Text style={styles.coinText}>{userCoin}</Text>
          </View>
        </View>

        {/* Đơn của tôi */}
        <View style={styles.orderSection}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderHeaderText}>Đơn của tôi</Text>
            <TouchableOpacity onPress={handleViewAllOrders}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.orderStatusRow}>
            <TouchableOpacity
              style={styles.orderStatusItem}
              onPress={() => handleOrderStatus("Dạng xử lý")}
            >
              <MaterialIcons name="pending-actions" size={24} color="#333" />
              <Text style={styles.orderStatusLabel}>Dạng xử lý</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderStatusItem}
              onPress={() => handleOrderStatus("Đã giao")}
            >
              <Ionicons name="checkmark-done-circle-outline" size={24} color="#333" />
              <Text style={styles.orderStatusLabel}>Đã giao</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderStatusItem}
              onPress={() => handleOrderStatus("Đổi/Trả")}
            >
              <Ionicons name="refresh-circle-outline" size={24} color="#333" />
              <Text style={styles.orderStatusLabel}>Đổi/Trả</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Khu vực Tài khoản (2 mục to hơn) */}
        <View style={styles.accountSection}>
          <TouchableOpacity style={styles.bigAccountItem} onPress={handleAddressBook}>
            <Ionicons name="location-outline" size={24} color="#333" style={styles.itemIcon} />
            <Text style={styles.bigAccountItemText}>Sổ địa chỉ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bigAccountItem} onPress={handlePersonalInfo}>
            <Ionicons name="person-outline" size={24} color="#333" style={styles.itemIcon} />
            <Text style={styles.bigAccountItemText}>Thông tin cá nhân</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userPhone: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  coinContainer: {
    backgroundColor: "#999",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  coinText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // Đơn của tôi
  orderSection: {
    backgroundColor: "#fff",
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllText: {
    fontSize: 14,
    color: "#666",
  },
  orderStatusRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  orderStatusItem: {
    alignItems: "center",
    width: 70,
  },
  orderStatusLabel: {
    color: "#333",
    fontSize: 13,
    marginTop: 4,
  },

  // Tài khoản (2 mục to hơn)
  accountSection: {
    backgroundColor: "#fff",
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bigAccountItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemIcon: {
    marginRight: 12,
  },
  bigAccountItemText: {
    fontSize: 18,      // to hơn
    color: "#333",
    fontWeight: "500", // đậm hơn 1 chút
  },
});
