import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// Import Header (sidebar) – hiển thị trên tất cả các screen nếu cần
import Header from "../components/Header";

const CartScreen = ({ cartItems, setCartItems, navigation }) => {
  // Tính tổng tiền chỉ dựa trên những sản phẩm được chọn
  const subTotal = cartItems.reduce((acc, item) => {
    // Nếu item.selected === false, bỏ qua; nếu chưa có, xem như true.
    if (item.selected === false) return acc;
    return acc + item.price * item.quantity;
  }, 0);
  const shippingFee = subTotal > 0 ? 6.0 : 0; // Nếu không có sản phẩm nào được chọn, phí ship = 0
  const bagTotal = subTotal + shippingFee;

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Toggle checkbox của sản phẩm
  const toggleSelect = (id) => {
    setCartItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, selected: p.selected === false ? true : false } : p
      )
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
      {/* Checkbox */}
      <TouchableOpacity onPress={() => toggleSelect(item.id)}>
        <Ionicons
          name={item.selected === false ? "checkbox-outline" : "checkbox"}
          size={20}
          color="#333"
        />
      </TouchableOpacity>

      <Image source={item.image} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => {
              if (item.quantity > 1) {
                setCartItems((prev) =>
                  prev.map((p) =>
                    p.id === item.id ? { ...p, quantity: p.quantity - 1 } : p
                  )
                );
              }
            }}
          >
            <Ionicons name="remove" size={16} color="#000" />
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => {
              setCartItems((prev) =>
                prev.map((p) =>
                  p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
                )
              );
            }}
          >
            <Ionicons name="add" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cartItemActions}>
        <Text style={styles.cartItemSize}>{item.size || "S"}</Text>
        <TouchableOpacity onPress={() => removeItem(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#FF4D4F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Footer hiển thị Totals
  const renderFooter = () => (
    <View style={styles.totalsContainer}>
      <View style={styles.totalsRow}>
        <Text style={styles.totalsLabel}>Sub Total</Text>
        <Text style={styles.totalsValue}>${subTotal.toFixed(2)}</Text>
      </View>
      <View style={styles.totalsRow}>
        <Text style={styles.totalsLabel}>Shipping</Text>
        <Text style={styles.totalsValue}>${shippingFee.toFixed(2)}</Text>
      </View>
      <View style={styles.totalsRow}>
        <Text style={[styles.totalsLabel, { fontWeight: "bold" }]}>
          Bag Total
        </Text>
        <Text style={[styles.totalsValue, { color: "#FF3D00", fontWeight: "bold" }]}>
          ${bagTotal.toFixed(2)}
        </Text>
      </View>
      {/* Khoảng trống */}
      <View style={{ height: 80 }} />
    </View>
  );

  const handleCheckout = () => {
    navigation.navigate("CheckoutScreen");
  };

  const handleBackToProduct = () => {
    if (cartItems.length > 0) {
      navigation.navigate("ProductDetailScreen", { product: cartItems[0] });
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { position: "relative" }]}>
      {/* Global Header (sidebar) */}
      <Header />

      {/* Local Header cho CartScreen */}
      <View style={styles.localHeader}>
        <TouchableOpacity onPress={handleBackToProduct} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.localHeaderTitle}>Shopping Bag</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>Your cart is empty.</Text>
          </View>
        }
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      />

      {/* Nút Proceed to Checkout */}
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  // Local header (CartScreen)
  localHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  backButton: { marginRight: 10 },
  localHeaderTitle: { fontSize: 20, fontWeight: "bold" },
  cartIconContainer: { position: "relative" },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF3D3D",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  cartItemContainer: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cartItemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  cartItemDetails: { flex: 1 },
  cartItemName: { fontSize: 16, fontWeight: "600" },
  cartItemPrice: { fontSize: 14, color: "#666", marginVertical: 4 },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: { backgroundColor: "#ddd", borderRadius: 4, padding: 4 },
  qtyValue: { marginHorizontal: 8, fontSize: 14 },
  cartItemActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 60,
  },
  cartItemSize: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  totalsContainer: {
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  totalsLabel: { fontSize: 14, color: "#666" },
  totalsValue: { fontSize: 14, color: "#333" },
  checkoutButton: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 100, // Điều chỉnh nếu cần để tránh tab bar
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    zIndex: 100,
    elevation: 100,
  },
  checkoutButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
