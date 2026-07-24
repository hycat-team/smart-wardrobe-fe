import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { brandPortalApi } from '../api/brand-portal.api';
import { brandDashboardApi } from '../api/brand-dashboard.api';
import type {
  BenefitRedemptionAnalytics,
  BrandDashboardFilters,
  BrandKPICards,
  BrandPointsLiability,
  BrandSampleOption,
  CatalogStats,
  CustomerAcquisition,
  DigitalSampleLabAnalytics,
  DynamicQueryResponse,
  PointExpiryForecast,
  SampleFeedbackList,
  SpendSegmentation,
  TierDistribution,
} from '../types';
import {
  BRAND_DASHBOARD_FEEDBACK_LIMIT,
  buildBrandAnalyticsRequest,
} from '../utils/dashboard';

const BRAND_DASHBOARD_QUERY_OPTIONS = {
  staleTime: 60_000,
  refetchOnWindowFocus: 'always' as const,
};

type BrandInsightQueryOptions<T> = {
  enabled?: boolean;
  initialData?: T | null;
};
export const brandDashboardQueryKeys = {
  all: ['brand-dashboard'] as const,
  brand: (brandId: string) =>
    [...brandDashboardQueryKeys.all, brandId] as const,
  kpiCards: (brandId: string) =>
    [...brandDashboardQueryKeys.brand(brandId), 'kpi-cards'] as const,
  pointsLiability: (brandId: string) =>
    [...brandDashboardQueryKeys.brand(brandId), 'points-liability'] as const,
  analytics: (
    brandId: string,
    filters: Pick<BrandDashboardFilters, 'fromDate' | 'toDate'>,
  ) =>
    [
      ...brandDashboardQueryKeys.brand(brandId),
      'analytics',
      filters.fromDate,
      filters.toDate,
    ] as const,
  customerAcquisition: (brandId: string) =>
    [...brandDashboardQueryKeys.brand(brandId), 'customer-acquisition'] as const,
  spendSegmentation: (brandId: string) =>
    [...brandDashboardQueryKeys.brand(brandId), 'spend-segmentation'] as const,
  tierDistribution: (brandId: string) =>
    [...brandDashboardQueryKeys.brand(brandId), 'tier-distribution'] as const,
  pointExpiryForecast: (brandId: string) =>
    [...brandDashboardQueryKeys.brand(brandId), 'point-expiry-forecast'] as const,
  benefitRedemptionAnalytics: (brandId: string) =>
    [...brandDashboardQueryKeys.brand(brandId), 'benefit-redemption-analytics'] as const,
  catalogStats: (brandId: string) =>
    [...brandDashboardQueryKeys.brand(brandId), 'catalog-stats'] as const,  samples: (brandId: string) =>
    [...brandDashboardQueryKeys.brand(brandId), 'samples'] as const,
  sampleAnalytics: (brandId: string, sampleId: string) =>
    [
      ...brandDashboardQueryKeys.brand(brandId),
      'sample-analytics',
      sampleId,
    ] as const,
  sampleFeedbacks: (
    brandId: string,
    sampleId: string,
    page: number,
  ) =>
    [
      ...brandDashboardQueryKeys.brand(brandId),
      'sample-feedbacks',
      sampleId,
      page,
    ] as const,
};

const toSampleOptions = (
  items: Awaited<ReturnType<typeof brandPortalApi.getBrandItems>>,
): BrandSampleOption[] =>
  items
    .filter((item) => item.itemType?.toLowerCase() === 'sample')
    .map((item) => ({
      id: item.id,
      name: item.name || item.fashionItem?.style || 'Mẫu thử chưa đặt tên',
      imageUrl: item.fashionItem?.imageUrl,
      itemType: item.itemType || '',
    }));

export const useBrandDashboardKPICards = (
  brandId: string,
  initialData?: BrandKPICards,
) =>
  useQuery({
    queryKey: brandDashboardQueryKeys.kpiCards(brandId),
    queryFn: () => brandDashboardApi.getKPICards(brandId),
    enabled: Boolean(brandId),
    initialData,
    ...BRAND_DASHBOARD_QUERY_OPTIONS,
  });

export const useBrandDashboardPointsLiability = (
  brandId: string,
  initialData?: BrandPointsLiability,
) =>
  useQuery({
    queryKey: brandDashboardQueryKeys.pointsLiability(brandId),
    queryFn: () => brandDashboardApi.getPointsLiability(brandId),
    enabled: Boolean(brandId),
    initialData,
    ...BRAND_DASHBOARD_QUERY_OPTIONS,
  });

export const useBrandDashboardAnalytics = (
  brandId: string,
  filters: BrandDashboardFilters,
  initialData?: DynamicQueryResponse,
) =>
  useQuery({
    queryKey: brandDashboardQueryKeys.analytics(brandId, filters),
    queryFn: () =>
      brandDashboardApi.queryAnalytics(
        buildBrandAnalyticsRequest(brandId, filters),
      ),
    enabled: Boolean(brandId),
    initialData,
    placeholderData: keepPreviousData,
    ...BRAND_DASHBOARD_QUERY_OPTIONS,
  });

