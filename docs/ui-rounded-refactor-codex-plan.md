# UI Refactor Plan – Rounded Design System cho Smart Wardrobe / Closy

## 1. Mục tiêu refactor

Refactor toàn bộ giao diện Next.js TypeScript theo hướng:

- Bo tròn mềm mại hơn cho toàn bộ UI: card, button, input, image frame, modal, dropdown, sheet, tooltip.
- Chuyển toàn bộ font sang **Be Vietnam Pro**.
- Chuẩn hóa màu sắc theo palette chính: **đen, trắng, xám và `#D9C5B2`**.
- Dọn lại `globals.css` để không còn style lộn xộn, conflict hoặc override lung tung.
- Chuẩn hóa UI base component trước, sau đó mới migrate từng page/feature.
- Chuẩn hóa ngôn ngữ hiển thị, tránh UI bị lẫn tiếng Anh và tiếng Việt không kiểm soát.
- Không thay đổi business logic, API contract, route, store, query key hoặc backend naming.
- Không đổi tên biến, function, type, interface, file sang tiếng Việt.
- Tránh lỗi collapsed formatting, literal `\r\n`, import bị dính dòng, JSX bị ép thành một dòng khó đọc.

---

## 2. Design direction mới

Style tổng thể:

```txt
Modern
Soft rounded
Clean fashion-tech
Minimal
Premium
Black / White / Gray / Warm Beige Accent
```

Không dùng style quá góc cạnh, quá nhiều màu, shadow nặng hoặc hover quá mạnh.

Nên ưu tiên:

```txt
rounded-2xl
rounded-full
border nhẹ
shadow-sm
hover:shadow-md
transition-all duration-200
background trắng/xám nhạt
accent #D9C5B2
```

Tránh:

```txt
rounded-none
border quá đậm
shadow-2xl lạm dụng
hover:scale-110
gradient nhiều màu
nhiều màu brand khác nhau
font lẫn lộn
```

---

## 3. Color palette chuẩn

Palette chính chỉ xoay quanh:

```txt
Black:        #111111
White:        #FFFFFF
Off White:    #FAFAFA
Gray 50:      #F9FAFB
Gray 100:     #F3F4F6
Gray 200:     #E5E7EB
Gray 300:     #D1D5DB
Gray 500:     #6B7280
Gray 700:     #374151
Gray 900:     #111827
Accent Beige: #D9C5B2
```

Quy tắc dùng màu:

```txt
Primary text:        #111111
Secondary text:      #6B7280
Page background:     #FAFAFA
Card background:     #FFFFFF
Soft section bg:     #F3F4F6 hoặc #F9FAFB
Border:              #E5E7EB
Input border:         #D1D5DB hoặc #E5E7EB
Primary button:       #111111
Primary button text:  #FFFFFF
Secondary button:     #F3F4F6
Accent:               #D9C5B2
Accent soft bg:        #F4EEE8
Accent hover:          #CDB39D
```

Lưu ý:

- Không tự thêm màu brand mới như xanh, tím, hồng nếu không cần.
- Không dùng gradient nhiều màu trong UI base.
- Error/destructive state có thể giữ màu đỏ semantic như `#DC2626`, nhưng không được dùng làm màu nhận diện thương hiệu.
- Success/warning/info nếu cần thì dùng rất tiết chế, chỉ ở trạng thái thông báo, không dùng để trang trí UI chính.

---

## 4. CSS variables đề xuất trong `globals.css`

Ưu tiên quản lý màu bằng CSS variables. Không hard-code màu rải rác trong component.

