# Research & Technical Decisions: 032 Fix Avatar Signature Upload

**Branch**: `032-fix-avatar-signature` | **Date**: 2026-10-06 | **Spec**: [spec.md](./spec.md)

## Context & Root Cause Analysis

### 1. Root Cause Analysis
Khi người dùng thực hiện đổi ảnh đại diện (avatar) trên nền tảng web (`/profile` hoặc `/profile/edit`), client gọi:
1. `GET /api/v1/me/avatar-signature` để lấy chữ ký tải lên Cloudinary.
2. `uploadToCloudinary({ file, signatureParams })` để gửi `multipart/form-data` lên Cloudinary endpoint `POST https://api.cloudinary.com/v1_1/:cloud_name/image/upload`.
3. Nhận kết quả và gọi `PUT /api/v1/me/avatar` để lưu URL và public ID mới.

Theo tài liệu đặc tả backend `docs/api/identity/me-api.md §5`:
- Backend ký 4 trường vào chuỗi ký Cloudinary: `timestamp`, `folder`, `public_id`, `overwrite=true`.
- Lý do backend đưa `public_id = userId` và `overwrite = true` vào chữ ký là để mọi ảnh đại diện của người dùng ghi đè trực tiếp lên asset cũ, không phát sinh asset rác trên Cloudinary.
- Cơ chế bảo mật của Cloudinary: Khi nhận request upload kèm signature, Cloudinary sẽ lấy **tất cả các trường mà client thực sự gửi lên trong FormData** (loại trừ `file`, `api_key`, `signature`), sắp xếp theo thứ tự bảng chữ cái và tính toán lại SHA signature bằng API Secret.
- Nếu client gửi thiếu bất kỳ trường nào đã được ký ở backend (trong trường hợp này là thiếu `overwrite`), chuỗi tính toán lại của Cloudinary sẽ khác với chuỗi backend đã ký $\rightarrow$ Cloudinary trả lỗi HTTP 400: `Invalid Signature <hash>. String to sign - '<folder>&<public_id>&<timestamp>'` (hoặc tương tự).

### 2. Hiện trạng triển khai Web vs Mobile
- **Trên Web** (`src/lib/cloudinary.ts:56-59`):
  ```typescript
  const pid = signatureParams.publicId || signatureParams.public_id;
  if (pid) {
    formData.append("public_id", pid);
    // THIẾU: formData.append("overwrite", "true");
  }
  ```
  Web chỉ append `public_id` mà **không append `overwrite`**, dẫn đến Cloudinary không nhận được `overwrite=true` $\rightarrow$ Chữ ký bị lệch $\rightarrow$ Bị lỗi Invalid Signature.

- **Trên Mobile** (`smart-wardrobe-mobile/lib/features/profile/data/profile_repository.dart:109-112`):
  ```dart
  if (signature.publicId != null && signature.publicId!.isNotEmpty) ...{
    'public_id': signature.publicId,
    'overwrite': 'true',
  },
  ```
  Mobile gửi đủ cả 2 trường `public_id` và `overwrite: 'true'`, nên upload thành công 100%.

- **TypeScript Interface** (`src/features/profile/api/profile.api.ts:27`):
  ```typescript
  getAvatarSignature: async (): Promise<{ signature: string; timestamp: number; folder: string; apiKey: string }>
  ```
  Kiểu trả về của API chưa khai báo trường `publicId?: string`, dù backend thực tế có trả về `publicId`.

---

## Technical Decisions

### Decision 1: Bổ sung `overwrite: 'true'` khi có `pid` trong `uploadToCloudinary`

- **Quyết định**: Trong block `if (pid) { ... }` của `src/lib/cloudinary.ts`, bổ sung:
  ```typescript
  formData.append("overwrite", "true");
  ```
