// components/Product.js

import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const Product = ({ item }) => {
  const formattedDate = dayjs(item.dateAdded).format("DD/MM/YY");
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(item.price);

  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("ProductDetail", { productId: item._id });
  };
  return (
    <TouchableOpacity style={styles.productCard} onPress={handlePress}>
      <Image source={{ uri: item.image[0] }} style={styles.productImage} />
      <View style={styles.informationContainer}>
        <View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.productName}
          >
            {item.productName}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.breed}>
            {item?.categoryId?.categoryName
              ? "(" + item.categoryId.categoryName + ")"
              : "(Không xác định)"}
          </Text>
          <View style={styles.flexBetween}>
            {/* <Text style={styles.dateAdded}> {formattedDate}</Text> */}
            <Text style={styles.productPrice}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.price)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: "#f9f9f9",
    marginVertical: 10,
    padding: 2,
    borderRadius: 10,
    width: "48%", // Adjusted for two-column layout
    marginBottom: 20, // Keep margin for spacing
    marginRight: 10, // Added margin to the right
    elevation: 5, // For Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  flexBetween: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  productImage: {
    width: "100%",
    height: 150, // Adjust as needed
    borderRadius: 10,
    marginBottom: 10,
    objectFit: "cover",
  },
  productName: {
    fontSize: 18, // Increased font size for boldness
    fontWeight: "700", // Increased font weight
  },
  productPrice: {
    fontSize: 16, // Increased font size
    color: "#ba2d32",
    marginVertical: 5,
  },
  dateAdded: {
    fontSize: 14, // Increased font size
    color: "#777",
    marginVertical: 5,
  },
  breed: {
    fontSize: 14, // Increased font size
    color: "#000",
    marginVertical: 5,
  },
  addToCartButton: {
    backgroundColor: "#ba2d32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  informationContainer: {
    padding: 2,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});

export default Product;
