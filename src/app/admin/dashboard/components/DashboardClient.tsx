'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type {
  DashboardFilters,
  DashboardInitialData,
} from '@/features/admin/types';
import {
  useDashboardAIErrorBreakdown,
  useDashboardAIEvents,
  useDashboardAIMargin,
  useDashboardAIUsageByOperation,
  useDashboardAnalytics,
  useDashboardOverview,
  useDashboardPayOSReconciliation,
  useDashboardRenewalStats,
  useDashboardRevenueBreakdown,
  useDashboardSubscriptionDistribution,
} from '@/features/admin/queries/dashboard.queries';
import { DashboardToolbar } from './DashboardToolbar';
import { DashboardKpiGrid } from './DashboardKpiGrid';
import { AIMarginPanel } from './AIMarginPanel';
import { PayOSPanel } from './PayOSPanel';
import { DashboardTrendChart } from './DashboardTrendChart';
import { AIEventsTable } from './AIEventsTable';
import { DashboardInsights } from './DashboardInsights';

export function DashboardClient({
  filters,
  initialData,
}: {
  filters: DashboardFilters;
  initialData: DashboardInitialData;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const overviewQuery = useDashboardOverview(initialData.overview);
  const payosQuery = useDashboardPayOSReconciliation(filters, {
    initialData: initialData.payosReconciliation ?? initialData.overview?.payosReconcile,
  });
  const aiMarginQuery = useDashboardAIMargin(filters, {
    initialData: initialData.aiMargin,
  });
  const analyticsQuery = useDashboardAnalytics(
    filters,
    initialData.analytics,
  );
  const aiEventsQuery = useDashboardAIEvents(filters, initialData.aiEvents);

  const isSubscriptionTab = filters.insightTab === 'subscriptions';
  const subscriptionDistributionQuery = useDashboardSubscriptionDistribution(
    filters,
    {
      enabled: isSubscriptionTab,
      initialData: initialData.subscriptionDistribution,
    },
  );
  const revenueBreakdownQuery = useDashboardRevenueBreakdown(filters, {
    enabled: isSubscriptionTab,
    initialData: initialData.revenueBreakdown,
  });
  const renewalStatsQuery = useDashboardRenewalStats(filters, {
    enabled: isSubscriptionTab,
    initialData: initialData.renewalStats,
  });
  const aiUsageByOperationQuery = useDashboardAIUsageByOperation(filters, {
    enabled: !isSubscriptionTab,
    initialData: initialData.aiUsageByOperation,
  });
  const aiErrorBreakdownQuery = useDashboardAIErrorBreakdown(filters, {
    enabled: !isSubscriptionTab,
    initialData: initialData.aiErrorBreakdown,
  });
  const overview = overviewQuery.data;
  const aiMargin = aiMarginQuery.data ?? initialData.aiMargin;

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const refreshAll = async () => {
    const requests: Promise<unknown>[] = [
      overviewQuery.refetch(),
      payosQuery.refetch(),
      analyticsQuery.refetch(),
      aiEventsQuery.refetch(),
      aiMarginQuery.refetch(),
    ];
    if (isSubscriptionTab) {
      requests.push(
        subscriptionDistributionQuery.refetch(),
        revenueBreakdownQuery.refetch(),
        renewalStatsQuery.refetch(),
      );
    } else {
      requests.push(
        aiUsageByOperationQuery.refetch(),
        aiErrorBreakdownQuery.refetch(),
      );
    }
    await Promise.allSettled(requests);
  };

  const isRefreshing =
    overviewQuery.isFetching ||
    payosQuery.isFetching ||
    analyticsQuery.isFetching ||
    aiEventsQuery.isFetching ||
    aiMarginQuery.isFetching ||
    (isSubscriptionTab
      ? subscriptionDistributionQuery.isFetching ||
        revenueBreakdownQuery.isFetching ||
        renewalStatsQuery.isFetching
      : aiUsageByOperationQuery.isFetching || aiErrorBreakdownQuery.isFetching);

  const aiMarginIsLoading = aiMarginQuery.isLoading;
  const aiMarginIsFetching = aiMarginQuery.isFetching;
  const aiMarginError = aiMarginQuery.error;
  const retryAIMargin = aiMarginQuery.refetch;

  return (
    <div className="mx-auto flex w-full max-w-[1400px] animate-in flex-col gap-8 fade-in pb-24 text-foreground duration-500">
      <DashboardToolbar
        key={`${filters.preset}-${filters.fromDate}-${filters.toDate}`}
        filters={filters}
        updatedAt={overview?.kpiCards?.updatedAt}
        isRefreshing={isRefreshing}
        onApply={({ preset, fromDate, toDate }) =>
          updateParams({ preset, fromDate, toDate, aiPage: '1' })
        }
        onRefresh={() => void refreshAll()}
      />

      <DashboardKpiGrid
        data={overview?.kpiCards}
        isLoading={overviewQuery.isLoading}
        error={overviewQuery.error}
        onRetry={() => void overviewQuery.refetch()}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <AIMarginPanel
          data={aiMargin}
          isLoading={aiMarginIsLoading}
          isFetching={aiMarginIsFetching}
          error={aiMarginError}
          onRetry={() => void retryAIMargin()}
        />
        <PayOSPanel
          data={payosQuery.data ?? overview?.payosReconcile}
          isLoading={payosQuery.isLoading}
          error={payosQuery.error}
          fromDate={filters.fromDate}
          toDate={filters.toDate}
          onRetry={() => void payosQuery.refetch()}
        />
      </div>

      <DashboardTrendChart
        data={analyticsQuery.data}
        isLoading={analyticsQuery.isLoading}
        isFetching={analyticsQuery.isFetching}
        error={analyticsQuery.error}
        fromDate={filters.fromDate}
        toDate={filters.toDate}
        onRetry={() => void analyticsQuery.refetch()}
      />

      <DashboardInsights
        tab={filters.insightTab}
        onTabChange={(insightTab) => updateParams({ insightTab })}
        subscriptionDistribution={subscriptionDistributionQuery}
        revenueBreakdown={revenueBreakdownQuery}
        renewalStats={renewalStatsQuery}
        aiUsageByOperation={aiUsageByOperationQuery}
        aiErrorBreakdown={aiErrorBreakdownQuery}
      />
      <AIEventsTable
        filters={filters}
        data={aiEventsQuery.data}
        isLoading={aiEventsQuery.isLoading}
        isFetching={aiEventsQuery.isFetching}
        error={aiEventsQuery.error}
        onStatusChange={(aiStatus) =>
          updateParams({
            aiStatus: aiStatus || null,
            aiPage: '1',
          })
        }
        onPageChange={(aiPage) =>
          updateParams({ aiPage: String(aiPage) })
        }
        onRetry={() => void aiEventsQuery.refetch()}
      />
    </div>
  );
}
