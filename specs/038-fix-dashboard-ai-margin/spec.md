# Feature Specification: Đồng Bộ Kỳ Báo Cáo Cho Bảng Hiệu Quả Chi Phí AI (Sync AI Margin Panel with Selected Period)

**Feature Branch**: `038-fix-dashboard-ai-margin`

**Created**: 2026-10-21

**Status**: Draft

**Input**: User description: "**Nguyên nhân** (`AIMarginPanel.tsx:108` chỉ hiển thị `data.fromDate`–`data.toDate`): Khi kỳ chọn là mặc định "Tháng này" (01/10–21/10), `DashboardData.tsx:109-111` **không gọi** `/admin/dashboard/ai-margin` mà lấy `overview.aiMargin`. BE ghi rõ trong `frontend-guide.md:504-506`: `overview.aiMargin` là **30 ngày gần nhất cố định, không nhận tham số kỳ** → trả về 21/09–21/10, nhưng FE lại gắn nhãn "Kỳ: …" của kỳ đang chọn. `hasCustomDashboardDateRange` chỉ đúng khi kỳ khác mặc định, nên chỉ các kỳ custom/khác tháng mới gọi đúng endpoint. ## Kế hoạch sửa: 1. `src/app/admin/dashboard/components/DashboardData.tsx`: Luôn `serverFetch<AIMarginAnalytics>('/admin/dashboard/ai-margin?fromDate=…&toDate=…')` với `filters.fromDate/toDate` (bỏ điều kiện `shouldFetchCustomMargin`). `initialData.aiMargin = customMargin` (không fallback `overview?.aiMargin`). Bỏ prop `hasCustomDateRange` khi render `DashboardClient`. 2. `src/app/admin/dashboard/components/DashboardClient.tsx`: Bỏ prop `hasCustomDateRange` và mọi nhánh điều kiện theo nó. `useDashboardAIMargin(filters, { initialData: initialData.aiMargin })` luôn enabled. `aiMargin` lấy trực tiếp từ `aiMarginQuery.data`; `refreshAll`, `isRefreshing`, loading/error/retry của panel dùng query này. Giữ `overview` chỉ cho KPI cards. 3. Dọn dead code: Xóa `hasCustomDashboardDateRange` trong `features/admin/utils/dashboard.ts` (không còn nơi dùng). 4. Cập nhật test: `DashboardClient.test.tsx`: bỏ prop `hasCustomDateRange`, kỳ vọng `mockMarginRefetch` **luôn** được gọi khi refresh, và panel nhận dữ liệu từ `useDashboardAIMargin` (không phải `overview.aiMargin`). Chạy `npm test` và `npm run lint`. Lưu ý: KPI card 'Biên lợi nhuận AI' vẫn là snapshot 30 ngày theo thiết kế (helper đã ghi '30 ngày'), chỉ panel 'Hiệu quả chi phí AI' được sửa để khớp kỳ đang chọn."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hiển Thị Đúng Dữ Liệu Kinh Tế AI Theo Kỳ Mặc Định "Tháng Này" (Priority: P1)

Là Quản trị viên hệ thống (Admin), tôi muốn bảng "Hiệu quả chi phí AI" trên Dashboard hiển thị chính xác các chỉ số tài chính (Doanh thu đăng ký, Chi phí token AI, Lợi nhuận ròng, Tỷ suất biên lợi nhuận) và khoảng ngày thực tế của kỳ mặc định "Tháng này" (từ ngày 01 đến ngày hiện tại), để việc theo dõi và đánh giá hiệu quả chi phí AI trong tháng không bị sai lệch với khoảng thời gian được gắn nhãn trên giao diện.

**Why this priority**: Hiện tại khi vào Dashboard ở kỳ mặc định "Tháng này" (ví dụ: 01/10 – 21/10), giao diện lại tái sử dụng dữ liệu snapshot 30 ngày cố định (21/09 – 21/10) từ API tổng quan nhưng hiển thị nhãn ngày của kỳ được chọn, dẫn đến sai lệch nghiêm trọng giữa số liệu tài chính thực tế và khoảng thời gian báo cáo. Đây là lỗi dữ liệu cốt lõi cần khắc phục ngay.

