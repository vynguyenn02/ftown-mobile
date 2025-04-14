// screens/FavoriteScreen.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Header from "../components/Header";
import { Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Giả sử API lấy sản phẩm yêu thích được định nghĩa trong productApi
import favoriteService from "../api/productApi";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const FavoriteScreen = ({ navigation }) => {
  const [accountId, setAccountId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy accountId từ AsyncStorage
  useEffect(() => {
    const loadAccountId = async () => {
      try {
        const storedId = await AsyncStorage.getItem("accountId");
        if (storedId) {
          setAccountId(parseInt(storedId, 10));
        }
      } catch (error) {
        console.error("Error loading accountId:", error);
      }
    };
    loadAccountId();
  }, []);

  // Gọi API lấy danh sách sản phẩm yêu thích
  useEffect(() => {
    const fetchFavorites = async () => {
      if (accountId) {
        setLoading(true);
        try {
          // Gọi API với trang 1, pageSize = 10 (có thể chỉnh nếu cần)
          const response = await favoriteService.getAllFavoriteProducts(accountId, 1, 10);
          console.log("Favorite response:", response.data);
          if (response.data && response.data.data) {
            setFavorites(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching favorite products:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFavorites();
  }, [accountId]);

  // Nếu số lượng sản phẩm là lẻ, thêm một phần tử dummy để lưới 2 cột hiển thị đẹp
  const dataToRender =
    favorites.length % 2 !== 0 ? [...favorites, { isEmpty: true, productId: "empty" }] : favorites;

  // Render card cho sản phẩm
  const renderItem = ({ item }) => {
    if (item.isEmpty) {
      return <View style={[styles.card, { backgroundColor: "transparent", borderWidth: 0 }]} />;
    }

    const hasDiscount = item.price > item.discountedPrice;
    const discountPercentage = hasDiscount
      ? Math.round(((item.price - item.discountedPrice) / item.price) * 100)
      : 0;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("ProductDetailScreen", { product: item })
        }
      >
        <Image source={{ uri: item.imagePath }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.name}
          </Text>
          {hasDiscount ? (
            <View style={styles.priceRow}>
              <Text style={styles.discountedPrice}>
                {formatVND(item.discountedPrice)}
              </Text>
              <Text style={styles.originalPrice}>
                {formatVND(item.price)}
              </Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discountPercentage}%</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.cardPrice}>{formatVND(item.price)}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.wishlistIcon}>
          <Feather name="heart" size={20} color="#000" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Sản phẩm yêu thích</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      ) : (
        <FlatList
          data={dataToRender}
          keyExtractor={(item, index) =>
            item.productId ? item.productId.toString() : index.toString()
          }
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>Không có sản phẩm yêu thích.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  headerTitleContainer: { padding: 16, backgroundColor: "#fff" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  loader: { marginTop: 20 },
  listContainer: { padding: 8 },
  columnWrapper: { justifyContent: "space-between" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 140, resizeMode: "cover" },
  cardContent: { padding: 8 },
  cardTitle: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 4 },
  cardPrice: { fontSize: 14, fontWeight: "bold", color: "#333" },
  priceRow: { flexDirection: "row", alignItems: "center" },
  discountedPrice: { fontSize: 14, fontWeight: "bold", color: "#FC7B54" },
  originalPrice: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
    marginLeft: 4,
  },
  discountBadge: {
    backgroundColor: "#FF3D3D",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginLeft: 4,
  },
  discountText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  wishlistIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 20,
    elevation: 2,
  },
  emptyContainer: { alignItems: "center", marginTop: 20 },
});
