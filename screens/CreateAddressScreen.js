import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import addressApi from "../api/addressApi";

export default function CreateAddressScreen() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    recipientName: "",
    recipientPhone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    country: "Việt Nam",
    isDefault: false,
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Fetch tỉnh/thành
  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/p/").then((res) => {
      const options = res.data.map((p) => ({
        label: p.name,
        value: p.code,
        name: p.name,
      }));
      setProvinces(options);
    });
  }, []);

  // Fetch quận/huyện khi chọn tỉnh
  useEffect(() => {
    if (form.province) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${form.province}?depth=2`)
        .then((res) => {
          const options = res.data.districts.map((d) => ({
            label: d.name,
            value: d.code,
            name: d.name,
          }));
          setDistricts(options);
          setForm((prev) => ({ ...prev, district: "", ward: "" }));
        });
    }
  }, [form.province]);

  // Fetch xã/phường khi chọn quận
  useEffect(() => {
    if (form.district) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`)
        .then((res) => {
          const options = res.data.wards.map((w) => ({
            label: w.name,
            value: w.code,
            name: w.name,
          }));
          setWards(options);
          setForm((prev) => ({ ...prev, ward: "" }));
        });
    }
  }, [form.district]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const accountId = await AsyncStorage.getItem("accountId");
    if (!accountId) return Alert.alert("Lỗi", "Không tìm thấy tài khoản");

    if (!form.recipientName || !form.recipientPhone || !form.address || !form.ward) {
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường bắt buộc.");
    }

    try {
      const selectedProvince = provinces.find((p) => p.value === form.province)?.name;
      const selectedDistrict = districts.find((d) => d.value === form.district)?.name;
      const selectedWard = wards.find((w) => w.value === form.ward)?.name;

      const payload = {
        accountId: Number(accountId),
        recipientName: form.recipientName,
        recipientPhone: form.recipientPhone,
        email: form.email,
        address: form.address,
        province: selectedProvince,
        district: selectedDistrict,
        city: "", // optional
        country: form.country,
        isDefault: form.isDefault,
      };

      await addressApi.createAddress(payload);
      Alert.alert("Thành công", "Địa chỉ đã được thêm");
      navigation.goBack();
    } catch (error) {
      console.log("Lỗi thêm địa chỉ:", error);
      Alert.alert("Thất bại", "Không thể thêm địa chỉ");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thêm địa chỉ mới</Text>

      <TextInput style={styles.input} placeholder="Tên người nhận"
        value={form.recipientName} onChangeText={(text) => handleChange("recipientName", text)} />
      <TextInput style={styles.input} placeholder="Số điện thoại"
        value={form.recipientPhone} onChangeText={(text) => handleChange("recipientPhone", text)} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Email"
        value={form.email} onChangeText={(text) => handleChange("email", text)} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Địa chỉ cụ thể"
        value={form.address} onChangeText={(text) => handleChange("address", text)} />

      <RNPickerSelect
        placeholder={{ label: "Chọn Tỉnh/Thành", value: null }}
        items={provinces}
        onValueChange={(value) => handleChange("province", value)}
        value={form.province}
        style={pickerSelectStyles}
      />

      <RNPickerSelect
        placeholder={{ label: "Chọn Quận/Huyện", value: null }}
        items={districts}
        onValueChange={(value) => handleChange("district", value)}
        value={form.district}
        style={pickerSelectStyles}
      />

      <RNPickerSelect
        placeholder={{ label: "Chọn Phường/Xã", value: null }}
        items={wards}
        onValueChange={(value) => handleChange("ward", value)}
        value={form.ward}
        style={pickerSelectStyles}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Đặt làm địa chỉ mặc định</Text>
        <Switch value={form.isDefault} onValueChange={(val) => handleChange("isDefault", val)} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Hoàn tất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
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
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
};
