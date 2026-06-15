# Redesign UI/UX Landing Page — Closy Smart Wardrobe (Final)

## Tổng quan

Redesign toàn bộ landing page Closy gồm 5 phần: sửa layout scrollytelling, thêm nền động, bỏ Pricing, thêm 4 component mới, chuyển footer dark.

### Quyết định đã xác nhận
- ✅ Wardrobe Hero đặt bên **phải** (`right: 5-10vw`)
- ✅ Copy text **cùng vị trí** (`left side`) cho tất cả scene → tạo rhythm
- ✅ **Bỏ** Pricing section hoàn toàn
- ✅ **Giữ cả 4** component mới: Social Proof, Before/After, Testimonials, Final CTA
- ✅ **Thêm nền động**: Gradient mesh shift + Soft blobs parallax + Grain animation

---

## PHẦN 1: Sửa Scrollytelling (5 Scenes)

### Scene 0: Hero — Layout Split Asymmetric

**Hiện tại:** Title centered, quá lớn (`text-[9rem]`), bị wardrobe che. CTA ẩn.

**Thiết kế mới:**

```
┌─────────────────────────────────────────────────────┐
│  [SW]                        [Đăng nhập] [Bắt Đầu] │
│                                                     │
│                                                     │
│   Tủ đầy ắp đồ,                  ┌────────────┐    │
│   nhưng lại...                    │            │    │
│                                   │  WARDROBE  │    │
│   "Hôm nay mặc gì?"             │   IMAGE    │    │
│                                   │            │    │
│                                   └────────────┘    │
│                                                     │
│              Cuộn để mở khóa tủ đồ ↓               │
└─────────────────────────────────────────────────────┘
```

**Thay đổi cụ thể:**
- `hero-content`: `absolute left-[5vw] top-1/2 -translate-y-1/2 text-left` (bỏ `items-center text-center mt-32`)
- `h1`: giảm size → `text-5xl md:text-7xl lg:text-8xl` (bỏ `lg:text-[9rem]`)
- `h2` subtitle: bỏ `pr-8`, thêm `mt-4`
- `wardrobe-container`: `right-[8vw] top-1/2 -translate-y-1/2` (bỏ `translate-y-[40vh]`), scale `1.2` thay vì `1.5`
- CTA scroll: tách ra riêng ở `absolute bottom-12 left-1/2 -translate-x-1/2`

---

### Scene 1: Digital Wardrobe — 2 Cột Rõ Ràng

**Hiện tại:** Cards bay ra ngoài viewport, copy text xa visual.

**Thiết kế mới:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌──────┐         ┌───┐  ┌───┐  ┌───┐              │
│  │      │         │ 👕│  │ 👖│  │ 👟│              │
│  │ WARD │  scan → │   │  │   │  │   │              │
│  │ ROBE │         ├───┤  ├───┤  ├───┤              │
│  │      │         │ 👗│  │ 👜│  │ 🧥│              │
│  └──────┘         │   │  │   │  │   │              │
│                   └───┘  └───┘  └───┘              │
│                                                     │
│  ✨ Digital Wardrobe                                │
│  Số hoá tủ đồ.                                     │
│  Chụp 1 lần. AI tự động...                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**GSAP changes:**
- Wardrobe animate: `x: "-20vw"`, `scale: 0.75`
- Cloth cards spread grid 2x3:
  - `x: (i) => (i % 3) * 11 + 5` vw
  - `y: (i) => Math.floor(i / 3) * 20 - 10` vh
- Copy-1: `absolute left-[5vw] bottom-[12vh]` (nhất quán)

---

### Scene 2: AI Recommendation — Outfit Centered

**Hiện tại:** Outfit lệch tâm, glow misaligned.

**Thiết kế mới:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│  ✨ AI Recommendation              ┌───┐           │
│  Stylist Cá Nhân.                  │ 👕│  top      │
│  Hàng ngàn gợi ý...               ├───┤           │
│                              🤖    │ 👖│  bottom   │
│                           AI Core  ├───┤           │
│                                    │ 👟│  shoes    │
│                                    └───┘    👜 acc │
│                          ~~~glow~~~                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**GSAP changes:**
- Outfit items center-right:
  - `outfit-top`: `x: "8vw", y: "-18vh"`
  - `outfit-bottom`: `x: "8vw", y: "2vh"`
  - `outfit-shoes`: `x: "8vw", y: "18vh"`
  - `outfit-acc`: `x: "22vw", y: "0vh"`
