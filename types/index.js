    /**
 * @typedef {Object} Product
 * @property {number} productId
 * @property {string} name
 * @property {string} productName - Tên sản phẩm
 * @property {string} imagePath
 * @property {number} price
 * @property {number} discountedPrice
 * @property {string} categoryName
 * @property {string[]} colors - Mảng mã màu
 */

/**
 * @typedef {Object} ProductListResponse
 * @property {Product[]} data
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @typedef {Object} ProductDetail
 * // Định nghĩa thêm các trường cho ProductDetail nếu cần
 */

/**
 * @typedef {Object} ProductDetailResponse
 * @property {ProductDetail} data
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @typedef {Object} Variant
 * @property {number} variantId
 * @property {string} productName
 * @property {string} size
 * @property {string} color
 * @property {number} price
 * @property {number} discountedPrice
 * @property {number|null} stockQuantity
 * @property {string} imagePath
 * @property {string} sku
 * @property {string} barcode
 * @property {number} weight
 */

// Bạn không cần export các typedef vì chúng chỉ mang tính chú thích,
// tuy nhiên bạn có thể export một object rỗng để có một điểm import chung.
module.exports = {};
