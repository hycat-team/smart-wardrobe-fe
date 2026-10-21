# Tasks: Đồng bộ và xử lý toàn diện trạng thái phân tích ảnh trang phục AI

**Feature**: `027-analyze-status-handling` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Định nghĩa kiểu dữ liệu và helper dùng chung cho toàn bộ tính năng phân tích ảnh.

- [X] T001 [P] Create reason code mappings and retry-gating utility in `src/features/wardrobe/utils/analysis-status.ts`
- [X] T002 [P] Update Wardrobe types with `AnalyzeReviewReason`, `AnalyzeErrorReason`, and optional reason fields in `src/features/wardrobe/types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Cập nhật tầng API và sửa lỗi logic stream thời gian thực trước khi triển khai giao diện.

**⚠️ CRITICAL**: Không triển khai các User Story cho đến khi hoàn tất Phase này.

- [X] T003 Update `retryWardrobeItemAnalysis` to accept `{ categoryId?: string }` payload in `src/features/wardrobe/api/wardrobe.api.ts`
- [X] T004 Fix event counting logic in `subscribeTaskSSE` to only count terminal events (`completed`, `failed`, `needs_review`) and prevent premature closure on `processing` in `src/features/wardrobe/api/wardrobe.api.ts`
- [X] T005 Update `useRetryWardrobeItemAnalysis` mutation hook to accept `{ id: string; categoryId?: string }` in `src/features/wardrobe/queries/wardrobe.queries.ts`

**Checkpoint**: Nền tảng API và SSE đã sẵn sàng — có thể triển khai song song các User Story.

---

## Phase 3: User Story 1 - Phân biệt lý do ảnh không hợp lệ & Ẩn nút "Thử lại" (Priority: P1) 🎯 MVP

**Goal**: Hiển thị chính xác mã lý do thất bại sang tiếng Việt (bao gồm mã mới `no_fashion_item_detected`), ẩn nút "Thử lại" cho nhóm ảnh không hợp lệ, và chỉ bật nút "Thử lại" cho lỗi tạm thời.

**Independent Test**: Món đồ có `Failed` với mã `no_fashion_item_detected` hiển thị "Ảnh không phải trang phục — hãy tải ảnh đúng món đồ", nút "Thử lại" bị ẩn, và người dùng có thể xóa món hoặc tải ảnh mới.

### Tests for User Story 1

- [X] T006 [P] [US1] Create unit tests for reason mapping and retry gating in `src/features/wardrobe/utils/analysis-status.test.ts`

### Implementation for User Story 1

- [X] T007 [US1] Update `WardrobeItemDetailClient.tsx` in `src/app/(user)/wardrobe/item/[id]/components/WardrobeItemDetailClient.tsx` to display mapped friendly reason message, conditionally hide the retry button for invalid images, and provide delete/upload actions
- [X] T008 [US1] Update `WardrobeCardV2.tsx` in `src/app/(user)/wardrobe/components/WardrobeCardV2.tsx` to render a "Phân tích thất bại" badge on cards with status `Failed`

**Checkpoint**: User Story 1 hoàn tất độc lập — ngăn chặn hoàn toàn vòng lặp retry lỗi 400.

---

## Phase 4: User Story 2 - Rà soát và chọn danh mục cho món cần kiểm tra & xác thực lại ảnh (Priority: P1)

**Goal**: Triển khai luồng rà soát danh mục (`needs_review`), bắt buộc chọn `categoryId` trước khi gửi phân tích lại, và lắng nghe kết quả SSE để xử lý cả trường hợp phân tích lại thất bại (BC-3).

**Independent Test**: Món đồ có `NeedsReview` yêu cầu chọn danh mục, nút gửi bị khóa khi chưa chọn, khi gửi truyền `categoryId`, chuyển sang chờ SSE và hiển thị đúng kết quả cuối cùng.

### Implementation for User Story 2

- [X] T009 [US2] Implement category selection dropdown and validation in `src/app/(user)/wardrobe/item/[id]/components/WardrobeItemDetailClient.tsx` for items in `NeedsReview` status
- [X] T010 [US2] Wire fixed-category re-analysis submission with `categoryId` and realtime SSE waiting (handling both success and BC-3 invalid image failure) in `src/app/(user)/wardrobe/item/[id]/components/WardrobeItemDetailClient.tsx`
- [X] T011 [US2] Update `WardrobeCardV2.tsx` in `src/app/(user)/wardrobe/components/WardrobeCardV2.tsx` to render a "Cần chọn danh mục" badge for items in `NeedsReview` status

**Checkpoint**: User Story 2 hoàn tất độc lập — dữ liệu trang phục được bảo đảm tính chính xác trước khi vào tủ đồ.

---

## Phase 5: User Story 3 - Theo dõi tiến trình thời gian thực ổn định & phục hồi (Priority: P1)

**Goal**: Đảm bảo hook `useWardrobeSSE` nhận thông báo toast thân thiện theo mã lý do, cập nhật cache chính xác và có cơ chế tự động đồng bộ dự phòng khi kết nối gián đoạn.

**Independent Test**: Quá trình phân tích 1 ảnh đơn lẻ nhận `processing` rồi `completed` mà không bị ngắt stream giữa chừng; mất kết nối tự kích hoạt refetch danh sách.

### Tests for User Story 3

- [X] T012 [P] [US3] Add unit tests in `src/features/wardrobe/hooks/useWardrobeSSE.test.tsx` for stream continuity across `processing` events and reason-specific error toasts

### Implementation for User Story 3

- [X] T013 [US3] Update `useWardrobeSSE.ts` in `src/features/wardrobe/hooks/useWardrobeSSE.ts` to map error reasons to Vietnamese toast messages, save error metadata into query cache, and add fallback refetch timer for stalled tasks
- [X] T014 [US3] Verify seamless transition between batch upload completion and SSE monitoring in `src/app/(user)/wardrobe/upload/components/UploadClient.tsx`

**Checkpoint**: Luồng thời gian thực chạy ổn định, không để sót món đồ nào ở trạng thái treo.

---

## Phase 6: User Story 4 - Đồng bộ xử lý trạng thái phân tích cho Brand Portal (Priority: P2)

**Goal**: Hỗ trợ phân tích lại và ánh xạ mã lỗi cho các sản phẩm trên cổng thông tin nhãn hàng.

**Independent Test**: Sản phẩm nhãn hàng có trạng thái lỗi hiển thị thông điệp lý do tương ứng và cho phép thử lại nếu là lỗi tạm thời; sản phẩm lỗi bị chặn kích hoạt hoạt động thủ công.

### Implementation for User Story 4

- [X] T015 [P] [US4] Add `retryBrandItemAnalysis` method with optional `categoryId` in `src/features/brand-portal/api/brand-portal.api.ts`
- [X] T016 [US4] Update `useBrandItemSSE.ts` in `src/features/brand-portal/hooks/useBrandItemSSE.ts` to format Vietnamese error toasts and prevent premature stream termination

**Checkpoint**: Toàn bộ hệ thống (User Wardrobe & Brand Portal) được đồng bộ hành vi.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Kiểm thử hồi quy, kiểm tra build và rà soát tài liệu.

- [X] T017 [P] Run unit test suite `npx jest src/features/wardrobe/hooks/useWardrobeSSE.test.tsx src/features/wardrobe/utils/analysis-status.test.ts`
- [X] T018 Run project linter and type-check to ensure zero regressions across modified files
- [X] T019 Execute manual validation scenarios according to `specs/027-analyze-status-handling/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1: Setup ──► Phase 2: Foundational ──┬──► Phase 3: User Story 1 (P1) ──┐
                                           ├──► Phase 4: User Story 2 (P1) ──┼──► Phase 7: Polish
                                           ├──► Phase 5: User Story 3 (P1) ──┤
                                           └──► Phase 6: User Story 4 (P2) ──┘
