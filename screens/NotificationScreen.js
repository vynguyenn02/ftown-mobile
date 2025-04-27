import React, { useContext, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // ← ICON BACK
import { NotificationContext } from "../context/NotificationContext";
import { ThemeContext } from "../context/ThemeContext";

export default function NotificationScreen() {
  const navigation = useNavigation();
  const { notifications, markAsRead } = useContext(NotificationContext);
  const { theme } = useContext(ThemeContext);

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
        style={[
          styles.card,
          {
            backgroundColor: item.isRead ? theme.subCard : theme.card,
            borderColor: theme.border,
          },
        ]}
        onPress={() => markAsRead(item.notificationID)}
      >
        <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.cardContent, { color: theme.subtext }]}>{content}</Text>
        <Text style={[styles.cardTime, { color: theme.subtext }]}>{time}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />

      {/* Nút Back */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>🔔 Lịch sử thông báo</Text>
      </View>

      <FlatList
        key={notifications.length}
        data={notifications}
        keyExtractor={(item, index) =>
          item.notificationID ? item.notificationID.toString() : `fallback-${index}`
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.subtext }]}>Chưa có thông báo nào</Text>
        }
        contentContainerStyle={
          notifications.length === 0 && { flex: 1, justifyContent: "center" }
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  card: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardContent: {
    marginTop: 4,
    fontSize: 14,
  },
  cardTime: {
    marginTop: 6,
    fontSize: 12,
  },
  empty: {
    textAlign: "center",
    fontSize: 16,
  },
});