**Independent Test**: Quản trị viên truy cập `/admin/dashboard` không có query parameters (kỳ mặc định "Tháng này", từ ngày mùng 1 tháng hiện tại đến ngày hiện tại). Bảng "Hiệu quả chi phí AI" hiển thị nhãn kỳ "Kỳ: 01/MM/YYYY – DD/MM/YYYY" và các số liệu tài chính được tính toán chính xác theo đúng khoảng ngày này (từ endpoint `/admin/dashboard/ai-margin?fromDate=...&toDate=...`), không còn hiển thị số liệu 30 ngày trôi của `overview.aiMargin`.

**Acceptance Scenarios**:

1. **Given** Quản trị viên truy cập Dashboard với kỳ mặc định "Tháng này" (ví dụ từ `2026-10-01` đến `2026-10-21`), **When** trang tải xong ban đầu (SSR) hoặc trên client, **Then** bảng "Hiệu quả chi phí AI" nhận dữ liệu phân tích được truy vấn riêng cho khoảng ngày `2026-10-01` đến `2026-10-21`, nhãn kỳ hiển thị đúng "Kỳ: 01/10/2026 – 21/10/2026" và khớp với dữ liệu thực tế.
2. **Given** Quản trị viên đang ở kỳ mặc định "Tháng này", **When** kiểm tra nguồn dữ liệu nạp ban đầu của `DashboardData`, **Then** hệ thống gọi endpoint phân tích kinh tế AI có đủ tham số `fromDate` và `toDate` của kỳ đang chọn thay vì fallback sang `overview.aiMargin` (vốn là 30 ngày cố định).

---

### User Story 2 - Luôn Đồng Bộ & Tự Động Làm Mới Bảng Chi Phí AI Cho Mọi Kỳ Lọc (Priority: P1)

Là Quản trị viên hệ thống, tôi muốn bảng "Hiệu quả chi phí AI" luôn tự động cập nhật và làm mới dữ liệu cho bất kỳ kỳ thời gian nào tôi chọn (Hôm nay, Tuần này, Tháng này, Năm này, hoặc Tùy chọn) và khi tôi bấm nút "Làm mới", để số liệu luôn tươi mới và nhất quán với các khối dữ liệu khác.

**Why this priority**: Trước đây cơ chế làm mới và query client chỉ kích hoạt gọi API riêng cho AI margin khi kỳ lọc khác mặc định (`hasCustomDateRange = true`). Do đó khi ở kỳ mặc định, bấm "Làm mới" bảng AI margin không refetch độc lập mà dựa vào query tổng quan. Việc thống nhất query client luôn hoạt động giúp luồng dữ liệu nhất quán, dễ dự đoán và đơn giản hóa logic quản lý trạng thái.

**Independent Test**: Ở bất kỳ kỳ lọc nào (cả mặc định lẫn tùy chỉnh), bấm nút "Làm mới" trên thanh công cụ; query phân tích chi phí AI được gọi lại (refetch), trạng thái đang tải (isRefreshing) phản ánh đồng bộ, và dữ liệu mới nhất được cập nhật lên bảng.

**Acceptance Scenarios**:

1. **Given** Quản trị viên đang xem Dashboard ở kỳ mặc định "Tháng này", **When** bấm nút "Làm mới", **Then** query kinh tế AI (`useDashboardAIMargin`) luôn được kích hoạt tải lại (refetch), bảng chi phí AI hiển thị trạng thái đang cập nhật đồng bộ cùng các khối dữ liệu khác.
2. **Given** Quản trị viên chuyển đổi sang bất kỳ kỳ thời gian nào ("Hôm nay", "Tuần này", "Năm này", "Tùy chọn"), **When** tham số ngày thay đổi trên URL, **Then** query kinh tế AI tự động truy vấn dữ liệu mới tương ứng với khoảng ngày đó.
3. **Given** query kinh tế AI gặp lỗi tải mạng, **When** người dùng bấm nút "Thử lại" trên bảng "Hiệu quả chi phí AI", **Then** hệ thống thực hiện gọi lại chính xác query này mà không ảnh hưởng tới các khối khác trên trang.

---

### User Story 3 - Phân Tách Minh Bạch Phạm Vi Dữ Liệu Giữa KPI Card và Bảng Chi Tiết (Priority: P2)

