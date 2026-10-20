# Tasks: Bộ Chọn Kỳ Dùng Chung Quản Trị Hệ Thống (037-admin-period-navigator)

**Input**: Design documents from `specs/037-admin-period-navigator/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/admin-period-navigator.md`, `quickstart.md`

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to ([US1], [US2], [US3], [US4], [US5])
- All paths are exact and project-relative

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Định nghĩa types và cấu trúc module cho bộ chọn kỳ dùng chung

- [X] T001 [P] Create period types (`PeriodPreset`, `PeriodRange`, `NavigationDirection`, `NavigationResult`, `PeriodLabelInfo`) in `src/features/admin/types/period.ts`
- [X] T002 [P] Export new period types in `src/features/admin/types/index.ts`

---

## Phase 2: Foundational (Core Period Engine & Tests)

**Purpose**: Xây dựng thuật toán tính toán ngày giờ Việt Nam, quy tắc bước nhảy chu kỳ, và bộ unit tests toàn diện

- [X] T003 Create test suite for period calculations covering defaults, Monday-start weeks, full past units, clamping, custom range shifting, and label formatting in `src/features/admin/utils/__tests__/period.test.ts`
- [X] T004 Implement period calculation utilities (`vnDate`, `todayVN`, `startOfMonthVN`, `getPeriodDateRange`, `navigatePeriod`, `isAtCurrentPeriod`, `formatPeriodLabel`, `parsePeriodFromParams`) in `src/features/admin/utils/period.ts`
- [X] T005 Update `src/features/admin/utils/dashboard.ts` to re-export and integrate new period utilities, updating default range from 30 days to `this_month`

**Checkpoint**: Nền tảng tính toán chu kỳ đã sẵn sàng, 100% unit tests của `period.test.ts` vượt qua.

---

## Phase 3: User Story 1 - Chuyển Đổi Kỳ Báo Cáo Nhanh Qua Các Preset Chuẩn Hóa (Priority: P1) 🎯 MVP

**Goal**: Cung cấp bộ chọn kỳ với 5 preset (*Hôm nay*, *Tuần này*, *Tháng này*, *Năm này*, *Tuỳ chọn*), mặc định khi không có query param là *Tháng này*, áp dụng ngay khi bấm preset.

**Independent Test**: Truy cập `/admin/dashboard`, bộ chọn kỳ tự động kích hoạt preset "Tháng này" (01 đến hôm nay giờ VN), bấm "Hôm nay", "Tuần này", "Năm này" đổi khoảng ngày ngay lập tức.

### Implementation for User Story 1

- [X] T006 [P] [US1] Create unit tests for `AdminPeriodNavigator` component verifying preset pill rendering and immediate click callback in `src/features/admin/components/__tests__/AdminPeriodNavigator.test.tsx`
- [X] T007 [US1] Implement `AdminPeriodNavigator` component with preset buttons pill group and active state styling in `src/features/admin/components/AdminPeriodNavigator.tsx`
- [X] T008 [US1] Update `DashboardToolbar.tsx` in `src/app/admin/dashboard/components/DashboardToolbar.tsx` to integrate `AdminPeriodNavigator` with 5 presets
- [X] T009 [US1] Update `DashboardData.tsx` in `src/app/admin/dashboard/components/DashboardData.tsx` to default to `this_month` (01 đến hôm nay) when query params are absent

**Checkpoint**: User Story 1 hoạt động độc lập và đạt chuẩn MVP trên Dashboard.

---

## Phase 4: User Story 2 - Di Chuyển Tiến/Lùi Kỳ Với Đơn Vị Đầy Đủ & Kẹp Ngày Hiện Tại (Priority: P1)

**Goal**: Trang bị 2 nút mũi tên ◀ ▶ lùi/tiến chu kỳ đầy đủ trong quá khứ (tuần Thứ 2–CN, tháng 01–cuối tháng, năm 01/01–31/12), kẹp `toDate = hôm nay` và vô hiệu hóa ▶ khi chạm hiện tại.

**Independent Test**: Nhấn ◀ từ "Tháng này" lùi về tháng trước đủ ngày, nút ▶ được bật; nhấn ▶ tiến về tháng này, kẹp `toDate = hôm nay` và nút ▶ bị vô hiệu hóa.

### Implementation for User Story 2

- [X] T010 [P] [US2] Add unit tests for ◀ ▶ arrow buttons, stepping behavior, and disabled state in `src/features/admin/components/__tests__/AdminPeriodNavigator.test.tsx`
- [X] T011 [US2] Implement ◀ and ▶ navigation buttons with clamping logic and dynamic `disabled` state in `src/features/admin/components/AdminPeriodNavigator.tsx`
- [X] T012 [US2] Implement period label display (`unitTitle · dateRangeText`) derived strictly from active `fromDate` and `toDate` in `src/features/admin/components/AdminPeriodNavigator.tsx`
- [X] T013 [US2] Connect ◀ ▶ navigation and period label updating in `src/app/admin/dashboard/components/DashboardClient.tsx`

