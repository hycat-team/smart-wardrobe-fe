import { WardrobeItemStatus } from '../types';

/**
 * Mã lý do cần rà soát danh mục từ AI
 */
export type AnalyzeReviewReason = 'uncertain_category';

/**
 * Mã lý do phân tích ảnh thất bại từ AI
 */
export type AnalyzeErrorReason =
  | 'no_fashion_item_detected'
  | 'multiple_items_detected'
  | 'full_body_outfit_detected'
  | 'analysis_temporary_error'
  | 'auto_retry_exceeded'
  | string;

/**
 * Bảng ánh xạ mã lý do sang thông điệp tiếng Việt thân thiện với người dùng
 */
export const ANALYSIS_REASON_MESSAGES: Record<string, string> = {
  no_fashion_item_detected: 'Ảnh không phải trang phục — hãy tải ảnh đúng món đồ',
  multiple_items_detected: 'Ảnh có nhiều món — tải ảnh khác',
  full_body_outfit_detected: 'Ảnh toàn thân — tải ảnh cận một món',
  uncertain_category: 'AI chưa chắc danh mục — chọn danh mục rồi gửi phân tích lại',
  analysis_temporary_error: 'Lỗi tạm thời — thử lại',
  auto_retry_exceeded: 'Đã thử nhiều lần — thử lại',
};

export const DEFAULT_ANALYSIS_ERROR_MESSAGE =
  'AI chưa thể nhận diện trang phục này. Vui lòng thử lại hoặc tải ảnh khác.';

/**
 * Lấy thông điệp giải thích thân thiện từ mã lý do phân tích
 */
export function getAnalysisErrorMessage(reason?: string | null): string {
  if (!reason) return DEFAULT_ANALYSIS_ERROR_MESSAGE;
  const normalizedReason = String(reason).trim();
  return ANALYSIS_REASON_MESSAGES[normalizedReason] || DEFAULT_ANALYSIS_ERROR_MESSAGE;
}

/**
 * Kiểm tra xem lỗi phân tích có phải do ảnh không hợp lệ hay không
 * (Ảnh không phải trang phục, nhiều món, hoặc toàn thân)
 */
export function isInvalidImageError(reason?: string | null): boolean {
  if (!reason) return false;
  const normalized = String(reason).trim();
  return (
    normalized === 'no_fashion_item_detected' ||
    normalized === 'multiple_items_detected' ||
    normalized === 'full_body_outfit_detected'
  );
}

/**
 * Kiểm tra xem món đồ có được phép thực hiện hành động "Thử lại" hay không.
 * - Ảnh không hợp lệ (đa món/toàn thân/không phải trang phục) -> KHÔNG cho retry.
 * - Lỗi tạm thời (analysis_temporary_error, auto_retry_exceeded) -> CHO PHÉP retry.
 * - Cần rà soát (NeedsReview / uncertain_category) -> CHO PHÉP retry (bắt buộc kèm categoryId).
 * - Đang xử lý hoặc đã hoàn tất -> KHÔNG cho retry.
 */
export function canRetryWardrobeAnalysis(
  status?: number | string | null,
  reason?: string | null,
): boolean {
  // Normalize numeric or string status
  const numericStatus =
    typeof status === 'number'
      ? status
      : status === 'Processing' || status === 'processing'
        ? 3
        : status === 'Failed' || status === 'failed'
          ? 4
          : status === 'NeedsReview' || status === 'needs_review' || status === 'needsReview'
            ? 5
            : status === 'InWardrobe' || status === 'inWardrobe'
              ? 0
              : null;

  if (numericStatus === WardrobeItemStatus.NeedsReview) {
    return true;
  }

  if (numericStatus === WardrobeItemStatus.Failed) {
    if (isInvalidImageError(reason)) {
      return false;
    }
    if (
      reason === 'analysis_temporary_error' ||
      reason === 'auto_retry_exceeded'
    ) {
      return true;
    }
    // Mặc định với mã lỗi lạ trong failed, không cho retry vô hạn trừ khi xác định được lỗi tạm thời
    return false;
  }

  return false;
}

/**
 * Lấy thông điệp giải thích cho trạng thái rà soát danh mục
 */
export function getAnalysisReviewMessage(reason?: string | null): string {
  if (!reason) return ANALYSIS_REASON_MESSAGES.uncertain_category;
  const normalized = String(reason).trim();
  return ANALYSIS_REASON_MESSAGES[normalized] || ANALYSIS_REASON_MESSAGES.uncertain_category;
}

