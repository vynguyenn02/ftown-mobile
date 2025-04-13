// axios.js
import axios from "axios";
// Sử dụng biến API_BASE_URL từ .env
import { API_BASE_URL } from "@env"; 

/**
 * Hàm mẫu lấy accessToken.
 * Bạn cần thay thế bằng logic thật để lấy token, ví dụ từ AsyncStorage hay từ state quản lý authentication.
 */
const getAccessToken = () => {
  // Ví dụ: trả về token đã được lưu trữ
  // return await AsyncStorage.getItem('accessToken');
  return null;
};

/**
 * Hàm request chung để gọi API với Axios.
 *
 * @param {string} endpoint - Đường dẫn của API, ví dụ: "/products/view-all"
 * @param {string} method - Phương thức HTTP, ví dụ: "GET", "POST",...
 * @param {object} headers - Các header tuỳ chỉnh, mặc định là {}
 * @param {object} params - Các tham số query, mặc định là {}
 * @param {object} body - Dữ liệu gửi đi (cho POST, PUT,...), mặc định là {}
 * @returns {Promise} - Promise trả về response của Axios.
 */
export const request = (endpoint, method, headers = {}, params = {}, body = {}) => {
  const accessToken = getAccessToken();

  // Hợp nhất headers; nếu có token thì thêm Authorization header
  const mergedHeaders = Object.assign(
    {},
    headers,
    accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
  );

  // Log URL để debug (có thể bỏ sau khi đã kiểm tra)
  const fullUrl = API_BASE_URL + endpoint;
  console.log("Full URL request:", fullUrl, "with params:", params);

  return axios({
    url: fullUrl,
    method: method,
    headers: mergedHeaders,
    params: params,
    data: body,
  });
};

/**
 * Gửi request GET.
 *
 * @param {string} endpoint - Đường dẫn API
 * @param {object} params - Tham số query
 * @param {object} headers - Header tuỳ chỉnh
 * @returns {Promise} - Promise trả về response của Axios.
 */
export const get = (endpoint, params = {}, headers = {}) => {
  return request(endpoint, "GET", headers, params);
};

/**
 * Gửi request POST.
 *
 * @param {string} endpoint - Đường dẫn API
 * @param {object} body - Dữ liệu gửi đi
 * @param {object} params - Tham số query
 * @param {object} headers - Header tuỳ chỉnh
 * @returns {Promise} - Promise trả về response của Axios.
 */
export const post = (endpoint, body = {}, params = {}, headers = {}) => {
  return request(endpoint, "POST", headers, params, body);
};

/**
 * Gửi request PUT.
 *
 * @param {string} endpoint - Đường dẫn API
 * @param {object} body - Dữ liệu gửi đi
 * @param {object} params - Tham số query
 * @param {object} headers - Header tuỳ chỉnh
 * @returns {Promise} - Promise trả về response của Axios.
 */
export const put = (endpoint, body = {}, params = {}, headers = {}) => {
  return request(endpoint, "PUT", headers, params, body);
};

/**
 * Gửi request DELETE.
 *
 * @param {string} endpoint - Đường dẫn API
 * @param {object} body - Dữ liệu gửi đi (nếu cần)
 * @param {object} params - Tham số query
 * @param {object} headers - Header tuỳ chỉnh
 * @returns {Promise} - Promise trả về response của Axios.
 */
export const remove = (endpoint, body = {}, params = {}, headers = {}) => {
  return request(endpoint, "DELETE", headers, params, body);
};

/**
 * Gửi request POST với dữ liệu multipart (FormData).
 *
 * @param {string} endpoint - Đường dẫn API
 * @param {FormData} formData - Dữ liệu kiểu FormData
 * @returns {Promise} - Promise trả về response của Axios.
 */
export const postMultipart = (endpoint, formData) => {
  const accessToken = getAccessToken();

  return axios({
    url: API_BASE_URL + endpoint,
    method: "POST",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
};
