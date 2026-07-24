import { serverFetch } from '@/lib/server-fetch';
import type {
  AIEventList,
  AIMarginAnalytics,
  AdminOverview,
  DashboardInitialData,
  DashboardSearchParams,
  DynamicQueryResponse,
} from '@/features/admin/types';
import {
  buildAdminAnalyticsRequest,
  DASHBOARD_AI_EVENTS_LIMIT,
  hasCustomDashboardDateRange,
  normalizeDashboardFilters,
} from '@/features/admin/utils/dashboard';
import { DashboardClient } from './DashboardClient';

export default async function DashboardData({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  const params = await searchParams;
  const filters = normalizeDashboardFilters(params);
  const analyticsRequest = buildAdminAnalyticsRequest(filters);
  const eventParams = new URLSearchParams({
    page: String(filters.aiPage),
    limit: String(DASHBOARD_AI_EVENTS_LIMIT),
  });

  if (filters.aiStatus) {
    eventParams.set('status', filters.aiStatus);
  }

  const shouldFetchCustomMargin = hasCustomDashboardDateRange(filters);
  const marginParams = new URLSearchParams({
    fromDate: filters.fromDate,
    toDate: filters.toDate,
  });

  const [overview, analytics, aiEvents, customMargin] = await Promise.all([
    serverFetch<AdminOverview>('/admin/dashboard/overview', {
      cache: 'no-store',
    }),
    serverFetch<DynamicQueryResponse>('/dashboard/analytics/query', {
      method: 'POST',
      cache: 'no-store',
      body: JSON.stringify(analyticsRequest),
    }),
    serverFetch<AIEventList>(
      `/admin/dashboard/drilldown/ai-events?${eventParams.toString()}`,
      { cache: 'no-store' },
    ),
    shouldFetchCustomMargin
      ? serverFetch<AIMarginAnalytics>(
          `/admin/dashboard/ai-margin?${marginParams.toString()}`,
          { cache: 'no-store' },
        )
      : Promise.resolve(null),
  ]);

  const initialData: DashboardInitialData = {
    overview,
    aiMargin: shouldFetchCustomMargin
      ? customMargin
      : overview?.aiMargin ?? null,
    analytics,
    aiEvents,
  };

  return (
    <DashboardClient
      filters={filters}
      initialData={initialData}
      hasCustomDateRange={shouldFetchCustomMargin}
    />
  );
}
