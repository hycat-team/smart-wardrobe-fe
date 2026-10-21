# Research & Architectural Decisions: Kéo thả tệp hình ảnh vào tủ đồ

**Feature**: `028-wardrobe-drag-drop-upload`  
**Date**: 2026-10-04  
**Status**: Completed  

---

## 1. Drag & Drop Event Handling & Flicker Prevention

### Decision
Xây dựng một custom hook độc lập `useFileDropzone` quản lý toàn bộ vòng đời sự kiện kéo thả HTML5 (`dragenter`, `dragover`, `dragleave`, `drop`) sử dụng kỹ thuật **Drag Counter (Bộ đếm độ sâu DOM)** kết hợp CSS `pointer-events-none` trên các thành phần trang trí bên trong vùng dropzone.

### Rationale
- **Khắc phục triệt để hiện tượng Flicker (Nhấp nháy)**: Trong chuẩn HTML5 Drag and Drop API, khi con trỏ chuột kéo tệp lướt qua một phần tử con (như icon SVG `<UploadCloud>`, tiêu đề `<p>`, hoặc badge số thứ tự), trình duyệt sẽ kích hoạt `dragleave` trên phần tử cha và `dragenter` trên phần tử con. Nếu chỉ dùng một cờ boolean `isDragging`, giao diện sẽ liên tục giật nháy giữa trạng thái bình thường và active. Kỹ thuật đếm độ sâu (`dragCounterRef.current++` khi `dragenter`, `--` khi `dragleave`, chỉ chuyển về `false` khi counter chạm `0`) là giải pháp chuẩn công nghiệp, nhẹ nhàng và ổn định nhất.
- **Không phụ thuộc thư viện ngoài**: Codebase hiện đã dùng Next.js 16 và React 19. Việc cài đặt các thư viện bên ngoài như `react-dropzone` tiềm ẩn xung đột peer-dependency với React 19 và làm tăng dung lượng bundle không cần thiết, trong khi một hook tự viết chỉ ~80 dòng mã nguồn TypeScript rõ ràng, dễ bảo trì và dễ viết unit test.

### Alternatives Considered
- *Sử dụng thư viện `react-dropzone`*: Bị loại vì nguy cơ xung đột peer-dependency React 19 và tăng bundle size.
- *Xử lý inline trực tiếp trong `UploadClient.tsx`*: Bị loại vì `UploadClient.tsx` hiện đã dài hơn 460 dòng và có nhiều animation GSAP. Việc nhồi nhét thêm 100 dòng logic sự kiện drag-and-drop sẽ làm giảm khả năng bảo trì và khó viết test riêng biệt.

---

## 2. Ngăn chặn hành vi mặc định của trình duyệt (Default Browser File Drop)

### Decision
Thực hiện `e.preventDefault()` và `e.stopPropagation()` ở cả cấp độ Dropzone cục bộ và cấp độ toàn trang (Global Window Listeners) khi đang ở màn hình `/wardrobe/upload`.

### Rationale
- Mặc định trên mọi trình duyệt (Chrome, Edge, Safari, Firefox), nếu người dùng kéo một file ảnh từ máy tính vào cửa sổ web và thả trượt ra ngoài vùng dropzone (dù chỉ lệch vài pixel vào khoảng trống của trang), trình duyệt sẽ ngay lập tức điều hướng trang hiện tại sang URL tệp tin cục bộ (ví dụ: `file:///C:/Users/.../photo.jpg`).
- Điều này sẽ làm mất toàn bộ phiên làm việc của người dùng và các ảnh đã chọn trước đó.
- Đăng ký listener `dragover` và `drop` trên container/window với `e.preventDefault()` đảm bảo trải nghiệm an toàn tuyệt đối.

### Alternatives Considered
- *Chỉ chặn `preventDefault` trên phần tử dropzone*: Bị loại vì người dùng rất hay thả trượt ra rìa mép của khung thả, dẫn đến việc trình duyệt tự động mở ảnh sang tab mới làm mất dữ liệu đang làm việc dở dang.

---

## 3. Xác thực định dạng tệp & Hỗ trợ ảnh từ thiết bị Apple (HEIC/HEIF)

### Decision
Kết hợp kiểm tra cả hai yếu tố:
1. `file.type.startsWith('image/')`
2. Đuôi mở rộng của tệp: `.png`, `.jpg`, `.jpeg`, `.webp`, `.heic`, `.heif`

### Rationale
- Trên hệ điều hành macOS và Windows khi kéo ảnh từ iPhone hoặc một số ứng dụng quản lý ảnh, các tệp định dạng `.heic` / `.heif` thường có thuộc tính `file.type` là chuỗi rỗng `""` hoặc `application/octet-stream` thay vì `image/heic`.
- Nếu chỉ kiểm tra `file.type.startsWith('image/')`, các ảnh HEIC hợp lệ sẽ bị từ chối oan.
- Việc kết hợp kiểm tra phần mở rộng tệp đảm bảo người dùng iPhone/Mac có thể kéo thả ảnh trực tiếp mà không gặp lỗi.

