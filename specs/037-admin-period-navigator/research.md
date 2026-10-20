# Technical Research & Architecture Decisions: Bộ Chọn Kỳ Dùng Chung (037-admin-period-navigator)

**Feature**: `037-admin-period-navigator` | **Date**: 2026-10-20 | **Status**: Approved

## 1. Bối cảnh & Vấn đề Cần Giải Quyết

Hiện tại, cả 3 trang giám sát vận hành dành cho Quản trị viên (`/admin/dashboard`, `/admin/activity-events`, `/admin/transactions`) đang có trải nghiệm lọc ngày chưa đồng nhất:
- Dashboard trước đây mặc định 30 ngày cuốn (`DASHBOARD_DEFAULT_LOOKBACK_DAYS = 29`), có các nút chọn "Hôm nay", "Tháng này", "30 ngày" nhưng thiếu "Tuần này", "Năm này", và không có phím điều hướng ◀ ▶ lùi/tiến chu kỳ.
- Trang Activity Events và Transactions có popover chọn ngày nhưng thiếu các preset nhanh và không đồng bộ mặc định.
- Khi người dùng muốn xem tháng trước hoặc tuần trước, họ phải tự mở lịch và click thủ công từng ngày bắt đầu / ngày kết thúc, dễ nhầm lẫn hoặc chọn thiếu ngày cuối kỳ.
- Yêu cầu mới đặt ra: Cung cấp một bộ điều hướng kỳ dùng chung (`AdminPeriodNavigator`) với 5 preset (*Hôm nay*, *Tuần này*, *Tháng này*, *Năm này*, *Tuỳ chọn*), mặc định khi không có query param là *Tháng này*, hai nút mũi tên ◀ ▶ lùi/tiến chu kỳ đầy đủ trong quá khứ và kẹp không vượt quá hôm nay, đồng bộ vào URL query và giữ dữ liệu cũ (`keepPreviousData`) không nháy giật layout hay trượt cuộn trang.

---

## 2. Các Quyết Định Kỹ Thuật (Architecture Decisions)

### Quyết định 1: Chuẩn hóa tính toán ngày theo múi giờ Việt Nam (`Asia/Ho_Chi_Minh`, GMT+7)

- **Vấn đề**: Hàm `new Date('YYYY-MM-DD')` trong JavaScript tự động hiểu chuỗi là nửa đêm UTC (00:00 UTC), dẫn đến khi convert sang giờ Việt Nam (+07:00) hoặc dùng các hàm local date sẽ bị lệch ngày (ví dụ 00:00 UTC ngày 15/10 tương ứng 07:00 ngày 15/10, nhưng `new Date(year, month, day)` lại theo múi giờ máy tính của người dùng).
- **Quyết định**: 
  - Tiếp tục sử dụng hàm `vnDate(date: Date)` sinh chuỗi `YYYY-MM-DD` theo múi giờ `Asia/Ho_Chi_Minh` bằng `Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })`.
  - Phân tích chuỗi ngày `YYYY-MM-DD` qua hàm parse thủ công thành các số nguyên `[year, month, day]` và khởi tạo Date an toàn tại 12:00:00 trưa (tránh biên đổi giờ mùa hè hoặc sai lệch múi giờ cục bộ của trình duyệt).
  - Định dạng chuỗi hiển thị qua `Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', ... })`.
- **Lý do**: Đảm bảo 100% tính toán ngày tháng trên trình duyệt khớp chính xác với quy ước ngày lịch Việt Nam mà backend yêu cầu trong `frontend-guide.md`.

---

### Quyết định 2: Quy tắc tính toán mốc kỳ hiện tại & bước nhảy ◀ ▶

- **Vấn đề**: Các kỳ hiện tại chỉ chạy từ đầu kỳ đến "hôm nay" (vì tương lai chưa xảy ra), nhưng kỳ quá khứ phải là đơn vị đầy đủ.
- **Quy tắc tính mốc hiện tại**:
  - *Hôm nay* (`today`): `fromDate = hôm nay`, `toDate = hôm nay`.
  - *Tuần này* (`this_week`): `fromDate = Thứ Hai của tuần hiện tại`, `toDate = hôm nay`. Tuần được định nghĩa chuẩn Thứ Hai → Chủ Nhật theo chuẩn ISO-8601 và thói quen lịch Việt Nam.
  - *Tháng này* (`this_month`): `fromDate = YYYY-MM-01`, `toDate = hôm nay`.
  - *Năm này* (`this_year`): `fromDate = YYYY-01-01`, `toDate = hôm nay`.
