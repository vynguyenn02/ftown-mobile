import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ProductCard = ({ item }) => {
  const navigation = useNavigation(); // Lấy navigation từ context

  return (
    <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate("ProductDetail", { product: item })}
    // Cập nhật state activeTab
>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={16} color="gold" />
          <Text style={styles.ratingText}>{item.rating} ({item.reviews} reviews)</Text>
        </View>
        <Text style={styles.productPrice}>{item.price}</Text>
        <View style={styles.productFooter}>
          <TouchableOpacity>
            <FontAwesome name="heart-o" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="shopping-cart" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  productCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },
  productInfo: {
    alignItems: "center",
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 5,
    color: "#777",
  },
  productPrice: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
});
