import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// Import Header (sidebar)
import Header from "../components/Header";
// Import API service
import productApi from "../api/productApi";

// Hàm định dạng tiền VND
const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

const ProductDetailScreen = ({ route, navigation, cartItems, setCartItems }) => {
  const { product: initialProduct } = route.params;
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(initialProduct.imagePath);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  // Lấy các lựa chọn màu và size từ các variant
  const availableColors = product.variants
    ? Array.from(new Set(product.variants.map((v) => v.color)))
    : [];
  const initialVariant =
    product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const [selectedColor, setSelectedColor] = useState(
    initialVariant ? initialVariant.color : null
  );
  const [selectedSize, setSelectedSize] = useState(
    initialVariant ? initialVariant.size : null
  );

  // Tính variant được chọn dựa trên màu và size
  const selectedVariant =
    product.variants &&
    product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );

  // Các size có sẵn cho màu đã chọn
  const availableSizes = product.variants
    ? Array.from(
        new Set(
          product.variants
            .filter((v) => v.color === selectedColor)
            .map((v) => v.size)
        )
      )
    : [];

  // Cập nhật selectedImage khi product được fetch
  useEffect(() => {
    if (product && product.imagePath) {
      setSelectedImage(product.imagePath);
    }
  }, [product]);

  // Gọi API lấy chi tiết sản phẩm theo productId
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await productApi.getProductById(product.productId);
        if (response.data && response.data.data) {
          setProduct(response.data.data);
          // Nếu backend trả về các variants mới, cập nhật lựa chọn mặc định nếu chưa có
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

    fetchProductDetails();
  }, [product.productId]);

  // Hàm xử lý khi chọn màu
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // Tìm variant với màu mới và size hiện tại
    const variant = product.variants.find(
      (v) => v.color === color && v.size === selectedSize
    );
    if (variant) {
      setSelectedImage(variant.imagePath);
    } else {
      // Nếu không có variant khớp, chuyển sang variant đầu tiên với màu đó
      const variantAny = product.variants.find((v) => v.color === color);
      if (variantAny) {
        setSelectedImage(variantAny.imagePath);
        setSelectedSize(variantAny.size);
      }
    }
  };

  // Hàm xử lý khi chọn size
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

  // Kiểm tra còn hàng hay không (nếu không có variant được chọn, mặc định cho phép)
  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : true;

  const handleAddToCart = () => {
    if (!inStock) return;
    const existingIndex = cartItems.findIndex(
      (item) => item.id === product.productId
    );
    if (existingIndex >= 0) {
      setCartItems((prev) => {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      });
    } else {
      const newItem = {
        id: product.productId,
        name: product.name,
        price: selectedVariant ? selectedVariant.price : product.price,
        image: { uri: selectedImage },
        quantity: quantity,
        size: selectedSize || "M",
        color: selectedColor || "#000",
      };
      setCartItems((prev) => [...prev, newItem]);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Tính giá dựa trên variant được chọn
  const basePrice = selectedVariant ? selectedVariant.price : product.price;
  const discountedPrice = selectedVariant
    ? selectedVariant.discountedPrice
    : product.discountedPrice;
  const discountPercentage =
    basePrice > discountedPrice
      ? Math.round(((basePrice - discountedPrice) / basePrice) * 100)
      : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Global Header (Sidebar) */}
      <Header />

      {/* Local Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={24} color="#000" />
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
          {/* Thumbnails hiển thị ảnh variant theo màu */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailsContainer}
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
          {/* Ảnh chính hiển thị theo variant đã chọn */}
          <Image source={{ uri: selectedImage }} style={styles.mainImage} />
        </View>

        {/* Details Section */}
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
          {/* Hiển thị giá và badge giảm giá */}
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>
              {formatVND(discountedPrice)}
            </Text>
            {discountPercentage > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discountPercentage}%</Text>
              </View>
            )}
          </View>
          {/* Hiển thị giá gốc */}
          {discountPercentage > 0 && (
            <Text style={styles.originalPriceText}>
              {formatVND(basePrice)}
            </Text>
          )}

          {/* Color Options (hiển thị các size theo màu đã chọn) */}
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
        </View>
      </ScrollView>

      {/* Footer với nút Add to Cart hoặc Out of Stock nếu không có hàng */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            !inStock && styles.outOfStockButton,
          ]}
          onPress={handleAddToCart}
          disabled={!inStock}
        >
          <Text style={styles.addToCartText}>
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Toast Message */}
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
  // Local Top Bar
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
  // Style cho lựa chọn màu: dùng chính cho thumbnail màu
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
});
