import MockAdapter from 'axios-mock-adapter';
import api from '@/lib/axios';
import { brandDashboardApi } from './brand-dashboard.api';
import type { BrandDynamicQueryRequest } from '../types';

const mock = new MockAdapter(api);

afterEach(() => {
  mock.reset();
});

describe('brandDashboardApi', () => {
  it('gửi đúng brandId và unwrap KPI response', async () => {
    const payload = {
      brandId: 'brand-1',
      totalMembers: 12,
      pointsIssued: 30,
    };
    mock.onGet('/brand/dashboard/kpi-cards').reply(200, { data: payload });

    await expect(brandDashboardApi.getKPICards('brand-1')).resolves.toEqual(
      payload,
    );
    expect(mock.history.get[0].params).toEqual({ brandId: 'brand-1' });
  });

  it('giữ nguyên body Dynamic Query theo contract', async () => {
    const request: BrandDynamicQueryRequest = {
      targetDashboard: 'brand',
      brandId: 'brand-1',
      metrics: [
        'total_members',
        'points_issued',
        'points_redeemed',
        'active_vouchers',
      ],
      timeframe: {
        fromDate: '2026-06-24',
        toDate: '2026-07-24',
      },
      granularity: 'day',
      compareWithPrevious: false,
    };
    const response = {
      targetDashboard: 'brand',
      granularity: 'day',
      series: [],
    };
    mock.onPost('/dashboard/analytics/query').reply(200, { data: response });

    await expect(brandDashboardApi.queryAnalytics(request)).resolves.toEqual(
      response,
    );
    expect(JSON.parse(mock.history.post[0].data)).toEqual(request);
  });

  it('gửi brandId, itemId và pagination khi lấy feedback', async () => {
    const response = {
      items: [],
      metadata: {
        page: 2,
        limit: 20,
        totalPages: 0,
        totalItems: 0,
      },
    };
    mock
      .onGet('/brand/dashboard/drilldown/sample-lab-feedbacks')
      .reply(200, { data: response });

    await expect(
      brandDashboardApi.getSampleFeedbacks({
        brandId: 'brand-1',
        itemId: 'sample-1',
        page: 2,
        limit: 20,
      }),
    ).resolves.toEqual(response);
    expect(mock.history.get[0].params).toEqual({
      brandId: 'brand-1',
      itemId: 'sample-1',
      page: 2,
      limit: 20,
    });
  });

  it('trả null khi API thành công nhưng không có data', async () => {
    mock
      .onGet('/brand/dashboard/financials/points-liability')
      .reply(200, {});

    await expect(
      brandDashboardApi.getPointsLiability('brand-1'),
    ).resolves.toBeNull();
  });
});
