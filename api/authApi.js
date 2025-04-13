// api/authApi.js
import axios from "axios";
import { API_BASE_URL } from "@env";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });

    // ✅ BE trả về { data: { token: "...", account: {...} }, status, message }
    const { data: responseData } = response;

    console.log("✅ BACKEND RESPONSE: ", JSON.stringify(responseData));

    const token = responseData?.data?.token;

    if (!token) {
      throw new Error("Server trả về token không hợp lệ");
    }

    return token;
  } catch (error) {
    console.log("❌ LOGIN ERROR:", error);
    throw error;
  }
};
