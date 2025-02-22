// SearchBar.js
import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import Filter from "./Filter";

const SearchBarFilter = ({ searchText, onApplyFilters, categories }) => {
  const navigation = useNavigation(); // Get navigation object using the hook

  const handleSearchPress = () => {
    navigation.navigate("Search");
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder="Search for Koi "
        style={styles.searchInput}
        value={searchText}
        onTouchStart={handleSearchPress} // Mở modal khi chạm vào ô tìm kiếm
        editable={false} // Disable typing so it acts like a button
      />
      <Filter categories={categories} onApplyFilters={onApplyFilters} />
    </View>
  );
};
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 5,
    gap: 20,
    height: 40,
  },
  searchInput: {
    borderRadius: 8,
    flex: 1,
    fontSize: 16,
    backgroundColor: "#edeef0",
    padding: 20,
  },
  cartButton: {
    marginLeft: 10,
    justifyContent: "center",
  },
});

export default SearchBarFilter;