- **Quy tắc bước nhảy ◀ (Lùi kỳ)**:
  - Khi đang ở *Hôm nay*: Lùi 1 ngày: `ngày - 1`.
  - Khi đang ở *Tuần này*: Lùi về tuần trước trọn vẹn: `fromDate = Thứ Hai tuần trước`, `toDate = Chủ Nhật tuần trước` (đủ 7 ngày).
  - Khi đang ở *Tháng này*: Lùi về tháng trước trọn vẹn: `fromDate = ngày 01 tháng trước`, `toDate = ngày cuối cùng của tháng trước` (28/29/30/31 ngày tùy tháng và năm nhuận).
  - Khi đang ở *Năm này*: Lùi về năm trước trọn vẹn: `fromDate = 01/01 năm trước`, `toDate = 31/12 năm trước` (365 hoặc 366 ngày).
  - Khi đang ở *Tuỳ chọn* (`custom`): Tính khoảng cách ngày $N = (\text{toDate} - \text{fromDate}) + 1$. Lùi cả hai đầu đúng $N$ ngày.
- **Quy tắc bước nhảy ▶ (Tiến kỳ) & Kẹp hiện tại (Clamping)**:
  - Kiểm tra điều kiện ở kỳ hiện tại: Nếu `toDate >= hôm nay`, nút ▶ bị `disabled` (không thể click).
  - Khi tiến 1 bước từ quá khứ:
    - Nếu mốc `toDate` sau bước nhảy vượt quá hoặc chạm vào kỳ hiện tại (cùng tuần/tháng/năm hiện tại):
      - Đặt `toDate = hôm nay`.
      - Nút ▶ chuyển sang `disabled`.
  - Với *Tuỳ chọn*: Dịch tiến $N$ ngày. Nếu `toDate + N > hôm nay`, kẹp `toDate = hôm nay`, `fromDate = hôm nay - (N - 1)` (hoặc giữ khoảng cách nếu khả thi, kẹp trần tại `hôm nay`), và vô hiệu hóa nút ▶.

---

### Quyết định 3: Thiết kế Component `AdminPeriodNavigator`

- **Vị trí**: `src/features/admin/components/AdminPeriodNavigator.tsx`.
- **Props interface**:
  ```ts
  export interface AdminPeriodNavigatorProps {
    preset?: PeriodPreset;
    fromDate: string;
    toDate: string;
    onChange: (period: { preset: PeriodPreset; fromDate: string; toDate: string }) => void;
    isLoading?: boolean;
    className?: string;
  }
  ```
- **Cấu trúc giao diện**:
  - Khối điều khiển flexbox co giãn:
    1. **Nút mũi tên ◀**: Icon `ChevronLeft`, `aria-label="Kỳ trước"`, click thực hiện lùi kỳ ngay lập tức.
    2. **Nhóm Preset Pills**: Thanh nút dạng pill chứa 5 lựa chọn: *Hôm nay | Tuần này | Tháng này | Năm này | Tuỳ chọn*.
       - Preset đang chọn có kiểu `variant="default"` hoặc active styling nổi bật.
       - Khi bấm vào các preset cố định (Hôm nay, Tuần này, Tháng này, Năm này), gọi `onChange` ngay lập tức.
    3. **Nút mũi tên ▶**: Icon `ChevronRight`, `aria-label="Kỳ sau"`, `disabled={isAtCurrentPeriod}`, click thực hiện tiến kỳ ngay lập tức.
    4. **Nhãn kỳ (`PeriodLabel`)**: Hiển thị text dạng `"Tháng 10/2026 · 01/10 – 20/10/2026"`, font chữ đậm vừa, màu sắc rõ nét.
    5. **Bộ chọn lịch Tuỳ chọn (`CustomDatePopover`)**:
       - Khi preset là "Tuỳ chọn" hoặc khi bấm vào nhãn kỳ/nút tùy chọn, mở Popover chứa Calendar (`react-day-picker`).
       - `disabled={{ after: new Date() }}` (chặn chọn ngày tương lai).
       - Có nút "Hủy" / "Đặt lại" và nút "Áp dụng" (`disabled` khi chưa chọn đủ 2 đầu hoặc ngày không hợp lệ).
