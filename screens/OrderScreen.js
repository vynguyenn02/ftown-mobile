import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import OrderTab from "./OrderTab";
import { useRoute } from "@react-navigation/native";


const OrderScreen = () => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const route = useRoute();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "pendingconfirmed", title: "Chờ xác nhận" },
    { key: "pendingpayment", title: "Chờ thanh toán" },
    { key: "confirmed", title: "Đã xác nhận" },
    { key: "shipped", title: "Đã giao" },
    { key: "completed", title: "Hoàn thành" },
    { key: "canceled", title: "Đã huỷ" },
  ]);

  useEffect(() => {
    const statusParam = route.params?.status;

    if (statusParam) {
      const tabMap = {
        "Pending Confirmed": "pendingconfirmed",
        "PendingPayment": "pendingpayment",
        "Confirmed": "confirmed",
        "Shipped": "shipped",
        "Canceled": "canceled",
        "Completed": "completed",
      };

      const key = tabMap[statusParam];
      const foundIndex = routes.findIndex((r) => r.key === key);
      if (foundIndex !== -1) {
        setIndex(foundIndex);
      }
    }
  }, [route.params]);

  const renderScene = SceneMap({
    pendingconfirmed: () => <OrderTab status="Pending Confirmed" />,
    pendingpayment: () => <OrderTab status="PendingPayment" />,
    confirmed: () => <OrderTab status="Confirmed" />,
    shipped: () => <OrderTab status="Shipped" />,
    canceled: () => <OrderTab status="Canceled" />,
    completed: () => <OrderTab status="Completed" />,
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Header với nút back */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn đã mua</Text>
      </View>

      {/* TabView */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: "#FF3B30" }}
            style={{ backgroundColor: "#fff" }}
            activeColor="#FF3B30"
            inactiveColor="#555"
            labelStyle={{ fontWeight: "bold", textTransform: "none" }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default OrderScreen;
