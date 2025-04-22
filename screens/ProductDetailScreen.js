// screens/ProductDetailScreen.js

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import productApi from "../api/productApi";
import cartService from "../api/cartApi";
import feedbackApi from "../api/feedbackApi";
import { ThemeContext } from "../context/ThemeContext";

const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const ProductDetailScreen = ({ route, navigation, cartItems, setCartItems }) => {
  const { theme } = useContext(ThemeContext);
  const { product: initialProduct, productId: paramProductId } = route.params;

  const [product, setProduct] = useState(initialProduct || null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    initialProduct?.imagePath || null
  );
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(
    initialProduct?.isFavorite || false
  );
  const [accountId, setAccountId] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    initialProduct?.variants?.[0]?.color || null
  );
  const [selectedSize, setSelectedSize] = useState(
    initialProduct?.variants?.[0]?.size || null
  );

  useEffect(() => {
    (async () => {
      try {
        const storedId = await AsyncStorage.getItem("accountId");
        if (storedId) setAccountId(parseInt(storedId, 10));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async (id) => {
      setLoading(true);
      try {
        const resp = await productApi.getProductById(id, accountId);
        const data = resp.data?.data;
        if (data) {
          setProduct(data);
          setIsFavorite(data.isFavorite || false);
          const fv = data.variants?.[0];
          if (fv) {
            setSelectedColor(fv.color);
            setSelectedSize(fv.size);
            setSelectedImage(fv.imagePath || data.imagePath);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedback = async (id, pageSize = 3) => {
      setFeedbackLoading(true);
      try {
        const resp = await feedbackApi.getFeedbackByProductId(id, 1, pageSize);
        setFeedbackList(resp.data?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setFeedbackLoading(false);
      }
    };

    const idToFetch = initialProduct?.productId || paramProductId;
    if (idToFetch) {
      fetchProductDetails(idToFetch);
      fetchFeedback(idToFetch);
    }
  }, [accountId]);

  const availableColors = product?.variants
    ? [...new Set(product.variants.map((v) => v.color))]
    : [];
  const availableSizes = product?.variants
    ? [
        ...new Set(
          product.variants
            .filter((v) => v.color === selectedColor)
            .map((v) => v.size)
        ),
      ]
    : [];
  const selectedVariant = product?.variants?.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );
  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : true;

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const match = product.variants.find(
      (v) => v.color === color && v.size === selectedSize
    );
    if (match) return setSelectedImage(match.imagePath);
    const any = product.variants.find((v) => v.color === color);
    if (any) {
      setSelectedImage(any.imagePath);
      setSelectedSize(any.size);
    }
  };
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const match = product.variants.find(
      (v) => v.color === selectedColor && v.size === size
    );
    if (match) setSelectedImage(match.imagePath);
  };
  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const toggleFavorite = async () => {
    if (!accountId) return Alert.alert("Thông báo", "Vui lòng đăng nhập.");
    try {
      const apiCall = isFavorite
        ? productApi.deleteFavoriteProduct
        : productApi.postFavoriteProduct;
      const resp = await apiCall(accountId, product.productId);
      if (resp.data?.status) setIsFavorite((f) => !f);
    } catch {
      Alert.alert("Lỗi", "Không thể thay đổi yêu thích.");
    }
  };

  const handleAddToCart = async () => {
    if (!inStock || !accountId) return;
    try {
      const resp = await cartService.addProductToCart(accountId, {
        productId: product.productId,
        size: selectedSize || "M",
        color: selectedColor || "#000",
        quantity,
      });
      const msg = resp.data?.message || "Thêm vào giỏ hàng thành công!";
      setToastMessage(msg);

      const cartResp = await cartService.getCart(accountId);
      setCartItems(cartResp.data?.data || []);

      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch {
      Alert.alert("Lỗi", "Thêm giỏ hàng thất bại.");
    }
  };

  const basePrice = selectedVariant?.price || product?.price || 0;
  const discountedPrice =
    selectedVariant?.discountedPrice || product?.discountedPrice || 0;
  const discountPct =
    basePrice > discountedPrice
      ? Math.round(((basePrice - discountedPrice) / basePrice) * 100)
      : 0;

  const renderStars = (r) => (
    <View style={{ flexDirection: "row" }}>
      {[...Array(5)].map((_, i) => (
        <Ionicons
          key={i}
          name={i < r ? "star" : "star-outline"}
          size={14}
          color="#FFD700"
        />
      ))}
    </View>
  );

  const renderFeedbackItem = (fb, i) => (
    <View
      key={fb.feedbackId || i}
      style={[styles.feedbackCard, { backgroundColor: theme.card }]}
    >
      <View style={styles.feedbackHeader}>
        {renderStars(fb.rating || 0)}
        <Text style={[styles.feedbackTime, { color: theme.subtext }]}>
          – {fb.createdDate?.slice(0, 10) || "--/--/--"}
        </Text>
      </View>
      <Text style={[styles.feedbackComment, { color: theme.text }]}>
        {fb.comment}
      </Text>
      {fb.imagePath && (
        <Image source={{ uri: fb.imagePath }} style={styles.feedbackImage} />
      )}
    </View>
  );

  const handleViewAllFeedback = async () => {
    try {
      const resp = await feedbackApi.getFeedbackByProductId(
        product.productId,
        1,
        100
      );
      setFeedbackList(resp.data?.data || []);
    } catch {
      Alert.alert("Lỗi", "Không tải được đánh giá.");
    }
  };

  if (loading || !product)
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color={theme.primary}
        />
      </SafeAreaView>
    );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Header />

      {/* Top bar */}
      <View style={[styles.topBar, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Details
        </Text>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? theme.primary : theme.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("CartScreen")}
          >
            <Ionicons name="cart-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Image */}
        <View style={styles.imageSection}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.mainImage}
            />
          ) : (
            <Text style={{ color: theme.text }}>No Image</Text>
          )}
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <Text style={[styles.productName, { color: theme.text }]}>
            {product.name}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.priceText, { color: theme.primary }]}>
              {formatVND(discountedPrice)}
            </Text>
            {discountPct > 0 && (
              <View
                style={[
                  styles.discountBadge,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Text
                  style={[styles.discountText, { color: theme.background }]}
                >
                  -{discountPct}%
                </Text>
              </View>
            )}
          </View>
          {discountPct > 0 && (
            <Text style={[styles.originalPriceText, { color: theme.subtext }]}>
              {formatVND(basePrice)}
            </Text>
          )}

          {/* Colors */}
          <Text style={[styles.sectionLabel, { color: theme.text }]}>
            Màu sắc
          </Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.colorListContainer}
          >
            {availableColors.map((c, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.colorCircle,
                  { backgroundColor: c, borderColor: theme.subtext },
                  selectedColor === c && {
                    borderColor: theme.primary,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => handleColorSelect(c)}
              />
            ))}
          </ScrollView>

          {/* Sizes */}
          <Text style={[styles.sectionLabel, { color: theme.text }]}>
            Size
          </Text>
          <View style={styles.sizeContainer}>
            {availableSizes.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.sizeButton,
                  { backgroundColor: theme.card },
                  selectedSize === s && { backgroundColor: theme.primary },
                ]}
                onPress={() => handleSizeSelect(s)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    { color: theme.text },
                    selectedSize === s && {
                      color: theme.background,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quantity */}
          <View style={styles.quantityRow}>
            <TouchableOpacity
              onPress={decrementQty}
              style={[styles.qtyBtn, { backgroundColor: theme.card }]}
            >
              <Ionicons name="remove" size={20} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.qtyValue, { color: theme.text }]}>
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={incrementQty}
              style={[styles.qtyBtn, { backgroundColor: theme.card }]}
            >
              <Ionicons name="add" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: theme.subtext }]}>
            {product.description || "No description."}
          </Text>

          {/* Feedback */}
          <View
            style={[
              styles.feedbackSection,
              { borderTopColor: theme.card },
            ]}
          >
            <Text style={[styles.feedbackTitle, { color: theme.text }]}>
              Đánh giá
            </Text>
            {feedbackLoading ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : feedbackList.length === 0 ? (
              <Text style={{ color: theme.text }}>Chưa có đánh giá</Text>
            ) : (
              <>
                {feedbackList.map(renderFeedbackItem)}
                {feedbackList.length < 100 && (
                  <TouchableOpacity onPress={handleViewAllFeedback}>
                    <Text
                      style={[styles.viewAllText, { color: theme.primary }]}
                    >
                      Xem tất cả
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Sticky footer button */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.footerButton,
            { backgroundColor: inStock ? theme.primary : theme.subtext },
          ]}
          onPress={handleAddToCart}
          disabled={!inStock}
        >
          <Text style={[styles.footerButtonText, { color: theme.background }]}>
            {inStock ? "THÊM VÀO GIỎ HÀNG" : "HẾT HÀNG"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Toast */}
      {showToast && (
        <View
          style={[
            styles.toastContainer,
            { backgroundColor: theme.primary },
          ]}
        >
          <Text style={[styles.toastText, { color: theme.background }]}>
            {toastMessage}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingIndicator: { flex: 1, justifyContent: "center", alignItems: "center" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  topBarRight: { flexDirection: "row", alignItems: "center" },
  iconButton: { marginLeft: 10 },

  imageSection: { paddingHorizontal: 16, marginBottom: 10 },
  mainImage: { width: "100%", height: 300, borderRadius: 8 },

  detailsContainer: { paddingHorizontal: 16 },
  productName: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },

  priceRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  priceText: { fontSize: 18, fontWeight: "bold" },
  discountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: { fontSize: 12, fontWeight: "bold" },
  originalPriceText: {
    fontSize: 14,
    textDecorationLine: "line-through",
    marginBottom: 10,
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
  },
  colorListContainer: { paddingHorizontal: 4, paddingVertical: 4 },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
  },

  sizeContainer: { flexDirection: "row", marginBottom: 8 },
  sizeButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  sizeText: { fontSize: 14 },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  qtyBtn: { borderRadius: 6, padding: 6 },
  qtyValue: { marginHorizontal: 12, fontSize: 16, fontWeight: "600" },

  description: { fontSize: 14, lineHeight: 20, marginBottom: 20 },

  feedbackSection: { marginTop: 20, borderTopWidth: 1, paddingTop: 10 },
  feedbackTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  feedbackCard: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  feedbackTime: { fontSize: 12, marginLeft: 4 },
  feedbackComment: { fontSize: 14 },
  feedbackImage: { width: 60, height: 60, marginTop: 8, borderRadius: 4 },
  viewAllText: { marginTop: 4, fontSize: 14, fontWeight: "600" },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  footerButton: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  footerButtonText: { fontSize: 16, fontWeight: "bold" },

  toastContainer: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 100,
    elevation: 100,
  },
  toastText: { fontSize: 14, fontWeight: "bold" },
});
