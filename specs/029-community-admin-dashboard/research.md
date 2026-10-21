# Technical Research: Community Admin Dashboard

**Feature**: [spec.md](./spec.md) | **Branch**: `029-community-admin-dashboard` | **Date**: 2026-10-04

---

## 1. Bối cảnh & Mục tiêu nghiên cứu

Người dùng yêu cầu xây dựng giao diện dashboard cho Quản trị viên (Admin) quản lý cộng đồng thời trang Smart Wardrobe dựa trên tập API "Community Admin":
- `GET /api/v1/admin/posts` (Danh sách bài đăng)
- `PATCH /api/v1/admin/posts/{postId}/hide` (Ẩn bài đăng)
- `PATCH /api/v1/admin/posts/{postId}/restore` (Khôi phục bài đăng)
- `DELETE /api/v1/admin/posts/{postId}` (Xóa bài đăng)
- `GET /api/v1/admin/comments` (Danh sách bình luận)
- `PATCH /api/v1/admin/comments/{commentId}/hide` (Ẩn bình luận)
- `PATCH /api/v1/admin/comments/{commentId}/restore` (Khôi phục bình luận)
- `DELETE /api/v1/admin/comments/{commentId}` (Xóa bình luận)

Hiện tại trong mã nguồn frontend:
1. Đã có một màn hình kiểm duyệt thử nghiệm tại `src/app/admin/moderation` nhưng mục sidebar menu trong [`AdminSidebar.tsx`](file:///c:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/src/features/admin/components/AdminSidebar.tsx) đang bị comment out.
2. Chưa có một màn hình Dashboard cộng đồng hoàn chỉnh có các thẻ chỉ số KPI tổng quan (Metrics Cards) tổng hợp tình hình nội dung cộng đồng.
3. Cần làm rõ cấu trúc định tuyến (URL routing), cách thức hiển thị số liệu thống kê (KPIs), trải nghiệm xem chi tiết bài đăng/bình luận, và tính tương thích với hệ thống giao diện Admin hiện tại.

---

## 2. Quyết định Kiến trúc & Đánh giá giải pháp

### Quyết định 1: Định tuyến và Tích hợp Thanh bên (Routing & Navigation)

* **Vấn đề**: Nên đặt URL là `/admin/community` hay dùng lại `/admin/moderation`?
* **Đánh giá các phương án**:
  * *Phương án A*: Giữ nguyên `/admin/moderation`. Nhược điểm: Tên gọi "moderation" hẹp hơn "community dashboard", không bao quát được tổng thể hoạt động cộng đồng và chỉ số KPI.
  * *Phương án B (Được chọn)*: Xây dựng route chính thức tại `/admin/community` làm "Trung tâm Quản trị Cộng đồng" (Community Hub) với đầy đủ KPI Cards + Tabs quản lý (Bài đăng, Bình luận), đồng thời cấu hình chuyển hướng (redirect) từ `/admin/moderation` sang `/admin/community` để đảm bảo tương thích ngược tuyệt đối. Mở lại mục điều hướng trong `AdminSidebar.tsx` với icon `MessageSquareIcon` hoặc `UsersIcon` và nhãn "Cộng đồng".
* **Lý do chọn**: Đáp ứng đúng yêu cầu của người dùng ("làm giao diện dashboard cho admin quản lí community"), nâng tầm từ trang kiểm duyệt đơn thuần thành một Dashboard quản trị hoàn chỉnh.

---

### Quyết định 2: Chiến lược Tổng hợp Thống kê (KPI Cards & Overview Metrics)

* **Vấn đề**: Backend chưa có một endpoint riêng `GET /api/v1/admin/community/stats`. Làm sao để hiển thị các thẻ KPI (Tổng bài đăng, Bài viết đang ẩn, Tổng bình luận, Bình luận cần chú ý) mà không làm chậm ứng dụng?
* **Đánh giá các phương án**:
  * *Phương án A*: Bắt buộc backend phải triển khai endpoint stats mới. Nhược điểm: Gây phụ thuộc và chặn tiến độ phát triển FE.
  * *Phương án B (Được chọn)*: Tận dụng trường `metadata.totalItems` từ các truy vấn song song của TanStack Query:
    * Gọi `getAdminPosts({ limit: 1 })` để lấy `totalPosts`.
    * Gọi `getAdminPosts({ status: 'hidden', limit: 1 })` để lấy `hiddenPosts`.
    * Gọi `getAdminComments({ limit: 1 })` để lấy `totalComments`.
    * TanStack Query sẽ lưu cache với thời gian `staleTime: 60_000` (1 phút) để không gây tải cho server, đồng thời các thẻ KPI này có thể click vào để kích hoạt nhanh bộ lọc tương ứng bên dưới.
* **Lý do chọn**: Khả thi 100% với các endpoint backend hiện có theo đúng hình ảnh Swagger được cung cấp, không cần chờ backend viết thêm API mới.

---

### Quyết định 3: Xem trước Chi tiết Bài viết & Trang phục liên kết (Post & Outfit Preview)

* **Vấn đề**: Quản trị viên cần kiểm tra kỹ nội dung bài viết trước khi quyết định ẩn hoặc xóa (bài viết gồm loại `outfit` có đồ phối tủ đồ hoặc loại `media` có carousel ảnh/video).
* **Đánh giá các phương án**:
  * *Phương án A*: Mở tab trình duyệt mới sang trang người dùng (`/community/post/[id]`). Nhược điểm: Làm gián đoạn quy trình làm việc của Admin, nếu bài viết đang bị ẩn thì trang người dùng có thể trả về lỗi 404 không xem được.
  * *Phương án B (Được chọn)*: Tích hợp một `PostDetailPreviewModal` ngay trong trang Admin. Modal này hiển thị:
    * Thông tin tác giả kèm liên kết hồ sơ.
    * Tiêu đề và toàn bộ nội dung chia sẻ.
    * Lưới hoặc thanh cuộn ảnh/video độ phân giải cao.
    * Nếu là bài dạng `outfit`: hiển thị thẻ tóm tắt bộ trang phục tủ đồ (`outfit.name`, `coverUrl`, danh sách đồ phối nếu có).
    * Các nút hành động quản trị trực tiếp ngay trong Modal (Ẩn, Khôi phục, Xóa, Xem bình luận bài viết).
* **Lý do chọn**: Tối ưu tốc độ kiểm duyệt, bảo mật, và xem được nội dung kể cả khi bài viết đang ở trạng thái ẩn.

---

### Quyết định 4: Cơ chế Kiểm duyệt Bình luận theo Ngữ cảnh (Contextual Comments Drawer)

* **Vấn đề**: Khi một bài đăng có bình luận gây tranh cãi, làm sao để admin kiểm duyệt bình luận của bài viết đó mà không phải rời sang tab "Bình luận toàn sàn" rồi lọc thủ công?
* **Đánh giá các phương án**:
  * *Phương án A*: Chỉ cho phép kiểm duyệt bình luận ở tab "Bình luận". Nhược điểm: Mất ngữ cảnh bài viết, thao tác bất tiện.
  * *Phương án B (Được chọn)*: Thêm nút "Bình luận ({commentCount})" tại mỗi thẻ bài đăng trong tab Bài viết. Khi nhấn vào, một khung bên (Slide-over Sheet/Drawer hoặc Dialog) mở ra hiển thị danh sách bình luận của bài viết đó, cho phép ẩn hoặc xóa trực tiếp tại chỗ.
* **Lý do chọn**: Trực quan, tiết kiệm thời gian cho admin và nâng cao năng suất kiểm duyệt.

---

### Quyết định 5: Đồng bộ Cache và Phản hồi giao diện (Optimistic Query Invalidation)

* **Vấn đề**: Khi Admin ẩn hoặc khôi phục một bài viết hay bình luận, cần đảm bảo:
  1. Bảng dữ liệu của Admin cập nhật ngay lập tức.
  2. Bảng tin của người dùng bình thường (`useInfiniteCommunity` / `COMMUNITY_QUERY_KEYS.all`) cũng được làm mới dữ liệu để không hiển thị bài viết bị ẩn.
* **Giải pháp**:
  * Trong các hook mutation (`useAdminHidePost`, `useAdminRestorePost`, `useAdminDeletePost`, `useAdminHideComment`, `useAdminRestoreComment`, `useAdminDeleteComment`):
    * Invalidate `ADMIN_COMMUNITY_QUERY_KEYS.all`.
    * Invalidate `COMMUNITY_QUERY_KEYS.all` (để feed người dùng phản ánh đúng).
    * Hiển thị thông báo `toast.success` qua thư viện `sonner`.
    * Sử dụng `AlertDialog` của `@radix-ui/react-alert-dialog` cho các thao tác hủy hoại (xóa vĩnh viễn).

---

## 3. Tổng kết Công nghệ & Thư viện sử dụng

| Mục đích | Thư viện / Công nghệ | Lý do lựa chọn |
|---|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 | Khung nền tảng của dự án |
| **Data Fetching & Cache** | `@tanstack/react-query` v5 | Quản lý server state, phân trang, stale-while-revalidate |
| **UI Components** | Radix UI (`Tabs`, `Dialog`, `AlertDialog`, `DropdownMenu`) | Chuẩn headless component của dự án, accessibility cao |
| **Icons** | `lucide-react` | Bộ icon chuẩn mực, đồng bộ giao diện Closy |
| **Thông báo** | `sonner` (`toast.success`, `toast.error`) | Hệ thống toast hiện có trong dự án |
| **Styling** | Tailwind CSS v4 | Thiết kế dark/light mode responsive, phong cách Closy Admin |
