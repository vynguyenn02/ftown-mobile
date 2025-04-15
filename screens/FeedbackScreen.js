// OrderFeedbackScreen.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import feedbackApi from "../api/feedbackApi";
import orderApi from "../api/orderApi"; // This module should have your getOrdersReturnRequest function

/**
 * Custom Star Rating Component.
 * Displays 5 stars that the user can tap to set the rating.
 */
const FeedbackStarRating = ({ rating, setRating }) => {
  const handlePressStar = (index) => {
    if (setRating) {
      setRating(index + 1);
    }
  };

  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }).map((_, index) => (
        <TouchableOpacity key={index} onPress={() => handlePressStar(index)}>
          <Ionicons
            name={index < rating ? "star" : "star-outline"}
            size={24}
            color="#FFA500"
            style={styles.starIcon}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

/**
 * FeedbackScreen Component
 * Expects `orderId` as a route parameter.
 */
const FeedbackScreen = ({ route, navigation }) => {
  // Get orderId from route params.
  const { orderId } = route.params;
  const [accountId, setAccountId] = useState(null);
  const [orderItems, setOrderItems] = useState([]); // Array of ReturnData objects
  const [loading, setLoading] = useState(false);
  // feedbackInputs: an object with keys corresponding to each orderDetailId
  // and values of { rating, comment }
  const [feedbackInputs, setFeedbackInputs] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load accountId from AsyncStorage on mount.
  useEffect(() => {
    const loadAccountId = async () => {
      try {
        const stored = await AsyncStorage.getItem("accountId");
        if (stored) {
          setAccountId(parseInt(stored, 10));
        } else {
          console.error("AccountId not found in storage.");
        }
      } catch (error) {
        console.error("Error loading accountId:", error);
      }
    };
    loadAccountId();
  }, []);

  // Fetch order items (ReturnData) using orderApi.getOrdersReturnRequest
  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!accountId || !orderId) return;
      setLoading(true);
      try {
        const response = await orderApi.getOrdersReturnRequest(accountId, orderId);
        console.log("Order return request response:", response.data);
        if (response.data && response.data.data) {
          setOrderItems(response.data.data);
          // Initialize feedbackInputs for each order item
          const initialFeedback = {};
          response.data.data.forEach((item) => {
            initialFeedback[item.orderDetailId] = { rating: 0, comment: "" };
          });
          setFeedbackInputs(initialFeedback);
        }
      } catch (error) {
        console.error("Error fetching order items:", error);
        Alert.alert("Lỗi", "Không thể tải danh sách sản phẩm của đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [accountId, orderId]);

  // Handlers to update feedback input for a given order item.
  const handleSetRating = (orderDetailId, rating) => {
    setFeedbackInputs((prev) => ({
      ...prev,
      [orderDetailId]: { ...prev[orderDetailId], rating },
    }));
  };

  const handleSetComment = (orderDetailId, comment) => {
    setFeedbackInputs((prev) => ({
      ...prev,
      [orderDetailId]: { ...prev[orderDetailId], comment },
    }));
  };

  // Render a feedback form card for each order item.
  const renderFeedbackForm = ({ item }) => {
    const feedback = feedbackInputs[item.orderDetailId] || { rating: 0, comment: "" };
    return (
      <View style={styles.feedbackCard}>
        <View style={styles.productInfoRow}>
          <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
          <View style={styles.productInfoText}>
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.productSize}>Size: {item.size}</Text>
            <Text style={styles.productQty}>Số lượng: {item.quantity}</Text>
          </View>
        </View>
        <Text style={styles.formLabel}>Đánh giá sao:</Text>
        <FeedbackStarRating
          rating={feedback.rating}
          setRating={(r) => handleSetRating(item.orderDetailId, r)}
        />
        <Text style={styles.formLabel}>Bình luận:</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Nhập bình luận..."
          value={feedback.comment}
          onChangeText={(text) => handleSetComment(item.orderDetailId, text)}
          multiline
        />
      </View>
    );
  };

  // Handle submitting all feedback at once.
  const handleSubmitFeedback = async () => {
    // Build payload for each order item feedback.
    const payloadArray = orderItems.map((item) => {
      const fb = feedbackInputs[item.orderDetailId] || { rating: 0, comment: "" };
      return {
        orderDetailId: item.orderDetailId,
        accountId: accountId,
        productId: item.productId,
        rating: fb.rating,
        comment: fb.comment,
        createdDate: new Date().toISOString(),
      };
    });

    // Validate: ensure every feedback has both a rating and a comment.
    for (const feedback of payloadArray) {
      if (!feedback.rating || !feedback.comment.trim()) {
        Alert.alert("Thông báo", "Vui lòng nhập đầy đủ đánh giá cho tất cả sản phẩm.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await feedbackApi.createFeedback(payloadArray);
      console.log("Feedback submission response:", response.data);
      if (response.data && response.data.status) {
        Alert.alert("Thông báo", "Đánh giá của bạn đã được gửi thành công!");
        // Optionally, navigate back or refresh the screen here.
      } else {
        Alert.alert("Lỗi", "Gửi đánh giá thất bại, vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi đánh giá.");
    } finally {
      setSubmitting(false);
    }
  };

  // Render header and footer for the FlatList.
  const ListHeader = () => (
    <View style={styles.headerContainer}>
      {/* Custom Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigation.navigate("OrderDetailScreen", { orderId: orderId })
        }
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.screenHeader}>Đánh giá sản phẩm</Text>
    </View>
  );

  const ListFooter = () => (
    <TouchableOpacity
      style={styles.submitButton}
      onPress={handleSubmitFeedback}
      disabled={submitting}
    >
      <Text style={styles.submitButtonText}>
        {submitting ? "Đang gửi..." : "Gửi đánh giá"}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        data={orderItems}
        keyExtractor={(item) => String(item.orderDetailId)}
        renderItem={renderFeedbackForm}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={styles.feedbackList}
      />
    </SafeAreaView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  screenHeader: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  feedbackList: { paddingHorizontal: 16, paddingBottom: 30 },
  feedbackCard: {
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 2,
  },
  productInfoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  productInfoText: { flex: 1 },
  productName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  productSize: { fontSize: 14, color: "#555", marginTop: 4 },
  productQty: { fontSize: 14, color: "#555", marginTop: 4 },
  formLabel: { fontSize: 14, fontWeight: "600", color: "#333", marginTop: 10 },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    marginTop: 6,
    minHeight: 60,
    textAlignVertical: "top",
  },
  starRow: { flexDirection: "row", marginVertical: 8 },
  starIcon: { marginRight: 5 },
  submitButton: {
    backgroundColor: "#333",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
