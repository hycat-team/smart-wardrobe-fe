/**
 * 5 định danh preset chu kỳ chuẩn hóa cho bộ điều hướng admin.
 */
export type PeriodPreset =
  | 'today'
  | 'this_week'
  | 'this_month'
  | 'this_year'
  | 'custom';

/**
 * Cấu trúc trạng thái khoảng thời gian đồng bộ với URL query parameters.
 */
export interface PeriodRange {
  preset: PeriodPreset;
  fromDate: string; // YYYY-MM-DD theo giờ VN
  toDate: string;   // YYYY-MM-DD theo giờ VN
}

/**
 * Hướng điều hướng kỳ (Lùi ◀ hoặc Tiến ▶).
 */
export type NavigationDirection = 'prev' | 'next';

/**
 * Kết quả tính toán sau khi di chuyển tiến/lùi kỳ.
 */
export interface NavigationResult {
  preset: PeriodPreset;
  fromDate: string;
  toDate: string;
  isAtCurrent: boolean; // True nếu toDate đã chạm mốc hôm nay (disable nút ▶)
}

/**
 * Thông tin nhãn hiển thị trực quan định dạng chuẩn.
 */
export interface PeriodLabelInfo {
  unitTitle: string;     // "Tháng 10/2026", "Tuần 43/2026", "Năm 2026", "Hôm nay", "Tuỳ chọn"
  dateRangeText: string; // "01/10 – 20/10/2026"
  formattedText: string; // "Tháng 10/2026 · 01/10 – 20/10/2026"
}

/**
 * Interface cho component AdminPeriodNavigator.
 */
export interface AdminPeriodNavigatorProps {
  preset?: PeriodPreset;
  fromDate: string;
  toDate: string;
  onChange: (period: {
    preset: PeriodPreset;
    fromDate: string;
    toDate: string;
  }) => void;
  isLoading?: boolean;
  className?: string;
}
