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
  // Luôn load accountId từ AsyncStorage (nếu không truyền qua props)
  const [accountId, setAccountId] = useState(propAccountId);

  // Load accountId từ AsyncStorage nếu propAccountId chưa có
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

  // Mỗi khi accountId có giá trị, gọi API getCart để cập nhật giỏ hàng
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

  // Tính tạm tính (subTotal): dùng discountedPrice nếu có, không tính phí ship
  const subTotal = (Array.isArray(cartItems) ? cartItems : []).reduce(
    (acc, item) => {
      if (item.selected === false) return acc;
      const effectivePrice =
        item.price > item.discountedPrice ? item.discountedPrice : item.price;
      return acc + effectivePrice * item.quantity;
    },
    0
  );

  // Gọi lại API getCart để đồng bộ sau mỗi thao tác
  const refreshCart = async () => {
    try {
      if (accountId != null) {
        const cartResponse = await cartService.getCart(accountId);
        if (cartResponse.data && cartResponse.data.data) {
          setCartItems(cartResponse.data.data);
        } else {
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error("Error refreshing cart", error);
    }
  };

  // 1) Edit quantity
  const handleUpdateQuantity = async (item, quantityChange) => {
    if (accountId == null) {
      Alert.alert("Thông báo", "Không tìm thấy thông tin tài khoản.");
      return;
    }
    try {
      const payload = { productVariantId: item.productVariantId, quantityChange };
      const response = await cartService.editCart(accountId, payload);
      console.log("Edit cart response:", response.data);

      // Backend trả về data = true => Gọi lại getCart
      if (response.data && response.data.data === true) {
        await refreshCart();
      }
    } catch (error) {
      console.error("Error updating quantity", error);
      Alert.alert("Lỗi", "Thay đổi số lượng thất bại, vui lòng thử lại sau.");
    }
  };

  // 2) Xoá 1 sản phẩm
  const confirmRemoveItem = (productVariantId) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "OK",
          onPress: () => handleRemoveItem(productVariantId),
        },
      ]
    );
  };

  const handleRemoveItem = async (productVariantId) => {
    if (accountId == null) {
      Alert.alert("Thông báo", "Không tìm thấy thông tin tài khoản.");
      return;
    }
    try {
      const response = await cartService.removeCartItem(accountId, productVariantId);
      console.log("Remove cart item response:", response.data);

      // Gọi lại getCart
      if (response.data && response.data.data === true) {
        await refreshCart();
      } else if (response.data && Array.isArray(response.data.data)) {
        setCartItems(response.data.data);
      }
    } catch (error) {
      console.error("Error removing item", error);
      Alert.alert("Lỗi", "Xóa sản phẩm thất bại, vui lòng thử lại sau.");
    }
  };

  // 3) Xoá toàn bộ sản phẩm
  const confirmClearCart = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "OK",
          onPress: () => handleClearCart(),
        },
      ]
    );
  };

  const handleClearCart = async () => {
    if (accountId == null) {
      Alert.alert("Thông báo", "Không tìm thấy thông tin tài khoản.");
      return;
    }
    try {
      const response = await cartService.removeAllCartItem(accountId);
      console.log("Clear cart response:", response.data);
      // Tương tự, nếu data = true => gọi lại getCart
      if (response.data && response.data.data === true) {
        await refreshCart();
      } else if (response.data && Array.isArray(response.data.data)) {
        setCartItems(response.data.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error clearing cart", error);
      Alert.alert("Lỗi", "Xóa tất cả sản phẩm thất bại, vui lòng thử lại sau.");
    }
  };

  // 4) Tiến hành Thanh Toán (Checkout)
  const handleCheckout = async () => {
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
      // Nếu có checkOutSessionId, coi như checkout thành công
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

  // Render từng item giỏ hàng
  const renderCartItem = ({ item }) => {
    const hasDiscount = item.price > item.discountedPrice;
    const discountPercentage = hasDiscount
      ? Math.round(((item.price - item.discountedPrice) / item.price) * 100)
      : 0;

    return (
      <View style={styles.cartItemContainer}>
        {/* Checkbox */}
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
            color="#333"
          />
        </TouchableOpacity>

        {/* Ảnh sản phẩm */}
        <Image source={{ uri: item.imagePath }} style={styles.cartItemImage} />

        {/* Thông tin sản phẩm */}
        <View style={styles.cartItemDetails}>
          <Text style={styles.cartItemName}>{item.productName}</Text>
          {/* Hiển thị giá (nếu có giảm giá) */}
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
          {/* Nút + - số lượng */}
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => handleUpdateQuantity(item, -1)}
            >
              <Ionicons name="remove" size={16} color="#000" />
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => handleUpdateQuantity(item, 1)}
            >
              <Ionicons name="add" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Khu vực Size & nút Xoá */}
        <View style={styles.cartItemActions}>
          <Text style={styles.cartItemSize}>{item.size || "S"}</Text>
          <TouchableOpacity onPress={() => confirmRemoveItem(item.productVariantId)}>
            <Ionicons name="trash-outline" size={24} color="#FF4D4F" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Footer: Tạm tính & Thanh Toán & Xoá toàn bộ giỏ hàng
  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.totalsContainer}>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Tạm tính</Text>
          <Text style={styles.totalsValue}>
            {subTotal.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.clearCartButton} onPress={confirmClearCart}>
        <Text style={styles.clearCartButtonText}>Xóa toàn bộ giỏ hàng</Text>
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
            <Text>Giỏ hàng của bạn trống.</Text>
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
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
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