**Checkpoint**: Hai nút mũi tên ◀ ▶ và nhãn kỳ hoạt động chính xác với đầy đủ quy tắc kẹp hiện tại.

---

## Phase 5: User Story 3 - Chọn Khoảng Thời Gian Tùy Chọn & Chặn Ngày Tương Lai (Priority: P2)

**Goal**: Hỗ trợ popover lịch chọn khoảng ngày bất kỳ cho preset "Tuỳ chọn", chặn ngày tương lai (`disabled={{ after: new Date() }}`), chỉ áp dụng khi nhấn nút "Áp dụng", dịch chuyển $N$ ngày khi bấm ◀ ▶.

**Independent Test**: Chọn "Tuỳ chọn", bảng lịch mở ra, ngày tương lai không thể click, chọn 5 ngày trong quá khứ rồi bấm "Áp dụng"; bấm ◀ dịch đúng 5 ngày.

### Implementation for User Story 3

- [X] T014 [P] [US3] Add unit tests for custom date popover, future date blocking, and "Áp dụng" button in `src/features/admin/components/__tests__/AdminPeriodNavigator.test.tsx`
- [X] T015 [US3] Implement custom date range Popover with Calendar, reset button, and "Áp dụng" button in `src/features/admin/components/AdminPeriodNavigator.tsx`
- [X] T016 [US3] Replace old date picker with `AdminPeriodNavigator` in `src/app/admin/activity-events/components/ActivityEventsToolbar.tsx`
- [X] T017 [US3] Replace old date picker with `AdminPeriodNavigator` in `src/app/admin/transactions/components/TransactionsToolbar.tsx`

**Checkpoint**: Cả 3 màn hình đều đã tích hợp `AdminPeriodNavigator` với đầy đủ khả năng chọn khoảng ngày tùy chọn.

---

## Phase 6: User Story 4 - Lưu Trữ Trạng Thái Vào URL & Khôi Phục Lịch Sử Điều Hướng (Priority: P2)

**Goal**: Đồng bộ `preset`, `fromDate`, `toDate` lên URL query parameters, khôi phục khi reload/share link và Back/Forward, tự động reset `page = 1` khi đổi kỳ.

**Independent Test**: Đang ở `page = 2` trên trang Giao dịch, bấm đổi kỳ, URL cập nhật `preset`, `fromDate`, `toDate` và `page = 1`; bấm Back trên trình duyệt khôi phục đúng kỳ và trang trước.

### Implementation for User Story 4

- [X] T018 [P] [US4] Add unit tests for URL query param parsing, fallback inference, and page reset logic in `src/features/admin/utils/__tests__/period.test.ts`
- [X] T019 [US4] Update URL query state synchronization and period change handling with `page = 1` reset in `src/app/admin/dashboard/components/DashboardClient.tsx`
- [X] T020 [US4] Update URL query state synchronization, default to `this_month` when params are absent, and reset `page = 1` in `src/app/admin/activity-events/components/ActivityEventsClient.tsx`
- [X] T021 [US4] Update URL query state synchronization, default to `this_month` when params are absent, and reset `page = 1` in `src/app/admin/transactions/components/TransactionsClient.tsx`

**Checkpoint**: URL query được đồng bộ hoàn hảo trên cả 3 trang, chia sẻ link và điều hướng lịch sử hoạt động chính xác.

---

## Phase 7: User Story 5 - Trải Nghiệm Chuyển Đổi Mượt Mà & Khả Năng Tiếp Cận (Priority: P3)

**Goal**: Giữ nguyên dữ liệu cũ kèm indicator tải nhẹ (`keepPreviousData`), không nháy skeleton toàn trang, không trượt vị trí cuộn trang (`scroll: false`), đáp ứng accessibility tiếng Việt và responsive.

**Independent Test**: Cuộn xuống giữa trang Dashboard, bấm ◀ lùi tháng: dữ liệu cũ vẫn hiển thị kèm xoay nhẹ, màn hình không nháy trắng, vị trí cuộn giữ nguyên.

### Implementation for User Story 5

