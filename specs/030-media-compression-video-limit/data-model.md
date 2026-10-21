# Data Model: Media Compression & Video Upload Limits

**Feature**: `030-media-compression-video-limit`  
**Date**: 2026-10-05  

## 1. Entities & Data Interfaces

### 1.1 CompressionOptions
Tùy chọn cấu hình khi nén ảnh:
```typescript
export interface CompressionOptions {
  /**
   * Mức chất lượng nén WebP (0.0 đến 1.0).
   * Khuyến nghị: 0.85 (visually lossless, giảm 50-80% dung lượng mà không mất nét).
   * Mặc định: 0.85
   */
  quality?: number;

  /**
   * Chiều dài cạnh lớn nhất của ảnh (pixel).
   * Giúp tránh tràn bộ nhớ đối với ảnh chụp điện thoại độ phân giải siêu cao (ví dụ 48MP/64MP).
   * Mặc định: 2048
   */
  maxDimension?: number;

  /**
   * Ngưỡng dung lượng tối thiểu (bytes) để kích hoạt nén.
   * Nếu ảnh gốc nhỏ hơn ngưỡng này (ví dụ 100KB), bỏ qua nén để tránh lãng phí CPU.
   * Mặc định: 100 * 1024 (100KB)
   */
  minSizeToCompressBytes?: number;

  /**
   * Cho phép giữ lại file gốc nếu kết quả nén có dung lượng lớn hơn hoặc bằng file gốc.
   * Mặc định: true
   */
  preserveSmallerOriginal?: boolean;
}
```

### 1.2 CompressionResult
Kết quả trả về sau quá trình nén:
```typescript
export interface CompressionResult {
  /** Tệp ảnh sau khi xử lý (có thể là tệp WebP mới hoặc tệp gốc nếu tối ưu hơn) */
  file: File;
  /** Dung lượng ban đầu tính theo byte */
  originalSize: number;
  /** Dung lượng sau khi nén tính theo byte */
  compressedSize: number;
  /** Tỷ lệ phần trăm dung lượng đã giảm (ví dụ: 65.5) */
  savedPercentage: number;
  /** Định dạng mime của file kết quả (ví dụ: 'image/webp') */
  mimeType: string;
}
```

### 1.3 MediaValidationResult
Kết quả xác thực tệp truyền thông (ảnh hoặc video):
```typescript
export interface MediaValidationResult {
  /** Tệp có hợp lệ hay không */
  isValid: boolean;
  /** Thông điệp lỗi chi tiết khi không hợp lệ (tiếng Việt) */
  error?: string;
  /** Phân loại tệp: 'image' hoặc 'video' */
  mediaType?: 'image' | 'video';
}
```

### 1.4 VideoValidationRule
Ràng buộc kiểm tra video:
```typescript
export interface VideoValidationRule {
  /** Kích thước tối đa: 100MB (104,857,600 bytes) */
  maxSizeBytes: 104857600;
  /** Thời lượng tối đa: 60 giây */
  maxDurationSeconds: 60;
  /** Định dạng hợp lệ */
  allowedMimeTypes: ['video/mp4', 'video/webm'];
}
```

---

## 2. State Flow Diagrams

### 2.1 Luồng nén ảnh WebP trước khi Upload (Wardrobe & Community)

```
[Người dùng chọn/thả ảnh]
           │
           ▼
[Xác thực tệp ban đầu] (kiểm tra định dạng, số lượng)
           │
           ▼
[Người dùng bấm Tải lên / Đăng bài]
           │
           ▼
┌────────────────────────────────────────────────────────┐
│               Hàm compressImageToWebP                  │
│                                                        │
│ 1. Kiểm tra dung lượng gốc < minSizeToCompressBytes?   │
│    - Có ───> Giữ nguyên tệp gốc                        │
│ 2. Giải mã ảnh (createImageBitmap / Image)             │
│ 3. Tính toán kích thước (tối đa maxDimension = 2048px) │
│ 4. Vẽ lên Canvas với imageSmoothingQuality = 'high'    │
│    (giữ nguyên kênh alpha nền trong suốt)              │
│ 5. Xuất WebP: canvas.toBlob('image/webp', quality=0.85)│
│ 6. So sánh: size(WebP) < size(gốc)?                    │
│    - Có ───> Trả về WebP File (.webp)                  │
│    - Không ─> Giữ nguyên tệp gốc                       │
└────────────────────────────────────────────────────────┘
           │
           ▼
[Tải tệp WebP lên Cloudinary theo Chữ ký cấp phép]
           │
           ▼
[Lưu trữ URL Cloudinary & Hoàn tất]
```

### 2.2 Luồng kiểm tra và chặn Video > 100MB (Community)

```
[Người dùng chọn tệp Video]
           │
           ▼
[Kiểm tra file.size > 100 * 1024 * 1024]
     │                             │
     ├─ VƯỢT QUÁ ( > 100MB)        └─ HỢP LỆ ( <= 100MB )
     │                                      │
     ▼                                      ▼
[CHẶN TỨC THÌ]                     [Kiểm tra thời lượng <= 60s]
- Không tạo ObjectURL                     │
- Hiển thị Toast lỗi 100MB                ├─ > 60s ───> [Chặn thời lượng]
- Không thêm vào danh sách media          │
                                          └─ <= 60s ──> [Tiếp nhận & Hiển thị Preview]
```
