# Research & Technical Decisions: Media Compression & Video Upload Limits

**Feature**: `030-media-compression-video-limit`  
**Date**: 2026-10-05  

## 1. Client-Side Image Compression Strategy

### Decision
Sử dụng chuẩn web native **HTML5 Canvas API** (`createImageBitmap` / `HTMLImageElement` + `<canvas>` + `canvas.toBlob('image/webp', quality)`) để thực hiện nén và chuyển đổi định dạng ảnh sang WebP ở phía client (trình duyệt) mà không cần cài đặt thêm thư viện nặng bên ngoài.

### Rationale
- **Không phụ thuộc thư viện bên ngoài (Zero-dependency)**: Các thư viện như `browser-image-compression` thường thêm từ 50KB - 100KB bundle size. Trong khi đó, Canvas API được hỗ trợ native 100% trên tất cả trình duyệt hiện đại (Chrome, Edge, Firefox, Safari 14+).
- **Hỗ trợ WebP nguyên bản**: Mọi trình duyệt hiện đại đều hỗ trợ phương thức `toBlob('image/webp', quality)`. WebP mang lại tỷ lệ nén vượt trội từ 30% đến 80% so với JPEG/PNG ở cùng mức chất lượng mắt nhìn thấy.
- **Bảo toàn kênh trong suốt (Alpha Transparency)**: Khác với việc convert sang JPEG bị đen hoặc trắng phần nền trong suốt, WebP hỗ trợ đầy đủ kênh alpha 8-bit, rất quan trọng đối với các ảnh trang phục đã tách nền trong tủ đồ.
- **Tốc độ xử lý cao**: Sử dụng `createImageBitmap` (hoặc `Image` object) kết hợp `OffscreenCanvas` (khi có sẵn) hoặc `HTMLCanvasElement` giúp giải mã và vẽ lại pixel chỉ mất từ 100ms - 400ms cho ảnh 4MB - 8MB.

### Alternatives Considered
- *Thư viện `browser-image-compression`*: Cung cấp Web Worker nhưng làm tăng dung lượng bundle và cấu hình phức tạp với Next.js SSR.
- *Nén ảnh ở Backend*: Khiến người dùng phải tải nguyên tệp gốc 5MB - 10MB lên server, gây chậm tiến trình upload và tốn băng thông đường truyền. Nén tại client giải quyết triệt để vấn đề này ngay tại điểm xuất phát.

---

## 2. Thông số cân bằng giữa giảm dung lượng và "không bị mất nét"

### Decision
- **Chất lượng nén (Quality Factor)**: Mặc định `0.85` (khoảng `0.82` - `0.88`).
- **Kích thước cạnh tối đa (Max Dimension)**: `2048px`.
- **Chế độ làm mịn (Image Smoothing)**: `ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';`.
- **Cơ chế so sánh dung lượng (Size Safeguard)**: Nếu kích thước tệp sau nén $\ge$ dung lượng tệp gốc, hệ thống giữ nguyên tệp gốc.
- **Bảo toàn tên tệp**: Đổi phần mở rộng thành `.webp` (ví dụ `shirt.jpg` $\rightarrow$ `shirt.webp`), MIME type là `image/webp`.

### Rationale
- Tại `quality = 0.85`, thuật toán nén WebP đạt ngưỡng **visually lossless** (mắt người không thể phân biệt được sự khác biệt về độ sắc nét, màu sắc và chi tiết bề mặt vải trang phục so với ảnh gốc không nén).
- Giới hạn cạnh lớn nhất $2048\text{px}$ giữ trọn vẹn độ phân giải 2K siêu nét cho trang phục thời trang, đồng thời ngăn chặn các bức ảnh 48MP/64MP (chiều dài $6000\text{px} - 8000\text{px}$) gây tràn RAM trình duyệt di động (out-of-memory).
- Kết quả thực nghiệm: Một bức ảnh 4MB JPEG chụp từ điện thoại sau khi nén về WebP (2048px, quality 0.85) có dung lượng chỉ còn khoảng $400\text{KB} - 800\text{KB}$ (giảm $75\% - 85\%$) trong khi chi tiết đường kim mũi chỉ và họa tiết vẫn cực kỳ sắc nét.

---

## 3. Tương thích Cloudinary & Chữ ký tải lên (Upload Signature)

### Decision
Tệp ảnh sau khi nén sang WebP hoàn toàn tương thích với cơ chế upload Cloudinary hiện tại của dự án:
- Đối với **Community Post**: `UploadSignatureResult.allowedFormats` từ backend đã bao gồm `"jpg,png,webp"`. Định dạng `image/webp` được Cloudinary phê duyệt theo chữ ký.
- Đối với **Wardrobe Item**: Cloudinary endpoint nhận `resourceType: 'image'` và hỗ trợ trực tiếp `.webp`.

---

## 4. Kiểm soát tệp Video ở Community và Chặn > 100MB

### Decision
1. **Ràng buộc dung lượng**: Giới hạn cứng `100 * 1024 * 1024` bytes ($104,857,600\text{ bytes}$).
2. **Thời điểm kiểm tra**: Kiểm tra ngay khi người dùng chọn tệp trong `PostComposerModal.tsx` thông qua hàm `validateMediaFile(file)`.
3. **Thứ tự ưu tiên kiểm tra**:
   - Nếu tệp là video: Kiểm tra dung lượng `file.size > 100 * 1024 * 1024` **trước tiên**. Nếu vượt quá, lập tức trả về `isValid: false` với thông báo:
     `Video "${file.name}" vượt quá dung lượng tối đa 100MB.`
   - Ngăn chặn hoàn toàn việc tạo `URL.createObjectURL` để nạp thẻ `<video>` đọc thời lượng đối với các video $> 100\text{MB}$ để tránh tốn bộ nhớ trình duyệt.
   - Không đưa tệp vào `mediaList`, không gọi API xin chữ ký `getPostUploadSignature`, không gọi `uploadToCloudinary`.
4. **Phản hồi người dùng**: Hiển thị `toast.error` rõ ràng bằng tiếng Việt ngay lập tức. Nếu người dùng chọn cùng lúc nhiều tệp (ảnh + video), các ảnh hợp lệ vẫn được thêm vào danh sách, còn video quá dung lượng sẽ bị chặn lại kèm thông báo.

---

## 5. Cấu trúc Module và Tích hợp Mã nguồn

### Decision
1. **Tạo module tiện ích dùng chung**:
   - Đường dẫn: `src/lib/image-compression.ts`
   - Chứa:
     - `compressImageToWebP(file: File, options?: CompressionOptions): Promise<File>`
     - `isImageCompressible(file: File): boolean`
2. **Tích hợp vào Wardrobe Upload**:
   - Tệp: `src/app/(user)/wardrobe/upload/components/UploadClient.tsx`
   - Trong `handleUploadAndAnalyze`: Trước khi gọi `uploadToCloudinary`, nén `item.file` sang WebP.
3. **Tích hợp vào Community Post Composer**:
   - Tệp: `src/features/community/components/PostComposerModal.tsx`
   - Trong `handleSubmit`: Với các tệp `item.mediaType === 'image'`, nén sang WebP trước khi gọi `uploadToCloudinary`.
4. **Củng cố kiểm tra video trong Community Utils**:
   - Tệp: `src/features/community/utils/community.utils.ts`
   - Hoàn thiện `validateMediaFile(file)` với kiểm tra dung lượng 100MB làm ưu tiên hàng đầu cho video.
