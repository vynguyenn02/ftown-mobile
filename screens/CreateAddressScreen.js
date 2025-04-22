// screens/CreateAddressScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
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
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";

export default function CreateAddressScreen() {
  const { theme } = useContext(ThemeContext);
  const containerBg = theme.mode === "dark" ? "#181818" : theme.background;
  const cardBg = theme.mode === "dark" ? "#2A2A2A" : theme.card;

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
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/p/").then((res) => {
      const opts = res.data.map((p) => ({ label: p.name, value: p.code, name: p.name }));
      setProvinces(opts);
    });
  }, []);

  useEffect(() => {
    if (form.province) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${form.province}?depth=2`)
        .then((res) => {
          const opts = res.data.districts.map((d) => ({ label: d.name, value: d.code, name: d.name }));
          setDistricts(opts);
          setForm((prev) => ({ ...prev, district: "", ward: "" }));
        });
    }
  }, [form.province]);

  useEffect(() => {
    if (form.district) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`)
        .then((res) => {
          const opts = res.data.wards.map((w) => ({ label: w.name, value: w.code, name: w.name }));
          setWards(opts);
          setForm((prev) => ({ ...prev, ward: "" }));
        });
    }
  }, [form.district]);

  const handleChange = (key, val) => setForm({ ...form, [key]: val });

  const validate = () => {
    const errs = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^[0-9]{9,15}$/;

    if (!form.recipientName.trim()) errs.recipientName = "Vui lòng nhập tên";
    if (!form.recipientPhone.trim()) errs.recipientPhone = "Vui lòng nhập số điện thoại";
    else if (!phoneRe.test(form.recipientPhone)) errs.recipientPhone = "Số điện thoại không hợp lệ";
    if (!form.email.trim()) errs.email = "Vui lòng nhập email";
    else if (!emailRe.test(form.email)) errs.email = "Email không hợp lệ";
    if (!form.address.trim()) errs.address = "Vui lòng nhập địa chỉ cụ thể";
    if (!form.province) errs.province = "Chọn tỉnh/thành";
    if (!form.district) errs.district = "Chọn quận/huyện";
    if (!form.ward) errs.ward = "Chọn phường/xã";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    const accountId = await AsyncStorage.getItem("accountId");
    if (!accountId) return Alert.alert("Lỗi", "Không tìm thấy tài khoản");
    if (!validate()) return;

    try {
      const selProv = provinces.find((p) => p.value === form.province)?.name;
      const selDist = districts.find((d) => d.value === form.district)?.name;
      const selWard = wards.find((w) => w.value === form.ward)?.name;

      const payload = {
        accountId: Number(accountId),
        recipientName: form.recipientName,
        recipientPhone: form.recipientPhone,
        email: form.email,
        address: form.address,
        province: selProv,
        district: selDist,
        city: selWard,
        country: form.country,
        isDefault: form.isDefault,
      };

      await addressApi.createAddress(payload);
      Alert.alert("Thành công", "Đã thêm địa chỉ");
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert("Thất bại", "Không thể thêm địa chỉ");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: containerBg }]}>      
      <View style={[styles.header, { borderBottomColor: theme.subtext }]}>        
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Thêm địa chỉ</Text>
      </View>
      <ScrollView contentContainerStyle={styles.form}>
        {/* Recipient Name */}
        <TextInput
          style={[styles.input, { backgroundColor: cardBg, color: theme.text, borderColor: theme.subtext }]}
          placeholder="Tên người nhận"
          placeholderTextColor={theme.subtext}
          value={form.recipientName}
          onChangeText={(t) => handleChange("recipientName", t)}
        />
        {errors.recipientName && <Text style={styles.error}>{errors.recipientName}</Text>}

        {/* Phone */}
        <TextInput
          style={[styles.input, { backgroundColor: cardBg, color: theme.text, borderColor: theme.subtext }]}
          placeholder="Số điện thoại"
          placeholderTextColor={theme.subtext}
          keyboardType="phone-pad"
          value={form.recipientPhone}
          onChangeText={(t) => handleChange("recipientPhone", t)}
        />
        {errors.recipientPhone && <Text style={styles.error}>{errors.recipientPhone}</Text>}

        {/* Email */}
        <TextInput
          style={[styles.input, { backgroundColor: cardBg, color: theme.text, borderColor: theme.subtext }]}
          placeholder="Email"
          placeholderTextColor={theme.subtext}
          keyboardType="email-address"
          value={form.email}
          onChangeText={(t) => handleChange("email", t)}
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        {/* Address */}
        <TextInput
          style={[styles.input, { backgroundColor: cardBg, color: theme.text, borderColor: theme.subtext }]}
          placeholder="Địa chỉ cụ thể"
          placeholderTextColor={theme.subtext}
          value={form.address}
          onChangeText={(t) => handleChange("address", t)}
        />
        {errors.address && <Text style={styles.error}>{errors.address}</Text>}

        {/* Province Picker */}
        <RNPickerSelect
          placeholder={{ label: "Chọn tỉnh/thành", value: null }}
          items={provinces}
          onValueChange={(v) => handleChange("province", v)}
          value={form.province}
          style={pickerStyles(theme)}
        />
        {errors.province && <Text style={styles.error}>{errors.province}</Text>}

        {/* District */}
        <RNPickerSelect
          placeholder={{ label: "Chọn quận/huyện", value: null }}
          items={districts}
          onValueChange={(v) => handleChange("district", v)}
          value={form.district}
          style={pickerStyles(theme)}
        />
        {errors.district && <Text style={styles.error}>{errors.district}</Text>}

        {/* Ward */}
        <RNPickerSelect
          placeholder={{ label: "Chọn phường/xã", value: null }}
          items={wards}
          onValueChange={(v) => handleChange("ward", v)}
          value={form.ward}
          style={pickerStyles(theme)}
        />
        {errors.ward && <Text style={styles.error}>{errors.ward}</Text>}

        {/* Default Switch */}
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: theme.text }]}>Đặt làm mặc định</Text>
          <Switch
            value={form.isDefault}
            onValueChange={(v) => handleChange("isDefault", v)}
            // khi tắt: track màu xám sáng, khi bật: track màu chủ đạo
            trackColor={{ false: "#BBB", true: theme.primary }}
            // riêng iOS background khi off
            ios_backgroundColor="#BBB"
            // thumb luôn cùng màu chủ đạo để nổi bật
            thumbColor={theme.primary}
            style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }} // tăng kích thước 10%
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
        >
          <Text style={[styles.submitText, { color: theme.background }]}>Hoàn tất</Text>
        </TouchableOpacity>
      </ScrollView>
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
  form: { padding: 16, paddingBottom: 40 },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  error: { color: "#FF3B30", fontSize: 13, marginBottom: 8 },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  switchLabel: { fontSize: 16 },
  submitBtn: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  submitText: { fontSize: 16, fontWeight: "bold" },
});

const pickerStyles = (theme) => ({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.subtext,
    borderRadius: 8,
    marginBottom: 8,
    color: theme.text,
    backgroundColor: theme.card,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.subtext,
    borderRadius: 8,
    marginBottom: 8,
    color: theme.text,
    backgroundColor: theme.card,
  },
});
