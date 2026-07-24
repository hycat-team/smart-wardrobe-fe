'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useBrandRole } from '@/features/brand-portal/context/BrandRoleContext';
import {
  useBrandDashboardAnalytics,
  useBrandDashboardKPICards,
  useBrandDashboardPointsLiability,
  useBrandDashboardSampleAnalytics,
  useBrandDashboardSampleFeedbacks,
  useBrandDashboardSamples,
} from '@/features/brand-portal/queries/brand-dashboard.queries';
import type {
  BrandDashboardFilters,
  BrandDashboardInitialData,
} from '@/features/brand-portal/types';
import {
  isBrandDashboardForbiddenError,
  selectEffectiveSampleId,
} from '@/features/brand-portal/utils/dashboard';
import { DashboardKpiGrid } from './DashboardKpiGrid';
import { DashboardToolbar } from './DashboardToolbar';
import { DashboardTrendChart } from './DashboardTrendChart';
import { PointsLiabilityPanel } from './PointsLiabilityPanel';
import { SampleAnalyticsPanel } from './SampleAnalyticsPanel';
import { SampleFeedbackTable } from './SampleFeedbackTable';

export function DashboardClient({
  brandId,
  filters,
  initialData,
}: {
  brandId: string;
  filters: BrandDashboardFilters;
  initialData: BrandDashboardInitialData;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isStaff, isLoading: isRoleLoading } = useBrandRole();

  const kpiQuery = useBrandDashboardKPICards(
    brandId,
    initialData.kpiCards ?? undefined,
  );
  const pointsQuery = useBrandDashboardPointsLiability(
    brandId,
    initialData.pointsLiability ?? undefined,
  );
  const analyticsQuery = useBrandDashboardAnalytics(
    brandId,
    filters,
    initialData.analytics ?? undefined,
  );
  const samplesQuery = useBrandDashboardSamples(
    brandId,
    initialData.samples ?? undefined,
  );

  const samples = samplesQuery.data ?? initialData.samples ?? [];
  const activeSampleId = selectEffectiveSampleId(filters.sampleId, samples);
  const activeFilters: BrandDashboardFilters = {
    ...filters,
    sampleId: activeSampleId,
    feedbackPage:
      activeSampleId === filters.sampleId ? filters.feedbackPage : 1,
  };
  const canUseSampleInitialData =
    Boolean(activeSampleId) && activeSampleId === filters.sampleId;

  const sampleAnalyticsQuery = useBrandDashboardSampleAnalytics(
    brandId,
    activeSampleId,
    canUseSampleInitialData
      ? initialData.sampleAnalytics ?? undefined
      : undefined,
  );
  const sampleFeedbacksQuery = useBrandDashboardSampleFeedbacks(
    brandId,
    activeFilters,
    canUseSampleInitialData
      ? initialData.sampleFeedbacks ?? undefined
      : undefined,
  );

  const pushParams = (updates: Record<string, string | null>) => {
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

  useEffect(() => {
    if (!samplesQuery.isSuccess) return;

    const urlSampleId = searchParams.get('sampleId') ?? '';
    const urlFeedbackPage = searchParams.get('feedbackPage') ?? '';
    const next = new URLSearchParams(searchParams.toString());

    if (!activeSampleId) {
      if (urlSampleId || urlFeedbackPage) {
        next.delete('sampleId');
        next.delete('feedbackPage');
        const query = next.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      }
      return;
    }

    if (urlSampleId !== activeSampleId) {
      next.set('sampleId', activeSampleId);
      next.set('feedbackPage', '1');
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }
  }, [
    activeSampleId,
    pathname,
    router,
    samplesQuery.isSuccess,
    searchParams,
  ]);

  const refreshAll = async () => {
    const requests: Promise<unknown>[] = [
      kpiQuery.refetch(),
      pointsQuery.refetch(),
      analyticsQuery.refetch(),
      samplesQuery.refetch(),
    ];
    if (activeSampleId) {
      requests.push(
        sampleAnalyticsQuery.refetch(),
        sampleFeedbacksQuery.refetch(),
      );
    }
    await Promise.allSettled(requests);
  };

  const allErrors = [
    kpiQuery.error,
    pointsQuery.error,
    analyticsQuery.error,
    samplesQuery.error,
    sampleAnalyticsQuery.error,
    sampleFeedbacksQuery.error,
  ];
  const isForbidden = allErrors.some(isBrandDashboardForbiddenError);
  const isRefreshing =
    kpiQuery.isFetching ||
    pointsQuery.isFetching ||
    analyticsQuery.isFetching ||
    samplesQuery.isFetching ||
    sampleAnalyticsQuery.isFetching ||
    sampleFeedbacksQuery.isFetching;

  if (isForbidden) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
          <ShieldAlert className="size-8" />
        </span>
        <h1 className="mt-6 text-3xl font-semibold">
          Bạn không có quyền truy cập brand này
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Hãy chọn một thương hiệu mà bạn đang là Owner hoặc Staff đang hoạt
          động.
        </p>
        <Button
          className="mt-7"
          render={<Link href="/brand-portal/select" />}
        >
          Chọn thương hiệu khác
        </Button>
      </section>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] animate-in flex-col gap-8 fade-in pb-24 text-foreground duration-500">
      <DashboardToolbar
        key={`${filters.fromDate}-${filters.toDate}`}
        filters={filters}
        updatedAt={kpiQuery.data?.updatedAt}
        isRefreshing={isRefreshing}
        onApply={(fromDate, toDate) =>
          pushParams({ fromDate, toDate })
        }
        onReset={() =>
          pushParams({ fromDate: null, toDate: null })
        }
        onRefresh={() => void refreshAll()}
      />

      <DashboardKpiGrid
        data={kpiQuery.data}
        isLoading={kpiQuery.isLoading}
        error={kpiQuery.error}
        onRetry={() => void kpiQuery.refetch()}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DashboardTrendChart
            data={analyticsQuery.data}
            isLoading={analyticsQuery.isLoading}
            isFetching={analyticsQuery.isFetching}
            error={analyticsQuery.error}
            onRetry={() => void analyticsQuery.refetch()}
          />
        </div>
        <PointsLiabilityPanel
          data={pointsQuery.data}
          isStaff={isStaff}
          isRoleLoading={isRoleLoading}
          isLoading={pointsQuery.isLoading}
          error={pointsQuery.error}
          onRetry={() => void pointsQuery.refetch()}
        />
      </div>

      <SampleAnalyticsPanel
        brandId={brandId}
        samples={samples}
        selectedSampleId={activeSampleId}
        data={sampleAnalyticsQuery.data}
        isLoadingSamples={samplesQuery.isLoading}
        isLoadingAnalytics={sampleAnalyticsQuery.isLoading}
        samplesError={samplesQuery.error}
        analyticsError={sampleAnalyticsQuery.error}
        onSampleChange={(sampleId) =>
          pushParams({ sampleId, feedbackPage: '1' })
        }
        onRetrySamples={() => void samplesQuery.refetch()}
        onRetryAnalytics={() => void sampleAnalyticsQuery.refetch()}
      />

      <SampleFeedbackTable
        sampleId={activeSampleId}
        page={activeFilters.feedbackPage}
        data={sampleFeedbacksQuery.data}
        isLoading={sampleFeedbacksQuery.isLoading}
        isFetching={sampleFeedbacksQuery.isFetching}
        error={sampleFeedbacksQuery.error}
        onPageChange={(feedbackPage) =>
          pushParams({ feedbackPage: String(feedbackPage) })
        }
        onRetry={() => void sampleFeedbacksQuery.refetch()}
      />
    </div>
  );
}
