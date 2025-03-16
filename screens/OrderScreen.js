// screens/OrderScreen.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import Header from "../components/Header"; // Global header (sidebar)
import { Ionicons } from "@expo/vector-icons";

// Dữ liệu giả lập đơn hàng
const mockOrders = [
  {
    id: "1",
    date: "24/02/2025",
    orderCode: "#8947822",
    status: "Đã hủy", // hoặc "Đang giao", "Đã giao"...
    productName: "Máy xông khí dung Yuwell 403M",
    price: 1291200,
  },
  {
    id: "2",
    date: "27/01/2025",
    orderCode: "#576886",
    status: "Đang giao",
    productName: "KLENZIT C GLENMARK 15G",
    price: 109000,
  },
];

// Tabs cho lọc đơn hàng
const orderTabs = [
  { id: "all", title: "Tất cả" },
  { id: "cancel", title: "Đã hủy" },
  { id: "pending", title: "Đang giao" },
];

const OrderScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  // Lọc đơn hàng theo tab
  const filteredOrders = mockOrders.filter((order) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "cancel") return order.status === "Đã hủy";
    if (selectedTab === "pending") return order.status === "Đang giao";
    return true;
  });

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderTopRow}>
        <Text style={styles.orderDate}>
          Đơn hàng {item.date} {item.orderCode}
        </Text>
        <Text
          style={[
            styles.orderStatus,
            item.status === "Đã hủy" && { color: "#FF4D4F" },
          ]}
        >
          {item.status}
        </Text>
      </View>
      <Text style={styles.productName}>{item.productName}</Text>
      <Text style={styles.priceText}>
        {item.price.toLocaleString("vi-VN")}đ
      </Text>
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.detailButton}>
          <Text style={styles.detailButtonText}>Xem chi tiết</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyAgainButton}>
          <Text style={styles.buyAgainButtonText}>Mua lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Global Header (Sidebar) */}
      <Header />

      {/* Phần tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#ccc" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm tên sản phẩm, tên đơn..."
          placeholderTextColor="#bbb"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {orderTabs.map((tab) => {
          const isActive = tab.id === selectedTab;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Text style={[styles.tabButtonText, isActive && { color: "#fff" }]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Danh sách đơn hàng */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ color: "#333" }}>Không có đơn hàng.</Text>
          </View>
        }
      />

      {/* Bottom Tab Navigator */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.bottomTabButton}
          onPress={() => navigation.navigate("MainTabs", { activeTab: "Home" })}
        >
          <Ionicons name="home" size={24} color="#888" />
          <Text style={styles.bottomTabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomTabButton}
          onPress={() => navigation.navigate("MainTabs", { activeTab: "Cart" })}
        >
          <Ionicons name="cart-outline" size={24} color="#888" />
          <Text style={styles.bottomTabText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomTabButton}
          onPress={() => navigation.navigate("MainTabs", { activeTab: "Liked" })}
        >
          <Ionicons name="heart-outline" size={24} color="#888" />
          <Text style={styles.bottomTabText}>Liked</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomTabButton}
          onPress={() => navigation.navigate("MainTabs", { activeTab: "Profile" })}
        >
          <Ionicons name="person-outline" size={24} color="#888" />
          <Text style={styles.bottomTabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Nền trắng
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  tabButton: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  tabButtonActive: {
    backgroundColor: "#333", // Nút active là xám đen
  },
  tabButtonText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  orderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  orderDate: {
    color: "#333",
    fontSize: 14,
  },
  orderStatus: {
    fontSize: 14,
    color: "#4cd137",
  },
  productName: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  priceText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 4,
  },
  detailButton: {
    backgroundColor: "#333", // Nút xám đen
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  buyAgainButton: {
    backgroundColor: "#333", // Nút xám đen
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buyAgainButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  // Bottom Tab Navigator style
  bottomTabBar: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    justifyContent: "space-around",
    alignItems: "center",
  },
  bottomTabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  bottomTabText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
});
