import axios from "axios";
import { API_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getProfile = async (accountId) => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) throw new Error("Chưa có token xác thực");
  if (!accountId) throw new Error("Thiếu accountId");

  const url = `/customer/profile/${accountId}`;
  console.log("📡 Calling:", url);

  const response = await api.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export default {
  getProfile,
};
