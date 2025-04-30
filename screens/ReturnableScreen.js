import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import orderApi from "../api/orderApi";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReturnableScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const accountId = await AsyncStorage.getItem("accountId");
      const resp = await orderApi.getReturnableOrders(accountId);
      if (resp.data?.status) setOrders(resp.data.data);
      setLoading(false);
    })();
  }, []);

  const { background, text, card, subtext } = theme;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: card }]}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("OrderDetailScreen", { orderId: item.orderId })}
    >
      <Text style={[styles.orderId, { color: text }]}>Mã đơn: {item.orderId}</Text>
      <Text style={[styles.meta, { color: subtext }]}>Trạng thái: {item.status}</Text>
      <Text style={[styles.meta, { color: subtext }]}>
        Ngày giao: {item.deliveredDate ? new Date(item.deliveredDate).toLocaleString() : "Chưa cập nhật"}
      </Text>

      {item.items.map((p, i) => (
        <View key={i} style={styles.itemRow}>
          <Image source={{ uri: p.imageUrl }} style={styles.image} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.productName, { color: text }]}>{p.productName}</Text>
            <Text style={[styles.meta, { color: subtext }]}>Số lượng: {p.quantity}</Text>
          </View>
        </View>
      ))}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} backgroundColor={background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: text }]}>Đơn có thể đổi trả</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.orderId.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    elevation: 1,
  },
  orderId: { fontSize: 15, fontWeight: "bold" },
  meta: { fontSize: 13, marginTop: 2 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  image: { width: 50, height: 50, borderRadius: 6, backgroundColor: "#ccc" },
  productName: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
});
