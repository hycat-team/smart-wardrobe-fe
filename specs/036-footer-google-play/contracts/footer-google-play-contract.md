# Interface & Behavior Contract: 036 Tích hợp Huy hiệu Google Play và Tái cấu trúc Footer

**Branch**: `036-footer-google-play` | **Date**: 2026-10-20 | **Spec**: [spec.md](../spec.md)

---

## 1. Component Contract: `GooglePlayBadge`

### 1.1 Khai báo Component

```typescript
import React from 'react';

export interface GooglePlayBadgeProps {
  href?: string;
  className?: string;
  locale?: 'vi' | 'en';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function GooglePlayBadge(props: GooglePlayBadgeProps): React.JSX.Element;
```

### 1.2 Giá trị Mặc định (Default Values)

| Tham số | Giá trị mặc định |
|---|---|
| `href` | `'https://play.google.com/store/apps/details?id=online.hycat.closy&pcampaignid=web_share'` |
| `locale` | `'vi'` |
| `size` | `'md'` (Chiều cao tương đương ~48px-52px, min-width ~160px) |
| `className` | `''` |

### 1.3 DOM & Thuộc tính bảo mật

```html
<a
  href="https://play.google.com/store/apps/details?id=online.hycat.closy&pcampaignid=web_share"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Tải ứng dụng Closy trên Google Play"
  class="inline-flex items-center ... focus-visible:ring-2 ..."
>
  <!-- Google Play Official Vector SVG Icon -->
  <svg viewBox="0 0 512 512" aria-hidden="true" ...>...</svg>
  
  <div class="flex flex-col text-left ...">
    <span class="text-[10px] uppercase font-medium ...">TẢI TRÊN</span>
    <span class="text-sm font-semibold tracking-wide font-sans ...">Google Play</span>
  </div>
</a>
```

---

## 2. Layout Contract: `LandingFooter`

### 2.1 Cấu trúc Bố cục Responsive

| Breakpoint | Bố cục chính | Căn chỉnh |
|---|---|---|
| Mobile (`< 768px`) | 1 cột xếp chồng (Vertical Stack: Brand → Links → Mobile App → Divider → Copyright) | `items-start text-left` hoặc `items-center text-center` cân xứng, nút bấm full-width hoặc auto-centered |
| Tablet / Desktop (`>= 768px`) | 3 cột ngang (`grid-cols-1 md:grid-cols-12 gap-8`) | Cột Brand (4 phần), Cột Links (4 phần), Cột App Download (4 phần) |

### 2.2 Danh mục Liên kết và Điều hướng

| Nhãn hiển thị | Kiểu liên kết | Đích đến (`href`) | Ghi chú |
|---|---|---|---|
| `Chính sách bảo mật` | Next.js `<Link>` nội bộ | `/privacy` | Mở cùng tab |
| `Yêu cầu xóa tài khoản` | Next.js `<Link>` nội bộ | `/delete-account` | Mở cùng tab |
| `Liên hệ` | Thẻ HTML `<a>` | `mailto:hycat.support@gmail.com` | Kích hoạt client email |
| `Google Play Badge` | Thẻ HTML `<a>` | `https://play.google.com/store/apps/details?id=online.hycat.closy&pcampaignid=web_share` | Mở tab mới (`target="_blank" rel="noopener noreferrer"`) |

---

## 3. Trợ năng & Phím điều hướng (Accessibility Contract)

1. **Focus State**:
   Mọi liên kết và nút trong footer khi được chọn bằng phím `Tab` phải có hiệu ứng viền nổi bật:
   `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9C5B2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]`.
2. **Screen Reader Text**:
   - Nút Google Play có `aria-label="Tải ứng dụng Closy trên Google Play"`.
   - Biểu tượng SVG có thuộc tính `aria-hidden="true"`.
3. **Màu sắc & Độ tương phản**:
   - Màu nền footer: `#1A1A1A` kết hợp với họa tiết nền `/footer.png`.
   - Màu văn bản chính: `#FFFFFF` (đối với tiêu đề thương hiệu, tên store) và `#A3A3A3` / `#D9C5B2` (đối với nhãn phụ và liên kết), bảo đảm tỷ lệ tương phản đạt chuẩn WCAG AA (>= 4.5:1).
