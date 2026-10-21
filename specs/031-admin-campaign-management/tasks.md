# Tasks: Admin Campaign Management & Eligibility Lookup (Quản lý Chiến dịch Tặng gói & Tra cứu Điều kiện Tài khoản)

**Input**: Design artifacts from `specs/031-admin-campaign-management/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`).  
**Branch**: `031-admin-campaign-management`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, directory structure, and main navigation entry point.

- [X] T001 Initialize campaign feature directory structure and sub-folders at `src/features/admin/campaigns/{api,queries,types,utils,components}`
- [X] T002 [P] Update `src/features/admin/components/AdminSidebar.tsx` to add "Chiến dịch tặng gói" navigation link with `Gift` icon pointing to `/admin/campaigns`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core TypeScript interfaces, utilities, API client, and TanStack Query infrastructure that ALL user stories depend on.

> **CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 [P] Define TypeScript interfaces in `src/features/admin/campaigns/types/campaign-admin.types.ts` for 21 summary fields (`CampaignSummaryRes`), claim items (`CampaignClaimItem`), customer eligibility (`EligibilityRes`), polymorphic audit logs (`CampaignAuditItem`), and request payloads (`CreateCampaignReq`, `UpdateCampaignReq`, `CloseCampaignReq`)
- [X] T004 [P] Implement campaign status utilities in `src/features/admin/campaigns/utils/campaign-status.ts` mapping 6 lifecycle statuses (`closed` with highest priority, `exhausted`, `expired`, `compensation`, `running`, `not_started`, and fallback for unknown) with Vietnamese labels, badge styles, and priority helper
- [X] T005 [P] Implement eligibility reason code dictionary in `src/features/admin/campaigns/utils/eligibility-reason.ts` mapping all 12 backend reason codes to friendly Vietnamese messages, handling empty strings for `granted` and `eligible_pending`, and fallback for unexpected codes
- [X] T006 Implement API client in `src/features/admin/campaigns/api/campaign-admin.api.ts` wrapping all 8 endpoints (`getCampaigns`, `getCampaignDetail`, `getCampaignClaims`, `getAccountEligibility`, `createCampaign`, `updateCampaign`, `closeCampaign`, `getCampaignAudit`) using `@/lib/axios`
- [X] T007 Implement TanStack Query hooks and mutations in `src/features/admin/campaigns/queries/campaign-admin.queries.ts` with explicit query keys, cache invalidation, and mandatory re-fetching of `GET /{code}` on write mutations (`useCreateCampaign`, `useUpdateCampaign`, `useCloseCampaign`)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Giám sát Danh sách Chiến dịch & Cảnh báo Sức khỏe Cơ chế Cấp (Priority: P1) 🎯 MVP

**Goal**: Hiển thị bảng điều khiển danh sách chiến dịch tặng gói tập trung với 6 trạng thái vòng đời, số liệu ngân sách thực tế, huy hiệu khóa ngân sách, và cảnh báo đỏ nổi bật khi worker cấp nền bị suy giảm (`degraded: true`).

**Independent Test**: Đăng nhập quyền Admin, truy cập `/admin/campaigns`, kiểm tra bảng danh sách chiến dịch hiển thị đầy đủ các cột ngân sách, trạng thái chính xác, và chỉ báo cảnh báo đỏ xuất hiện khi `degraded: true`.

- [X] T008 [P] [US1] Create `CampaignStatusBadge` component in `src/features/admin/campaigns/components/CampaignStatusBadge.tsx` displaying status labels, variant colors, and tooltip for `closedAt`
- [X] T009 [P] [US1] Create `CampaignUrgentBanner` component in `src/features/admin/campaigns/components/CampaignUrgentBanner.tsx` displaying prominent red warning banner when `degraded: true` with `degradedReason` and `lastSweepAt`
- [X] T010 [US1] Create `CampaignTable` component in `src/features/admin/campaigns/components/CampaignTable.tsx` rendering columns: code, plan name, quota, reserve, granted total, remaining, status badge, `budgetLocked` badge, dates, and row action links
- [X] T011 [US1] Create `CampaignDashboardHeader` component in `src/features/admin/campaigns/components/CampaignDashboardHeader.tsx` with title, total counts, and "Mở chiến dịch mới" CTA button
- [X] T012 [US1] Implement Main Campaigns Dashboard page in `src/app/admin/campaigns/page.tsx` integrating header, urgent banner, table, pagination controls, and empty/loading states

