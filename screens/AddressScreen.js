// screens/AddressScreen.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import Header from "../components/Header"; // Nếu muốn dùng sidebar

const mockAddresses = [
  {
    id: "1",
    name: "Thành Tâm",
    phone: "0902 234 752",
    address: "S.101 VinHome Grand Park, Nguyễn Xiển, Phường Long Thạnh Mỹ, Thành phố Thủ Đức, Hồ Chí Minh",
    label: "Nhà",
  },
  {
    id: "2",
    name: "Vy",
    phone: "0387 502 824",
    address: "203/Q2, Phường Long Bình Tân, Thành phố Biên Hòa, Tỉnh Đồng Nai",
    label: "Nhà",
  },
  {
    id: "3",
    name: "Thành Tâm",
    phone: "0902 234 752",
    address: "S.203 VinHome Grand Park, Nguyễn Xiển, Phường Long Thạnh Mỹ, Thành phố Thủ Đức, Hồ Chí Minh",
    label: "Nhà",
  },
];

const AddressScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState(mockAddresses);

  const handleEdit = (id) => {
    // Logic sửa địa chỉ
    alert(`Sửa địa chỉ có id: ${id}`);
  };

  const handleDelete = (id) => {
    // Logic xoá địa chỉ
    alert(`Xoá địa chỉ có id: ${id}`);
  };

  const handleAddNew = () => {
    // Logic thêm địa chỉ mới
    alert("Thêm địa chỉ mới");
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {/* Tên + SĐT */}
      <Text style={styles.namePhone}>
        {item.name} {"  "} {item.phone}
      </Text>
      {/* Địa chỉ */}
      <Text style={styles.address}>{item.address}</Text>
      {/* Nhãn địa chỉ */}
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{item.label}</Text>
      </View>
      {/* Sửa / Xoá */}
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => handleEdit(item.id)}>
          <Text style={styles.editText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteText}>Xoá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Global Header nếu cần sidebar */}
      <Header />

      {/* Thanh tiêu đề */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý sổ địa chỉ</Text>
        {/* Chừa 1 view trống để icon canh giữa (nếu cần) */}
        <View style={{ width: 24 }} />
      </View>

      {/* Danh sách địa chỉ */}
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Nút Thêm địa chỉ mới */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
        <Text style={styles.addButtonText}>Thêm địa chỉ mới</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  namePhone: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  labelContainer: {
    backgroundColor: "#dcdcdc",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  labelText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 4,
    gap: 20,
  },
  editText: {
    fontSize: 14,
    color: "#007bff",
  },
  deleteText: {
    fontSize: 14,
    color: "#FF4D4F",
  },
  addButton: {
    backgroundColor: "#333",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
