import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { brandPortalApi } from '../api/brand-portal.api';
import { brandDashboardApi } from '../api/brand-dashboard.api';
import type {
  BrandDashboardFilters,
  BrandKPICards,
  BrandPointsLiability,
  BrandSampleOption,
  DigitalSampleLabAnalytics,
  DynamicQueryResponse,
  SampleFeedbackList,
} from '../types';
import {
  BRAND_DASHBOARD_FEEDBACK_LIMIT,
  buildBrandAnalyticsRequest,
} from '../utils/dashboard';

const BRAND_DASHBOARD_QUERY_OPTIONS = {
  staleTime: 60_000,
  refetchOnWindowFocus: 'always' as const,
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
  samples: (brandId: string) =>
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
    queryFn: () =>
      brandDashboardApi.getSampleAnalytics({ brandId, itemId: sampleId }),
    enabled: Boolean(brandId && sampleId),
    initialData,
    placeholderData: keepPreviousData,
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
    placeholderData: keepPreviousData,
    ...BRAND_DASHBOARD_QUERY_OPTIONS,
  });
