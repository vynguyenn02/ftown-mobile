import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const KoiBreeds = ({ navigation, categories }) => {
  return (
    <View style={styles.section}>
      <View style={styles.flexJusSpace}>
        <Text style={styles.sectionTitle}>Giống Cá Koi Phổ Biến</Text>

        <Pressable
          onPress={() => navigation.navigate("Breed")}
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((breed, index) => (
          <Pressable
            key={index}
            style={styles.breedCard}
            onPress={() =>
              navigation.navigate("BreedDetail", { categoryId: breed?._id })
            }
          >
            <Image source={{ uri: breed?.image }} style={styles.breedImage} />
            <Text style={styles.breedName}>{breed?.categoryName}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 20, padding: 10 },
  flexJusSpace: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ba2d32", // Consistent color with your theme
  },
  viewMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewMore: {
    fontSize: 14,
    color: "#ba2d32", // Match the theme color
    marginRight: 5, // Space between text and icon
  },
  breedCard: {
    width: 120,
    marginRight: 10,
    backgroundColor: "#ffffffcc", // Light background for contrast
    borderRadius: 10,
    alignItems: "center",
    padding: 5,
    elevation: 3, // Add a shadow effect for depth
  },
  breedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover", // Use cover to fill the circle
    borderWidth: 1,
  },
  breedName: {
    textAlign: "center",
    marginTop: 5,
    fontWeight: "600",
  },
});

export default KoiBreeds;
