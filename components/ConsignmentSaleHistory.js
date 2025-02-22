import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { changePaymentCareStatus } from "../api/consignmentCareApi";
import { getConsignmentSaleByUserId } from "../api/consignmentSaleApi";

const ConsignmentSaleHistory = () => {
  const [saleHistory, setSaleHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  console.log(saleHistory);

  const fetchConsignmentSaleHistory = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const data = await getConsignmentSaleByUserId(userId);
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSaleHistory(sortedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConsignmentSaleHistory();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConsignmentSaleHistory();
  };

  const handlePaymentNavigation = (item) => {
    if (item.paymentStatus === "Pending") {
      navigation.navigate("PaymentPage", {
        consignment: item,
        onPaymentSuccess: fetchConsignmentCareHistory,
      });
    }
  };

  const handleCancel = async (item) => {
    Alert.alert(
      "Confirm Cancellation",
      "Are you sure you want to cancel this consignment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              await changePaymentCareStatus(item._id, "Cancelled");
              setSaleHistory((prevHistory) =>
                prevHistory.map((historyItem) =>
                  historyItem._id === item._id
                    ? { ...historyItem, paymentStatus: "Cancelled" }
                    : historyItem
                )
              );
              Alert.alert("Success", "Consignment cancelled successfully.");
            } catch (err) {
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
      case "Sold":
        return styles.successStatus;
      case "Cancelled":
        return styles.cancelledStatus;
      default:
        return {};
    }
  };

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

  const handleProductDetailNavigation = (productId) => {
    navigation.navigate("ProductDetail", { productId });
  };

  const handleWithdrawNavigation = (item) => {
    navigation.navigate("Withdraw", { consignmentId: item._id }); // Pass the consignment ID to the Withdraw page
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {saleHistory.map((item) => (
        <View key={item._id} style={styles.card}>
          <View style={styles.flexBetween}>
            <TouchableOpacity
              onPress={() => handleProductDetailNavigation(item.productId._id)}
            >
              <Text style={styles.productName}>
                {item.productId.productName}
              </Text>
            </TouchableOpacity>
            <Text style={getPaymentStatusStyle(item.status)}>
              {item.status}
            </Text>
          </View>
          <Text style={styles.careType}>
            Trạng thái payment: {item.paymentStatus}
          </Text>
          <Text style={styles.careType}>Sale Type: {item.saleType}</Text>
          <Text style={styles.dates}>
            Created At: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Text>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(item.priceAgreed)}
          </Text>

          {/* Success message for Sold items */}
          {item.status === "Sold" && item.paymentStatus === "Success" ? (
            <Text style={styles.successMessage}>
              Đã chuyển tiền thành công!
            </Text>
          ) : item.status === "Sold" ? (
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={() => handleWithdrawNavigation(item)}
            >
              <Text style={styles.buttonText}>Withdraw</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 0 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16 },
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
  productName: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  careType: { fontSize: 14, marginBottom: 4 },
  dates: { fontSize: 14, marginBottom: 4 },
  pendingStatus: { color: "orange", fontWeight: "bold" },
  successStatus: { color: "green", fontWeight: "bold" },
  cancelledStatus: { color: "red", fontWeight: "bold" },
  withdrawButton: {
    backgroundColor: "#007BFF", // Customize button color
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  flexBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  successMessage: {
    color: "green",
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default ConsignmentSaleHistory;
