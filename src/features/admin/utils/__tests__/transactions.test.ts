import {
  formatVND,
  getPlanKindLabel,
  getTransactionStatusConfig,
  getTransactionTypeLabel,
  getUserDisplayName,
  TRANSACTION_STATUS_OPTIONS,
} from '../transactions';
import type {
  TransactionStatus,
  TransactionUserBrief,
} from '../../types/transactions';

describe('transactions utils', () => {
  describe('getTransactionStatusConfig', () => {
    const allStatuses: TransactionStatus[] = [
      'pending',
      'success',
      'failed_legacy',
      'creating',
      'reconciliation_required',
      'reconciling',
      'creation_failed',
      'cancelled',
      'expired',
      'investigation_required',
      'refunded',
    ];

    it.each(allStatuses)('trả về label và className tiếng Việt cho trạng thái %s', (status) => {
      const config = getTransactionStatusConfig(status);
      expect(config).toBeDefined();
      expect(config.label).toBeTruthy();
      expect(typeof config.label).toBe('string');
      expect(config.className).toBeTruthy();
      expect(config.variant).toBeTruthy();
    });

    it('trả về nhãn cụ thể cho reconciliation_required', () => {
      const config = getTransactionStatusConfig('reconciliation_required');
      expect(config.label).toBe('Cần đối soát');
      expect(config.className).toContain('purple');
    });

    it('trả về nhãn cụ thể cho success', () => {
      const config = getTransactionStatusConfig('success');
      expect(config.label).toBe('Thành công');
      expect(config.className).toContain('emerald');
    });

    it('fallback hợp lý khi gặp trạng thái không xác định', () => {
      const config = getTransactionStatusConfig('unknown_status');
      expect(config.label).toBe('unknown_status');
      expect(config.variant).toBe('outline');
    });

    it('fallback khi status rỗng hoặc null', () => {
      const config = getTransactionStatusConfig(null);
      expect(config.label).toBe('Không xác định');
      expect(config.variant).toBe('outline');
    });
  });

  describe('getTransactionTypeLabel', () => {
    it('map đúng loại direct_purchase thành Mua gói', () => {
      expect(getTransactionTypeLabel('direct_purchase')).toBe('Mua gói');
    });

    it('map đúng loại wallet_topup thành Nạp ví', () => {
      expect(getTransactionTypeLabel('wallet_topup')).toBe('Nạp ví');
    });

    it('fallback hiển thị chuỗi gốc khi không khớp', () => {
      expect(getTransactionTypeLabel('REFUND')).toBe('REFUND');
      expect(getTransactionTypeLabel('')).toBe('—');
      expect(getTransactionTypeLabel(undefined)).toBe('—');
    });
  });

  describe('getUserDisplayName', () => {
    const baseUser: TransactionUserBrief = {
      id: 'user-1',
      username: 'khachhang',
      email: 'khachhang@example.com',
      firstName: 'Nguyễn',
      lastName: 'An',
    };

    it('ghép họ và tên khi có đủ', () => {
      expect(getUserDisplayName(baseUser)).toBe('Nguyễn An');
    });

    it('chỉ có tên thì không để khoảng trắng thừa', () => {
      expect(getUserDisplayName({ ...baseUser, lastName: null })).toBe('Nguyễn');
      expect(getUserDisplayName({ ...baseUser, firstName: null, lastName: 'An' })).toBe('An');
    });

    it('fallback về username khi thiếu họ tên', () => {
      expect(getUserDisplayName({ ...baseUser, firstName: null, lastName: null })).toBe('khachhang');
    });

    it('fallback về email khi thiếu cả họ tên và username', () => {
      expect(
        getUserDisplayName({ ...baseUser, firstName: null, lastName: null, username: '' }),
      ).toBe('khachhang@example.com');
    });

    it('trả null khi không có nhãn người dùng (list item hoặc tài khoản đã xoá)', () => {
      expect(getUserDisplayName(null)).toBeNull();
      expect(getUserDisplayName(undefined)).toBeNull();
      expect(
        getUserDisplayName({
          id: 'user-1',
          username: '',
          email: null,
          firstName: null,
          lastName: null,
        }),
      ).toBeNull();
    });
  });

  describe('getPlanKindLabel', () => {
    it('map đúng ba loại gói', () => {
      expect(getPlanKindLabel(0)).toBe('Miễn phí');
      expect(getPlanKindLabel(1)).toBe('Có thời hạn');
      expect(getPlanKindLabel(2)).toBe('Vĩnh viễn');
    });

    it('fallback "—" cho giá trị lạ hoặc thiếu', () => {
      expect(getPlanKindLabel(99)).toBe('—');
      expect(getPlanKindLabel(null)).toBe('—');
      expect(getPlanKindLabel(undefined)).toBe('—');
    });
  });

  describe('formatVND', () => {
    it('định dạng số tiền VND chuẩn xác', () => {
      expect(formatVND(100000)).toContain('100.00');
      expect(formatVND(0)).toContain('0');
    });
  });

  describe('TRANSACTION_STATUS_OPTIONS', () => {
    it('chứa 11 tùy chọn trạng thái', () => {
      expect(TRANSACTION_STATUS_OPTIONS.length).toBe(11);
      const values = TRANSACTION_STATUS_OPTIONS.map((opt) => opt.value);
      expect(values).toContain('reconciliation_required');
      expect(values).toContain('success');
      expect(values).toContain('creating');
      expect(values).toContain('creation_failed');
    });
  });
});
