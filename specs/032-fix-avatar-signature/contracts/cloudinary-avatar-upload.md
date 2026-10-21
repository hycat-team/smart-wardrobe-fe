# Interface Contract: Cloudinary Avatar Upload Form

**Branch**: `032-fix-avatar-signature` | **Date**: 2026-10-06 | **Spec**: [spec.md](../spec.md)

Tài liệu này đặc tả chi tiết giao ước dữ liệu (Interface Contract) giữa Smart Wardrobe Web Client và Cloudinary Upload REST API cho luồng tải lên ảnh đại diện cá nhân, đối chiếu với các luồng tải lên tài nguyên khác trong hệ thống.

---

## 1. Cloudinary Upload API Contract

- **Method**: `POST`
- **URL**: `https://api.cloudinary.com/v1_1/:cloud_name/:resource_type/upload`
  - `:cloud_name`: Lấy từ `process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (mặc định: `dzvwkngxu`)
  - `:resource_type`: `image` (cho avatar)
- **Headers**:
  - `Content-Type`: `multipart/form-data` (trình duyệt tự động đính kèm kèm `boundary`)
- **Body (`FormData`) Contract**:

### Luồng Tải Ảnh Đại Diện (Avatar Upload - Độc nhất hệ thống)

Dựa trên `docs/api/identity/me-api.md §5`, backend ký 4 tham số:
`folder`, `overwrite=true`, `public_id`, `timestamp`.

Biểu mẫu multipart gửi đi **bắt buộc gồm đúng 7 trường sau**:

| Khóa Biểu Mẫu (`FormData` key) | Kiểu | Giá trị mẫu | Được tính vào chuỗi ký? |
|---|---|---|:---:|
| `file` | Binary File / Blob | `[File data]` | Không |
| `api_key` | String | `"941234567891234"` | Không |
| `timestamp` | String | `"1790610642"` | **Có** |
| `signature` | String | `"a1b2c3d4e5f6..."` | Không |
| `folder` | String | `"smart_wardrobe/avatars"` | **Có** |
| `public_id` | String | `"usr_1029384756"` | **Có** |
| `overwrite` | String | `"true"` | **Có** |

> ⚠️ **Quy tắc nghiêm ngặt từ Cloudinary**:
> 1. Thiếu `overwrite`: Cloudinary tính lại hash chữ ký chỉ với `folder`, `public_id`, `timestamp` $\rightarrow$ Kết quả hash khác với hash backend đã ký $\rightarrow$ **HTTP 400 Invalid Signature**.
> 2. Gửi thừa `publicId` (camelCase): Cloudinary đưa `publicId` vào chuỗi ký $\rightarrow$ **HTTP 400 Invalid Signature**.
> 3. Bất kỳ trường nào ngoài 7 trường trên đều có thể làm sai lệch chữ ký và gây lỗi tải lên.

---

## 2. Đối Chiếu: Avatar Upload vs Các Luồng Upload Khác

| Thuộc tính | Luồng Avatar (`/me/avatar-signature`) | Luồng Vật Phẩm Tủ Đồ (`/wardrobe/items/upload-signature`) | Luồng Bài Đăng MXH (`/community/posts/upload-signature`) |
|---|---|---|---|
| **Mục đích** | Thay thế ảnh đại diện hiện tại | Tải ảnh quần áo mới | Tải ảnh/video bài viết mới |
| **Backend trả về `publicId`?** | **CÓ** (= `userId`) | **KHÔNG** | **KHÔNG** |
| **Backend ký `public_id`?** | **CÓ** | **KHÔNG** | **KHÔNG** |
| **Backend ký `overwrite`?** | **CÓ** (`overwrite=true`) | **KHÔNG** | **KHÔNG** |
| **Client gửi `public_id`?** | **CÓ** | **KHÔNG** | **KHÔNG** |
| **Client gửi `overwrite`?** | **CÓ** (`"true"`) | **KHÔNG** | **KHÔNG** |
| **Backend ký `allowed_formats`?** | **KHÔNG** | **KHÔNG** | **CÓ** (nếu cấu hình) |

> **Kết luận logic**: Việc kích hoạt gửi `public_id` và `overwrite: "true"` chỉ diễn ra khi và chỉ khi `signatureParams.publicId` hoặc `signatureParams.public_id` có giá trị hợp lệ. Mọi luồng upload khác đều không có `publicId`, do đó hoàn toàn không bị ảnh hưởng.

---

## 3. Mã Nguồn Cần Thay Đổi

### 3.1. `src/lib/cloudinary.ts`
```typescript
// Trước khi sửa:
const pid = signatureParams.publicId || signatureParams.public_id;
if (pid) {
  formData.append("public_id", pid);
}

// Sau khi sửa:
const pid = signatureParams.publicId || signatureParams.public_id;
if (pid) {
  formData.append("public_id", pid);
  formData.append("overwrite", "true");
}
```

### 3.2. `src/features/profile/api/profile.api.ts`
```typescript
// Trước khi sửa:
getAvatarSignature: async (): Promise<{ signature: string; timestamp: number; folder: string; apiKey: string }> => {
  const res = await api.get<{ data: { signature: string; timestamp: number; folder: string; apiKey: string } }>('/me/avatar-signature');
  return res.data.data;
},

// Sau khi sửa:
getAvatarSignature: async (): Promise<{ signature: string; timestamp: number; folder: string; apiKey: string; publicId?: string }> => {
  const res = await api.get<{ data: { signature: string; timestamp: number; folder: string; apiKey: string; publicId?: string } }>('/me/avatar-signature');
  return res.data.data;
},
```

---

## 4. Test Assertions Contract

Trong `src/lib/cloudinary.test.ts`:
1. **Case có `publicId`**:
   - `fd.get('public_id')` phải bằng giá trị đã truyền (`'some-id'`).
   - `fd.get('overwrite')` phải bằng `'true'`.
   - `fd.get('publicId')` phải bằng `null` (không gửi camelCase).
   - `formKeys(fd)` phải chứa đúng: `['api_key', 'file', 'folder', 'overwrite', 'public_id', 'signature', 'timestamp']`.
2. **Case không có `publicId`**:
   - `fd.get('public_id')` phải bằng `null`.
   - `fd.get('overwrite')` phải bằng `null`.
   - `formKeys(fd)` không chứa `public_id` và không chứa `overwrite`.
