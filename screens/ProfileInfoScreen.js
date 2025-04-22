import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import profileApi from "../api/profileApi";
import { ThemeContext } from "../context/ThemeContext";

export default function ProfileInfoScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const ACCENT = theme.primary;
  const BG = theme.background;
  const CARD = theme.card;
  const TEXT = theme.text;
  const SUBTEXT = theme.subtext;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("female");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const id = await AsyncStorage.getItem("accountId");
        if (!id) throw new Error("Không tìm thấy accountId");
        setAccountId(id);

        const res = await profileApi.getProfile(id);
        setFullName(res.fullName);
        setEmail(res.email);
        setPhone(res.phoneNumber);
        setGender(res.gender || "female");
        setDob(res.dateOfBirth ? new Date(res.dateOfBirth) : new Date());
        if (res.imagePath) setAvatarPreview(res.imagePath);

        setLoading(false);
      } catch (err) {
        Alert.alert("Lỗi", err.message);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
    });
    if (!result.canceled) setAvatar(result.assets[0]);
  };

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSave = async () => {
    try {
      if (!accountId) throw new Error("Không tìm thấy accountId");
      if (dob > new Date()) {
        Alert.alert("❌ Lỗi", "Ngày sinh không được lớn hơn ngày hiện tại.");
        return;
      }

      const formData = new FormData();
      formData.append("FullName", fullName.toString());
      formData.append("Email", email.toString());
      formData.append("PhoneNumber", phone.toString());
      formData.append("DateOfBirth", formatDate(dob));
      const mappedGender =
        gender === "Nam" ? "male" : gender === "Nữ" ? "female" : "other";
      formData.append("Gender", mappedGender.toString());

      if (avatar?.uri && avatar.uri.startsWith("file://")) {
        formData.append("AvatarImage", {
          uri: avatar.uri,
          name: "avatar.jpg",
          type: "image/jpeg",
        });
      }

      await profileApi.editProfile(accountId, formData);
      Alert.alert("✅ Thành công", "Cập nhật thông tin cá nhân thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error.response?.data || error.message);
      Alert.alert("❌ Lỗi", error.response?.data?.message || "Yêu cầu không hợp lệ.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: BG }]}> 
        <ActivityIndicator size="large" color={ACCENT} />
        <Text style={{ color: TEXT, marginTop: 8 }}>Đang tải thông tin...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: BG }]}>      
      <View style={[styles.topBar, { backgroundColor: CARD }]}>        
        <TouchableOpacity onPress={() => navigation.goBack()}>          
          <Ionicons name="chevron-back" size={28} color={TEXT} />        
        </TouchableOpacity>        
        <Text style={[styles.topBarTitle, { color: TEXT }]}>Chỉnh sửa thông tin</Text>        
        <View style={{ width: 28 }} />      
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          <Image
            source={
              avatar
                ? { uri: avatar.uri }
                : avatarPreview
                ? { uri: avatarPreview }
                : require("../assets/user.png")
            }
            style={styles.avatar}
          />
          <Text style={[styles.changeAvatarText, { color: ACCENT }]}>Thay đổi ảnh đại diện</Text>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: TEXT }]}>Họ và tên</Text>
          <TextInput
            style={[styles.input, { borderColor: SUBTEXT, backgroundColor: CARD, color: TEXT }]}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: TEXT }]}>Email</Text>
          <TextInput
            style={[styles.input, { borderColor: SUBTEXT, backgroundColor: CARD, color: TEXT }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: TEXT }]}>Số điện thoại</Text>
          <TextInput
            style={[styles.input, { borderColor: SUBTEXT, backgroundColor: CARD, color: TEXT }]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: TEXT }]}>Giới tính</Text>
          <Picker
            selectedValue={gender}
            onValueChange={(value) => setGender(value)}
            style={{ color: TEXT, backgroundColor: CARD }}
          >
            <Picker.Item label="Nam" value="male" />
            <Picker.Item label="Nữ" value="female" />
            <Picker.Item label="Khác" value="other" />
          </Picker>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: TEXT }]}>Ngày sinh</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.input, { borderColor: SUBTEXT, backgroundColor: CARD }]}
          >
            <Text style={{ color: TEXT }}>{dob.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(e, date) => {
                setShowDatePicker(false);
                if (date) setDob(date);
              }}
            />
          )}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: ACCENT }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: BG }]}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  avatarContainer: { alignItems: "center", marginTop: 10, marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#ccc" },
  changeAvatarText: { marginTop: 8, fontSize: 14 },
  inputGroup: { marginBottom: 16, paddingHorizontal: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    marginHorizontal: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
