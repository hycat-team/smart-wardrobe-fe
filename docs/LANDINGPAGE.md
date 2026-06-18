# Kịch bản Landing Page - Closy

> Tài liệu mô tả chi tiết luồng cuộn (Scroll Flow) và các section tĩnh của trang Landing Page,
> dựa trên implementation thực tế trong `LandingClient.tsx`.

---

## Tổng quan kiến trúc

- **Framework**: Next.js (App Router) — component `"use client"`
- **Animation Engine**: GSAP + ScrollTrigger, pinned scrollytelling (12 000px scroll distance)
- **Design System**: Warm neutral palette (`#F4F1EE`, `#1A1A1A`, `#D9C5B2`, `#707070`, `#B8975A`, `#4A8C6E`)
- **Font**: `font-heading` cho tiêu đề, `font-sans` cho body
- **Hiệu ứng nền**: Grain overlay + 3 ambient blob parallax (mix-blend-multiply)

---

## Phần 1: Scrollytelling Container (Pinned)

Toàn bộ section `.scrolly-container` được pin lại, người dùng cuộn qua 12 000px để xem 5 scene chuyển tiếp mượt mà.

### Background Animation

- Layer `.bg-gradient-layer` chuyển màu dần: `#F4F1EE` → `#EDE8E3` → `#F0E8DC` → `#EBE5DE` → `#E8E4DF`
- 3 ambient blob di chuyển parallax theo scroll (tốc độ khác nhau: 0.3, 0.5, 0.4)

---

### Scene 0 — Hero: Nỗi đau "Không có gì để mặc"

**Trực quan:**

- **Bên trái**: Headline lớn — *"Tủ đầy ắp đồ, nhưng lại..."* + dòng italic *"Hôm nay mặc gì?"* (màu `#D9C5B2`)
- **Bên phải**: Hình tủ quần áo (wardrobe) scale 1.2, gồm 3 frame ảnh xếp chồng (closed-1, closed-2, closed-3)
- **Dưới cùng**: CTA bounce — *"Cuộn để mở khóa tủ đồ ↓"*

**Animation khi cuộn:**

- Hero content fade out sang trái (`opacity: 0, x: -50`)
- Hero CTA fade out xuống dưới (`opacity: 0, y: 50`)

---

### Scene 1 — Số hoá tủ đồ (Digital Wardrobe)

**Hiệu ứng:**

1. Tủ quần áo di chuyển sang trái (`x: -45vw`), thu nhỏ (`scale: 0.65`), mờ nhẹ (`opacity: 0.85`)
2. Scan line quét từ trên xuống dưới tủ (thanh sáng màu `#f5b158` với shadow glow)
3. Frame 2 và Frame 3 của tủ hiện lên tuần tự (mô phỏng tủ đang mở)
4. Scan line biến mất
5. Các cloth cards bay ra từ vị trí tủ (trái) sang phải, xếp thành grid:
   - 6 cards tổng (2 non-outfit + 4 outfit items)
   - Stagger 0.1s, xoay nhẹ ±5°, ease `back.out(1.2)`
   - Vị trí grid: `x = (i%3) * 12vw`, `y = floor(i/3) * 22vh`

**Copy text (trái):**

- Badge: ✨ Tủ đồ kỹ thuật số
- Heading: *"Số hoá tủ đồ."*
- Body: *"Chụp 1 lần. AI tự động bóc tách nền, phân loại màu sắc và chất liệu."*

---

### Scene 2 — AI Stylist Cá Nhân (AI Recommendation)

**Hiệu ứng:**

1. Copy-1 fade out lên trên
2. Các cloth card không phải outfit thu nhỏ biến mất (stagger 0.05s)
3. 4 outfit items bay về vị trí trung tâm-phải, tạo thành bộ outfit hoàn chỉnh:
   - **Top** → `x: 8vw, y: -18vh` (scale 1.2, z-index 30)
   - **Bottom** → `x: 8vw, y: 2vh` (scale 1.2, z-index 20)
   - **Shoes** → `x: 8vw, y: 18vh` (scale 1.1, z-index 10)
   - **Accessory** → `x: 22vw, y: 0vh` (rotation 15°, z-index 40)
4. Magic glow xuất hiện phía sau outfit (radial gradient `#D9C5B2`)
5. AI Core avatar (Robot-AI.png trong vòng tròn trắng) scale từ 0 → 1 với `back.out(1.5)`

