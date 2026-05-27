/**
 * Khung phản hồi chuẩn cho các API thành công (APIResponse)
 * Sử dụng Generic <T> để FE có thể truyền linh hoạt kiểu dữ liệu của cục data vào
 */
export interface APIResponse<T = any> {
  message?: string; // Thông báo từ hệ thống (có thể không có)
  data?: T;         // Dữ liệu nghiệp vụ trả về (Object, Array, String... tùy API)
}

/**
 * Khung phản hồi chuẩn khi API gặp lỗi (ErrorResponse)
 * Thường dùng để bắt trong catch block của Axios / Fetch hoặc React Query
 */
export interface ErrorResponse {
  status: number;   // Mã HTTP Status Code (ví dụ: 400, 401, 403, 429...)
  title?: string;   // Tên nhóm lỗi ngắn gọn (ví dụ: "Bad Request", "Conflict")
  detail?: string;  // Chi tiết nội dung lỗi bằng tiếng Việt để FE hiển thị lên UI
}