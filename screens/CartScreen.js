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
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CartScreen = ({ cartItems, setCartItems, navigation }) => {
  const shippingFee = 6.0;
  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const bagTotal = subTotal + shippingFee;

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
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

  const renderFooter = () => (
    <View>
      <View style={styles.promoContainer}>
        <TextInput style={styles.promoInput} placeholder="Promo Code" />
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
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
          <Text style={[styles.totalsLabel, { fontWeight: "bold" }]}>Bag Total</Text>
          <Text style={[styles.totalsValue, { color: "#FF3D00", fontWeight: "bold" }]}>
            ${bagTotal.toFixed(2)}
          </Text>
        </View>
        <View style={{ height: 150 }} />
      </View>
    </View>
  );

  const handleCheckout = () => {
    Alert.alert("Proceed to Checkout", "Chuyển sang màn hình thanh toán");
  };

  const handleBackToProduct = () => {
    if (cartItems.length > 0) {
      navigation.navigate("ProductDetailScreen", { product: cartItems[0] });
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToProduct} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Bag</Text>
        <View style={styles.cartIconContainer}>
          <Ionicons name="cart-outline" size={24} color="#000" />
          {cartItems.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItems.length}</Text>
            </View>
          )}
        </View>
      </View>

      {/* FlatList hiển thị sản phẩm và Footer */}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: { marginRight: 10 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  cartIconContainer: { position: "relative" },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF3D00",
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
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
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
  promoContainer: {
    flexDirection: "row",
    marginTop: 16,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: "#ddd",
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: { fontWeight: "bold" },
  totalsContainer: {
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalsLabel: { fontSize: 14, color: "#666" },
  totalsValue: { fontSize: 14, color: "#333" },
  checkoutButton: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20, // Nếu vẫn không hiển thị, thử tăng giá trị bottom
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    zIndex: 100,
    elevation: 100,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