- **Lý do**:
  1. Hợp đồng Cloudinary quy định rõ: Khi ký `overwrite=true` và `public_id`, bắt buộc client phải gửi cả 2 trường này thì Cloudinary mới tính toán ra cùng chữ ký.
  2. Trong toàn bộ hệ thống Smart Wardrobe, `GET /api/v1/me/avatar-signature` là endpoint duy nhất trả về `publicId` (tương ứng `userId`) và ký `overwrite=true` (theo `docs/api/identity/me-api.md §5: "endpoint duy nhất trong hệ thống có publicId").
  3. Tất cả các endpoint signature khác (quần áo trong tủ đồ, outfit, bài đăng cộng đồng) đều không trả về `publicId`, do đó biến `pid` sẽ là `undefined` và khối `if (pid)` hoàn toàn không chạy, không gửi thừa `public_id` hay `overwrite` làm hỏng chữ ký của các tính năng khác.
- **Phương án khác đã xem xét**:
  - *Thêm tham số `overwrite?: boolean` vào `CloudinaryUploadParams`*: Không cần thiết và dễ gây lỗi nếu lập trình viên quên truyền `overwrite: true`. Vì `public_id` luôn đi đôi với `overwrite: true` trong quy ước của hệ thống, tự động hóa gắn `overwrite = 'true'` khi có `pid` là giải pháp an toàn và nhất quán nhất, tương tự như mobile đã làm.

---

### Decision 2: Cập nhật kiểu trả về của `profileApi.getAvatarSignature`

- **Quyết định**: Cập nhật kiểu trả về trong `src/features/profile/api/profile.api.ts`:
  ```typescript
  getAvatarSignature: async (): Promise<{
    signature: string;
    timestamp: number;
    folder: string;
    apiKey: string;
    publicId?: string;
  }> => { ... }
  ```
- **Lý do**:
  - Khớp với dữ liệu thực tế trả về từ backend endpoint `GET /api/v1/me/avatar-signature` (`UploadSignatureResult` chứa `publicId`).
  - Đảm bảo tính an toàn kiểu dữ liệu (type-safe) khi truyền kết quả của `getAvatarSignature()` vào `signatureParams` của hàm `uploadToCloudinary`.
- **Phương án khác đã xem xét**:
  - *Để nguyên kiểu hiện tại và ép kiểu `(signatureData as any)` khi gọi*: Không tuân thủ nguyên tắc Clean Code và TypeScript Type-Safety của dự án.

---

### Decision 3: Nâng cấp và mở rộng bộ kiểm thử tự động `src/lib/cloudinary.test.ts`

- **Quyết định**: Cập nhật ca kiểm thử khi có `publicId` để xác nhận form gửi đi chứa cả `public_id` và `overwrite = 'true'`:
  - Kiểm tra `fd.get('public_id') === 'some-id'`.
  - Kiểm tra `fd.get('overwrite') === 'true'`.
  - Kiểm tra `formKeys(fd)` chứa đầy đủ danh sách các trường: `['api_key', 'file', 'folder', 'overwrite', 'public_id', 'signature', 'timestamp']`.
  - Thêm ca kiểm thử khẳng định khi KHÔNG có `publicId` (như upload ảnh tủ đồ), form TUYỆT ĐỐI KHÔNG chứa `overwrite` hay `public_id`.
- **Lý do**:
  - Đảm bảo ngăn ngừa tái phát lỗi (regression prevention).
  - Khóa chặt hợp đồng 7 trường bắt buộc theo tài liệu `me-api.md §5`.

---

## Rủi ro & Chiến lược phòng ngừa (Risk Mitigation)

| Rủi ro tiềm ẩn | Đánh giá | Chiến lược phòng ngừa |
|---|:---:|---|
| Ảnh hưởng đến các luồng upload khác (Wardrobe item, Post media) | Rất thấp | Khối `if (pid)` chỉ thực thi khi `publicId` hoặc `public_id` tồn tại. Các luồng khác không trả `publicId` nên `FormData` không đổi. Unit test hiện có sẽ bảo vệ điều này. |
| Cloudinary nhận `overwrite` dưới dạng boolean hay string | Không có | `FormData` chuẩn của browser và HTTP multipart luôn chuyển giá trị thành chuỗi `"true"`, khớp chuẩn Cloudinary REST API. |
| Lệch kiểu dữ liệu giữa các component gọi API | Không có | Cả `ProfileClient.tsx` và `ProfileUpdateClient.tsx` đều truyền thẳng `signatureData` vào `signatureParams`, không cần chỉnh sửa logic component. |
