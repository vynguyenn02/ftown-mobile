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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Header from "../components/Header";
import productApi from "../api/productApi"; // Chứa cả postFavoriteProduct & deleteFavoriteProduct
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

// Các danh mục sản phẩm: "Tất cả", "Áo", "Quần", "Áo khoác", "Phụ kiện"
const categories = [
  { id: "all", title: "Tất cả" },
  { id: "áo", title: "Áo" },
  { id: "quần", title: "Quần" },
  { id: "áo khoác", title: "Áo khoác" },
  { id: "phụ kiện", title: "Phụ kiện" },
];

const formatPrice = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const HomeScreen = ({ navigation, cartItems = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load sản phẩm khi selectedCategory thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let response;
        if (selectedCategory === "all") {
          response = await productApi.getAllProducts(1, 30);
        } else {
          response = await productApi.getAllProductsByCategory(
            selectedCategory,
            1,
            30
          );
        }
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
  }, [selectedCategory]);

  // Hàm cập nhật trạng thái yêu thích của sản phẩm trong state
  const updateProductFavorite = (productId, isFavorite) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.productId === productId ? { ...p, isFavorite } : p
      )
    );
  };

  // Hàm gọi API toggling favorite
  const toggleFavorite = async (product) => {
    try {
      // Lấy accountId từ AsyncStorage (giả sử đã được lưu trước đó khi đăng nhập)
      const storedId = await AsyncStorage.getItem("accountId");
      if (!storedId) {
        console.error("Không tìm thấy accountId trong AsyncStorage.");
        return;
      }
      const accountId = parseInt(storedId, 10);

      if (!product.isFavorite) {
        // Nếu sản phẩm chưa được yêu thích => gọi API POST để thêm vào yêu thích
        const response = await productApi.postFavoriteProduct(accountId, product.productId);
        console.log("Favorite added:", response.data);
        // Cập nhật UI: set isFavorite = true
        updateProductFavorite(product.productId, true);
      } else {
        // Nếu sản phẩm đã được yêu thích => gọi API DELETE để xoá khỏi yêu thích
        const response = await productApi.deleteFavoriteProduct(accountId, product.productId);
        console.log("Favorite removed:", response.data);
        // Cập nhật UI: set isFavorite = false
        updateProductFavorite(product.productId, false);
      }
    } catch (error) {
      console.error("Error toggling favorite", error);
    }
  };

  // Render các sản phẩm dưới dạng card
  const renderProductItem = ({ item }) => {
    const hasDiscount = item.price > item.discountedPrice;
    const discountPercentage = hasDiscount
      ? Math.round(((item.price - item.discountedPrice) / item.price) * 100)
      : 0;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() =>
          navigation.navigate("ProductDetailScreen", { product: item })
        }
      >
        <Image
          source={{ uri: item.imagePath || item.image }}
          style={styles.productImage}
        />
        <View style={{ padding: 8 }}>
          <Text style={styles.productName}>
            {item.name || item.productName}
          </Text>
          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>
              {item.rating || 0} ({item.reviews || 0} reviews)
            </Text>
          </View>
          {hasDiscount ? (
            <View style={styles.priceRow}>
              <Text style={styles.discountedPriceText}>
                {formatPrice(item.discountedPrice)}
              </Text>
              <Text style={styles.originalPriceText}>
                {formatPrice(item.price)}
              </Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discountPercentage}%</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.productPrice}>
              {formatPrice(item.price)}
            </Text>
          )}
        </View>
        {/* Nút toggling favorite */}
        <TouchableOpacity
          style={styles.wishlistIcon}
          onPress={() => toggleFavorite(item)}
        >
          {item.isFavorite ? (
            <Ionicons name="heart" size={20} color="#FF3D3D" />
          ) : (
            <Ionicons name="heart-outline" size={20} color="#000" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = ({ item }) => {
    const isActive = item.id === selectedCategory;
    return (
      <TouchableOpacity
        style={[styles.categoryButton, isActive && { backgroundColor: "#000" }]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <Text style={[styles.categoryText, isActive && { color: "#fff" }]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  // Thay đổi ListHeader thành banner
  const ListHeader = () => (
    <View style={{ marginBottom: 10 }}>
      <Image
        source={{
          uri: "https://res.cloudinary.com/dqjtkdldj/image/upload/v1743743707/Frame_2_zy28xh.png",
        }}
        style={styles.bannerImage}
      />
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) =>
            item.id ? String(item.id) : String(index)
          }
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  bannerImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
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
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  discountedPriceText: { fontSize: 14, fontWeight: "bold", color: "#FC7B54" },
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
