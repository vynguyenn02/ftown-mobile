// HomeScreen.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "../components/Header";
import productApi from "../api/productApi";
import { ThemeContext } from "../context/ThemeContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

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

const HomeScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
        if (response.data?.data) {
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

  const renderCategoryItem = ({ item }) => {
    const isActive = item.id === selectedCategory;
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          {
            backgroundColor: isActive ? theme.text : theme.card,
            borderColor: theme.border,
          },
        ]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <Text
          style={{
            color: isActive ? theme.background : theme.text,
            fontWeight: isActive ? "700" : "500",
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProductItem = ({ item }) => {
    const hasDiscount = item.price > item.discountedPrice;
    const discountPercentage = hasDiscount
      ? Math.round(((item.price - item.discountedPrice) / item.price) * 100)
      : 0;

    return (
      <TouchableOpacity
        style={[styles.productCard, { backgroundColor: theme.card }]}
        onPress={() =>
          navigation.navigate("ProductDetailScreen", { product: item })
        }
      >
        <Image source={{ uri: item.imagePath }} style={styles.productImage} />
        <View style={{ padding: 8 }}>
          <Text
            style={[styles.productName, { color: theme.text }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          {/* Dãy màu sắc */}
          {item.colors?.length > 0 && (
            <View style={styles.colorRow}>
              {item.colors.map((col, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: col },
                  ]}
                />
              ))}
            </View>
          )}

          {hasDiscount ? (
            <View style={styles.priceRow}>
              <Text
                style={[styles.discountedPriceText, { color: theme.text }]}
              >
                {formatPrice(item.discountedPrice)}
              </Text>
              <Text style={[styles.originalPriceText, { color: theme.text }]}>
                {formatPrice(item.price)}
              </Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  -{discountPercentage}%
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.productPrice, { color: theme.text }]}>
              {formatPrice(item.price)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={styles.listHeaderContainer}>
      <Image
        source={{
          uri:
            "https://res.cloudinary.com/dqjtkdldj/image/upload/v1743743707/Frame_2_zy28xh.png",
        }}
        style={styles.bannerImage}
      />
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoryListContent}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      <Header />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) => String(item.productId || index)}
          renderItem={renderProductItem}
          numColumns={2}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.productListContainer}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
    marginBottom: 12,
  },
  listHeaderContainer: {
    marginBottom: 20,
  },
  categoryListContent: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  productListContainer: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  productCard: {
    width: CARD_WIDTH,
    borderRadius: 10,
    margin: 8,
    overflow: "hidden",
  },

  productImage: { width: "100%", height: 160, resizeMode: "cover" },
  productName: { fontSize: 14, fontWeight: "600", marginBottom: 4 },

  // ----- styles cho dãy màu -----
  colorRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  colorCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  // -----------------------------

  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  ratingText: { fontSize: 12, marginLeft: 4 },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  discountedPriceText: { fontSize: 14, fontWeight: "bold" },

  originalPriceText: {
    fontSize: 12,
    textDecorationLine: "line-through",
    marginLeft: 6,
  },
  discountBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
