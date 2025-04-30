import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, ToastAndroid } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import favoriteStyleApi from "../api/favoriteStyleApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../context/ThemeContext";

const FavoriteStyleScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [stylesList, setStylesList] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const accountId = await AsyncStorage.getItem("accountId");
        if (!accountId) throw new Error("Không tìm thấy accountId");

        const response = await favoriteStyleApi.getAllStyles(accountId);
        setStylesList(response);
        const initiallySelected = new Set(response.filter(s => s.isSelected).map(s => s.styleId));
        setSelectedStyles(initiallySelected);
      } catch (error) {
        console.error("Lỗi khi load styles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStyles();
  }, []);

  const toggleStyle = (styleId) => {
    setSelectedStyles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(styleId)) {
        newSet.delete(styleId);
      } else {
        newSet.add(styleId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const accountId = await AsyncStorage.getItem("accountId");
      if (!accountId) throw new Error("Không tìm thấy accountId");

      const styleIds = Array.from(selectedStyles);
      await favoriteStyleApi.updatePreferredStyles(accountId, styleIds);

      ToastAndroid.show("Cập nhật thành công!", ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi lưu style yêu thích:", error);
      ToastAndroid.show("Có lỗi xảy ra!", ToastAndroid.SHORT);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </SafeAreaView>
    );
  }

  const selectedList = stylesList.filter(item => selectedStyles.has(item.styleId));
  const unselectedList = stylesList.filter(item => !selectedStyles.has(item.styleId));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Chọn Phong Cách Yêu Thích</Text>
      </View>

      {/* Nội dung */}
      <View style={styles.content}>
        {/* Đã chọn */}
        <View style={styles.selectedSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Đã chọn</Text>
          <ScrollView contentContainerStyle={styles.badgeContainer} showsVerticalScrollIndicator={false}>
            {selectedList.length > 0 ? (
              selectedList.map((item) => (
                <TouchableOpacity
                  key={item.styleId}
                  style={[
                    styles.badge,
                    {
                      backgroundColor: theme.text,
                    },
                  ]}
                  onPress={() => toggleStyle(item.styleId)}
                >
                  <Text style={[styles.badgeText, { color: theme.background }]}>
                    {item.styleName}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={[styles.emptyText, { color: theme.text }]}>Chưa chọn phong cách nào</Text>
            )}
          </ScrollView>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Chưa chọn */}
        <View style={styles.unselectedSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Chưa chọn</Text>
          <ScrollView contentContainerStyle={styles.badgeContainer} showsVerticalScrollIndicator={false}>
            {unselectedList.map((item) => (
              <TouchableOpacity
                key={item.styleId}
                style={[
                  styles.badge,
                  {
                    backgroundColor: theme.card,
                    borderWidth: 1,
                    borderColor: theme.text,
                  },
                ]}
                onPress={() => toggleStyle(item.styleId)}
              >
                <Text style={[styles.badgeText, { color: theme.text }]}>
                  {item.styleName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Nút Lưu */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: theme.text, opacity: !saving ? 1 : 0.4 },
        ]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={[styles.saveButtonText, { color: theme.background }]}>
          {saving ? "Đang lưu..." : "Lưu"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FavoriteStyleScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
  },
  content: { flex: 1 },
  selectedSection: { flex: 4, padding: 16 },
  unselectedSection: { flex: 6, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 10,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  saveButton: {
    borderRadius: 30,
    paddingVertical: 14,
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
