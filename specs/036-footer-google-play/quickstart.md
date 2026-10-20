# Quickstart Validation Guide: 036 Tích hợp Huy hiệu Google Play và Tái cấu trúc Footer

**Branch**: `036-footer-google-play` | **Date**: 2026-10-20 | **Spec**: [spec.md](./spec.md)

---

## 1. Yêu cầu Tiên quyết (Prerequisites)

- Node.js >= 18.x
- Cài đặt đầy đủ dependencies frontend: `npm install`
- Máy chủ phát triển chạy được cục bộ: `npm run dev` (mặc định tại `http://localhost:3000`)

---

## 2. Các Lệnh Kiểm tra Tự động (Automated Verification)

### 2.1 Kiểm tra Type Check (TypeScript)

Xác nhận không có lỗi kiểu dữ liệu:
```bash
npx tsc --noEmit
```
*Kết quả kỳ vọng*: Lệnh hoàn tất không phát sinh lỗi (`0 errors`).

### 2.2 Kiểm tra Quy chuẩn Code (ESLint)

Kiểm tra tính tuân thủ quy chuẩn mã nguồn:
```bash
npm run lint
```
*Kết quả kỳ vọng*: Không có lỗi linting trên các file mới và file sửa đổi.

### 2.3 Chạy Bộ Kiểm thử Đơn vị (Unit Tests)

Chạy kiểm thử cho component `GooglePlayBadge` và `LandingFooter`:
```bash
npm test -- GooglePlayBadge
```
*Kết quả kỳ vọng*:
- Kiểm tra render đúng biểu tượng SVG và các đoạn chữ "TẢI TRÊN", "Google Play".
- Kiểm tra thẻ `<a>` có thuộc tính `href` chính xác trỏ đến `https://play.google.com/store/apps/details?id=online.hycat.closy&pcampaignid=web_share`.
- Kiểm tra thuộc tính bảo mật `target="_blank"` và `rel="noopener noreferrer"`.
- Kiểm tra nhãn trợ năng `aria-label`.
- Kiểm tra không còn phần tử liên kết nào trỏ đến file `.apk` trong footer.

---

## 3. Các Kịch bản Xác thực Thủ công (Manual Verification Scenarios)

### Kịch bản 1: Kiểm tra Huy hiệu Google Play và Chuyển hướng An toàn
1. Mở trình duyệt và truy cập `http://localhost:3000/`.
2. Cuộn chuột xuống khu vực chân trang (footer).
3. **Quan sát**: Huy hiệu Google Play hiển thị sắc nét với biểu tượng tam giác đa sắc và chữ "TẢI TRÊN Google Play", nằm trong khung nút phong cách sang trọng với viền mờ.
4. Rê chuột (hover) vào huy hiệu: Nút chuyển đổi trạng thái mượt mà (hơi sáng viền hoặc tăng nhẹ tỷ lệ).
5. Nhấp chuột vào huy hiệu:
   - Một tab duyệt mới được mở ra.
   - Địa chỉ URL trong tab mới là: `https://play.google.com/store/apps/details?id=online.hycat.closy&pcampaignid=web_share`.
   - Tab trang chủ gốc vẫn giữ nguyên vị trí, không bị thay đổi trạng thái.

### Kịch bản 2: Xác nhận Loại bỏ Hoàn toàn Link Tải APK Cũ
1. Tại khu vực chân trang, quan sát toàn bộ các liên kết.
2. Dùng tổ hợp phím `Ctrl + F` (hoặc `Cmd + F` trên macOS) để tìm kiếm chuỗi ký tự: `APK`.
3. **Kết quả**: 0 kết quả tìm thấy. Toàn bộ chữ và liên kết `Tải file APK` đã được thay thế trọn vẹn bởi huy hiệu Google Play.

### Kịch bản 3: Kiểm tra Bố cục Footer trên Màn hình Desktop
1. Mở trình duyệt ở kích thước màn hình máy tính (>= 1024px).
2. Quan sát bố cục chân trang:
   - **Cột 1**: Tên thương hiệu `CLOSY` nổi bật cùng khẩu hiệu tóm tắt định vị sản phẩm.
   - **Cột 2**: Cụm liên kết điều hướng và chính sách pháp lý (`Chính sách bảo mật`, `Yêu cầu xóa tài khoản`, `Liên hệ`).
   - **Cột 3**: Lời gọi tải ứng dụng di động kèm huy hiệu Google Play.
   - **Thanh chân trang (Bottom bar)**: Dòng bản quyền `© 2026 Closy. Built by HYCAT TEAM.` được ngăn cách bởi đường viền mờ tinh tế.
3. Không có tình trạng lệch cột, khoảng cách các khối hài hòa, chuyên nghiệp.

### Kịch bản 4: Kiểm tra Responsive trên Thiết bị Di động (Mobile Viewport)
1. Bật công cụ Developer Tools (`F12`), chuyển sang chế độ Responsive Device Mode (chọn màn hình iPhone SE 375px hoặc Pixel 7).
2. Cuộn xuống footer:
   - Các khối thông tin tự động xếp chồng theo chiều dọc một cách gọn gàng.
   - Nút huy hiệu Google Play co giãn tự nhiên, vùng bấm to rõ ràng, không bị tràn ra ngoài khung viền ngang.
   - Không xuất hiện thanh cuộn ngang (horizontal scrollbar) của trang web.

### Kịch bản 5: Kiểm tra Khả năng Tiếp cận (Accessibility & Keyboard Nav)
1. Đặt con trỏ chuột ở phần trên của trang, dùng phím `Tab` để di chuyển tiêu điểm xuống chân trang.
2. Khi tiêu điểm đến huy hiệu Google Play, quan sát thấy vòng tiêu điểm viền sáng rõ nét (`focus ring`).
3. Nhấn phím `Enter`: Trình duyệt lập tức mở trang Google Play trong tab mới tương tự như thao tác nhấp chuột.
