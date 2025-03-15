import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const ProductDetailScreen = ({
  route,
  navigation,
  cartItems,
  setCartItems,
}) => {
  const { product } = route.params;
  const [images] = useState([
    { id: "1", uri: "https://picsum.photos/200/300" },
    { id: "2", uri: "https://picsum.photos/200/301" },
    { id: "3", uri: "https://picsum.photos/200/302" },
  ]);
  const [selectedImage, setSelectedImage] = useState(images[0].uri);
  const [quantity, setQuantity] = useState(1);

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    const existingIndex = cartItems.findIndex((item) => item.id === product.id);
    if (existingIndex >= 0) {
      setCartItems((prev) => {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      });
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: { uri: selectedImage },
        quantity: quantity,
        size: "M",
      };
      setCartItems((prev) => [...prev, newItem]);
    }
    // Optionally, navigate to Cart screen:
    // navigation.navigate("Cart")
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          {/* Thumbnails: dùng ScrollView horizontal */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailsContainer}
          >
            {images.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.thumbnailWrapper}
                onPress={() => setSelectedImage(item.uri)}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={[
                    styles.thumbnailImage,
                    selectedImage === item.uri && styles.selectedThumbnail,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Ảnh chính */}
          <Image source={{ uri: selectedImage }} style={styles.mainImage} />
        </View>

        {/* Details */}
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
          <Text style={styles.priceText}>${product.price.toFixed(2)}</Text>

          <Text style={styles.sectionLabel}>Color</Text>
          <View style={styles.colorContainer}>
            <TouchableOpacity style={[styles.colorCircle, { backgroundColor: "#FC7B54" }]} />
            <TouchableOpacity style={[styles.colorCircle, { backgroundColor: "#2196F3" }]} />
            <TouchableOpacity style={[styles.colorCircle, { backgroundColor: "#000" }]} />
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
              "This is a simple and elegant piece that is perfect for those who want minimalist clothes."}
          </Text>
        </View>
      </ScrollView>

      {/* Footer với nút Add to Cart */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 40, paddingBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  imageSection: { paddingHorizontal: 16, marginBottom: 10 },
  thumbnailsContainer: { paddingVertical: 10 },
  thumbnailWrapper: { marginRight: 10 },
  thumbnailImage: { width: 50, height: 50, borderRadius: 6, resizeMode: "cover" },
  selectedThumbnail: { borderWidth: 2, borderColor: "#FC7B54" },
  mainImage: { width: "100%", height: 300, borderRadius: 8, resizeMode: "cover" },
  detailsContainer: { paddingHorizontal: 16 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  productName: { fontSize: 20, fontWeight: "bold", maxWidth: "70%" },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { marginLeft: 4, fontSize: 14, color: "#555" },
  priceText: { fontSize: 18, color: "#FC7B54", fontWeight: "bold", marginBottom: 10 },
  sectionLabel: { fontSize: 16, fontWeight: "600", marginTop: 10, marginBottom: 6 },
  colorContainer: { flexDirection: "row", marginBottom: 8 },
  colorCircle: { width: 24, height: 24, borderRadius: 12, marginRight: 10 },
  sizeContainer: { flexDirection: "row", marginBottom: 8 },
  sizeButton: { backgroundColor: "#f0f0f0", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6, marginRight: 8 },
  sizeText: { fontSize: 14, color: "#000" },
  quantityRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  qtyBtn: { backgroundColor: "#f0f0f0", borderRadius: 6, padding: 6 },
  qtyValue: { marginHorizontal: 12, fontSize: 16, fontWeight: "600" },
  description: { fontSize: 14, lineHeight: 20, color: "#555", marginBottom: 20 },
  footer: { borderTopWidth: 1, borderTopColor: "#ddd", padding: 16 },
  addToCartButton: { backgroundColor: "#333", borderRadius: 8, paddingVertical: 14, alignItems: "center" },
  addToCartText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
