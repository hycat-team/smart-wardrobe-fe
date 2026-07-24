import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import type {
  AIEventList,
  AIMarginAnalytics,
  AdminOverview,
  DashboardFilters,
  DynamicQueryResponse,
} from '../types';
import {
  buildAdminAnalyticsRequest,
  DASHBOARD_AI_EVENTS_LIMIT,
} from '../utils/dashboard';

const DASHBOARD_QUERY_OPTIONS = {
  staleTime: 60_000,
  refetchOnWindowFocus: 'always' as const,
};

export const dashboardQueryKeys = {
  all: ['admin-dashboard'] as const,
  overview: () => [...dashboardQueryKeys.all, 'overview'] as const,
  aiMargin: (filters: Pick<DashboardFilters, 'fromDate' | 'toDate'>) =>
    [...dashboardQueryKeys.all, 'ai-margin', filters.fromDate, filters.toDate] as const,
  analytics: (filters: Pick<DashboardFilters, 'fromDate' | 'toDate'>) =>
    [...dashboardQueryKeys.all, 'analytics', filters.fromDate, filters.toDate] as const,
  aiEvents: (filters: Pick<DashboardFilters, 'aiStatus' | 'aiPage'>) =>
    [...dashboardQueryKeys.all, 'ai-events', filters.aiStatus, filters.aiPage] as const,
};

export const useDashboardOverview = (initialData?: AdminOverview | null) =>
  useQuery({
    queryKey: dashboardQueryKeys.overview(),
    queryFn: dashboardApi.getOverview,
    initialData,
    ...DASHBOARD_QUERY_OPTIONS,
  });

export const useDashboardAIMargin = (
  filters: DashboardFilters,
  options?: {
    enabled?: boolean;
    initialData?: AIMarginAnalytics | null;
  },
) =>
  useQuery({
    queryKey: dashboardQueryKeys.aiMargin(filters),
    queryFn: () => dashboardApi.getAIMargin(filters),
    enabled: options?.enabled ?? true,
    initialData: options?.initialData,
    placeholderData: keepPreviousData,
    ...DASHBOARD_QUERY_OPTIONS,
  });

export const useDashboardAnalytics = (
  filters: DashboardFilters,
  initialData?: DynamicQueryResponse | null,
) =>
  useQuery({
    queryKey: dashboardQueryKeys.analytics(filters),
    queryFn: () => dashboardApi.queryAnalytics(buildAdminAnalyticsRequest(filters)),
    initialData,
    placeholderData: keepPreviousData,
    ...DASHBOARD_QUERY_OPTIONS,
  });

export const useDashboardAIEvents = (
  filters: DashboardFilters,
  initialData?: AIEventList | null,
) =>
  useQuery({
    queryKey: dashboardQueryKeys.aiEvents(filters),
    queryFn: () =>
      dashboardApi.getAIEvents({
        status: filters.aiStatus || undefined,
        page: filters.aiPage,
        limit: DASHBOARD_AI_EVENTS_LIMIT,
      }),
    initialData,
    placeholderData: keepPreviousData,
    ...DASHBOARD_QUERY_OPTIONS,
  });
