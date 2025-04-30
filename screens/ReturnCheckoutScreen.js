import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";

export default function ReturnCheckoutScreen() {
  const navigation = useNavigation();
  const { checkoutData } = useRoute().params;
  const {
    orderId,
    returnItems,
    refundMethods,
    returnOptions,
    returnReasons,
    returnCheckoutSessionId,
  } = checkoutData;

  const { theme } = useContext(ThemeContext);
  const ACCENT = theme.primary;
  const BG = theme.background;
  const CARD = theme.card;
  const TEXT = theme.text;
  const SUBTEXT = theme.subtext;

  const [selectedReason, setSelectedReason] = useState(returnReasons[0]);
  const [selectedOption, setSelectedOption] = useState(returnOptions[0]);
  const [modalVisible, setModalVisible] = useState(null);
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...uris]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("ReturnCheckoutSessionId", returnCheckoutSessionId);
      formData.append("Email", email);
      formData.append("ReturnReason", selectedReason);
      formData.append("ReturnOption", selectedOption);
      if (selectedOption === "Hoàn tiền") {
        formData.append("RefundMethod", refundMethods[0]);
        formData.append("BankName", bankName);
        formData.append("BankAccountNumber", bankAccountNumber);
        formData.append("BankAccountName", bankAccountName);
      }
      formData.append("ReturnDescription", description);
      images.forEach((uri) => {
        const filename = uri.split("/").pop();
        const match = /\.([a-zA-Z]+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";
        formData.append("MediaFiles", { uri, name: filename, type });
      });
  
      const url = `${process.env.API_BASE_URL}/return-requests/submit-return-request`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`Status ${response.status}`);
  
      Alert.alert("✅ Thành công", "Yêu cầu đổi/trả đã được gửi.", [
        {
          text: "OK",
          onPress: () =>
            navigation.reset({
              index: 1,
              routes: [
                { name: "HomeScreen" },
                { name: "OrderScreen", params: { status: "Return Requested" } },
              ],
            }),
        },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("❌ Lỗi", err.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };
  

  const renderProduct = ({ item }) => (
    <View style={[styles.card, { backgroundColor: CARD }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: TEXT }]}>{item.productName}</Text>
        <Text style={[styles.meta, { color: SUBTEXT }]}>Size: {item.size}</Text>
        <Text style={[styles.meta, { color: SUBTEXT }]}>Màu: {item.color}</Text>
        <Text style={[styles.meta, { color: SUBTEXT }]}>Số lượng: {item.quantity}</Text>
      </View>
    </View>
  );

  const renderModal = (options, selected, setter, title, key) => (
    <Modal visible={modalVisible === key} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} onPress={() => setModalVisible(null)}>
        <View style={[styles.modal, { backgroundColor: CARD }]}>
          <Text style={[styles.modalTitle, { color: TEXT }]}>{title}</Text>
          {options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={styles.modalItem}
              onPress={() => {
                setter(opt);
                setModalVisible(null);
              }}
            >
              <Text
                style={{
                  color: opt === selected ? ACCENT : SUBTEXT,
                  fontWeight: opt === selected ? "bold" : "normal",
                }}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar
        barStyle={theme.mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={BG}
      />
      <View style={[styles.header, { backgroundColor: CARD }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={TEXT} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: TEXT }]}>Xác nhận đổi/trả #{orderId}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={[styles.section, { color: TEXT }]}>Sản phẩm</Text>
        <FlatList
          data={returnItems}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderProduct}
          scrollEnabled={false}
        />

        <View style={styles.field}>
          <Text style={[styles.label, { color: TEXT }]}>Lý do trả hàng</Text>
          <TouchableOpacity
            style={[styles.dropdown, { backgroundColor: CARD, borderColor: SUBTEXT }]}
            onPress={() => setModalVisible("reason")}
          >
            <Text style={{ color: TEXT }}>{selectedReason}</Text>
          </TouchableOpacity>
        </View>
        {renderModal(returnReasons, selectedReason, setSelectedReason, "Chọn lý do", "reason")}

        <View style={styles.field}>
          <Text style={[styles.label, { color: TEXT }]}>Phương án giải quyết</Text>
          <TouchableOpacity
            style={[styles.dropdown, { backgroundColor: CARD, borderColor: SUBTEXT }]}
            onPress={() => setModalVisible("option")}
          >
            <Text style={{ color: TEXT }}>{selectedOption}</Text>
          </TouchableOpacity>
        </View>
        {renderModal(returnOptions, selectedOption, setSelectedOption, "Chọn phương án", "option")}

        {selectedOption === "Hoàn tiền" && (
          <>
            <Text style={[styles.section, { color: TEXT }]}>Phương thức hoàn tiền</Text>
            {refundMethods.map((m, i) => (
              <Text key={i} style={[styles.meta, { color: SUBTEXT }]}>• {m}</Text>
            ))}

            <TextInput
              value={bankName}
              onChangeText={setBankName}
              placeholder="Tên ngân hàng"
              placeholderTextColor={SUBTEXT}
              style={[styles.input, {
                borderColor: SUBTEXT,
                backgroundColor: CARD,
                color: TEXT,
                marginBottom: 12, // ✅ thêm dòng này
              }]}
            />

            <TextInput
              value={bankAccountNumber}
              onChangeText={setBankAccountNumber}
              placeholder="Số tài khoản"
              placeholderTextColor={SUBTEXT}
              style={[styles.input, {
                borderColor: SUBTEXT,
                backgroundColor: CARD,
                color: TEXT,
                marginBottom: 12, // ✅ thêm dòng này
              }]}
            />

            <TextInput
              value={bankAccountName}
              onChangeText={setBankAccountName}
              placeholder="Tên chủ tài khoản"
              placeholderTextColor={SUBTEXT}
              style={[styles.input, {
                borderColor: SUBTEXT,
                backgroundColor: CARD,
                color: TEXT,
                marginBottom: 12, // ✅ thêm dòng này
              }]}
            />
          </>
        )}

        <View style={styles.field}>
          <Text style={[styles.label, { color: TEXT }]}>Email nhận thông báo</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email"
            placeholderTextColor={SUBTEXT}
            keyboardType="email-address"
            style={[styles.input, { borderColor: SUBTEXT, backgroundColor: CARD, color: TEXT }]}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: TEXT }]}>Mô tả chi tiết</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Nhập mô tả..."
            placeholderTextColor={SUBTEXT}
            multiline
            numberOfLines={4}
            style={[styles.input, { height: 100, textAlignVertical: "top", borderColor: SUBTEXT, backgroundColor: CARD, color: TEXT }]}
          />
        </View>

        <View style={[styles.field, { alignItems: "flex-end" }]}>
          <Text style={[styles.label, { color: TEXT }]}>Hình ảnh minh họa</Text>
          {images.length > 0 && (
            <View style={styles.previewRow}>
              {images.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.preview} />
              ))}
            </View>
          )}
          <TouchableOpacity
            onPress={pickImages}
            style={[styles.upload, { backgroundColor: CARD, borderColor: SUBTEXT }]}
          >
            <Ionicons name="cloud-upload-outline" size={18} color={ACCENT} />
            <Text style={[styles.uploadText, { color: ACCENT }]}>Chọn ảnh</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submit, { backgroundColor: ACCENT }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={BG} />
          ) : (
            <Text style={[styles.submitText, { color: BG }]}>Gửi yêu cầu</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold' },
  container: { paddingBottom: 40 },
  section: { fontSize: 16, fontWeight: 'bold', margin: 16 },
  card: { flexDirection: 'row', padding: 12, borderRadius: 8, marginHorizontal: 16, marginBottom: 12, elevation: 1 },
  image: { width: 60, height: 60, borderRadius: 6, backgroundColor: '#eee' },
  info: { marginLeft: 12, flex: 1 },
  name: { fontWeight: 'bold', fontSize: 14 },
  meta: { fontSize: 13, marginTop: 4 },
  field: { marginHorizontal: 16, marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 6 },
  dropdown: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modal: { width: '100%', borderRadius: 12, padding: 16, elevation: 5 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  modalItem: { paddingVertical: 10 },
  previewRow: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8, marginHorizontal: 16 },
  preview: { width: 60, height: 60, borderRadius: 6, marginRight: 8, marginBottom: 8 },
  upload: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 8 },
  uploadText: { fontWeight: 'bold', marginLeft: 6, fontSize: 14 },
  submit: { marginTop: 20, marginHorizontal: 16, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  submitText: { fontSize: 16, fontWeight: 'bold' },
});
