import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

const KoiFish = ({ navigation, products }) => {
  const renderItem = ({ item }) => (
    <Pressable
      style={styles.fishCard}
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: item._id })
      }
    >
      <Image
        source={{ uri: item.image[0] }}
        accessibilityLabel={`Image of ${item.productName}`}
        style={styles.fishImage}
      />
      <Text style={styles.fishName} numberOfLines={1} ellipsizeMode="tail">
        {item.productName}
      </Text>
      <Text style={styles.fishCategory} numberOfLines={1} ellipsizeMode="tail">
        {item?.categoryId?.categoryName
          ? "(" + item.categoryId.categoryName + ")"
          : "(Không xác định)"}
      </Text>
      <Text style={styles.fishPrice}>
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item.price)}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.section}>
      <View style={styles.flexJusSpace}>
        <Text style={styles.sectionTitle}>Cá Koi</Text>
        <Pressable
          onPress={() => navigation.navigate("Product", { searchTerm: "" })}
          style={styles.viewMoreContainer}
        >
          <Text style={styles.viewMore}>Xem tất cả</Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color="#ba2d32"
          />
        </Pressable>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 20, paddingHorizontal: 10 },
  flexJusSpace: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ba2d32",
  },
  viewMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewMore: {
    fontSize: 14,
    color: "#ba2d32",
    marginRight: 5,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  fishCard: {
    width: "48%",
    backgroundColor: "#fcfcff",
    borderRadius: 20,
    alignItems: "center",
    elevation: 5, // For Android shadow
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.5, // Shadow blur radius
  },
  fishImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    objectFit: "cover",
    marginBottom: 5,
  },
  fishName: {
    textAlign: "left",
    width: "100%",
    marginTop: 5,
    fontWeight: "600",
    paddingHorizontal: 10,
    fontSize: 16,
  },
  fishCategory: {
    textAlign: "left",
    width: "100%",
    marginTop: 5,
    paddingHorizontal: 10,
    fontSize: 13,
  },
  fishPrice: {
    marginTop: 5,
    fontSize: 14,
    width: "100%",
    textAlign: "right",
    color: "#ba2d32",
    paddingHorizontal: 10,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 5,
  },
});

export default KoiFish;
