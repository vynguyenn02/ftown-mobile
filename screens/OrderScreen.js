import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import OrderTab from "./OrderTab";
import { ThemeContext } from "../context/ThemeContext";

const OrderScreen = () => {
  const { theme } = useContext(ThemeContext);
  // nền chính hơi sáng hơn khi dark
  const containerBg = theme.mode === "dark" ? "#181818" : theme.background;

  const navigation = useNavigation();
  const route = useRoute();
  const layout = useWindowDimensions();

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
      const map = {
        "Pending Confirmed": "pendingconfirmed",
        PendingPayment: "pendingpayment",
        Confirmed: "confirmed",
        Shipped: "shipped",
        Canceled: "canceled",
        Completed: "completed",
      };
      const key = map[statusParam];
      const i = routes.findIndex((r) => r.key === key);
      if (i >= 0) setIndex(i);
    }
  }, [route.params]);

  const renderScene = ({ route }) => {
    const mapStatus = {
      pendingconfirmed: "Pending Confirmed",
      pendingpayment: "PendingPayment",
      confirmed: "Confirmed",
      shipped: "Shipped",
      completed: "Completed",
      canceled: "Canceled",
    };
    return <OrderTab status={mapStatus[route.key]} />;
  };
  

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: containerBg }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: containerBg,
            borderBottomColor: theme.subtext,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Đơn đã mua
        </Text>
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
            indicatorStyle={{ backgroundColor: theme.primary }}
            style={{ backgroundColor: containerBg, elevation: 0 }}
            activeColor={theme.primary}
            inactiveColor={theme.subtext}
            labelStyle={{ fontWeight: "bold", textTransform: "none" }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 12 },
});
