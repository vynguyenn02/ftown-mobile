// api/orderApi.js
import { get, post } from "../utils/axios"; // sử dụng custom get/post của bạn

export const END_POINT = {
  GET_ORDERS: "/orders",
  CREATE_ORDER: "/orders",
  ORDER_DETAIL: (orderId) => `/orders/${orderId}/details`,
  GET_ORDERS_RETURNREQUEST: "/return-requests/order-items",
  GET_RETURNABLE_ORDERS: "/orders/returnable",
  RETURN_CHECKOUT: "/return-requests/checkout",
  SUBMIT_RETURN_REQUEST: "/return-requests/submit-return-request",
};

const orderApi = {
  /**
   * Lấy danh sách đơn theo trạng thái có phân trang
   * @param {string} status - Trạng thái đơn (ví dụ: "Pending Confirmed")
   * @param {number|string} accountId - ID tài khoản
   * @param {number} [pageNumber=1] - Số trang cần lấy
   * @param {number} [pageSize=10] - Số mục mỗi trang
   */
  getOrdersByStatus(status, accountId, pageNumber = 1, pageSize = 10) {
    const params = [
      `status=${encodeURIComponent(status)}`,
      `accountId=${accountId}`,
      `pageNumber=${pageNumber}`,
      `pageSize=${pageSize}`,
    ].join("&");

    return get(`${END_POINT.GET_ORDERS}?${params}`);
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
    /**
   * Lấy danh sách đơn hàng đủ điều kiện đổi/trả theo accountId
   * @param {number} accountId - ID người dùng
   * @returns {Promise}
   */
  getReturnableOrders(accountId) {
    return get(`${END_POINT.GET_RETURNABLE_ORDERS}?accountId=${accountId}`);
  },
  /**
   * Lấy danh sách mặt hàng trả hàng theo orderId và accountId.
   * @param {number} accountId - ID của tài khoản.
   * @param {number} orderId - ID của đơn hàng.
   * @returns {Promise} Promise trả về response theo GetReturnItemResponse.
   */
  getOrdersReturnRequest(accountId, orderId) {
    const url = `${END_POINT.GET_ORDERS_RETURNREQUEST}?orderId=${orderId}&accountId=${accountId}`;
    return get(url);
  },

  /**
   * Gửi yêu cầu tạo phiên đổi trả (checkout đổi trả)
   * @param {object} payload - { orderId, accountId, selectedItems: [{ productVariantId, quantity }] }
   * @returns {Promise}
   */
  checkoutReturnRequest(payload) {
    return post(END_POINT.RETURN_CHECKOUT, payload);
  },
  
  /**
   * Gửi yêu cầu đổi/trả cuối cùng
   * @param {FormData} formData - dữ liệu dạng multipart/form-data
   * @returns {Promise}
   */
  submitReturnRequest(formData) {
    return post(END_POINT.SUBMIT_RETURN_REQUEST, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default orderApi;
