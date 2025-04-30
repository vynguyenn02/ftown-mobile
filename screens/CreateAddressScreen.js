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
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import ModalSelector from "react-native-modal-selector";
import { Ionicons } from "@expo/vector-icons";
import addressApi from "../api/addressApi";
import { ThemeContext } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

export default function CreateAddressScreen() {
  const { theme } = useContext(ThemeContext);
  const bgColor = theme.mode === "dark" ? "#121212" : "#FFFFFF";
  const fieldBg = theme.mode === "dark" ? "#1E1E1E" : "#F5F5F5";
  const borderColor = theme.mode === "dark" ? "#333" : "#DDD";

  const navigation = useNavigation();
  const [form, setForm] = useState({
    recipientName: "", recipientPhone: "", email: "", address: "",
    province: "", district: "", ward: "", isDefault: false,
  });
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/p/")
      .then(res => setProvinces(res.data.map(p => ({ key: String(p.code), label: p.name }))));
  }, []);

  useEffect(() => {
    if (!form.province) { setDistricts([]); return; }
    axios.get(`https://provinces.open-api.vn/api/p/${form.province}?depth=2`)
      .then(res => {
        setDistricts(res.data.districts.map(d => ({ key: String(d.code), label: d.name })));
        setForm(f => ({ ...f, district: "", ward: "" }));
      });
  }, [form.province]);

  useEffect(() => {
    if (!form.district) { setWards([]); return; }
    axios.get(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`)
      .then(res => {
        setWards(res.data.wards.map(w => ({ key: String(w.code), label: w.name })));
        setForm(f => ({ ...f, ward: "" }));
      });
  }, [form.district]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: null }));
  };

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
    if (!validate()) return;
    const accountId = await AsyncStorage.getItem("accountId");
    if (!accountId) { Alert.alert("Lỗi", "Không tìm thấy tài khoản"); return; }
    try {
      await addressApi.createAddress({
        accountId: Number(accountId),
        recipientName: form.recipientName,
        recipientPhone: form.recipientPhone,
        email: form.email,
        address: form.address,
        province: provinces.find(p => p.key === form.province)?.label,
        district: districts.find(d => d.key === form.district)?.label,
        city: wards.find(w => w.key === form.ward)?.label,
        country: "Việt Nam",
        isDefault: form.isDefault,
      });
      Alert.alert("Thành công", "Đã thêm địa chỉ");
      navigation.goBack();
    } catch {
      Alert.alert("Thất bại", "Không thể thêm địa chỉ");
    }
  };

  // Common popup props
  const popupProps = {
    cancelText: "Huỷ",
    cancelTextStyle: { color: '#000', fontWeight: '600', fontSize: 16, textAlign: 'center', padding: 12 },
    optionContainerStyle: { backgroundColor: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden', marginHorizontal: 16 },
    overlayStyle: { justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
    optionStyle: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
    optionTextStyle: { color: '#000', fontSize: 16 },
    initValueContainerStyle: { height: 48, justifyContent: 'center', paddingHorizontal: 12 },
    initValueTextStyle: { color: theme.subtext, fontSize: 16 },
    selectTextStyle: { color: '#000', fontSize: 16 },
    style: { backgroundColor: 'transparent', borderWidth: 0 },
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Thêm địa chỉ</Text>
      </View>
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="always">
        {/* Input fields */}
        <TextInput style={[styles.field, { backgroundColor: fieldBg, borderColor }]}
          placeholder="Tên người nhận" placeholderTextColor={theme.subtext}
          value={form.recipientName} onChangeText={t => handleChange('recipientName', t)} />
        {errors.recipientName && <Text style={styles.error}>{errors.recipientName}</Text>}

        <TextInput style={[styles.field, { backgroundColor: fieldBg, borderColor }]}
          placeholder="Số điện thoại" placeholderTextColor={theme.subtext}
          keyboardType="phone-pad" value={form.recipientPhone}
          onChangeText={t => handleChange('recipientPhone', t)} />
        {errors.recipientPhone && <Text style={styles.error}>{errors.recipientPhone}</Text>}

        <TextInput style={[styles.field, { backgroundColor: fieldBg, borderColor }]}
          placeholder="Email" placeholderTextColor={theme.subtext}
          keyboardType="email-address" value={form.email}
          onChangeText={t => handleChange('email', t)} />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <TextInput style={[styles.field, { backgroundColor: fieldBg, borderColor }]}
          placeholder="Địa chỉ cụ thể" placeholderTextColor={theme.subtext}
          value={form.address} onChangeText={t => handleChange('address', t)} />
        {errors.address && <Text style={styles.error}>{errors.address}</Text>}

        <Text style={[styles.label, { color: theme.text }]}>Tỉnh/Thành</Text>
        <View style={[styles.field, { backgroundColor: fieldBg, borderColor }]}>  
          <ModalSelector
            data={provinces}
            initValue="Chọn tỉnh/thành"
            onChange={opt => handleChange('province', opt.key)}
            {...popupProps}
          />
        </View>
        {errors.province && <Text style={styles.error}>{errors.province}</Text>}

        <Text style={[styles.label, { color: theme.text }]}>Quận/Huyện</Text>
        <View style={[styles.field, { backgroundColor: fieldBg, borderColor }]}>  
          <ModalSelector
            data={districts}
            initValue="Chọn quận/huyện"
            onChange={opt => handleChange('district', opt.key)}
            {...popupProps}
          />
        </View>
        {errors.district && <Text style={styles.error}>{errors.district}</Text>}

        <Text style={[styles.label, { color: theme.text }]}>Phường/Xã</Text>
        <View style={[styles.field, { backgroundColor: fieldBg, borderColor }]}>  
          <ModalSelector
            data={wards}
            initValue="Chọn phường/xã"
            onChange={opt => handleChange('ward', opt.key)}
            {...popupProps}
          />
        </View>
        {errors.ward && <Text style={styles.error}>{errors.ward}</Text>}

        <View style={styles.switchRow}>
          <Text style={[styles.label, { flex: 1, color: theme.text }]}>Đặt làm mặc định</Text>
          <Switch value={form.isDefault} onValueChange={v => handleChange('isDefault', v)} trackColor={{ true: theme.primary, false: '#BBB' }} thumbColor={theme.primary} />
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleSubmit}>
          <Text style={[styles.buttonText, { color: theme.background }]}>Hoàn tất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#CCC' },
  headerTitle: { fontSize: 18, fontWeight: '600', marginLeft: 8 },
  form: { padding: 16 },
  field: { height: 48, justifyContent: 'center', borderWidth: 1, borderRadius: 8, marginBottom: 12, overflow: 'hidden' },
  label: { marginBottom: 4, fontSize: 14, fontWeight: '500' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 12 },
  transparent: { backgroundColor: 'transparent', borderWidth: 0 },
  error: { color: '#FF3B30', fontSize: 12, marginBottom: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  button: { padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '600' },
});
