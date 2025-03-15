import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

const categories = [
  { id: "all", title: "All Items" },
  { id: "dress", title: "Dress" },
  { id: "tshirt", title: "T-Shirt" },
];

const mockProducts = [
  {
    id: "1",
    name: "Modern Light Clothes",
    price: 212.99,
    rating: 5.0,
    reviews: 123,
    image: { uri: "https://picsum.photos/200/300" },
  },
  {
    id: "2",
    name: "Light Dress Bless",
    price: 162.99,
    rating: 5.0,
    reviews: 88,
    image: { uri: "https://picsum.photos/200/301" },
  },
  {
    id: "3",
    name: "Casual Streetwear",
    price: 99.99,
    rating: 4.5,
    reviews: 56,
    image: { uri: "https://picsum.photos/200/302" },
  },
  // Thêm sản phẩm nếu cần
];

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const renderCategoryItem = ({ item }) => {
    const isActive = item.id === selectedCategory;
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          isActive && { backgroundColor: "#000" },
        ]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <Text style={[styles.categoryText, isActive && { color: "#fff" }]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() =>
        navigation.navigate("ProductDetailScreen", {
          product: item,
        })
      }
    >
      <Image source={item.image} style={styles.productImage} />
      <View style={{ padding: 8 }}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.ratingRow}>
          <MaterialIcons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>
            {item.rating} ({item.reviews} reviews)
          </Text>
        </View>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity style={styles.wishlistIcon}>
        <Feather name="heart" size={20} color="#000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Header nội dung cho FlatList
  const ListHeader = () => (
    <View>
      {/* Header chào user */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubTitle}>Hello, Welcome 👋</Text>
          <Text style={styles.headerTitle}>Albert Stevano</Text>
        </View>
        <TouchableOpacity style={styles.userIcon}>
          <Ionicons name="person-circle-outline" size={40} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#000" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search clothes..."
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Danh mục */}
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
      <FlatList
        data={mockProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.productListContainer}
      />
      {/* Nếu dùng tab navigator, bottom nav có thể được quản lý ở cấp cao hơn */}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerSubTitle: { fontSize: 14, color: "#666" },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginTop: 2, color: "#000" },
  userIcon: { width: 40, height: 40 },
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
