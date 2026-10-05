# Quickstart & Verification Guide: Community Admin Dashboard

**Feature**: [spec.md](./spec.md) | **Branch**: `029-community-admin-dashboard` | **Date**: 2026-10-04

---

## 1. Chuẩn bị Môi trường (Prerequisites)

1. Đăng nhập bằng tài khoản Quản trị viên (Admin) trên hệ thống Closy Smart Wardrobe.
2. Khởi chạy máy chủ frontend phát triển:
   ```bash
   npm run dev
   ```
3. Truy cập địa chỉ `http://localhost:3000/admin/community`.

---

## 2. Kịch bản Kiểm thử Thủ công (Manual Validation Scenarios)

### Kịch bản 1: Kiểm tra Điều hướng & Thẻ chỉ số tổng quan (KPIs)
* **Thao tác**:
  1. Mở bất kỳ trang admin nào (ví dụ: `/admin/dashboard`).
  2. Quan sát thanh bên trái (Sidebar), nhấn vào mục **"Cộng đồng"**.
  3. Kiểm tra URL chuyển thành `/admin/community` và mục "Cộng đồng" có hiệu ứng active.
  4. Quan sát 4 thẻ KPI đầu trang: Tổng bài đăng, Bài đăng đang ẩn, Tổng bình luận, Bình luận cần xử lý.
* **Kết quả mong đợi**: Thẻ KPI hiển thị đúng số liệu đếm từ hệ thống, giao diện đồng bộ theme dark/light.

---

### Kịch bản 2: Lọc, Tìm kiếm & Xem trước Bài đăng
* **Thao tác**:
  1. Tại tab "Bài đăng", chuyển đổi qua các bộ lọc: "Tất cả", "Công khai", "Đang ẩn", "Đã xóa".
  2. Gõ từ khóa tìm kiếm vào ô tìm kiếm (ví dụ tên tác giả hoặc từ trong tiêu đề).
  3. Nhấn vào một bài viết bất kỳ hoặc nút "Xem trước".
* **Kết quả mong đợi**:
  - Danh sách bài đăng cập nhật tương ứng theo từ khóa và trạng thái.
  - Cửa sổ Preview Modal mở ra hiển thị đầy đủ hình ảnh, video (nếu có), chi tiết bộ trang phục kèm thông tin tác giả.

---

### Kịch bản 3: Thao tác Ẩn & Khôi phục Bài đăng
* **Thao tác**:
  1. Tìm một bài viết đang ở trạng thái "Công khai".
  2. Nhấn nút "Ẩn bài viết".
  3. Quan sát trạng thái chuyển thành "Đang ẩn", nút bấm hiển thị spinner trong lúc gửi yêu cầu và có toast báo thành công.
  4. Lọc danh sách theo "Đang ẩn", nhấn "Khôi phục bài viết" trên bài viết vừa ẩn.
* **Kết quả mong đợi**: Bài viết chuyển về trạng thái "Công khai", thông báo toast xuất hiện, dữ liệu làm mới tức thì.

---

### Kịch bản 4: Xóa Bài đăng an toàn
* **Thao tác**:
  1. Nhấn nút "Xóa" tại một bài viết.
  2. Quan sát hộp thoại cảnh báo an toàn (`AlertDialog`) xuất hiện.
  3. Nhấn "Hủy" -> bài viết không bị xóa.
  4. Nhấn lại "Xóa" và chọn "Xác nhận xóa" -> bài viết chuyển sang trạng thái "Đã xóa" hoặc biến mất khỏi danh sách công khai.

---

### Kịch bản 5: Quản trị Bình luận & Bình luận theo Ngữ cảnh
* **Thao tác**:
  1. Chuyển sang tab "Bình luận toàn sàn".
  2. Thử tìm kiếm nội dung bình luận và thực hiện thao tác ẩn/khôi phục bình luận.
  3. Quay lại tab "Bài đăng", nhấn vào nút "Bình luận (X)" của một bài viết.
* **Kết quả mong đợi**:
  - Modal danh sách bình luận riêng của bài viết mở ra.
  - Có thể thực hiện ẩn/xóa bình luận trực tiếp bên trong modal mà không làm mất trang hiện tại.

---

## 3. Lệnh Kiểm thử Tự động (Automated Smoke Tests)

```bash
# Kiểm tra định kiểu TypeScript
npm run lint

# Chạy unit tests cho các queries và components admin
npm test -- src/features/admin
```
