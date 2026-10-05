import {
  getAnalysisErrorMessage,
  isInvalidImageError,
  canRetryWardrobeAnalysis,
  DEFAULT_ANALYSIS_ERROR_MESSAGE,
} from './analysis-status';
import { WardrobeItemStatus } from '../types';

describe('analysis-status utility', () => {
  describe('getAnalysisErrorMessage', () => {
    it('ánh xạ chính xác mã no_fashion_item_detected (Delta 2026-10-01 / BC-1)', () => {
      expect(getAnalysisErrorMessage('no_fashion_item_detected')).toBe(
        'Ảnh không phải trang phục — hãy tải ảnh đúng món đồ',
      );
    });

    it('ánh xạ chính xác mã multiple_items_detected', () => {
      expect(getAnalysisErrorMessage('multiple_items_detected')).toBe(
        'Ảnh có nhiều món — tải ảnh khác',
      );
    });

    it('ánh xạ chính xác mã full_body_outfit_detected', () => {
      expect(getAnalysisErrorMessage('full_body_outfit_detected')).toBe(
        'Ảnh toàn thân — tải ảnh cận một món',
      );
    });

    it('ánh xạ chính xác mã uncertain_category', () => {
      expect(getAnalysisErrorMessage('uncertain_category')).toBe(
        'AI chưa chắc danh mục — chọn danh mục rồi gửi phân tích lại',
      );
    });

    it('ánh xạ chính xác mã analysis_temporary_error', () => {
      expect(getAnalysisErrorMessage('analysis_temporary_error')).toBe(
        'Lỗi tạm thời — thử lại',
      );
    });

    it('ánh xạ chính xác mã auto_retry_exceeded', () => {
      expect(getAnalysisErrorMessage('auto_retry_exceeded')).toBe(
        'Đã thử nhiều lần — thử lại',
      );
    });

    it('trả về thông điệp mặc định thân thiện cho mã lạ hoặc rỗng', () => {
      expect(getAnalysisErrorMessage('unknown_error_code')).toBe(
        DEFAULT_ANALYSIS_ERROR_MESSAGE,
      );
      expect(getAnalysisErrorMessage(null)).toBe(DEFAULT_ANALYSIS_ERROR_MESSAGE);
      expect(getAnalysisErrorMessage(undefined)).toBe(
        DEFAULT_ANALYSIS_ERROR_MESSAGE,
      );
    });
  });

  describe('isInvalidImageError', () => {
    it('trả về true cho nhóm ảnh không hợp lệ', () => {
      expect(isInvalidImageError('no_fashion_item_detected')).toBe(true);
      expect(isInvalidImageError('multiple_items_detected')).toBe(true);
      expect(isInvalidImageError('full_body_outfit_detected')).toBe(true);
    });

    it('trả về false cho nhóm lỗi kỹ thuật hoặc rà soát', () => {
      expect(isInvalidImageError('analysis_temporary_error')).toBe(false);
      expect(isInvalidImageError('auto_retry_exceeded')).toBe(false);
      expect(isInvalidImageError('uncertain_category')).toBe(false);
      expect(isInvalidImageError('unknown')).toBe(false);
      expect(isInvalidImageError(null)).toBe(false);
    });
  });

  describe('canRetryWardrobeAnalysis', () => {
    it('chặn nút Thử lại cho tất cả các mã ảnh không hợp lệ trong trạng thái Failed (BC-2)', () => {
      expect(
        canRetryWardrobeAnalysis(
          WardrobeItemStatus.Failed,
          'no_fashion_item_detected',
        ),
      ).toBe(false);
      expect(
        canRetryWardrobeAnalysis(
          WardrobeItemStatus.Failed,
          'multiple_items_detected',
        ),
      ).toBe(false);
      expect(
        canRetryWardrobeAnalysis(
          WardrobeItemStatus.Failed,
          'full_body_outfit_detected',
        ),
      ).toBe(false);
    });

    it('cho phép Thử lại cho các mã lỗi tạm thời trong trạng thái Failed', () => {
      expect(
        canRetryWardrobeAnalysis(
          WardrobeItemStatus.Failed,
          'analysis_temporary_error',
        ),
      ).toBe(true);
      expect(
        canRetryWardrobeAnalysis(
          WardrobeItemStatus.Failed,
          'auto_retry_exceeded',
        ),
      ).toBe(true);
    });

    it('cho phép Thử lại cho món ở trạng thái NeedsReview', () => {
      expect(
        canRetryWardrobeAnalysis(
          WardrobeItemStatus.NeedsReview,
          'uncertain_category',
        ),
      ).toBe(true);
    });

    it('không cho phép Thử lại khi đang Processing hoặc đã InWardrobe', () => {
      expect(canRetryWardrobeAnalysis(WardrobeItemStatus.Processing)).toBe(
        false,
      );
      expect(canRetryWardrobeAnalysis(WardrobeItemStatus.InWardrobe)).toBe(
        false,
      );
    });
  });
});
