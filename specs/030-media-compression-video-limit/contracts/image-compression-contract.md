# Interface Contract: Client-Side Image Compression

**Feature**: `030-media-compression-video-limit`  
**File Location**: `src/lib/image-compression.ts`  

## 1. Module Export

```typescript
/**
 * Nén tệp hình ảnh sang định dạng WebP với mức chất lượng sắc nét (visually lossless).
 * Tự động chuyển đuôi tệp thành .webp và điều chỉnh kích thước nếu vượt quá giới hạn an toàn.
 *
 * @param file Tệp hình ảnh gốc (File hoặc Blob)
 * @param options Cấu hình nén tùy chọn (quality, maxDimension, minSizeToCompressBytes, preserveSmallerOriginal)
 * @returns Promise<File> Tệp sau khi nén (hoặc tệp gốc nếu tối ưu hơn)
 */
export async function compressImageToWebP(
  file: File,
  options?: CompressionOptions
): Promise<File>;

/**
 * Nén tệp hình ảnh sang định dạng WebP kèm thông tin thống kê kích thước chi tiết.
 *
 * @param file Tệp hình ảnh gốc
 * @param options Cấu hình nén tùy chọn
 * @returns Promise<CompressionResult>
 */
export async function compressImageWithStats(
  file: File,
  options?: CompressionOptions
): Promise<CompressionResult>;
```

## 2. Input / Output Contracts

### Input Requirements
- `file`: Đối tượng `File` hợp lệ với MIME type bắt đầu bằng `image/` hoặc phần mở rộng thuộc danh sách: `.png, .jpg, .jpeg, .webp, .heic`.
- `options.quality`: Giá trị số từ `0.1` đến `1.0`. Mặc định `0.85`.
- `options.maxDimension`: Giá trị số nguyên dương. Mặc định `2048`.
- `options.minSizeToCompressBytes`: Giá trị số nguyên dương. Mặc định `102400` (100KB).
- `options.preserveSmallerOriginal`: Giá trị boolean. Mặc định `true`.

### Output Guarantees
- Trả về đối tượng `File` có MIME type `image/webp` (trừ khi giữ lại file gốc khi `preserveSmallerOriginal = true`).
- Tên tệp có phần mở rộng `.webp` (thay thế phần mở rộng cũ như `.png`, `.jpg`, `.jpeg`).
- Giữ nguyên tỷ lệ khung hình gốc (aspect ratio) của hình ảnh.
- Nền trong suốt (alpha channel) của ảnh PNG được bảo toàn nguyên vẹn trên tệp WebP xuất ra.
- Nếu xảy ra lỗi không thể giải mã hình ảnh (ví dụ môi trường test không có canvas thực hoặc tệp lỗi), hàm tự động bắt ngoại lệ và trả về `file` gốc an toàn (fail-safe fallback).
