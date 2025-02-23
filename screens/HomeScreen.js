import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";

const products = [
  {
    id: "1",
    name: "MEN'S HMLYN D. PARKA",
    price: "$40",
    image: require("../assets/AT1A1810.jpg"),
    rating: 4.5,
    reviews: 1200,
  },
  {
    id: "2",
    name: "MEN'S OUTDOOR BASIC",
    price: "$190",
    image: require("../assets/AT1A1810.jpg"),
    rating: 4.7,
    reviews: 810,
  },
  {
    id: "3",
    name: "MEN'S '96 RETRO NUPTSE",
    price: "$216",
    image: require("../assets/AT1A1810.jpg"),
    rating: 4.6,
    reviews: 107,
  },
  {
    id: "4",
    name: "SUPREME X TNF PAPER N",
    price: "$190",
    image: require("../assets/AT1A1810.jpg"),
    rating: 4.8,
    reviews: 320,
  },
  {
    id: "5",
    name: "URBAN PUFFER JACKET",
    price: "$150",
    image: require("../assets/AT1A1810.jpg"),
    rating: 4.3,
    reviews: 230,
  },
  {
    id: "6",
    name: "VINTAGE BOMBER JACKET",
    price: "$170",
    image: require("../assets/AT1A1810.jpg"),
    rating: 4.9,
    reviews: 500,
  },
];

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products..."
          value={search}
          onChangeText={setSearch}
        />
        <Feather name="search" size={20} color="black" />
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard item={item} />}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.buttonText}>FILTER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.buttonText}>SORTING</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  productList: {
    paddingHorizontal: 10,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
});