**Checkpoint**: User Story 1 is fully functional and testable as the core MVP.

---

## Phase 4: User Story 2 - Tra cứu Điều kiện & Giải đáp Thắc mắc Cấp gói của Khách hàng (Priority: P1) 🎯 MVP

**Goal**: Cung cấp công cụ tra cứu tức thời cho nhân viên CS để giải đáp thắc mắc tài khoản khách hàng theo `userId` và `campaignCode`, phân biệt chính xác 6 trạng thái điều kiện (đặc biệt không gộp `eligible_pending` vào `exhausted`), và hiển thị 12 mã lý do tiếng Việt.

**Independent Test**: Nhập mã chiến dịch và mã người dùng vào widget tra cứu, kiểm tra kết quả hiển thị đúng trạng thái điều kiện, nhãn thời gian hết hạn nếu đã cấp, thông báo chờ xử lý nếu `eligible_pending`, và thông báo phân biệt rõ ràng khi sai mã chiến dịch vs sai mã người dùng (404).

- [X] T013 [P] [US2] Create `CustomerEligibilityResult` component in `src/features/admin/campaigns/components/CustomerEligibilityResult.tsx` rendering 6 eligibility statuses, distinct styling for `eligible_pending` ("Bạn đủ điều kiện, hệ thống đang xử lý — thường chưa tới 1 phút"), expiry date for `granted`, and translated reason messages
- [X] T014 [US2] Create `CustomerEligibilityCard` component in `src/features/admin/campaigns/components/CustomerEligibilityCard.tsx` with campaign code selector/input, user ID input with trim validation, loading indicator, and specific 404 error differentiation
- [X] T015 [US2] Integrate `CustomerEligibilityCard` into `src/app/admin/campaigns/page.tsx` as a prominent tab/panel for instant support lookups

**Checkpoint**: User Stories 1 AND 2 are both functional independently, providing complete operational visibility and customer support capabilities.

---

## Phase 5: User Story 3 - Mở Mới Chiến Dịch Tặng Gói (Priority: P2)

**Goal**: Cho phép Quản trị viên khởi tạo chiến dịch tặng gói trực tiếp trên giao diện với các quy tắc kiểm tra nghiêm ngặt mã `code` regex, gói cước, hạn mức, thời gian RFC3339 có múi giờ, và xử lý lỗi xung đột mã (409 Conflict).

**Independent Test**: Nhấn "Mở chiến dịch mới", nhập dữ liệu, thử gửi mã không hợp lệ (báo lỗi ngay), gửi mã trùng (báo lỗi 409 bên cạnh ô nhập), và gửi mã hợp lệ (chuyển hướng sang trang chi tiết chiến dịch và nạp lại số liệu ngân sách thực tế).

- [X] T016 [P] [US3] Create Zod form validation schema for campaign creation in `src/features/admin/campaigns/utils/campaign-validation.ts` validating `code` regex `^[a-z0-9][a-z0-9-]{2,63}$`, `planSlug`, `quota >= 1`, `reserve >= 0`, `startsAt` RFC3339 timezone check, and `endsAt > startsAt`
- [X] T017 [US3] Create `CreateCampaignModal` component in `src/features/admin/campaigns/components/CreateCampaignModal.tsx` using `react-hook-form` + Zod, displaying input fields, timezone helper, 409 conflict error mapping ("Đã tồn tại chiến dịch với mã..."), and automatic navigation to detail page on success
- [X] T018 [US3] Connect `CreateCampaignModal` with the CTA button in `src/features/admin/campaigns/components/CampaignDashboardHeader.tsx`

**Checkpoint**: User Stories 1, 2, and 3 work seamlessly together.

---

## Phase 6: User Story 4 - Xem Chi Tiết, Chỉnh Sửa Chiến Dịch & Quy Tắc Khóa Hạn Mức (Priority: P2)

**Goal**: Trang chi tiết chiến dịch trực quan hóa tiến độ ngân sách, mốc ưu tiên, lần quét bù cuối; biểu mẫu chỉnh sửa tự động khóa `quota`, `reserve`, `planSlug` khi `budgetLocked = true`, chỉ gửi các trường thay đổi kèm `version`, và xử lý xung đột phiên bản (412 Precondition Failed).

