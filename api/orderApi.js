// api/orderApi.js
import { get } from "../utils/axios"; // Bạn đang dùng get/post tự custom
export const END_POINT = {
  GET_ORDERS: "/orders",
};

const orderApi = {
  getOrdersByStatus(status, accountId) {
    const query = `?status=${encodeURIComponent(status)}&accountId=${accountId}`;
    return get(`${END_POINT.GET_ORDERS}${query}`);
  },
  getOrderDetail: (orderId) =>
    get(`/orders/${orderId}/details`),
};

export default orderApi;