Là Quản trị viên hệ thống, tôi muốn phân biệt rõ ràng phạm vi thời gian giữa thẻ chỉ số tổng quan (KPI Card) "Biên lợi nhuận AI" (snapshot 30 ngày gần nhất) và bảng chi tiết "Hiệu quả chi phí AI" (phân tích theo kỳ được chọn), để hiểu đúng ngữ cảnh và ý nghĩa của từng số liệu.

**Why this priority**: Thiết kế backend quy định KPI card tổng quan là snapshot cố định 30 ngày gần nhất (đã có chú thích "30 ngày" ở helper text), còn bảng bên dưới là phân tích chi tiết theo kỳ. Việc làm rõ ranh giới này giúp tránh hiểu lầm khi số liệu trên thẻ tổng quan khác với tổng trên bảng chi tiết trong trường hợp kỳ chọn không phải 30 ngày.

**Independent Test**: Quản trị viên quan sát thẻ KPI "Biên lợi nhuận AI" ở hàng trên cùng và bảng "Hiệu quả chi phí AI" ở hàng dưới; thẻ KPI hiển thị số liệu 30 ngày (với helper text "30 ngày"), trong khi bảng chi tiết hiển thị nhãn kỳ rõ ràng khớp với khoảng ngày đang chọn trên thanh điều hướng.

**Acceptance Scenarios**:

1. **Given** Quản trị viên chọn một kỳ bất kỳ khác 30 ngày (ví dụ: "Hôm nay" hoặc "Tuần này"), **When** dữ liệu hiển thị, **Then** thẻ KPI "Biên lợi nhuận AI" vẫn giữ giá trị snapshot tổng quan 30 ngày kèm helper text ghi chú rõ "30 ngày", trong khi bảng "Hiệu quả chi phí AI" hiển thị số liệu tính toán chi tiết riêng cho kỳ đã chọn.

---

### Edge Cases

- **Kỳ lọc chỉ có 1 ngày ("Hôm nay")**: `fromDate` bằng `toDate`, API trả về số liệu chi phí và doanh thu của đúng 1 ngày đó; bảng hiển thị nhãn "Kỳ: DD/MM/YYYY – DD/MM/YYYY" bình thường mà không bị lỗi chia 0 nếu lượt dùng hoặc doanh thu bằng 0.
- **Kỳ không có lượt dùng AI nào**: Chi phí token = 0, doanh thu = 0, lợi nhuận ròng = 0; bảng hiển thị các giá trị 0đ / 0% rõ ràng, không xuất hiện `NaN` hay `undefined`.
- **Lỗi truy vấn dữ liệu AI Margin**: Khi endpoint `/admin/dashboard/ai-margin` trả lỗi (HTTP 500 hoặc Timeout), bảng "Hiệu quả chi phí AI" hiển thị giao diện báo lỗi cục bộ kèm nút "Thử lại", không làm crash hay gián đoạn các phần khác của Dashboard (như KPI Grid, PayOS Panel, Trends Chart).
- **Trạng thái đang nạp (Loading/Fetching)**: Khi đang refetch hoặc đổi kỳ, bảng duy trì hiển thị số liệu trước đó kèm cờ `aria-busy="true"` và trạng thái mờ nhẹ, tránh giật layout hoặc nháy trắng toàn panel.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI luôn truy vấn dữ liệu kinh tế AI (`/admin/dashboard/ai-margin`) với đúng khoảng thời gian (`fromDate`, `toDate`) của kỳ hiện tại, bất kể kỳ đó là mặc định ("Tháng này") hay tùy chỉnh.
- **FR-002**: Bảng chi tiết "Hiệu quả chi phí AI" PHẢI lấy dữ liệu trực tiếp từ query phân tích kinh tế AI chuyên biệt, KHÔNG ĐƯỢC lấy từ `overview.aiMargin` (vốn là dữ liệu cố định 30 ngày).
- **FR-003**: Trong quá trình kết xuất phía máy chủ (SSR trong `DashboardData`), hệ thống PHẢI luôn gửi yêu cầu tải trước (serverFetch) đến endpoint `/admin/dashboard/ai-margin` với tham số ngày của kỳ hiện tại để nạp `initialData.aiMargin`.
- **FR-004**: Phía máy khách (`DashboardClient`), hook truy vấn kinh tế AI `useDashboardAIMargin` PHẢI luôn được bật (`enabled: true`) và sử dụng `initialData.aiMargin` làm dữ liệu khởi tạo ban đầu.
- **FR-005**: Thao tác "Làm mới" (`refreshAll`) trên thanh điều khiển Dashboard PHẢI luôn kích hoạt làm mới query kinh tế AI (`aiMarginQuery.refetch()`) trong mọi tình huống.
- **FR-006**: Trạng thái đang làm mới (`isRefreshing`), đang tải (`isLoading`), đang fetch (`isFetching`), lỗi (`error`) và hành động thử lại (`onRetry`) của bảng "Hiệu quả chi phí AI" PHẢI liên kết trực tiếp với `aiMarginQuery`.
- **FR-007**: Thẻ chỉ số tổng quan (KPI Card) "Biên lợi nhuận AI" PHẢI tiếp tục sử dụng dữ liệu từ query tổng quan (`overviewQuery`) phản ánh snapshot 30 ngày theo đúng thiết kế hệ thống.
- **FR-008**: Hệ thống PHẢI loại bỏ hoàn toàn thuộc tính prop `hasCustomDateRange` trên `DashboardClient` và dọn dẹp hàm tiện ích không còn sử dụng `hasCustomDashboardDateRange`.

