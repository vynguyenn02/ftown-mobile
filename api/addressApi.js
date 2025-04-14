import { get, post, put, remove } from "../utils/axios";

export const END_POINT = {
  GET_BY_ACCOUNT: "/shippingaddresses/account/{accountId}",
  GET_BY_ID: "/shippingaddresses/{id}",
  CREATE_ADDRESS: "/shippingaddresses",
  UPDATE_ADDRESS: "/shippingaddresses/{id}",
  DELETE_ADDRESS: "/shippingaddresses/{id}",
};

const addressApi = {
  /**
   * Lấy danh sách địa chỉ của tài khoản
   * @param {number} accountId
   * @returns {Promise}
   */
  getAddressesByAccountId(accountId) {
    const url = END_POINT.GET_BY_ACCOUNT.replace("{accountId}", String(accountId));
    console.log("📤 [GET] Get addresses by accountId:", url); // ✅ thêm log
    return get(url);
  },

  /**
   * Lấy chi tiết địa chỉ theo ID
   * @param {number} id - ID địa chỉ
   * @returns {Promise}
   */
  getAddressById(id) {
    const url = END_POINT.GET_BY_ID.replace("{id}", String(id));
    console.log("📤 [GET] Get address by ID:", url); // ✅
    return get(url);
  },

  /**
   * Tạo địa chỉ mới
   * @param {CreateShippingAddressRequest} data
   * @returns {Promise}
   */
  createAddress(data) {
    console.log("📤 [POST] Create new address:", data); // ✅
    return post(END_POINT.CREATE_ADDRESS, data);
  },

  /**
   * Cập nhật địa chỉ theo ID
   * @param {number} id - ID địa chỉ
   * @param {UpdateShippingAddressRequest} data
   * @returns {Promise}
   */
  updateAddress(id, data) {
    const url = END_POINT.UPDATE_ADDRESS.replace("{id}", String(id));
    console.log("📤 [PUT] Update address:", url, data); // ✅
    return put(url, data);
  },

  /**
   * Xóa địa chỉ theo ID
   * @param {number} id - ID địa chỉ
   * @returns {Promise}
   */
  deleteAddress(id) {
    const url = END_POINT.DELETE_ADDRESS.replace("{id}", String(id));
    console.log("📤 [DELETE] Delete address:", url); // ✅
    return remove(url);
  },
};

export default addressApi;