```css
@import "tailwindcss";

:root {
  /* Font */
  --font-sans: var(--font-be-vietnam-pro), system-ui, sans-serif;

  /* Base colors */
  --background: #fafafa;
  --foreground: #111111;

  /* Surface */
  --card: #ffffff;
  --card-foreground: #111111;

  --popover: #ffffff;
  --popover-foreground: #111111;

  /* Brand */
  --primary: #111111;
  --primary-foreground: #ffffff;

  --secondary: #f3f4f6;
  --secondary-foreground: #111111;

  --accent: #d9c5b2;
  --accent-foreground: #111111;
  --accent-soft: #f4eee8;
  --accent-hover: #cdb39d;

  /* Muted */
  --muted: #f3f4f6;
  --muted-foreground: #6b7280;

  /* Border / input */
  --border: #e5e7eb;
  --input: #d1d5db;
  --ring: #d9c5b2;

  /* Semantic */
  --destructive: #dc2626;
  --destructive-foreground: #ffffff;

  /* Radius */
  --radius-sm: 0.75rem;
  --radius-md: 1rem;
  --radius-lg: 1.25rem;
  --radius-xl: 1.5rem;
  --radius-2xl: 2rem;
}

/* Tailwind v4 theme tokens */
@theme inline {
  --font-sans: var(--font-sans);

  --color-background: var(--background);
  --color-foreground: var(--foreground);

  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);

  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);

  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);

  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent-soft: var(--accent-soft);
  --color-accent-hover: var(--accent-hover);

  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);

  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);
  --radius-2xl: var(--radius-2xl);
}

* {
  box-sizing: border-box;
  border-color: var(--border);
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button,
input,
textarea,
select {
  font: inherit;
}

::selection {
  background: var(--accent);
  color: var(--accent-foreground);
}
```

---

## 5. Nếu project đang dùng Tailwind v3

Nếu project có `tailwind.config.ts`, thêm token như sau:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-be-vietnam-pro)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },

        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },

        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },

        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },

        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          soft: "var(--accent-soft)",
          hover: "var(--accent-hover)",
        },

        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },

        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
    },
  },
};

