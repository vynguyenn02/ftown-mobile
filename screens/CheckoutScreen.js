// screens/CheckoutScreen.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CheckoutScreen = ({ navigation }) => {
  // Payment Method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");
  // Delivery Address
  const [selectedAddress, setSelectedAddress] = useState("addr1");

  const handleBack = () => {
    // Quay về CartScreen (hoặc goBack bình thường)
    navigation.goBack();
  };

  const handlePay = () => {
    // Xử lý logic thanh toán
    alert("Thanh toán thành công!");
  };

  // Danh sách phương thức thanh toán (giả lập)
  const paymentMethods = ["COD"];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận đơn hàng</Text>
        {/* Giỏ hàng */}
        <View style={styles.cartIconContainer}>
          <Ionicons name="cart-outline" size={24} color="#000" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </View>
      </View>

      {/* Nội dung chính */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <View style={styles.paymentMethodsContainer}>
          {paymentMethods.map((method) => {
            const isSelected = selectedPaymentMethod === method;
            return (
              <TouchableOpacity
                key={method}
                style={styles.paymentMethodRow}
                onPress={() => setSelectedPaymentMethod(method)}
              >
                <Ionicons
                  name={isSelected ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color="#000"
                />
                <Text style={styles.paymentMethodText}>{method}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Delivery Address */}
        <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
        <View style={styles.addressContainer}>
          {/* Địa chỉ 1 */}
          <TouchableOpacity
            style={[
              styles.addressRow,
              selectedAddress === "addr1" && styles.selectedAddressRow,
            ]}
            onPress={() => setSelectedAddress("addr1")}
          >
            <Ionicons
              name={
                selectedAddress === "addr1"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={20}
              color={selectedAddress === "addr1" ? "#fff" : "#000"}
            />
            <View style={styles.addressTextContainer}>
              <Text
                style={[
                  styles.addressName,
                  selectedAddress === "addr1" && styles.selectedAddressText,
                ]}
              >
                Selina K
              </Text>
              <Text
                style={[
                  styles.addressDetail,
                  selectedAddress === "addr1" && styles.selectedAddressText,
                ]}
              >
                21/3, Ragava Street, Silver tone, Kodaikanal - 655 789
              </Text>
            </View>
          </TouchableOpacity>

          {/* Địa chỉ 2 */}
          <TouchableOpacity
            style={[
              styles.addressRow,
              selectedAddress === "addr2" && styles.selectedAddressRow,
            ]}
            onPress={() => setSelectedAddress("addr2")}
          >
            <Ionicons
              name={
                selectedAddress === "addr2"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={20}
              color={selectedAddress === "addr2" ? "#fff" : "#000"}
            />
            <View style={styles.addressTextContainer}>
              <Text
                style={[
                  styles.addressName,
                  selectedAddress === "addr2" && styles.selectedAddressText,
                ]}
              >
                Raghu
              </Text>
              <Text
                style={[
                  styles.addressDetail,
                  selectedAddress === "addr2" && styles.selectedAddressText,
                ]}
              >
                44, Arcot Road, Down..., ??? ??? ???...
              </Text>
            </View>
          </TouchableOpacity>

          {/* Nút thêm địa chỉ mới */}
          <TouchableOpacity style={styles.addNewAddressButton}>
            <Text style={styles.addNewAddressText}>+ Thêm địa chỉ mới</Text>
          </TouchableOpacity>
        </View>

        {/* Danh sách sản phẩm */}
        <View style={styles.productListContainer}>
          <View style={styles.productListHeader}>
            <Text style={styles.productListTitle}>Danh sách sản phẩm</Text>
            <TouchableOpacity>
              <Text style={styles.viewOtherProducts}>Xem sản phẩm khác</Text>
            </TouchableOpacity>
          </View>

          {/* Ví dụ 1 sản phẩm */}
          <View style={styles.productItem}>
            <Text style={styles.productName}>
              Sữa rửa mặt On: The Body Rice Therapy Heartleaf Acne Cleanser làm
              sạch sâu không gây khô da (165ml)
            </Text>
            <Text style={styles.productPrice}>165.000đ</Text>
            <Text style={styles.productCoinText}>
              Đổi 109 coin để được giảm giá 1.090đ
            </Text>
            <Text style={styles.productQty}>x1 Tuýp</Text>
          </View>
        </View>

        {/* Thông tin thanh toán */}
        <View style={styles.paymentInfoContainer}>
          <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Tổng tiền</Text>
            <Text style={styles.paymentValue}>165.000đ</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Giảm giá trực tiếp</Text>
            <Text style={styles.paymentValue}>0đ</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Giảm giá voucher</Text>
            <Text style={styles.paymentValue}>0đ</Text>
          </View>

          <View style={[styles.paymentRow, { marginTop: 6 }]}>
            <Text style={[styles.paymentLabel, { fontWeight: "bold" }]}>
              Thành tiền
            </Text>
            <Text style={[styles.paymentValue, styles.finalPrice]}>165.000đ</Text>
            <Text style={styles.coinEarn}>+165 coin</Text>
          </View>
        </View>

        {/* Ghi chú */}
        <Text style={styles.noteText}>
          Bằng cách nhấn “Thanh Toán”, bạn đồng ý và chấp nhận các điều khoản sử
          dụng của FunkyTown.
        </Text>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cartIconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF3D3D",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

  /* Payment Method */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  paymentMethodsContainer: {
    marginBottom: 8,
  },
  paymentMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  paymentMethodText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },

  /* Address */
  addressContainer: {
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  selectedAddressRow: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  addressTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  addressName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
    color: "#000",
  },
  addressDetail: {
    fontSize: 13,
    color: "#777",
  },
  selectedAddressText: {
    color: "#fff",
  },
  addNewAddressButton: {
    marginLeft: 10,
    marginTop: 5,
  },
  addNewAddressText: {
    color: "#FF3D3D",
    fontWeight: "bold",
  },

  /* Danh sách sản phẩm */
  productListContainer: {
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
  },
  productListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  productListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  viewOtherProducts: {
    fontSize: 14,
    color: "#007bff",
  },
  productItem: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  productCoinText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  productQty: {
    fontSize: 12,
    color: "#999",
  },

  /* Thông tin thanh toán */
  paymentInfoContainer: {
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#333",
  },
  paymentValue: {
    fontSize: 14,
    color: "#333",
  },
  finalPrice: {
    color: "#FF3D3D",
    fontWeight: "bold",
    marginLeft: 8,
  },
  coinEarn: {
    color: "#666",
    marginLeft: 6,
    fontSize: 13,
    alignSelf: "center",
  },

  /* Ghi chú */
  noteText: {
    fontSize: 13,
    color: "#777",
    marginHorizontal: 16,
    marginTop: 8,
  },

  /* Pay Button */
  payButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    margin: 16,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