```

- **Phase 1 (Setup)**: Không có phụ thuộc, thực hiện đầu tiên.
- **Phase 2 (Foundational)**: Phụ thuộc vào Phase 1; là điều kiện tiên quyết bắt buộc trước mọi User Story.
- **Phases 3, 4, 5, 6 (User Stories)**: Có thể triển khai song song hoặc tuần tự theo mức ưu tiên sau khi Phase 2 hoàn thành.
- **Phase 7 (Polish)**: Thực hiện sau khi tất cả các User Story mong muốn đã hoàn thành.

---

## Parallel Opportunities

- **T001 & T002**: Tạo file helper `analysis-status.ts` và cập nhật `types/index.ts` hoàn toàn độc lập [P].
- **T006**: Viết unit test cho utility có thể chạy song song với các task khác [P].
- **T012**: Viết test cho hook `useWardrobeSSE` có thể chạy song song [P].
- **T015**: Thêm hàm API cho Brand Portal độc lập với User Wardrobe [P].
- Sau Phase 2, **User Story 1**, **User Story 2**, và **User Story 3** tác động vào các phần giao diện và luồng khác nhau nên có thể triển khai song song.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Hoàn thành Phase 1 (Setup) và Phase 2 (Foundational).
2. Hoàn thành Phase 3 (User Story 1): Sửa ngay lỗi nghiêm trọng nhất — phân biệt mã `no_fashion_item_detected` và ẩn nút "Thử lại" cho ảnh không hợp lệ để triệt tiêu lỗi 400.
3. Chạy kiểm thử xác nhận MVP hoạt động hoàn hảo.

### Incremental Delivery

1. **Giai đoạn 1 (Foundation & MVP)**: Setup + Foundational + User Story 1 (Loại bỏ vòng lặp lỗi 400).
2. **Giai đoạn 2 (Category Review Flow)**: User Story 2 (Rà soát danh mục & lắng nghe kết quả AI hai chiều).
3. **Giai đoạn 3 (Realtime Resilience)**: User Story 3 (Sửa lỗi đóng sớm stream SSE & cơ chế dự phòng).
4. **Giai đoạn 4 (Brand Portal & Polish)**: User Story 4 + Polish (Đồng bộ Brand Portal, chạy toàn bộ test suite).
