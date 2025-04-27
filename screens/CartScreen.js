import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import cartService from "../api/cartApi";
import { ThemeContext } from "../context/ThemeContext";

const CartScreen = ({ accountId: propAccountId, cartItems = [], setCartItems, navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [accountId, setAccountId] = useState(propAccountId);

  useEffect(() => {
    const loadAccountId = async () => {
      const storedAccountId = await AsyncStorage.getItem("accountId");
      if (storedAccountId) setAccountId(parseInt(storedAccountId, 10));
    };
    if (!propAccountId) loadAccountId();
  }, [propAccountId]);

  useEffect(() => {
    const fetchCart = async () => {
      if (accountId != null) {
        const response = await cartService.getCart(accountId);
        if (response.data?.data) setCartItems(response.data.data);
      }
    };
    if (accountId != null) fetchCart();
  }, [accountId, setCartItems]);

  const subTotal = cartItems.reduce((acc, item) => {
    if (item.selected === false) return acc;
    const effectivePrice = item.price > item.discountedPrice ? item.discountedPrice : item.price;
    return acc + effectivePrice * item.quantity;
  }, 0);

  const refreshCart = async () => {
    if (accountId != null) {
      const response = await cartService.getCart(accountId);
      if (response.data?.data) {
        setCartItems(response.data.data);
      } else {
        setCartItems([]);
      }
    }
  };

  const handleUpdateQuantity = async (item, quantityChange) => {
    if (!accountId) {
      Alert.alert("Thông báo", "Không tìm thấy thông tin tài khoản.");
      return;
    }

    try {
      const payload = { productVariantId: item.productVariantId, quantityChange };
      const response = await cartService.editCart(accountId, payload);
      if (response.data?.data === true) {
        await refreshCart();
      }
    } catch (error) {
      console.error("Error updating quantity", error);
      Alert.alert("Lỗi", "Không thể cập nhật số lượng. Vui lòng thử lại.");
    }
  };

  const confirmRemoveItem = (productVariantId) => {
    Alert.alert("Xác nhận", "Bạn muốn xóa sản phẩm này?", [
      { text: "Hủy", style: "cancel" },
      { text: "OK", onPress: () => handleRemoveItem(productVariantId) },
    ]);
  };

  const handleRemoveItem = async (productVariantId) => {
    if (!accountId) {
      Alert.alert("Thông báo", "Không tìm thấy thông tin tài khoản.");
      return;
    }

    try {
      const response = await cartService.removeCartItem(accountId, productVariantId);
      if (response.data?.data === true) {
        await refreshCart();
      }
    } catch (error) {
      console.error("Error removing item", error);
      Alert.alert("Lỗi", "Xóa sản phẩm thất bại.");
    }
  };

  const confirmClearCart = () => {
    Alert.alert("Xác nhận", "Xóa toàn bộ giỏ hàng?", [
      { text: "Hủy", style: "cancel" },
      { text: "OK", onPress: () => handleClearCart() },
    ]);
  };

  const handleClearCart = async () => {
    if (!accountId) {
      Alert.alert("Thông báo", "Không tìm thấy thông tin tài khoản.");
      return;
    }

    try {
      const response = await cartService.removeAllCartItem(accountId);
      if (response.data?.data === true) {
        await refreshCart();
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error clearing cart", error);
      Alert.alert("Lỗi", "Xóa giỏ hàng thất bại.");
    }
  };

  const handleCheckout = async () => {
    const selectedItems = cartItems.filter((item) => item.selected !== false);

    if (selectedItems.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một sản phẩm.");
      return;
    }

    const payload = {
      accountId: accountId,
      selectedProductVariantIds: selectedItems.map((item) => item.productVariantId),
    };

    try {
      const response = await cartService.checkout(payload);
      if (response.data?.checkOutSessionId) {
        navigation.navigate("CheckoutScreen", {
          checkoutData: response.data,
        });
      } else {
        Alert.alert("Lỗi", "Không thể tiến hành thanh toán.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi thanh toán.");
    }
  };

  const renderCartItem = ({ item }) => {
    const hasDiscount = item.price > item.discountedPrice;
    const discountPercentage = hasDiscount
      ? Math.round(((item.price - item.discountedPrice) / item.price) * 100)
      : 0;

    return (
      <View style={[styles.cartItemContainer, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          onPress={() => {
            const currentSelected = item.selected !== false;
            setCartItems((prev) =>
              prev.map((p) =>
                p.productVariantId === item.productVariantId
                  ? { ...p, selected: !currentSelected }
                  : p
              )
            );
          }}
        >
          <Ionicons
            name={item.selected === false ? "checkbox-outline" : "checkbox"}
            size={20}
            color={theme.text}
          />
        </TouchableOpacity>

        <Image source={{ uri: item.imagePath }} style={styles.cartItemImage} />

        <View style={styles.cartItemDetails}>
          <Text style={[styles.cartItemName, { color: theme.text }]}>{item.productName}</Text>
          {hasDiscount ? (
            <View style={styles.priceContainer}>
              <Text style={styles.discountedPriceText}>
                {item.discountedPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
              <Text style={[styles.originalPriceText, { color: theme.subtext }]}>
                {item.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discountPercentage}%</Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.cartItemPrice, { color: theme.subtext }]}>
              {item.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          )}
          <View style={styles.quantityRow}>
          <TouchableOpacity
            style={[
              styles.qtyBtn,
              {
                backgroundColor: theme.subCard,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
            onPress={() => handleUpdateQuantity(item, -1)}
          >
            <Ionicons name="remove" size={16} color={theme.text} />
          </TouchableOpacity>

            <Text style={[styles.qtyValue, { color: theme.text }]}>{item.quantity}</Text>
            <TouchableOpacity
              style={[
                styles.qtyBtn,
                {
                  backgroundColor: theme.subCard,
                  borderColor: theme.border,
                  borderWidth: 1,
                },
              ]}
              onPress={() => handleUpdateQuantity(item, 1)}
            >
              <Ionicons name="add" size={16} color={theme.text} />
            </TouchableOpacity>

          </View>
        </View>

        <View style={styles.cartItemActions}>
          <Text style={[styles.cartItemSize, { backgroundColor: theme.subCard, color: theme.text }]}>
            {item.size || "S"}
          </Text>
          <TouchableOpacity onPress={() => confirmRemoveItem(item.productVariantId)}>
            <Ionicons name="trash-outline" size={24} color="#FF4D4F" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.totalsContainer}>
        <View style={styles.totalsRow}>
          <Text style={[styles.totalsLabel, { color: theme.subtext }]}>Tạm tính</Text>
          <Text style={[styles.totalsValue, { color: theme.text }]}>
            {subTotal.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={[styles.checkoutButton, { backgroundColor: theme.text }]} onPress={handleCheckout}>
        <Text style={[styles.checkoutButtonText, { color: theme.background }]}>Thanh Toán</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.clearCartButton} onPress={confirmClearCart}>
        <Text style={styles.clearCartButtonText}>Xóa toàn bộ giỏ hàng</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />
      <View style={[styles.localHeader, { backgroundColor: theme.card }]}>
        <Text style={[styles.localHeaderTitle, { color: theme.text }]}>Giỏ hàng</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productVariantId.toString()}
        renderItem={renderCartItem}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ color: theme.subtext }}>Giỏ hàng của bạn trống.</Text>
          </View>
        }
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingBottom: 140 }}
      />
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  localHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  localHeaderTitle: { fontSize: 20, fontWeight: "bold" },
  cartItemContainer: {
    flexDirection: "row",
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cartItemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  cartItemDetails: { flex: 1 },
  cartItemName: { fontSize: 16, fontWeight: "600" },
  cartItemPrice: { fontSize: 14, marginVertical: 4 },
  priceContainer: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  discountedPriceText: { fontSize: 16, fontWeight: "bold", color: "#FC7B54" },
  originalPriceText: {
    fontSize: 12,
    textDecorationLine: "line-through",
    marginLeft: 6,
  },
  discountBadge: {
    backgroundColor: "#FF3D3D",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  discountText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: { backgroundColor: "#f0f0f0", borderRadius: 6, padding: 6 },
  qtyValue: { marginHorizontal: 12, fontSize: 16, fontWeight: "600" },
  cartItemActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 60,
  },
  cartItemSize: {
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
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalsLabel: { fontSize: 14 },
  totalsValue: { fontSize: 14 },
  footerContainer: { paddingBottom: 20 },
  checkoutButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
  },
  checkoutButtonText: { fontSize: 16, fontWeight: "bold" },
  clearCartButton: {
    backgroundColor: "#FF3D3D",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
  },
  clearCartButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
