import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  changePaymentCareStatus,
  getConsignmentCareByUserId,
} from "../api/consignmentCareApi";

const ConsignmentCareHistory = () => {
  const [careHistory, setCareHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const fetchConsignmentCareHistory = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const data = await getConsignmentCareByUserId(userId);
        // Sort the data by createdAt in descending order
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCareHistory(sortedData);
      } else {
        setError("User ID not found.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsignmentCareHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // In your parent component where you navigate to PaymentPage
  const handlePaymentNavigation = (item) => {
    if (item.paymentStatus === "Pending") {
      navigation.navigate("PaymentPage", {
        consignment: item,
        onPaymentSuccess: fetchConsignmentCareHistory, // Pass the function here
      });
    }
  };

  const handleCancel = async (item) => {
    Alert.alert(
      "Confirm Cancellation",
      "Are you sure you want to cancel this consignment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              // Call the API to change the payment status to "Cancelled"
              await changePaymentCareStatus(item._id, "Cancelled");
              // Update the state to reflect the cancellation
              setCareHistory((prevHistory) =>
                prevHistory.map((historyItem) =>
                  historyItem._id === item._id
                    ? { ...historyItem, paymentStatus: "Cancelled" }
                    : historyItem
                )
              );
              Alert.alert("Success", "Consignment cancelled successfully.");
            } catch (err) {
              console.error("Cancellation error:", err.message);
              Alert.alert("Error", "Failed to cancel consignment.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return styles.pendingStatus;
      case "Success":
        return styles.successStatus;
      case "Cancelled":
        return styles.cancelledStatus;
      default:
        return {};
    }
  };
  const handleProductDetailNavigation = (productId) => {
    navigation.navigate("ProductDetail", { productId });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {careHistory.map((item) => (
        <View key={item._id} style={styles.card}>
          <View style={styles.flexBetween}>
            <TouchableOpacity
              onPress={() => handleProductDetailNavigation(item.productId._id)}
            >
              <Text style={styles.productName}>
                {item.productId.productName}
              </Text>
            </TouchableOpacity>
            {/* <Text style={styles.productName}>{item.productId.productName}</Text> */}
            <TouchableOpacity onPress={() => handlePaymentNavigation(item)}>
              <Text
                style={[
                  styles.paymentStatus,
                  getPaymentStatusStyle(item.paymentStatus), // Apply dynamic styles
                ]}
              >
                {item.paymentStatus}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.careType}>
            Care Type: {item.careType} -{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(item.pricePerDay)}
          </Text>
          <Text style={styles.dates}>
            From: {new Date(item.startDate).toLocaleDateString()} - To:{" "}
            {new Date(item.endDate).toLocaleDateString()}
          </Text>
          <Text style={styles.dates}>
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.totalPrice}>
            Total Price: {item.totalPrice.toLocaleString()} VND
          </Text>

          {item.paymentStatus === "Pending" && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.payButton}
                onPress={() => handlePaymentNavigation(item)}
              >
                <Text style={styles.buttonText}>Pay Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancel(item)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  careType: {
    fontSize: 14,
    marginBottom: 4,
  },
  dates: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalPrice: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
    color: "green",
  },
  paymentStatus: {
    fontSize: 14,
    marginBottom: 4,
  },
  pendingStatus: {
    color: "orange",
    fontWeight: "bold",
  },
  successStatus: {
    color: "green", // Color for Success status
    fontWeight: "bold",
  },
  cancelledStatus: {
    color: "red", // Color for Cancelled status
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  payButton: {
    backgroundColor: "#28a745", // Green color
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#dc3545", // Red color
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  status: {
    fontSize: 14,
    marginBottom: 4,
  },
  flexBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default ConsignmentCareHistory;
