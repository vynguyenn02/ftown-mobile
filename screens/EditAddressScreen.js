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
import ModalSelector from "react-native-modal-selector";
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

  // Fetch provinces
  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/p/").then((res) => {
      const provinceOptions = res.data.map((p) => ({
        key: String(p.code),
        label: p.name,
        value: String(p.code),
      }));
      setProvinces(provinceOptions);

      const selectedProvince = provinceOptions.find((p) => p.label.trim() === address.province.trim());
      if (selectedProvince) {
        setForm((prev) => ({ ...prev, province: selectedProvince.value }));
      }
    });
  }, []);

  // Fetch districts
  useEffect(() => {
    if (!form.province) return;

    axios.get(`https://provinces.open-api.vn/api/p/${form.province}?depth=2`).then((res) => {
      const districtOptions = res.data.districts.map((d) => ({
        key: String(d.code),
        label: d.name,
        value: String(d.code),
      }));
      setDistricts(districtOptions);

      const selectedDistrict = districtOptions.find((d) => d.label.trim() === address.district.trim());
      if (selectedDistrict) {
        setForm((prev) => ({ ...prev, district: selectedDistrict.value }));
      }
    });
  }, [form.province]);

  // Fetch wards
  useEffect(() => {
    if (!form.district) return;

    axios.get(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`).then((res) => {
      const wardOptions = res.data.wards.map((w) => ({
        key: String(w.code),
        label: w.name,
        value: String(w.code),
      }));
      setWards(wardOptions);

      const selectedWard = wardOptions.find((w) => w.label.trim() === address.city.trim());
      if (selectedWard) {
        setForm((prev) => ({ ...prev, ward: selectedWard.value }));
      }
    });
  }, [form.district]);

  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validateForm = () => {
    const errs = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRx = /^[0-9]{9,15}$/;

    if (!form.recipientName.trim()) errs.recipientName = "Vui lòng nhập tên người nhận";
    if (!form.recipientPhone.trim()) errs.recipientPhone = "Vui lòng nhập số điện thoại";
    else if (!phoneRx.test(form.recipientPhone)) errs.recipientPhone = "Số điện thoại không hợp lệ";

    if (!form.email.trim()) errs.email = "Vui lòng nhập email";
    else if (!emailRx.test(form.email)) errs.email = "Email không hợp lệ";

    if (!form.address.trim()) errs.address = "Vui lòng nhập địa chỉ cụ thể";
    if (!form.province) errs.province = "Vui lòng chọn tỉnh/thành";
    if (!form.district) errs.district = "Vui lòng chọn quận/huyện";
    if (!form.ward) errs.ward = "Vui lòng chọn phường/xã";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const confirmUpdate = () => {
    Alert.alert(
      "Xác nhận cập nhật",
      "Bạn có chắc muốn cập nhật địa chỉ?",
      [
        { text: "Huỷ", style: "cancel" },
        { text: "Cập nhật", onPress: handleUpdate },
      ]
    );
  };

  const handleUpdate = async () => {
    try {
      const prov = provinces.find((p) => p.value === form.province)?.label;
      const dist = districts.find((d) => d.value === form.district)?.label;
      const ward = wards.find((w) => w.value === form.ward)?.label;

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

  // Tạo mới popupProps cho mỗi ModalSelector
  const getPopupProps = () => ({
    cancelText: "Huỷ",
    cancelTextStyle: { color: '#000', fontWeight: '600', fontSize: 16, textAlign: 'center', padding: 12 },
    optionContainerStyle: { backgroundColor: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden', marginHorizontal: 16 },
    overlayStyle: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
    cancelContainerStyle: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
    optionStyle: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
    optionTextStyle: { color: '#000', fontSize: 16 },
    initValueContainerStyle: { height: 48, justifyContent: 'center', paddingHorizontal: 12 },
    initValueTextStyle: { color: theme.subtext, fontSize: 16 },
    selectTextStyle: { color: '#000', fontSize: 16 },
    style: { backgroundColor: 'transparent', borderWidth: 0 },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: containerBg }]}>
      <View style={[styles.header, { backgroundColor: containerBg, borderBottomColor: theme.subtext }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Cập nhật địa chỉ</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formWrap}>
        {/* Inputs */}
        <TextInput style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
          placeholder="Tên người nhận" placeholderTextColor={theme.subtext}
          value={form.recipientName} onChangeText={(t) => handleChange("recipientName", t)} />
        {errors.recipientName && <Text style={styles.errorText}>{errors.recipientName}</Text>}

        <TextInput style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
          placeholder="Số điện thoại" placeholderTextColor={theme.subtext} keyboardType="phone-pad"
          value={form.recipientPhone} onChangeText={(t) => handleChange("recipientPhone", t)} />
        {errors.recipientPhone && <Text style={styles.errorText}>{errors.recipientPhone}</Text>}

        <TextInput style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
          placeholder="Email" placeholderTextColor={theme.subtext} keyboardType="email-address"
          value={form.email} onChangeText={(t) => handleChange("email", t)} />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
          placeholder="Địa chỉ cụ thể" placeholderTextColor={theme.subtext}
          value={form.address} onChangeText={(t) => handleChange("address", t)} />
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

        {/* ModalSelectors */}
        <Text style={[styles.label, { color: textColor }]}>Tỉnh/Thành phố</Text>
        <View style={styles.dropdownWrapper}>
          <ModalSelector
            data={provinces}
            initValue={provinces.find(p => p.value === form.province)?.label || "Chọn tỉnh/thành"}
            onChange={(opt) => handleChange('province', opt.value)}
            {...getPopupProps()}
          />
          <Ionicons name="chevron-down" size={20} color={textColor} style={styles.dropdownIcon} />
        </View>
        {errors.province && <Text style={styles.errorText}>{errors.province}</Text>}

        <Text style={[styles.label, { color: textColor }]}>Quận/Huyện</Text>
        <View style={styles.dropdownWrapper}>
          <ModalSelector
            data={districts}
            initValue={districts.find(d => d.value === form.district)?.label || "Chọn quận/huyện"}
            onChange={(opt) => handleChange('district', opt.value)}
            {...getPopupProps()}
          />
          <Ionicons name="chevron-down" size={20} color={textColor} style={styles.dropdownIcon} />
        </View>
        {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}

        <Text style={[styles.label, { color: textColor }]}>Phường/Xã</Text>
        <View style={styles.dropdownWrapper}>
          <ModalSelector
            data={wards}
            initValue={wards.find(w => w.value === form.ward)?.label || "Chọn phường/xã"}
            onChange={(opt) => handleChange('ward', opt.value)}
            {...getPopupProps()}
          />
          <Ionicons name="chevron-down" size={20} color={textColor} style={styles.dropdownIcon} />
        </View>
        {errors.ward && <Text style={styles.errorText}>{errors.ward}</Text>}

        {/* Switch default */}
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: textColor }]}>Đặt làm địa chỉ mặc định</Text>
          <Switch
            value={form.isDefault}
            onValueChange={(v) => handleChange("isDefault", v)}
            trackColor={{ true: theme.primary, false: theme.subtext }}
            thumbColor={theme.primary}
          />
        </View>

        {/* Submit button */}
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => { if (validateForm()) confirmUpdate(); }}>
          <Text style={styles.buttonText}>Cập nhật</Text>
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
  formWrap: { padding: 16 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    position: "relative",
  },
  dropdownIcon: {
    position: "absolute",
    right: 12,
    top: 18,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  switchLabel: { fontSize: 16 },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  errorText: { color: "#FF3B30", fontSize: 13, marginBottom: 8 },
});
