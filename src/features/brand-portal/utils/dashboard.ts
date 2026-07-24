import {
  differenceInCalendarDays,
  format,
  isAfter,
  isValid,
  parse,
  startOfDay,
  subDays,
} from 'date-fns';
import type {
  BrandDashboardFilters,
  BrandDashboardSearchParams,
  BrandDynamicQueryRequest,
  BrandSampleOption,
} from '../types';
import { BRAND_METRIC_KEYS } from '../types';

export const BRAND_DASHBOARD_DATE_FORMAT = 'yyyy-MM-dd';
export const BRAND_DASHBOARD_DEFAULT_LOOKBACK_DAYS = 30;
export const BRAND_DASHBOARD_MAX_DATE_RANGE_DAYS = 730;
export const BRAND_DASHBOARD_FEEDBACK_LIMIT = 20;

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const parseDateParam = (value: string | undefined) => {
  if (!value) return null;
  const parsed = parse(value, BRAND_DASHBOARD_DATE_FORMAT, new Date());
  if (
    !isValid(parsed) ||
    format(parsed, BRAND_DASHBOARD_DATE_FORMAT) !== value
  ) {
    return null;
  }
  return startOfDay(parsed);
};

export const getDefaultBrandDashboardDateRange = (now = new Date()) => {
  const today = startOfDay(now);
  return {
    fromDate: format(
      subDays(today, BRAND_DASHBOARD_DEFAULT_LOOKBACK_DAYS),
      BRAND_DASHBOARD_DATE_FORMAT,
    ),
    toDate: format(today, BRAND_DASHBOARD_DATE_FORMAT),
  };
};

export const normalizeBrandDashboardFilters = (
  params: BrandDashboardSearchParams,
  now = new Date(),
): BrandDashboardFilters => {
  const fallback = getDefaultBrandDashboardDateRange(now);
  const today = startOfDay(now);
  const parsedFrom = parseDateParam(firstValue(params.fromDate));
  const parsedTo = parseDateParam(firstValue(params.toDate));
  const hasValidRange =
    parsedFrom !== null &&
    parsedTo !== null &&
    !isAfter(parsedFrom, parsedTo) &&
    !isAfter(parsedTo, today) &&
    differenceInCalendarDays(parsedTo, parsedFrom) <=
      BRAND_DASHBOARD_MAX_DATE_RANGE_DAYS;
  const page = Number.parseInt(firstValue(params.feedbackPage) ?? '1', 10);

  return {
    fromDate: hasValidRange
      ? format(parsedFrom, BRAND_DASHBOARD_DATE_FORMAT)
      : fallback.fromDate,
    toDate: hasValidRange
      ? format(parsedTo, BRAND_DASHBOARD_DATE_FORMAT)
      : fallback.toDate,
    sampleId: firstValue(params.sampleId)?.trim() ?? '',
    feedbackPage: Number.isFinite(page) && page > 0 ? page : 1,
  };
};

export const buildBrandAnalyticsRequest = (
  brandId: string,
  filters: Pick<BrandDashboardFilters, 'fromDate' | 'toDate'>,
): BrandDynamicQueryRequest => ({
  targetDashboard: 'brand',
  brandId,
  metrics: [...BRAND_METRIC_KEYS],
  timeframe: {
    fromDate: filters.fromDate,
    toDate: filters.toDate,
  },
  granularity: 'day',
  compareWithPrevious: false,
});

export const selectEffectiveSampleId = (
  requestedSampleId: string,
  samples: BrandSampleOption[],
) => {
  if (samples.some((sample) => sample.id === requestedSampleId)) {
    return requestedSampleId;
  }
  return samples[0]?.id ?? '';
};

export const formatBrandNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value);

export const formatBrandCompactNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

export const formatBrandVND = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

export const formatResponseDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0 giây';
  if (seconds < 60) return `${Math.round(seconds)} giây`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return remainingSeconds > 0
    ? `${minutes} phút ${remainingSeconds} giây`
    : `${minutes} phút`;
};

export const formatBrandDashboardDateTime = (value?: string | null) => {
  if (!value) return 'Chưa cập nhật';
  const date = new Date(value);
  if (!isValid(date)) return 'Chưa cập nhật';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const getErrorStatus = (error: unknown) => {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('response' in error) ||
    typeof error.response !== 'object' ||
    error.response === null ||
    !('status' in error.response)
  ) {
    return undefined;
  }
  return error.response.status;
};

export const isBrandDashboardNotFoundError = (error: unknown) =>
  getErrorStatus(error) === 404;

export const isBrandDashboardForbiddenError = (error: unknown) =>
  getErrorStatus(error) === 403;
