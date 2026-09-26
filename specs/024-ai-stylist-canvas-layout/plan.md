# Implementation Plan: Bố cục Canvas Phối đồ Theo Vai trò Thời trang (Role-Based Outfit Canvas Layout)

**Branch**: `024-ai-stylist-canvas-layout` | **Date**: 2026-09-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/024-ai-stylist-canvas-layout/spec.md` and Backend Outfit Recommendation Engine Guidelines

---

## Summary

Khắc phục hoàn toàn lỗi hiển thị lộn xộn các món đồ thời trang trên khung vẽ canvas (`OutfitCanvasBoard`) của tính năng AI Stylist (`/ai-stylist`). 
Thay vì sử dụng các phép kiểm tra chuỗi tiếng Việt thiếu chính xác hoặc ép buộc món đồ thương hiệu dạt sang một cột phụ bên phải (`x = 280`), giải pháp xây dựng một **Engine Định vị Giải phẫu Thời trang (Anatomical Fashion Layout Engine)** dựa trên trường `role` chuẩn từ endpoint `POST /api/v1/ai/outfit-recommendations` (bao gồm 8 vai trò: `headwear`, `top`, `bottom`, `fullbody`, `outerwear`, `footwear`, `accessory`, `other`).

Hệ thống tự động phát hiện cấu trúc trang phục (`SEPARATE_PIECES` gồm áo + quần + giày vs `FULLBODY` gồm đầm liền + giày), áp dụng quy tắc loại trừ `fullbody` với `top`/`bottom`, phân tầng độ sâu (`zIndex`) đa lớp cho áo khoác ngoài (`outerwear`), phân bổ phụ kiện (`accessory`) hai bên sườn cân đối, và bảo toàn toàn vẹn vị trí khi người dùng thực hiện thao tác đổi món thay thế (`Swap alternative`) hoặc kéo thả tùy biến.

---

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15 (App Router), React 19  
**Primary Dependencies**: `framer-motion` (kéo thả và hiệu ứng chuyển động), `lucide-react`, `sonner` (thông báo), `html-to-image` (chụp lưu outfit)  
**Storage**: Trạng thái bộ phối cục bộ React state (`selectedItems`), API lưu outfit backend (`POST /api/v1/outfits`)  
**Testing**: Jest / React Testing Library (`npm test`) với các ca kiểm thử unit test cho engine bố cục canvas  
**Target Platform**: Trình duyệt Web (Chrome, Safari, Firefox, Edge) trên cả màn hình máy tính và thiết bị di động  
**Project Type**: Next.js App Router Web Application  
**Performance Goals**: Thời gian tính toán và dàn trang canvas < 16ms (60fps); thời gian hoán đổi món (`Swap`) < 50ms không gây giật khung hình  
**Constraints**: Bảo đảm tính thẩm mỹ thời trang cao; mỗi role chính chỉ xuất hiện tối đa 1 lần; không phụ thuộc thư viện mô phỏng vật lý cồng kềnh; tương thích hoàn toàn với các tính năng Brand Item và Ghost Closet hiện có  
**Scale/Scope**: Toàn bộ luồng gợi ý trang phục AI Stylist và studio phối đồ của ứng dụng Closy  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Library & Pure Function Decoupling**: PASS — Logic tính toán tọa độ được tách biệt thành module hàm thuần túy (Pure Function) `outfit-canvas-layout.ts`, nhận dữ liệu mảng và trả về mảng tọa độ, độc lập với vòng đời giao diện và dễ dàng kiểm thử tự động.
- **Contract & Type Integrity**: PASS — Định nghĩa đầy đủ kiểu `FashionRole`, cấu trúc hợp đồng fallback, và bảng phân phối tọa độ tại `data-model.md` và `contracts/canvas-layout-contract.md`.
- **Fashion Anatomy & UX Standards**: PASS — Tuân thủ trật tự giải phẫu thời trang (mũ ở đỉnh đầu, áo/đầm ở thân trên, quần ở thân dưới, giày ở đáy chân, phụ kiện hai bên sườn, áo khoác phủ ngoài).
- **Test-First & Verifiability**: PASS — Xây dựng đầy đủ tài liệu kịch bản kiểm chứng tự động và thủ công tại `quickstart.md`.

---

## Project Structure

### Documentation (this feature)

```text
specs/024-ai-stylist-canvas-layout/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Architecture decisions & coordinate specifications
├── data-model.md        # Fashion roles, layout config & state transitions
├── quickstart.md        # Automated & manual validation scenarios
├── contracts/
│   └── canvas-layout-contract.md # API response to canvas item contracts
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository layout)

