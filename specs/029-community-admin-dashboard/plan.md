# Implementation Plan: Community Admin Dashboard (Giao diện Quản trị Cộng đồng)

**Branch**: `029-community-admin-dashboard` | **Date**: 2026-10-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/029-community-admin-dashboard/spec.md`

---

## Summary

Xây dựng màn hình Dashboard Quản trị Cộng đồng chuyên nghiệp và tập trung tại `/admin/community` cho phép quản trị viên:
1. Nắm bắt tổng quan tình hình cộng đồng qua các thẻ chỉ số KPI (Tổng bài đăng, Bài viết đang ẩn, Tổng bình luận, Bình luận cần xử lý).
2. Kích hoạt mục điều hướng "Cộng đồng" trên thanh bên [`AdminSidebar.tsx`](file:///c:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/src/features/admin/components/AdminSidebar.tsx) để truy cập nhanh chóng.
3. Quản trị toàn diện bài đăng: Danh sách phân trang, tìm kiếm từ khóa/tác giả, lọc trạng thái (`published`, `hidden`, `deleted`), xem trước nội dung chi tiết bài viết (ảnh/video, đồ phối outfit tủ đồ) và thực hiện các thao tác kiểm duyệt trực tiếp (Ẩn bài đăng, Khôi phục, Xóa an toàn với hộp thoại xác nhận).
4. Quản trị bình luận toàn sàn: Xem danh sách, tìm kiếm, lọc trạng thái, ẩn, khôi phục và xóa bình luận vi phạm.
5. Kiểm duyệt bình luận theo ngữ cảnh bài viết: Xem và xử lý các bình luận của riêng một bài đăng cụ thể trực tiếp qua modal/drawer mà không cần chuyển trang.
6. Đồng bộ hóa cache React Query và phản hồi giao diện tức thì với thông báo toast tiếng Việt thân thiện.

---

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+

**Primary Dependencies**: Next.js 16.2.6 (App Router), React 19.2.4, `@tanstack/react-query` 5.100.14, Lucide React 1.21.0, Sonner 2.0.7, Radix UI (`@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-tabs`), Tailwind CSS v4

**Storage**: Server-side REST API qua axios client (`@/lib/axios`), TanStack Query in-memory cache

**Testing**: Jest 30.0.0, @testing-library/react 16.3.2, ESLint 9

**Target Platform**: Web Desktop / Laptop cho Quản trị viên hệ thống (hỗ trợ Responsive cho máy tính bảng)

**Project Type**: Next.js Web Application Frontend (Admin Portal)

**Performance Goals**: Tải bảng dữ liệu và thẻ KPI trong < 1s; phản hồi thao tác ẩn/khôi phục/xóa tức thời (< 500ms); chuyển đổi tab không tải lại trang (0s).

**Constraints**: Tuân thủ thiết kế tối giản, thanh lịch của Closy Admin; bảo vệ an toàn cho các thao tác xóa qua `AlertDialog`; đảm bảo quyền truy cập chỉ dành cho Admin.

**Scale/Scope**: Áp dụng cho module quản trị cộng đồng tại `src/app/admin/community` và cập nhật điều hướng `AdminSidebar`.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Client-First Responsiveness**: Giao diện cập nhật tức thì với Optimistic UI và TanStack Query invalidation.
- [x] **Type Safety**: Tất cả các models dữ liệu bài viết, bình luận và trạng thái lọc đều được định kiểu TypeScript nghiêm ngặt.
- [x] **Resilience & Defensiveness**: Xử lý đầy đủ loading states, empty states, error fallbacks, và chặn double-clicking bằng trạng thái pending/disabled.
- [x] **Design Consistency**: Đồng bộ hoàn toàn với palette màu, typography và components hiện tại của khu vực Admin Closy.

---

## Project Structure

### Documentation (this feature)

```text
specs/029-community-admin-dashboard/
├── spec.md                  # Đặc tả nghiệp vụ và yêu cầu chức năng
├── plan.md                  # Kế hoạch kỹ thuật này (/speckit-plan)
├── research.md              # Phase 0: Phân tích kỹ thuật & quyết định kiến trúc
├── data-model.md            # Phase 1: Thực thể dữ liệu & máy trạng thái
├── quickstart.md            # Phase 1: Hướng dẫn kiểm thử thủ công và tự động
├── checklists/
│   └── requirements.md      # Bảng thẩm định chất lượng đặc tả
└── contracts/
    ├── api-contracts.md     # Phase 1: Hợp đồng kết nối API Community Admin
    └── ui-contracts.md      # Phase 1: Hợp đồng giao diện, component & props
```

### Source Code Impact

```text
src/
├── app/
│   └── admin/
│       ├── community/
│       │   ├── page.tsx                           # [NEW] Server component & metadata
│       │   └── components/
│       │       ├── CommunityAdminClient.tsx       # [NEW] Client container chính quản lý state & tabs
│       │       ├── CommunityKpiGrid.tsx           # [NEW] Thẻ chỉ số tổng quan (Posts, Comments, Hidden, Deleted)
│       │       ├── PostModerationTable.tsx        # [NEW/REFACTOR] Bảng bài viết + bộ lọc + phân trang + quick actions
│       │       ├── CommentModerationTable.tsx     # [NEW/REFACTOR] Bảng bình luận toàn sàn + bộ lọc + phân trang
│       │       ├── PostDetailPreviewModal.tsx     # [NEW] Modal xem trước chi tiết bài viết & outfit
│       │       └── ContextualCommentsModal.tsx    # [NEW] Modal kiểm duyệt bình luận của 1 bài viết cụ thể
│       └── moderation/
│           └── page.tsx                           # [UPDATE] Chuyển hướng sang /admin/community
│
└── features/
    └── admin/
        ├── components/
        │   └── AdminSidebar.tsx                   # [UPDATE] Kích hoạt link menu "Cộng đồng"
        ├── api/
        │   └── community-admin.api.ts             # [REUSE/VERIFY] Các API client gọi endpoint admin
        └── queries/
            └── community-admin.queries.ts         # [REUSE/ENHANCE] TanStack Query hooks và query invalidation
```

---

## Complexity Tracking

Không có vi phạm kiến trúc nào. Tính năng tận dụng tối đa các endpoint backend hiện có theo chuẩn REST, tái sử dụng các component headless Radix UI có sẵn trong codebase và đảm bảo cấu trúc thư mục rõ ràng theo quy ước của dự án.
