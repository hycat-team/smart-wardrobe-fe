# Quickstart & Verification Guide: Media Compression & Video Upload Limits

**Feature**: `030-media-compression-video-limit`  
**Date**: 2026-10-05  

## 1. Prerequisites & Environment

- Node.js >= 18.x
- Trình duyệt hỗ trợ WebP & HTML5 Canvas (Google Chrome, Microsoft Edge, Firefox, Safari 14+)
- Môi trường thử nghiệm FE khởi chạy:
  ```bash
  npm run dev
  ```
  Truy cập ứng dụng tại `http://localhost:3000`

---

## 2. Verification Scenarios

### Kịch bản 1: Kiểm thử nén ảnh WebP sắc nét ở Tủ đồ (Wardrobe Upload)
1. Truy cập trang Tải đồ vào tủ đồ: `http://localhost:3000/wardrobe/upload`.
2. Chuẩn bị 1 hoặc nhiều ảnh mẫu định dạng JPG/PNG dung lượng lớn (ví dụ ảnh chụp điện thoại 3MB - 6MB).
3. Kéo thả hoặc chọn ảnh vào khung tải ảnh.
4. Mở tab **Network** trong Developer Tools của trình duyệt (lọc `cloudinary` hoặc fetch request).
5. Bấm nút **"Tải lên & Phân tích"**.
6. **Kết quả mong đợi**:
   - Request upload gửi đến Cloudinary mang tệp có `Content-Type: image/webp` hoặc tên file đuôi `.webp`.
   - Dung lượng payload gửi đi giảm từ 50% đến 80% so với ảnh gốc (từ 4MB xuống còn ~400KB - 800KB).
   - Ảnh hiển thị sau khi AI phân tích trên giao diện tủ đồ giữ nguyên độ sắc nét cao của trang phục.

### Kịch bản 2: Kiểm thử nén ảnh WebP ở Đăng bài Cộng đồng (Community Post Composer)
1. Truy cập trang Cộng đồng: `http://localhost:3000/community`.
2. Bấm nút **"Tạo bài viết"** để mở modal soạn bài.
3. Chọn loại bài viết là "Chia sẻ phong cách / Media" hoặc đính kèm ảnh vào bài viết outfit.
4. Chọn từ 2 đến 3 tệp ảnh lớn (PNG, JPG).
5. Bấm nút **"Đăng bài"**.
6. **Kết quả mong đợi**:
   - Các ảnh được nén sang WebP trước khi gửi lên Cloudinary.
   - Quá trình đăng bài hoàn tất nhanh chóng.
   - Bài viết xuất hiện trên feed với các ảnh hiển thị rõ ràng, sắc nét và tải nhanh.

### Kịch bản 3: Chặn tệp Video vượt quá 100MB ở Đăng bài Cộng đồng
1. Mở modal **"Tạo bài viết"** tại trang Cộng đồng.
2. Chọn loại bài viết Media hoặc đính kèm video.
3. Chọn một tệp video có dung lượng $> 100\text{MB}$ (ví dụ 105MB).
4. **Kết quả mong đợi**:
   - Hệ thống chặn tệp ngay lập tức mà không bị đơ trình duyệt.
   - Tệp video quá cỡ không được thêm vào danh sách ảnh/video xem trước.
   - Thông báo lỗi hiển thị rõ ràng trên màn hình:
     `"Video '[Tên tệp]' vượt quá dung lượng tối đa 100MB."`
   - Tab Network hoàn toàn không phát sinh request xin chữ ký hay upload tệp video này.

### Kịch bản 4: Chấp nhận Video hợp lệ ($\le 100\text{MB}$ và $\le 60\text{s}$)
1. Chọn một tệp video hợp lệ có dung lượng $< 100\text{MB}$ (ví dụ 15MB) và thời lượng dưới 60 giây.
2. **Kết quả mong đợi**:
   - Tệp video được nạp thành công, khung video xem trước hiển thị mượt mà.
   - Cho phép người dùng đăng bài viết bình thường.

---

## 3. Automated Test Commands

Chạy kiểm thử tự động cho các hàm tiện ích nén ảnh và kiểm tra dung lượng media:
```bash
# Chạy toàn bộ test cho community utils và image compression
npm test -- src/features/community/utils/community.utils.test.ts
npm test -- src/lib/image-compression.test.ts
```