- [X] T022 [US5] Verify and enforce `placeholderData: keepPreviousData` on all period-dependent queries across dashboard, activity events, and transactions in `src/features/admin/queries/`
- [X] T023 [US5] Ensure all `router.push()` calls across the 3 screens use `{ scroll: false }` to preserve viewport scroll position in `DashboardClient.tsx`, `ActivityEventsClient.tsx`, and `TransactionsClient.tsx`
- [X] T024 [P] [US5] Implement responsive container flexbox layout, focus rings, keyboard navigation (Tab/Enter/Space), and Vietnamese `aria-label`s ("Kỳ trước", "Kỳ sau", "Chọn khoảng ngày") in `src/features/admin/components/AdminPeriodNavigator.tsx`

**Checkpoint**: Trải nghiệm chuyển kỳ mượt mà, không nháy skeleton, không trượt cuộn, hỗ trợ accessibility toàn diện.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Kiểm tra ràng buộc repo, chạy kiểm thử tự động, và hoàn thiện nghiệm thu

- [X] T025 Verify that KPI cards `totalBrands` and `pendingReviewBrands` remain commented out in `src/app/admin/dashboard/components/DashboardKpiGrid.tsx`
- [X] T026 Execute automated unit tests via `npm test src/features/admin/utils/__tests__/period.test.ts` and `src/features/admin/components/__tests__/AdminPeriodNavigator.test.tsx`
- [X] T027 Run ESLint via `npm run lint` and verify 0 errors / 0 warnings
- [X] T028 Run end-to-end test scenarios matching all 6 scenarios in `specs/037-admin-period-navigator/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Không phụ thuộc, chạy ngay.
- **Foundational (Phase 2)**: Phụ thuộc Phase 1. CHẶN tất cả các User Stories tiếp theo.
- **User Story 1 (Phase 3)**: Phụ thuộc Phase 2. MVP cốt lõi.
- **User Story 2 (Phase 4)**: Phụ thuộc Phase 3 (tích hợp mũi tên và nhãn vào navigator).
- **User Story 3 (Phase 5)**: Phụ thuộc Phase 4 (hoàn thiện popover tùy chọn và tích hợp sang 2 trang còn lại).
- **User Story 4 (Phase 6)**: Phụ thuộc Phase 5 (đồng bộ URL state và reset page trên cả 3 trang).
- **User Story 5 (Phase 7)**: Phụ thuộc Phase 6 (đảm bảo keepPreviousData, scroll preservation, và a11y).
- **Polish (Phase 8)**: Phụ thuộc tất cả các phases trước.

### User Story Dependencies

```mermaid
graph TD
    Phase1[Phase 1: Setup] --> Phase2[Phase 2: Foundational Engine]
    Phase2 --> US1[US1: 5 Presets & Default 'Tháng này' (MVP)]
    US1 --> US2[US2: ◀ ▶ Arrows & Clamping]
    US2 --> US3[US3: Custom Range Popover & Future Blocking]
    US3 --> US4[US4: URL Query Sync & Page=1 Reset]
    US4 --> US5[US5: Smooth Transitions & Accessibility]
    US5 --> Phase8[Phase 8: Polish & Verification]
```

### Parallel Opportunities

- **Phase 1**: T001 và T002 có thể chạy song song.
- **Phase 2**: T003 (tests) có thể viết song song với thiết kế hàm T004.
- **Phase 3**: T006 (component tests) có thể chạy song song với chuẩn bị T007.
- **Phase 4**: T010 có thể viết trước song song với T011.
- **Phase 5**: T016 (ActivityEventsToolbar) và T017 (TransactionsToolbar) có thể triển khai song song.
- **Phase 6**: T019, T020, T021 có thể cập nhật song song trên 3 clients độc lập.
- **Phase 7**: T024 (a11y/responsive) có thể thực hiện song song với T022.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Hoàn thành Phase 1 & Phase 2: Setup và Core Engine với 100% test passing.
2. Hoàn thành Phase 3 (US1): `AdminPeriodNavigator` với 5 preset và mặc định "Tháng này" trên Dashboard.
3. **Kiểm tra độc lập**: Dashboard hiển thị đúng preset Tháng này và chuyển đổi preset tức thì.

### Incremental Delivery
1. Setup + Foundation $\rightarrow$ Sẵn sàng engine ngày giờ VN.
2. Thêm US1 $\rightarrow$ Đạt MVP chuyển preset tức thì.
3. Thêm US2 $\rightarrow$ Mũi tên ◀ ▶ duyệt chu kỳ trọn vẹn và kẹp hôm nay.
4. Thêm US3 $\rightarrow$ Popover lịch tùy chọn và mở rộng sang Hoạt động người dùng & Giao dịch.
5. Thêm US4 $\rightarrow$ Đồng bộ URL và back/forward, reset `page = 1`.
6. Thêm US5 $\rightarrow$ Mượt mà, không giật layout, accessibility tiếng Việt.
7. Polish $\rightarrow$ Lint, test suite, kiểm tra ràng buộc KPI comment.
