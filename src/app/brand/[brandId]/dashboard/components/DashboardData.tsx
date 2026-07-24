import { serverFetch } from '@/lib/server-fetch';
import type {
  BrandDashboardInitialData,
  BrandDashboardSearchParams,
  BrandItemRes,
  BrandKPICards,
  BrandPointsLiability,
  BrandSampleOption,
  DigitalSampleLabAnalytics,
} from '@/features/brand-portal/types';
import {
  normalizeBrandDashboardFilters,
  selectEffectiveSampleId,
} from '@/features/brand-portal/utils/dashboard';
import { DashboardClient } from './DashboardClient';

const toSampleOptions = (items: BrandItemRes[] | null): BrandSampleOption[] | null =>
  items?.filter((item) => item.itemType?.toLowerCase() === 'sample').map((item) => ({
    id: item.id,
    name: item.name || item.fashionItem?.style || 'Mẫu thử chưa đặt tên',
    imageUrl: item.fashionItem?.imageUrl,
    itemType: item.itemType || '',
  })) ?? null;

export default async function DashboardData({
  params,
  searchParams,
}: {
  params: Promise<{ brandId: string }>;
  searchParams: Promise<BrandDashboardSearchParams>;
}) {
  const [{ brandId }, rawSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const normalizedFilters = normalizeBrandDashboardFilters(rawSearchParams);
  const brandQuery = new URLSearchParams({ brandId });

  const [kpiCards, pointsLiability, rawItems] = await Promise.all([
    serverFetch<BrandKPICards>(
      `/brand/dashboard/kpi-cards?${brandQuery.toString()}`,
      { cache: 'no-store' },
    ),
    serverFetch<BrandPointsLiability>(
      `/brand/dashboard/financials/points-liability?${brandQuery.toString()}`,
      { cache: 'no-store' },
    ),
    serverFetch<BrandItemRes[]>(`/brand-portal/brands/${brandId}/items`, {
      cache: 'no-store',
    }),
  ]);

  const samples = toSampleOptions(rawItems);
  const effectiveSampleId = selectEffectiveSampleId(
    normalizedFilters.sampleId,
    samples ?? [],
  );
  const sampleChanged =
    Boolean(effectiveSampleId) &&
    effectiveSampleId !== normalizedFilters.sampleId;
  const filters = {
    ...normalizedFilters,
    sampleId: effectiveSampleId,
    feedbackPage: sampleChanged ? 1 : normalizedFilters.feedbackPage,
  };

  let sampleAnalytics: DigitalSampleLabAnalytics | null = null;

  if (effectiveSampleId) {
    const sampleParams = new URLSearchParams({ brandId });

    sampleAnalytics = await serverFetch<DigitalSampleLabAnalytics>(
      `/brand/dashboard/operations/digital-sample-lab/${effectiveSampleId}?${sampleParams.toString()}`,
      { cache: 'no-store' },
    );
  }

  const initialData: BrandDashboardInitialData = {
    kpiCards,
    pointsLiability,
    analytics: null,
    samples,
    sampleAnalytics,
    sampleFeedbacks: null,
  };

  return (
    <DashboardClient
      brandId={brandId}
      filters={filters}
      initialData={initialData}
    />
  );
}
