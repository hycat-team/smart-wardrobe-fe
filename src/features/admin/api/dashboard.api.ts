import api from '@/lib/axios';
import type { APIResponse } from '@/types/api';
import type {
  AIErrorBreakdown,
  AIEventList,
  AIEventQuery,
  AIUsageByOperation,
  AIMarginAnalytics,
  AdminOverview,
  DashboardFilters,
  DynamicQueryRequest,
  DynamicQueryResponse,
  RenewalStats,
  RevenueBreakdown,
  SubscriptionDistribution,
} from '../types';

const unwrap = <T>(response: { data: APIResponse<T> }): T | null =>
  response.data.data ?? null;

export const dashboardApi = {
  getOverview: async (): Promise<AdminOverview | null> => {
    const response = await api.get<APIResponse<AdminOverview>>(
      '/admin/dashboard/overview',
    );
    return unwrap(response);
  },

  getAIMargin: async ({
    fromDate,
    toDate,
  }: Pick<DashboardFilters, 'fromDate' | 'toDate'>): Promise<AIMarginAnalytics | null> => {
    const response = await api.get<APIResponse<AIMarginAnalytics>>(
      '/admin/dashboard/ai-margin',
      { params: { fromDate, toDate } },
    );
    return unwrap(response);
  },

  queryAnalytics: async (
    request: DynamicQueryRequest,
  ): Promise<DynamicQueryResponse | null> => {
    const response = await api.post<APIResponse<DynamicQueryResponse>>(
      '/dashboard/analytics/query',
      request,
    );
    return unwrap(response);
  },

  getSubscriptionDistribution: async (): Promise<SubscriptionDistribution | null> => {
    const response = await api.get<APIResponse<SubscriptionDistribution>>(
      '/admin/dashboard/subscriptions/distribution',
    );
    return unwrap(response);
  },

  getRevenueBreakdown: async ({
    fromDate,
    toDate,
  }: Pick<DashboardFilters, 'fromDate' | 'toDate'>): Promise<RevenueBreakdown | null> => {
    const response = await api.get<APIResponse<RevenueBreakdown>>(
      '/admin/dashboard/subscriptions/revenue-breakdown',
      { params: { fromDate, toDate } },
    );
    return unwrap(response);
  },

  getAIUsageByOperation: async ({
    fromDate,
    toDate,
  }: Pick<DashboardFilters, 'fromDate' | 'toDate'>): Promise<AIUsageByOperation | null> => {
    const response = await api.get<APIResponse<AIUsageByOperation>>(
      '/admin/dashboard/ai/usage-by-operation',
      { params: { fromDate, toDate } },
    );
    return unwrap(response);
  },

  getAIErrorBreakdown: async (): Promise<AIErrorBreakdown | null> => {
    const response = await api.get<APIResponse<AIErrorBreakdown>>(
      '/admin/dashboard/ai/error-breakdown',
    );
    return unwrap(response);
  },

  getRenewalStats: async (): Promise<RenewalStats | null> => {
    const response = await api.get<APIResponse<RenewalStats>>(
      '/admin/dashboard/subscriptions/renewal-stats',
    );
    return unwrap(response);
  },
  getAIEvents: async (params: AIEventQuery): Promise<AIEventList | null> => {
    const response = await api.get<APIResponse<AIEventList>>(
      '/admin/dashboard/drilldown/ai-events',
      { params },
    );
    return unwrap(response);
  },
};
