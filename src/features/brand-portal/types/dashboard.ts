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
  'new_customers',
  'customer_claim_rate',
  'benefit_redemption_count',
  'brand_item_count',
  'brand_item_count_by_type',
] as const;

export type BrandMetricKey = (typeof BRAND_METRIC_KEYS)[number];

export type BrandMetricResponseKey =
  | Exclude<BrandMetricKey, 'brand_item_count_by_type'>
  | `brand_item_count_${string}`;

export type BrandInsightTab = 'customers' | 'loyalty' | 'operations';

export interface CustomerAcquisitionSource {
  source: string;
  customerCount: number;
  percentage: number;
}

export interface CustomerAcquisition {
  brandId: string;
  totalCustomers: number;
  sources: CustomerAcquisitionSource[];
}

export interface TierDistributionItem {
  tierId: string;
  tierName: string;
  tierRank: number;
  memberCount: number;
  percentage: number;
}

export interface TierDistribution {
  brandId: string;
  totalMembers: number;
  tiers: TierDistributionItem[];
}

export interface PointExpiryForecastItem {
  month: string;
  pointsExpiring: number;
}

export interface PointExpiryForecast {
  brandId: string;
  forecast: PointExpiryForecastItem[];
}

export interface RedemptionTrendItem {
  month: string;
  redemptionCount: number;
}

export interface BenefitRedemptionItem {
  benefitId: string;
  benefitName: string;
  benefitType: string;
  redemptionCount: number;
  percentage: number;
}

export interface BenefitRedemptionAnalytics {
  brandId: string;
  totalRedemptions: number;
  trend: RedemptionTrendItem[];
  topBenefits: BenefitRedemptionItem[];
}

export interface CatalogStatGroup {
  label: string;
  count: number;
  percentage: number;
}

export interface CatalogStats {
  brandId: string;
  totalItems: number;
  byStatus: CatalogStatGroup[];
  byType: CatalogStatGroup[];
}

export type SpendSegmentName = 'low' | 'medium' | 'high' | 'premium';

export interface SpendSegment {
  segment: SpendSegmentName | string;
  minVnd: number;
  maxVnd?: number;
  customerCount: number;
  percentage: number;
}

export interface SpendSegmentation {
  brandId: string;
  totalCustomers: number;
  segments: SpendSegment[];
}
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
  metrics: Partial<Record<BrandMetricResponseKey, number>>;
}

export interface DynamicQueryResponse {
  targetDashboard: 'brand';
  granularity: 'hour' | 'day' | 'week' | 'month';
  series: TimeSeriesPoint[];
  comparison?: {
    previousPeriodFrom: string;
    previousPeriodTo: string;
    metricDeltaPercentages: Partial<Record<BrandMetricResponseKey, number>>;
  };
}

export interface BrandDashboardFilters {
  fromDate: string;
  toDate: string;
  sampleId: string;
  feedbackPage: number;
  insightTab: BrandInsightTab;
}

export interface BrandDashboardSearchParams {
  fromDate?: string | string[];
  toDate?: string | string[];
  sampleId?: string | string[];
  feedbackPage?: string | string[];
  insightTab?: string | string[];
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
  customerAcquisition?: CustomerAcquisition | null;
  spendSegmentation?: SpendSegmentation | null;
  tierDistribution?: TierDistribution | null;
  pointExpiryForecast?: PointExpiryForecast | null;
  benefitRedemptionAnalytics?: BenefitRedemptionAnalytics | null;
  catalogStats?: CatalogStats | null;
}
