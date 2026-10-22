# Tasks: Đồng Bộ Kỳ Báo Cáo Cho Bảng Hiệu Quả Chi Phí AI (038-fix-dashboard-ai-margin)

**Input**: Design documents from `/specs/038-fix-dashboard-ai-margin/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md  

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- File paths are relative to repository root

---

## Phase 1: Setup (Preparation)

**Purpose**: Kiểm tra môi trường phát triển và trạng thái nhánh làm việc trước khi thực hiện thay đổi mã nguồn

- [X] T001 Kiểm tra trạng thái git và đảm bảo đang làm việc trên nhánh `dev` sạch sẽ qua git status

---

## Phase 2: Foundational (Dead Code Removal & Utilities Cleanup)

**Purpose**: Dọn dẹp hàm tiện ích cũ không còn phù hợp với kiến trúc truy vấn mới

- [X] T002 Xóa hàm tiện ích không còn nơi sử dụng `hasCustomDashboardDateRange` trong `src/features/admin/utils/dashboard.ts`

**Checkpoint**: Mã tiện ích đã sạch; sẵn sàng cập nhật luồng dữ liệu trên Server và Client Components.

---

## Phase 3: User Story 1 - Hiển Thị Đúng Dữ Liệu Kinh Tế AI Theo Kỳ Mặc Định "Tháng Này" (Priority: P1) 🎯 MVP

**Goal**: Bảng "Hiệu quả chi phí AI" luôn hiển thị đúng khoảng ngày và số liệu tính toán của kỳ được chọn (bao gồm kỳ mặc định "Tháng này" 01/MM - DD/MM), không lấy nhầm dữ liệu 30 ngày cố định từ tổng quan.

**Independent Test**: Truy cập `/admin/dashboard` không có query parameters; `DashboardData` gọi `serverFetch` tới `/admin/dashboard/ai-margin` theo đúng `fromDate` và `toDate` của tháng này, gán vào `initialData.aiMargin` mà không fallback sang `overview.aiMargin`, đồng thời không còn truyền prop `hasCustomDateRange` xuống `DashboardClient`.

### Implementation for User Story 1

- [X] T003 [US1] Luôn thực hiện `serverFetch<AIMarginAnalytics>` tới `/admin/dashboard/ai-margin` với tham số `filters.fromDate`/`filters.toDate`, gán `initialData.aiMargin = customMargin` (bỏ fallback `overview?.aiMargin`) và loại bỏ prop `hasCustomDateRange` trong `src/app/admin/dashboard/components/DashboardData.tsx`

**Checkpoint**: Dữ liệu SSR nạp ban đầu cho bảng AI Margin luôn chính xác theo kỳ lọc hiện tại.

---

## Phase 4: User Story 2 - Luôn Đồng Bộ & Tự Động Làm Mới Bảng Chi Phí AI Cho Mọi Kỳ Lọc (Priority: P1)

**Goal**: Hook `useDashboardAIMargin` trên client luôn được kích hoạt (`enabled: true`), lấy dữ liệu trực tiếp từ query, tự động tải lại khi đổi kỳ và tham gia vào quy trình làm mới toàn diện (`refreshAll`).

**Independent Test**: Trên client, gọi hàm `refreshAll()` hoặc thay đổi kỳ lọc; query `useDashboardAIMargin` được kích hoạt refetch, cờ `isRefreshing`, `isLoading`, `isFetching`, `error` và `onRetry` của `AIMarginPanel` đều liên kết trực tiếp với query này.

### Implementation for User Story 2

- [X] T004 [US2] Loại bỏ prop `hasCustomDateRange` khỏi `DashboardClientProps`, thiết lập `useDashboardAIMargin` luôn enabled với `initialData.aiMargin`, kết nối trực tiếp `aiMarginQuery.refetch()` vào `refreshAll` và đồng bộ các cờ trạng thái của `AIMarginPanel` trong `src/app/admin/dashboard/components/DashboardClient.tsx`

**Checkpoint**: Bảng Hiệu quả chi phí AI trên client phản hồi nhất quán ở mọi kỳ và tự động làm mới khi được yêu cầu.

---

## Phase 5: User Story 3 - Phân Tách Minh Bạch Phạm Vi Dữ Liệu Giữa KPI Card và Bảng Chi Tiết (Priority: P2)

**Goal**: Phân định rõ ràng: KPI Card "Biên lợi nhuận AI" tiếp tục nhận dữ liệu snapshot 30 ngày từ `overviewQuery` kèm ghi chú "30 ngày", còn `AIMarginPanel` hoàn toàn độc lập với `overview.aiMargin`.

**Independent Test**: Quan sát giao diện `DashboardClient`: thẻ KPI "Biên lợi nhuận AI" trong `DashboardKpiGrid` hiển thị giá trị từ `overview.kpiCards.netAiMarginVnd`, trong khi `AIMarginPanel` nhận dữ liệu độc lập từ `aiMarginQuery.data`.

### Implementation for User Story 3

- [X] T005 [US3] Rà soát và đảm bảo `DashboardKpiGrid` chỉ phụ thuộc vào `overviewQuery.data?.kpiCards` còn `AIMarginPanel` hoàn toàn tách biệt khỏi `overview.aiMargin` trong `src/app/admin/dashboard/components/DashboardClient.tsx`

**Checkpoint**: Kiến trúc phân tách phạm vi thời gian giữa các khối trên trang Dashboard hoàn toàn minh bạch và nhất quán.

---

## Phase 6: Polish & Verification (Tests & Code Quality)

**Purpose**: Cập nhật bộ unit test tự động, kiểm tra linting và thẩm định toàn bộ kịch bản nghiệm thu

- [X] T006 Cập nhật `src/app/admin/dashboard/components/DashboardClient.test.tsx` (bỏ prop `hasCustomDateRange`, kỳ vọng `mockMarginRefetch` luôn được gọi khi refresh, và kiểm tra liên kết dữ liệu query)
- [X] T007 Chạy kiểm thử tự động `npm test -- src/app/admin/dashboard/components/DashboardClient.test.tsx` và chạy kiểm thử toàn dự án `npm test`
- [X] T008 [P] Chạy kiểm tra quy chuẩn mã nguồn qua lệnh `npm run lint`
- [X] T009 Đối soát kịch bản nghiệm thu theo hướng dẫn trong `specs/038-fix-dashboard-ai-margin/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Không có phụ thuộc, thực hiện đầu tiên.
- **Foundational (Phase 2)**: Dọn dẹp tiện ích cũ `hasCustomDashboardDateRange`.
- **User Story 1 (Phase 3 - P1)**: Cập nhật SSR trong `DashboardData.tsx`.
- **User Story 2 (Phase 4 - P1)**: Cập nhật CSR trong `DashboardClient.tsx` (phụ thuộc Phase 3 để thống nhất props).
- **User Story 3 (Phase 5 - P2)**: Xác nhận độc lập dữ liệu giữa KPI Cards và Panel (thực hiện cùng Phase 4).
- **Polish & Verification (Phase 6)**: Cập nhật test và kiểm tra `npm test`, `npm run lint`.

### Parallel Opportunities

- T007 và T008 có thể chạy song song hoặc liên tiếp trong giai đoạn kiểm định.
- T002 và T003 có thể chuẩn bị độc lập nhưng nên merge theo thứ tự để tránh TypeScript error tạm thời.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Xóa tiện ích thừa `hasCustomDashboardDateRange` (T002).
2. Sửa `DashboardData.tsx` để luôn gọi `/admin/dashboard/ai-margin` cho SSR (T003).
3. Sửa `DashboardClient.tsx` để hook `useDashboardAIMargin` luôn hoạt động và gắn vào `refreshAll` (T004 & T005).
4. Cập nhật test trong `DashboardClient.test.tsx` (T006) và chạy `npm test` (T007), `npm run lint` (T008).
5. Nghiệm thu hoàn tất.
