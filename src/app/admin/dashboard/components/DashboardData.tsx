import { serverFetch } from '@/lib/server-fetch';
import type {
  AIErrorBreakdown,
  AIEventList,
  AIMarginAnalytics,
  AIUsageByOperation,
  AdminOverview,
  DashboardInitialData,
  DashboardSearchParams,
  DynamicQueryResponse,
  RenewalStats,
  RevenueBreakdown,
  SubscriptionDistribution,
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

  let subscriptionDistribution: SubscriptionDistribution | null | undefined;
  let revenueBreakdown: RevenueBreakdown | null | undefined;
  let renewalStats: RenewalStats | null | undefined;
  let aiUsageByOperation: AIUsageByOperation | null | undefined;
  let aiErrorBreakdown: AIErrorBreakdown | null | undefined;

  if (filters.insightTab === 'subscriptions') {
    [subscriptionDistribution, revenueBreakdown, renewalStats] =
      await Promise.all([
        serverFetch<SubscriptionDistribution>(
          '/admin/dashboard/subscriptions/distribution',
          { cache: 'no-store' },
        ),
        serverFetch<RevenueBreakdown>(
          '/admin/dashboard/subscriptions/revenue-breakdown',
          { cache: 'no-store' },
        ),
        serverFetch<RenewalStats>(
          '/admin/dashboard/subscriptions/renewal-stats',
          { cache: 'no-store' },
        ),
      ]);
  } else {
    [aiUsageByOperation, aiErrorBreakdown] = await Promise.all([
      serverFetch<AIUsageByOperation>(
        `/admin/dashboard/ai/usage-by-operation?${marginParams.toString()}`,
        { cache: 'no-store' },
      ),
      serverFetch<AIErrorBreakdown>(
        '/admin/dashboard/ai/error-breakdown',
        { cache: 'no-store' },
      ),
    ]);
  }
  const initialData: DashboardInitialData = {
    overview,
    aiMargin: shouldFetchCustomMargin
      ? customMargin
      : overview?.aiMargin ?? null,
    analytics,
    aiEvents,
    subscriptionDistribution,
    revenueBreakdown,
    renewalStats,
    aiUsageByOperation,
    aiErrorBreakdown,
  };

  return (
    <DashboardClient
      filters={filters}
      initialData={initialData}
      hasCustomDateRange={shouldFetchCustomMargin}
    />
  );
}
