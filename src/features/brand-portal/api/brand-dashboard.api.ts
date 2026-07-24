import api from '@/lib/axios';
import type { APIResponse } from '@/types/api';
import type {
  BrandDynamicQueryRequest,
  BrandKPICards,
  BrandPointsLiability,
  DigitalSampleLabAnalytics,
  DynamicQueryResponse,
  SampleFeedbackList,
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
