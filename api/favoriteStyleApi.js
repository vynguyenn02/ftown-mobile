// api/favoriteStyleApi.js
import { get, put, post} from "../utils/axios"; // 🔥 Import get/put custom

// 🔥 Tập trung endpoint
export const END_POINT = {
  GET_PREFERRED_STYLES: (accountId) => `/customer/preferred-styles/${accountId}`, // 🔥 Sửa lại theo Gateway
  UPDATE_PREFERRED_STYLES: (accountId) => `/customer/preferred-styles/${accountId}`, // 🔥 Trùng với Get nhưng method khác
  GET_SUGGESTED_PRODUCTS: (accountId, page = 1, pageSize = 10) =>
    `/customer/suggestions?accountId=${accountId}&page=${page}&pageSize=${pageSize}`,
  RECORD_PRODUCT_INTERACTION: () => `/customer/products/interactions`,
};

const favoriteStyleApi = {
  /**
   * Lấy toàn bộ style + các style đã chọn theo accountId
   * @param {number|string} accountId 
   * @returns {Promise<{allStyles: Array, selectedStyleIds: Array}>}
   */
  getAllStyles: async (accountId) => {
    try {
      const response = await get(END_POINT.GET_PREFERRED_STYLES(accountId));
      return response.data.data; // 🔥 Lấy đúng danh sách [ {styleId, styleName}, ... ]
    } catch (error) {
      console.error("Lỗi lấy danh sách style:", error);
      throw error;
    }
  },
  

  /**
   * Cập nhật danh sách style yêu thích
   * @param {number|string} accountId 
   * @param {Array<number>} styleIds 
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  updatePreferredStyles(accountId, styleIds) {
    return put(END_POINT.UPDATE_PREFERRED_STYLES(accountId), { styleIds });
  },
  getSuggestedProducts: (accountId, page = 1, pageSize = 10) => {
    return get(END_POINT.GET_SUGGESTED_PRODUCTS(accountId, page, pageSize));
  },
  /**
   * Ghi nhận tương tác sản phẩm
   * @param {number|string} accountId 
   * @param {number} productId 
   * @returns {Promise}
   */
  recordProductInteraction: (accountId, productId) => {
    return post(END_POINT.RECORD_PRODUCT_INTERACTION(), { accountId, productId });
  },
};

export default favoriteStyleApi;
