# Research & Technical Decisions: Đồng Bộ Kỳ Báo Cáo Cho Bảng Hiệu Quả Chi Phí AI (038-fix-dashboard-ai-margin)

**Date**: 2026-10-21  
**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## 1. Bối cảnh & Nguyên nhân lỗi (Problem Analysis)

### Hiện tượng
- Người dùng khi vào trang Dashboard quản trị (`/admin/dashboard`), mặc định kỳ chọn là "Tháng này" (ví dụ: `01/10/2026` đến `21/10/2026`).
- Tiêu đề phụ của bảng `AIMarginPanel` (`AIMarginPanel.tsx:108`) hiển thị:
  `Kỳ: 01/10/2026 – 21/10/2026`.
- Tuy nhiên, số liệu hiển thị thực tế bên trong lại là kết quả của **30 ngày trôi gần nhất** (`21/09/2026 – 21/10/2026`), gây mâu thuẫn lớn giữa nhãn hiển thị và số liệu thực.

### Nguyên nhân gốc (Root Cause)
1. **Quy định Backend API**:
   Theo tài liệu `specs/029-admin-observability/frontend-guide.md` (dòng 504–506):
   - Endpoint `/admin/dashboard/overview` trả về trường `aiMargin` là **snapshot 30 ngày gần nhất cố định**, endpoint này không nhận tham số lọc kỳ `fromDate`/`toDate`.
   - Endpoint riêng `/admin/dashboard/ai-margin?fromDate=...&toDate=...` mới là endpoint hỗ trợ tham số lọc theo kỳ tùy biến.
2. **Logic rẽ nhánh sai ở Frontend**:
   - `DashboardData.tsx` sử dụng hàm `hasCustomDashboardDateRange(filters)` để quyết định có gọi endpoint `/admin/dashboard/ai-margin` hay không:
     ```ts
     const shouldFetchCustomMargin = hasCustomDashboardDateRange(filters);
     // ...
     shouldFetchCustomMargin
       ? serverFetch<AIMarginAnalytics>(`/admin/dashboard/ai-margin?...`)
       : Promise.resolve(null)
     // ...
     aiMargin: shouldFetchCustomMargin ? customMargin : overview?.aiMargin ?? null
     ```
   - Hàm `hasCustomDashboardDateRange` so sánh `filters` với `getDefaultDashboardDateRange()` (vốn trả về tháng này). Khi ở kỳ mặc định "Tháng này", `shouldFetchCustomMargin` là `false`!
   - Kết quả: Khi ở kỳ "Tháng này", FE **không gọi** `/admin/dashboard/ai-margin` mà fallback lấy `overview.aiMargin` (30 ngày cố định).
   - Trên client (`DashboardClient.tsx`), prop `hasCustomDateRange` cũng nhận giá trị `false`, dẫn tới `useDashboardAIMargin` bị vô hiệu hóa (`enabled: false`), không refetch khi bấm "Làm mới", và bảng hiển thị fallback `overview?.aiMargin`.

---

## 2. Quyết định kỹ thuật (Technical Decisions)

### Quyết định 1: Luôn truy vấn endpoint `/admin/dashboard/ai-margin` ở SSR và CSR
- **Quyết định**:
  - Tại `DashboardData.tsx` (SSR): Luôn gọi `serverFetch<AIMarginAnalytics>('/admin/dashboard/ai-margin?' + marginParams.toString(), { cache: 'no-store' })`. Gán `initialData.aiMargin` bằng dữ liệu trả về từ lệnh gọi này. Tuyệt đối không fallback sang `overview?.aiMargin`.
  - Tại `DashboardClient.tsx` (CSR): Loại bỏ cờ `hasCustomDateRange`. Hook `useDashboardAIMargin(filters, { initialData: initialData.aiMargin })` luôn được kích hoạt (`enabled: true`).
- **Lý do**:
  - Đảm bảo tính nhất quán tuyệt đối: kỳ nào thì gọi đúng endpoint theo kỳ đó.
  - Loại bỏ hoàn toàn sự phân mảnh logic giữa "kỳ mặc định" và "kỳ tùy biến".
  - Giảm độ phức tạp nhận thức (cognitive load) của mã nguồn.
- **Giải pháp thay thế đã cân nhắc**:
  - *Thay thế 1*: Nhờ BE sửa endpoint `/admin/dashboard/overview` nhận tham số `fromDate`/`toDate` cho `overview.aiMargin`.
    *Bị loại bỏ vì*: Vi phạm thiết kế backend của contract `029-admin-observability` (nơi overview được định nghĩa là snapshot cố định 30 ngày cho các KPI tổng quan nhanh), và yêu cầu sửa BE không cần thiết khi endpoint `/admin/dashboard/ai-margin` đã có sẵn và hoạt động hoàn hảo.
  - *Thay thế 2*: Giữ lại cờ `hasCustomDateRange` nhưng sửa điều kiện so sánh.
    *Bị loại bỏ vì*: Cờ này là tàn dư kỹ thuật khi chưa phân tách độc lập các khối query. Khi phân tách, mọi panel theo kỳ đều cần có query chuyên biệt.

### Quyết định 2: Giữ nguyên phạm vi của KPI Card "Biên lợi nhuận AI"
- **Quyết định**:
  - Thẻ KPI "Biên lợi nhuận AI" trong `DashboardKpiGrid` tiếp tục hiển thị số liệu từ `overview?.kpiCards?.netAiMarginVnd` (snapshot 30 ngày) và giữ nguyên nhãn chú thích helper text ("30 ngày").
- **Lý do**:
  - Thẻ KPI trên cùng phản ánh sức khỏe tài chính tổng quan 30 ngày gần nhất (không phụ thuộc việc người dùng xem chi tiết 1 tuần hay 1 ngày).
  - Bảng "Hiệu quả chi phí AI" bên dưới là bảng phân tích sâu theo kỳ được chọn.
  - Việc này đảm bảo không gây xáo trộn thiết kế tổng thể của trang Dashboard.

### Quyết định 3: Dọn dẹp mã nguồn thừa (Dead Code Elimination)
- **Quyết định**:
  - Xóa hàm `hasCustomDashboardDateRange` trong `src/features/admin/utils/dashboard.ts`.
  - Loại bỏ prop `hasCustomDateRange` khỏi `DashboardClientProps`.
  - Xóa bỏ tất cả các nhánh điều kiện ternary kiểm tra `hasCustomDateRange` trong `DashboardClient.tsx`.
- **Lý do**:
  - Không còn bất kỳ vị trí nào trong dự án cần kiểm tra xem bộ lọc có phải mặc định hay không.
  - Giảm thiểu diện tích bề mặt lỗi (bug surface) và nâng cao khả năng bảo trì.

---

## 3. Đánh giá rủi ro & Hiệu năng (Risk & Performance Assessment)

- **Số lượng request**: Tăng thêm 1 request `/admin/dashboard/ai-margin` khi tải trang ở kỳ mặc định. Tuy nhiên, request này được thực hiện song song trong `Promise.all` tại SSR, thời gian phản hồi bổ sung gần như bằng 0 (chạy song song với `analytics`, `aiEvents`, `payosReconciliation`).
- **Khả năng tương thích ngược**: Không làm thay đổi bất kỳ kiểu dữ liệu (TypeScript interface) hay hợp đồng API nào giữa Client và Backend.
- **Ảnh hưởng đến các màn hình khác**: Không ảnh hưởng đến `/admin/activity-events` hay `/admin/transactions`.
