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
    console.log("✅ BACKEND RESPONSE: ", JSON.stringify(responseData));

    const token = responseData?.data?.token;
    const accountId = responseData?.data?.account?.accountId;

    if (!token || !accountId) {
      throw new Error("Thiếu token hoặc accountId từ server");
    }

    return { token, accountId }; // ✅ TRẢ VỀ CẢ 2 GIÁ TRỊ
  } catch (error) {
    console.log("❌ LOGIN ERROR:", error);
    throw error;
  }
};

