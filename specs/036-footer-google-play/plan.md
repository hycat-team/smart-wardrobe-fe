# Implementation Plan: 036 Tích hợp Huy hiệu Google Play và Tái cấu trúc Footer

**Branch**: `036-footer-google-play` | **Date**: 2026-10-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/036-footer-google-play/spec.md`.

---

## Summary

Tích hợp huy hiệu tải ứng dụng chính thức từ Google Play Store (CH Play) tại chân trang (footer) thay thế hoàn toàn cho liên kết tải file APK thủ công cũ, đồng thời tái cấu trúc bố cục footer của trang giới thiệu (`LandingClient.tsx`) thành một hệ thống khối thông tin đa cột hiện đại, cân đối và tương thích responsive toàn diện.

**Vấn đề & Nhu cầu**:
- Ứng dụng Closy đã chính thức phát hành trên Google Play Store (`https://play.google.com/store/apps/details?id=online.hycat.closy&pcampaignid=web_share`).
- Chân trang hiện tại vẫn hiển thị liên kết tải file thô "Tải file APK", tạo cảm giác thiếu chuyên nghiệp và giảm tỷ lệ cài đặt ứng dụng.
- Bố cục footer hiện tại ở dạng 1 hàng phẳng đơn giản, logo thương hiệu bị chìm màu và chưa phân tầng rõ rệt giữa điều hướng, pháp lý và kênh di động.

**Phương án kỹ thuật**:
1. Xây dựng component `GooglePlayBadge.tsx` tại `src/components/common/GooglePlayBadge.tsx`:
   - Sử dụng Vector SVG nội tuyến chuẩn của Google Play (tam giác đa sắc: Cyan, Green, Red, Yellow).
   - Bố cục văn bản 2 dòng ("TẢI TRÊN" / "Google Play") chuẩn typography Google Brand Guidelines.
   - Hỗ trợ các thuộc tính bảo mật `target="_blank"`, `rel="noopener noreferrer"` và nhãn trợ năng `aria-label`.
   - Hiệu ứng tương tác hover, scale vi mô và focus-visible ring tương thích với design system tông tối của Closy.
2. Tái cấu trúc giao diện footer trong `src/app/(guest)/components/LandingClient.tsx`:
   - Chuyển đổi thành bố cục đa cột:
     - **Cột 1**: Nhận diện thương hiệu (`CLOSY` nổi bật với màu sáng/vàng be `#D9C5B2`), khẩu hiệu sản phẩm ("Tủ đồ thông minh số") và mô tả ngắn.
     - **Cột 2**: Khối liên kết điều hướng & pháp lý ("Chính sách bảo mật", "Yêu cầu xóa tài khoản", "Liên hệ hỗ trợ").
     - **Cột 3**: Khối ứng dụng di động ("Trải nghiệm trên di động", mô tả ngắn, component `GooglePlayBadge`).
     - **Thanh chân trang (Bottom bar)**: Ngăn cách bằng viền mờ tinh tế, chứa thông tin bản quyền và tác giả.
3. Loại bỏ hoàn toàn đường dẫn tải file APK thô khỏi giao diện người dùng.
4. Xây dựng bộ unit tests toàn diện cho `GooglePlayBadge` và footer mới.

---

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 16 (App Router)

**Primary Dependencies**:
- `next/link`: Điều hướng trang nội bộ (`/privacy`, `/delete-account`).
- `lucide-react`: Biểu tượng phụ trợ nếu cần.
- Tailwind CSS: Hệ thống utility classes cho bố cục responsive, typography và hiệu ứng màu sắc.

**Storage/State**:
- Không sử dụng bộ lưu trữ hay state phức tạp; là Stateless / Presentation Components.

**Testing**:
- Jest & `@testing-library/react` (`npm test -- GooglePlayBadge`).
- TypeScript compiler (`npx tsc --noEmit`).
- ESLint (`npm run lint`).

**Target Platform**: Trình duyệt web hiện đại (Desktop, Tablet, Mobile: Chrome, Safari, Edge, Firefox, Mobile Webviews).

**Project Type**: Next.js Web Application (Frontend-only UI enhancement).

**Performance Goals**:
- Zero Layout Shift (CLS = 0) khi tải footer nhờ việc nhúng trực tiếp Vector SVG nội tuyến thay vì load ảnh raster từ ngoài.
- Tốc độ hiển thị tức thì (< 16ms render time).
- Tương thích tốt với màn hình Retina / High-DPI.

**Constraints**:
- TUYỆT ĐỐI không can thiệp backend (`smart-wardrobe-be`).
- Không làm gãy bố cục responsive hiện tại của trang giới thiệu.
- Phải mở tab mới an toàn với `target="_blank"` và `rel="noopener noreferrer"`.
- Đảm bảo độ tương phản màu sắc đạt chuẩn WCAG AA (> 4.5:1).

---

## Constitution Check

| Nguyên tắc | Đánh giá | Trạng thái |
|---|---|---|
| **I. Non-Invasive Backend Guarantee** | Tính năng hoàn toàn thuộc phạm vi client UI trên frontend, 0 thay đổi backend. | **PASS** |
| **II. Zero Security Compromise** | Bắt buộc sử dụng `rel="noopener noreferrer"` khi mở link ngoại vi Google Play, ngăn ngừa tabnabbing. | **PASS** |
| **III. High Visual & UX Quality** | Sử dụng Vector SVG chất lượng cao, typography chuẩn Google Play, màu sắc đồng bộ với tông tối sang trọng của Closy. | **PASS** |
| **IV. Accessibility & Responsive by Default** | Có aria-label, focus ring rõ ràng, kiểm tra hiển thị từ 320px đến 4K. | **PASS** |

---

## Project Structure

### Documentation (this feature)

```text
specs/036-footer-google-play/
├── spec.md                                         # Đặc tả yêu cầu tính năng
├── plan.md                                         # Kế hoạch triển khai kỹ thuật (File này)
├── research.md                                     # Phân tích kỹ thuật & các quyết định kiến trúc
├── data-model.md                                   # Mô hình dữ liệu & props component
├── quickstart.md                                   # Hướng dẫn xác thực & kịch bản kiểm thử
├── contracts/
│   └── footer-google-play-contract.md              # Khế ước giao diện component & hành vi điều hướng
└── checklists/
    └── requirements.md                             # Bảng kiểm tra chất lượng đặc tả
```

### Source Code (repository root)

```text
src/
├── components/
│   └── common/
│       ├── GooglePlayBadge.tsx                     # Component nút bấm tải Google Play chuẩn vector SVG
│       └── GooglePlayBadge.test.tsx                # Bộ kiểm thử đơn vị cho component
└── app/
    └── (guest)/
        └── components/
            └── LandingClient.tsx                   # Tích hợp footer mới và gỡ bỏ link APK cũ
```

**Structure Decision**:
- Tạo `GooglePlayBadge.tsx` trong thư mục dùng chung `src/components/common/` để có thể tái sử dụng linh hoạt ở nhiều trang khác nhau (như trang hồ sơ, banner, popup hoặc trang giới thiệu).
- Tái cấu trúc khu vực footer trong `LandingClient.tsx`, import và sử dụng trực tiếp `GooglePlayBadge`.

---

## Complexity Tracking

> Không có vi phạm kiến trúc nào. Tất cả đều tuân thủ các nguyên tắc thiết kế tối giản, sạch sẽ và phi xâm lấn.
