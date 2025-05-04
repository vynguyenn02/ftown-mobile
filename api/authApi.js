// api/authApi.js
import axios from "axios";
import { API_BASE_URL } from "@env";
console.log("🌍 API_BASE_URL from .env:", API_BASE_URL);
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const responseData = response.data;

    console.log("✅ FULL RESPONSE.DATA:", JSON.stringify(responseData, null, 2));

    const token = responseData?.data?.token;
    const accountId = responseData?.data?.account?.accountId; // ✅ chuẩn theo dữ liệu bạn gửi

    if (!token || !accountId) {
      throw new Error("Thiếu token hoặc accountId từ server");
    }

    return { token, accountId };
  } catch (error) {
    console.log("❌ LOGIN ERROR:", error);
    throw error;
  }
};
export const register = async ({ username, email, password }) => {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
      isActive: true, // Mặc định luôn true
    });
    console.log("✅ REGISTER SUCCESS:", response.data);
    return response.data;
  } catch (error) {
    console.log("❌ REGISTER ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const googleLogin = async (idToken) => {
  try {
    const response = await api.post("/auth/google-login", { idToken });
    const payload = response.data?.data ?? response.data;
    
    console.log("✅ GOOGLE LOGIN RESPONSE:", JSON.stringify(payload, null, 2));
    
    const token = payload.token;
    const account = payload.account;
    if (!token || !account?.accountId) {
      throw new Error("Thiếu token hoặc accountId từ server (Google login)");
    }
    
    return { token, account };
  } catch (err) {
    console.error("❌ GOOGLE LOGIN ERROR:", err.response?.data || err.message);
    throw err;
  }
};