// productApi.js
import axiosInstance from '../api/axiosInstance';

export const END_POINT = {
  GET_ALL_PRODUCT: "/products/view-all", 
  GET_PRODUCT_BYID: "/products/{productId}",
  POST_FAVORITE_PRODUCT: "/favorites/{accountId}/{productId}",
  DELETE_FAVORITE_PRODUCT: "/favorites/{accountId}/{productId}",
  GET_ALL_FAVORITE_PRODUCT: "/favorites/{accountId}",
  GET_ALL_PRODUCT_BY_CATEGORY: "/products/filter-by-category",
  GET_BEST_SELLER_PRODUCT: "/products/top-selling-products",
};
export const get = (url, params) => {
  return axiosInstance.get(url, { params });
};

export const post = (url, data) => {
  return axiosInstance.post(url, data);
};

export const remove = (url) => {
  return axiosInstance.delete(url);
};
const productApi = {
  /**
   * Lấy danh sách sản phẩm (có phân trang)
   * @param {number} page - Số trang (mặc định 1)
   * @param {number} pageSize - Số sản phẩm trên 1 trang (mặc định 30)
   * @returns {Promise} Promise trả về response từ axios
   */
  getAllProducts(page = 1, pageSize = 30) {
    const url = `${END_POINT.GET_ALL_PRODUCT}?page=${page}&pageSize=${pageSize}`;
    return get(url);
  },

  /**
   * Lấy chi tiết sản phẩm theo id
   * @param {number} productId - ID sản phẩm
   * @param {number} [accountId] - ID tài khoản (tùy chọn)
   * @returns {Promise} Promise trả về response từ axios
   */
  getProductById(productId, accountId) {
    let url = END_POINT.GET_PRODUCT_BYID.replace("{productId}", String(productId));
    if (accountId) {
      url += `?accountId=${accountId}`;
    }
    return get(url);
  },

  /**
   * Lấy danh sách sản phẩm yêu thích của một tài khoản
   * @param {number} accountId - ID tài khoản
   * @param {number} page - Số trang (mặc định 1)
   * @param {number} pageSize - Số sản phẩm trên 1 trang (mặc định 10)
   * @returns {Promise} Promise trả về response từ axios
   */
  getAllFavoriteProducts(accountId, page = 1, pageSize = 10) {
    const url =
      END_POINT.GET_ALL_FAVORITE_PRODUCT.replace("{accountId}", String(accountId)) +
      `?page=${page}&pageSize=${pageSize}`;
    return get(url);
  },

  /**
   * Gửi request để thêm sản phẩm vào danh sách yêu thích
   * @param {number} accountId - ID tài khoản
   * @param {number} productId - ID sản phẩm
   * @returns {Promise} Promise trả về response từ axios
   */
  postFavoriteProduct(accountId, productId) {
    const url = END_POINT.POST_FAVORITE_PRODUCT.replace("{accountId}", String(accountId))
      .replace("{productId}", String(productId));
    return post(url);
  },

  /**
   * Gửi request để xóa sản phẩm khỏi danh sách yêu thích
   * @param {number} accountId - ID tài khoản
   * @param {number} productId - ID sản phẩm
   * @returns {Promise} Promise trả về response từ axios
   */
  deleteFavoriteProduct(accountId, productId) {
    const url = END_POINT.DELETE_FAVORITE_PRODUCT.replace("{accountId}", String(accountId))
      .replace("{productId}", String(productId));
    return remove(url);
  },

  /**
   * Lấy danh sách sản phẩm theo danh mục
   * @param {string} categoryName - Tên danh mục
   * @param {number} page - Số trang (mặc định 1)
   * @param {number} pageSize - Số sản phẩm trên 1 trang (mặc định 30)
   * @returns {Promise} Promise trả về response từ axios
   */
  getAllProductsByCategory(categoryName, page = 1, pageSize = 30) {
    const url = `${END_POINT.GET_ALL_PRODUCT_BY_CATEGORY}?categoryName=${encodeURIComponent(
      categoryName
    )}&page=${page}&pageSize=${pageSize}`;
    return get(url);
  },

  /**
   * Lấy danh sách sản phẩm bán chạy nhất
   * @param {number} top - Số lượng sản phẩm muốn lấy
   * @returns {Promise} Promise trả về response từ axios
   */
  getBestSellerProducts(top) {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 1);
    const url = `${END_POINT.GET_BEST_SELLER_PRODUCT}?from=${encodeURIComponent(
      from.toISOString()
    )}&to=${encodeURIComponent(to.toISOString())}&top=${top}`;
    return get(url);
  },
};

export default productApi;
