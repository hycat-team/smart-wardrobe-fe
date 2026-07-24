import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { dashboardApi } from '../api/dashboard.api';
import {
  dashboardQueryKeys,
  useDashboardAIMargin,
  useDashboardAnalytics,
} from './dashboard.queries';
import type { DashboardFilters } from '../types';

jest.mock('../api/dashboard.api', () => ({
  dashboardApi: {
    getOverview: jest.fn(),
    getAIMargin: jest.fn(),
    queryAnalytics: jest.fn(),
    getAIEvents: jest.fn(),
  },
}));

const filters: DashboardFilters = {
  fromDate: '2026-07-01',
  toDate: '2026-07-23',
  aiStatus: '',
  aiPage: 1,
};

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
};

describe('dashboard queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('tạo query key ổn định theo URL filters', () => {
    expect(dashboardQueryKeys.aiMargin(filters)).toEqual([
      'admin-dashboard',
      'ai-margin',
      '2026-07-01',
      '2026-07-23',
    ]);
    expect(dashboardQueryKeys.aiEvents(filters)).toEqual([
      'admin-dashboard',
      'ai-events',
      '',
      1,
    ]);
  });

  it('không gọi AI margin riêng khi query bị disable', () => {
    renderHook(
      () => useDashboardAIMargin(filters, { enabled: false }),
      { wrapper: createWrapper() },
    );

    expect(dashboardApi.getAIMargin).not.toHaveBeenCalled();
  });

  it('dùng request admin hợp lệ cho analytics', async () => {
    (dashboardApi.queryAnalytics as jest.Mock).mockResolvedValue({
      targetDashboard: 'admin',
      granularity: 'day',
      series: [],
    });

    const { result } = renderHook(
      () => useDashboardAnalytics(filters),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(dashboardApi.queryAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        targetDashboard: 'admin',
        granularity: 'day',
        compareWithPrevious: false,
      }),
    );
  });
});
