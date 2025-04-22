// screens/EditAddressScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import addressApi from "../api/addressApi";
import { ThemeContext } from "../context/ThemeContext";

export default function EditAddressScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { address } = route.params;
  const { theme } = useContext(ThemeContext);

  const containerBg = theme.mode === "dark" ? "#181818" : theme.background;
  const cardBg = theme.mode === "dark" ? "#2A2A2A" : theme.card;
  const inputBg = theme.mode === "dark" ? "#2A2A2A" : "#fff";
  const borderColor = theme.subtext;
  const textColor = theme.text;

  const [form, setForm] = useState({
    recipientName: address.recipientName || "",
    recipientPhone: address.recipientPhone || "",
    email: address.email || "",
    address: address.address || "",
    province: "",
    district: "",
    ward: "",
    country: address.country || "Việt Nam",
    isDefault: address.isDefault || false,
  });
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Load provinces
  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/p/").then((res) => {
      const opts = res.data.map((p) => ({
        label: p.name,
        value: p.code,
        name: p.name,
      }));
      setProvinces(opts);
      const m = opts.find((p) => p.name === address.province);
      if (m) setForm((f) => ({ ...f, province: m.value }));
    });
  }, []);

  // Load districts
  useEffect(() => {
    if (!form.province) return;
    axios
      .get(`https://provinces.open-api.vn/api/p/${form.province}?depth=2`)
      .then((res) => {
        const opts = res.data.districts.map((d) => ({
          label: d.name,
          value: d.code,
          name: d.name,
        }));
        setDistricts(opts);
        const m = opts.find((d) => d.name === address.district);
        if (m) setForm((f) => ({ ...f, district: m.value }));
      });
  }, [form.province]);

  // Load wards
  useEffect(() => {
    if (!form.district) return;
    axios
      .get(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`)
      .then((res) => {
        const opts = res.data.wards.map((w) => ({
          label: w.name,
          value: w.code,
          name: w.name,
        }));
        setWards(opts);
        const m = opts.find((w) => w.name === address.city);
        if (m) setForm((f) => ({ ...f, ward: m.value }));
      });
  }, [form.district]);

  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const validateForm = () => {
    const errs = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRx = /^[0-9]{9,15}$/;

    if (!form.recipientName.trim())
      errs.recipientName = "Vui lòng nhập tên người nhận";
    if (!form.recipientPhone.trim())
      errs.recipientPhone = "Vui lòng nhập số điện thoại";
    else if (!phoneRx.test(form.recipientPhone))
      errs.recipientPhone = "Số điện thoại không hợp lệ";

    if (!form.email.trim()) errs.email = "Vui lòng nhập email";
    else if (!emailRx.test(form.email)) errs.email = "Email không hợp lệ";

    if (!form.address.trim()) errs.address = "Vui lòng nhập địa chỉ cụ thể";
    if (!form.province) errs.province = "Vui lòng chọn tỉnh/thành";
    if (!form.district) errs.district = "Vui lòng chọn quận/huyện";
    if (!form.ward) errs.ward = "Vui lòng chọn phường/xã";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      const prov = provinces.find((p) => p.value === form.province)?.name;
      const dist = districts.find((d) => d.value === form.district)?.name;
      const ward = wards.find((w) => w.value === form.ward)?.name;

      await addressApi.updateAddress(address.addressId, {
        recipientName: form.recipientName,
        recipientPhone: form.recipientPhone,
        email: form.email,
        address: form.address,
        province: prov,
        district: dist,
        city: ward,
        country: form.country,
        isDefault: form.isDefault,
      });
      Alert.alert("Thành công", "Cập nhật địa chỉ thành công");
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert("Thất bại", "Không thể cập nhật địa chỉ");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: containerBg }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: containerBg, borderBottomColor: theme.subtext },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Cập nhật địa chỉ
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.formWrap}>
        {/* Recipient Name */}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBg, borderColor, color: textColor },
          ]}
          placeholder="Tên người nhận"
          placeholderTextColor={theme.subtext}
          value={form.recipientName}
          onChangeText={(t) => handleChange("recipientName", t)}
        />
        {errors.recipientName && (
          <Text style={styles.errorText}>{errors.recipientName}</Text>
        )}

        {/* Phone */}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBg, borderColor, color: textColor },
          ]}
          placeholder="Số điện thoại"
          placeholderTextColor={theme.subtext}
          keyboardType="phone-pad"
          value={form.recipientPhone}
          onChangeText={(t) => handleChange("recipientPhone", t)}
        />
        {errors.recipientPhone && (
          <Text style={styles.errorText}>{errors.recipientPhone}</Text>
        )}

        {/* Email */}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBg, borderColor, color: textColor },
          ]}
          placeholder="Email"
          placeholderTextColor={theme.subtext}
          keyboardType="email-address"
          value={form.email}
          onChangeText={(t) => handleChange("email", t)}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Address */}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBg, borderColor, color: textColor },
          ]}
          placeholder="Địa chỉ cụ thể"
          placeholderTextColor={theme.subtext}
          value={form.address}
          onChangeText={(t) => handleChange("address", t)}
        />
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

        {/* Province */}
        <RNPickerSelect
          placeholder={{ label: "Chọn Tỉnh/Thành", value: null }}
          items={provinces}
          onValueChange={(v) => handleChange("province", v)}
          value={form.province}
          style={{
            inputIOS: {
              ...pickerStyles.input,
              backgroundColor: inputBg,
              borderColor,
              color: textColor,
            },
            inputAndroid: {
              ...pickerStyles.input,
              backgroundColor: inputBg,
              borderColor,
              color: textColor,
            },
          }}
        />
        {errors.province && (
          <Text style={styles.errorText}>{errors.province}</Text>
        )}

        {/* District */}
        <RNPickerSelect
          placeholder={{ label: "Chọn Quận/Huyện", value: null }}
          items={districts}
          onValueChange={(v) => handleChange("district", v)}
          value={form.district}
          style={{
            inputIOS: {
              ...pickerStyles.input,
              backgroundColor: inputBg,
              borderColor,
              color: textColor,
            },
            inputAndroid: {
              ...pickerStyles.input,
              backgroundColor: inputBg,
              borderColor,
              color: textColor,
            },
          }}
        />
        {errors.district && (
          <Text style={styles.errorText}>{errors.district}</Text>
        )}

        {/* Ward */}
        <RNPickerSelect
          placeholder={{ label: "Chọn Phường/Xã", value: null }}
          items={wards}
          onValueChange={(v) => handleChange("ward", v)}
          value={form.ward}
          style={{
            inputIOS: {
              ...pickerStyles.input,
              backgroundColor: inputBg,
              borderColor,
              color: textColor,
            },
            inputAndroid: {
              ...pickerStyles.input,
              backgroundColor: inputBg,
              borderColor,
              color: textColor,
            },
          }}
        />
        {errors.ward && <Text style={styles.errorText}>{errors.ward}</Text>}

        {/* Default Switch */}
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: textColor }]}>
            Đặt làm địa chỉ mặc định
          </Text>
          <Switch
            value={form.isDefault}
            onValueChange={(v) => handleChange("isDefault", v)}
            trackColor={{ false: theme.subtext, true: theme.primary }}
            ios_backgroundColor={theme.card}
            thumbColor={theme.primary}
            style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleUpdate}
        >
          <Text style={styles.buttonText}>Cập nhật</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const pickerStyles = StyleSheet.create({
  input: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
});

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

  formWrap: { padding: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  switchLabel: { fontSize: 16 },

  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  errorText: {
    color: "#FF3B30",
    fontSize: 13,
    marginBottom: 8,
  },
});
