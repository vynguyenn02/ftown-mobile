// ✅ SelectAddressScreen.js - thêm nút xác nhận, thêm địa chỉ mới và nút quay lại
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SelectAddressScreen({ route, navigation }) {
  const { addresses, checkoutData, selectedAddress } = route.params;
  const [selected, setSelected] = useState(selectedAddress);

  const handleConfirm = () => {
    navigation.navigate("CheckoutScreen", {
      selectedAddress: selected,
      checkoutData,
    });
  };

  const handleAddNew = () => {
    navigation.navigate("CreateAddressScreen", {
      fromCheckout: true,
      checkoutData,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item }) => {
    const isCurrentlySelected = selected?.addressId === item.addressId;
    return (
      <TouchableOpacity
        style={[styles.addressCard, isCurrentlySelected && styles.selectedBorder]}
        onPress={() => setSelected(item)}
      >
        <View style={styles.rowHeader}>
          <Text style={styles.addressLine}>
            <Text style={styles.addressBold}>{item.address}</Text>, {item.city}, {item.district}
          </Text>
          {isCurrentlySelected && (
            <Ionicons name="checkmark-circle" size={22} color="#000" style={{ marginLeft: 8 }} />
          )}
        </View>
        <Text style={styles.recipient}>Người nhận: {item.recipientName} - {item.recipientPhone}</Text>
        <Text style={styles.email}>Email: {item.email}</Text>
        {item.isDefault && <Text style={styles.defaultTag}>Mặc định</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Chọn địa chỉ giao hàng</Text>
      </View>

      <TouchableOpacity style={styles.addNewButton} onPress={handleAddNew}>
        <Ionicons name="add-circle-outline" size={20} color="#007bff" style={{ marginRight: 6 }} />
        <Text style={styles.addNewText}>Thêm địa chỉ mới</Text>
      </TouchableOpacity>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.addressId.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noData}>Không có địa chỉ nào</Text>}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={!selected}>
        <Text style={styles.confirmText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 8,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#111" },
  addNewButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  addNewText: {
    color: "#007bff",
    fontSize: 15,
    fontWeight: "600",
  },
  addressCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  selectedBorder: {
    borderColor: "#000",
    borderWidth: 3,
    backgroundColor: "#f3f3f3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  addressLine: { fontSize: 15, color: "#222", flex: 1, flexWrap: "wrap" },
  addressBold: { fontWeight: "600" },
  recipient: { fontSize: 14, color: "#444", marginBottom: 4 },
  email: { fontSize: 14, color: "#444" },
  defaultTag: { marginTop: 6, color: "#E53935", fontSize: 13, fontWeight: "bold" },
  noData: { textAlign: "center", color: "#999", marginTop: 40 },
  confirmButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    elevation: 5,
  },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
