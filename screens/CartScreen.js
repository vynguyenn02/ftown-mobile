import React, { useEffect, useState } from "react";
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

const CartScreen = ({
  accountId: propAccountId,
  cartItems = [],
  setCartItems,
  navigation,
}) => {
  // Luôn load accountId từ AsyncStorage nếu không được truyền qua prop
  const [accountId, setAccountId] = useState(propAccountId);

  useEffect(() => {
    const loadAccountId = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        if (storedAccountId) {
          const id = parseInt(storedAccountId, 10);
          console.log("Loaded accountId from storage:", id);
          setAccountId(id);
        } else {
          console.log("No accountId found in storage.");
        }
      } catch (error) {
        console.error("Error loading accountId from AsyncStorage", error);
      }
    };
    if (!propAccountId) {
      loadAccountId();
    }
  }, [propAccountId]);

  // Gọi API lấy giỏ hàng khi accountId đã có
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (accountId != null) {
          const response = await cartService.getCart(accountId);
          console.log("Cart response:", response.data);
          if (response.data && response.data.data) {
            setCartItems(response.data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching cart", error);
      }
    };

    if (accountId != null) {
      fetchCart();
    }
  }, [accountId, setCartItems]);

  // Tính tổng tiền, dùng discountedPrice nếu có giảm giá, không cộng phí ship
  const subTotal = (Array.isArray(cartItems) ? cartItems : []).reduce(
    (acc, item) => {
      if (item.selected === false) return acc;
      const effectivePrice =
        item.price > item.discountedPrice ? item.discountedPrice : item.price;
      return acc + effectivePrice * item.quantity;
    },
    0
  );

  const removeItem = (productVariantId) => {
    setCartItems(cartItems.filter((item) => item.productVariantId !== productVariantId));
  };

  const toggleSelect = (productVariantId) => {
    setCartItems((prev) =>
      prev.map((p) =>
        p.productVariantId === productVariantId
          ? { ...p, selected: p.selected === false ? true : false }
          : p
      )
    );
  };

  const renderCartItem = ({ item }) => {
    const hasDiscount = item.price > item.discountedPrice;
    const discountPercentage = hasDiscount
      ? Math.round(((item.price - item.discountedPrice) / item.price) * 100)
      : 0;

    return (
      <View style={styles.cartItemContainer}>
        <TouchableOpacity onPress={() => toggleSelect(item.productVariantId)}>
          <Ionicons
            name={item.selected === false ? "checkbox-outline" : "checkbox"}
            size={20}
            color="#333"
          />
        </TouchableOpacity>

        <Image source={{ uri: item.imagePath }} style={styles.cartItemImage} />
        <View style={styles.cartItemDetails}>
          <Text style={styles.cartItemName}>{item.productName}</Text>
          {hasDiscount ? (
            <View style={styles.priceContainer}>
              <Text style={styles.discountedPriceText}>
                {item.discountedPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
              <Text style={styles.originalPriceText}>
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
            <Text style={styles.cartItemPrice}>
              {item.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          )}
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => {
                if (item.quantity > 1) {
                  setCartItems((prev) =>
                    prev.map((p) =>
                      p.productVariantId === item.productVariantId
                        ? { ...p, quantity: p.quantity - 1 }
                        : p
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
                    p.productVariantId === item.productVariantId
                      ? { ...p, quantity: p.quantity + 1 }
                      : p
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
          <TouchableOpacity onPress={() => removeItem(item.productVariantId)}>
            <Ionicons name="trash-outline" size={24} color="#FF4D4F" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Hàm xử lý Proceed to Checkout: Gọi API checkout với payload theo CheckoutRequest
  const handleCheckout = async () => {
    // Lấy tất cả sản phẩm được chọn
    const selectedItems = (Array.isArray(cartItems) ? cartItems : []).filter(
      (item) => item.selected !== false
    );

    if (selectedItems.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một sản phẩm.");
      return;
    }

    const payload = {
      accountId: accountId,
      selectedProductVariantIds: selectedItems.map(
        (item) => item.productVariantId
      ),
    };

    try {
      const response = await cartService.checkout(payload);
      console.log("Checkout response:", response.data);
      // Kiểm tra dựa trên BE response: nếu có checkOutSessionId thì thành công
      if (response.data && response.data.checkOutSessionId) {
        navigation.navigate("CheckoutScreen", {
          checkoutData: response.data,
        });
      } else {
        Alert.alert("Lỗi", "Checkout thất bại, vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error during checkout", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra trong quá trình thanh toán.");
    }
  };

  // FlatList Footer: hiển thị tổng tiền và nút Proceed to Checkout (lấy subTotal từ discountedPrice nếu có)
  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.totalsContainer}>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Sub Total</Text>
          <Text style={styles.totalsValue}>
            {subTotal.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.localHeader}>
        <Text style={styles.localHeaderTitle}>Giỏ hàng</Text>
      </View>
      <FlatList
        data={Array.isArray(cartItems) ? cartItems : []}
        keyExtractor={(item) => item.productVariantId.toString()}
        renderItem={renderCartItem}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>Your cart is empty.</Text>
          </View>
        }
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 140 }}
      />
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  localHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  localHeaderTitle: { fontSize: 20, fontWeight: "bold" },
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
  priceContainer: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  discountedPriceText: { fontSize: 16, fontWeight: "bold", color: "#FC7B54" },
  originalPriceText: {
    fontSize: 12,
    color: "#888",
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
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  totalsContainer: { marginTop: 16, marginBottom: 16, paddingHorizontal: 16 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  totalsLabel: { fontSize: 14, color: "#666" },
  totalsValue: { fontSize: 14, color: "#333" },
  footerContainer: { paddingBottom: 20 },
  checkoutButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
  },
  checkoutButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
