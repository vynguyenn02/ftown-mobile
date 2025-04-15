// api/orderApi.js
import { get, post } from "../utils/axios"; // sử dụng custom get/post của bạn

export const END_POINT = {
  GET_ORDERS: "/orders",
  CREATE_ORDER: "/orders",
  ORDER_DETAIL: (orderId) => `/orders/${orderId}/details`,
};

const orderApi = {
  // Lấy danh sách đơn theo trạng thái
  getOrdersByStatus(status, accountId) {
    const query = `?status=${encodeURIComponent(status)}&accountId=${accountId}`;
    return get(`${END_POINT.GET_ORDERS}${query}`);
  },

  // Lấy chi tiết đơn hàng
  getOrderDetail: (orderId) => {
    return get(END_POINT.ORDER_DETAIL(orderId));
  },

  // Tạo đơn hàng
  createOrder: async (data) => {
    console.log("🚀 Gọi POST", END_POINT.CREATE_ORDER);
    console.log("📦 Payload:", JSON.stringify(data, null, 2));
    try {
      const response = await post(END_POINT.CREATE_ORDER, data);
      console.log("✅ Response từ BE:", response.data);
      return response;
    } catch (err) {
      console.error("❌ Lỗi khi gọi API /orders:", err?.response?.data || err.message);
      throw err;
    }
  },
};

export default orderApi;
