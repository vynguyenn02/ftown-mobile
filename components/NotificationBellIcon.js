import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NotificationContext } from "../context/NotificationContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function NotificationBellIcon() {
  const { notifications } = useContext(NotificationContext);
  const navigation = useNavigation();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 🔍 Debug log (có thể xoá sau khi test xong)
  console.log("🔔 Total notifications:", notifications.length);
  console.log("📬 Unread notifications:", unreadCount);

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate("NotificationScreen")}>
      <Ionicons name="notifications-outline" size={28} color="black" />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginRight: 16,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