**Independent Test**: Truy cập `/admin/campaigns/[code]`, kiểm tra thanh tiến độ ngân sách; mở modal sửa chiến dịch đã cấp để xác nhận 3 ô ngân sách bị vô hiệu hóa; thử thay đổi thời gian kết thúc hoặc xóa ngày kết thúc (`endsAt: null`); kiểm tra xử lý lỗi 412 tự động làm mới form.

- [X] T019 [P] [US4] Create `CampaignBudgetProgressBar` component in `src/features/admin/campaigns/components/CampaignBudgetProgressBar.tsx` visualizing main quota and reserve progress, showing granted numbers, percentages, and hard cap
- [X] T020 [P] [US4] Create `CampaignOverviewTab` component in `src/features/admin/campaigns/components/CampaignOverviewTab.tsx` displaying campaign summary metrics, watermark timestamp, sweep timestamp, closed timestamp, and version badge
- [X] T021 [US4] Create `EditCampaignModal` component in `src/features/admin/campaigns/components/EditCampaignModal.tsx` enforcing budget lock (disabling `quota`, `reserve`, `planSlug` with amber warning when `budgetLocked: true`), sending only modified fields + `version`, supporting `endsAt: null`, and handling HTTP 412 version conflicts by notifying and refetching
- [X] T022 [US4] Implement Campaign Detail page container in `src/app/admin/campaigns/[code]/page.tsx` with header, action buttons ("Sửa", "Đóng"), and tab layout

**Checkpoint**: Campaign management lifecycle (view detail, lock enforcement, edit) is complete.

---

## Phase 7: User Story 5 - Đóng Cưỡng Bức Chiến Dịch Tặng Gói Một Chiều (Priority: P2)

**Goal**: Cung cấp công tắc dừng khẩn cấp cho Quản trị viên đóng chiến dịch một chiều an toàn với hộp thoại xác nhận nghiêm ngặt, lý do giải trình bắt buộc, gửi `version`, và cập nhật trạng thái `closed`.

**Independent Test**: Bấm "Đóng chiến dịch" trên một chiến dịch đang chạy, xác nhận hộp thoại cảnh báo một chiều xuất hiện, nút đóng bị vô hiệu hóa khi chưa nhập lý do, nhập lý do và bấm xác nhận, kiểm tra trạng thái chuyển sang "Đã đóng" (`closed`) kèm thời điểm `closedAt`.

- [X] T023 [US5] Create `CloseCampaignDialog` component in `src/features/admin/campaigns/components/CloseCampaignDialog.tsx` using `AlertDialog` with red destructive CTA, irreversible action warning, mandatory `reason` textarea validation, sending `version` + `reason`, and refetching campaign detail on success
- [X] T024 [US5] Wire `CloseCampaignDialog` into `src/app/admin/campaigns/[code]/page.tsx` header actions, disabling the trigger if status is already `closed`

**Checkpoint**: Emergency stop capability is fully implemented and tested.

---

## Phase 8: User Story 6 - Tra Cứu Danh Sách Lượt Cấp Của Chiến Dịch (Claims Audit) (Priority: P3)

**Goal**: Hiển thị bảng danh sách các tài khoản người dùng đã được cấp gói, phân biệt nguồn cấp `main` ("Hạn mức chính") và `reserve` ("Suất dự phòng"), kèm bộ lọc theo khoảng thời gian chuẩn RFC3339 có múi giờ.

**Independent Test**: Mở tab "Lượt cấp gói" trong chi tiết chiến dịch, kiểm tra các dòng dữ liệu hiển thị đúng nguồn cấp, lọc theo khoảng ngày giờ `from`/`to` và xác nhận yêu cầu gửi chuẩn RFC3339 có múi giờ, phân trang hoạt động chính xác.

- [X] T025 [P] [US6] Create `CampaignClaimsFilter` component in `src/features/admin/campaigns/components/CampaignClaimsFilter.tsx` with date picker for `from` and `to` timestamps formatted with RFC3339 local timezone
- [X] T026 [US6] Create `CampaignClaimsTab` component in `src/features/admin/campaigns/components/CampaignClaimsTab.tsx` rendering claims table (userId, username, planSlug, source with badges "Hạn mức chính"/"Suất dự phòng", registeredAt, grantedAt, expiresAt), pagination, and empty states
- [X] T027 [US6] Integrate `CampaignClaimsTab` into `src/app/admin/campaigns/[code]/page.tsx` as Tab 2

**Checkpoint**: Claims audit table and filtering are fully operational.

---

## Phase 9: User Story 7 - Xem Nhật Ký Kiểm Toán Thao Tác Chiến Dịch (Audit Log) (Priority: P3)

