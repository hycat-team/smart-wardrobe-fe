# Quickstart Validation Guide: Đồng bộ và xử lý toàn diện trạng thái phân tích ảnh trang phục AI

**Feature**: `027-analyze-status-handling`
**Date**: 2026-10-03
**Status**: Completed

Tài liệu này hướng dẫn cách kiểm thử và xác thực các luồng xử lý trạng thái phân tích ảnh trang phục AI trên frontend theo đặc tả tính năng.

---

## 1. Điều kiện tiên quyết (Prerequisites)

- Ứng dụng Frontend đang chạy (`npm run dev`) trên `http://localhost:3000`.
- Đã đăng nhập vào tài khoản người dùng có quyền truy cập tủ đồ cá nhân.
- Bộ test suite chạy bằng Jest:
  ```bash
  npx jest src/features/wardrobe/hooks/useWardrobeSSE.test.tsx
  ```

---

## 2. Các kịch bản kiểm thử (Validation Scenarios)

### Kịch bản 1: Kiểm thử hiển thị lỗi ảnh không hợp lệ & Ẩn nút "Thử lại" (US-1, BC-1, BC-2)

1. **Chuẩn bị**:
   - Tải lên ảnh không phải trang phục (chuột máy tính, điện thoại, sách hoặc ảnh trắng) hoặc mở trang chi tiết món đồ có `fashionItem.processingErrorReason: 'no_fashion_item_detected'`.
2. **Thực hiện**:
   - Mở màn hình danh sách tủ đồ (`/wardrobe`) và màn hình chi tiết món đồ (`/wardrobe/item/[id]`).
3. **Kết quả kỳ vọng**:
   - Danh sách thẻ món đồ hiển thị badge "Phân tích thất bại".
   - Chi tiết món đồ hiển thị thông điệp tiếng Việt: *"Ảnh không phải trang phục — hãy tải ảnh đúng món đồ"* (không bị nhầm sang thông báo nhiều món).
   - Nút **"Thử lại" / "Thử phân tích lại" hoàn toàn bị ẩn** hoặc không khả dụng.
   - Hiển thị nút "Xóa" hoặc hướng dẫn tải ảnh mới. Người dùng có thể xóa thành công món lỗi.

---

### Kịch bản 2: Kiểm thử hiển thị lỗi tạm thời & Cho phép "Thử lại" (US-1, FR-004)

1. **Chuẩn bị**:
   - Món đồ có `status: 4` (`Failed`) và `fashionItem.processingErrorReason: 'analysis_temporary_error'` hoặc `'auto_retry_exceeded'`.
2. **Thực hiện**:
   - Mở trang chi tiết món đồ (`/wardrobe/item/[id]`).
3. **Kết quả kỳ vọng**:
   - Hiển thị thông báo: *"Lỗi tạm thời — thử lại"* hoặc *"Đã thử nhiều lần — thử lại"*.
   - Nút **"Thử phân tích lại" hiển thị rõ ràng**.
   - Bấm nút "Thử phân tích lại" → gọi API `POST /wardrobe-items/{id}/retry-analysis` thành công → món chuyển sang trạng thái "AI đang phân tích" và theo dõi SSE.

---

### Kịch bản 3: Rà soát danh mục cho món `NeedsReview` & Kiểm tra lại ảnh (US-2, BC-3)

1. **Chuẩn bị**:
   - Món đồ có `status: 5` (`NeedsReview`) và `fashionItem.reviewReason: 'uncertain_category'`.
2. **Thực hiện**:
   - Mở trang chi tiết món đồ.
   - Quan sát phần rà soát danh mục.
   - Thử bấm "Gửi phân tích lại" khi chưa chọn danh mục (phải bị khóa/disabled).
   - Chọn một danh mục hợp lệ (ví dụ: "Áo sơ mi").
   - Bấm nút "Gửi phân tích lại".
3. **Kết quả kỳ vọng**:
   - Hệ thống gửi request `POST /wardrobe-items/{id}/retry-analysis` với body `{ "categoryId": "<uuid-da-chon>" }`.
   - Món đồ chuyển sang trạng thái "Đang xử lý", hiển thị spinner chờ kết quả qua SSE.
   - **Xác thực BC-3**: Không tự ý chuyển thẳng sang "Sử dụng được" khi chưa nhận event SSE. Nếu AI trả về `failed` (do ảnh không hợp lệ), màn hình lập tức cập nhật sang giao diện lỗi và hướng dẫn tải ảnh khác. Nếu AI trả về `completed`, màn hình cập nhật món sang sử dụng được.

---

### Kịch bản 4: Kiểm thử luồng Realtime SSE không bị đóng sớm (US-3)

1. **Chuẩn bị**:
   - Tải lên 1 ảnh đơn lẻ (`total = 1`) tại `/wardrobe/upload`.
2. **Thực hiện**:
   - Theo dõi luồng SSE qua console:
     - Event 1: `{ status: "processing", total: 1, index: 0 }`
     - Event 2: `{ status: "completed" | "failed", total: 1, index: 0, data: {...} }`
3. **Kết quả kỳ vọng**:
   - Client **không** đóng stream sau Event 1 (`processing`).
   - Client tiếp tục lắng nghe cho đến khi nhận được Event 2 (`completed` hoặc `failed`).
   - Giao diện cập nhật mượt mà, toast thông báo kết quả chính xác, danh sách tự refetch dữ liệu mới nhất.
