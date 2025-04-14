import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import addressApi from "../api/addressApi";

export default function AddressScreen() {
  const [addresses, setAddresses] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchAddresses();
  }, [isFocused]);

  const fetchAddresses = async () => {
    try {
      const accountId = await AsyncStorage.getItem("accountId");
      console.log("📦 accountId:", accountId);

      if (!accountId) {
        console.log("⚠️ Không tìm thấy accountId trong AsyncStorage");
        return;
      }

      const response = await addressApi.getAddressesByAccountId(accountId);
      console.log("📬 API response:", response.data);

      if (response.data.status) {
        setAddresses(response.data.data);
      } else {
        console.log("❌ API trả về status false");
      }
    } catch (error) {
      console.log("🚨 Lỗi khi lấy danh sách địa chỉ:", error.message || error);
    }
  };

  const handleDelete = (addressId) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa địa chỉ này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await addressApi.deleteAddress(addressId);
            fetchAddresses(); // Reload danh sách
          } catch (err) {
            console.log("Lỗi khi xóa địa chỉ:", err.message || err);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.name}>{item.recipientName}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditAddressScreen", { address: item })
          }
        >
          <Text style={styles.editLink}>Sửa</Text>
        </TouchableOpacity>
      </View>
  
      <Text style={styles.phoneAndAddress}>
        {item.recipientPhone} | {item.address}, {item.district}, {item.province}
      </Text>
  
      {/* Gắn tag nếu có */}
      <View style={styles.tagRow}>
        <View style={styles.tag}>
          <Ionicons name="home-outline" size={14} color="#555" />
          <Text style={styles.tagText}>Nhà</Text>
        </View>
  
        {item.isDefault && (
          <View style={[styles.tag, { backgroundColor: "#007BFF1A" }]}>
            <Ionicons name="checkmark-circle-outline" size={14} color="#007BFF" />
            <Text style={[styles.tagText, { color: "#007BFF" }]}>Mặc định</Text>
          </View>
        )}
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.addressId.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Chưa có địa chỉ nào</Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("CreateAddressScreen")}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.addText}>Thêm địa chỉ mới</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f2f2f2",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  editLink: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "500",
  },

  phoneAndAddress: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 8,
  },

  tagRow: {
    flexDirection: "row",
    gap: 8,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },

  tagText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#555",
  },

  defaultTag: {
    backgroundColor: "#007BFF1A",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },

  defaultTagText: {
    color: "#007BFF",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 8,
    gap: 12,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
  },

  editText: {
    color: "#007BFF",
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },

  deleteText: {
    color: "#FF3B30",
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
    fontSize: 16,
  },

  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },

  addText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
});
