/**
 * @typedef {Object} Feedback
 * @property {number} feedbackId
 * @property {number} accountId
 * @property {number} productId
 * @property {string} title
 * @property {number} rating
 * @property {string} comment
 * @property {string} createdDate
 * @property {string} imagePath
 * @property {number} orderDetailId
 */

/**
 * @typedef {Object} FeedbackListResponse
 * @property {Feedback[]} data
 * @property {boolean} status
 * @property {string} message
 */

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
/**
 * @typedef {Object} ShippingAddress
 * @property {number} addressId
 * @property {number} accountId
 * @property {string} address
 * @property {string} city
 * @property {string} province
 * @property {string} district
 * @property {string} country
 * @property {string} recipientName
 * @property {string} recipientPhone
 * @property {string} email
 * @property {boolean} isDefault
 */

/**
 * @typedef {Object} CreateShippingAddressRequest
 * @property {number} accountId
 * @property {string} address
 * @property {string} city
 * @property {string} province
 * @property {string} district
 * @property {string} country
 * @property {string} recipientName
 * @property {string} recipientPhone
 * @property {string} email
 * @property {boolean} isDefault
 */

/**
 * @typedef {Object} UpdateShippingAddressRequest
 * @property {string} address
 * @property {string} city
 * @property {string} province
 * @property {string} district
 * @property {string} country
 * @property {string} recipientName
 * @property {string} recipientPhone
 * @property {string} email
 * @property {boolean} isDefault
 */

/**
 * @typedef {Object} ShippingAddressListResponse
 * @property {ShippingAddress[]} data
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @typedef {Object} AddCartPayload
 * @property {number} productId
 * @property {string} size
 * @property {string} color
 * @property {number} quantity
 */

/**
 * @typedef {Object} ProductDetail
 * @property {number} productId
 * @property {string} name
 * @property {string} description
 * @property {string} imagePath
 * @property {string[]} imagePaths
 * @property {string} origin
 * @property {string} model
 * @property {string} occasion
 * @property {string} style
 * @property {string} material
 * @property {boolean} isFavorite
 * @property {string} categoryName
 * @property {Variant[]} variants
 */

/**
 * @typedef {Object} ProductDetailResponse
 * @property {ProductDetail} data
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @typedef {Object} Store
 * @property {string} storeId
 * @property {string} storeName
 * @property {string} storeDescription
 * @property {string} location
 * @property {string} imagePath
 * @property {string} storeEmail
 * @property {string} storePhone
 */

/**
 * @template T
 * @typedef {Object} ResponseObject
 * @property {T} data
 * @property {string} message
 * @property {number} status
 */

/**
 * @template T
 * @typedef {Object} Pagination
 * @property {T[]} items
 * @property {number} pageCount
 * @property {number} pageNo
 * @property {number} pageSize
 * @property {number} totalCount
 */

/**
 * @typedef {Object} Role
 * @property {string} roleId
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} username
 * @property {boolean} isActive
 * @property {string} password
 * @property {string} email
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} username
 * @property {string} fullName
 */

/**
 * @typedef {Object} CartItem
 * @property {number} productVariantId
 * @property {string} productName
 * @property {string} size
 * @property {string} color
 * @property {number} quantity
 * @property {string} imagePath
 * @property {number} price
 * @property {number} discountedPrice
 * @property {boolean} [isSelected]
 */

/**
 * @typedef {Object} CartResponse
 * @property {CartItem[]} data
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @typedef {Object} EditCart
 * @property {number} productVariantId
 * @property {number} quantityChange
 */

/**
 * @typedef {Object} DateOfBirth
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {number} dayOfWeek
 * @property {number} dayOfYear
 * @property {number} dayNumber
 */

/**
 * @typedef {Object} Profile
 * @property {number} accountId
 * @property {string} fullName
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} address
 * @property {string} [imagePath]
 * @property {string} createdDate
 * @property {string} lastLoginDate
 * @property {boolean} isActive
 * @property {number} loyaltyPoints
 * @property {string} membershipLevel
 * @property {string} dateOfBirth
 * @property {string} gender
 * @property {string} customerType
 * @property {string} preferredPaymentMethod
 */

