import { isValid } from 'date-fns';
import {
  ADMIN_METRIC_KEYS,
  DashboardFilters,
  DashboardSearchParams,
  DynamicQueryRequest,
} from '../types';
import {
  createDateVN,
  daysAgoVN,
  getDefaultPeriod,
  getPeriodDateRange as getCommonPeriodDateRange,
  parsePeriodFromParams,
  parseVNDateParts,
  todayVN,
} from './period';

export * from './period';

export const DASHBOARD_DATE_FORMAT = 'yyyy-MM-dd';
export const DASHBOARD_DEFAULT_LOOKBACK_DAYS = 29; // 30 ngày lịch tính cả hôm nay (legacy reference)
export const DASHBOARD_MAX_DATE_RANGE_DAYS = 730;
export const DASHBOARD_AI_EVENTS_LIMIT = 20;

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const getPresetDateRange = (
  preset: 'today' | 'this_month' | 'last_30_days',
  now = new Date()
) => {
  if (preset === 'last_30_days') {
    return { fromDate: daysAgoVN(29, now), toDate: todayVN(now) };
  }
  return getCommonPeriodDateRange(preset, now);
};

export const getDefaultDashboardDateRange = (now = new Date()) => {
  const { fromDate, toDate } = getDefaultPeriod(now);
  return { fromDate, toDate };
};

/**
 * Số ngày lịch VN trong kỳ, tính cả hai đầu.
 */
export const countPeriodDays = (fromDate: string, toDate: string): number => {
  const from = parseVNDateParts(fromDate);
  const to = parseVNDateParts(toDate);
  const fromD = createDateVN(from.year, from.month, from.day);
  const toD = createDateVN(to.year, to.month, to.day);
  return Math.round((toD.getTime() - fromD.getTime()) / 86400000) + 1;
};

/**
 * Kỳ dài hơn một quý thì biểu đồ xu hướng gộp theo tháng: 365 điểm ngày trên
 * một năm là nhiễu, 12 điểm tháng mới đọc được. Backend đã hỗ trợ `month`
 * (và tự hạ `day` → `month` khi kỳ vượt 730 ngày).
 */
export const GRANULARITY_MONTH_THRESHOLD_DAYS = 92;

export const resolveGranularity = (
  fromDate: string,
  toDate: string
): 'day' | 'month' =>
  countPeriodDays(fromDate, toDate) > GRANULARITY_MONTH_THRESHOLD_DAYS
    ? 'month'
    : 'day';

/**
 * Khoảng ngày để query biểu đồ doanh thu theo tháng: TRỌN NĂM của kỳ đang chọn.
 *
 * Biểu đồ nhóm theo tháng ở backend, nên nếu gửi đúng kỳ "Tháng này" thì chỉ có
 * một cột — vô nghĩa với một biểu đồ chuỗi thời gian. Vì vậy panel doanh thu
 * luôn lấy từ 01/01 của năm chứa kỳ, kết thúc ở hôm nay (hoặc 31/12 với năm đã
 * qua). Sàn dữ liệu không áp ở đây: dữ liệu trước mốc đơn giản là không có.
 */
export const getRevenueChartRange = (
  period: { fromDate: string },
  now = new Date()
): { fromDate: string; toDate: string } => {
  const year = String(parseVNDateParts(period.fromDate).year).padStart(4, '0');
  const yearEnd = `${year}-12-31`;
  const today = todayVN(now);
  return {
    fromDate: `${year}-01-01`,
    toDate: yearEnd < today ? yearEnd : today,
  };
};

/**
 * Chuẩn hóa tham số dashboard.
 * Mặc định khi không có query param là "Tháng này" (01 đến hôm nay giờ VN).
 * LƯU Ý: Không im lặng chuyển khoảng ngày sai về 30 ngày mặc định
 * để người dùng nhận diện lỗi (hoặc BE trả 400 và FE hiển thị rõ).
 */
export const normalizeDashboardFilters = (
  params: DashboardSearchParams,
  now = new Date()
): DashboardFilters => {
  const parsedPeriod = parsePeriodFromParams(
    {
      preset: firstValue(params.preset),
      fromDate: firstValue(params.fromDate),
      toDate: firstValue(params.toDate),
    },
    now
  );

  const page = Number.parseInt(firstValue(params.aiPage) ?? '1', 10);
  const insightTab =
    firstValue(params.insightTab) === 'ai' ? 'ai' : 'subscriptions';

  return {
    preset: parsedPeriod.preset,
    fromDate: parsedPeriod.fromDate,
    toDate: parsedPeriod.toDate,
    aiStatus: firstValue(params.aiStatus)?.trim() ?? '',
    aiPage: Number.isFinite(page) && page > 0 ? page : 1,
    insightTab,
  };
};

export const buildAdminAnalyticsRequest = (
  filters: DashboardFilters
): DynamicQueryRequest => ({
  targetDashboard: 'admin',
  metrics: [...ADMIN_METRIC_KEYS],
  timeframe: {
    fromDate: filters.fromDate,
    toDate: filters.toDate,
  },
  granularity: resolveGranularity(filters.fromDate, filters.toDate),
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
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator <= 0
  ) {
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
  premium_monthly: '#d97706',
  'premium-yearly': '#2563eb',
  premium_yearly: '#2563eb',
};

export const getPlanColor = (
  planCode?: string | null,
  fallbackIndex = 0
): string => {
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
