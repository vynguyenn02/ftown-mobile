import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import SearchBar from "../components/SearchBar";
import HeroSection from "../components/HeroSection";
import KoiBreeds from "../components/KoiBreeds";
import ProductSection from "../components/ProductSection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAsyncStorage } from "../context/AsyncStorageContext";

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAsyncStorage(); // Get the logout function from context

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const expToken = await AsyncStorage.getItem("expToken");
      const currentTime = Math.floor(Date.now() / 1000);

      if (expToken && parseInt(expToken, 10) < currentTime) {
        logout(); // Log out if the token is expired
        alert("Phiên bản đăng nhập hết hạn");
      }
    };
    const fetchCategories = async () => {
      try {
        const data = await getAllCategory();
        setCategories(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchProducts = async () => {
      try {
        const data = await getAllProduct();
        const availableProducts = data.filter(product => product.status === "Available" || product.status === "Consigned Sale");
        setProducts(availableProducts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkTokenExpiration(); // Check token expiration when the component mounts
    fetchCategories();
    fetchProducts();
  }, []);

  const sections = [
    { key: "hero", component: <HeroSection /> },
    {
      key: "koiBreeds",
      component: <KoiBreeds categories={categories} navigation={navigation} />,
    },
    {
      key: "productSection",
      component: <ProductSection products={products} navigation={navigation} />,
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedSearchBar}>
        <SearchBar />
      </View>
      <FlatList
        data={sections}
        renderItem={({ item }) => item.component}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: "#fff",
  },
  fixedSearchBar: {
    backgroundColor: "#fff",
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default HomeScreen;
