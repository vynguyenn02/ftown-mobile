import React, { useEffect, useState } from "react";
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
import orderApi from "../api/orderApi.js";

export default function OrderTab({ status }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const accountId = await AsyncStorage.getItem("accountId");
      const response = await orderApi.getOrdersByStatus(status, accountId);
      if (response.data.status) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.log("Lỗi fetch đơn:", error);
    } finally {
      setLoading(false);
    }
  };

  const ColorDot = ({ color }) => (
    <View style={[styles.colorDot, { backgroundColor: color || "#ccc" }]} />
  );

  const renderItem = ({ item }) => {
    const total = (item.subTotal || 0) + (item.shippingCost || 0);

    return (
      <TouchableOpacity onPress={() => navigation.navigate("OrderDetailScreen", { orderId: item.orderId })}>
        <View style={styles.card}>
          <Text style={styles.orderId}>Đơn hàng #{item.orderId}</Text>

          {item.items.map((detail, idx) => (
            <View key={idx} style={styles.itemRow}>
              {detail.imageUrl && (
                <Image source={{ uri: detail.imageUrl }} style={styles.image} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{detail.productName || "Sản phẩm"}</Text>
                <View style={styles.colorRow}>
                  <Text style={styles.meta}>Size: {detail.size || "N/A"}</Text>
                  <View style={styles.colorWrap}>
                    <Text style={styles.meta}>Màu:</Text>
                    <ColorDot color={detail.color} />
                  </View>
                </View>
                <Text style={styles.meta}>Số lượng: {detail.quantity}</Text>
                <Text style={styles.meta}>
                  Giá: {(detail.priceAtPurchase || 0).toLocaleString()}đ
                </Text>
              </View>
            </View>
          ))}

          <Text style={styles.meta}>
            Phí vận chuyển: {(item.shippingCost || 0).toLocaleString()}đ
          </Text>
          <Text style={styles.total}>
            Tổng số tiền: {total.toLocaleString()}đ
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return loading ? (
    <ActivityIndicator size="large" color="#FF3B30" style={{ marginTop: 20 }} />
  ) : (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.orderId.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Không có đơn nào.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderId: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 14,
    color: "#000",
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  productName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  meta: {
    fontSize: 13,
    color: "#555",
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 10,
  },
  colorWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  total: {
    fontWeight: "bold",
    marginTop: 6,
    fontSize: 14,
    color: "#000",
  },
});
