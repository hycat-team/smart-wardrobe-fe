# Data Model: 032 Fix Avatar Signature Upload

**Branch**: `032-fix-avatar-signature` | **Date**: 2026-10-06 | **Spec**: [spec.md](./spec.md)

Tài liệu này định nghĩa cấu trúc dữ liệu, các interface TypeScript, cấu trúc payload biểu mẫu và các ràng buộc toàn vẹn cho luồng tải lên ảnh đại diện qua Cloudinary có chữ ký bảo mật.

---

## 1. Entities & Data Interfaces

### 1.1. `AvatarSignatureResult` (Backend Response Model)
Mô hình dữ liệu trả về từ backend endpoint `GET /api/v1/me/avatar-signature` (theo `docs/api/identity/me-api.md §5`):

```typescript
export interface AvatarSignatureResult {
  signature: string;      // Chuỗi chữ ký SHA do backend tạo
  timestamp: number;      // Unix timestamp tại thời điểm ký
  folder: string;         // Thư mục lưu trữ trên Cloudinary (vd: "smart_wardrobe/avatars")
  apiKey: string;         // Public API key của Cloudinary
  publicId?: string;      // Định danh tài sản cố định (= userId). Backend BẮT BUỘC ký trường này cho avatar
  resourceType?: string;  // Luôn là 'image' đối với avatar
  allowedFormats?: string;// Tùy chọn (vắng đối với endpoint avatar)
}
```

### 1.2. `CloudinaryUploadParams` (Client Function Input)
Tham số đầu vào của hàm `uploadToCloudinary` trong `src/lib/cloudinary.ts`:

```typescript
export interface CloudinaryUploadParams {
  file: File | Blob;
  signatureParams: {
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: string;
    publicId?: string;
    public_id?: string;
    uploadPreset?: string;
    upload_preset?: string;
    resourceType?: 'image' | 'video';
    allowedFormats?: string;
  };
  resourceType?: 'image' | 'video';
}
```

### 1.3. `CloudinaryMultipartFormData` (Wire Payload Contract)
Dữ liệu nhị phân `multipart/form-data` thực tế gửi lên `POST https://api.cloudinary.com/v1_1/:cloud_name/image/upload`:

| Trường (Form Key) | Kiểu dữ liệu | Bắt buộc | Nguồn gốc | Mô tả / Giá trị |
|---|---|:---:|---|---|
| `file` | `File \| Blob` | Có | Người dùng chọn | Tệp ảnh nhị phân |
| `api_key` | `string` | Có | `signatureParams.apiKey` | Khóa API Cloudinary |
| `timestamp` | `string` | Có | `signatureParams.timestamp.toString()` | Thời điểm tạo chữ ký |
| `signature` | `string` | Có | `signatureParams.signature` | Chữ ký số SHA |
| `folder` | `string` | Có | `signatureParams.folder` | Thư mục đích |
| `public_id` | `string` | Có (khi có `pid`) | `pid` (`publicId` hoặc `public_id`) | Mã định danh người dùng (`userId`) |
| `overwrite` | `string` | Có (khi có `pid`) | Tự động gắn `"true"` | Chỉ thị ghi đè asset cũ |

> **Quy tắc bất biến (Critical Invariant)**:
> Khi `pid` tồn tại: Form **chính xác 7 trường**.
> Không được phép gửi thừa trường `publicId` (camelCase) hoặc các trường chưa được backend ký.
> Khi `pid` không tồn tại (các luồng tải lên khác): Form **chính xác 5 trường** (hoặc 6 nếu có `allowed_formats`). Tuyệt đối KHÔNG có `public_id` và `overwrite`.

### 1.4. `CloudinaryUploadResponse` (Cloudinary Success Result)
```typescript
export interface CloudinaryUploadResponse {
  secure_url: string;     // URL HTTPS ảnh đã upload trên Cloudinary CDN
  public_id: string;      // Mã định danh ảnh trả về từ Cloudinary
  format: string;         // Định dạng ảnh (jpg, png, webp, ...)
  width: number;          // Chiều rộng ảnh (pixels)
  height: number;         // Chiều cao ảnh (pixels)
  bytes: number;          // Kích thước tệp (bytes)
  [key: string]: any;
}
```

### 1.5. `UpdateAvatarReq` (Profile Update Payload)
Dữ liệu gửi lên backend endpoint `PUT /api/v1/me/avatar`:

```typescript
export interface UpdateAvatarReq {
  avatarUrl: string;       // URL lấy từ uploadRes.secure_url
  avatarPublicId: string; // Public ID lấy từ uploadRes.public_id
}
```

---

## 2. Luồng Chuyển Trạng Thái Dữ Liệu (State Lifecycle)

```
[Người dùng chọn file]
       │
       ▼
Kiểm tra Client-side: file.type.startsWith('image/')
       │ (Hợp lệ)
       ▼
profileApi.getAvatarSignature()
       │ Trả về { apiKey, timestamp, signature, folder, publicId }
       ▼
uploadToCloudinary({ file, signatureParams })
       │ Tạo FormData với 7 trường:
       │ [file, api_key, timestamp, signature, folder, public_id, overwrite="true"]
       ▼
Gửi HTTP POST sang Cloudinary
       │
       ├─► [HTTP 200 OK] ──► Nhận { secure_url, public_id }
       │                           │
       │                           ▼
       │                     profileApi.updateAvatar({ avatarUrl, avatarPublicId })
       │                           │
       │                           ▼
       │                     Cập nhật Cache User & Hiển thị Avatar mới
       │
       └─► [HTTP 400 Error] ──► Ném Exception ──► Toast lỗi tiếng Việt & Reset file input
```

---

## 3. Ràng Buộc & Quy Tắc Xác Thực (Validation Rules)

1. **Ràng buộc định dạng tệp (MIME Type)**: Chỉ chấp nhận các tệp có `file.type.startsWith('image/')`. Tệp không hợp lệ bị từ chối ngay lập tức và hiển thị thông báo toast: `"Vui lòng chọn file hình ảnh"`.
2. **Ràng buộc chữ ký Cloudinary**:
   - Backend ký chuỗi: `folder=<folder>&overwrite=true&public_id=<userId>&timestamp=<timestamp>`
   - Bất kỳ sự thiếu sót hoặc sai lệch giá trị nào của 4 tham số này trong FormData gửi lên Cloudinary sẽ dẫn đến lỗi `Invalid Signature`.
3. **Ràng buộc ghi đè an toàn**:
   - `overwrite` luôn luôn mang giá trị chuỗi `"true"`.
   - Asset cũ trên Cloudinary sẽ được thay thế nguyên trạng tại `public_id`, URL ảnh CDN tự động cập nhật mà không cần thay đổi `publicId` trong cơ sở dữ liệu người dùng.
