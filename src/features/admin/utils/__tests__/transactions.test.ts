import {
  canRunReconciliationAction,
  formatVND,
  getAllowedReconciliationActions,
  getActionDisabledReason,
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

  // Ma trận nút thao tác: bản sao của `statusesForAction` bên BE
  // (payment_resolution_uc.go). Viết lại đầy đủ ở đây thay vì import từ code
  // đang test, để test là bản đặc tả chứ không phải bản sao của implementation.
  describe('getAllowedReconciliationActions', () => {
    const EXPECTED: Record<TransactionStatus, string[]> = {
      pending: ['resolve-paid', 'resolve-cancelled', 'retry-investigation'],
      creating: [
        'resolve-paid',
        'resolve-cancelled',
        'retry-investigation',
        'resolve-creation-failed',
      ],
      reconciling: ['resolve-paid', 'resolve-cancelled', 'retry-investigation'],
      reconciliation_required: [
        'resolve-paid',
        'resolve-cancelled',
        'retry-investigation',
        'resolve-creation-failed',
      ],
      investigation_required: [
        'resolve-paid',
        'resolve-cancelled',
        'retry-investigation',
        'resolve-creation-failed',
      ],
      cancelled: ['resolve-paid'],
      expired: ['resolve-paid'],
      failed_legacy: ['resolve-paid'],
      creation_failed: [],
      refunded: [],
      success: [],
      unknown: [],
    };

    it.each(Object.entries(EXPECTED))('trạng thái %s bật đúng các nút', (status, actions) => {
      expect(getAllowedReconciliationActions(status)).toEqual(actions);
    });

    it('trả rỗng khi chưa tải xong hoặc status null', () => {
      expect(getAllowedReconciliationActions(null)).toEqual([]);
      expect(getAllowedReconciliationActions(undefined)).toEqual([]);
      expect(getAllowedReconciliationActions('')).toEqual([]);
    });

    it('trả rỗng với status lạ ngoài 11 giá trị', () => {
      expect(getAllowedReconciliationActions('something_else')).toEqual([]);
    });
  });

  describe('canRunReconciliationAction', () => {
    it('chặn xác nhận thanh toán trên giao dịch đã hoàn tiền (tránh cấp quyền 2 lần)', () => {
      expect(canRunReconciliationAction('refunded', 'resolve-paid')).toBe(false);
    });

    it('cho phép xác nhận thanh toán trên giao dịch đã huỷ/hết hạn (cứu tiền về muộn)', () => {
      expect(canRunReconciliationAction('cancelled', 'resolve-paid')).toBe(true);
      expect(canRunReconciliationAction('expired', 'resolve-paid')).toBe(true);
      expect(canRunReconciliationAction('failed_legacy', 'resolve-paid')).toBe(true);
    });

    it('không cho huỷ/gửi lại đối soát trên giao dịch đã huỷ', () => {
      expect(canRunReconciliationAction('cancelled', 'resolve-cancelled')).toBe(false);
      expect(canRunReconciliationAction('cancelled', 'retry-investigation')).toBe(false);
    });

    it('chặn "tạo link thất bại" ngoài 3 trạng thái cho phép', () => {
      expect(canRunReconciliationAction('creating', 'resolve-creation-failed')).toBe(true);
      expect(canRunReconciliationAction('reconciliation_required', 'resolve-creation-failed')).toBe(true);
      expect(canRunReconciliationAction('investigation_required', 'resolve-creation-failed')).toBe(true);
      expect(canRunReconciliationAction('pending', 'resolve-creation-failed')).toBe(false);
      expect(canRunReconciliationAction('reconciling', 'resolve-creation-failed')).toBe(false);
    });

    it('khoá toàn bộ nút với success/creation_failed/unknown', () => {
      for (const status of ['success', 'creation_failed', 'unknown']) {
        expect(canRunReconciliationAction(status, 'resolve-paid')).toBe(false);
        expect(canRunReconciliationAction(status, 'resolve-cancelled')).toBe(false);
        expect(canRunReconciliationAction(status, 'retry-investigation')).toBe(false);
        expect(canRunReconciliationAction(status, 'resolve-creation-failed')).toBe(false);
      }
    });
  });

  describe('getActionDisabledReason', () => {
    it('trả rỗng khi nút đang bật', () => {
      expect(getActionDisabledReason('reconciliation_required', 'resolve-paid')).toBe('');
    });

    it('nêu lý do theo trạng thái khoá', () => {
      expect(getActionDisabledReason('success', 'resolve-paid')).toContain('đã thành công');
      expect(getActionDisabledReason('refunded', 'resolve-paid')).toContain('hoàn tiền');
      expect(getActionDisabledReason('creation_failed', 'resolve-paid')).toContain('link thanh toán');
      expect(getActionDisabledReason('cancelled', 'resolve-cancelled')).toContain('bị huỷ');
      expect(getActionDisabledReason('expired', 'retry-investigation')).toContain('hết hạn');
      expect(getActionDisabledReason('unknown', 'resolve-paid')).toContain('Không xác định');
    });

    it('nêu lý do riêng cho "tạo link thất bại" khi trạng thái khác vẫn cho thao tác', () => {
      expect(getActionDisabledReason('pending', 'resolve-creation-failed')).toContain(
        'đang tạo link',
      );
    });

    it('báo đang tải khi chưa có trạng thái', () => {
      expect(getActionDisabledReason(null, 'resolve-paid')).toContain('Đang tải');
    });
  });
});
