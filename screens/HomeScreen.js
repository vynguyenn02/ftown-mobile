import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
// Global Header (sidebar)
import Header from "../components/Header";
// Import API service đã cấu hình
import productApi from "../api/productApi";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

const categories = [
  { id: "all", title: "All Items" },
  { id: "dress", title: "Dress" },
  { id: "tshirt", title: "T-Shirt" },
];

const HomeScreen = ({ navigation, cartItems = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch API getAllProducts khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productApi.getAllProducts(1, 30);
        // Giả sử kết cấu response.data.data chứa mảng sản phẩm
        if (response.data && response.data.data) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() =>
        navigation.navigate("ProductDetailScreen", {
          product: item,
        })
      }
    >
      <Image source={{ uri: item.imagePath || item.image }} style={styles.productImage} />
      <View style={{ padding: 8 }}>
        <Text style={styles.productName}>{item.name || item.productName}</Text>
        <View style={styles.ratingRow}>
          <MaterialIcons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>
            {item.rating || 0} ({item.reviews || 0} reviews)
          </Text>
        </View>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity style={styles.wishlistIcon}>
        <Feather name="heart" size={20} color="#000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => {
    const isActive = item.id === selectedCategory;
    return (
      <TouchableOpacity
        style={[styles.categoryButton, isActive && { backgroundColor: "#000" }]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <Text style={[styles.categoryText, isActive && { color: "#fff" }]}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  // Header của danh sách (cart info, search bar, category list)
  const ListHeader = () => (
    <View style={{ marginBottom: 10 }}>
      {/* Cart Info Row */}
      <View style={styles.cartInfoRow}>
        <Text style={styles.cartInfoText}>
          You have {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
        </Text>
        <View style={styles.cartIconWithBadge}>
          <Ionicons name="cart-outline" size={40} color="#000" />
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#000" style={{ marginRight: 8 }} />
        <TextInput placeholder="Search clothes..." style={styles.searchInput} />
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={{ marginTop: 15 }}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Global Header (sidebar) */}
      <Header />

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        // Danh sách sản phẩm
        <FlatList
          data={products}
          keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}
          renderItem={renderProductItem}
          numColumns={2}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.productListContainer}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  cartInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  cartInfoText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  cartIconWithBadge: { position: "relative" },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF3D3D",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  cartBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
  },
  searchInput: { flex: 1, fontSize: 14 },
  filterButton: { backgroundColor: "#000", padding: 8, borderRadius: 8 },
  categoryButton: {
    marginRight: 10,
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  categoryText: { color: "#000", fontSize: 14 },
  productListContainer: { paddingHorizontal: 10, paddingBottom: 80 },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 8,
    overflow: "hidden",
    position: "relative",
  },
  productImage: { width: "100%", height: 160, resizeMode: "cover" },
  productName: { fontSize: 14, fontWeight: "600", marginBottom: 4, color: "#333" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  ratingText: { fontSize: 12, color: "#888", marginLeft: 4 },
  productPrice: { fontSize: 14, fontWeight: "bold", color: "#000" },
  wishlistIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
  },
});