### Alternatives Considered
- *Chỉ kiểm tra MIME type*: Bị loại vì làm hỏng trải nghiệm người dùng hệ sinh thái Apple.
- *Chỉ kiểm tra đuôi mở rộng file*: Dễ bị sai nếu file đổi tên giả mạo, kết hợp cả hai là tối ưu nhất.

---

## 4. Quản lý dung lượng (5MB) và Hạn mức tối đa 5 ảnh (Capacity & Slicing)

### Decision
- **Dung lượng**: Giới hạn cứng 5MB (`5 * 1024 * 1024` bytes) cho từng tệp. Tệp vượt quá 5MB sẽ bị loại bỏ và hiển thị toast cảnh báo: `Ảnh "[tên]" vượt quá dung lượng 5MB`.
- **Hạn mức 5 ảnh (Chiến lược Partial Acceptance)**:
  - Nếu số ảnh mới thả + số ảnh hiện tại > 5:
    - Hệ thống tính toán số lượng vị trí còn trống `availableSlots = 5 - currentFiles.length`.
    - Lấy đúng `availableSlots` ảnh hợp lệ đầu tiên đưa vào danh sách xem trước.
    - Bỏ qua các ảnh còn lại và hiển thị thông báo toast: `Đã nhận [N] ảnh. Bỏ qua [M] ảnh vượt quá hạn mức tối đa 5 ảnh`.
  - Nếu đã đủ 5 ảnh (`currentFiles.length === 5`): Vô hiệu hóa vùng nhận và hiển thị cảnh báo `Bạn đã chọn đủ tối đa 5 ảnh cho một lượt phân tích`.

### Rationale
- Giúp người dùng không bị mất công thao tác lại: Nếu người dùng lỡ chọn một cụm 6 ảnh trong thư mục và kéo thả vào, việc nhận 5 ảnh đầu tiên và thông báo bỏ qua 1 ảnh mang lại sự tiện lợi hơn rất nhiều so với việc từ chối toàn bộ 6 ảnh và bắt người dùng mở lại thư mục chọn lại từng ảnh.

---

## 5. Xử lý kéo thả Thư mục (Directory Drop Handling)

### Decision
Sử dụng `item.webkitGetAsEntry()` (hoặc `item.getAsFileSystemHandle()` trên trình duyệt hỗ trợ) để phân biệt giữa tệp đơn lẻ và thư mục:
- Nếu là thư mục (`entry.isDirectory`): Đọc các tệp bên trong thư mục (ở tầng gốc) và chỉ lọc ra các tệp ảnh hợp lệ, hoặc nếu không hỗ trợ duyệt cây thư mục, bỏ qua thư mục và cảnh báo: `Vui lòng kéo thả trực tiếp tệp hình ảnh, không kéo thả cả thư mục`.
- Đảm bảo hệ thống không bao giờ truyền một đối tượng thư mục (có `size === 0` hoặc rỗng) vào pipeline tải lên Cloudinary để tránh lỗi 400 Bad Request.

---

## 6. Bố cục giao diện & Tương tác người dùng (Visual Architecture)

### Decision
Hỗ trợ 2 vị trí tiếp nhận kéo thả:
1. **Dropzone chính (Step 1)**: Khi chưa có ảnh nào (`files.length === 0`). Toàn bộ khung `aspect-[16/9]` chuyển sang trạng thái active: viền nét đứt chuyển từ `border-border` sang `border-primary`, nền chuyển sang màu nhấn nhẹ `bg-accent/40`, icon `UploadCloud` phóng to nhẹ và nhãn văn bản chuyển thành `Thả file vào đây để tải lên`.
2. **Dropzone phụ (Step 2 - Preview)**: Khi đã có từ 1 đến 4 ảnh (`files.length < 5`).
   - Thêm một thẻ **Dropzone Card** ở cuối lưới ảnh preview (dạng ô nét đứt vuông vắn với icon `+ Thêm ảnh` có thể click hoặc nhận kéo thả trực tiếp).
   - Đồng thời cho phép kéo thả vào toàn bộ container danh sách ảnh preview để người dùng có thể thả ảnh vào bất cứ đâu trên màn hình danh sách.

### Rationale
Đảm bảo tính nhất quán tuyệt đối trong toàn bộ hành trình người dùng: kéo ảnh lần đầu hay bổ sung thêm ảnh sau đó đều sử dụng cùng một thao tác kéo thả tự nhiên.
