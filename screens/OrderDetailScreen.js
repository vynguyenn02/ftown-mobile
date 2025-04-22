// screens/OrderDetailScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import orderApi from "../api/orderApi";
import { ThemeContext } from "../context/ThemeContext";

export default function OrderDetailScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountId, setAccountId] = useState(null);

  // Theme-based colors
  const containerBg = theme.mode === "dark" ? "#181818" : theme.background;
  const cardBg = theme.mode === "dark" ? "#2A2A2A" : theme.card;
  const textColor = theme.text;
  const subtext = theme.subtext;
  const primary = theme.primary;

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("accountId");
        if (stored) setAccountId(parseInt(stored, 10));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const resp = await orderApi.getOrderDetail(orderId);
      if (resp.data.status) setOrder(resp.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const translateStatus = (s) => {
    switch (s?.toLowerCase()) {
      case "completed": return "Hoàn thành";
      case "shipped": return "Đã giao";
      case "pending confirmed": return "Chờ xác nhận";
      case "pendingpayment": return "Chờ thanh toán";
      case "confirmed": return "Đã xác nhận";
      case "canceled": return "Đã huỷ";
      default: return s;
    }
  };

  const getStatusStyle = (s) => {
    switch (s?.toLowerCase()) {
      case "completed": return { bg: "#e0f8ec", color: "#1aa260" };
      case "shipped":   return { bg: "#e3f2fd", color: "#2196f3" };
      case "pending confirmed": return { bg: "#fff9c4", color: "#f9a825" };
      case "pendingpayment":     return { bg: "#fff4e5", color: "#f57c00" };
      case "confirmed": return { bg: "#f3e5f5", color: "#7b1fa2" };
      case "canceled":  return { bg: "#fdecea", color: "#d32f2f" };
      default:          return { bg: "#eee", color: "#555" };
    }
  };

  const handleFeedback = async () => {
    if (!accountId) {
      Alert.alert("Thông báo", "Không tìm thấy thông tin tài khoản.");
      return;
    }
    try {
      const resp = await orderApi.getOrdersReturnRequest(accountId, orderId);
      if (resp.data?.data) {
        navigation.navigate("FeedbackScreen", { orderId, returnData: resp.data.data });
      } else {
        Alert.alert("Lỗi", "Không tìm thấy dữ liệu đổi/trả cho đơn này.");
      }
    } catch {
      Alert.alert("Lỗi", "Không thể lấy dữ liệu đổi/trả.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingWrap, { backgroundColor: containerBg }]}>
        <ActivityIndicator size="large" color={primary} />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={[styles.loadingWrap, { backgroundColor: containerBg }]}>
        <Text style={{ color: textColor }}>Không tìm thấy đơn hàng.</Text>
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusStyle(order.status);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: containerBg }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: textColor }]}>
            Đơn #{order.orderId}
          </Text>
        </View>

        {/* Recipient Info */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>
            Thông tin nhận hàng
          </Text>
          <InfoRow icon={<Ionicons name="person" size={16} color={subtext} />} text={order.fullName} textColor={textColor} />
          <InfoRow icon={<Ionicons name="call" size={16} color={subtext} />} text={order.phoneNumber} textColor={textColor} />
          <InfoRow icon={<MaterialIcons name="email" size={16} color={subtext} />} text={order.email} textColor={textColor} />
          <InfoRow
            icon={<Entypo name="location-pin" size={16} color={subtext} />}
            text={`${order.address}, ${order.city}, ${order.district}, ${order.province}`}
            textColor={textColor}
          />
        </View>

        {/* Items */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>Sản phẩm</Text>
          {order.orderItems.map((it, i) => (
            <TouchableOpacity
              key={i}
              style={styles.productRow}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("ProductDetailScreen", { productId: it.productId })
              }
            >
              <Image source={{ uri: it.imageUrl }} style={styles.image} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.productName, { color: textColor }]}>
                  {it.productName}
                </Text>
                <Text style={[styles.meta, { color: subtext }]}>
                  Size: {it.size}
                </Text>
                <View style={styles.colorRow}>
                  <Text style={[styles.meta, { color: subtext }]}>Màu:</Text>
                  <View style={[styles.colorDot, { backgroundColor: it.color }]} />
                </View>
                <Text style={[styles.meta, { color: subtext }]}>
                  SL: {it.quantity}
                </Text>
                <Text style={[styles.meta, { color: subtext }]}>
                  Giá: {it.priceAtPurchase.toLocaleString()}đ
                </Text>
                {it.discountApplied > 0 && (
                  <Text style={[styles.meta, { color: subtext }]}>
                    Giảm: {it.discountApplied.toLocaleString()}đ
                  </Text>
                )}
              </View>
              <Entypo name="chevron-right" size={20} color={subtext} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>Tổng kết</Text>
          <Text style={[styles.meta, { color: subtext }]}>
            Thanh toán: {order.paymentMethod}
          </Text>
          <Text style={[styles.meta, { color: subtext }]}>
            Phí vận chuyển: {order.shippingCost.toLocaleString()}đ
          </Text>
          <Text style={[styles.total, { color: textColor }]}>
            Tổng cộng: {(order.orderTotal + order.shippingCost).toLocaleString()}đ
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.bg },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: statusStyle.color },
              ]}
            >
              {translateStatus(order.status)}
            </Text>
          </View>
          <Text style={[styles.meta, { color: subtext }]}>
            Ngày tạo: {new Date(order.createdDate).toLocaleString()}
          </Text>
        </View>

        {order.status?.toLowerCase() === "completed" && (
        <View style={styles.buttonRow}>
          {/* nút Đánh giá */}
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
            onPress={handleFeedback}
          >
            <Text style={[styles.primaryText, { color: theme.background }]}>
              Đánh giá
            </Text>
          </TouchableOpacity>

          {/* nút Đổi/Trả */}
          <TouchableOpacity
            style={[
              styles.secondaryBtn,
              {
                borderColor: theme.primary,
                backgroundColor: cardBg,
              },
            ]}
            onPress={() => navigation.navigate("ReturnRequestScreen", { orderId })}
          >
            <Text style={[styles.secondaryText, { color: theme.primary }]}>
              Đổi/Trả
            </Text>
          </TouchableOpacity>
        </View>
      )}

      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, text, textColor }) {
  return (
    <View style={styles.infoRow}>
      {icon}
      <Text style={[styles.infoText, { color: textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },

  content: { padding: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },

  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  infoText: { fontSize: 14, flex: 1, marginLeft: 6 },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  productName: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  meta: { fontSize: 13, marginBottom: 2 },

  colorRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginLeft: 4,
  },

  total: { fontSize: 15, fontWeight: "bold", marginTop: 8 },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  statusText: { fontSize: 13, fontWeight: "bold" },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 30,
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  primaryText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});