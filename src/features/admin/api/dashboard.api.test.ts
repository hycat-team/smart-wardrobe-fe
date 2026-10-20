import MockAdapter from 'axios-mock-adapter';
import api from '@/lib/axios';
import { dashboardApi } from './dashboard.api';

describe('dashboardApi', () => {
  const mock = new MockAdapter(api);

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('unwrap overview từ APIResponse.data', async () => {
    const overview = {
      kpiCards: null,
      aiMargin: null,
      payosReconcile: null,
    };
    mock
      .onGet('/admin/dashboard/overview')
      .reply(200, { message: 'ok', data: overview });

    await expect(dashboardApi.getOverview()).resolves.toEqual(overview);
  });

  it('gửi đúng khoảng ngày cho AI margin', async () => {
    mock.onGet('/admin/dashboard/ai-margin').reply((config) => {
      expect(config.params).toEqual({
        fromDate: '2026-07-01',
        toDate: '2026-07-23',
      });
      return [200, { data: null }];
    });

    await dashboardApi.getAIMargin({
      fromDate: '2026-07-01',
      toDate: '2026-07-23',
    });
  });

  it('gửi đúng khoảng ngày cho PayOS reconciliation', async () => {
    const mockRecon = {
      totalCount: 10,
      totalSuccessValue: 500000,
      successCount: 8,
      failedCount: 1,
      reconciliationRequiredCount: 1,
      pendingCount: 0,
      voidedCount: 0,
    };
    mock.onGet('/admin/dashboard/payos-reconciliation').reply((config) => {
      expect(config.params).toEqual({
        fromDate: '2026-07-01',
        toDate: '2026-07-23',
      });
      return [200, { data: mockRecon }];
    });

    const result = await dashboardApi.getPayOSReconciliation({
      fromDate: '2026-07-01',
      toDate: '2026-07-23',
    });
    expect(result).toEqual(mockRecon);
  });

  it('gửi đúng body dynamic query', async () => {
    const request = {
      targetDashboard: 'admin' as const,
      metrics: ['total_users' as const],
      timeframe: {
        fromDate: '2026-07-01',
        toDate: '2026-07-23',
      },
      granularity: 'day' as const,
      compareWithPrevious: false as const,
    };
    mock.onPost('/dashboard/analytics/query').reply((config) => {
      expect(JSON.parse(config.data)).toEqual(request);
      return [200, { data: { targetDashboard: 'admin', granularity: 'day', series: [] } }];
    });

    await dashboardApi.queryAnalytics(request);
  });

  it('gửi status và pagination cho AI events', async () => {
    mock.onGet('/admin/dashboard/drilldown/ai-events').reply((config) => {
      expect(config.params).toEqual({
        status: 'FAILED',
        page: 2,
        limit: 20,
      });
      return [200, { data: { items: [], metadata: { page: 2, limit: 20, totalItems: 0, totalPages: 0 } } }];
    });

    await dashboardApi.getAIEvents({
      status: 'FAILED',
      page: 2,
      limit: 20,
    });
  });

  it.each([
    [
      'distribution',
      '/admin/dashboard/subscriptions/distribution',
      (filters?: any) => dashboardApi.getSubscriptionDistribution(filters),
    ],
    [
      'revenue breakdown',
      '/admin/dashboard/subscriptions/revenue-breakdown',
      (filters?: any) => dashboardApi.getRevenueBreakdown(filters),
    ],
    [
      'renewal stats',
      '/admin/dashboard/subscriptions/renewal-stats',
      (filters?: any) => dashboardApi.getRenewalStats(filters),
    ],
    [
      'AI error breakdown',
      '/admin/dashboard/ai/error-breakdown',
      (filters?: any) => dashboardApi.getAIErrorBreakdown(filters),
    ],
    [
      'AI usage by operation',
      '/admin/dashboard/ai/usage-by-operation',
      (filters?: any) => dashboardApi.getAIUsageByOperation(filters),
    ],
  ])('gửi khoảng ngày cho %s khi có filters', async (_label, endpoint, request) => {
    mock.onGet(endpoint).reply((config) => {
      expect(config.params).toEqual({
        fromDate: '2026-07-01',
        toDate: '2026-07-23',
      });
      return [200, { data: null }];
    });

    await request({ fromDate: '2026-07-01', toDate: '2026-07-23' });
  });

  it.each([
    [
      'distribution không có filter',
      '/admin/dashboard/subscriptions/distribution',
      () => dashboardApi.getSubscriptionDistribution(),
    ],
    [
      'revenue breakdown không có filter',
      '/admin/dashboard/subscriptions/revenue-breakdown',
      () => dashboardApi.getRevenueBreakdown(),
    ],
    [
      'renewal stats không có filter',
      '/admin/dashboard/subscriptions/renewal-stats',
      () => dashboardApi.getRenewalStats(),
    ],
    [
      'AI error breakdown không có filter',
      '/admin/dashboard/ai/error-breakdown',
      () => dashboardApi.getAIErrorBreakdown(),
    ],
  ])('không gửi params cho %s khi không truyền filters', async (_label, endpoint, request) => {
    mock.onGet(endpoint).reply((config) => {
      expect(config.params).toBeUndefined();
      return [200, { data: null }];
    });

    await request();
  });
});