export default config;
```

Nếu project đang dùng Tailwind v4 và không có `tailwind.config.ts`, ưu tiên dùng `@theme inline` trong `globals.css`.

---

## 6. Cấu hình font Be Vietnam Pro

Trong `src/app/layout.tsx` hoặc `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smart Wardrobe",
  description: "AI-powered wardrobe assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body>{children}</body>
    </html>
  );
}
```

Quy tắc:

- Không import font bằng CDN trong CSS.
- Không set font riêng lẻ ở từng page.
- Không dùng nhiều font khác nhau nếu không có lý do rõ ràng.
- Title có thể khác style bằng `font-semibold`, `tracking-tight`, `text-3xl`, nhưng vẫn dùng Be Vietnam Pro.

---

## 7. Quy chuẩn border radius

Áp dụng thống nhất:

```txt
Button chính:          rounded-full
Button phụ:            rounded-full hoặc rounded-xl
Input:                 rounded-xl
Textarea:              rounded-xl
Select:                rounded-xl
Card nhỏ:              rounded-2xl
Card lớn / section:    rounded-[2rem]
Dialog / Modal:        rounded-2xl
Sheet:                 rounded-2xl ở phần góc phù hợp
Dropdown menu:         rounded-xl
Tooltip:               rounded-lg
Badge / chip:          rounded-full
Avatar:                rounded-full
Image frame:           rounded-2xl overflow-hidden
Search box:            rounded-full hoặc rounded-xl
Tab trigger:           rounded-full hoặc rounded-xl
```

Không nên dùng nhiều loại radius khác nhau trong cùng một khu vực UI.

---

## 8. Quy chuẩn shadow

Nên dùng shadow nhẹ:

```txt
Base card:       shadow-sm
Hover card:      hover:shadow-md
Floating panel:  shadow-lg
```

Tránh lạm dụng:

```txt
shadow-xl
shadow-2xl
drop-shadow-2xl
```

Chỉ dùng shadow mạnh cho hero object hoặc visual đặc biệt.

---

## 9. Quy chuẩn hover / active / focus

Hover mềm:

```txt
transition-all duration-200
hover:-translate-y-0.5
hover:shadow-md
hover:bg-muted
```

Button hover:

```txt
hover:bg-primary/90
hover:bg-accent-hover
hover:bg-muted
```

Focus state bắt buộc cho accessibility:

```txt
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-ring
focus-visible:ring-offset-2
```

Không được xóa focus bằng:

```txt
focus:outline-none
```

nếu không có `focus-visible:ring-*` thay thế.

---

## 10. UI base component cần sửa trước

Sửa theo thứ tự:

```txt
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/input.tsx
src/components/ui/textarea.tsx
src/components/ui/select.tsx
src/components/ui/dialog.tsx
src/components/ui/sheet.tsx
src/components/ui/dropdown-menu.tsx
src/components/ui/avatar.tsx
src/components/ui/badge.tsx
src/components/ui/tabs.tsx
src/components/ui/tooltip.tsx
src/components/ui/empty.tsx
```

Mục tiêu:

- UI base component tự mang style chuẩn.
- Page/feature không phải hard-code quá nhiều class.
- Dùng token như `bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-muted-foreground`, `bg-accent`, `ring-ring`.
- Không dùng hard-code `bg-[#...]` trong component nếu token đã có.

---

## 11. Ví dụ chuẩn Button

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "default"
  | "secondary"
  | "accent"
  | "outline"
  | "ghost"
  | "destructive";

type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-muted",
  accent:
    "bg-accent text-accent-foreground hover:bg-accent-hover shadow-sm",
  outline:
    "border border-border bg-background text-foreground hover:bg-muted",
  ghost:
    "text-foreground hover:bg-muted",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export function Button({
  className,
  variant = "default",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium",
        "transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
```

Nếu project đang dùng `class-variance-authority`, giữ CVA, chỉ update token và class. Không cần đổi kiến trúc component nếu không cần.

---

## 12. Ví dụ chuẩn Card

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-sm",
        "transition-all duration-200",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1.5 p-5", className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-5 pt-0", className)} {...props} />;
}
```

Card hover ở page có thể dùng:

```tsx
<Card className="hover:-translate-y-0.5 hover:shadow-md">
  ...
</Card>
```

---

## 13. Ví dụ chuẩn Input

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-input bg-card px-4 py-2 text-sm text-foreground shadow-sm",
        "placeholder:text-muted-foreground",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
```

---

## 14. Ví dụ chuẩn image frame

Dùng chung pattern này cho wardrobe item, outfit card, avatar lớn, gallery, upload preview:

```tsx
<div className="overflow-hidden rounded-2xl border border-border bg-muted">
  <img
    src={imageUrl}
    alt={itemName}
    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
  />
</div>
```

Lưu ý:

- Frame bo tròn bằng `rounded-2xl`.
- Container có `overflow-hidden`.
- Image hover scale nhẹ, không quá mạnh.
- Không để image vuông góc cạnh nếu design mới là rounded.

---

## 15. Chuẩn hóa text UI

Nên chọn một ngôn ngữ chính cho UI. Với target người dùng Việt Nam, đề xuất:

```txt
UI display text: Vietnamese
Code identifiers: English
Brand / product term: có thể giữ English
```

Ví dụ đúng:

```tsx
const wardrobeCopy = {
  title: "Tủ đồ của bạn",
  description: "Quản lý trang phục, phụ kiện và outfit cá nhân.",
  addItem: "Thêm trang phục",
  emptyTitle: "Tủ đồ còn trống",
  emptyDescription: "Hãy thêm món đồ đầu tiên để bắt đầu phối outfit.",
};
```

Ví dụ sai:

```tsx
const danhSachQuanAo = [];
const trangPhucDangChon = null;
```

Không đổi:

```tsx
const wardrobeItems = [];
const selectedOutfit = null;
const outfitSuggestions = [];
```

Nếu cần gom text, tạo:

```txt
src/constants/copy.ts
```

hoặc theo feature:

```txt
src/features/wardrobe/constants/copy.ts
src/features/outfit/constants/copy.ts
src/features/auth/constants/copy.ts
```

---

## 16. Quy tắc cho `globals.css`

`globals.css` chỉ nên chứa:

```txt
1. Tailwind import
2. Theme variables
3. Base styles
4. Shared utilities thật sự global
```

Không nên chứa:

```txt
.home-card
.profile-button
.outfit-page-title
.wardrobe-grid-card
.login-wrapper
```

Style theo component/page nên nằm trong component bằng Tailwind class hoặc UI primitive.

---

## 17. Thứ tự refactor an toàn

Không sửa toàn bộ app một lần. Chia batch nhỏ.

### Batch 1: Foundation

```txt
src/app/layout.tsx hoặc app/layout.tsx
src/app/globals.css hoặc app/globals.css
tailwind.config.ts nếu đang dùng Tailwind v3
```

Việc cần làm:

```txt
- Thêm Be Vietnam Pro.
- Dọn globals.css.
- Thêm color tokens.
- Thêm radius tokens.
- Đảm bảo body dùng font mới.
- Không sửa UI page trong batch này.
```

### Batch 2: UI primitives

```txt
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/input.tsx
src/components/ui/textarea.tsx
src/components/ui/select.tsx
```

Việc cần làm:

```txt
- Chuẩn hóa radius.
- Chuẩn hóa màu token.
- Chuẩn hóa hover/focus.
- Không đổi API component nếu không cần.
```

### Batch 3: Overlay components

```txt
src/components/ui/dialog.tsx
src/components/ui/sheet.tsx
src/components/ui/dropdown-menu.tsx
src/components/ui/tooltip.tsx
src/components/ui/tabs.tsx
```

Việc cần làm:

```txt
- Bo tròn overlay.
- Border nhẹ.
- Shadow vừa phải.
- Hover/focus đồng nhất.
```

### Batch 4: Visual components

```txt
src/components/ui/avatar.tsx
src/components/ui/badge.tsx
src/components/ui/empty.tsx
các component image/card dùng chung
```

Việc cần làm:

```txt
- Badge rounded-full.
- Avatar rounded-full.
- Empty state mềm hơn.
- Image frame rounded-2xl overflow-hidden.
```

### Batch 5: Feature pages

Sửa lần lượt:

```txt
auth
wardrobe
outfit
community
profile
landing
dashboard
```

Việc cần làm:

```txt
- Thay hard-code style bằng UI component/token.
- Đồng bộ text UI.
- Kiểm tra responsive.
- Không đổi logic fetch data.
```

---

## 18. Prompt chính đưa cho Codex

```md
You are a senior Next.js TypeScript developer. Refactor the UI of this project into a consistent rounded, soft, modern fashion-tech design system.

Context:
- The current UI is too angular and inconsistent.
- The app has mixed English/Vietnamese UI text.
- `globals.css` is messy and contains inconsistent styles.
- UI base components are not visually consistent.
- The app should use Be Vietnam Pro as the global font.
- The color palette must be limited to black, white, gray, and the accent color `#D9C5B2`.
- This is a Next.js + TypeScript project.

Main goals:
1. Refactor the global styling foundation.
2. Set Be Vietnam Pro as the global font using `next/font/google`.
3. Clean and normalize `globals.css`.
4. Create consistent design tokens for:
   - background
   - foreground
   - card
   - muted
   - border
   - input
   - primary
   - secondary
   - accent
   - destructive
   - radius
5. Use this exact color direction:
   - primary black: `#111111`
   - white: `#FFFFFF`
   - background: `#FAFAFA`
   - gray surface: `#F3F4F6`
   - border: `#E5E7EB`
   - muted text: `#6B7280`
   - accent: `#D9C5B2`
   - accent soft: `#F4EEE8`
   - accent hover: `#CDB39D`
6. Make the entire UI more rounded:
   - cards: `rounded-2xl`
   - buttons: `rounded-full` or `rounded-xl` depending on context
   - inputs/selects/textareas: `rounded-xl`
   - image frames: `rounded-2xl overflow-hidden`
   - dialogs/sheets/dropdowns: `rounded-2xl` or `rounded-xl`
   - badges: `rounded-full`
7. Normalize hover, active, and focus-visible states.
8. Keep the UI clean, soft, minimal, premium, and fashion-tech.
9. Do not change business logic.
10. Do not change API contracts.
11. Do not change route structure.
12. Do not rename variables, functions, types, interfaces, routes, or files into Vietnamese.
13. UI copy can be Vietnamese, but all code identifiers must stay English.
14. Avoid large risky rewrites.
15. Do not create collapsed formatting or broken one-line code.
16. Preserve proper LF newlines.
17. Run Prettier on changed files.

Implementation strategy:
- First inspect the project structure.
- Start with `app/layout.tsx` or `src/app/layout.tsx` and global font setup.
- Then clean `globals.css`.
- Then refactor shared UI components in `src/components/ui`.
- Then migrate feature components page by page.
- Prefer reusable class patterns and component variants instead of repeated hard-coded classes.
- Do not modify unrelated logic.
- Keep changes small and reviewable.

Important:
- Do not replace code using unsafe global string replacement.
- Do not convert `\r\n` into literal text.
- Do not output escaped newline text into source files.
- Preserve real line breaks.
- Do not collapse multiple imports or statements into one line.
- Do not touch generated files.
- Do not modify package manager lockfiles unless a dependency is actually added.
- Do not add a new UI library unless absolutely necessary.
- Do not rename English identifiers to Vietnamese.
- Do not change backend/API naming.
- Do not change Zustand store names, query keys, service names, or route params unless required for a compile fix.
- Do not use random colors outside black, white, gray, and `#D9C5B2` for the main UI.

Recommended order:
1. Audit current UI and globals.
2. Add Be Vietnam Pro font.
3. Normalize `globals.css`.
4. Refactor Button.
5. Refactor Card.
6. Refactor Input/Textarea/Select.
7. Refactor Dialog/Sheet/Dropdown/Tooltip.
8. Refactor Avatar/Badge/Tabs.
9. Refactor image containers/cards in wardrobe/outfit/community/profile pages.
10. Normalize UI copy.
11. Run:
   - npm run lint
   - npm run type-check if available
   - npm run build
   - npx prettier --write <changed-files>
12. Provide a summary of changed files and remaining risky areas.

Acceptance criteria:
- All pages use Be Vietnam Pro.
- The UI color palette uses black, white, gray, and `#D9C5B2` as the only main accent.
- UI no longer looks angular.
- Cards, buttons, inputs, modals, and image frames have consistent rounded styling.
- Hover states feel soft and consistent.
- No mixed Vietnamese/English text in the same UI area unless it is a brand/feature term.
- No business logic is changed.
- No route is broken.
- No TypeScript errors are introduced.
- No collapsed formatting or broken imports.
```

---

## 19. Prompt chạy từng batch

```md
Refactor only these files in this batch. Keep the changes focused on UI consistency, rounded design, Be Vietnam Pro compatibility, black/white/gray/`#D9C5B2` color tokens, and style cleanup.

Rules:
- Do not change logic.
- Do not rename variables/functions/types.
- Do not translate code identifiers into Vietnamese.
- Only UI display text may be normalized.
- Preserve real newlines.
- Do not generate literal `\r\n`.
- Do not collapse imports or JSX into unreadable one-line code.
- Do not use colors outside black, white, gray, and `#D9C5B2` for the main UI.
- Run Prettier after editing.

Files:
- <paste file paths here>

Goal:
- Apply consistent rounded design.
- Use existing design tokens from globals.css.
- Remove local inconsistent styles where possible.
- Keep TypeScript valid.
```

---

## 20. Checklist sau mỗi batch

```txt
[ ] Không đổi logic
[ ] Không đổi API call
[ ] Không đổi route
[ ] Không đổi query key
[ ] Không đổi Zustand store name
[ ] Không đổi type/interface nếu không cần
[ ] Không đổi tên biến sang tiếng Việt
[ ] Font dùng Be Vietnam Pro
[ ] Không hard-code font riêng
[ ] Không dùng màu ngoài black/white/gray/#D9C5B2 cho main UI
[ ] Không dùng rounded lung tung
[ ] Card/button/input/image frame đã bo tròn đồng nhất
[ ] Hover mềm và thống nhất
[ ] Focus-visible vẫn còn
[ ] Không để text English/Vietnamese lẫn lộn trong cùng một cụm UI
[ ] Không xuất hiện literal `\r\n`
[ ] Không dính import thành một dòng lỗi
[ ] File đã format bằng Prettier
[ ] `npm run lint` pass
[ ] `npm run build` pass
```

---

## 21. Lưu ý đặc biệt để tránh lỗi formatting

Vì dự án từng gặp lỗi code bị dính dòng / literal newline, cần yêu cầu Codex:

```txt
Do not perform unsafe global replacement.
Do not write escaped newline characters into source files.
Do not convert line endings into literal text.
Preserve real line breaks.
Format each changed file with Prettier immediately after editing.
Make small incremental changes.
Stop after each batch and report changed files.
```

Không nên yêu cầu:

```txt
Refactor all UI files at once.
Rewrite the whole src folder.
Translate all code to Vietnamese.
Replace all rounded classes globally.
Replace all colors globally.
```

Vì những lệnh này dễ gây lỗi format, vỡ layout hoặc đổi nhầm logic.

---

## 22. Kết luận

Hướng làm an toàn nhất:

```txt
Foundation first
UI primitives second
Feature pages third
Copy normalization last
Lint/build after every batch
```

Không nên sửa từng page theo cảm tính. Khi `globals.css`, font, color token và UI primitive đã chuẩn, các page phía sau chỉ cần migrate dần về token và component base là giao diện sẽ đồng nhất, mềm hơn, hiện đại hơn và ít rủi ro hơn.
