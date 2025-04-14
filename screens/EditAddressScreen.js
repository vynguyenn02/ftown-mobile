import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import addressApi from "../api/addressApi";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function EditAddressScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { address } = route.params;

  const [form, setForm] = useState({ ...address });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        accountId: undefined, // không gửi lại accountId nếu không cần
        addressId: undefined, // không gửi addressId trong body
      };
      await addressApi.updateAddress(address.addressId, payload);
      Alert.alert("Thành công", "Đã cập nhật địa chỉ");
      navigation.goBack();
    } catch (error) {
      console.log("Lỗi cập nhật:", error);
      Alert.alert("Thất bại", "Không thể cập nhật địa chỉ");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa địa chỉ</Text>

      <TextInput style={styles.input} placeholder="Tên người nhận"
        value={form.recipientName} onChangeText={(text) => handleChange("recipientName", text)} />
      <TextInput style={styles.input} placeholder="Số điện thoại"
        value={form.recipientPhone} onChangeText={(text) => handleChange("recipientPhone", text)} />
      <TextInput style={styles.input} placeholder="Email"
        value={form.email} onChangeText={(text) => handleChange("email", text)} />
      <TextInput style={styles.input} placeholder="Địa chỉ cụ thể"
        value={form.address} onChangeText={(text) => handleChange("address", text)} />
      <TextInput style={styles.input} placeholder="Quận/Huyện"
        value={form.district} onChangeText={(text) => handleChange("district", text)} />
      <TextInput style={styles.input} placeholder="Tỉnh/Thành phố"
        value={form.province} onChangeText={(text) => handleChange("province", text)} />
      <TextInput style={styles.input} placeholder="Quốc gia"
        value={form.country} onChangeText={(text) => handleChange("country", text)} />
      <TextInput style={styles.input} placeholder="Thành phố"
        value={form.city} onChangeText={(text) => handleChange("city", text)} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Lưu thay đổi</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