**Goal**: Hiển thị lịch sử toàn bộ các hành động tạo, chỉnh sửa, đóng chiến dịch với bảng đối chiếu Trước → Sau (Before/After Diff), lý do đóng, thông tin người thực hiện, xử lý an toàn `targetId: null`, và ghi chú cơ chế ghi bất đồng bộ.

**Independent Test**: Mở tab "Nhật ký kiểm toán" của chiến dịch, kiểm tra các dòng hành động `campaign.create`, `campaign.update`, `campaign.close`, xem bảng đối chiếu Before vs After của các trường đã đổi và lý do đóng.

- [X] T028 [P] [US7] Create `CampaignAuditDiffViewer` component in `src/features/admin/campaigns/components/CampaignAuditDiffViewer.tsx` parsing polymorphic `payload` for `campaign.create`, `campaign.update` (Before vs After diff table with version), and `campaign.close` (reason + closedAt), safely handling `targetId: null` and extracting campaign code from `payload.campaignCode`
- [X] T029 [US7] Create `CampaignAuditTab` component in `src/features/admin/campaigns/components/CampaignAuditTab.tsx` rendering audit history, async emission note banner, pagination, and diff viewers
- [X] T030 [US7] Integrate `CampaignAuditTab` into `src/app/admin/campaigns/[code]/page.tsx` as Tab 3

**Checkpoint**: All 7 User Stories are fully implemented.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Unit testing, validation scenarios, code quality checks, and design polishing.

- [X] T031 [P] Add unit tests for `campaign-status.ts` and `eligibility-reason.ts` in `src/features/admin/campaigns/utils/__tests__/campaign-utils.test.ts`
- [X] T032 [P] Add API client unit tests with mock adapter in `src/features/admin/campaigns/api/__tests__/campaign-admin.api.test.ts`
- [X] T033 Run `quickstart.md` validation checklist, verify accessibility, test 400/404/409/412/422 error toast messages, and verify linting with `npm run lint`

---

## Dependencies & Execution Order

### Phase Dependencies

```mermaid
flowchart TD
    P1[Phase 1: Setup] --> P2[Phase 2: Foundational]
    P2 --> US1[Phase 3: US1 - Dashboard & Health Alert (P1 MVP)]
    P2 --> US2[Phase 4: US2 - Customer Eligibility Lookup (P1 MVP)]
    US1 --> US3[Phase 5: US3 - Create Campaign (P2)]
    US1 --> US4[Phase 6: US4 - Detail, Edit & Budget Lock (P2)]
    US4 --> US5[Phase 7: US5 - Force Close Campaign (P2)]
    US4 --> US6[Phase 8: US6 - Claims Audit (P3)]
    US4 --> US7[Phase 9: US7 - Audit Log Trail (P3)]
    US1 & US2 & US3 & US4 & US5 & US6 & US7 --> P10[Phase 10: Polish & Testing]
```

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel.
- **Phase 2**: T003, T004, and T005 can run in parallel before T006 and T007.
- **Phase 3 (US1)**: T008, T009 can be built in parallel.
- **Phase 4 (US2)**: T013 can be built in parallel with T014.
- **Phase 6 (US4)**: T019 and T020 can be built in parallel.
- **Phase 8 (US6)**: T025 can be built in parallel with T026.
- **Phase 9 (US7)**: T028 can be built in parallel with T029.
- **Phase 10**: T031 and T032 can be built in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 & User Story 2)
1. Complete **Phase 1: Setup** (T001 - T002)
2. Complete **Phase 2: Foundational** (T003 - T007)
3. Complete **Phase 3: US1 - Campaign Dashboard & Health Alert** (T008 - T012)
4. Complete **Phase 4: US2 - Customer Eligibility Lookup** (T013 - T015)
5. **STOP and VALIDATE**: Test MVP independently — operations team can now monitor all campaigns, see `degraded` alerts, and CS staff can immediately resolve customer eligibility complaints.

### Incremental Delivery
1. Add **US3: Create Campaign** (T016 - T018) -> Admin can self-serve new campaigns.
2. Add **US4 & US5: Detail, Edit & Force Close** (T019 - T024) -> Full lifecycle controls with budget lock protection.
3. Add **US6 & US7: Claims Audit & Audit Log Trail** (T025 - T030) -> Complete auditing and compliance verification.
4. Finalize with **Polish & Tests** (T031 - T033).
