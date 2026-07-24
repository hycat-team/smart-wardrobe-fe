import type { PaginationResult } from '@/types/api';

export interface BrandKPICards {
  brandId: string;
  totalMembers: number;
  pointsIssued: number;
  pointsRedeemed: number;
  activeVouchers: number;
  vouchersRedeemed: number;
  digitalSampleVotesCount: number;
  digitalSampleAvgRating: number;
  openCsTickets: number;
  csFirstResponseAvgSeconds: number;
  updatedAt: string;
}

export interface BrandPointsLiability {
  brandId: string;
  pointsExpiring30d: number;
  pointsLiabilityValueVnd: number;
}

export type FeedbackSentiment = 'positive' | 'neutral' | 'negative' | '';

export interface PairedCategoryStat {
  categoryName: string;
  pairCount: number;
}

export interface DigitalSampleLabAnalytics {
  itemId: string;
  votesCount: number;
  avgRating: number;
  feedbackSentiment: FeedbackSentiment;
  topPairedCategories: PairedCategoryStat[];
}

export interface SampleFeedback {
  feedbackId: string;
  itemId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type SampleFeedbackList = PaginationResult<SampleFeedback>;

export const BRAND_METRIC_KEYS = [
  'total_members',
  'points_issued',
  'points_redeemed',
  'active_vouchers',
] as const;

export type BrandMetricKey = (typeof BRAND_METRIC_KEYS)[number];

export interface BrandDynamicQueryRequest {
  targetDashboard: 'brand';
  brandId: string;
  metrics: BrandMetricKey[];
  timeframe: {
    fromDate: string;
    toDate: string;
  };
  granularity: 'day';
  compareWithPrevious: false;
}

export interface TimeSeriesPoint {
  timestamp: string;
  metrics: Partial<Record<BrandMetricKey, number>>;
}

export interface DynamicQueryResponse {
  targetDashboard: 'brand';
  granularity: 'hour' | 'day' | 'week' | 'month';
  series: TimeSeriesPoint[];
  comparison?: {
    previousPeriodFrom: string;
    previousPeriodTo: string;
    metricDeltaPercentages: Partial<Record<BrandMetricKey, number>>;
  };
}

export interface BrandDashboardFilters {
  fromDate: string;
  toDate: string;
  sampleId: string;
  feedbackPage: number;
}

export interface BrandDashboardSearchParams {
  fromDate?: string | string[];
  toDate?: string | string[];
  sampleId?: string | string[];
  feedbackPage?: string | string[];
}

export interface BrandSampleOption {
  id: string;
  name: string;
  imageUrl?: string;
  itemType: string;
}

export interface BrandDashboardInitialData {
  kpiCards: BrandKPICards | null;
  pointsLiability: BrandPointsLiability | null;
  analytics: DynamicQueryResponse | null;
  samples: BrandSampleOption[] | null;
  sampleAnalytics: DigitalSampleLabAnalytics | null;
  sampleFeedbacks: SampleFeedbackList | null;
}