- **Khả năng tiếp cận (Accessibility)**:
  - Hỗ trợ đầy đủ phím Tab, Enter, Space.
  - Mọi nút đều có `aria-label` tiếng Việt rõ ràng ("Kỳ trước", "Kỳ sau", "Chọn ngày tùy chọn", v.v.).

---

### Quyết định 4: Cơ chế Đồng bộ URL & Tránh giật nháy layout (Smooth Transitions)

- **Vấn đề**:
  - Khi thay đổi URL search params trong Next.js App Router, nếu không xử lý cẩn thận, Next.js có thể kích hoạt Suspense boundary khiến trang giật skeleton trắng toàn màn hình hoặc cuộn trang lên đỉnh đầu.
- **Giải pháp**:
  - Dùng `router.push(nextUrl, { scroll: false })` để ngăn chặn trình duyệt cuộn trang.
  - Sử dụng `placeholderData: keepPreviousData` của TanStack Query cho các hook truy vấn (`useTransactions`, `useActivityEvents`, `useDashboardPayOSReconciliation`, v.v.). Nhờ đó, dữ liệu cũ vẫn hiển thị trên bảng trong khi dữ liệu mới đang tải ngầm.
  - Hiển thị chỉ báo tải nhẹ: Icon `RefreshCw` xoay nhẹ nhàng trên thanh công cụ hoặc thanh tiến trình mờ nhỏ phía trên bảng dữ liệu, thay vì unmount bảng dữ liệu để hiển thị skeleton.
  - Tự động đặt lại `page = 1` mỗi khi `preset`, `fromDate`, hoặc `toDate` thay đổi (đảm bảo không rơi vào trang rỗng khi kỳ mới có ít trang hơn).

---

### Quyết định 5: Xử lý Giá trị Mặc định Khi Không Có Tham Số URL

- **Vấn đề**: Theo quy định mới: "Mặc định khi không có query param: Tháng này".
- **Giải pháp**:
  - Tại hàm khởi tạo và parse params (cả phía Server Component `DashboardData` và phía Client Component `useSearchParams`):
    - Nếu cả `fromDate` và `toDate` đều vắng mặt trên URL:
      - Tự động gán `preset = 'this_month'`.
      - Tự động gán `fromDate = startOfMonthVN()` và `toDate = todayVN()`.
    - Nếu URL đã có `fromDate` và `toDate`:
      - Nếu có `preset` hợp lệ: giữ nguyên `preset`.
      - Nếu không có `preset`: đối chiếu xem khoảng ngày có khớp chính xác với preset nào không (today, this_week, this_month, this_year); nếu không khớp, gán `preset = 'custom'`.

---

## 3. Đánh Giá Rủi Ro & Biện Pháp Kiểm Soát

| Rủi ro | Mức độ | Biện pháp kiểm soát |
|---|---|---|
| Lệch ngày cuối tháng của tháng trước (ví dụ 28, 29, 30, 31) | Thấp | Dùng hàm `new Date(year, month, 0)` trong JS để lấy chính xác ngày cuối cùng của tháng trước đó theo lịch. |
| Ngày tương lai bị chọn qua can thiệp DOM | Rất thấp | Chặn ở 2 tầng: tầng UI (`disabled={{ after: new Date() }}`) và tầng logic validation (`clampDateToToday`). |
| 2 thẻ KPI card `totalBrands`/`pendingReviewBrands` vô tình bị bật lại | Nghiêm ngặt | Giữ nguyên trạng thái comment trong `DashboardKpiGrid.tsx`. |
| Mất tính đồng bộ giữa 3 trang | Thấp | Toàn bộ logic tính toán kỳ được đóng gói vào thư viện dùng chung `src/features/admin/utils/period.ts` và tái sử dụng component `AdminPeriodNavigator`. |
| Mâu thuẫn token Bearer hardcode | Nghiêm ngặt | Tiếp tục dùng 100% `axiosInstance` tự động gửi cookie và `serverFetch` đọc cookie từ Next.js headers. |
