import React, { useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native"; // ← THÊM DÒNG NÀY
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { NotificationContext } from "../context/NotificationContext";

export default function NotificationScreen() {
  const { notifications, markAsRead } = useContext(NotificationContext);

  // 👇 BẮT BUỘC RENDER LẠI MỖI LẦN VÀO
  useFocusEffect(
    useCallback(() => {
      console.log("🔁 NotificationScreen focused. notifications length:", notifications.length);
    }, [notifications])
  );

  const renderItem = ({ item }) => {
    const title = item.title || "Không có tiêu đề";
    const content = item.content || "Không có nội dung";
    const time = item.createdDate
      ? new Date(item.createdDate).toLocaleString()
      : "Vừa xong";

    return (
      <TouchableOpacity
        style={[styles.card, item.isRead ? styles.readCard : styles.unreadCard]}
        onPress={() => markAsRead(item.notificationID)}
      >
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardContent}>{content}</Text>
        <Text style={styles.cardTime}>{time}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Lịch sử thông báo</Text>
      <FlatList
        key={notifications.length} // ép update
        data={notifications}
        keyExtractor={(item, index) =>
          item.notificationID ? item.notificationID.toString() : `fallback-${index}`
        }        
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có thông báo nào</Text>}
        contentContainerStyle={notifications.length === 0 && { flex: 1, justifyContent: "center" }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", padding: 16, borderBottomWidth: 1, borderColor: "#ddd" },
  card: { margin: 16, padding: 12, borderRadius: 8, elevation: 1 },
  unreadCard: { backgroundColor: "#f9f9f9" },
  readCard:   { backgroundColor: "#e0e0e0" },
  cardTitle:   { fontSize: 16, fontWeight: "600" },
  cardContent: { marginTop: 4, fontSize: 14, color: "#333" },
  cardTime:    { marginTop: 6, fontSize: 12, color: "gray" },
  empty:       { textAlign: "center", color: "gray", fontSize: 16 },
});
