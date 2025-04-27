import React, { useEffect, useState, useContext } from "react";
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
import { Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import favoriteService from "../api/productApi";
import { ThemeContext } from "../context/ThemeContext"; // ← THÊM theme context

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const FavoriteScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext); // ← LẤY theme
  const [accountId, setAccountId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchFavorites = async () => {
      if (accountId) {
        setLoading(true);
        try {
          const response = await favoriteService.getAllFavoriteProducts(accountId, 1, 10);
          if (response.data?.data) {
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

  const dataToRender =
    favorites.length % 2 !== 0
      ? [...favorites, { isEmpty: true, productId: "empty" }]
      : favorites;

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
        style={[styles.card, { backgroundColor: theme.card }]}
        onPress={() => navigation.navigate("ProductDetailScreen", { product: item })}
      >
        <Image source={{ uri: item.imagePath }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={2}>
            {item.name}
          </Text>
          {hasDiscount ? (
            <View style={styles.priceRow}>
              <Text style={[styles.discountedPrice, { color: "#FC7B54" }]}>
                {formatVND(item.discountedPrice)}
              </Text>
              <Text style={[styles.originalPrice, { color: theme.subtext }]}>
                {formatVND(item.price)}
              </Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discountPercentage}%</Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.cardPrice, { color: theme.text }]}>{formatVND(item.price)}</Text>
          )}
        </View>
        <TouchableOpacity style={[styles.wishlistIcon, { backgroundColor: theme.card }]}>
          <Feather name="heart" size={20} color={theme.text} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />
      <View style={[styles.headerTitleContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Sản phẩm yêu thích</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
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
              <Text style={{ color: theme.subtext }}>Không có sản phẩm yêu thích.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitleContainer: { padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  loader: { marginTop: 20 },
  listContainer: { padding: 8 },
  columnWrapper: { justifyContent: "space-between" },
  card: {
    borderRadius: 8,
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 140, resizeMode: "cover" },
  cardContent: { padding: 8 },
  cardTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  cardPrice: { fontSize: 14, fontWeight: "bold" },
  priceRow: { flexDirection: "row", alignItems: "center" },
  discountedPrice: { fontSize: 14, fontWeight: "bold" },
  originalPrice: {
    fontSize: 12,
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
    padding: 4,
    borderRadius: 20,
    elevation: 2,
  },
  emptyContainer: { alignItems: "center", marginTop: 20 },
});
