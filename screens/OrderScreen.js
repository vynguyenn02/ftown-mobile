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
    { key: "delivered", title: "Đã giao" },
    { key: "completed", title: "Hoàn thành" },
    { key: "returnrequested", title: "Đổi/Trả" }, 
    { key: "canceled", title: "Đã huỷ" },
  ]);

  useEffect(() => {
    const statusParam = route.params?.status;
    if (statusParam) {
      const map = {
        "Pending Confirmed": "pendingconfirmed",
        PendingPayment: "pendingpayment",
        Confirmed: "confirmed",
        Delivered: "delivered",
        Canceled: "canceled",
        "Return Requested":    "returnrequested",
        Completed: "completed",
      };
      const key = map[statusParam];
      const i = routes.findIndex((r) => r.key === key);
      if (i >= 0) setIndex(i);
    }
  }, [route.params]);

  const renderScene = ({ route: { key } }) => {
    const mapStatus = {
      pendingconfirmed: "Pending Confirmed",
      pendingpayment: "PendingPayment",
      confirmed: "Confirmed",
      delivered: "Delivered",
      completed: "Completed",
      returnrequested: "Return Requested",
      canceled: "Canceled",
    };
    const status = mapStatus[key];
    return <OrderTab status={status} />;
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
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate("HomeScreen"); // hoặc tab mặc định, ví dụ Home
            }
          }}
        >
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
        renderTabBar={(tabBarProps) => {
          // ❌ Không destructure `props`, vì key vẫn bị lan ra!
          return (
            <TabBar
              {...tabBarProps}
              scrollEnabled
              indicatorStyle={{ backgroundColor: theme.primary }}
              style={{ backgroundColor: containerBg, elevation: 0 }}
              activeColor={theme.primary}
              inactiveColor={theme.subtext}
              labelStyle={{ fontWeight: "bold", textTransform: "none" }}
            />
          );
        }}
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
