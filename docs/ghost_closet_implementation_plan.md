# Closy Wardrobe Simulation Network — Implementation Plan

> **Mục tiêu**: Xây dựng prototype 6 màn hình của hệ thống **Ghost Closet (B2C)** và **Digital Sample Lab (B2B)** lên trên codebase `smart-wardrobe-fe` hiện tại, dùng **mock data** (không cần backend thật), sẵn sàng demo và trình bày.

---

## 1. Bối cảnh hiện tại (Codebase Analysis)

### Tech Stack
- **Framework**: Next.js App Router (TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: Zustand (`useAuthStore`, etc.)
- **Animation**: GSAP + `@gsap/react`
- **Data Fetching**: TanStack Query (`react-query`)
- **UI Components**: shadcn/ui, HeroUI, Lucide icons

### Các module đang có
| Route | Mô tả |
|---|---|
| `/wardrobe` | Tủ đồ thật — grid items, filter, sort, bulk delete, pagination |
| `/outfits` | Lookbook — danh sách outfits đã tạo |
| `/ai-stylist` | AI phối đồ — chọn occasion/style/season → gọi API → canvas board |
| `/marketplace` | Marketplace mua bán |
| `/community` | Community posts |

### Kiến trúc hiện tại liên quan
```
src/features/wardrobe/types/index.ts
  WardrobeItemRes { id, category, color, imageUrl, style, material, ... }

src/features/ai-stylist/types/index.ts
  AIOutfitRecommendationRes { title, explanation, items: AIOutfitItem[] }
  AIOutfitItem { role, primary: WardrobeItemRes, alternatives: WardrobeItemRes[] }

src/app/(user)/ai-stylist/components/AIStylistClient.tsx
  - Chọn params → gọi aiApi.getOutfitRecommendation()
  - Hiển thị OutfitCanvasBoard với items
```

---

## 2. Feature Overview

### B2C — Closy Ghost Closet (Tủ đồ thử trước)
Trong quá trình AI phối đồ, Closy **tạm đưa một sản phẩm local brand** (Ghost Item) vào outfit như thể user đang sở hữu nó, và đo lường **Wardrobe Impact** của sản phẩm đó trên toàn bộ tủ đồ.

### B2B — Closy Digital Sample Lab (Phòng thử mẫu số)
Brand **upload digital sample** (sản phẩm chưa sản xuất / đang cân nhắc), Closy chạy thử nghiệm trên wardrobe ẩn danh, trả về **Wardrobe Fit Report** tổng hợp.

---

## 3. Prototype Screens (6 màn hình)

### B2C Screens

#### Screen 1 — Ghost Closet Toggle (trong AI Stylist)
**Route**: `/ai-stylist` — thêm toggle mới
- Toggle **"Mix with Local Brands"** trong panel options của AIStylistClient
- Khi bật: flag `ghostClosetEnabled = true` truyền vào request hoặc mock
- Lưu preference vào `localStorage`

#### Screen 2 — AI Outfit với Ghost Item
**Route**: `/ai-stylist` — kết quả phối đồ sau khi bật toggle
- Outfit result hiển thị items như bình thường
- Một item trong outfit có badge đặc biệt `[GHOST]` — là sản phẩm brand
- Ghost Item có overlay khác biệt: viền nét đứt, nhãn brand name, shimmer effect
- Dữ liệu mock: inject 1 GhostItem vào `AIOutfitRecommendationRes.items`

#### Screen 3 — Wardrobe Impact Detail
**Route**: `/ai-stylist/ghost-impact/[itemId]` (new)
- Sheet/Modal hoặc page riêng mở khi user click vào Ghost Item
- Hiển thị các metrics:
  - **Works with N items** (compatible owned items)
  - **Unlocks N new outfit combinations**
  - **Suitable for** (occasions)
  - **Redundancy Risk** (low/medium/high)
  - **Fills your [Category] gap**
  - **Color Compatibility** (visual bar)
- CTA: Keep in outfit / Swap out / See more outfits / Save product / Hide brand / Not my style / Join waitlist / Buy

#### Screen 4 — Save / Swap / Join Waitlist Actions
**Route**: trong Screen 3, action bar ở bottom
- **Keep**: dismiss panel, item vẫn ở trong outfit
- **Save product**: toast + lưu vào `savedGhostItems[]` (localStorage mock)
- **Join waitlist**: toast xác nhận + badge "On Waitlist" trên item
- **Swap out**: replace Ghost Item bằng item thật trong alternatives
- **Hide this brand**: lọc brand đó khỏi future ghost items
- **Not my style**: signal negative, dismiss

---

### B2B Screens

#### Screen 5 — Upload Digital Sample
**Route**: `/brands/digital-sample-lab` (new)
- Form upload cho brand:
  - Product name & concept
  - Image upload (mock, dùng placeholder)
  - Variants: màu / kiểu dáng (add up to 3 variants)
  - Target audience: Female/Male/Unisex, style tags
  - Price range slider
  - Toggle: "Expose to matched wardrobes"
- Submit → navigate to Screen 6 với mock data

#### Screen 6 — Wardrobe Fit Report
**Route**: `/brands/digital-sample-lab/report/[sampleId]` (new)
- Dashboard cho brand xem kết quả:
  - **Overview stats**: Users exposed, Qualified wardrobes, Kept rate, Swap rate, Save/Waitlist rate
  - **Outfit Performance**: Median new outfits unlocked, Median compatible owned items
  - **Best performing color** (variant comparison)
  - **Best performing occasions** (bar chart mock)
  - **Most compatible wardrobe items** (tags)
  - **Wardrobe Penetration** (donut chart mock)
  - **Incremental Outfit Value** (line chart mock)
  - **Opportunity Cohort** (user segments)
  - **Variant Comparison** side-by-side

---

## 4. New Data Types & Mock Data

### Ghost Item Type (extend từ WardrobeItemRes)
```typescript
// src/features/ghost-closet/types/index.ts

export interface GhostItem extends WardrobeItemRes {
  isGhost: true;
  brandName: string;
  brandId: string;
  productUrl?: string;
  price: number;
  wardrobeImpact: WardrobeImpact;
}

export interface WardrobeImpact {
  compatibleItemCount: number;        // "Works with 11 items"
  newOutfitsUnlocked: number;         // "Unlocks 16 new outfit combinations"
  suitableOccasions: string[];        // ["Work", "Meeting", "Date"]
  redundancyRisk: 'low' | 'medium' | 'high';
  wardrobeGapFilled?: string;         // "Fills your Outerwear gap"
  colorCompatibilityScore: number;    // 0-100
}
```

### Digital Sample Type
```typescript
// src/features/ghost-closet/types/index.ts

export interface DigitalSample {
  id: string;
  productName: string;
  concept: string;
  imageUrl: string;
  variants: SampleVariant[];
  targetGender: 'female' | 'male' | 'unisex';
  targetStyleTags: string[];
  priceMin: number;
  priceMax: number;
  status: 'pending' | 'running' | 'completed';
  createdAt: string;
}

export interface SampleVariant {
  id: string;
  name: string;         // "Black", "Beige"
  imageUrl: string;
}

export interface WardrobeFitReport {
  sampleId: string;
  usersExposed: number;
  qualifiedWardrobes: number;
  keptRate: number;           // 0-1
  swappedRate: number;
  savedOrWaitlistRate: number;
  medianNewOutfits: number;
  medianCompatibleItems: number;
  bestPerformingColor: string;
  bestOccasions: string[];
  topCompatibleItems: string[];   // ["White shirts", "Neutral trousers"]
  wardrobePenetration: number;    // 0-1
  incrementalOutfitValue: number;
  variantComparison: VariantComparisonData[];
  opportunityCohorts: CohortData[];
}
```

### Mock Data File
```typescript
// src/features/ghost-closet/mock/ghostClosetMock.ts

export const MOCK_GHOST_ITEM: GhostItem = {
  id: "ghost-001",
  isGhost: true,
  brandName: "Mori Studio",
  brandId: "mori-studio",
  imageUrl: "/mock/luna-black-blazer.jpg",
  category: { id: "cat-outerwear", name: "Áo khoác", slug: "ao-khoac" },
  color: "Đen",
  colorHex: "#1A1A1A",
  style: "Minimal",
  price: 950000,
  status: 0,
  createdAt: new Date().toISOString(),
  wardrobeImpact: {
    compatibleItemCount: 11,
    newOutfitsUnlocked: 16,
    suitableOccasions: ["Work", "Meeting", "Date"],
    redundancyRisk: "low",
    wardrobeGapFilled: "Outerwear",
    colorCompatibilityScore: 88,
  },
};

export const MOCK_FIT_REPORT: WardrobeFitReport = {
  sampleId: "sample-001",
  usersExposed: 1240,
  qualifiedWardrobes: 786,
  keptRate: 0.64,
  swappedRate: 0.21,
  savedOrWaitlistRate: 0.18,
  medianNewOutfits: 7,
  medianCompatibleItems: 6,
  bestPerformingColor: "Black",
  bestOccasions: ["Work", "Meeting"],
  topCompatibleItems: ["White shirts", "Neutral trousers", "Black skirts"],
  wardrobePenetration: 0.63,
  incrementalOutfitValue: 7.2,
  variantComparison: [
    { variantName: "Black", keptRate: 0.68, savedRate: 0.22 },
    { variantName: "Beige", keptRate: 0.51, savedRate: 0.15 },
    { variantName: "Dark Brown", keptRate: 0.44, savedRate: 0.11 },
  ],
  opportunityCohorts: [
    { label: "Minimal workwear users", matchCount: 312 },
    { label: "Thiếu outerwear", matchCount: 198 },
    { label: "Thường mặc đi làm", matchCount: 276 },
    { label: "Nhiều item trung tính, thiếu layer", matchCount: 167 },
  ],
};
```

---

## 5. New Files & Routes Structure

```
src/
├── features/
│   └── ghost-closet/
│       ├── types/
│       │   └── index.ts                    [NEW] GhostItem, WardrobeImpact, DigitalSample, WardrobeFitReport
│       ├── mock/
│       │   └── ghostClosetMock.ts          [NEW] Mock data constants
│       ├── hooks/
│       │   └── useGhostCloset.ts           [NEW] Toggle state, saved items logic
│       └── components/
│           ├── GhostItemBadge.tsx          [NEW] Badge overlay "GHOST" cho ghost items
│           ├── WardrobeImpactPanel.tsx     [NEW] Wardrobe Impact metrics panel
│           └── GhostItemActions.tsx        [NEW] Action bar: Keep, Save, Waitlist, etc.
│
└── app/
    └── (user)/
        ├── ai-stylist/
        │   └── components/
        │       └── AIStylistClient.tsx     [MODIFY] Thêm Ghost Closet toggle + ghost item display
        └── brands/
            ├── layout.tsx                  [NEW] Brand portal layout
            └── digital-sample-lab/
                ├── page.tsx                [NEW] Screen 5 — Upload Digital Sample form
                └── report/
                    └── [sampleId]/
                        └── page.tsx        [NEW] Screen 6 — Wardrobe Fit Report dashboard
```

---

## 6. Modification Plan — AIStylistClient.tsx

### 6.1 Thêm Ghost Closet Toggle
- Thêm state: `const [ghostClosetEnabled, setGhostClosetEnabled] = useState(false);`
- Trong panel options, thêm toggle UI sau các bộ lọc hiện tại:
  ```tsx
  <div className="flex items-center justify-between border border-ink/10 px-4 py-3">
    <div>
      <p className="text-xs font-mono uppercase tracking-widest text-ink">Mix with Local Brands</p>
      <p className="text-[10px] text-ink-muted mt-0.5">Thử đồ từ brand địa phương trong outfit</p>
    </div>
    <Switch checked={ghostClosetEnabled} onCheckedChange={setGhostClosetEnabled} />
  </div>
  ```

### 6.2 Inject Ghost Item vào Outfit Result
- Sau khi `handleGenerate()` thành công và `ghostClosetEnabled = true`:
  ```typescript
  if (ghostClosetEnabled && res.items.length > 0) {
    const ghostAsAIItem: AIOutfitItem = {
      role: "Áo khoác",
      primary: MOCK_GHOST_ITEM as any,
      alternatives: [],
    };
    res.items.splice(1, 0, ghostAsAIItem); // inject vào vị trí thứ 2
  }
  ```

### 6.3 Hiển thị Ghost Item khác biệt trong OutfitCanvasBoard
- Check `item.primary.isGhost` → render `<GhostItemBadge>` overlay
- Click vào Ghost Item → open `<WardrobeImpactPanel>` as Sheet

---

## 7. Component Design Notes

### GhostItemBadge
```tsx
// Overlay trên card của ghost item
<div className="absolute inset-0 border-2 border-dashed border-[#A0522D]/60 pointer-events-none" />
<div className="absolute top-2 left-2 bg-[#A0522D] text-white text-[9px] font-mono uppercase tracking-widest px-2 py-0.5">
  Ghost · {brandName}
</div>
```

### WardrobeImpactPanel (Sheet from right)
```
┌─────────────────────────────┐
│ GHOST ITEM                  │
│ Luna Black Blazer           │
│ Mori Studio                 │
│ 950,000₫                   │
├─────────────────────────────┤
│ WARDROBE IMPACT             │
│ ✓ Works with 11 items       │
│ ✓ Unlocks 16 new outfits   │
│ ✓ Suitable for Work, Date   │
│ ↓ Low duplication           │
│ ↑ Fills Outerwear gap       │
│ ████████░░ 88% color match  │
├─────────────────────────────┤
│ [Keep]  [Swap out]          │
│ [Save product]              │
│ [Join waitlist]             │
│ [Not my style] [Hide brand] │
└─────────────────────────────┘
```

### Digital Sample Lab — Upload Form
- Dùng `react-hook-form` + `zod` validation (đã có trong project)
- Image preview với mock placeholder
- Multi-variant color picker

### Wardrobe Fit Report Dashboard
- Dùng **Recharts** (đã dùng trong project?) hoặc mock chart dạng CSS bar/donut
- Grid layout 2 cột: stats bên trái, charts bên phải
- Color: cream/ink palette giống toàn app

---

## 8. Navigation & Entry Points

| Từ đâu | Đến đâu | Cách |
|---|---|---|
| `/ai-stylist` (existing) | Ghost Closet toggle | Thêm trực tiếp vào panel |
| Ghost Item card | WardrobeImpactPanel | onClick → open Sheet |
| Sidebar / nav | `/brands/digital-sample-lab` | Thêm nav item (ẩn với user thường, hiện với brand role) |
| Upload form submit | `/brands/digital-sample-lab/report/mock-001` | `router.push()` với mock sampleId |

---

## 9. Styling Conventions (follow existing)

- Font heading: `Playfair Display` (hiện dùng cho wardrobe header)
- Font mono: `IBM Plex Mono` (existing)
- Color palette: `bg-[#F4F1EE]` (cream), `text-[#111]` (ink), `text-[#A0522D]` (terracotta accent)
- Ghost Item accent: `border-dashed border-[#A0522D]` + shimmer animation
- Border radius: `rounded-none` (toàn app dùng sharp corners)
- Animations: GSAP `fromTo` opacity/y như WardrobeClient

---

## 10. Verification

### Manual Testing Checklist
- [ ] Toggle "Mix with Local Brands" hiển thị đúng trong AI Stylist panel
- [ ] Sau khi generate outfit với toggle ON → có 1 Ghost Item trong kết quả
- [ ] Ghost Item có visual badge khác biệt (border dashed, brand label)
- [ ] Click Ghost Item → WardrobeImpactPanel mở với đủ 6 metrics
- [ ] Các action buttons (Keep, Swap, Save, Waitlist, Hide, Not my style) hoạt động với toast feedback
- [ ] `/brands/digital-sample-lab` render form upload đúng
- [ ] Submit form → navigate đến report page
- [ ] Report page hiển thị đủ: stats, charts, variant comparison, cohorts

### Build Check
```bash
npm run build
```
Không có TypeScript errors hay missing module errors.

---

## 11. Open Questions cho Builder

1. **Brand Portal Access**: Brand route `/brands/*` có cần auth role riêng không, hay demo mode (ai cũng xem được)?
2. **Chart Library**: Project hiện có Recharts không? Nếu không, dùng CSS-only mock charts để tránh thêm dependency.
3. **GhostItem trong Canvas**: `OutfitCanvasBoard` hiện nhận `CanvasItem[]` — có cần extend type này hay wrap ghost item thành compatible shape?
4. **Sidebar Navigation**: Có muốn thêm "Digital Sample Lab" vào sidebar nav (`layout.tsx`) không?
5. **"Saved Ghost Items"**: Lưu vào localStorage hay Zustand store?
