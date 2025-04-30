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
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "../components/Header";
import productApi from "../api/productApi";
import suggestApi from "../api/favoriteStyleApi"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../context/ThemeContext";
import { useFocusEffect } from '@react-navigation/native';
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [suggestionHeight] = useState(new Animated.Value(0));
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSuggestions = () => {
    if (isExpanded) {
      Animated.timing(suggestionHeight, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => {
        setShowSuggestions(false);
      });
    } else {
      setShowSuggestions(true);
      Animated.timing(suggestionHeight, {
        toValue: 160,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
    setIsExpanded(!isExpanded);
  };

  useEffect(() => { fetchProducts(); }, [selectedCategory]);
  useFocusEffect(
    React.useCallback(() => {
      fetchSuggestions(); // 🔥 mỗi lần quay lại Home thì tự fetch gợi ý mới nhất
    }, [])
  );
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let response;
      if (selectedCategory === "all") {
        response = await productApi.getAllProducts(1, 30);
      } else {
        response = await productApi.getAllProductsByCategory(selectedCategory, 1, 30);
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

  const fetchSuggestions = async () => {
    try {
      const accountId = await AsyncStorage.getItem("accountId");
      if (!accountId) return;
      const response = await suggestApi.getSuggestedProducts(accountId);
      if (response?.data?.data) {
        setSuggestedProducts(response.data.data);
      } else {
        setSuggestedProducts([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm gợi ý:", error);
      setSuggestedProducts([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleProductPress = async (item) => {
    try {
      const accountId = await AsyncStorage.getItem("accountId");
      if (accountId) {
        await suggestApi.recordProductInteraction(accountId, item.productId);
      }
    } catch (error) {
      console.error("Lỗi ghi nhận interaction:", error);
    }
    navigation.navigate("ProductDetailScreen", { product: item });
  };

  const handleSuggestedProductPress = async (item) => {
    try {
      const accountId = await AsyncStorage.getItem("accountId");
      if (accountId) {
        await suggestApi.recordProductInteraction(accountId, item.productId);
      }
    } catch (error) {
      console.error("Lỗi ghi nhận interaction:", error);
    }
    navigation.navigate("ProductDetailScreen", { productId: item.productId });
  };

  const renderCategoryItem = ({ item }) => {
    const isActive = item.id === selectedCategory;
    return (
      <TouchableOpacity
        style={[styles.categoryButton, { backgroundColor: isActive ? theme.text : theme.card, borderColor: theme.border }]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <Text style={{ color: isActive ? theme.background : theme.text, fontWeight: isActive ? "700" : "500" }}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderProductItem = ({ item }) => {
    const hasDiscount = item.price > item.discountedPrice;
    const discountPercentage = hasDiscount ? Math.round(((item.price - item.discountedPrice) / item.price) * 100) : 0;
    return (
      <TouchableOpacity
        style={[styles.productCard, { backgroundColor: theme.card }]}
        onPress={() => handleProductPress(item)}
      >
        <Image source={{ uri: item.imagePath }} style={styles.productImage} />
        <View style={{ padding: 8 }}>
          <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>{item.name}</Text>
          {item.colors?.length > 0 && (
            <View style={styles.colorRow}>
              {item.colors.map((col, idx) => (
                <View key={idx} style={[styles.colorCircle, { backgroundColor: col }]} />
              ))}
            </View>
          )}
          {hasDiscount ? (
            <View style={styles.priceRow}>
              <Text style={[styles.discountedPriceText, { color: theme.text }]}>{formatPrice(item.discountedPrice)}</Text>
              <Text style={[styles.originalPriceText, { color: theme.text }]}>{formatPrice(item.price)}</Text>
              <View style={styles.discountBadge}><Text style={styles.discountText}>-{discountPercentage}%</Text></View>
            </View>
          ) : (
            <Text style={[styles.productPrice, { color: theme.text }]}>{formatPrice(item.price)}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSuggestedProductItem = ({ item }) => (
    <TouchableOpacity
      style={{ width: 120, marginRight: 12 }}
      onPress={() => handleSuggestedProductPress(item)}
    >
      <View style={{ height: 120, backgroundColor: "#f5f5f5", borderRadius: 10 }}>
        <Image source={{ uri: item.imagePath }} style={{ width: "100%", height: "100%", borderRadius: 10 }} resizeMode="cover" />
      </View>
      <Text numberOfLines={2} style={{ marginTop: 6, fontSize: 12, fontWeight: "500" }}>{item.name}</Text>
      <Text style={{ color: "#000", marginTop: 2, fontSize: 12 }}>{item.discountedPrice.toLocaleString()} đ</Text>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={styles.listHeaderContainer}>
      <Image
        source={{ uri: "https://res.cloudinary.com/dqjtkdldj/image/upload/v1743743707/Frame_2_zy28xh.png" }}
        style={styles.bannerImage}
      />
      <TouchableOpacity style={styles.suggestionToggle} onPress={toggleSuggestions}>
      <Text style={[styles.suggestionToggleText, { color: theme.text }]}>
        Có thể bạn sẽ thích
      </Text>
        <MaterialIcons name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color={theme.text} />
      </TouchableOpacity>
      {showSuggestions && (
        <Animated.View style={{ height: suggestionHeight, overflow: "hidden" }}>
          {suggestedProducts.length === 0 ? (
            <TouchableOpacity
              style={styles.suggestionGuideContainer}
              onPress={() => navigation.navigate('FavoriteStyleScreen')}
            >
              <Text style={styles.suggestionGuideText}>
                Trải nghiệm và lựa chọn phong cách yêu thích để nhận đề xuất phù hợp hơn!
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color="#000" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          ) : (
            <FlatList
              data={suggestedProducts}
              keyExtractor={(item, index) => String(item.productId || index)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderSuggestedProductItem}
              contentContainerStyle={styles.suggestionListContent}
            />
          )}
        </Animated.View>
      )}

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      <Header />
      {isLoading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.primary} /></View>
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
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  bannerImage: { width: "100%", height: 160, resizeMode: "cover", marginBottom: 12 },
  listHeaderContainer: { marginBottom: 20 },
  categoryListContent: { paddingHorizontal: 12 },
  categoryButton: { marginRight: 10, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1 },
  productListContainer: { paddingHorizontal: 10, paddingBottom: 80 },
  productCard: { width: CARD_WIDTH, borderRadius: 10, margin: 8, overflow: "hidden" },
  productImage: { width: "100%", height: 160, resizeMode: "cover" },
  productName: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  colorRow: { flexDirection: "row", marginBottom: 6 },
  colorCircle: { width: 12, height: 12, borderRadius: 6, marginRight: 4, borderWidth: 1, borderColor: "#ddd" },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  discountedPriceText: { fontSize: 14, fontWeight: "bold" },
  originalPriceText: { fontSize: 12, textDecorationLine: "line-through", marginLeft: 6 },
  discountBadge: { backgroundColor: "#FF3B30", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 6 },
  discountText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  productPrice: { fontSize: 14, fontWeight: "bold" },
  suggestionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 12, marginBottom: 8 },
  suggestionHeaderText: { fontSize: 16, fontWeight: "600" },
  suggestionContainer: { marginVertical: 12 },
  suggestionListContent: { paddingHorizontal: 12 },
  suggestionToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  suggestionToggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  suggestionGuideContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  suggestionGuideText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});
