/**
 * Tiện ích chuẩn hóa và tính toán hiển thị hạn mức và tiến trình sử dụng tài nguyên.
 */
export interface QuotaItemFormatResult {
  current: number;
  max: number;
  isUnlimited: boolean;
  text: string;
  percentage: number;
}

/**
 * Kiểm tra xem hạn mức có phải là không giới hạn (Unlimited) hay không.
 * Theo quy ước nghiệp vụ backend: max = 0 hoặc undefined/null là không giới hạn.
 */
export function isUnlimitedQuota(max?: number | null): boolean {
  return max === 0 || max === undefined || max === null;
}

/**
 * Format thông tin số lượng hiện tại / tối đa kèm tính toán thanh tiến trình an toàn.
 * Tránh lỗi chia cho 0 và đảm bảo số 0 không bị coi là falsy.
 */
export function formatQuotaItem(
  currentRaw?: number | null,
  maxRaw?: number | null,
  unit?: string
): QuotaItemFormatResult {
  const current = currentRaw ?? 0;
  const isUnlimited = isUnlimitedQuota(maxRaw);
  const max = isUnlimited ? 0 : (maxRaw as number);
  const unitSuffix = unit ? ` ${unit}` : '';

  const text = isUnlimited
    ? `${current} / ∞${unitSuffix}`
    : `${current} / ${max}${unitSuffix}`;

  const percentage = isUnlimited
    ? 0
    : Math.min(100, Math.max(0, (current / (max || 1)) * 100));

  return {
    current,
    max,
    isUnlimited,
    text,
    percentage,
  };
}