**Copy text (trái):**

- Badge: ✓ Gợi ý từ AI
- Heading: *"Stylist Cá Nhân."*
- Body: *"Hàng ngàn gợi ý phối đồ từ chính tủ đồ của bạn. Đổi món cực nhanh chỉ với 1 chạm."*

---

### Scene 3 — AI Fashion Chatbot

**Hiệu ứng:**

1. Copy-2 fade out, outfit group thu nhỏ biến mất, wardrobe biến mất
2. Chat interface trượt từ phải (`x: 40vw`) vào trung tâm (`x: 8vw`) — khung chat glassmorphism (bg-white/70, backdrop-blur-xl)
3. Chat bubbles xuất hiện tuần tự:
   - Bubble 1 (user): *"Thứ 7 này đi dạo phố mặc gì?"*
   - Bubble 2 (AI — nền `#D9C5B2`): *"Thử set này nhé: Thun basic và Jeans ống rộng..."*
   - Bubble 3 (user): *"Có set nào khác trendy hơn không? 👀"*
4. Header chat: Avatar Robot-AI + tên "Closy AI" + badge "Stylist Cá Nhân" + đèn xanh "Trực tuyến" (pulse)
5. Input mock: *"Nhập tin nhắn..."* + nút gửi tròn

**4 Floating Context Elements** xuất hiện xung quanh chat:

| Element | Vị trí | Nội dung |
|---------|--------|----------|
| Weather Widget | Top-right | ☀️ 32°C — Nắng nhẹ |
| Outfit Suggestion | Bottom-right | 3 thumbnail (top, bottom, shoes) |
| Style Tags | Top-left | Pills "Streetwear" + "Casual" |
| Match Score | Bottom-left | ✓ Phù hợp 95% — Với phong cách của bạn |

**Copy text (trái):**

- Badge: 💬 Trợ lý AI
- Heading: *"Hiểu gu của bạn."*
- Body: *"Closy phân tích thời tiết, hoàn cảnh và thấu hiểu phong cách riêng để tư vấn mỗi ngày."*

---

### Scene 4 — Cộng đồng & Pass đồ (Community Feed)

**Hiệu ứng:**

1. Copy-3 fade out, chat interface trượt ra phải, floating elements thu nhỏ biến mất
2. 3 Feed cards bay từ phải vào, mỗi card xoay nhẹ khác nhau:
   - Card 1: `@fashionista` — 1.2k likes (rotation -3°)
   - Card 2: `@minimalist` — 856 likes (rotation 5°)
   - Card 3: `@genz.style` — 2.4k likes (rotation -2°)
3. Floating hearts (❤️) bay lên từ giữa màn hình (3 hearts, kích thước khác nhau, stagger 0.15s)

**Copy text (trái):**

- Badge: 🔗 Cộng đồng
- Heading: *"Chia sẻ & Pass đồ."*
- Body: *"Tìm nguồn cảm hứng mới. Chuyển nhượng đồ ít mặc dễ dàng chỉ với một nút bấm."*

---

## Phần 2: Các Section Tĩnh (không pin)

Sau khi scrollytelling kết thúc, trang tiếp tục với các section scroll bình thường, mỗi section có GSAP animation riêng kích hoạt khi scroll vào viewport.

---

### Social Proof — Bộ đếm số liệu

- **Nền**: `#1A1A1A` (dark)
- **Layout**: Grid 4 cột (2 cột trên mobile)
- **Số liệu** (animated counter, snap integer):

| Metric | Giá trị | Suffix | Label |
|--------|---------|--------|-------|
| Outfits AI gợi ý | 10,000 | + | Outfits AI gợi ý |
| Tủ đồ số hóa | 5,000 | + | Tủ đồ số hóa |
| Tiết kiệm thời gian | 98 | % | Tiết kiệm thời gian |
| Upload xong | 30 | s | Upload xong |

- **Animation**: Counter đếm từ 0 lên target value (duration 2s, ease `power1.out`), trigger khi section vào 80% viewport

---

### Before / After — Trước & Sau khi có Closy

- **Nền**: `#F4F1EE`
- **Heading**: *"Trước & Sau khi có Closy"*
- **Layout**: Grid 2 cột

**Before Card** (nền trắng, bo góc 3xl):