- Robot AI core: `x: "8vw", y: "-2vh"`
- Magic glow: bỏ inline `translate-x`, GSAP animate `x: "8vw"`
- Copy-2: `absolute left-[5vw] bottom-[12vh]`

---

### Scene 3: AI Chatbot — Clean Transition

**Hiện tại:** Chat lệch phải, outfit zombie từ scene 2.

**Thiết kế mới:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│  💬 AI Chatbot             ┌──────────────────┐     │
│  Hiểu gu của bạn.         │  🤖 Closy AI     │     │
│  Closy phân tích...       │  ─────────────── │     │
│                            │  User: Thứ 7 đi │     │
│                            │  dạo phố...      │     │
│                            │                  │     │
│                            │  AI: Thử set     │     │
│                            │  này nhé!        │     │
│                            └──────────────────┘     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**GSAP changes:**
- Outfit group: `opacity: 0, scale: 0.5` (ẩn hoàn toàn)
- Wardrobe container: `opacity: 0`
- Chat interface: đến `x: "8vw", y: "0vh"`
- Copy-3: `absolute left-[5vw] bottom-[12vh]`

---

### Scene 4: Community Feed — Structured Layout

**Hiện tại:** Feed cards rải rác, like bubbles random.

**Thiết kế mới:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                     ┌────────┐                      │
│  🔗 Community      │  FEED  │  ┌────────┐          │
│  Chia sẻ &         │  CARD  │  │  FEED  │          │
│  Pass đồ.          │   1    │  │  CARD  │          │
│  Tìm nguồn...      └────────┘  │   2    │          │
│                                 └────────┘          │
│                  ┌────────┐                         │
│           ❤️ ❤️  │  FEED  │  ❤️                    │
│                  │  CARD  │                         │
│                  │   3    │                         │
│                  └────────┘                         │
└─────────────────────────────────────────────────────┘
```

**GSAP changes:**
- Chat interface: `opacity: 0, x: "40vw"` (exit)
- Outfit group: ẩn hoàn toàn `opacity: 0`
- Feed cards (gọn hơn, centered):
  - card-1: `x: "-5vw", y: "-8vh", rotation: -3`
  - card-2: `x: "12vw", y: "-15vh", rotation: 5`
  - card-3: `x: "5vw", y: "12vh", rotation: -2`
- Like bubbles gắn gần feed cards
- Copy-4: `absolute left-[5vw] bottom-[12vh]`

---

## PHẦN 2: Nền Động (Dynamic Living Background)

### 2A. Gradient Mesh Scroll-Shift

Background gradient thay đổi "nhiệt độ màu" theo scroll position. Cực kỳ subtle — user không nhận ra nhưng vô thức cảm nhận mỗi scene có mood khác.

**Implementation:**
- Thêm 1 `div.bg-gradient-layer` absolute fullscreen, `z-0`
- GSAP ScrollTrigger scrub trên main timeline, animate `background` CSS variable:

```
Scene 0 (Hero):     #F4F1EE → cream ấm, an toàn
Scene 1 (Wardrobe): #EDE8E3 → warmer, kích thích
Scene 2 (AI):       #F0E8DC → thoáng gold, magic
Scene 3 (Chat):     #EBE5DE → warm neutral, thân thiện  
Scene 4 (Community):#E8E4DF → cool hơn nhẹ, social
```

- Dùng GSAP `to()` trên inline style `backgroundColor` trong timeline chính
- Cost: **gần 0** — chỉ animate 1 property trên 1 element

---

### 2B. Pre-Blurred Soft Blobs (Parallax)

2-3 gradient circles lớn, đã pre-blurred, di chuyển chậm theo scroll → tạo depth.

**Implementation:**
- 3 `div.ambient-blob` elements, absolute positioned, `z-[1]`
- Mỗi blob:
  - Size: `w-[500px] h-[500px]` đến `w-[700px] h-[700px]`
  - Background: radial-gradient các tông `#D9C5B2`, `#E8DFD4`, `#D4DECE`
  - `opacity: 0.12` — rất nhẹ
  - `border-radius: 50%`
  - **Không dùng `blur()` CSS** → thay vào đó dùng radial-gradient mềm (đã "pre-blurred") để tránh GPU drain