### Key Entities *(include if feature involves data)*

- **AIMarginAnalytics**: Thực thể biểu diễn phân tích hiệu quả chi phí AI theo một khoảng thời gian xác định (`fromDate`, `toDate`), bao gồm:
  - `fromDate`: Ngày bắt đầu của kỳ phân tích (định dạng YYYY-MM-DD).
  - `toDate`: Ngày kết thúc của kỳ phân tích (định dạng YYYY-MM-DD).
  - `subscriptionRevenueVnd`: Tổng doanh thu đăng ký quy đổi VND trong kỳ.
  - `aiCostVnd`: Tổng chi phí tiêu thụ token mô hình AI quy đổi VND trong kỳ.
  - `netMarginVnd`: Lợi nhuận ròng từ dịch vụ AI trong kỳ (`subscriptionRevenueVnd - aiCostVnd`).
  - `marginPercent`: Tỷ suất biên lợi nhuận (`netMarginVnd / subscriptionRevenueVnd * 100`).
  - `tokenBreakdown`: Cơ cấu chi tiết lượng token theo từng tác vụ AI.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% các lần truy cập Dashboard (bao gồm kỳ mặc định "Tháng này" và các kỳ khác) đều hiển thị số liệu bảng "Hiệu quả chi phí AI" khớp chính xác với khoảng ngày hiển thị trên tiêu đề bảng.
- **SC-002**: Không còn bất kỳ trường hợp nào bảng "Hiệu quả chi phí AI" hiển thị số liệu của 30 ngày trôi trong khi tiêu đề lại ghi nhãn kỳ của tháng hiện tại.
- **SC-003**: 100% các lần bấm nút "Làm mới" (Refresh) trên Dashboard đều kích hoạt truy vấn làm mới dữ liệu bảng "Hiệu quả chi phí AI".
- **SC-004**: Toàn bộ bộ kiểm thử tự động của Dashboard (`DashboardClient.test.tsx` và các file test liên quan) hoàn thành thành công 100% với 0 lỗi rớt, và mã nguồn vượt qua kiểm tra chất lượng `npm run lint`.

## Assumptions

- API backend `/admin/dashboard/ai-margin` hỗ trợ đầy đủ các tham số query `fromDate` và `toDate` theo chuẩn ISO date (YYYY-MM-DD) và trả về đối tượng `AIMarginAnalytics` có `fromDate` và `toDate` phản ánh đúng khoảng ngày được yêu cầu.
- Thẻ KPI "Biên lợi nhuận AI" trên `DashboardKpiGrid` tiếp tục hiển thị snapshot 30 ngày từ `overview.kpiCards.netAiMarginVnd` theo đúng thỏa thuận giao diện và hướng dẫn backend.
- Việc luôn gọi endpoint `/admin/dashboard/ai-margin` trong cả SSR lẫn CSR không gây quá tải cho backend vì đây là trang quản trị nội bộ dành riêng cho Admin với tần suất truy cập vừa phải.
