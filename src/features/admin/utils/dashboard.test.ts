import {
  buildAdminAnalyticsRequest,
  getDefaultDashboardDateRange,
  normalizeDashboardFilters,
  safePercentage,
} from './dashboard';

describe('dashboard utils', () => {
  const now = new Date(2026, 6, 23, 12, 0, 0);

  it('tạo khoảng ngày mặc định 30 ngày theo giờ cục bộ', () => {
    expect(getDefaultDashboardDateRange(now)).toEqual({
      fromDate: '2026-06-23',
      toDate: '2026-07-23',
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
        },
        now,
      ),
    ).toEqual({
      fromDate: '2026-07-01',
      toDate: '2026-07-23',
      aiStatus: 'FAILED',
      aiPage: 3,
    });
  });

  it.each([
    { fromDate: 'not-a-date', toDate: '2026-07-23' },
    { fromDate: '2026-07-24', toDate: '2026-07-23' },
    { fromDate: '2024-01-01', toDate: '2026-07-23' },
    { fromDate: '2026-07-01', toDate: '2026-07-24' },
  ])('fallback khi khoảng ngày không hợp lệ: %o', (params) => {
    const result = normalizeDashboardFilters(params, now);
    expect(result.fromDate).toBe('2026-06-23');
    expect(result.toDate).toBe('2026-07-23');
  });

  it('chỉ gửi 5 metric admin được backend hỗ trợ', () => {
    const filters = normalizeDashboardFilters({}, now);
    const request = buildAdminAnalyticsRequest(filters);

    expect(request).toEqual({
      targetDashboard: 'admin',
      metrics: [
        'total_users',
        'active_users_dau',
        'ai_requests_count',
        'subscription_revenue_vnd',
        'net_ai_margin_vnd',
      ],
      timeframe: {
        fromDate: '2026-06-23',
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
});
