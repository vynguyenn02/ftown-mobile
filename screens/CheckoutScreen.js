// screens/CheckoutScreen.js
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CheckoutScreen = ({ route, navigation }) => {
  // Lấy dữ liệu checkout trả về từ route.params.checkoutData
  const { checkoutData } = route.params || {};
  
  // Nếu checkoutData không tồn tại, hiển thị thông báo
  if (!checkoutData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Không có dữ liệu checkout.</Text>
      </SafeAreaView>
    );
  }
  
  // Destructure các trường cần hiển thị từ checkoutData
  const {
    subTotal,
    shippingCost,
    availablePaymentMethods,
    shippingAddresses,
    shippingAddress,
    items,
  } = checkoutData;
  
  // Hàm xử lý quay lại
  const handleBack = () => {
    navigation.goBack();
  };
  
  // Hàm xử lý thanh toán (tùy chỉnh)
  const handlePay = () => {
    alert("Thanh toán thành công!");
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận đơn hàng</Text>
        <View style={styles.cartIconContainer}>
          <Ionicons name="cart-outline" size={24} color="#000" />
        </View>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hiển thị thông tin thanh toán */}
        <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Tổng tiền:</Text>
          <Text style={styles.value}>
            {subTotal?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phí vận chuyển:</Text>
          <Text style={styles.value}>
            {shippingCost?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phương thức thanh toán:</Text>
          <Text style={styles.value}>
            {availablePaymentMethods ? availablePaymentMethods.join(", ") : ""}
          </Text>
        </View>
        
        {/* Shipping Addresses */}
        <Text style={styles.sectionTitle}>Danh sách địa chỉ giao hàng</Text>
        {shippingAddresses && shippingAddresses.length > 0 ? (
          shippingAddresses.map((addr) => (
            <View key={addr.addressId} style={styles.addressContainer}>
              <Text style={styles.addressText}>
                {addr.address}, {addr.city}, {addr.district}, {addr.province}, {addr.country}
              </Text>
              <Text style={styles.addressText}>
                Người nhận: {addr.recipientName} - {addr.recipientPhone}
              </Text>
              <Text style={styles.addressText}>Email: {addr.email}</Text>
              {addr.isDefault && <Text style={styles.defaultAddress}>Mặc định</Text>}
            </View>
          ))
        ) : (
          <Text style={styles.value}>Không có địa chỉ nào.</Text>
        )}
        
        {/* Shipping Address được chọn */}
        <Text style={styles.sectionTitle}>Địa chỉ giao hàng được chọn</Text>
        {shippingAddress ? (
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.district}, {shippingAddress.province}, {shippingAddress.country}
            </Text>
            <Text style={styles.addressText}>
              Người nhận: {shippingAddress.recipientName} - {shippingAddress.recipientPhone}
            </Text>
            <Text style={styles.addressText}>Email: {shippingAddress.email}</Text>
          </View>
        ) : (
          <Text style={styles.value}>Không có địa chỉ giao hàng được chọn.</Text>
        )}
        
        {/* Danh sách sản phẩm */}
        <Text style={styles.sectionTitle}>Danh sách sản phẩm</Text>
        {items && items.length > 0 ? (
          items.map((item) => (
            <View key={item.productVariantId} style={styles.productItem}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.productDetail}>
                Size: {item.size} | Color: {item.color}
              </Text>
              <Text style={styles.productDetail}>
                Số lượng: {item.quantity}
              </Text>
              <Text style={styles.productDetail}>
                Giá gốc: {item.price?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
              {item.discountApplied > 0 && (
                <Text style={styles.productDetail}>
                  Giá mua: {item.priceAtPurchase?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })} (-{item.discountApplied?.toLocaleString("vi-VN", {style: "currency", currency: "VND"})})
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.value}>Không có sản phẩm nào.</Text>
        )}
      </ScrollView>
      
      {/* Nút Thanh Toán */}
      <TouchableOpacity style={styles.payButton} onPress={handlePay}>
        <Text style={styles.payButtonText}>Thanh Toán</Text>
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
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: { paddingRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  cartIconContainer: { position: "relative" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { fontSize: 14, color: "#333" },
  value: { fontSize: 14, color: "#333" },
  addressContainer: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addressText: { fontSize: 14, color: "#333", marginBottom: 4 },
  defaultAddress: { fontSize: 12, color: "#FF3D3D" },
  productItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: { fontSize: 14, fontWeight: "600", marginBottom: 4, color: "#333" },
  productDetail: { fontSize: 13, color: "#666", marginBottom: 2 },
  payButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    margin: 16,
  },
  payButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
