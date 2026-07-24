import api from '@/lib/axios';
import type { APIResponse } from '@/types/api';
import type {
  BenefitRedemptionAnalytics,
  BrandDynamicQueryRequest,
  BrandKPICards,
  BrandPointsLiability,
  CatalogStats,
  CustomerAcquisition,
  DigitalSampleLabAnalytics,
  DynamicQueryResponse,
  PointExpiryForecast,
  SampleFeedbackList,
  SpendSegmentation,
  TierDistribution,
} from '../types';

export const brandDashboardApi = {
  getKPICards: async (brandId: string): Promise<BrandKPICards | null> => {
    const response = await api.get<APIResponse<BrandKPICards>>(
      '/brand/dashboard/kpi-cards',
      { params: { brandId } },
    );
    return response.data.data ?? null;
  },

  getPointsLiability: async (
    brandId: string,
  ): Promise<BrandPointsLiability | null> => {
    const response = await api.get<APIResponse<BrandPointsLiability>>(
      '/brand/dashboard/financials/points-liability',
      { params: { brandId } },
    );
    return response.data.data ?? null;
  },

  queryAnalytics: async (
    request: BrandDynamicQueryRequest,
  ): Promise<DynamicQueryResponse | null> => {
    const response = await api.post<APIResponse<DynamicQueryResponse>>(
      '/dashboard/analytics/query',
      request,
    );
    return response.data.data ?? null;
  },

  getCustomerAcquisition: async (
    brandId: string,
  ): Promise<CustomerAcquisition | null> => {
    const response = await api.get<APIResponse<CustomerAcquisition>>(
      '/brand/dashboard/customers/acquisition',
      { params: { brandId } },
    );
    return response.data.data ?? null;
  },

  getTierDistribution: async (
    brandId: string,
  ): Promise<TierDistribution | null> => {
    const response = await api.get<APIResponse<TierDistribution>>(
      '/brand/dashboard/loyalty/tier-distribution',
      { params: { brandId } },
    );
    return response.data.data ?? null;
  },

  getPointExpiryForecast: async (
    brandId: string,
  ): Promise<PointExpiryForecast | null> => {
    const response = await api.get<APIResponse<PointExpiryForecast>>(
      '/brand/dashboard/loyalty/point-expiry-forecast',
      { params: { brandId } },
    );
    return response.data.data ?? null;
  },

  getBenefitRedemptionAnalytics: async (
    brandId: string,
  ): Promise<BenefitRedemptionAnalytics | null> => {
    const response = await api.get<APIResponse<BenefitRedemptionAnalytics>>(
      '/brand/dashboard/benefits/redemption-analytics',
      { params: { brandId } },
    );
    return response.data.data ?? null;
  },

  getCatalogStats: async (brandId: string): Promise<CatalogStats | null> => {
    const response = await api.get<APIResponse<CatalogStats>>(
      '/brand/dashboard/operations/catalog-stats',
      { params: { brandId } },
    );
    return response.data.data ?? null;
  },

  getSpendSegmentation: async (
    brandId: string,
  ): Promise<SpendSegmentation | null> => {
    const response = await api.get<APIResponse<SpendSegmentation>>(
      '/brand/dashboard/customers/spend-segmentation',
      { params: { brandId } },
    );
    return response.data.data ?? null;
  },
  getSampleAnalytics: async ({
    brandId,
    itemId,
  }: {
    brandId: string;
    itemId: string;
  }): Promise<DigitalSampleLabAnalytics | null> => {
    const response = await api.get<APIResponse<DigitalSampleLabAnalytics>>(
      `/brand/dashboard/operations/digital-sample-lab/${itemId}`,
      { params: { brandId } },
    );
    return response.data.data ?? null;
  },

  getSampleFeedbacks: async ({
    brandId,
    itemId,
    page,
    limit,
  }: {
    brandId: string;
    itemId: string;
    page: number;
    limit: number;
  }): Promise<SampleFeedbackList | null> => {
    const response = await api.get<APIResponse<SampleFeedbackList>>(
      '/brand/dashboard/drilldown/sample-lab-feedbacks',
      { params: { brandId, itemId, page, limit } },
    );
    return response.data.data ?? null;
  },
};