```text
src/
├── features/
│   ├── ai-stylist/
│   │   ├── types/
│   │   │   └── index.ts                     # Khai báo FashionRole & mở rộng AIOutfitItem
│   │   └── utils/
│   │       ├── outfit-canvas-layout.ts      # [NEW] Engine tính toán tọa độ giải phẫu & phân lớp
│   │       ├── outfit-canvas-layout.test.ts # [NEW] Unit tests kiểm thử 100% các ca phối đồ
│   │       └── brand-item-canvas.ts         # Giữ nguyên helper metadata sản phẩm thương hiệu
│   └── outfits/
│       ├── components/
│       │   └── OutfitCanvasBoard.tsx        # Khung vẽ canvas kéo thả và hiển thị huy hiệu
│       └── hooks/
│           └── useOutfitCanvas.ts           # Cập nhật CanvasItem type tương thích
└── app/
    └── (user)/
        └── ai-stylist/
            └── components/
                └── AIStylistClient.tsx      # Tích hợp resolveCanvasOutfitItems & hoán đổi Swap
```

---

## Phases & Deliverables

### Phase 0: Outline & Research *(Completed)*
- Phân tích mã nguồn backend (`prompt.go`, `recommendation.go`) và nguyên nhân gây lỗi hiển thị lộn xộn.
- Nghiên cứu so sánh 3 phương án sắp đặt: Lưới cố định (Fixed Grid) vs Giải phẫu thời trang (Anatomical Collage) vs Vật lý (Physics). Quyết định chọn Giải phẫu thời trang.
- Xác định bảng tọa độ ($X, Y$), tỷ lệ ($\text{scale}$) và thứ tự phân tầng ($\text{zIndex}$) cho từng vai trò trong 2 kiểu cấu trúc phối: `SEPARATE_PIECES` và `FULLBODY`.
- Loại bỏ logic cô lập Brand Item sang $X=280$; hòa nhập sản phẩm thương hiệu vào đúng vị trí vai trò thời trang.
- **Tài liệu bàn giao**: [research.md](./research.md)

### Phase 1: Design & Contracts *(Completed)*
- Xây dựng mô hình dữ liệu, kiểu TypeScript và sơ đồ vòng đời trạng thái: [data-model.md](./data-model.md)
- Thiết lập hợp đồng giao tiếp giữa API Backend và Canvas Layout Engine: [contracts/canvas-layout-contract.md](./contracts/canvas-layout-contract.md)
- Xây dựng hướng dẫn kiểm chứng nhanh tự động và thủ công: [quickstart.md](./quickstart.md)
- Hoàn thiện kế hoạch thực thi chi tiết: [plan.md](./plan.md)

### Phase 2: Implementation Breakdown *(Sẽ được cụ thể hóa thành tasks.md bởi lệnh `/speckit-tasks`)*
1. **Khởi tạo Module Tiện ích Bố cục Canvas (`outfit-canvas-layout.ts`)**:
   - Viết hàm `normalizeFashionRole(rawRole, categorySlug)`.
   - Viết hàm `detectCompositionType(items)`.
   - Viết hàm `resolveCanvasOutfitItems(items)` tính toán tọa độ giải phẫu, Z-index và phân bổ phụ kiện hai bên sườn.
   - Viết hàm `swapCanvasItemByRole(currentItems, role, nextProduct, itemContext)`.
2. **Kiểm thử Đơn vị (Unit Tests - `outfit-canvas-layout.test.ts`)**:
   - Viết kiểm thử cho các ca phối đồ: rời (`top` + `bottom` + `footwear`), liền (`fullbody` + `footwear`), áo khoác (`outerwear`), đa phụ kiện, sản phẩm thương hiệu, và hoán đổi món.
3. **Tích hợp vào Giao diện `AIStylistClient.tsx`**:
   - Thay thế khối mã gán tọa độ thủ công cũ (dòng 86-184) bằng lệnh gọi `resolveCanvasOutfitItems(res.items)`.
   - Cập nhật hàm `handleSwap(role)` sử dụng `swapCanvasItemByRole` để kế thừa mượt mà vị trí hiện thời.
4. **Kiểm thử Trực quan & Hoàn thiện**:
   - Chạy kiểm thử tự động `npm test`.
   - Kiểm thử thực tế trên trình duyệt với các phong cách phối đồ khác nhau.
