# Research & Technical Decisions: Admin Observability (034)

**Feature**: `034-admin-observability`
**Date**: 2026-10-16
**Status**: Completed

## 1. Múi giờ và Tính toán khoảng ngày (Date Range & Timezone Strategy)

### Decision
Sử dụng `Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })` để sinh chuỗi ngày `YYYY-MM-DD` theo giờ lịch Việt Nam (+07:00). Tuyệt đối **không** dùng `date.toISOString().slice(0, 10)` hoặc `new Date('YYYY-MM-DD')` trong code tính toán bộ lọc vì JS hiểu chuỗi không kèm giờ là nửa đêm UTC, gây lệch lùi 1 ngày hoặc 7 tiếng so với ngày lịch Việt Nam.

### Rationale
- Backend hợp đồng yêu cầu mọi ngày gửi lên là ngày lịch Việt Nam (+07:00), cận `[from, to)` bao gồm trọn vẹn cả hai ngày.
- Backend xử lý ngày: `from` = 00:00 VN ngày đầu, `to` = 00:00 VN ngày kế tiếp ngày cuối. Nếu frontend gửi chuỗi parse từ UTC, giao dịch phát sinh từ 00:00 đến 06:59:59 sáng giờ VN sẽ bị bỏ sót hoặc nhảy sang ngày trước.
- Định dạng `en-CA` tự nhiên sinh ra định dạng chuẩn `YYYY-MM-DD`.

### Presets Implementation
- **Hôm nay**: `fromDate = todayVN()`, `toDate = todayVN()`
- **Tháng này**: `fromDate = startOfMonthVN()` (ngày 01 tháng hiện tại VN), `toDate = todayVN()`
- **30 ngày gần nhất**: `fromDate = daysAgoVN(29)`, `toDate = todayVN()` (đủ 30 ngày lịch tính cả hôm nay)
- **Tùy chọn**: Người dùng chọn qua `react-day-picker` Calendar component.

---

## 2. Xử lý lỗi 400 và Loại bỏ Fallback im lặng (Error Boundary & Validation)

### Decision
Loại bỏ hoàn toàn cơ chế `normalizeDashboardFilters` tự động thay thế khoảng ngày sai/đảo chiều bằng mặc định 30 ngày. Khi người dùng chọn khoảng ngày đảo chiều (`fromDate > toDate`), validate ngay tại frontend trước khi cập nhật URL, đồng thời nếu API trả về HTTP 400 (ví dụ truy cập từ URL gõ tay sai), hiển thị trực tiếp thông báo lỗi tiếng Việt từ `error.response.data.message` và giữ nguyên trạng thái input để người dùng chỉnh sửa.

### Rationale
- Trước đây, khi nhập khoảng ngày sai, frontend im lặng chuyển về 30 ngày cuốn khiến admin nhầm tưởng số liệu trên màn hình là kết quả của khoảng ngày mình vừa nhập.
- Backend hiện đã có validation nghiêm ngặt và trả về thông báo lỗi tiếng Việt chuẩn hóa:
  - `"Định dạng ngày bắt đầu (fromDate) không hợp lệ. Vui lòng sử dụng YYYY-MM-DD."`
  - `"Ngày bắt đầu (fromDate) không được sau ngày kết thúc (toDate)."`

---

## 3. Kiến trúc Quản lý State & Query Cache (TanStack React Query)

### Decision
- **Query Keys phân tách rõ ràng**:
  - `['admin-dashboard', 'overview']`: Snapshot tĩnh mới nhất (~15 phút/lần). Không truyền date params.
  - `['admin-dashboard', 'payos-reconciliation', fromDate, toDate]`: Gọi trực tiếp endpoint `GET /api/v1/admin/dashboard/payos-reconciliation` với khoảng ngày đang chọn.
  - `['admin-dashboard', 'ai-margin', fromDate, toDate]`
  - `['admin-dashboard', 'analytics', fromDate, toDate]`
  - `['admin-dashboard', 'subscriptions', 'distribution', fromDate, toDate]`
  - `['admin-dashboard', 'subscriptions', 'revenue-breakdown', fromDate, toDate]`
  - `['admin-dashboard', 'subscriptions', 'renewal-stats', fromDate, toDate]`
  - `['admin-dashboard', 'ai', 'usage-by-operation', fromDate, toDate]`
  - `['admin-dashboard', 'ai', 'error-breakdown', fromDate, toDate]`
  - `['admin-dashboard', 'ai-events', aiStatus, aiPage]`
  - `['admin-transactions', { status, fromDate, toDate, page, limit }]`
  - `['admin-transactions', 'detail', id]`
  - `['admin-activity-events', { userId, activityType, fromDate, toDate, page, limit }]`
