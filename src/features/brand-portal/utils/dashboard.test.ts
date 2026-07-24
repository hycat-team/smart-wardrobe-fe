import {
  BRAND_DASHBOARD_MAX_DATE_RANGE_DAYS,
  buildBrandAnalyticsRequest,
  formatBrandDashboardDateTime,
  formatBrandVND,
  normalizeBrandDashboardFilters,
  selectEffectiveSampleId,
} from './dashboard';

describe('Brand Dashboard utilities', () => {
  const now = new Date(2026, 6, 24, 10, 30);

  it('giữ khoảng ngày hợp lệ và chuẩn hóa pagination', () => {
    expect(
      normalizeBrandDashboardFilters(
        {
          fromDate: '2026-07-01',
          toDate: '2026-07-24',
          sampleId: ' sample-1 ',
          feedbackPage: '3',
          insightTab: 'operations',
        },
        now,
      ),
    ).toEqual({
      fromDate: '2026-07-01',
      toDate: '2026-07-24',
      sampleId: 'sample-1',
      feedbackPage: 3,
      insightTab: 'operations',
    });
  });

  it.each([
    ['ngày tương lai', { fromDate: '2026-07-01', toDate: '2026-07-25' }],
    ['ngày đảo thứ tự', { fromDate: '2026-07-20', toDate: '2026-07-01' }],
    [
      `quá ${BRAND_DASHBOARD_MAX_DATE_RANGE_DAYS} ngày`,
      { fromDate: '2024-07-01', toDate: '2026-07-24' },
    ],
    ['sai định dạng', { fromDate: '01-07-2026', toDate: '2026-07-24' }],
  ])('fallback khoảng mặc định khi %s', (_, params) => {
    const result = normalizeBrandDashboardFilters(params, now);
    expect(result).toMatchObject({
      fromDate: '2026-06-24',
      toDate: '2026-07-24',
      feedbackPage: 1,
    });
  });

  it('tạo đúng request Brand Dynamic Query và không thêm field dự phòng', () => {
    const request = buildBrandAnalyticsRequest('brand-1', {
      fromDate: '2026-07-01',
      toDate: '2026-07-24',
    });

    expect(request).toEqual({
      targetDashboard: 'brand',
      brandId: 'brand-1',
      metrics: [
        'total_members',
        'points_issued',
        'points_redeemed',
        'active_vouchers',
        'new_customers',
        'customer_claim_rate',
        'benefit_redemption_count',
        'brand_item_count',
        'brand_item_count_by_type',
      ],
      timeframe: {
        fromDate: '2026-07-01',
        toDate: '2026-07-24',
      },
      granularity: 'day',
      compareWithPrevious: false,
    });
    expect(request).not.toHaveProperty('filters');
    expect(request).not.toHaveProperty('groupBy');
  });

  it('chọn sample hợp lệ hoặc fallback sample đầu tiên', () => {
    const samples = [
      { id: 'sample-1', name: 'One', itemType: 'sample' },
      { id: 'sample-2', name: 'Two', itemType: 'sample' },
    ];
    expect(selectEffectiveSampleId('sample-2', samples)).toBe('sample-2');
    expect(selectEffectiveSampleId('missing', samples)).toBe('sample-1');
    expect(selectEffectiveSampleId('missing', [])).toBe('');
  });

  it('format VND, zero và thời gian không hợp lệ an toàn', () => {
    expect(formatBrandVND(0)).toContain('0');
    expect(formatBrandVND(1250000)).toContain('1.250.000');
    expect(formatBrandDashboardDateTime('not-a-date')).toBe('Chưa cập nhật');
  });
});
