# Interface Contract: Community Media Validation

**Feature**: `030-media-compression-video-limit`  
**File Location**: `src/features/community/utils/community.utils.ts`  

## 1. Function Contract

```typescript
export async function validateMediaFile(file: File): Promise<MediaValidationResult>;
```

## 2. Validation Rules & Priority Order

| Thứ tự | Điều kiện kiểm tra | Kết quả nếu vi phạm |
|---|---|---|
| 1 | Tệp là Video (`file.type.startsWith('video/')` hoặc đuôi video) và `file.size > 100 * 1024 * 1024` (100MB) | `isValid: false`, `error: 'Video "${file.name}" vượt quá dung lượng tối đa 100MB.'` |
| 2 | Tệp Video có định dạng không nằm trong `['video/mp4', 'video/webm']` | `isValid: false`, `error: 'Video chỉ hỗ trợ định dạng mp4, webm.'` |
| 3 | Tệp Video hợp lệ nhưng thời lượng > 60 giây | `isValid: false`, `error: 'Thời lượng video "${file.name}" là ${Math.round(duration)}s, vượt quá giới hạn tối đa 60 giây.'` |
| 4 | Tệp là Ảnh và `file.size > 10 * 1024 * 1024` (10MB) | `isValid: false`, `error: 'Ảnh "${file.name}" vượt quá dung lượng tối đa 10MB.'` |
| 5 | Tệp Ảnh có định dạng không nằm trong `['image/jpeg', 'image/png', 'image/webp']` | `isValid: false`, `error: 'Ảnh chỉ hỗ trợ định dạng jpg, png, webp.'` |
| 6 | Tệp không phải ảnh hay video | `isValid: false`, `error: 'Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh (jpg, png, webp) hoặc video (mp4, webm).'` |

## 3. UI Consumer Behavior in `PostComposerModal.tsx`

Khi người dùng kích hoạt chọn tệp từ hộp thoại hoặc kéo thả:
1. `validateMediaFile(file)` được gọi cho từng tệp.
2. Nếu `!validation.isValid`:
   - Lập tức hiển thị `toast.error(validation.error)`.
   - **Tuyệt đối không** nạp tệp này vào `mediaList`.
3. Nếu `validation.isValid`:
   - Nạp tệp vào `mediaList` với `previewUrl`.
   - Nếu là ảnh: Chuẩn bị nén WebP thông qua `compressImageToWebP(item.file)` trước khi gọi `uploadToCloudinary` trong tiến trình Submit.
