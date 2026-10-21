import {
  buildAdminAnalyticsRequest,
  daysAgoVN,
  getDefaultDashboardDateRange,
  getPlanColor,
  getPresetDateRange,
  normalizeDashboardFilters,
  safePercentage,
  startOfMonthVN,
  todayVN,
} from './dashboard';

describe('dashboard utils', () => {
  const now = new Date(2026, 6, 23, 12, 0, 0); // 2026-07-23 12:00:00

  it('tạo khoảng ngày mặc định tháng này (01 đến hôm nay) theo giờ Việt Nam', () => {
    expect(getDefaultDashboardDateRange(now)).toEqual({
      fromDate: '2026-07-01',
      toDate: '2026-07-23',
    });
  });

  describe('tiện ích ngày giờ Việt Nam & presets', () => {
    it('todayVN trả về ngày hôm nay định dạng YYYY-MM-DD theo giờ VN', () => {
      expect(todayVN(now)).toBe('2026-07-23');
    });

    it('startOfMonthVN trả về ngày đầu tháng YYYY-MM-01 theo giờ VN', () => {
      expect(startOfMonthVN(now)).toBe('2026-07-01');
    });

    it('daysAgoVN trả về ngày lùi N ngày theo giờ VN', () => {
      expect(daysAgoVN(0, now)).toBe('2026-07-23');
      expect(daysAgoVN(1, now)).toBe('2026-07-22');
      expect(daysAgoVN(29, now)).toBe('2026-06-24');
    });

    it('getPresetDateRange tạo đúng các khoảng preset', () => {
      expect(getPresetDateRange('today', now)).toEqual({
        fromDate: '2026-07-23',
        toDate: '2026-07-23',
      });
      expect(getPresetDateRange('this_month', now)).toEqual({
        fromDate: '2026-07-01',
        toDate: '2026-07-23',
      });
      expect(getPresetDateRange('last_30_days', now)).toEqual({
        fromDate: '2026-06-24',
        toDate: '2026-07-23',
      });
    });
  });

  it('giữ URL filter hợp lệ và chuẩn hóa pagination', () => {
    expect(
      normalizeDashboardFilters(
        {
          fromDate: '2026-07-01',
          toDate: '2026-07-23',
          aiStatus: 'FAILED',
          aiPage: '3',
          insightTab: 'ai',
        },
        now
      )
    ).toEqual({
      preset: 'this_month',
      fromDate: '2026-07-01',
      toDate: '2026-07-23',
      aiStatus: 'FAILED',
      aiPage: 3,
      insightTab: 'ai',
    });
  });

  it('không fallback im lặng - bảo lưu input người dùng để giao diện & API hiển thị lỗi 400', () => {
    const invalidRange = { fromDate: '2026-07-24', toDate: '2026-07-23' };
    const result = normalizeDashboardFilters(invalidRange, now);
    expect(result.fromDate).toBe('2026-07-24');
    expect(result.toDate).toBe('2026-07-23');
  });

  it('fallback về mặc định Tháng này khi không truyền fromDate hoặc toDate', () => {
    const emptyResult = normalizeDashboardFilters({}, now);
    expect(emptyResult.preset).toBe('this_month');
    expect(emptyResult.fromDate).toBe('2026-07-01');
    expect(emptyResult.toDate).toBe('2026-07-23');
  });

  it('chỉ gửi 8 metric admin được backend hỗ trợ', () => {
    const filters = normalizeDashboardFilters({}, now);
    const request = buildAdminAnalyticsRequest(filters);

    expect(request).toEqual({
      targetDashboard: 'admin',
      metrics: [
        'total_users',
        'new_users',
        'active_users_dau',
        'ai_requests_count',
        'ai_error_count',
        'ai_error_rate',
        'subscription_revenue_vnd',
        'net_ai_margin_vnd',
      ],
      timeframe: {
        fromDate: '2026-07-01',
        toDate: '2026-07-23',
      },
      granularity: 'day',
      compareWithPrevious: false,
    });
  });

  it('không chia cho 0 khi tính phần trăm', () => {
    expect(safePercentage(2, 10)).toBe(20);
    expect(safePercentage(2, 0)).toBe(0);
  });

  describe('getPlanColor', () => {
    it('trả về màu amber nhất quán cho gói Premium', () => {
      expect(getPlanColor('premium-monthly', 0)).toBe('#d97706');
      expect(getPlanColor('PREMIUM_MONTHLY', 0)).toBe('#d97706');
      expect(getPlanColor('premium_monthly', 1)).toBe('#d97706');
      expect(getPlanColor('premium', 0)).toBe('#d97706');
    });

    it('trả về màu teal cho gói Free', () => {
      expect(getPlanColor('free', 0)).toBe('#0f766e');
      expect(getPlanColor('FREE', 1)).toBe('#0f766e');
    });

    it('trả về màu blue cho gói Premium Yearly', () => {
      expect(getPlanColor('premium-yearly', 0)).toBe('#2563eb');
      expect(getPlanColor('PREMIUM_YEARLY', 1)).toBe('#2563eb');
    });

    it('fallback màu theo index khi không xác định được mã gói', () => {
      expect(getPlanColor(undefined, 0)).toBe('#0f766e');
      expect(getPlanColor(undefined, 1)).toBe('#d97706');
      expect(getPlanColor('unknown-custom-plan', 2)).toBe('#2563eb');
    });
  });
});
