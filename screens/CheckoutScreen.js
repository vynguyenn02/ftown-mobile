import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import orderApi from "../api/orderApi";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../context/ThemeContext"; // ✅ import ThemeContext

const CheckoutScreen = ({ route, navigation }) => {
  const { theme } = useContext(ThemeContext); // ✅ lấy theme
  const { checkoutData, selectedAddress } = route.params || {};
  const [shippingAddress, setShippingAddress] = useState(() => selectedAddress || checkoutData?.shippingAddresses?.find(addr => addr.isDefault) || null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    if (route.params?.selectedAddress) {
      setShippingAddress(route.params.selectedAddress);
    }
  }, [route.params?.selectedAddress]);

  useEffect(() => {
    const fetchAccountId = async () => {
      const storedId = await AsyncStorage.getItem("accountId");
      if (storedId) {
        setAccountId(parseInt(storedId));
      }
    };
    fetchAccountId();
  }, []);

  if (!checkoutData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Không có dữ liệu checkout.</Text>
      </SafeAreaView>
    );
  }

  const handleSelectAddress = () => {
    navigation.navigate("SelectAddressScreen", {
      addresses: checkoutData.shippingAddresses,
      checkoutData,
      selectedAddress: shippingAddress,
      accountId,
    });
  };

  const handlePay = async () => {
    if (!shippingAddress) {
      Alert.alert("Chưa chọn địa chỉ", "Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    if (!accountId) {
      Alert.alert("Thiếu thông tin", "Không tìm thấy tài khoản. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const payload = {
        accountId,
        checkOutSessionId: checkoutData.checkOutSessionId,
        shippingAddressId: shippingAddress.addressId,
        paymentMethod: selectedPaymentMethod,
      };

      const response = await orderApi.createOrder(payload);
      if (response.data.status) {
        const order = response.data.data;

        if (order.paymentMethod === "PAYOS" && order.paymentUrl) {
          await WebBrowser.openBrowserAsync(order.paymentUrl);
        }

        navigation.reset({
          index: 1,
          routes: [
            { name: "HomeScreen" },
            { name: "OrderScreen", params: { status: "Pending Confirmed" } },
          ],
        });
      } else {
        Alert.alert("Lỗi", response.data.message);
      }
    } catch (err) {
      console.error("Tạo đơn hàng lỗi:", err?.response?.data || err.message);
      Alert.alert("Lỗi", err?.response?.data?.message || "Không thể tạo đơn hàng");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Xác nhận đơn hàng</Text>
        <Ionicons name="cart-outline" size={24} color={theme.text} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.blockSection, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Danh sách sản phẩm</Text>
          {checkoutData.items.map((item) => (
            <View key={item.productVariantId} style={[styles.productItem, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.productName, { color: theme.text }]}>{item.productName}</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {item.imageUrl && (
                  <Image source={{ uri: item.imageUrl }} style={styles.productImage} resizeMode="contain" />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.productDetail, { color: theme.text }]}>Size: {item.size}</Text>
                  <View style={styles.colorRow}>
                    <Text style={[styles.productDetail, { color: theme.text }]}>Color: </Text>
                    <View style={[styles.colorCircle, { backgroundColor: item.color || '#ccc' }]} />
                  </View>
                  <Text style={[styles.productDetail, { color: theme.text }]}>Số lượng: {item.quantity}</Text>
                  <Text style={[styles.productDetail, { color: theme.text }]}>Giá mua: {item.priceAtPurchase.toLocaleString("vi-VN")} ₫</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.blockSection, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Địa chỉ giao hàng</Text>
            <TouchableOpacity onPress={handleSelectAddress}>
              <Text style={[styles.changeText, { color: theme.primary }]}>Thay đổi</Text>
            </TouchableOpacity>
          </View>
          {shippingAddress ? (
            <View style={[styles.addressContainer, { backgroundColor: theme.background }]}>
              <Text style={[styles.addressText, { color: theme.text }]}>{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.district}, {shippingAddress.province}, {shippingAddress.country}</Text>
              <Text style={[styles.addressText, { color: theme.text }]}>Người nhận: {shippingAddress.recipientName} - {shippingAddress.recipientPhone}</Text>
              <Text style={[styles.addressText, { color: theme.text }]}>Email: {shippingAddress.email}</Text>
            </View>
          ) : (
            <Text style={[styles.value, { color: theme.text }]}>Không có địa chỉ được chọn.</Text>
          )}
        </View>

        <View style={[styles.blockSection, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Phương thức thanh toán</Text>
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            {checkoutData.availablePaymentMethods.map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.methodButton,
                  { borderColor: theme.border },
                  selectedPaymentMethod === method && { backgroundColor: theme.text, borderColor: theme.text },
                ]}
                onPress={() => setSelectedPaymentMethod(method)}
              >
                <Text style={{ color: selectedPaymentMethod === method ? theme.background : theme.text }}>{method}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.blockSection, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Thông tin thanh toán</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.text }]}>Tổng tiền sản phẩm:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{checkoutData.subTotal.toLocaleString("vi-VN")} ₫</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.text }]}>Phí vận chuyển:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{checkoutData.shippingCost.toLocaleString("vi-VN")} ₫</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.text }]}>Tổng cộng:</Text>
            <Text style={[styles.total, { color: theme.text }]}>{(checkoutData.subTotal + checkoutData.shippingCost).toLocaleString("vi-VN")} ₫</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.payButton, { backgroundColor: theme.text }]} onPress={handlePay}>
        <Text style={[styles.payButtonText, { color: theme.background }]}>Thanh Toán</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: { paddingRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  blockSection: {
    backgroundColor: "#f9f9f9",
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  changeText: { color: "#007bff" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { fontSize: 14, color: "#333" },
  value: { fontSize: 14, color: "#444" },
  total: { fontSize: 15, color: "#000", fontWeight: "bold" },
  addressContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  addressText: { fontSize: 14, color: "#333", marginBottom: 4 },
  methodButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    borderRadius: 6,
  },
  methodButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  productItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productName: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 4 },
  productDetail: { fontSize: 13, color: "#666", marginTop: 2 },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  colorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  payButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    margin: 16,
  },
  payButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
