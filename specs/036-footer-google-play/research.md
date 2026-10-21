# Research & Technical Decisions: 036 Tích hợp Huy hiệu Google Play và Tái cấu trúc Footer

**Branch**: `036-footer-google-play` | **Date**: 2026-10-20 | **Spec**: [spec.md](./spec.md)

---

## 1. Google Play Badge: Phương án Render & Định dạng Đồ họa

### Vấn đề
Cần hiển thị huy hiệu (badge/button) tải ứng dụng Google Play chính thức với đường link:
`https://play.google.com/store/apps/details?id=online.hycat.closy&pcampaignid=web_share`
thay thế cho đường link tải file APK cũ. Huy hiệu cần sắc nét trên mọi loại màn hình (đặc biệt là màn hình Retina / High-DPI), tải nhanh tức thời, không bị layout shift và có hiệu ứng hover mượt mà đồng bộ với phong cách thiết kế tối màu của Closy.

### Quyết định kỹ thuật
- **Lựa chọn**: Xây dựng component React `GooglePlayBadge` sử dụng **Vector SVG nội tuyến (Inline SVG)** cho biểu tượng Google Play chính thức (tam giác đa sắc: xanh dương, xanh lục, đỏ, vàng), kết hợp bố cục chữ chuẩn thương hiệu ("GET IT ON / TẢI TRÊN" + "Google Play").
- **Lý do**:
  1. *Độ sắc nét tuyệt đối*: Vector SVG hiển thị sắc nét trên cả màn hình 1x lẫn Retina 2x/3x và màn hình 4K.
  2. *Zero Layout Shift & Zero Network Latency*: Không cần thực hiện HTTP request tải ảnh từ bên ngoài, hiển thị ngay lập tức khi render DOM.
  3. *Tùy biến & Phản hồi tương tác*: Dễ dàng áp dụng các lớp hiệu ứng hover, border glow `#D9C5B2`, scale vi mô `hover:scale-[1.02]`, và focus ring chuẩn trợ năng.
  4. *Chuẩn kích thước Google Brand Guidelines*: Tỷ lệ biểu tượng và phân tầng chữ 2 dòng tuân thủ đúng quy chuẩn nhận diện thương hiệu của Google Play.

### Các lựa chọn khác đã đánh giá
- *Tải ảnh PNG/WebP tĩnh từ Google*: Thường bị mờ viền trên màn hình độ phân giải cao hoặc có viền trắng thừa không khớp với nền tối `#1A1A1A`.
- *Nhúng ảnh trực tiếp từ CDN Google Play*: Tiềm ẩn rủi ro mạng bên thứ ba chập chờn, bị chặn bởi ad-blocker hoặc gây giật layout khi ảnh đang tải.

---

## 2. Kiến trúc Component & Tổ chức Code

### Vấn đề
Footer hiện tại nằm trực tiếp ở cuối file `src/app/(guest)/components/LandingClient.tsx` (từ dòng 415 đến 441). Cần tái cấu trúc footer và bổ sung huy hiệu Google Play mà không làm cồng kềnh file `LandingClient.tsx` (hiện đã gần 500 dòng).

### Quyết định kỹ thuật
- Tạo component độc lập:
  1. `src/components/common/GooglePlayBadge.tsx` (hoặc `src/app/(guest)/components/GooglePlayBadge.tsx`): Component nút bấm tải Google Play độc lập, có thể tái sử dụng ở bất kỳ đâu trong toàn bộ dự án nếu cần.
  2. Tái cấu trúc khu vực `<footer>` trong `LandingClient.tsx` (hoặc tách thành `LandingFooter.tsx` trong `src/app/(guest)/components/LandingFooter.tsx`).
- **Lý do**:
  - Tuân thủ nguyên tắc Single Responsibility: Huy hiệu Google Play có đầy đủ props tùy biến (`className`, `href`, `utmSource`, `variant`), độc lập logic và dễ viết unit test.
  - Giữ `LandingClient.tsx` gọn gàng, dễ bảo trì và đọc hiểu.

---

## 3. Tái cấu trúc Layout Chân trang (Footer Information Architecture)

### Vấn đề
Footer cũ chỉ gồm 1 hàng flex đơn giản chứa logo `CLOSY` (màu `#1A1A1A` bị chìm vào nền), một hàng chữ liên kết dài và dòng bản quyền. Khi bổ sung huy hiệu Google Play, nếu giữ nguyên cấu trúc cũ sẽ gây mất cân đối và chật chội.

### Quyết định kỹ thuật
Tái cấu trúc footer thành **Bố cục 3 cột chính + 1 thanh đáy (Bottom bar)**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  FOOTER CONTAINER (Nền tối #1A1A1A + Họa tiết footer.png + Viền trên) │
├────────────────────────────────────────────────────────────────────────┤
│  [ Cột 1: Thương hiệu ]      [ Cột 2: Điều hướng & Pháp lý ] [ Cột 3: Tải ứng dụng ] │
│  - Logo CLOSY nổi bật       - Chính sách bảo mật            - Lời gọi hành động      │
│  - Tagline sản phẩm         - Yêu cầu xóa tài khoản         - GooglePlayBadge        │
│  - Mô tả ngắn gọn           - Liên hệ hỗ trợ                - Trạng thái nền tảng    │
├────────────────────────────────────────────────────────────────────────┤
│  [ Thanh đáy: Bản quyền © 2026 Closy. Built by HYCAT TEAM. ]           │
└────────────────────────────────────────────────────────────────────────┘
```

- **Màn hình Desktop (md / lg)**: Grid 3 cột (`grid-cols-1 md:grid-cols-3` hoặc `flex-row justify-between`), tỷ lệ cân bằng, khoảng cách thoáng đãng.
- **Màn hình Mobile (< 768px)**: Tự động xếp chồng dọc (`flex-col gap-8`), căn chỉnh trực quan, nút bấm to rộng dễ chạm bằng ngón cái (touch target >= 48px).

---

## 4. Bảo mật & Trợ năng (Security & Accessibility - a11y)

### Quyết định kỹ thuật
1. **Bảo mật liên kết ngoại vi**:
   - Bắt buộc áp dụng `target="_blank"` và `rel="noopener noreferrer"` cho liên kết mở Google Play Store để tránh tấn công Tabnabbing và rò rỉ referrer context.
2. **Khả năng tiếp cận (Accessibility)**:
   - Thẻ ngữ nghĩa: `<footer role="contentinfo">`, tiêu đề `<h3>` phân nhóm rõ ràng.
   - Thuộc tính trợ năng: `aria-label="Tải ứng dụng Closy trên Google Play Store"`.
   - Điều hướng bàn phím: Hiển thị viền nét rõ (`focus-visible:ring-2 focus-visible:ring-[#D9C5B2] focus-visible:outline-none`).
   - Tỷ lệ tương phản: Nền nút đen nhám/xám đậm (`#0A0A0A` / `#222222`), viền `border-white/15`, chữ trắng/bạc đảm bảo tương phản WCAG 2.1 AA (> 4.5:1).

---

## 5. Xử lý Link APK cũ

### Quyết định kỹ thuật
- Gỡ bỏ hoàn toàn liên kết `href="/downloads/closy.apk"` tại chân trang.
- File vật lý `public/downloads/Closy.apk` được giữ nguyên trong kho lưu trữ nội bộ (không xóa file trên ổ cứng để phòng trường hợp team nội bộ cần backup, nhưng không còn bất kỳ liên kết công khai nào trỏ đến nó tại giao diện footer).