/**
 * @typedef {Object} ProfileResponse
 * @property {Profile} data
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @typedef {Object} EditProfileRequest
 * @property {string} fullName
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} address
 * @property {string} [imagePath]
 * @property {string} dateOfBirth
 * @property {string} gender
 * @property {string} customerType
 * @property {string} preferredPaymentMethod
 */
/**
 * @typedef {Object} EditProfileResponse
 * @property {{ success: boolean, message: string }} data
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @typedef {Object} CheckoutRequest
 * @property {number} accountId
 * @property {number[]} selectedProductVariantIds
 */

/**
 * @typedef {Object} CheckoutItem
 * @property {number} productVariantId
 * @property {string} productName
 * @property {number} quantity
 * @property {string} imageUrl
 * @property {string} size
 * @property {string} color
 * @property {number} priceAtPurchase
 * @property {number} discountApplied
 */

/**
 * @typedef {Object} CheckoutStore
 * @property {number} storeId
 * @property {string} storeName
 * @property {string} storeDescription
 * @property {string} location
 * @property {number} managerId
 * @property {string} createdDate
 * @property {string} imagePath
 * @property {string} storeEmail
 * @property {string} storePhone
 * @property {string} operatingHours
 */

/**
 * @typedef {Object} CheckoutResponse
 * @property {string} checkOutSessionId
 * @property {number} subTotal
 * @property {number} shippingCost
 * @property {CheckoutStore[]} availableStores
 * @property {string[]} availablePaymentMethods
 * @property {ShippingAddress[]} shippingAddresses
 * @property {ShippingAddress} shippingAddress
 * @property {CheckoutItem[]} items
 */

/**
 * @typedef {Object} CreateOrderRequest
 * @property {number} accountId
 * @property {string} checkOutSessionId
 * @property {number} shippingAddressId
 * @property {string} paymentMethod
 * @property {number} [storeId]
 */

/**
 * @typedef {Object} OrderItem
 * @property {number} productVariantId
 * @property {string} productName
 * @property {number} quantity
 * @property {string} imageUrl
 * @property {string} size
 * @property {string} color
 * @property {number} priceAtPurchase
 * @property {number} discountApplied
 */

/**
 * @typedef {Object} Order
 * @property {number} orderId
 * @property {string} status
 * @property {number} subTotal
 * @property {number} shippingCost
 * @property {string} paymentMethod
 * @property {string} paymentUrl
 * @property {number} storeId
 * @property {OrderItem[]} items
 */

/**
 * @typedef {Object} CreateOrderResponse
 * @property {Order} data
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @typedef {Object} GetOrdersResponse
 * @property {Order[]} data
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @typedef {Object} OrderDetailItem
 * @property {number} productVariantId
 * @property {string} productName
 * @property {number} quantity
 * @property {string} imageUrl
 * @property {string} size
 * @property {string} color
 * @property {number} priceAtPurchase
 * @property {number} discountApplied
 */

/**
 * @typedef {Object} StoreInfo
 * @property {number} storeId
 * @property {string} storeName
 * @property {string} storeDescription
 * @property {string} location
 * @property {string} imagePath
 * @property {string} storeEmail
 * @property {string} storePhone
 */

/**
 * @typedef {Object} OrderDetailData
 * @property {number} orderId
 * @property {string} fullName
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} address
 * @property {string} city
 * @property {string} district
 * @property {string} province
 * @property {string} country
 * @property {string} paymentMethod
 * @property {StoreInfo|null} store
 * @property {number} orderTotal
 * @property {number} shippingCost
 * @property {string} status
 * @property {string} createdDate
 * @property {OrderDetailItem[]} orderItems
 */

/**
 * @typedef {Object} GetOrderDetailResponse
 * @property {OrderDetailData} data
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @typedef {Object} GetReturnItemResponse
 * @property {ReturnData[]} data
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @typedef {Object} ReturnData
 * @property {number} orderDetailId
 * @property {number} productId
 * @property {number} productVariantId
 * @property {string} productName
 * @property {number} quantity
 * @property {string} imageUrl
 * @property {string} size
 * @property {string} color
 * @property {number} priceAtPurchase
 * @property {number} discountApplied
 */

