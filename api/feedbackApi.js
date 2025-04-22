// feedbackApi.js
import { postMultipart, get } from "../utils/axios"; // Điều chỉnh đường dẫn nếu cần

const FEEDBACK_ENDPOINT = {
  CREATE_FEEDBACK: "/feedback/create-multiple",
  GET_FEEDBACK_BY_PRODUCTID: "/feedback/productid/{id}"
};

class FeedbackService {
   /**
   * Gửi nhiều feedback cùng lúc bằng FormData.
   * @param {Array<Object>} payload - Mảng các feedback object:
   *   { orderDetailId, accountId, productId, rating, comment, createdDate, imageFile? }
   */
   createFeedback(payload) {
    const formData = new FormData();

    payload.forEach((fb, idx) => {
      if (fb.orderDetailId != null) {
        formData.append(`feedbacks[${idx}].orderDetailId`, fb.orderDetailId.toString());
      }
      formData.append(`feedbacks[${idx}].accountId`, fb.accountId.toString());
      formData.append(`feedbacks[${idx}].productId`, fb.productId.toString());

      // Nếu bạn có Title trong object, bỏ vào
      if (fb.Title) {
        formData.append(`feedbacks[${idx}].Title`, fb.Title);
      }

      formData.append(`feedbacks[${idx}].rating`, fb.rating.toString());
      formData.append(`feedbacks[${idx}].comment`, fb.comment);
      formData.append(`feedbacks[${idx}].createdDate`, fb.createdDate);

      // Chỉ append file nếu có
      if (fb.imageFile) {
        formData.append(`feedbacks[${idx}].imageFile`, {
          uri: fb.imageFile.uri,
          name: fb.imageFile.name,
          type: fb.imageFile.type,
        });
      }
    });

    // Debug: xem payload đang gửi (dạng mảng JS) 
    console.log('Submitting FormData payload:', payload);

    // Gửi multipart/form-data
    return postMultipart(FEEDBACK_ENDPOINT.CREATE_FEEDBACK, formData);
  }
  /**
   * Lấy danh sách feedback của sản phẩm theo productId.
   * @param {number} productId - ID của sản phẩm.
   * @param {number} [pageIndex=1] - Số trang (mặc định 1).
   * @param {number} [pageSize=5] - Số feedback trên một trang (mặc định 5).
   * @returns {Promise} Promise trả về response theo FeedbackListResponse.
   */
  getFeedbackByProductId(productId, pageIndex = 1, pageSize = 5) {
    const url =
      FEEDBACK_ENDPOINT.GET_FEEDBACK_BY_PRODUCTID.replace("{id}", String(productId)) +
      `?page-index=${pageIndex}&page-size=${pageSize}`;
    return get(url);
  }
}

const feedbackService = new FeedbackService();
export default feedbackService;