- **Tất cả các query theo kỳ đều sử dụng chung một cặp `{ fromDate, toDate }`** lấy từ URL search parameters, đảm bảo tính nhất quán trên toàn bộ dashboard.

---

## 4. Cơ chế Đối soát Giao dịch payOS (Reconciliation Actions Pattern)

### Decision
- 4 endpoint hành động đối soát (`POST .../resolve-paid`, `resolve-cancelled`, `resolve-creation-failed`, `retry-investigation`) trả về HTTP 200 **không có khối `data`**, chỉ có `{ "message": "..." }`.
- Frontend xử lý:
  1. Hiển thị dialog xác nhận có form nhập `reason` (với `resolve-paid` bắt buộc thêm `reference` và `paymentLinkId`).
  2. Bấm xác nhận -> thực hiện Mutation POST.
  3. Khi thành công: Đóng dialog -> Toast `message` thành công -> Gọi ngay `invalidateQueries(['admin-transactions'])` và refetch `['admin-transactions', 'detail', id]`.
  4. Nếu sau khi refetch trạng thái chưa đổi (do ghi bất đồng bộ phía backend), hẹn giờ 1000ms refetch lại 1 lần cuối.
- Điều kiện bật/tắt nút hành động ở client (khớp ma trận BE trong `payment_resolution_uc.go`):
  - `pending`, `creating`, `reconciling`, `reconciliation_required`, `investigation_required`: bật paid + cancelled + retry; riêng `resolve-creation-failed` chỉ bật với `creating`/`reconciliation_required`/`investigation_required`.
  - `cancelled`, `expired`, `failed_legacy`: chỉ bật `resolve-paid` (cứu tiền về muộn).
  - `creation_failed`, `refunded`, `success`, `unknown`: khoá cả 4 nút.
  - Nút bị khoá kèm tooltip nêu lý do; backend trả 400 nếu gọi vượt ma trận.

---

## 5. Map 11 Trạng thái Giao dịch payOS (Status Badges & Labels)

### Decision
Xây dựng một module dùng chung `src/features/admin/utils/transactions.ts` định nghĩa bảng map 11 trạng thái:
| Status Code | Nhãn Tiếng Việt | Màu sắc Badge |
|---|---|---|
| `pending` | Chờ thanh toán | Vàng cam (`amber`) |
| `success` | Thành công | Xanh lục (`emerald/green`) |
| `failed_legacy` | Thất bại (cũ) | Đỏ (`rose/destructive`) |
| `creating` | Đang tạo link | Xanh lam nhạt (`sky`) |
| `reconciliation_required` | Cần đối soát | Tím / Cảnh báo đậm (`violet/purple`) |
| `reconciling` | Đang đối soát | Xanh dương chuyển động (`blue`) |
| `creation_failed` | Tạo link thất bại | Đỏ cam (`orange/destructive`) |
| `cancelled` | Đã huỷ | Xám trung tính (`slate/muted`) |
| `expired` | Hết hạn | Xám viền (`zinc`) |
| `investigation_required` | Cần điều tra | Đỏ đậm / Viền nguy hiểm (`destructive`) |
| `refunded` | Đã hoàn tiền | Chàm (`indigo`) |
| `unknown` | Không xác định | Xám nhạt (`outline`) |

---

## 6. Xử lý Dropdown Lọc "Tất cả" (Sentinel Value Handling)

### Decision
Khắc phục triệt để lỗi so sánh giá trị mặc định của dropdown (`'Tất cả'` vs `'all'`).
- Giá trị chọn trong component UI là `""` hoặc `"all"`.
- Khi người dùng chọn "Tất cả", hàm serialize query param sẽ **xóa hoàn toàn key đó khỏi URLSearchParams** (ví dụ không gửi `activityType`, không gửi `status`).
- Tránh tuyệt đối gửi chuỗi `'Tất cả'` hoặc `'all'` lên backend, vì backend sẽ coi đó là giá trị không hợp lệ (hoặc bỏ qua/trả lỗi 400).
