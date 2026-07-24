import type { PaginationResult } from '@/types/api';

export const ADMIN_METRIC_KEYS = [
  'total_users',
  'new_users',
  'active_users_dau',
  'ai_requests_count',
  'ai_error_count',
  'ai_error_rate',
  'subscription_revenue_vnd',
  'net_ai_margin_vnd',
] as const;

export type AdminMetricKey = (typeof ADMIN_METRIC_KEYS)[number];

export interface AdminKPICards {
  totalUsers: number;
  activeUsersDau: number;
  totalBrands: number;
  pendingReviewBrands: number;
  subscriptionRevenueVnd: number;
  netAiMarginVnd: number;
  payOSSuccessCount: number;
  updatedAt: string;
}

export interface AIMarginAnalytics {
  fromDate: string;
  toDate: string;
  totalSubscriptionRevVnd: number;
  totalAiActualCostVnd: number;
  netAiMarginVnd: number;
  marginPercentage: number;
  totalAiPaidTokens: number;
  aiRequestsCount: number;
  aiErrorCount: number;
}

export interface PayOSReconciliation {
  totalTransactions: number;
  successCount: number;
  failedCount: number;
  totalSuccessValue: number;
}

export interface AdminOverview {
  kpiCards: AdminKPICards | null;
  aiMargin: AIMarginAnalytics | null;
  payosReconcile: PayOSReconciliation | null;
}

export type AdminInsightTab = 'subscriptions' | 'ai';

export interface SubscriptionDistributionItem {
  planCode: string;
  userCount: number;
  percentage: number;
}

export interface SubscriptionDistribution {
  distribution: SubscriptionDistributionItem[];
  totalUsers: number;
}

export interface RevenueBreakdownItem {
  planCode: string;
  month: string;
  transactionCount: number;
  revenueVnd: number;
}

export interface RevenueBreakdown {
  fromDate: string;
  toDate: string;
  breakdown: RevenueBreakdownItem[];
  totalRevenueVnd: number;
}

export interface AIUsageByOperationItem {
  operation: string;
  logicalRoute: string;
  requestCount: number;
  totalCostVnd: number;
  totalPromptTokens: number;
  totalOutputTokens: number;
}

export interface AIUsageByOperation {
  fromDate: string;
  toDate: string;
  operations: AIUsageByOperationItem[];
}

export interface AIErrorBreakdownItem {
  errorCode: string;
  provider: string;
  model: string;
  errorCount: number;
}

export interface AIErrorBreakdown {
  totalErrors: number;
  totalRequests: number;
  errorRate: number;
  breakdown: AIErrorBreakdownItem[];
}

export interface RenewalStats {
  totalAttempts: number;
  successCount: number;
  failedCount: number;
  successRate: number;
  avgRetryCount: number;
}
export interface DynamicQueryTimeframe {
  fromDate: string;
  toDate: string;
}

export interface DynamicQueryRequest {
  targetDashboard: 'admin';
  metrics: AdminMetricKey[];
  timeframe: DynamicQueryTimeframe;
  granularity: 'day';
  compareWithPrevious: false;
}

export interface TimeSeriesPoint {
  timestamp: string;
  metrics: Partial<Record<AdminMetricKey, number>>;
}

export interface DynamicQueryResponse {
  targetDashboard: 'admin';
  granularity: 'hour' | 'day' | 'week' | 'month';
  series: TimeSeriesPoint[];
}

export interface AIEvent {
  requestId: string;
  provider: string;
  model: string;
  statusCode: number;
  errorMessage: string;
  createdAt: string;
}

export interface AIEventQuery {
  status?: string;
  page: number;
  limit: number;
}

export type AIEventList = PaginationResult<AIEvent>;

export interface DashboardFilters {
  fromDate: string;
  toDate: string;
  aiStatus: string;
  aiPage: number;
  insightTab: AdminInsightTab;
}

export type DashboardSearchParams = Record<
  string,
  string | string[] | undefined
>;

export interface DashboardInitialData {
  overview: AdminOverview | null;
  aiMargin: AIMarginAnalytics | null;
  analytics: DynamicQueryResponse | null;
  aiEvents: AIEventList | null;
  subscriptionDistribution?: SubscriptionDistribution | null;
  revenueBreakdown?: RevenueBreakdown | null;
  renewalStats?: RenewalStats | null;
  aiUsageByOperation?: AIUsageByOperation | null;
  aiErrorBreakdown?: AIErrorBreakdown | null;
}
