// SearchBar.js
import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const SearchBar = () => {
  const navigation = useNavigation(); // Get navigation object using the hook

  const handleCartPress = () => {
    navigation.navigate("Cart");
  };

  const handleSearchPress = () => {
    navigation.navigate("Search");
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder="Search for Koi "
        style={styles.searchInput}
        clearButtonMode="always"
        onTouchStart={handleSearchPress} // Mở modal khi chạm vào ô tìm kiếm
        editable={false} // Disable typing so it acts like a button
      />
      <TouchableOpacity onPress={handleCartPress} style={styles.cartButton}>
        <Icon name="shopping-cart" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 5,
    gap: 20,
    height: 40,
    paddingHorizontal: 10,
  },
  searchInput: {
    borderRadius: 8,
    flex: 1,
    fontSize: 16,
    backgroundColor: "#edeef0",
    padding: 8,
  },
  cartButton: {
    marginLeft: 10,
    justifyContent: "center",
  },
});

export default SearchBar;
