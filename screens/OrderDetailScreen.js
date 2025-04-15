import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import orderApi from "../api/orderApi";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";

export default function OrderDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    try {
      const response = await orderApi.getOrderDetail(orderId);
      if (response.data.status) {
        setOrder(response.data.data);
      }
    } catch (err) {
      console.log("Lỗi lấy chi tiết đơn:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm dịch trạng thái sang tiếng Việt
  const translateStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "Hoàn thành";
      case "shipped":
        return "Đã giao";
      case "pending confirmed":
        return "Chờ xác nhận";
      case "pendingpayment":
        return "Chờ thanh toán";
      case "confirmed":
        return "Đã xác nhận";
      case "canceled":
        return "Đã huỷ";
      default:
        return status;
    }
  };

  // Badge màu theo trạng thái
  const getStatusColorStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return { backgroundColor: "#e0f8ec", color: "#1aa260" };
      case "shipped":
        return { backgroundColor: "#e3f2fd", color: "#2196f3" };
      case "pending confirmed":
        return { backgroundColor: "#fff9c4", color: "#f9a825" };
      case "pendingpayment":
        return { backgroundColor: "#fff4e5", color: "#f57c00" };
      case "confirmed":
        return { backgroundColor: "#f3e5f5", color: "#7b1fa2" };
      case "canceled":
        return { backgroundColor: "#fdecea", color: "#d32f2f" };
      default:
        return { backgroundColor: "#eee", color: "#555" };
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#FF3B30" />;
  }

  if (!order) {
    return <Text style={{ textAlign: "center", marginTop: 20 }}>Không tìm thấy đơn hàng.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Thông tin đơn hàng #{order.orderId}</Text>
      </View>

      {/* Thông tin nhận hàng */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thông tin nhận hàng</Text>
        <View style={styles.infoRow}>
          <Ionicons name="person" size={16} color="#333" />
          <Text style={styles.infoText}>{order.fullName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call" size={16} color="#333" />
          <Text style={styles.infoText}>{order.phoneNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={16} color="#333" />
          <Text style={styles.infoText}>{order.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Entypo name="location-pin" size={16} color="#333" />
          <Text style={styles.infoText}>
            {order.address}, {order.city}, {order.district}, {order.province}
          </Text>
        </View>
      </View>

      {/* Danh sách sản phẩm */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sản phẩm</Text>
        {order.orderItems.map((item, idx) => (
          <View key={idx} style={styles.productRow}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.meta}>Size: {item.size}</Text>
              <View style={styles.colorRow}>
                <Text style={styles.meta}>Màu:</Text>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              </View>
              <Text style={styles.meta}>Số lượng: {item.quantity}</Text>
              <Text style={styles.meta}>Giá: {item.priceAtPurchase.toLocaleString()}đ</Text>
              {item.discountApplied > 0 && (
                <Text style={styles.meta}>
                  Đã giảm: {item.discountApplied.toLocaleString()}đ
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Tổng kết đơn */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tổng kết</Text>
        <Text style={styles.meta}>Phương thức thanh toán: {order.paymentMethod}</Text>
        <Text style={styles.meta}>
          Phí vận chuyển: {order.shippingCost.toLocaleString()}đ
        </Text>
        <Text style={styles.total}>
          Tổng cộng: {(order.orderTotal + order.shippingCost).toLocaleString()}đ
        </Text>
        
        {/* Trạng thái hiển thị đẹp */}
        <View style={[styles.statusBadge, getStatusColorStyle(order.status)]}>
          <Text style={styles.statusText}>{translateStatus(order.status)}</Text>
        </View>

        <Text style={styles.meta}>
          Ngày tạo: {new Date(order.createdDate).toLocaleString()}
        </Text>
      </View>

      {/* Nút hành động */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.blackButton} onPress={() => navigation.navigate("ReviewScreen", { orderId: order.orderId })}>
          <Text style={styles.blackButtonText}>Đánh giá</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.whiteButton} onPress={() => navigation.navigate("ReturnRequestScreen", { orderId: order.orderId })}>
          <Text style={styles.whiteButtonText}>Đổi/Trả</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9F9F9",
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#444",
    flex: 1,
  },
  productRow: {
    flexDirection: "row",
    marginBottom: 14,
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
    marginBottom: 6,
    color: "#000",
  },
  meta: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },
  colorRow: {
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
    fontSize: 15,
    color: "#000",
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 30,
    gap: 10,
  },
  blackButton: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  blackButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  whiteButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  whiteButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});