| Icon | Nội dung |
|------|----------|
| 🕐 Clock | 30 phút mỗi sáng để chọn đồ |
| 👕 Shirt | Tủ đồ lộn xộn, quần áo xếp chồng |
| ⚠️ AlertCircle | Mua trùng đồ cũ, phối đồ không hợp |

**After Card** (nền `#1A1A1A`, chữ trắng, shadow-xl):

| Icon (màu `#B8975A`) | Nội dung |
|-----------------------|----------|
| ✨ Sparkles | 2 phút có ngay outfit hoàn hảo |
| 📱 Smartphone | Quản lý tủ đồ gọn gàng trên app |
| 🎯 Target | AI thấu hiểu gu thẩm mỹ của bạn |

- **Animation**: Before card trượt từ trái, After card trượt từ phải; từng item fade in stagger 0.15s

---

### Testimonials — Gen Z nói gì về Closy?

- **Nền**: `#EBE7E2`
- **Heading**: *"Gen Z nói gì về Closy?"*
- **Layout**: 3 testimonial bubbles xếp dọc, căn trái / phải / giữa

| Avatar | User | Quote |
|--------|------|-------|
| LF (nền `#D9C5B2`) | @linh.fashion | "Không nghĩ AI phối đồ giỏi vậy luôn 😳 Mặc đẹp mà không cần nghĩ" |
| MC (nền `#1A1A1A`) | @minh.closet | "Pass được mấy cái áo không mặc 2 năm rồi, vui quá! ❤️" |
| AS (nền `#B8975A`) | @an.style99 | "Giờ mỗi sáng mở app là có outfit luôn, tiết kiệm cả tiếng đồng hồ 🔥" |

- **Animation**: Fade in + slide up, stagger 0.25s

---

### Final CTA — Kêu gọi hành động

- **Nền**: `#1A1A1A` + radial glow `#D9C5B2` (opacity 20%, mix-blend-screen)
- **Chiều cao tối thiểu**: 70vh
- **Heading** (2 dòng, stagger 0.3s):
  - *"Sẵn sàng để không bao giờ hỏi"*
  - *"Hôm nay mặc gì?"* (italic, màu `#D9C5B2`) *nữa?*
- **Sub**: *"Không cần thẻ tín dụng. 30 giây."*
- **CTA Button**: `Bắt Đầu Miễn Phí →` — link đến `/auth/register`
  - Style: nền trắng, chữ đen, rounded-full, shadow glow, hover scale 1.03

---

### Footer

- **Nền**: `#1A1A1A`, border top `white/10`
- **Layout**: Flex row (stack trên mobile)
- **Nội dung**:
  - Logo: *"Closy."* (font-heading, bold, trắng)
  - Links: Instagram | TikTok | Chính sách
  - Copyright: *"© 2026 Closy. Built for Gen Z."*

---

## Helper Components

### `ClothCard`

- Props: `src`, `className`
- Visual: 160×160px (md: 192×192px), nền `white/60`, backdrop-blur, bo góc 2xl, viền trắng, shadow-xl
- Ảnh: `object-contain` với padding + drop-shadow

### `FeedCard`

- Props: `src`, `className`, `likes`, `user`
- Visual: 224px (md: 256px) wide, nền trắng, bo góc 2xl, shadow-2xl
- Ảnh: aspect ratio 3:4, bo góc xl
- Footer: username (bold) + heart icon + likes count

---

## Assets cần có (`/public/landing-page/`)

| File | Dùng cho |
|------|----------|
| `wardrobe-closed-1.png` | Tủ frame 1 (đóng) |
| `wardrobe-closed-2.png` | Tủ frame 2 (hé mở) |
| `wardrobe-closed-3.png` | Tủ frame 3 (mở hoàn toàn) |
| `top-1.png` | Áo outfit chính |
| `top-2.png` | Áo phụ (non-outfit) |
| `bottom-1.png` | Quần outfit chính |
| `bottom-2.png` | Quần phụ (non-outfit) |
| `shoe-1.png` | Giày outfit |
| `acc-1.png` | Phụ kiện outfit |
| `Robot-AI.png` | Avatar AI Core + Chat header |
| `feed-1.png` | Ảnh feed @fashionista |
| `feed-2.png` | Ảnh feed @minimalist |
| `feed-3.png` | Ảnh feed @genz.style |