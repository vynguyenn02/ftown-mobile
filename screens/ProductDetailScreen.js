import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import Header from "../components/Header";

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;

  // Dummy feedback data
  const feedbacks = [
    { id: "1", user: "John Doe", rating: 5, comment: "Great quality, fits well!" },
    { id: "2", user: "Jane Smith", rating: 4, comment: "Nice fabric, but a little loose." },
    { id: "3", user: "Alice Johnson", rating: 5, comment: "Love the design and comfort!" },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={product.image} style={styles.productImage} />
        
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price}</Text>
          <Text style={styles.productOldPrice}>$30.43</Text>
        </View>
        
        <View style={styles.sizeContainer}>
          <Text style={styles.sizeTitle}>Choose Size</Text>
          <View style={styles.sizeOptions}>
            {["S", "M", "L", "XL"].map((size) => (
              <TouchableOpacity key={size} style={styles.sizeButton}>
                <Text style={styles.sizeText}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
        
        <Text style={styles.feedbackTitle}>Customer Feedback</Text>
        <FlatList
          data={feedbacks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.feedbackItem}>
              <Text style={styles.feedbackUser}>{item.user}</Text>
              <Text style={styles.feedbackRating}>⭐ {item.rating}</Text>
              <Text style={styles.feedbackComment}>{item.comment}</Text>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  detailsContainer: {
    alignItems: "center",
    padding: 10,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 18,
    color: "#ff4500",
  },
  productOldPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: "#888",
  },
  sizeContainer: {
    padding: 10,
  },
  sizeTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sizeOptions: {
    flexDirection: "row",
    marginTop: 5,
  },
  sizeButton: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  sizeText: {
    fontSize: 16,
  },
  addToCartButton: {
    backgroundColor: "#777777",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
  },
  addToCartText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    marginTop: 10,
  },
  feedbackItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  feedbackUser: {
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackRating: {
    fontSize: 14,
    color: "#ffaa00",
  },
  feedbackComment: {
    fontSize: 14,
    color: "#555",
  },
});
