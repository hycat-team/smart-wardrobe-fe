# Quickstart & Verification Guide: 032 Fix Avatar Signature Upload

**Branch**: `032-fix-avatar-signature` | **Date**: 2026-10-06 | **Spec**: [spec.md](./spec.md)

Tài liệu này hướng dẫn cách kiểm thử và xác thực giải pháp sửa lỗi Invalid Signature khi tải ảnh đại diện lên Cloudinary.

---

## 1. Yêu Cầu Tiền Đề (Prerequisites)

- Môi trường Node.js $\ge 18$ và npm đã được cài đặt.
- Các phụ thuộc đã cài đặt đầy đủ (`npm install`).
- File biến môi trường `.env.local` có cấu hình `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (hoặc sử dụng fallback mặc định).

---

## 2. Kiểm Thử Tự Động (Automated Testing)

### 2.1. Chạy Unit Test Cho Cloudinary Client
Xác minh rằng thư viện `uploadToCloudinary` gửi đúng 7 trường bắt buộc khi có `publicId`, bao gồm cả `overwrite: "true"`:

```bash
npm test src/lib/cloudinary.test.ts
```

**Kết quả kỳ vọng**:
- Tất cả các test suites và test cases đều `PASS`.
- Ca kiểm thử `case publicId: 'some-id'` xác nhận:
  - `fd.get('public_id') === 'some-id'`
  - `fd.get('overwrite') === 'true'`
  - `fd.get('publicId') === null`
  - Danh sách keys trong form khớp chính xác với `['api_key', 'file', 'folder', 'overwrite', 'public_id', 'signature', 'timestamp']`.

### 2.2. Kiểm Tra An Toàn Kiểu Dữ Liệu TypeScript
Đảm bảo các thay đổi kiểu trả về tại `src/features/profile/api/profile.api.ts` không gây xung đột kiểu dữ liệu:

```bash
npx tsc --noEmit
```

**Kết quả kỳ vọng**:
- Lệnh thoát với mã `0`, không có lỗi biên dịch TypeScript.

---

## 3. Xác Thực Thủ Công Trên Trình Duyệt (Manual Verification)

### Bước 1: Khởi động môi trường phát triển
```bash
npm run dev
```
Mở trình duyệt truy cập `http://localhost:3000` và đăng nhập vào một tài khoản người dùng thử nghiệm.

### Bước 2: Thao tác tải ảnh đại diện tại `/profile`
1. Truy cập trang cá nhân: `http://localhost:3000/profile`.
2. Mở cửa sổ DevTools của trình duyệt (F12) $\rightarrow$ chuyển sang tab **Network**.
3. Bấm vào nút camera trên avatar để chọn một tệp hình ảnh mới (JPG/PNG/WEBP).
4. Quan sát các yêu cầu mạng được kích hoạt:
   - Request 1: `GET /api/v1/me/avatar-signature` $\rightarrow$ Trả về `200 OK` với dữ liệu `{ apiKey, timestamp, signature, folder, publicId }`.
   - Request 2: `POST https://api.cloudinary.com/v1_1/:cloud_name/image/upload`:
     - Kiểm tra **Payload / Form Data**: Đảm bảo có cả `public_id` và `overwrite: true`.
     - Kiểm tra **Status**: Phải trả về `200 OK` (thay vì `400 Invalid Signature` như trước đây).
   - Request 3: `PUT /api/v1/me/avatar` $\rightarrow$ Trả về `200 OK`.
5. Quan sát giao diện:
   - Thông báo Toast hiển thị thành công.
   - Ảnh đại diện mới xuất hiện ngay trên giao diện mà không cần F5 tải lại trang.

### Bước 3: Thao tác tại trang chỉnh sửa hồ sơ `/profile/edit`
1. Truy cập `http://localhost:3000/profile/edit`.
2. Thực hiện chọn ảnh đại diện mới.
3. Xác nhận ảnh tải lên thành công, lưu lại và quay về trang profile thấy ảnh mới cập nhật đồng bộ.

### Bước 4: Kiểm tra tính độc lập của các luồng tải lên khác (Regression Check)
1. Thử tạo một vật phẩm tủ đồ mới (`/wardrobe/add`) hoặc một bài đăng mới (`/community`).
2. Tải ảnh lên và quan sát request Cloudinary:
   - Form Data của các luồng này KHÔNG ĐƯỢC có `public_id` và KHÔNG ĐƯỢC có `overwrite`.
   - Quá trình upload vẫn diễn ra bình thường, tạo ra các asset mới với ID ngẫu nhiên.