- GSAP: mỗi blob có ScrollTrigger riêng với `scrub: true`:
  - Blob 1: `y: -300` → `y: 300` (speed 0.3x scroll)
  - Blob 2: `y: -200` → `y: 400` (speed 0.5x scroll)
  - Blob 3: `x: -100, y: -150` → `x: 100, y: 350` (diagonal drift)

**Vị trí ban đầu (staggered):**
```
┌─────────────────────────────────────────┐
│  (blob1)                                │
│     ○ #D9C5B2                           │
│           top: 10%, left: 15%           │
│                                         │
│                     (blob2)             │
│                       ○ #E8DFD4         │
│                 top: 40%, right: 10%    │
│                                         │
│      (blob3)                            │
│        ○ #D4DECE                        │
│        top: 70%, left: 40%              │
└─────────────────────────────────────────┘
```

- Cost: **rất thấp** — chỉ animate `transform` (compositor prop)

---

### 2C. Animated Grain Texture

Noise grain overlay nhúc nhích nhẹ → tạo cảm giác "film editorial".

**Implementation:**
- Tận dụng div noise đã có (L114), extend ra full page thay vì chỉ trong scrolly section
- Thêm CSS animation:

```css
@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-2%, -3%); }
  30% { transform: translate(3%, -1%); }
  50% { transform: translate(-1%, 2%); }
  70% { transform: translate(2%, 1%); }
  90% { transform: translate(-3%, -2%); }
}

.grain-overlay {
  animation: grain 0.8s steps(6) infinite;
  pointer-events: none;
  opacity: 0.06;
}
```

- Noise texture slightly oversized (`w-[110%] h-[110%]`) để khi translate vẫn cover full viewport
- `opacity: 0.06` (nhẹ hơn hiện tại `0.10`) vì giờ nó apply toàn page
- `position: fixed` thay vì `absolute` → grain theo viewport, không scroll đi
- Cost: **rất thấp** — CSS animation steps(), không GSAP, không JS

---

### Tổng hợp layer stack (z-index)

```
z-0:  Gradient mesh layer (bg color shift)
z-1:  Ambient blobs (parallax soft circles)  
z-2:  Grain overlay (fixed, toàn page)
z-10: Page content (scrollytelling, sections)
z-20: Wardrobe container
z-30: Cloth cards, feed cards, outfit group
z-40: Chat interface
z-50: Hero content, copy texts, headers
```

---

## PHẦN 3: Bỏ Pricing Section

**Xóa hoàn toàn:**
- Section pricing (L263-309): Closy Basic + Closy Pro cards
- `PricingFeature` component (L353-361)

**Thay thế bằng** 4 component mới ở Phần 4.

---

## PHẦN 4: Thêm 4 Component Mới (Sau Scrollytelling)

### Component 1: Social Proof — "Closy trong con số"

