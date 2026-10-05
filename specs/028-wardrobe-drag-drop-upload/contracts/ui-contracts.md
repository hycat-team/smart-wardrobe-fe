# UI & Hook Contracts: Kéo thả tệp hình ảnh vào tủ đồ

**Feature**: `028-wardrobe-drag-drop-upload`  
**Date**: 2026-10-04  
**Status**: Completed  

---

## 1. Interface Hook `useFileDropzone`

Hook dùng để đóng gói logic xử lý sự kiện kéo thả, xác thực tệp và ngăn ngừa lỗi giật nháy màn hình.

### 1.1 Hook Parameters

```typescript
export interface UseFileDropzoneOptions {
  /** Callback được gọi khi có danh sách tệp hợp lệ sau khi lọc */
  onFilesDrop: (acceptedFiles: File[]) => void;

  /** Số lượng tệp tối đa của cả phiên làm việc (mặc định: 5) */
  maxFiles?: number;

  /** Dung lượng tối đa mỗi tệp (bytes, mặc định: 5MB = 5 * 1024 * 1024) */
  maxSizeBytes?: number;

  /** Danh sách đuôi mở rộng cho phép (mặc định: ['.png', '.jpg', '.jpeg', '.webp', '.heic', '.heif']) */
  acceptedExtensions?: string[];

  /** Số lượng tệp hiện đã có trong danh sách */
  currentCount?: number;

  /** Trạng thái khóa vùng kéo thả (khi đang tải lên hoặc phân tích) */
  disabled?: boolean;
}
```

### 1.2 Hook Return Value

```typescript
export interface UseFileDropzoneReturn {
  /** Có tệp đang được rê vào vùng dropzone hay không */
  isDragActive: boolean;

  /** Có tệp đang rê vào nhưng không hợp lệ hoặc đã chạm hạn mức tối đa */
  isDragReject: boolean;

  /** Thuộc tính gắn vào phần tử DOM vùng dropzone */
  getRootProps: () => {
    onDragEnter: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
}
```

---

## 2. Thông điệp phản hồi người dùng (Toast Notification Contract)

Các thông điệp thông báo qua `toast` (`sonner`) tuân theo định dạng chuẩn tiếng Việt thân thiện:

| Tình huống vi phạm | Loại thông báo | Nội dung thông điệp |
| :--- | :--- | :--- |
| **Tệp không phải định dạng ảnh** | `toast.error` | `Tệp "${fileName}" không phải ảnh hợp lệ (chỉ hỗ trợ PNG, JPG, JPEG, WEBP, HEIC).` |
| **Tệp vượt quá 5MB** | `toast.error` | `Ảnh "${fileName}" vượt quá dung lượng tối đa 5MB.` |
| **Đã đủ 5 ảnh và kéo thêm** | `toast.warning` | `Bạn đã chọn đủ 5 ảnh. Không thể thêm ảnh mới!` |
| **Kéo thả cụm tệp vượt quá hạn mức còn lại** | `toast.warning` | `Đã nhận thêm ${acceptedCount} ảnh để đạt giới hạn 5 ảnh. ${ignoredCount} ảnh vượt quá đã được bỏ qua.` |
| **Tệp ảnh bị trùng lặp** | `toast.info` | `Ảnh "${fileName}" đã có trong danh sách và được bỏ qua.` |
| **Kéo thả nhầm thư mục** | `toast.error` | `Vui lòng kéo thả trực tiếp tệp hình ảnh, không kéo thả thư mục.` |

---

## 3. UI Styling State Contract

Vùng dropzone phản ánh các trạng thái trực quan thông qua CSS classes:

### 3.1 Trạng thái bình thường (Idle)
```html
border border-dashed border-border bg-card hover:bg-accent-soft
```

### 3.2 Trạng thái đang rê tệp hợp lệ (Drag Active)
```html
border-2 border-dashed border-primary bg-primary/5 scale-[1.01] shadow-lg
```
- Icon `UploadCloud`: `scale-110 text-primary`
- Dòng chữ tiêu đề: Chuyển thành `"Thả file vào đây để tải lên"`
- Dòng chữ mô tả: Chuyển thành `"Thả chuột để thêm ngay vào danh sách phân tích"`

### 3.3 Trạng thái bị từ chối / Hết chỗ (Drag Reject)
```html
border-2 border-dashed border-destructive bg-destructive/5
```
- Dòng chữ tiêu đề: Chuyển thành `"Đã đạt giới hạn tối đa 5 ảnh"`

### 3.4 Trạng thái đang tải lên (Disabled)
```html
pointer-events-none opacity-60 cursor-not-allowed
```
