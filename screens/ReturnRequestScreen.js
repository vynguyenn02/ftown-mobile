import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import orderApi from "../api/orderApi";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReturnRequestScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params;

  const [loading, setLoading] = useState(true);
  const [returnItems, setReturnItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    (async () => {
      const accountId = await AsyncStorage.getItem("accountId");
      if (!accountId || !orderId) return;

      try {
        const resp = await orderApi.getOrdersReturnRequest(accountId, orderId);
        if (resp.data?.data) {
          setReturnItems(resp.data.data);
          const initQuantities = {};
          const initSelected = {};
          resp.data.data.forEach((item) => {
            initQuantities[item.orderDetailId] = 1;
            initSelected[item.orderDetailId] = false;
          });
          setQuantities(initQuantities);
          setSelectedItems(initSelected);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách item đổi trả:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const { background, card, text, subtext, primary } = theme;

  const renderItem = ({ item }) => {
    const isSelected = selectedItems[item.orderDetailId];

    return (
      <View style={[styles.card, { backgroundColor: card }]}>
        <View style={styles.rowTop}>
          <TouchableOpacity
            style={[
              styles.circleBtn,
              {
                borderColor: isSelected ? primary : "#aaa",
                backgroundColor: isSelected ? primary : "transparent",
              },
            ]}
            onPress={() =>
              setSelectedItems({
                ...selectedItems,
                [item.orderDetailId]: !isSelected,
              })
            }
          />
          <Text style={[styles.name, { color: text }]}>{item.productName}</Text>
        </View>

        <View style={styles.row}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.details}>
            <Text style={[styles.meta, { color: subtext }]}>Size: {item.size}</Text>
            <Text style={[styles.meta, { color: subtext }]}>Màu: {item.color}</Text>
            <Text style={[styles.meta, { color: subtext }]}>Số lượng đã mua: {item.quantity}</Text>

            <View style={styles.inputRow}>
              <Text style={{ color: subtext }}>Số lượng đổi trả:</Text>
              <View style={styles.counter}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => {
                    if (quantities[item.orderDetailId] > 1) {
                      setQuantities({
                        ...quantities,
                        [item.orderDetailId]: quantities[item.orderDetailId] - 1,
                      });
                    }
                  }}
                >
                  <Ionicons name="remove-circle-outline" size={22} color={primary} />
                </TouchableOpacity>

                <Text style={[styles.counterText, { color: text }]}>
                  {quantities[item.orderDetailId]}
                </Text>

                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => {
                    if (quantities[item.orderDetailId] < item.quantity) {
                      setQuantities({
                        ...quantities,
                        [item.orderDetailId]: quantities[item.orderDetailId] + 1,
                      });
                    }
                  }}
                >
                  <Ionicons name="add-circle-outline" size={22} color={primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const handleSubmit = async () => {
    const selectedData = returnItems
      .filter((item) => selectedItems[item.orderDetailId])
      .map((item) => ({
        productVariantId: item.productVariantId,
        quantity: quantities[item.orderDetailId],
      }));

    if (selectedData.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một sản phẩm để đổi trả.");
      return;
    }

    try {
      const accountId = await AsyncStorage.getItem("accountId");

      const payload = {
        orderId: parseInt(orderId),
        accountId: parseInt(accountId),
        selectedItems: selectedData,
      };

      const resp = await orderApi.checkoutReturnRequest(payload);
      if (resp.data) {
        navigation.navigate("ReturnCheckoutScreen", { checkoutData: resp.data });
      }
    } catch (err) {
      console.error("❌ Lỗi khi gọi API checkout:", err);
      Alert.alert("Lỗi", "Không thể tạo phiên đổi trả.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} backgroundColor={background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: text }]}>Chọn sản phẩm đổi trả</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={primary} style={{ marginTop: 30 }} />
      ) : (
        <>
          <FlatList
            data={returnItems}
            keyExtractor={(item) => item.orderDetailId.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
          />

          <View style={{ paddingHorizontal: 16, marginTop: 10, marginBottom: 30 }}>
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: primary }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 12 },
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    elevation: 1,
  },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "flex-start" },
  image: { width: 70, height: 70, borderRadius: 6, backgroundColor: "#ccc" },
  details: { flex: 1, marginLeft: 10 },
  meta: { fontSize: 13, marginTop: 2 },
  inputRow: { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 10 },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
  },
  counterBtn: { padding: 2 },
  counterText: { fontSize: 16, fontWeight: "500", minWidth: 30, textAlign: "center" },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  rowTop: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  circleBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    marginRight: 8,
  },
});
