// feedbackApi.js
import { post, get } from "../utils/axios"; // Điều chỉnh đường dẫn nếu cần

const FEEDBACK_ENDPOINT = {
  CREATE_FEEDBACK: "/feedback/create-multiple",
  GET_FEEDBACK_BY_PRODUCTID: "/feedback/productid/{id}"
};

class FeedbackService {
  /**
   * Gửi nhiều feedback cùng lúc.
   * @param {CreateFeedbackRequest[]} payload - Mảng các object feedback.
   * @returns {Promise} Promise trả về response từ axios, theo định dạng CreateFeedbackResponse.
   */
  createFeedback(payload) {
    // Gói mảng payload vào trong 1 object có key "feedbacks"
    const data = { feedbacks: payload };
    console.log("Payload to submit:", data);
    return post(FEEDBACK_ENDPOINT.CREATE_FEEDBACK, data);
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
