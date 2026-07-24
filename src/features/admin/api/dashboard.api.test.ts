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
});
