import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@env";

// Tạo instance Axios riêng
const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để tự động gắn Authorization vào header
instance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log("📡 Request URL:", config.baseURL + config.url);
      return config;
    } catch (error) {
      console.log("❌ Lỗi khi lấy token:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// ⚙️ Các hàm gọi API
export const get = (url, params = {}, headers = {}) =>
  instance.get(url, { params, headers });

export const post = (url, data = {}, params = {}, headers = {}) =>
  instance.post(url, data, { params, headers });

export const put = (url, data = {}, params = {}, headers = {}) =>
  instance.put(url, data, { params, headers });

export const remove = (url, data = {}, params = {}, headers = {}) =>
  instance.delete(url, { data, params, headers });

// Gửi form-data (ví dụ: upload ảnh)
export const postMultipart = async (url, formData) => {
  const token = await AsyncStorage.getItem("accessToken");
  return instance.post(url, formData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "multipart/form-data",
    },
  });
};

export default instance;
