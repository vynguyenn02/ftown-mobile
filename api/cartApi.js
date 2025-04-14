/**
 * @module cartApi
 */
import { get, post, remove } from '../utils/axios';

/**
 * Các endpoint của giỏ hàng.
 * @constant
 */
export const CART_ENDPOINT = {
  GET_CART: "/cart/{accountId}",
  ADD_PRODUCT: "/cart/{accountId}/add",
  CHECKOUT: "/checkout",
  GET_ALL_STORE: "/stores",
  REMOVE_CART_ITEM: "/cart/{accountId}/remove/{productVariantId}",
  EDIT_CART: "/cart/{accountId}/change-quantity",
  REMOVE_ALL_CART_ITEM: "/cart/{accountId}/clear",
};

class CartService {
  /**
   * Lấy giỏ hàng của tài khoản.
   * @param {number} accountId
   * @returns {Promise} Promise trả về CartResponse
   */
  getCart(accountId) {
    const url = CART_ENDPOINT.GET_CART.replace("{accountId}", String(accountId));
    return get(url);
  }

  /**
   * Thêm sản phẩm vào giỏ.
   * @param {number} accountId
   * @param {object} payload - AddCartPayload
   * @returns {Promise} Promise trả về CartResponse
   */
  addProductToCart(accountId, payload) {
    const url = CART_ENDPOINT.ADD_PRODUCT.replace("{accountId}", String(accountId));
    return post(url, payload);
  }

  /**
   * Thực hiện checkout với danh sách sản phẩm đã chọn.
   * @param {object} payload - CheckoutRequest
   * @returns {Promise} Promise trả về CheckoutResponse
   */
  checkout(payload) {
    return post(CART_ENDPOINT.CHECKOUT, payload);
  }

  /**
   * Lấy danh sách tất cả các store.
   * @returns {Promise} Promise trả về một mảng Store
   */
  getAllStores() {
    return get(CART_ENDPOINT.GET_ALL_STORE);
  }

  /**
   * Thay đổi số lượng sản phẩm trong giỏ.
   * @param {number} accountId
   * @param {object} payload - EditCart
   * @returns {Promise} Promise trả về CartResponse
   */
  editCart(accountId, payload) {
    const url = CART_ENDPOINT.EDIT_CART.replace("{accountId}", String(accountId));
    return post(url, payload);
  }

  /**
   * Xóa một mặt hàng khỏi giỏ.
   * @param {number} accountId
   * @param {number} productVariantId
   * @returns {Promise} Promise trả về CartResponse
   */
  removeCartItem(accountId, productVariantId) {
    const url = CART_ENDPOINT.REMOVE_CART_ITEM
      .replace("{accountId}", String(accountId))
      .replace("{productVariantId}", String(productVariantId));
    return remove(url);
  }

  /**
   * Xóa toàn bộ mặt hàng khỏi giỏ.
   * @param {number} accountId
   * @returns {Promise} Promise trả về CartResponse
   */
  removeAllCartItem(accountId) {
    const url = CART_ENDPOINT.REMOVE_ALL_CART_ITEM.replace("{accountId}", String(accountId));
    return remove(url);
  }
}

const cartService = new CartService();
export default cartService;
