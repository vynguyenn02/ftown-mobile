// ProductDetailScreen.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import productApi from "../api/productApi";
import cartService from "../api/cartApi";
import feedbackApi from "../api/feedbackApi";

// Hàm định dạng tiền VND
const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const ProductDetailScreen = ({ route, navigation, cartItems, setCartItems }) => {
  const { product: initialProduct } = route.params;
  
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(initialProduct.imagePath);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialProduct.isFavorite || false);
  const [accountId, setAccountId] = useState(null);

  // State cho feedback
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Load accountId từ AsyncStorage
  useEffect(() => {
    const loadAccountId = async () => {
      try {
        const storedId = await AsyncStorage.getItem("accountId");
        console.log("accountId từ AsyncStorage:", storedId);
        if (storedId) {
          setAccountId(parseInt(storedId, 10));
        }
      } catch (error) {
        console.error("Error loading accountId from storage", error);
      }
    };
    loadAccountId();
  }, []);

  // Fetch chi tiết sản phẩm và feedback khi product.productId hoặc accountId thay đổi
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // Gọi API với accountId nếu có để backend trả về trường isFavorite
        const response = await productApi.getProductById(product.productId, accountId);
        console.log("Chi tiết sản phẩm:", response.data.data);
        if (response.data && response.data.data) {
          setProduct(response.data.data);
          if (response.data.data.hasOwnProperty("isFavorite")) {
            setIsFavorite(response.data.data.isFavorite);
          }
          // Cập nhật variant mặc định
          const newVariant =
            response.data.data.variants &&
            response.data.data.variants.length > 0 &&
            response.data.data.variants[0];
          if (newVariant) {
            setSelectedColor(newVariant.color);
            setSelectedSize(newVariant.size);
            setSelectedImage(newVariant.imagePath || response.data.data.imagePath);
          }
        }
      } catch (error) {
        console.error("Error fetching product details", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedback = async (pageSize = 3) => {
      setFeedbackLoading(true);
      try {
        // Lấy 3 đánh giá đầu tiên mặc định
        const resp = await feedbackApi.getFeedbackByProductId(product.productId, 1, pageSize);
        console.log("Feedback response:", resp.data);
        if (resp.data && resp.data.data) {
          setFeedbackList(resp.data.data);
        }
      } catch (e) {
        console.error("Error fetching feedback:", e);
      } finally {
        setFeedbackLoading(false);
      }
    };

    if (product && product.productId) {
      fetchProductDetails();
      fetchFeedback();
    }
  }, [product.productId, accountId]);

  // Khai báo availableColors từ product.variants
  const availableColors = product.variants
    ? Array.from(new Set(product.variants.map((v) => v.color)))
    : [];

  // Khai báo state cho selectedColor & selectedSize từ initialProduct (nếu có)
  const [selectedColor, setSelectedColor] = useState(
    initialProduct.variants && initialProduct.variants.length > 0
      ? initialProduct.variants[0].color
      : null
  );
  const [selectedSize, setSelectedSize] = useState(
    initialProduct.variants && initialProduct.variants.length > 0
      ? initialProduct.variants[0].size
      : null
  );

  // Tính selectedVariant dựa trên selectedColor và selectedSize
  const selectedVariant =
    product.variants &&
    product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );

  // Tính availableSizes dựa trên selectedColor
  const availableSizes = product.variants
    ? Array.from(
        new Set(
          product.variants
            .filter((v) => v.color === selectedColor)
            .map((v) => v.size)
        )
      )
    : [];

  // Hàm xử lý khi chọn màu
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const variant = product.variants.find(
      (v) => v.color === color && v.size === selectedSize
    );
    if (variant) {
      setSelectedImage(variant.imagePath);
    } else {
      const variantAny = product.variants.find((v) => v.color === color);
      if (variantAny) {
        setSelectedImage(variantAny.imagePath);
        setSelectedSize(variantAny.size);
      }
    }
  };

  // Hàm xử lý khi chọn kích cỡ
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const variant = product.variants.find(
      (v) => v.color === selectedColor && v.size === size
    );
    if (variant) {
      setSelectedImage(variant.imagePath);
    }
  };

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : true;

  // Hàm xử lý toggle favorite
  const toggleFavorite = async () => {
    if (accountId == null) {
      Alert.alert("Thông báo", "Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập.");
      return;
    }
    try {
      if (!isFavorite) {
        const response = await productApi.postFavoriteProduct(accountId, product.productId);
        console.log("Favorite added response:", response.data);
        if (response.data && response.data.status === true) setIsFavorite(true);
      } else {
        const response = await productApi.deleteFavoriteProduct(accountId, product.productId);
        console.log("Favorite removed response:", response.data);
        if (response.data && response.data.status === true) setIsFavorite(false);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi thay đổi trạng thái yêu thích.");
      console.error("Error toggling favorite", error);
    }
  };

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!inStock) return;
    if (accountId == null) {
      Alert.alert("Thông báo", "Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập.");
      return;
    }
    const payload = {
      productId: product.productId,
      size: selectedSize || "M",
      color: selectedColor || "#000",
      quantity,
    };
    try {
      const addResponse = await cartService.addProductToCart(accountId, payload);
      console.log("Add to cart response:", addResponse.data);
      // Sau khi thêm vào giỏ, gọi lại API getCart để cập nhật giỏ hàng
      const cartResponse = await cartService.getCart(accountId);
      if (cartResponse.data && cartResponse.data.data) {
        setCartItems(cartResponse.data.data);
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      Alert.alert("Error", "Thêm sản phẩm vào giỏ hàng thất bại.");
      console.error("Error adding product to cart", error);
    }
  };

  // Tính giá
  const basePrice = selectedVariant ? selectedVariant.price : product.price;
  const discountedPrice = selectedVariant
    ? selectedVariant.discountedPrice
    : product.discountedPrice;
  const discountPercentage =
    basePrice > discountedPrice
      ? Math.round(((basePrice - discountedPrice) / basePrice) * 100)
      : 0;

  // Hàm hiển thị sao cho rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < rating ? "star" : "star-outline"}
          size={14}
          color="#FFD700"
        />
      );
    }
    return <View style={{ flexDirection: "row" }}>{stars}</View>;
  };

  // Hàm render một feedback dưới dạng card
  const renderFeedbackItem = (feedback, idx) => (
    <View key={feedback.feedbackId || idx} style={styles.feedbackCard}>
      <View style={styles.feedbackHeader}>
        {renderStars(feedback.rating || 0)}
        <Text style={styles.feedbackTime}>
          {" "} - {feedback.createdDate?.slice(0, 10) || "??/??/??"}
        </Text>
      </View>
      <Text style={styles.feedbackComment}>{feedback.comment}</Text>
      {feedback.imagePath ? (
        <Image
          source={{ uri: feedback.imagePath }}
          style={styles.feedbackImage}
          resizeMode="cover"
        />
      ) : null}
    </View>
  );

  // Hàm xử lý "Xem tất cả" feedback: truyền pageSize lớn (vd: 100) để lấy đủ feedback
  const handleViewAllFeedback = async () => {
    setFeedbackLoading(true);
    try {
      const resp = await feedbackApi.getFeedbackByProductId(product.productId, 1, 100);
      console.log("View All Feedback response:", resp.data);
      if (resp.data && resp.data.data) {
        setFeedbackList(resp.data.data);
      }
    } catch (e) {
      console.error("Error fetching all feedback:", e);
      Alert.alert("Lỗi", "Không thể tải tất cả đánh giá, vui lòng thử lại sau.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
            {isFavorite ? (
              <Ionicons name="heart" size={24} color="#FF3D3D" />
            ) : (
              <Ionicons name="heart-outline" size={24} color="#000" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("CartScreen")}
          >
            <Ionicons name="cart-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image source={{ uri: selectedImage }} style={styles.mainImage} />
        </View>

        {/* Product Info */}
        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.ratingRow}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>
                {product.rating} ({product.reviews} reviews)
              </Text>
            </View>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{formatVND(discountedPrice)}</Text>
            {discountPercentage > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discountPercentage}%</Text>
              </View>
            )}
          </View>
          {discountPercentage > 0 && (
            <Text style={styles.originalPriceText}>{formatVND(basePrice)}</Text>
          )}

          {/* Màu sắc: hiển thị dưới phần giá, trên phần kích cỡ */}
          <Text style={styles.sectionLabel}>Màu sắc</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorListContainer}
          >
            {availableColors.map((color, index) => (
              <TouchableOpacity
                key={index.toString()}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorCircle,
                ]}
                onPress={() => handleColorSelect(color)}
              />
            ))}
          </ScrollView>

          {/* Kích cỡ */}
          <Text style={styles.sectionLabel}>Size</Text>
          <View style={styles.sizeContainer}>
            {availableSizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.selectedSizeButton,
                ]}
                onPress={() => handleSizeSelect(size)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size && styles.selectedSizeText,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Số lượng */}
          <View style={styles.quantityRow}>
            <TouchableOpacity onPress={decrementQty} style={styles.qtyBtn}>
              <Ionicons name="remove" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity onPress={incrementQty} style={styles.qtyBtn}>
              <Ionicons name="add" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            {product.description ||
              "This is a simple and elegant piece perfect for those who want minimalist clothes."}
          </Text>

          {/* Feedback Section */}
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>Đánh giá</Text>
            {feedbackLoading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : feedbackList.length === 0 ? (
              <Text>Chưa có đánh giá nào</Text>
            ) : (
              <View>
                {feedbackList.map((fb, idx) => renderFeedbackItem(fb, idx))}
                {feedbackList.length < 100 && (
                  <TouchableOpacity onPress={handleViewAllFeedback}>
                    <Text style={styles.viewAllText}>Xem tất cả</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addToCartButton, !inStock && styles.outOfStockButton]}
          onPress={handleAddToCart}
          disabled={!inStock}
        >
          <Text style={styles.addToCartText}>
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Text>
        </TouchableOpacity>
      </View>

      {showToast && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>Product added to cart!</Text>
        </View>
      )}
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  topBarRight: { flexDirection: "row", alignItems: "center" },
  iconButton: { marginLeft: 10 },
  imageSection: { paddingHorizontal: 16, marginBottom: 10 },
  thumbnailsContainer: { paddingVertical: 10 },
  mainImage: { width: "100%", height: 300, borderRadius: 8, resizeMode: "cover" },
  detailsContainer: { paddingHorizontal: 16 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  productName: { fontSize: 20, fontWeight: "bold", maxWidth: "70%" },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { marginLeft: 4, fontSize: 14, color: "#555" },
  priceRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  priceText: { fontSize: 18, fontWeight: "bold", color: "#FC7B54" },
  discountBadge: {
    backgroundColor: "#FF3D3D",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  originalPriceText: {
    fontSize: 14,
    color: "#888",
    textDecorationLine: "line-through",
    marginBottom: 10,
  },
  sectionLabel: { fontSize: 16, fontWeight: "600", marginTop: 10, marginBottom: 6 },
  // New style cho danh mục màu sắc trong chi tiết sản phẩm
  colorListContainer: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedColorCircle: {
    borderWidth: 2,
    borderColor: "#333",
  },
  sizeContainer: { flexDirection: "row", marginBottom: 8 },
  sizeButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  selectedSizeButton: { backgroundColor: "#333" },
  sizeText: { fontSize: 14, color: "#000" },
  selectedSizeText: { color: "#fff", fontWeight: "bold" },
  quantityRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  qtyBtn: { backgroundColor: "#f0f0f0", borderRadius: 6, padding: 6 },
  qtyValue: { marginHorizontal: 12, fontSize: 16, fontWeight: "600" },
  description: { fontSize: 14, lineHeight: 20, color: "#555", marginBottom: 20 },
  footer: { borderTopWidth: 1, borderTopColor: "#ddd", padding: 16 },
  addToCartButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  outOfStockButton: { backgroundColor: "#888" },
  addToCartText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  toastContainer: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: "#333",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 100,
    elevation: 100,
  },
  toastText: { color: "#fff", fontSize: 14, fontWeight: "bold" },

  // ===== FEEDBACK STYLES =====
  feedbackSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  feedbackCard: {
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackHeader: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  feedbackTime: { fontSize: 12, color: "#888", marginLeft: 4 },
  feedbackComment: { fontSize: 14, color: "#333" },
  feedbackImage: { width: 60, height: 60, marginTop: 8, borderRadius: 4 },
  viewAllText: { marginTop: 4, fontSize: 14, fontWeight: "600", color: "#007bff" },
  
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  topBarRight: { flexDirection: "row", alignItems: "center" },
  iconButton: { marginLeft: 10 },
  imageSection: { paddingHorizontal: 16, marginBottom: 10 },
  thumbnailsContainer: { paddingVertical: 10 },
  mainImage: { width: "100%", height: 300, borderRadius: 8, resizeMode: "cover" },
  detailsContainer: { paddingHorizontal: 16 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  productName: { fontSize: 20, fontWeight: "bold", maxWidth: "70%" },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { marginLeft: 4, fontSize: 14, color: "#555" },
  priceRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  priceText: { fontSize: 18, fontWeight: "bold", color: "#FC7B54" },
});
