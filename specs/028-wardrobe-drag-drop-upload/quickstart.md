# Quickstart & Verification Guide: Kéo thả tệp hình ảnh vào tủ đồ

**Feature**: `028-wardrobe-drag-drop-upload`  
**Date**: 2026-10-04  
**Status**: Ready for Verification  

---

## 1. Môi trường & Khởi chạy

Khởi động môi trường phát triển:
```bash
npm run dev
```
Truy cập màn hình tải ảnh tủ đồ: `http://localhost:3000/wardrobe/upload`

---

## 2. Kịch bản kiểm thử thủ công (Manual Verification Scenarios)

### Kịch bản 1: Kéo thả 1 ảnh vào vùng trống (Empty State)
1. Mở trang `/wardrobe/upload`.
2. Mở thư mục trên máy tính (File Explorer trên Windows hoặc Finder trên macOS).
3. Kéo 1 tệp ảnh (`.jpg` hoặc `.png`) và rê chuột vào khung nét đứt.
4. **Kỳ vọng**: 
   - Khung nét đứt lập tức đổi sang viền `border-primary`, nền sáng nhẹ, tiêu đề đổi thành *"Thả file vào đây để tải lên"*.
   - Rê chuột qua lại giữa icon và chữ không xảy ra hiện tượng chớp tắt viền (không flicker).
5. Nhả chuột (thả file).
6. **Kỳ vọng**: Giao diện chuyển mượt mà sang bước 2 (Preview), hiển thị 1 thẻ ảnh xem trước với đúng tên tệp.

---

### Kịch bản 2: Kéo thả cùng lúc nhiều ảnh (2 - 5 ảnh)
1. Ở màn hình tải ảnh trống, chọn cùng lúc 3 tệp ảnh từ thư mục máy tính.
2. Kéo và thả đồng thời 3 tệp vào khung tải ảnh.
3. **Kỳ vọng**: Màn hình xem trước hiển thị đủ 3 thẻ ảnh, bộ đếm ghi nhận *"Đã chọn 3/5 ảnh"*, và nút *"Thêm ảnh"* vẫn hiển thị.

---

### Kịch bản 3: Kéo thả thêm ảnh khi đang ở màn hình xem trước
1. Khi đã có 3 ảnh từ Kịch bản 2, chọn tiếp 1 ảnh từ thư mục.
2. Kéo ảnh này và thả vào ô thẻ *"Thêm ảnh"* hoặc vào khoảng trống của danh sách xem trước.
3. **Kỳ vọng**: Ảnh mới được nạp thêm vào danh sách, tổng số ảnh tăng lên thành 4/5.

---

### Kịch bản 4: Kéo thả vượt quá giới hạn 5 ảnh (Capacity Slicing)
1. Khi đã có 4 ảnh, kéo thả thêm 3 ảnh mới cùng lúc (tổng cộng 7 ảnh).
2. Thả chuột vào khu vực upload.
3. **Kỳ vọng**:
   - Hệ thống chỉ nhận 1 ảnh đầu tiên để đạt đủ 5/5 ảnh.
   - 2 ảnh còn lại bị bỏ qua.
   - Xuất hiện thông báo toast dạng warning: *"Đã nhận thêm 1 ảnh để đạt giới hạn 5 ảnh. 2 ảnh vượt quá đã được bỏ qua."*
   - Bộ đếm hiển thị *"Đã chọn 5/5 ảnh"*, nút Thêm ảnh biến mất.

---

### Kịch bản 5: Kéo thả tệp không hợp lệ (PDF, TXT) & Tệp quá 5MB
1. Chọn 1 tệp văn bản `.pdf` hoặc `.txt` và kéo thả vào vùng dropzone.
2. **Kỳ vọng**: Tệp bị từ chối, màn hình không bị đổi trạng thái, toast báo lỗi: *"Tệp [tên] không phải ảnh hợp lệ (chỉ hỗ trợ PNG, JPG, JPEG, WEBP, HEIC)."*
3. Chọn 1 tệp ảnh có dung lượng > 5MB và kéo thả vào vùng dropzone.
4. **Kỳ vọng**: Tệp bị từ chối, toast báo lỗi: *"Ảnh [tên] vượt quá dung lượng tối đa 5MB."*

---

### Kịch bản 6: Chống trình duyệt tự động mở ảnh khi thả trượt
1. Kéo 1 ảnh từ thư mục vào cửa sổ trình duyệt nhưng thả trượt ra ngoài vùng dropzone (ví dụ thả vào thanh header hoặc lề trang).
2. **Kỳ vọng**: Trình duyệt KHÔNG tự động mở file ảnh sang URL `file:///...`, trang web giữ nguyên trạng thái.

---

## 3. Kịch bản kiểm thử tự động (Automated Tests)

Chạy bộ unit test cho custom hook `useFileDropzone`:
```bash
npm test -- src/features/wardrobe/hooks/useFileDropzone.test.ts
```

Các ca kiểm thử bao gồm:
- `should initialize with default states (isDragActive: false, isDragReject: false)`
- `should set isDragActive to true on dragenter and back to false on dragleave`
- `should not flicker when dragenter and dragleave occur on nested children`
- `should filter out non-image files and trigger toast.error`
- `should filter out files exceeding 5MB and trigger toast.error`
- `should accept up to max allowed files and ignore excess with warning toast`
- `should ignore dropped files when disabled is true`