/**
 * @typedef {Object} ReturnItems
 * @property {number} productVariantId
 * @property {string} productName
 * @property {string} color
 * @property {string} size
 * @property {string} imageUrl
 * @property {number} quantity
 * @property {number} price
 */

/**
 * @typedef {Object} RefundMethod
 * @property {string} refundMethod
 */

/**
 * @typedef {Object} ReturnReasons
 * @property {string} returnReasons
 */

/**
 * @typedef {Object} ReturnOptions
 * @property {string} returnOptions
 */

/**
 * @typedef {Object} MediaUrl
 * @property {string} mediaUrl
 */

/**
 * @typedef {Object} ReturnCheckOut
 * @property {string} returnCheckoutSessionId
 * @property {string} orderId
 * @property {string} accountId
 * @property {ReturnItems[]} returnItems
 * @property {number} totalRefundAmount
 * @property {RefundMethod[]} refundMethods
 * @property {ReturnReasons[]} returnReasons
 * @property {ReturnOptions[]} returnOptions
 * @property {string} email
 * @property {MediaUrl[]} mediaUrl
 * @property {string} returnDescription
 */

/**
 * @typedef {Object} SelectedItems
 * @property {number} productVariantId
 * @property {number} quantity
 */

/**
 * @typedef {Object} ReturnCheckOutResponse
 * @property {string} returnCheckoutSessionId
 * @property {number} orderId
 * @property {number} accountId
 * @property {Array<{ productVariantId: number, productName: string, color: string, size: string, imageUrl: string, quantity: number, price: number }>} returnItems
 * @property {number} totalRefundAmount
 * @property {string[]} refundMethods
 * @property {string[]} returnReasons
 * @property {string[]} returnOptions
 * @property {string} returnDescription
 * @property {string[]} mediaUrls
 * @property {string} email
 */

/**
 * @typedef {Object} CreateCheckoutRequest
 * @property {string} orderId
 * @property {number} accountId
 * @property {Array<{ productVariantId: number, quantity?: number }>} selectedItems
 */

/**
 * @typedef {Object} SubmitReturnRequest
 * @property {string} returnCheckoutSessionId
 * @property {string} email
 * @property {string} returnReason
 * @property {string} returnOption
 * @property {string} [refundMethod]
 * @property {string} [returnDescription]
 * @property {string} bankName
 * @property {string} bankAccountName
 * @property {string} bankAccountNumber
 * @property {File[]} mediaFiles
 */

/**
 * @typedef {Object} SubmitReturnResponse
 * @property {{ returnOrderId: number, status: string }} data
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @typedef {Object} CreateFeedbackRequest
 * @property {number} [orderDetailId]
 * @property {number} accountId
 * @property {number} productId
 * @property {string} [Title]
 * @property {number} [rating]
 * @property {string} [comment]
 * @property {string} [createdDate]
 * @property {string} [imageFile]
 */

/**
 * @typedef {Object} CreateFeedbackResponse
 * @property {{ feedbackId: number, status: string }} data
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @typedef {Object} FavoriteProduct
 * @property {number} productId
 * @property {string} name
 * @property {string} imagePath
 * @property {number} price
 * @property {number} discountedPrice
 * @property {string} categoryName
 * @property {string} promotionTitle
 * @property {boolean} isFavorite
 */

/**
 * @typedef {Object} FavoriteProductResponse
 * @property {FavoriteProduct[]} data
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @typedef {Object} NotificationItem
 * @property {number} notificationId
 * @property {string} title
 * @property {string} content
 * @property {boolean} isRead
 * @property {string} createdDate
 */

/**
 * @typedef {Object} NotificationResponse
 * @property {NotificationItem[]} data
 * @property {boolean} status
 * @property {string} message
 */
 
// Bạn có thể export một đối tượng rỗng hoặc các typedef này nếu cần dùng trong IDE.
// Chúng chỉ phục vụ cho mục đích tài liệu và hỗ trợ kiểm tra kiểu khi dùng JSDoc.
module.exports = {};