import { serverFetch } from '@/lib/server-fetch';
import type {
  BenefitRedemptionAnalytics,
  BrandDashboardInitialData,
  BrandDashboardSearchParams,
  BrandItemRes,
  BrandKPICards,
  BrandPointsLiability,
  BrandSampleOption,
  CatalogStats,
  CustomerAcquisition,
  DigitalSampleLabAnalytics,
  PointExpiryForecast,
  SpendSegmentation,
  TierDistribution,
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

  let customerAcquisition: CustomerAcquisition | null | undefined;
  let spendSegmentation: SpendSegmentation | null | undefined;
  let tierDistribution: TierDistribution | null | undefined;
  let pointExpiryForecast: PointExpiryForecast | null | undefined;
  let benefitRedemptionAnalytics:
    | BenefitRedemptionAnalytics
    | null
    | undefined;
  let catalogStats: CatalogStats | null | undefined;

  if (normalizedFilters.insightTab === 'customers') {
    [customerAcquisition, spendSegmentation] = await Promise.all([
      serverFetch<CustomerAcquisition>(
        `/brand/dashboard/customers/acquisition?${brandQuery.toString()}`,
        { cache: 'no-store' },
      ),
      serverFetch<SpendSegmentation>(
        `/brand/dashboard/customers/spend-segmentation?${brandQuery.toString()}`,
        { cache: 'no-store' },
      ),
    ]);
  } else if (normalizedFilters.insightTab === 'loyalty') {
    [tierDistribution, pointExpiryForecast, benefitRedemptionAnalytics] =
      await Promise.all([
        serverFetch<TierDistribution>(
          `/brand/dashboard/loyalty/tier-distribution?${brandQuery.toString()}`,
          { cache: 'no-store' },
        ),
        serverFetch<PointExpiryForecast>(
          `/brand/dashboard/loyalty/point-expiry-forecast?${brandQuery.toString()}`,
          { cache: 'no-store' },
        ),
        serverFetch<BenefitRedemptionAnalytics>(
          `/brand/dashboard/benefits/redemption-analytics?${brandQuery.toString()}`,
          { cache: 'no-store' },
        ),
      ]);
  } else {
    catalogStats = await serverFetch<CatalogStats>(
      `/brand/dashboard/operations/catalog-stats?${brandQuery.toString()}`,
      { cache: 'no-store' },
    );
  }
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
    customerAcquisition,
    spendSegmentation,
    tierDistribution,
    pointExpiryForecast,
    benefitRedemptionAnalytics,
    catalogStats,
  };

  return (
    <DashboardClient
      brandId={brandId}
      filters={filters}
      initialData={initialData}
    />
  );
}
