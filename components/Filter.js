import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Animated,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const PRICE_OPTIONS = [
  { label: "Tăng dần", value: "asc" },
  { label: "Giảm dần", value: "desc" },
];

export default function Filter({ onApplyFilters, categories }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const translateX = useRef(new Animated.Value(300)).current;

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  const closeModal = () => {
    Animated.spring(translateX, {
      toValue: 350,
      useNativeDriver: true,
      bounciness: 0,
    }).start(() => setModalVisible(false));
  };

  const toggleBreedSelection = (breed) => {
    setSelectedBreeds((prev) =>
      prev.includes(breed)
        ? prev.filter((item) => item !== breed)
        : [...prev, breed]
    );
  };

  const applyFilters = () => {
    onApplyFilters({ selectedBreeds, selectedPrice });
    closeModal();
  };

  const clearFilters = () => {
    setSelectedPrice(null);
    setSelectedBreeds([]);
    onApplyFilters({ selectedBreeds, selectedPrice });

    closeModal();
  };

  const renderBreedItem = (item) => (
    <TouchableOpacity
      key={item._id}
      style={[
        styles.optionButton,
        selectedBreeds.includes(item.categoryName) && styles.selectedOption,
      ]}
      onPress={() => toggleBreedSelection(item.categoryName)}
    >
      <Text style={styles.optionText}>{item.categoryName}</Text>
    </TouchableOpacity>
  );

  const renderPriceOption = (item) => (
    <TouchableOpacity
      key={item.value}
      style={[
        styles.optionButton,
        selectedPrice === item.value && styles.selectedOption,
      ]}
      onPress={() => setSelectedPrice(item.value)}
    >
      <Text style={styles.optionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Pressable style={styles.filterButton} onPress={openModal}>
        <MaterialIcons name="filter-list" size={24} color="#fff" />
      </Pressable>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.modalView, { transform: [{ translateX }] }]}
        >
          <View style={styles.modalContainer}>
            <View>
              <Text style={styles.modalTitle}>Filter Options</Text>

              <Text style={styles.sectionTitle}>Giá:</Text>
              <View style={styles.priceList}>
                {PRICE_OPTIONS.map(renderPriceOption)}
              </View>

              <Text style={styles.sectionTitle}>Giống:</Text>
              <View style={styles.breedList}>
                {categories.map(renderBreedItem)}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <View style={styles.flexBetween}>
                <Pressable style={styles.applyButton} onPress={applyFilters}>
                  <Text style={styles.buttonText}>Apply</Text>
                </Pressable>
                <Pressable style={styles.clearButton} onPress={clearFilters}>
                  <Text style={styles.buttonText}>Clear Filter</Text>
                </Pressable>
              </View>
              <Pressable style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: "#ba2d32",
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: { justifyContent: "space-between", height: "100%" },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ba2d32",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ba2d32",
  },
  optionButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9", // Màu nền của hộp
    alignItems: "center",
    margin: 5, // Khoảng cách giữa các hộp
  },
  selectedOption: {
    backgroundColor: "#dad9ed",
  },
  optionText: {
    fontSize: 16,
    color: "#333", // Màu chữ
  },
  buttonContainer: {
    // flexDirection: "column",
    // justifyContent: "space-between",
    gap: 10,
    width: "100%",
  },
  flexBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  applyButton: {
    backgroundColor: "#ba2d32",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#8a8a8a",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  breedList: {
    flexDirection: "row",
    flexWrap: "wrap", // Sử dụng flexWrap để cho phép các phần tử xuống dòng
    // justifyContent: "space-between", // Đảm bảo các cột đều cách đều nhau
  },
  priceList: {
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: "space-between",
  },
});
