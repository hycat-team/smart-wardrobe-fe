import {
  differenceInCalendarDays,
  format,
  isAfter,
  isValid,
  parse,
  startOfDay,
  subDays,
} from 'date-fns';
import {
  ADMIN_METRIC_KEYS,
  DashboardFilters,
  DashboardSearchParams,
  DynamicQueryRequest,
} from '../types';

export const DASHBOARD_DATE_FORMAT = 'yyyy-MM-dd';
export const DASHBOARD_DEFAULT_LOOKBACK_DAYS = 30;
export const DASHBOARD_MAX_DATE_RANGE_DAYS = 730;
export const DASHBOARD_AI_EVENTS_LIMIT = 20;

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const parseDateParam = (value: string | undefined) => {
  if (!value) return null;
  const parsed = parse(value, DASHBOARD_DATE_FORMAT, new Date());
  if (!isValid(parsed) || format(parsed, DASHBOARD_DATE_FORMAT) !== value) {
    return null;
  }
  return startOfDay(parsed);
};

export const getDefaultDashboardDateRange = (now = new Date()) => {
  const today = startOfDay(now);
  return {
    fromDate: format(subDays(today, DASHBOARD_DEFAULT_LOOKBACK_DAYS), DASHBOARD_DATE_FORMAT),
    toDate: format(today, DASHBOARD_DATE_FORMAT),
  };
};

export const normalizeDashboardFilters = (
  params: DashboardSearchParams,
  now = new Date(),
): DashboardFilters => {
  const fallback = getDefaultDashboardDateRange(now);
  const today = startOfDay(now);
  const rawFrom = firstValue(params.fromDate);
  const rawTo = firstValue(params.toDate);
  const parsedFrom = parseDateParam(rawFrom);
  const parsedTo = parseDateParam(rawTo);

  const hasValidRange =
    parsedFrom !== null &&
    parsedTo !== null &&
    !isAfter(parsedFrom, parsedTo) &&
    !isAfter(parsedTo, today) &&
    differenceInCalendarDays(parsedTo, parsedFrom) <= DASHBOARD_MAX_DATE_RANGE_DAYS;

  const page = Number.parseInt(firstValue(params.aiPage) ?? '1', 10);

  return {
    fromDate: hasValidRange ? format(parsedFrom, DASHBOARD_DATE_FORMAT) : fallback.fromDate,
    toDate: hasValidRange ? format(parsedTo, DASHBOARD_DATE_FORMAT) : fallback.toDate,
    aiStatus: firstValue(params.aiStatus)?.trim() ?? '',
    aiPage: Number.isFinite(page) && page > 0 ? page : 1,
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

export const formatDashboardDateTime = (value?: string | null) => {
  if (!value) return 'Chưa cập nhật';
  const date = new Date(value);
  if (!isValid(date)) return 'Chưa cập nhật';
  return new Intl.DateTimeFormat('vi-VN', {
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
