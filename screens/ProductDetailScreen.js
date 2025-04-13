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
// Import API service (đảm bảo alias hoặc đường dẫn tương đối được thiết lập đúng)
import productApi from "../api/productApi";

const ProductDetailScreen = ({ route, navigation, cartItems, setCartItems }) => {
  const { product: initialProduct } = route.params;
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(initialProduct.imagePath);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  // Khi product được fetch hoặc cập nhật từ API, cập nhật selectedImage nếu cần
  useEffect(() => {
    if (product && product.imagePath) {
      setSelectedImage(product.imagePath);
    }
  }, [product]);

  // Gọi API lấy chi tiết sản phẩm theo productId (và tùy chọn accountId nếu có)
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await productApi.getProductById(product.productId);
        if (response.data && response.data.data) {
          setProduct(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching product details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [product.productId]);

  // Tạo mảng thumbnails từ variants (loại bỏ ảnh trùng)
  const thumbnails = product.variants
    ? Array.from(new Set(product.variants.map((v) => v.imagePath)))
    : [];

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
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
        price: product.variants && product.variants[0] ? product.variants[0].price : product.price,
        image: { uri: selectedImage },
        quantity: quantity,
        size: "M",
      };
      setCartItems((prev) => [...prev, newItem]);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
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
          {/* Thumbnails hiển thị ảnh nhỏ từ variants */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailsContainer}
          >
            {thumbnails.map((uri, index) => (
              <TouchableOpacity
                key={index.toString()}
                style={styles.thumbnailWrapper}
                onPress={() => setSelectedImage(uri)}
              >
                <Image
                  source={{ uri }}
                  style={[
                    styles.thumbnailImage,
                    selectedImage === uri && styles.selectedThumbnail,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Ảnh chính hiển thị product.imagePath */}
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
          <Text style={styles.priceText}>
            ${product.variants && product.variants[0]
              ? product.variants[0].price.toFixed(2)
              : product.price.toFixed(2)}
          </Text>

          <Text style={styles.sectionLabel}>Color</Text>
          <View style={styles.colorContainer}>
            <TouchableOpacity
              style={[styles.colorCircle, { backgroundColor: "#FC7B54" }]}
            />
            <TouchableOpacity
              style={[styles.colorCircle, { backgroundColor: "#2196F3" }]}
            />
            <TouchableOpacity
              style={[styles.colorCircle, { backgroundColor: "#000" }]}
            />
          </View>

          <Text style={styles.sectionLabel}>Size</Text>
          <View style={styles.sizeContainer}>
            {["S", "M", "L", "XL"].map((size) => (
              <TouchableOpacity key={size} style={styles.sizeButton}>
                <Text style={styles.sizeText}>{size}</Text>
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

      {/* Footer với nút Add to Cart */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
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
  thumbnailWrapper: { marginRight: 10 },
  thumbnailImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    resizeMode: "cover",
  },
  selectedThumbnail: { borderWidth: 2, borderColor: "#FC7B54" },
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
  priceText: {
    fontSize: 18,
    color: "#FC7B54",
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionLabel: { fontSize: 16, fontWeight: "600", marginTop: 10, marginBottom: 6 },
  colorContainer: { flexDirection: "row", marginBottom: 8 },
  colorCircle: { width: 24, height: 24, borderRadius: 12, marginRight: 10 },
  sizeContainer: { flexDirection: "row", marginBottom: 8 },
  sizeButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  sizeText: { fontSize: 14, color: "#000" },
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
  addToCartText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  // Toast style
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
});
