// src/screens/OrderTab.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import orderApi from "../api/orderApi";
import { ThemeContext } from "../context/ThemeContext";

export default function OrderTab({ status }) {
  const { theme } = useContext(ThemeContext);
  const containerBg = theme.mode === "dark" ? "#181818" : theme.background;
  const cardBg = theme.mode === "dark" ? "#2A2A2A" : theme.card;

  const [orders, setOrders] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Reset khi đổi tab/status
  useEffect(() => {
    setOrders([]);
    setPageNumber(1);
  }, [status]);

  // Fetch dữ liệu khi status hoặc page thay đổi
  useEffect(() => {
    let isActive = true;
    (async () => {
      setLoading(true);
      try {
        const accountId = await AsyncStorage.getItem("accountId");
        const resp = await orderApi.getOrdersByStatus(
          status,
          accountId,
          pageNumber,
          pageSize
        );
  
        console.log("📦 Status:", status);
        console.log("🧾 Response:", resp);
  
        // ✅ FIXED: axios trả về .data chứa status và data.items
        if (resp.data.status && isActive) {
          const { items, totalCount, pageSize: ps } = resp.data.data;
  
          console.log("✅ ITEMS RETURNED:", items.length);
  
          setOrders((prev) => {
            const newOrders = pageNumber === 1 ? items : [...prev, ...items];
            console.log("✅ SET ORDERS:", newOrders.length);
            return newOrders;
          });
  
          setTotalPages(Math.ceil(totalCount / ps));
        }
      } catch (e) {
        console.error("❌ Lỗi fetch đơn:", e);
      } finally {
        if (isActive) setLoading(false);
      }
    })();
    return () => {
      isActive = false;
    };
  }, [status, pageNumber]);

  const handleLoadMore = () => {
    if (!loading && pageNumber < totalPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator style={{ marginVertical: 16 }} color={theme.primary} />;
  };

  const ColorDot = ({ color }) => (
    <View style={[styles.colorDot, { backgroundColor: color || "#ccc" }]} />
  );

  const translateStatus = (s) => {
    switch (s?.toLowerCase()) {
      case "completed":
        return "Hoàn thành";
      case "delivered":
        return "Đã giao";
      case "pending confirmed":
        return "Chờ xác nhận";
      case "pendingpayment":
        return "Chờ thanh toán";
      case "confirmed":
        return "Đã xác nhận";
      case "canceled":
        return "Đã huỷ";
      case "return requested":
        return "Đổi/Trả";
      default:
        return s;
    }
  };
  
  const getStatusColorStyle = (s) => {
    switch (s?.toLowerCase()) {
      case "completed":
        return { backgroundColor: "#e0f8ec", color: "#1aa260" };
      case "delivered":
        return { backgroundColor: "#e3f2fd", color: "#2196f3" };
      case "pending confirmed":
        return { backgroundColor: "#fff9c4", color: "#f9a825" };
      case "canceled":
        return { backgroundColor: "#fdecea", color: "#d32f2f" };
      case "confirmed":
        return { backgroundColor: "#f3e5f5", color: "#7b1fa2" };
      case "return requested":
        return { backgroundColor: "#fff3e0", color: "#fb8c00" };
      default:
        return { backgroundColor: "#eee", color: "#555" };
    }
  };
  

  const renderItem = ({ item }) => {
    const total = (item.subTotal || 0) + (item.shippingCost || 0);
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("OrderDetailScreen", { orderId: item.orderId })
        }
      >
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.headerRow}>
            <Text style={[styles.orderId, { color: theme.text }]}>
              Đơn hàng #{item.orderId}
            </Text>
            <Text
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getStatusColorStyle(item.status).backgroundColor,
                  color: getStatusColorStyle(item.status).color,
                },
              ]}
            >
              {translateStatus(item.status)}
            </Text>
          </View>

          {item.items.map((d, i) => (
            <View key={i} style={styles.itemRow}>
              {d.imageUrl && (
                <Image source={{ uri: d.imageUrl }} style={styles.image} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.productName, { color: theme.text }]}>
                  {d.productName || "Sản phẩm"}
                </Text>
                <View style={styles.colorRow}>
                  <Text style={[styles.meta, { color: theme.subtext }]}>
                    Size: {d.size || "N/A"}
                  </Text>
                  <View style={styles.colorWrap}>
                    <Text style={[styles.meta, { color: theme.subtext }]}>Màu:</Text>
                    <ColorDot color={d.color} />
                  </View>
                </View>
                <Text style={[styles.meta, { color: theme.subtext }]}>
                  Số lượng: {d.quantity}
                </Text>
                <Text style={[styles.meta, { color: theme.subtext }]}>
                  Giá: {d.priceAtPurchase?.toLocaleString() || 0}đ
                </Text>
              </View>
            </View>
          ))}

          <Text style={[styles.meta, { color: theme.subtext }]}>
            Phí vận chuyển: {item.shippingCost?.toLocaleString() || 0}đ
          </Text>
          <Text style={[styles.total, { color: theme.text }]}>
            Tổng tiền: {total.toLocaleString()}đ
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && pageNumber === 1) {
    return (
      <View style={[styles.loadingWrap, { backgroundColor: containerBg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: containerBg }}
      data={orders}
      keyExtractor={(item) => item.orderId.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        !loading && (
          <Text style={[styles.emptyText, { color: theme.subtext }]}>
            Không có đơn nào.
          </Text>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 20 },
  card: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  orderId: { fontSize: 14, fontWeight: "bold" },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  image: { width: 70, height: 70, borderRadius: 8, backgroundColor: "#eee" },
  productName: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  colorWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  meta: { fontSize: 13 },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginLeft: 4,
  },
  total: { fontSize: 14, fontWeight: "bold", marginTop: 6 },
});
