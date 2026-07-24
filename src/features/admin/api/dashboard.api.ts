import api from '@/lib/axios';
import type { APIResponse } from '@/types/api';
import type {
  AIEventList,
  AIEventQuery,
  AIMarginAnalytics,
  AdminOverview,
  DashboardFilters,
  DynamicQueryRequest,
  DynamicQueryResponse,
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

  getAIEvents: async (params: AIEventQuery): Promise<AIEventList | null> => {
    const response = await api.get<APIResponse<AIEventList>>(
      '/admin/dashboard/drilldown/ai-events',
      { params },
    );
    return unwrap(response);
  },
};