```
┌──────────────────────────────────────────────────────────┐
│  ██████████████████ bg-[#1A1A1A] ████████████████████████ │
│                                                          │
│    10,000+        5,000+        98%          30s         │
│    Outfits        Tủ đồ        Tiết kiệm    Upload     │
│    AI gợi ý      số hóa       thời gian     xong       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Specs:**
- Section: `w-full py-24 px-6 bg-[#1A1A1A]`
- Container: `max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12`
- Mỗi metric:
  - Number: `font-heading text-5xl md:text-6xl text-white font-medium`
  - Label: `text-sm uppercase tracking-widest text-[#707070] mt-2`
- Metrics data:
  - `10,000+` — Outfits AI gợi ý
  - `5,000+` — Tủ đồ đã số hóa
  - `98%` — Tiết kiệm thời gian
  - `30s` — Upload xong

**Animation:** 
- Standalone `ScrollTrigger` (không trong main timeline vì section này nằm ngoài pinned area)
- Counter effect: `gsap.from(element, { textContent: 0, duration: 2, ease: "power1.out", snap: { textContent: 1 }, scrollTrigger: { trigger, start: "top 80%" } })`
- Stagger: 0.2s mỗi counter

---

### Component 2: Before/After — "Trước & Sau khi có Closy"

```
┌──────────────────────────────────────────────────────────┐
│  bg-[#F4F1EE]                                            │
│                                                          │
│              Trước & Sau khi có Closy                    │
│                                                          │
│  ┌─────────────────────┐    ┌─────────────────────┐      │
│  │  BEFORE (white)     │    │  AFTER (dark)       │      │
│  │                     │    │                     │      │
│  │  ⏰ 30 phút chọn đồ│    │  ✨ 2 phút outfit   │      │
│  │  👕 Tủ đồ lộn xộn  │    │  📱 Gọn gàng        │      │
│  │  😩 Mua trùng, phối │    │  🎯 AI hiểu gu     │      │
│  │     không hợp       │    │     của bạn          │      │
│  │                     │    │                     │      │
│  └─────────────────────┘    └─────────────────────┘      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Specs:**
- Section: `w-full py-32 px-6 bg-[#F4F1EE]`
- Heading: `font-heading text-4xl md:text-6xl text-center text-[#1A1A1A] mb-16`
- Grid: `max-w-5xl mx-auto grid md:grid-cols-2 gap-8`
- Before card: `bg-white rounded-3xl p-10 border border-[#1A1A1A]/5`
  - Title: "Trước Closy" + `text-2xl font-bold text-[#1A1A1A] mb-8`
  - 3 items, mỗi item: icon + text, `text-[#707070]`, `space-y-6`
- After card: `bg-[#1A1A1A] rounded-3xl p-10 text-white`
  - Title: "Sau Closy" + `text-2xl font-bold text-white mb-8`
  - 3 items, mỗi item: icon `text-[#B8975A]` + text white, `space-y-6`

**Animation:**
- Before card: `fromTo({ x: -60, opacity: 0 }, { x: 0, opacity: 1 })`
- After card: `fromTo({ x: 60, opacity: 0 }, { x: 0, opacity: 1 })`
- List items inside each card: stagger `0.15s`, `fromTo({ y: 20, opacity: 0 }, { y: 0, opacity: 1 })`
- Tất cả dùng standalone ScrollTrigger: `start: "top 75%"`

---

### Component 3: Testimonials — "Gen Z nói gì?" (Chat Bubbles)

```
┌──────────────────────────────────────────────────────────┐
│  bg-[#EBE7E2]                                            │
│                                                          │
│              Gen Z nói gì về Closy?                      │
│                                                          │
│    ┌──────────────────────────┐                          │
│    │ 🙋 @linh.fashion          │                          │
│    │ "AI phối đồ giỏi quá 😳" │                          │
│    └──────────────────────────┘                          │
│                     ┌──────────────────────────┐         │
│                     │ 👩 @minh.closet           │         │
│                     │ "Pass đồ cũ vui quá! ❤️"  │         │
│                     └──────────────────────────┘         │
│         ┌──────────────────────────┐                     │
│         │ 🧑 @an.style99           │                     │
│         │ "Tiết kiệm cả tiếng 🔥"  │                     │
│         └──────────────────────────┘                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Specs:**
- Section: `w-full py-32 px-6 bg-[#EBE7E2]`
- Heading: `font-heading text-4xl md:text-6xl text-center text-[#1A1A1A] mb-16`
- Container: `max-w-3xl mx-auto space-y-8`
- Mỗi testimonial bubble:
  - Wrapper: flex container, alternate `justify-start` / `justify-end` / `justify-center`
  - Bubble: `bg-white rounded-2xl p-6 shadow-lg max-w-md border border-[#1A1A1A]/5`
  - Avatar: `size-10 rounded-full bg-[#D9C5B2]` + initials
  - Username: `text-sm font-bold text-[#1A1A1A]`
  - Quote: `text-[#707070] text-base mt-2 italic`

**Content:**
1. `@linh.fashion` — *"Không nghĩ AI phối đồ giỏi vậy luôn 😳 Mặc đẹp mà không cần nghĩ"*
2. `@minh.closet` — *"Pass được mấy cái áo không mặc 2 năm rồi, vui quá! ❤️"*
3. `@an.style99` — *"Giờ mỗi sáng mở app là có outfit luôn, tiết kiệm cả tiếng đồng hồ 🔥"*

**Animation:** `ScrollTrigger.batch` hoặc stagger — mỗi bubble `fromTo({ y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.25 })`

---

### Component 4: Final CTA — "Mở khóa tủ đồ"

```
┌──────────────────────────────────────────────────────────┐
│  ████████████████████ bg-[#1A1A1A] █████████████████████ │
│                                                          │
│                  ~~~radial glow D9C5B2~~~                │
│                                                          │
│         Sẵn sàng để không bao giờ hỏi                   │
│         "Hôm nay mặc gì?" nữa?                         │
│                                                          │
│        Không cần thẻ tín dụng. 30 giây.                 │
│                                                          │
│            ┌──────────────────────┐                      │
│            │  Bắt Đầu Miễn Phí → │                      │
│            └──────────────────────┘                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Specs:**
- Section: `w-full min-h-[70vh] flex items-center justify-center px-6 bg-[#1A1A1A] relative overflow-hidden`
- Radial glow: `absolute w-[400px] h-[400px] bg-[#D9C5B2] rounded-full opacity-20` + radial gradient blur (pre-blurred, không CSS blur)
- Heading: `font-heading text-4xl md:text-6xl lg:text-7xl text-white text-center leading-tight`
  - Line 1: "Sẵn sàng để không bao giờ hỏi"
  - Line 2: `"Hôm nay mặc gì?"` `text-[#D9C5B2]` + "nữa?"
- Subtitle: `text-[#707070] text-lg mt-6 text-center`
- Button: `bg-white text-[#1A1A1A] rounded-full px-12 py-5 text-lg font-bold mt-10`
  - Hover: `hover:scale-[1.03]` + `shadow-[0_0_40px_rgba(217,197,178,0.3)]`
  - Link to `/auth/register`

**Animation:**
- Heading lines: stagger reveal `fromTo({ y: 40, opacity: 0 }, { y: 0, opacity: 1 })`, stagger 0.3s
- Button: `fromTo({ scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, ease: "back.out(1.5)" })`, delay after heading

---

## PHẦN 5: Footer Dark Theme

Chuyển footer từ cream sang dark để chuyển tiếp mượt từ Final CTA.

**Thay đổi:**
- `bg-[#EBE7E2]` → `bg-[#1A1A1A]`
- `border-t border-[#1A1A1A]/5` → `border-t border-white/10`
- `text-[#707070]` → giữ nguyên (vẫn đọc được trên dark)
- Logo `text-[#1A1A1A]` → `text-white`
- Link hover: `hover:text-[#D9C5B2]` → giữ nguyên

---

## Proposed Changes

### [MODIFY] [LandingClient.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(guest)/components/LandingClient.tsx)

File duy nhất cần sửa. Tổng quan thay đổi:

| # | Vùng | Hành động | Dòng |
|---|------|-----------|------|
| 1 | Imports | Thêm icons: `Clock`, `Smartphone`, `Target`, `Timer` | L11 |
| 2 | GSAP Timeline | Sửa toàn bộ 5 scenes animation | L19-104 |
| 3 | Background layers | **MỚI** — gradient + blobs + grain (trong scrolly section) | L112-114 |
| 4 | Hero Content JSX | Đổi layout left-aligned | L117-128 |
| 5 | Wardrobe Container | Positioning sang right | L131-158 |
| 6 | Copy Texts | Thống nhất `left-[5vw] bottom-[12vh]` | L220-260 |
| 7 | Pricing Section | **XÓA** | L263-309 |
| 8 | Social Proof | **MỚI** section + counter GSAP | — |
| 9 | Before/After | **MỚI** section + scroll reveal GSAP | — |
| 10 | Testimonials | **MỚI** section + batch stagger GSAP | — |
| 11 | Final CTA | **MỚI** section + text reveal GSAP | — |
| 12 | Footer | Đổi dark theme | L311-322 |
| 13 | PricingFeature | **XÓA** component | L353-361 |
| 14 | Grain CSS | **MỚI** keyframes animation | globals.css |

### [MODIFY] [globals.css](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/globals.css)

| # | Hành động |
|---|-----------|
| 1 | Thêm `@keyframes grain` animation |
| 2 | Thêm `.grain-overlay` class |

---

## Verification Plan

### Manual Verification
1. Mở `localhost:3000`, viewport **1440×900**
2. **Nền động:** Verify gradient shift subtle khi scroll, blobs parallax mượt, grain nhẹ nhàng không gây distraction
3. **Scrollytelling:** Scroll qua 5 scene, verify:
   - Hero: text trái, wardrobe phải, không overlap
   - Scene 1-4: copy text luôn left, visuals center-right
   - Transition: không element zombie
   - Cards trong viewport
4. **4 Component mới:**
   - Counters chạy khi enter viewport
   - Before/After cards reveal slide-in
   - Testimonial bubbles stagger
   - Final CTA glow + button hover
5. **Footer:** chuyển tiếp dark mượt từ CTA
6. Chụp screenshots trước/sau so sánh