export const useBrandDashboardCustomerAcquisition = (
  brandId: string,
  options?: BrandInsightQueryOptions<CustomerAcquisition>,
) =>
  useQuery({
    queryKey: brandDashboardQueryKeys.customerAcquisition(brandId),
    queryFn: () => brandDashboardApi.getCustomerAcquisition(brandId),
    enabled: Boolean(brandId) && (options?.enabled ?? true),
    initialData: options?.initialData ?? undefined,
    ...BRAND_DASHBOARD_QUERY_OPTIONS,
  });

export const useBrandDashboardSpendSegmentation = (
  brandId: string,
  options?: BrandInsightQueryOptions<SpendSegmentation>,
) =>
  useQuery({
    queryKey: brandDashboardQueryKeys.spendSegmentation(brandId),
    queryFn: () => brandDashboardApi.getSpendSegmentation(brandId),
    enabled: Boolean(brandId) && (options?.enabled ?? true),
    initialData: options?.initialData ?? undefined,
    ...BRAND_DASHBOARD_QUERY_OPTIONS,
  });

export const useBrandDashboardTierDistribution = (
  brandId: string,
  options?: BrandInsightQueryOptions<TierDistribution>,
) =>
  useQuery({
    queryKey: brandDashboardQueryKeys.tierDistribution(brandId),
    queryFn: () => brandDashboardApi.getTierDistribution(brandId),
    enabled: Boolean(brandId) && (options?.enabled ?? true),
    initialData: options?.initialData ?? undefined,
    ...BRAND_DASHBOARD_QUERY_OPTIONS,
  });

export const useBrandDashboardPointExpiryForecast = (
  brandId: string,
  options?: BrandInsightQueryOptions<PointExpiryForecast>,
) =>
  useQuery({
    queryKey: brandDashboardQueryKeys.pointExpiryForecast(brandId),
    queryFn: () => brandDashboardApi.getPointExpiryForecast(brandId),
    enabled: Boolean(brandId) && (options?.enabled ?? true),
    initialData: options?.initialData ?? undefined,
    ...BRAND_DASHBOARD_QUERY_OPTIONS,
  });

export const useBrandDashboardBenefitRedemptionAnalytics = (
  brandId: string,
  options?: BrandInsightQueryOptions<BenefitRedemptionAnalytics>,
) =>
  useQuery({
    queryKey: brandDashboardQueryKeys.benefitRedemptionAnalytics(brandId),
    queryFn: () => brandDashboardApi.getBenefitRedemptionAnalytics(brandId),
    enabled: Boolean(brandId) && (options?.enabled ?? true),
    initialData: options?.initialData ?? undefined,
    ...BRAND_DASHBOARD_QUERY_OPTIONS,
  });

export const useBrandDashboardCatalogStats = (
  brandId: string,
  options?: BrandInsightQueryOptions<CatalogStats>,
) =>
  useQuery({
    queryKey: brandDashboardQueryKeys.catalogStats(brandId),
    queryFn: () => brandDashboardApi.getCatalogStats(brandId),
    enabled: Boolean(brandId) && (options?.enabled ?? true),
    initialData: options?.initialData ?? undefined,
    ...BRAND_DASHBOARD_QUERY_OPTIONS,
  });
export const useBrandDashboardSamples = (
  brandId: string,
  initialData?: BrandSampleOption[],
) =>
  useQuery({
    queryKey: brandDashboardQueryKeys.samples(brandId),
    queryFn: async () => toSampleOptions(await brandPortalApi.getBrandItems(brandId)),
    enabled: Boolean(brandId),
    initialData,
    ...BRAND_DASHBOARD_QUERY_OPTIONS,
  });

export const useBrandDashboardSampleAnalytics = (
  brandId: string,
  sampleId: string,
  initialData?: DigitalSampleLabAnalytics,
) =>
  useQuery({
    queryKey: brandDashboardQueryKeys.sampleAnalytics(brandId, sampleId),
    queryFn: async () => {
      const data = await brandDashboardApi.getSampleAnalytics({
        brandId,
        itemId: sampleId,
      });
      return data?.itemId === sampleId ? data : null;
    },
    enabled: Boolean(brandId && sampleId),
    initialData:
      initialData?.itemId === sampleId ? initialData : undefined,
    ...BRAND_DASHBOARD_QUERY_OPTIONS,
  });

export const useBrandDashboardSampleFeedbacks = (
  brandId: string,
  filters: BrandDashboardFilters,
  initialData?: SampleFeedbackList,
) =>
  useQuery({
    queryKey: brandDashboardQueryKeys.sampleFeedbacks(
      brandId,
      filters.sampleId,
      filters.feedbackPage,
    ),
    queryFn: () =>
      brandDashboardApi.getSampleFeedbacks({
        brandId,
        itemId: filters.sampleId,
        page: filters.feedbackPage,
        limit: BRAND_DASHBOARD_FEEDBACK_LIMIT,
      }),
    enabled: Boolean(brandId && filters.sampleId),
    initialData,
    ...BRAND_DASHBOARD_QUERY_OPTIONS,
  });
