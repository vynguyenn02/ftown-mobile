// screens/AddressScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import addressApi from "../api/addressApi";
import { ThemeContext } from "../context/ThemeContext";

export default function AddressScreen() {
  const { theme } = useContext(ThemeContext);
  const containerBg = theme.mode === "dark" ? "#181818" : theme.background;
  const cardBg = theme.mode === "dark" ? "#2A2A2A" : theme.card;

  const [addresses, setAddresses] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchAddresses();
  }, [isFocused]);

  const fetchAddresses = async () => {
    try {
      const accountId = await AsyncStorage.getItem("accountId");
      if (!accountId) return;
      const resp = await addressApi.getAddressesByAccountId(accountId);
      if (resp.data.status) setAddresses(resp.data.data);
    } catch (e) {
      console.error("Lỗi lấy địa chỉ:", e);
    }
  };

  const handleDelete = (addressId) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa địa chỉ này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await addressApi.deleteAddress(addressId);
            Alert.alert("Thành công", "Địa chỉ đã được xóa");
            fetchAddresses();
          } catch (e) {
            console.error(e);
            Alert.alert("Thất bại", "Không thể xóa địa chỉ.");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: cardBg }]}>      
      <View style={styles.topRow}>
        <Text style={[styles.name, { color: theme.text }]}>
          {item.recipientName}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate("EditAddressScreen", { address: item })}
          >
            <Ionicons name="pencil" size={16} color={theme.primary} />
            <Text style={[styles.actionText, { color: theme.primary }]}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDelete(item.addressId)}
          >
            <Ionicons name="trash" size={16} color="#FF3B30" />
            <Text style={[styles.actionText, { color: "#FF3B30" }]}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.info, { color: theme.subtext }]}>        
        {item.recipientPhone} | {item.address}, {item.district}, {item.province}
      </Text>
      <View style={[styles.tagRow, { backgroundColor: cardBg }]}>        
        <View style={[styles.tag, { backgroundColor: theme.card }]}>          
          <Ionicons name="home-outline" size={14} color={theme.subtext} />
          <Text style={[styles.tagText, { color: theme.subtext }]}>Nhà</Text>
        </View>
        {item.isDefault && (
          <View
            style={[
              styles.tag,
              { backgroundColor: theme.primary + "33" },
            ]}
          >
            <Ionicons name="checkmark-circle-outline" size={14} color={theme.primary} />
            <Text style={[styles.tagText, { color: theme.primary }]}>Mặc định</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: containerBg }]}>      
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
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Địa chỉ</Text>
      </View>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.addressId.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.subtext }]}>Chưa có địa chỉ nào</Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate("CreateAddressScreen")}
      >
        <Ionicons name="add-circle-outline" size={24} color={theme.background} />
        <Text style={[styles.addText, { color: theme.background }]}>Thêm địa chỉ mới</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

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

  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  name: { fontSize: 16, fontWeight: "600" },
  actions: { flexDirection: "row", gap: 16 },
  actionBtn: { flexDirection: "row", alignItems: "center" },
  actionText: { marginLeft: 4, fontSize: 14, fontWeight: "500" },
  info: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  tagRow: { flexDirection: "row", paddingVertical: 4 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: { marginLeft: 4, fontSize: 12 },

  empty: { textAlign: "center", marginTop: 40, fontSize: 16 },

  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
  },
  addText: { marginLeft: 8, fontSize: 16, fontWeight: "600" },
});
