import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import BottomSheet from "@gorhom/bottom-sheet";
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

  // bottom sheet refs & state
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["50%"], []);
  const [pickerData, setPickerData] = useState([]);
  const [pickerKey, setPickerKey] = useState("");
  const [pickerTitle, setPickerTitle] = useState("");

  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/p/").then((res) => {
      const opts = res.data.map((p) => ({ label: p.name, value: String(p.code) }));
      setProvinces(opts);
    });
  }, []);

  useEffect(() => {
    if (form.province) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${form.province}?depth=2`)
        .then((res) => {
          setDistricts(
            res.data.districts.map((d) => ({ label: d.name, value: String(d.code) }))
          );
          setForm((prev) => ({ ...prev, district: "", ward: "" }));
        });
    }
  }, [form.province]);

  useEffect(() => {
    if (form.district) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`)
        .then((res) => {
          setWards(res.data.wards.map((w) => ({ label: w.name, value: String(w.code) })));
          setForm((prev) => ({ ...prev, ward: "" }));
        });
    }
  }, [form.district]);

  const handleChange = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

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
    if (!accountId) {
      Alert.alert("Lỗi", "Không tìm thấy tài khoản");
      return;
    }
    if (!validate()) return;

    try {
      const selProv = provinces.find((p) => p.value === form.province)?.label;
      const selDist = districts.find((d) => d.value === form.district)?.label;
      const selWard = wards.find((w) => w.value === form.ward)?.label;

      await addressApi.createAddress({
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
      });
      Alert.alert("Thành công", "Đã thêm địa chỉ");
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert("Thất bại", "Không thể thêm địa chỉ");
    }
  };

  const openPicker = (key, data, title) => {
    setPickerKey(key);
    setPickerData(data);
    setPickerTitle(title);
    Keyboard.dismiss();
    bottomSheetRef.current?.expand();
  };

  const onSelectItem = (item) => {
    handleChange(pickerKey, item.value);
    bottomSheetRef.current?.close();
  };

  const renderPickerInput = (key, placeholder, data, error) => {
    const selected = data.find((d) => d.value === form[key]);
    return (
      <View>
        <TouchableOpacity
          style={[styles.input, { backgroundColor: cardBg, borderColor: theme.subtext }]}
          onPress={() => openPicker(key, data, placeholder)}
        >
          <Text style={{ color: selected ? theme.text : theme.subtext, flex: 1 }}>
            {selected?.label || placeholder}
          </Text>
          <Ionicons name="chevron-down" size={20} color={theme.subtext} />
        </TouchableOpacity>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: containerBg }]}>        
        <View style={[styles.header, { borderBottomColor: theme.subtext }]}>          
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Thêm địa chỉ</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        >
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

          {/* Pickers */}
          {renderPickerInput("province", "Chọn tỉnh/thành", provinces, errors.province)}
          {renderPickerInput("district", "Chọn quận/huyện", districts, errors.district)}
          {renderPickerInput("ward", "Chọn phường/xã", wards, errors.ward)}

          {/* Default Switch */}
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: theme.text }]}>Đặt làm mặc định</Text>
            <Switch
              value={form.isDefault}
              onValueChange={(v) => handleChange("isDefault", v)}
              trackColor={{ false: "#BBB", true: theme.primary }}
              ios_backgroundColor="#BBB"
              thumbColor={theme.primary}
              style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity style={[styles.submitBtn, { backgroundColor: theme.primary }]} onPress={handleSubmit}>
            <Text style={[styles.submitText, { color: theme.background }]}>Hoàn tất</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom Sheet Picker */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}                // ← bắt đầu đóng hoàn toàn
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          animateOnMount={false}    // (tuỳ chọn) bỏ animation khi mount
        >
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: theme.text }]}>{pickerTitle}</Text>
          </View>
          <FlatList
            data={pickerData}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.sheetItem} onPress={() => onSelectItem(item)}>
                <Text style={[styles.sheetItemText, { color: theme.text }]}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </BottomSheet>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 12 },
  form: { padding: 16, paddingBottom: 40 },
  input: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 8 },
  error: { color: "#FF3B30", fontSize: 13, marginBottom: 8 },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 12 },
  switchLabel: { fontSize: 16 },
  submitBtn: { padding: 16, borderRadius: 8, alignItems: "center", marginTop: 16 },
  submitText: { fontSize: 16, fontWeight: "bold" },
  sheetHeader: { padding: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#ccc" },
  sheetTitle: { fontSize: 16, fontWeight: "600" },
  sheetItem: { paddingVertical: 12, paddingHorizontal: 16 },
  sheetItemText: { fontSize: 16 },
});
