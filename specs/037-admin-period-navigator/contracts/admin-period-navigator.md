# Interface Contracts: Bộ Chọn Kỳ Dùng Chung (037-admin-period-navigator)

**Feature**: `037-admin-period-navigator` | **Date**: 2026-10-20 | **Status**: Approved

## 1. Hợp Đồng Tham Số URL Query (URL Search Parameters Contract)

Áp dụng đồng bộ cho cả 3 trang quản trị:
- `/admin/dashboard`
- `/admin/activity-events`
- `/admin/transactions`

| Tham số | Kiểu | Bắt buộc | Giá trị hợp lệ | Mặc định khi vắng mặt | Mô tả |
|---|---|---|---|---|---|
| `preset` | string | Không | `today`, `this_week`, `this_month`, `this_year`, `custom` | `this_month` | Tên chu kỳ đã chọn |
| `fromDate` | string | Không | `YYYY-MM-DD` (Giờ VN) | Ngày 01 tháng hiện tại | Ngày bắt đầu khoảng thời gian (bao gồm trọn ngày) |
| `toDate` | string | Không | `YYYY-MM-DD` (Giờ VN) | Ngày hôm nay | Ngày kết thúc khoảng thời gian (bao gồm trọn ngày) |
| `page` | number | Không | Số nguyên $\ge 1$ | `1` | Trang phân trang hiện tại. **Khi đổi kỳ, tự động reset về `1`** |

### Ví dụ URL:
1. Mặc định truy cập: `/admin/dashboard` $\rightarrow$ Tương đương `?preset=this_month&fromDate=2026-10-01&toDate=2026-10-20`
2. Chọn Tuần này: `/admin/activity-events?preset=this_week&fromDate=2026-10-19&toDate=2026-10-20&page=1`
3. Lùi 1 tháng: `/admin/transactions?preset=this_month&fromDate=2026-09-01&toDate=2026-09-30&page=1`
4. Chọn Tuỳ chọn: `/admin/dashboard?preset=custom&fromDate=2026-10-05&toDate=2026-10-15`

---

## 2. Hợp Đồng Component React (`AdminPeriodNavigatorProps`)

Vị trí: `src/features/admin/components/AdminPeriodNavigator.tsx`

```ts
export interface AdminPeriodNavigatorProps {
  /**
   * Preset hiện tại. Nếu không truyền, mặc định là 'this_month'.
   */
  preset?: PeriodPreset;

  /**
   * Ngày bắt đầu kỳ hiện tại theo định dạng YYYY-MM-DD.
   */
  fromDate: string;

  /**
   * Ngày kết thúc kỳ hiện tại theo định dạng YYYY-MM-DD.
   */
  toDate: string;

  /**
   * Callback kích hoạt khi người dùng thay đổi kỳ (bấm preset, bấm mũi tên, hoặc áp dụng tùy chọn).
   */
  onChange: (period: {
    preset: PeriodPreset;
    fromDate: string;
    toDate: string;
  }) => void;

  /**
   * Cờ biểu thị trạng thái đang tải dữ liệu để hiển thị animation hoặc spinner nhẹ.
   */
  isLoading?: boolean;

  /**
   * CSS class tùy biến thêm cho container nếu cần.
   */
  className?: string;
}
```

---

## 3. Hợp Đồng Hàm Tiện Ích (`src/features/admin/utils/period.ts`)

```ts
/**
 * Trả về khoảng ngày chuẩn cho một preset tại thời điểm tham chiếu now (mặc định là hiện tại).
 */
export function getPeriodDateRange(
  preset: PeriodPreset,
  now?: Date
): { fromDate: string; toDate: string };

/**
 * Tính toán mốc ngày mới khi người dùng bấm mũi tên ◀ (prev) hoặc ▶ (next).
 * Kẹp toDate <= todayVN() khi tiến về hiện tại và trả về isAtCurrent = true.
 */
export function navigatePeriod(
  direction: 'prev' | 'next',
  current: { preset: PeriodPreset; fromDate: string; toDate: string },
  now?: Date
): { preset: PeriodPreset; fromDate: string; toDate: string; isAtCurrent: boolean };

/**
 * Kiểm tra xem khoảng ngày hiện tại đã chạm mốc hiện tại hay chưa (để disable nút ▶).
 */
export function isAtCurrentPeriod(
  preset: PeriodPreset,
  toDate: string,
  now?: Date
): boolean;

/**
 * Tạo nhãn hiển thị trực quan dạng:
 * - "Tháng 10/2026 · 01/10 – 20/10/2026"
 * - "Tuần 43/2026 · 19/10 – 20/10/2026"
 * - "Hôm nay · 20/10/2026"
 * - "Năm 2026 · 01/01 – 20/10/2026"
 * - "Tuỳ chọn · 05/10 – 15/10/2026"
 */
export function formatPeriodLabel(
  preset: PeriodPreset,
  fromDate: string,
  toDate: string,
  now?: Date
): string;

/**
 * Parse các query parameters từ URL, tự động fallback về preset 'this_month' nếu thiếu.
 */
export function parsePeriodFromParams(
  params: { preset?: string | null; fromDate?: string | null; toDate?: string | null },
  now?: Date
): { preset: PeriodPreset; fromDate: string; toDate: string };
```

---

## 4. Hợp Đồng Gọi API Backend Tuân Thủ `frontend-guide.md`

Khi gửi yêu cầu lên máy chủ Backend, cả 3 màn hình gửi các query params:

```http
# 1. Activity Events
GET /api/v1/admin/activity-events?fromDate={fromDate}&toDate={toDate}&page={page}&limit={limit}

# 2. Transactions
GET /api/v1/admin/subscriptions/transactions?fromDate={fromDate}&toDate={toDate}&status={status}&page={page}&limit={limit}

# 3. Dashboard Endpoints (7 endpoints theo kỳ)
GET /api/v1/admin/dashboard/payos-reconciliation?fromDate={fromDate}&toDate={toDate}
GET /api/v1/admin/dashboard/ai-margin?fromDate={fromDate}&toDate={toDate}
GET /api/v1/admin/dashboard/subscriptions/distribution?fromDate={fromDate}&toDate={toDate}
GET /api/v1/admin/dashboard/subscriptions/revenue-breakdown?fromDate={fromDate}&toDate={toDate}
GET /api/v1/admin/dashboard/subscriptions/renewal-stats?fromDate={fromDate}&toDate={toDate}
GET /api/v1/admin/dashboard/ai/usage-by-operation?fromDate={fromDate}&toDate={toDate}
GET /api/v1/admin/dashboard/ai/error-breakdown?fromDate={fromDate}&toDate={toDate}
```

- **Quy tắc**: Luôn gửi đủ cả 2 đầu `fromDate` và `toDate` theo định dạng `YYYY-MM-DD`.
- **Phản hồi 400**: Khi nhận mã 400 (ví dụ ngày sai hoặc đảo chiều), hiển thị trực tiếp `message` tiếng Việt từ máy chủ và giữ nguyên input để người dùng điều chỉnh.
