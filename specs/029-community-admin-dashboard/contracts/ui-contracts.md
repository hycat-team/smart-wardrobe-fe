# UI Contracts: Community Admin Dashboard

**Feature**: [spec.md](../spec.md) | **Branch**: `029-community-admin-dashboard` | **Date**: 2026-10-04

---

## 1. Cấu trúc Component Giao diện (Component Hierarchy)

```text
src/app/admin/community/
├── page.tsx                           # Server Component cung cấp metadata & shell
└── components/
    ├── CommunityAdminClient.tsx       # Client container chính quản lý state tìm kiếm & tabs
    ├── CommunityKpiGrid.tsx           # Thẻ chỉ số tổng quan (Posts, Comments, Hidden, Deleted)
    ├── PostModerationTable.tsx        # Bảng/Lưới bài đăng + bộ lọc trạng thái + phân trang
    ├── CommentModerationTable.tsx     # Bảng bình luận + bộ lọc trạng thái + phân trang
    ├── PostDetailPreviewModal.tsx     # Modal xem chi tiết bài đăng & outfit/media
    └── ContextualCommentsModal.tsx    # Modal/Drawer duyệt bình luận của 1 bài viết cụ thể
```

---

## 2. Hợp đồng Props & Event Handlers của Component

### 2.1. `CommunityKpiGrid`

```typescript
export interface CommunityKpiGridProps {
  totalPosts?: number;
  hiddenPosts?: number;
  totalComments?: number;
  activeComments?: number;
  isLoading?: boolean;
  onFilterHiddenPosts?: () => void;
  onFilterHiddenComments?: () => void;
}
```

### 2.2. `PostModerationTable`

```typescript
export interface PostModerationTableProps {
  searchTerm: string;
  onSelectPostPreview: (post: PostRes) => void;
  onOpenContextualComments: (post: PostRes) => void;
}
```

* **Hành vi (Events)**:
  * Khi nhấn vào dòng bài viết hoặc nút "Xem trước": gọi `onSelectPostPreview(post)`.
  * Khi nhấn vào số bình luận: gọi `onOpenContextualComments(post)`.
  * Khi nhấn "Ẩn": kích hoạt `useAdminHidePost` kèm spinner.
  * Khi nhấn "Khôi phục": kích hoạt `useAdminRestorePost` kèm spinner.
  * Khi nhấn "Xóa": mở `AlertDialog` xác nhận, nếu đồng ý thì gọi `useAdminDeletePost`.

### 2.3. `CommentModerationTable`

```typescript
export interface CommentModerationTableProps {
  searchTerm: string;
}
```

* **Hành vi (Events)**:
  * Khi nhấn "Ẩn bình luận": kích hoạt `useAdminHideComment`.
  * Khi nhấn "Khôi phục bình luận": kích hoạt `useAdminRestoreComment`.
  * Khi nhấn "Xóa bình luận": mở `AlertDialog` xác nhận, nếu đồng ý thì gọi `useAdminDeleteComment`.

### 2.4. `PostDetailPreviewModal`

```typescript
export interface PostDetailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostRes | null;
  onHide: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}
```

---

## 3. Tích hợp Thanh điều hướng `AdminSidebar`

Cập nhật danh sách điều hướng trong [`src/features/admin/components/AdminSidebar.tsx`](file:///c:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/src/features/admin/components/AdminSidebar.tsx):

```typescript
import { MessageSquareText } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { href: '/admin/users', label: 'Người dùng', icon: UsersIcon },
  { href: '/admin/community', label: 'Cộng đồng', icon: MessageSquareText }, // Kích hoạt mục điều hướng
  { href: '/admin/wardrobe', label: 'Trang phục', icon: Shirt },
  { href: '/admin/category', label: 'Danh mục', icon: GridIcon },
  { href: '/admin/brands', label: 'Duyệt thương hiệu', icon: Building },
];
```

---

## 4. Hợp đồng Thông báo Phản hồi (Toast Feedback Contract)

| Hành động | Thành công (`toast.success`) | Thất bại (`toast.error`) |
|---|---|---|
| **Ẩn bài viết** | "Đã ẩn bài viết khỏi bảng tin cộng đồng." | "Không thể ẩn bài viết, vui lòng thử lại." |
| **Khôi phục bài viết**| "Đã khôi phục bài viết về trạng thái công khai." | "Không thể khôi phục bài viết." |
| **Xóa bài viết** | "Đã xóa bài viết thành công." | "Xóa bài viết thất bại." |
| **Ẩn bình luận** | "Đã ẩn bình luận thành công." | "Không thể ẩn bình luận." |
| **Khôi phục bình luận**| "Đã khôi phục bình luận thành công." | "Không thể khôi phục bình luận." |
| **Xóa bình luận** | "Đã xóa bình luận thành công." | "Không thể xóa bình luận." |
