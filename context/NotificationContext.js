import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { connectNotificationHub, disconnectNotificationHub } from "../services/notificationService";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (payload) => {
    const raw = payload.data ?? payload;

const notif = {
  notificationID: raw.notificationID || raw.notificationId, // 👉 xử lý camelCase và PascalCase
  title: raw.title,
  content: raw.content,
  notificationType: raw.notificationType,
  isRead: raw.isRead ?? false,
  createdDate: raw.createdDate ?? new Date().toISOString(),
};

if (!notif.notificationID) {
  console.warn("⚠️ Bỏ qua thông báo không có notificationID:", notif);
  return;
}

setNotifications(prev => {
  const filtered = prev.filter(n => n.notificationID !== notif.notificationID);
  const updated = [notif, ...filtered];
  console.log("✅ Notifications updated (length):", updated.length);
  return [...updated];
});

Toast.show({
  type: "info",
  text1: `🔔 ${notif.title || "Thông báo mới"}`,
  text2: notif.content || "Bạn có một thông báo mới",
});


    setNotifications(prev => {
      // Nếu đã có ID, loại ra trước khi thêm (tránh đè)
      const filtered = prev.filter(n => n.notificationID !== notif.notificationID);
      const updated = [notif, ...filtered];
  
      console.log("✅ Notifications updated (length):", updated.length);
      return [...updated]; // Clone mới hoàn toàn để ép re-render
    });
  
    // ✅ Hiển thị Toast
    Toast.show({
      type: "info",
      text1: `🔔 ${notif.title || "Thông báo mới"}`,
      text2: notif.content || "Bạn có một thông báo mới",
    });
  };
  
  const markAsRead = (notificationID) => {
    setNotifications(prev =>
      prev.map(n =>
        n.notificationID === notificationID ? { ...n, isRead: true } : n
      )
    );
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("userToken");

      console.log("📦 userId:", userId);
      console.log("🔐 userToken:", token);

      if (!userId || !token || !mounted) return;

      try {
        const url = `https://ftapigatewayservice.azurewebsites.net/notifications/user/${userId}`;
        console.log("🔗 Gọi API:", url);

        const res = await fetch(url);
        const json = await res.json();
        console.log("📩 API Response:", json);

        if (json.status && Array.isArray(json.data)) {
          const list = json.data.map(p => p.data ?? p);
          console.log("🧾 Final notifications list:", list);
          setNotifications(list);
        } else {
          console.warn("⚠️ API trả về dữ liệu không hợp lệ hoặc rỗng");
        }

        // ✅ Kết nối SignalR sau khi load thành công
        connectNotificationHub(token, (payload) => {
          console.log("🔥 Received notification via SignalR:", payload);
          addNotification(payload);
        });
      } catch (err) {
        console.error("❌ Load notifications failed", err);
      }
    })();

    return () => {
      mounted = false;
      disconnectNotificationHub();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
