# Tasks: Community Admin Dashboard (Giao diện Quản trị Cộng đồng)

**Feature**: [spec.md](./spec.md) | **Branch**: `029-community-admin-dashboard` | **Date**: 2026-10-04

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Thiết lập định tuyến, điều hướng và cấu trúc thư mục nền tảng cho Community Admin Dashboard.

- [X] T001 Cập nhật liên kết điều hướng "Cộng đồng" (`/admin/community`) trong `src/features/admin/components/AdminSidebar.tsx`
- [X] T002 [P] Cấu hình chuyển hướng (redirect) từ route cũ `/admin/moderation` sang `/admin/community` trong `src/app/admin/moderation/page.tsx`
- [X] T003 [P] Khởi tạo Server Component và metadata cho trang quản trị cộng đồng trong `src/app/admin/community/page.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Khởi tạo kiểu dữ liệu, API client và TanStack Query hooks làm nền tảng cho mọi user stories.

**⚠️ CRITICAL**: Không bắt đầu triển khai các user stories cho đến khi hoàn thành xong Phase 2.

- [X] T004 Khởi tạo TypeScript interfaces (`CommunityPostAdmin`, `CommunityCommentAdmin`, `CommunityDashboardMetrics`, `PostModerationStatus: 'published' | 'hidden' | 'deleted'`, `CommentModerationStatus: 'active' | 'hidden' | 'deleted'`) trong `src/features/admin/types/community-admin.ts`
- [X] T005 [P] Kiểm tra và hoàn thiện các API methods (`getAdminPosts`, `hidePost`, `restorePost`, `deletePost`, `getAdminComments`, `hideComment`, `restoreComment`, `deleteComment`) trong `src/features/admin/api/community-admin.api.ts`
- [X] T006 [P] Cấu hình query keys và hooks mutation với cơ chế đồng bộ invalidation cache (`ADMIN_COMMUNITY_QUERY_KEYS.all` và `COMMUNITY_QUERY_KEYS.all`) trong `src/features/admin/queries/community-admin.queries.ts`

**Checkpoint**: Nền tảng Types và Data Fetching đã sẵn sàng - bắt đầu triển khai User Stories.

---

## Phase 3: User Story 1 - Bảng điều khiển tổng quan và định hướng quản trị cộng đồng (Priority: P1) 🎯 MVP

**Goal**: Cung cấp giao diện trung tâm `/admin/community` với thanh điều hướng kích hoạt, chuyển đổi tab mượt mà và 4 thẻ KPI chỉ số tổng quan (Tổng bài đăng, Bài đăng đang ẩn, Tổng bình luận, Bình luận cần xử lý).

**Independent Test**: Đăng nhập Admin, bấm vào mục "Cộng đồng" trên sidebar, xác nhận trang Dashboard tải lên với 4 thẻ KPI hiển thị số liệu từ server metadata và chuyển đổi tab "Bài đăng" / "Bình luận" trơn tru.

### Implementation for User Story 1

- [X] T007 [P] [US1] Hiện thực component hiển thị các thẻ chỉ số KPI tổng quan (`CommunityKpiGrid`) trong `src/app/admin/community/components/CommunityKpiGrid.tsx`
- [X] T008 [US1] Hiện thực Client Container chính (`CommunityAdminClient`) quản lý state tìm kiếm, chuyển đổi Tabs và nạp dữ liệu KPI trong `src/app/admin/community/components/CommunityAdminClient.tsx`
- [X] T009 [US1] Tích hợp `CommunityAdminClient` vào trang `src/app/admin/community/page.tsx`

**Checkpoint**: User Story 1 hoàn tất, admin có thể truy cập dashboard tổng quan từ sidebar.

---

## Phase 4: User Story 2 - Quản lý và kiểm duyệt bài đăng cộng đồng (Priority: P1)

**Goal**: Hiển thị bảng danh sách bài viết phân trang, tìm kiếm từ khóa/tác giả, lọc trạng thái (`published`, `hidden`, `deleted`), xem trước nội dung chi tiết bài viết (ảnh/video, đồ phối outfit tủ đồ) và thực hiện các hành động ẩn, khôi phục, xóa an toàn với hộp thoại xác nhận.

**Independent Test**: Mở tab Bài đăng, lọc theo "Đang ẩn", tìm kiếm bài viết, mở modal xem chi tiết bài đăng và outfit, thực hiện ẩn/khôi phục và xác nhận xóa với AlertDialog.

### Implementation for User Story 2

- [X] T010 [P] [US2] Hiện thực modal xem trước chi tiết bài viết (`PostDetailPreviewModal`) hỗ trợ hiển thị ảnh/video kích thước lớn, thông tin outfit tủ đồ và nút kiểm duyệt trong `src/app/admin/community/components/PostDetailPreviewModal.tsx`
- [X] T011 [US2] Hiện thực bảng quản lý bài đăng (`PostModerationTable`) gồm phân trang, bộ lọc trạng thái, tìm kiếm từ khóa, và các nút thao tác Ẩn/Khôi phục/Xóa với `AlertDialog` trong `src/app/admin/community/components/PostModerationTable.tsx`
- [X] T012 [US2] Tích hợp `PostModerationTable` và `PostDetailPreviewModal` vào tab "Bài đăng" của `CommunityAdminClient` trong `src/app/admin/community/components/CommunityAdminClient.tsx`

**Checkpoint**: User Story 1 và User Story 2 hoàn thành độc lập và tích hợp hoàn hảo.

---

## Phase 5: User Story 3 - Quản lý và kiểm duyệt bình luận toàn sàn (Priority: P2)

**Goal**: Hiển thị bảng bình luận toàn sàn phân trang, tìm kiếm nội dung/người bình luận, lọc trạng thái (`all`, `active`, `deleted` / `hidden`), và thực hiện ẩn, khôi phục, xóa bình luận vi phạm.

**Independent Test**: Chuyển sang tab Bình luận, tìm kiếm bình luận theo từ khóa, lọc bình luận, thực hiện thao tác ẩn/khôi phục/xóa bình luận và xác nhận cập nhật dữ liệu.

### Implementation for User Story 3

- [X] T013 [P] [US3] Hiện thực bảng quản lý bình luận toàn sàn (`CommentModerationTable`) gồm thông tin người bình luận, nội dung, bài viết cha, bộ lọc trạng thái, phân trang và các nút Ẩn/Khôi phục/Xóa trong `src/app/admin/community/components/CommentModerationTable.tsx`
- [X] T014 [US3] Tích hợp `CommentModerationTable` vào tab "Bình luận" của `CommunityAdminClient` trong `src/app/admin/community/components/CommunityAdminClient.tsx`

**Checkpoint**: Quản trị bình luận toàn sàn hoạt động độc lập và trơn tru.

---

## Phase 6: User Story 4 - Xem và xử lý bình luận theo ngữ cảnh bài viết (Priority: P3)

**Goal**: Cho phép quản trị viên xem danh sách các bình luận của riêng một bài đăng cụ thể trực tiếp từ thẻ bài viết và kiểm duyệt tại chỗ mà không cần rời khỏi trang.

**Independent Test**: Nhấn vào nút bình luận trên một bài đăng trong tab Bài viết, kiểm tra modal danh sách bình luận riêng mở ra và có thể ẩn/xóa bình luận trực tiếp trong modal.

### Implementation for User Story 4

- [X] T015 [P] [US4] Hiện thực modal xem bình luận theo ngữ cảnh bài viết (`ContextualCommentsModal`) hiển thị danh sách bình luận riêng kèm nút ẩn/xóa trong `src/app/admin/community/components/ContextualCommentsModal.tsx`
- [X] T016 [US4] Kết nối nút mở danh sách bình luận từ `PostModerationTable` tới `ContextualCommentsModal` trong `src/app/admin/community/components/CommunityAdminClient.tsx`

**Checkpoint**: Cả 4 User Stories đã hoàn thành và tích hợp đầy đủ.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Tinh chỉnh giao diện, xử lý trạng thái rỗng/lỗi, hoàn thiện thông báo tiếng Việt và kiểm tra toàn diện.

- [X] T017 [P] Bổ sung giao diện trạng thái rỗng (Empty State) và cơ chế thử lại khi gặp lỗi (Error State with Retry) trong `src/app/admin/community/components/PostModerationTable.tsx` và `src/app/admin/community/components/CommentModerationTable.tsx`
- [X] T018 [P] Chuẩn hóa toàn bộ thông báo toast bằng tiếng Việt qua `sonner` trong `src/features/admin/queries/community-admin.queries.ts`
- [X] T019 Kiểm tra định kiểu TypeScript và kiểm tra tương thích Dark/Light mode trên toàn bộ các components trong `src/app/admin/community/`
- [X] T020 Thực hiện kiểm thử thủ công theo các kịch bản trong `specs/029-community-admin-dashboard/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Không phụ thuộc - can start immediately
- **Foundational (Phase 2)**: Phụ thuộc vào Setup - **CHẶN** tất cả các user stories
- **User Stories (Phase 3+)**: Phụ thuộc vào hoàn thành Phase 2 Foundational.
  - US1 (P1 - MVP Dashboard & KPIs) hoàn thành trước.
  - US2 (P1 - Quản lý bài đăng) kế thừa cấu trúc từ US1.
  - US3 (P2 - Quản lý bình luận) song song với US2.
  - US4 (P3 - Bình luận ngữ cảnh) tích hợp sau US2.
- **Polish (Phase 7)**: Hoàn thành kiểm định chất lượng và test suite.
