import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import dayjs from "dayjs";

// Rating item component
const RatingItem = ({ item }) => (
  <View style={styles.ratingCard}>
    <View style={styles.userInfo}>
      <Image
        source={{ uri: "https://randomuser.me/api/portraits/women/2.jpg" }}
        style={styles.avatar}
      />
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{item?.userId?.username}</Text>
        <Text style={styles.date}>
          {dayjs(item?.date).format("DD/MM/YYYY")}
        </Text>
      </View>
    </View>
    <View style={styles.starRow}>
      {[...Array(item.rating)].map((_, index) => (
        <FontAwesome key={index} name="star" size={16} color="#FFD700" />
      ))}
    </View>
    <Text style={styles.comment}>{item.description}</Text>
  </View>
);

// Main component
const RatingList = ({ feedbacks }) => {
  const [filteredRatings, setFilteredRatings] = useState(feedbacks);
  const [modalVisible, setModalVisible] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [currentFilter, setCurrentFilter] = useState("all");

  // Count ratings for each star level
  const countRatingsByStar = (star) =>
    feedbacks.filter((item) => item.rating === star).length;

  useEffect(() => {
    // Calculate the average rating
    const totalRating = feedbacks.reduce((acc, item) => acc + item.rating, 0);
    const average = (totalRating / feedbacks.length).toFixed(1); // Round to 1 decimal place
    setAverageRating(average);
  }, [feedbacks]);

  // Filter function
  const filterByRating = (rating) => {
    if (rating === "all") {
      setFilteredRatings(feedbacks);
    } else {
      const filtered = feedbacks.filter((item) => item.rating === rating);
      setFilteredRatings(filtered);
    }
    setCurrentFilter(rating); // Update current filter
    setModalVisible(false); // Close modal after filtering
  };

  return (
    <View style={styles.container}>
      {/* Button to open modal */}
      <View style={styles.filterContainer}>
        <Text>
          Trung bình: {averageRating}
          <FontAwesome name="star" size={16} color="#FFD700" />
        </Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>
            {currentFilter === "all" ? (
              "All"
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.filterButtonText}>{currentFilter} </Text>
                <FontAwesome name="star" size={16} color="#FFD700" />
              </View>
            )}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Option to show all ratings */}
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => filterByRating("all")}
            >
              <Text style={styles.modalItemText}>
                All Ratings ({feedbacks.length})
              </Text>
            </TouchableOpacity>

            {/* Filter options by star ratings */}
            {[5, 4, 3, 2, 1].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={styles.modalItem}
                onPress={() => filterByRating(rating)}
              >
                <Text style={styles.modalItemText}>
                  {Array.from({ length: rating }).map((_, index) => (
                    <FontAwesome
                      key={index}
                      name="star"
                      size={16}
                      color="#FFD700"
                    />
                  ))}
                  ({countRatingsByStar(rating)})
                </Text>
              </TouchableOpacity>
            ))}

            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Display filtered ratings */}
      <FlatList
        data={filteredRatings}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <RatingItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  filterButton: {
    backgroundColor: "transparent",
    borderWidth: 0.3,
    borderColor: "#333",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  ratingCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userDetails: {
    flexDirection: "column",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  starRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  comment: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default RatingList;
