import {
  format,
  isValid,
} from 'date-fns';
import {
  ADMIN_METRIC_KEYS,
  DashboardFilters,
  DashboardSearchParams,
  DynamicQueryRequest,
} from '../types';

export const DASHBOARD_DATE_FORMAT = 'yyyy-MM-dd';
export const DASHBOARD_DEFAULT_LOOKBACK_DAYS = 29; // 30 ngày lịch tính cả hôm nay
export const DASHBOARD_MAX_DATE_RANGE_DAYS = 730;
export const DASHBOARD_AI_EVENTS_LIMIT = 20;

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

// Sinh chuỗi YYYY-MM-DD theo LỊCH VN — KHÔNG dùng toISOString() (UTC)
export const vnDate = (d: Date): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(d);

export const todayVN = (now = new Date()): string => vnDate(now);

export const startOfMonthVN = (now = new Date()): string => todayVN(now).slice(0, 8) + '01'; // YYYY-MM-01

export const daysAgoVN = (n: number, now = new Date()): string =>
  vnDate(new Date(now.getTime() - n * 86_400_000));

export const getPresetDateRange = (
  preset: 'today' | 'this_month' | 'last_30_days',
  now = new Date(),
) => {
  const today = todayVN(now);
  switch (preset) {
    case 'today':
      return { fromDate: today, toDate: today };
    case 'this_month':
      return { fromDate: startOfMonthVN(now), toDate: today };
    case 'last_30_days':
      return { fromDate: daysAgoVN(29, now), toDate: today };
  }
};

export const getDefaultDashboardDateRange = (now = new Date()) => {
  return {
    fromDate: daysAgoVN(DASHBOARD_DEFAULT_LOOKBACK_DAYS, now),
    toDate: todayVN(now),
  };
};

/**
 * Chuẩn hóa tham số dashboard.
 * LƯU Ý: Không im lặng chuyển khoảng ngày sai về 30 ngày mặc định
 * để người dùng nhận diện lỗi (hoặc BE trả 400 và FE hiển thị rõ).
 */
export const normalizeDashboardFilters = (
  params: DashboardSearchParams,
  now = new Date(),
): DashboardFilters => {
  const fallback = getDefaultDashboardDateRange(now);
  const rawFrom = firstValue(params.fromDate)?.trim();
  const rawTo = firstValue(params.toDate)?.trim();

  // Chỉ fallback khi không truyền tham số
  const fromDate = rawFrom || fallback.fromDate;
  const toDate = rawTo || fallback.toDate;

  const page = Number.parseInt(firstValue(params.aiPage) ?? '1', 10);
  const insightTab = firstValue(params.insightTab) === 'ai'
    ? 'ai'
    : 'subscriptions';

  return {
    fromDate,
    toDate,
    aiStatus: firstValue(params.aiStatus)?.trim() ?? '',
    aiPage: Number.isFinite(page) && page > 0 ? page : 1,
    insightTab,
  };
};

export const hasCustomDashboardDateRange = (
  filters: DashboardFilters,
  now = new Date(),
) => {
  const fallback = getDefaultDashboardDateRange(now);
  return (
    filters.fromDate !== fallback.fromDate ||
    filters.toDate !== fallback.toDate
  );
};

export const buildAdminAnalyticsRequest = (
  filters: DashboardFilters,
): DynamicQueryRequest => ({
  targetDashboard: 'admin',
  metrics: [...ADMIN_METRIC_KEYS],
  timeframe: {
    fromDate: filters.fromDate,
    toDate: filters.toDate,
  },
  granularity: 'day',
  compareWithPrevious: false,
});

export const formatVND = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value);

export const formatCompactNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

export const formatVNDateString = (dateStr?: string | null): string => {
  if (!dateStr) return '—';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatVNDateTime = (dateStr?: string | null): string => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

export const formatDashboardDateTime = (value?: string | null) => {
  if (!value) return 'Chưa cập nhật';
  const date = new Date(value);
  if (!isValid(date)) return 'Chưa cập nhật';
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

export const safePercentage = (numerator: number, denominator: number) => {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
    return 0;
  }
  return (numerator / denominator) * 100;
};

export const isNotFoundError = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'response' in error &&
  typeof error.response === 'object' &&
  error.response !== null &&
  'status' in error.response &&
  error.response.status === 404;

export const DASHBOARD_PALETTE = [
  '#0f766e',
  '#d97706',
  '#2563eb',
  '#dc2626',
  '#7c3aed',
  '#64748b',
];

export const PLAN_COLORS: Record<string, string> = {
  free: '#0f766e',
  'premium-monthly': '#d97706',
  'premium_monthly': '#d97706',
  'premium-yearly': '#2563eb',
  'premium_yearly': '#2563eb',
};

export const getPlanColor = (planCode?: string | null, fallbackIndex = 0): string => {
  if (!planCode) {
    return DASHBOARD_PALETTE[fallbackIndex % DASHBOARD_PALETTE.length];
  }

  const normalized = planCode.toLowerCase().trim().replace(/[\s_-]+/g, '-');

  if (PLAN_COLORS[normalized]) {
    return PLAN_COLORS[normalized];
  }

  if (normalized.includes('yearly') || normalized.includes('annual')) {
    return '#2563eb';
  }
  if (normalized.includes('premium') || normalized.includes('monthly')) {
    return '#d97706';
  }
  if (normalized.includes('free')) {
    return '#0f766e';
  }

  return DASHBOARD_PALETTE[fallbackIndex % DASHBOARD_PALETTE.length];
};
