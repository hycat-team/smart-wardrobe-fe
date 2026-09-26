# Implementation Tasks: Bố cục Canvas Phối đồ Theo Vai trò Thời trang (Role-Based Outfit Canvas Layout)

**Feature**: `024-ai-stylist-canvas-layout`  
**Date**: 2026-09-26  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Chuẩn bị kiểu dữ liệu hệ thống và cấu trúc dữ liệu nền tảng cho vai trò thời trang

- [X] T001 Khai báo kiểu `FashionRole`, `OutfitCompositionType` và cập nhật mở rộng kiểu `AIOutfitItem` trong `src/features/ai-stylist/types/index.ts`
- [X] T002 [P] Cập nhật giao diện `CanvasItem` để đồng bộ trường `_role: FashionRole` trong `src/features/outfits/hooks/useOutfitCanvas.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Xây dựng module tiện ích cốt lõi tính toán bố cục canvas và bộ khung kiểm thử

**⚠️ CRITICAL**: Phải hoàn thành giai đoạn này trước khi tích hợp vào giao diện người dùng

- [X] T003 [P] Khởi tạo bộ khung tiện ích `src/features/ai-stylist/utils/outfit-canvas-layout.ts` chứa bảng hằng số tọa độ giải phẫu và hàm chuẩn hóa vai trò `normalizeFashionRole`
- [X] T004 [P] Viết khung kiểm thử đơn vị `src/features/ai-stylist/utils/outfit-canvas-layout.test.ts` kiểm tra tính chính xác của hàm chuẩn hóa vai trò và phát hiện cấu trúc phối đồ

**Checkpoint**: Nền tảng tiện ích sẵn sàng — việc triển khai các User Story có thể tiến hành độc lập

---

## Phase 3: User Story 1 - Hiển thị bộ phối đồ trực quan trên Canvas theo giải phẫu thời trang chuẩn (Priority: P1) 🎯 MVP

**Goal**: Đảm bảo bộ đồ phối dạng rời (`top` + `bottom` + `footwear`) và dạng liền thân (`fullbody` + `footwear`) xuất hiện tự động trên canvas đúng trật tự giải phẫu thời trang, loại trừ hoàn toàn việc đè chồng lộn xộn tại tâm canvas.

**Independent Test**: Kích hoạt AI gợi ý trang phục với cả 2 kịch bản (bộ phối rời và bộ đầm liền), xác nhận các món xuất hiện đúng vị trí tương ứng trên trục dọc trung tâm, đầm liền không bị trùng áo hay quần.

### Tests cho User Story 1
- [X] T005 [P] [US1] Viết unit tests cho hàm `resolveCanvasOutfitItems` kiểm tra bố cục dạng rời (`top` tại $Y=-140$, `bottom` tại $Y=110$, `footwear` tại $Y=305$) và dạng liền (`fullbody` tại $Y=-15$, `footwear` tại $Y=305$, loại trừ `top`/`bottom`) trong `src/features/ai-stylist/utils/outfit-canvas-layout.test.ts`

### Triển khai cho User Story 1
- [X] T006 [US1] Cài đặt hàm `detectCompositionType` và thuật toán định vị trục đứng chính `resolveCanvasOutfitItems` trong `src/features/ai-stylist/utils/outfit-canvas-layout.ts`
- [X] T007 [US1] Tích hợp hàm `resolveCanvasOutfitItems` vào `src/app/(user)/ai-stylist/components/AIStylistClient.tsx` thay thế khối mã gán tọa độ ngẫu nhiên cũ cho các món đồ chính

**Checkpoint**: Hoàn thành MVP — Bố cục cơ bản của toàn bộ các gợi ý AI Stylist hiển thị chuẩn giải phẫu trên canvas.

---

## Phase 4: User Story 2 - Phối lớp áo khoác ngoài (Outerwear Layering) có chiều sâu thị giác (Priority: P2)

**Goal**: Định vị áo khoác ngoài (`outerwear`) phủ ở lớp trên (`zIndex = 7`) với vị trí bao quát thân trên ($X=-25, Y=-145$), tạo hiệu ứng phân tầng rõ rệt mà không che lấp áo trong (`top`) hoặc đầm (`fullbody`).

**Independent Test**: Kích hoạt gợi ý trang phục có áo khoác ngoài, kiểm tra trên canvas thấy áo khoác hiển thị ở lớp trên và người dùng nhìn thấy rõ cả hai lớp áo.

### Tests cho User Story 2
- [X] T008 [P] [US2] Viết unit tests kiểm tra phân tầng đa lớp cho `outerwear` khi kết hợp cùng `top` và `fullbody` (xác nhận $\text{zIndex}(\text{outerwear}) > \text{zIndex}(\text{top})$) trong `src/features/ai-stylist/utils/outfit-canvas-layout.test.ts`

### Triển khai cho User Story 2
- [X] T009 [US2] Cài đặt logic định vị không gian và thứ tự phân tầng Z-index ưu tiên cho `outerwear` trong `src/features/ai-stylist/utils/outfit-canvas-layout.ts`
- [X] T010 [US2] Cập nhật giao diện và lớp hiển thị áo khoác trong `src/app/(user)/ai-stylist/components/AIStylistClient.tsx`

**Checkpoint**: Đạt chuẩn hiển thị đa tầng trang phục cho các bộ đồ mùa đông và phong cách thanh lịch.

---

## Phase 5: User Story 3 - Định vị phụ kiện độc lập (Headwear, Accessory) làm điểm nhấn tinh tế (Priority: P2)

**Goal**: Mũ nón (`headwear`) nằm ở đỉnh đầu ($X=0, Y=-330$), phụ kiện (`accessory`) xếp so le hai bên sườn ($X=\pm 240$), tạo điểm nhấn lookbook hài hòa không che lấp trang phục chính.

**Independent Test**: Gợi ý trang phục có mũ và nhiều phụ kiện, xác nhận mũ nón ở vị trí trên cùng và các phụ kiện phân bổ cân xứng sang hai cánh trái/phải.

### Tests cho User Story 3
- [X] T011 [P] [US3] Viết unit tests kiểm tra phân phối mũ nón lên đỉnh đầu và phân chia đa phụ kiện so le sang hai cánh sườn trong `src/features/ai-stylist/utils/outfit-canvas-layout.test.ts`

### Triển khai cho User Story 3
- [X] T012 [US3] Cài đặt thuật toán phân bổ phụ kiện so le và định vị đỉnh đầu cho `headwear` trong `src/features/ai-stylist/utils/outfit-canvas-layout.ts`
- [X] T013 [US3] Tích hợp phân bổ phụ kiện hai bên cánh vào danh sách khởi tạo canvas trong `src/app/(user)/ai-stylist/components/AIStylistClient.tsx`

**Checkpoint**: Bộ lookbook hoàn thiện với đầy đủ mũ nón và phụ kiện phụ trợ.

---

## Phase 6: User Story 4 - Hoán đổi món thay thế (Swap) và tương tác tự do bảo toàn vai trò thời trang (Priority: P3)

**Goal**: Khi người dùng ấn nút "THAY THẾ" (`Swap`), món đồ mới kế thừa chính xác tọa độ $(X, Y)$ và tỷ lệ kích thước của vị trí đang hiển thị; thao tác kéo thả và thu phóng bảo toàn thuộc tính vai trò `_role`.

**Independent Test**: Bấm đổi món áo hoặc quần nhiều lần, xác nhận món thay thế xuất hiện chuẩn xác tại vị trí của món cũ; kéo thả vị trí rồi lưu bộ đồ thành công.

### Tests cho User Story 4
- [X] T014 [P] [US4] Viết unit tests cho hàm `swapCanvasItemByRole` bảo đảm giữ nguyên tọa độ, kích thước và vai trò thời trang trong `src/features/ai-stylist/utils/outfit-canvas-layout.test.ts`

### Triển khai cho User Story 4
- [X] T015 [US4] Cài đặt hàm `swapCanvasItemByRole` trong `src/features/ai-stylist/utils/outfit-canvas-layout.ts`
- [X] T016 [US4] Cập nhật hàm `handleSwap` trong `src/app/(user)/ai-stylist/components/AIStylistClient.tsx` sử dụng `swapCanvasItemByRole`

**Checkpoint**: Người dùng tương tác hoán đổi món đồ mượt mà và trực quan.

---

## Phase 7: User Story 5 - Hiển thị hài hòa món đồ thương hiệu đối tác trong cấu trúc bộ đồ (Priority: P3)

**Goal**: Món đồ thương hiệu đối tác (Brand Items) và Ghost Items được định vị vào đúng vị trí vai trò thời trang trong bộ đồ, mang theo huy hiệu nhận diện, loại bỏ triệt để logic cũ ép dạt sản phẩm sang cột ngoài $X=280$.

**Independent Test**: Kích hoạt đề xuất có sản phẩm thương hiệu hoặc bật tính năng Ghost Closet, xác nhận sản phẩm thương hiệu nằm đúng vị trí trong bộ đồ kèm huy hiệu rõ ràng.

### Tests cho User Story 5
- [X] T017 [P] [US5] Viết unit tests kiểm tra tích hợp Brand/Ghost Item tuân thủ đúng vai trò thời trang trong `src/features/ai-stylist/utils/outfit-canvas-layout.test.ts`

### Triển khai cho User Story 5
- [X] T018 [US5] Cập nhật logic nạp metadata thương hiệu trong `src/app/(user)/ai-stylist/components/AIStylistClient.tsx` gỡ bỏ hoàn toàn việc ép dạt $X=280$
- [X] T019 [US5] Kiểm tra và xác nhận các nút tương tác Đánh giá và GhostItemBadge hiển thị chính xác trên `src/features/outfits/components/OutfitCanvasBoard.tsx`

**Checkpoint**: Bộ phối đồ kết hợp hài hòa giữa đồ trong tủ cá nhân và đồ gợi ý thương hiệu đối tác.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Đảm bảo chất lượng toàn diện, hiệu năng và độ ổn định

- [X] T020 [P] Chạy toàn bộ bộ kiểm thử tự động `npm test -- src/features/ai-stylist/utils/outfit-canvas-layout.test.ts` đạt 100% pass
- [X] T021 Thực hiện kiểm thử thủ công theo 4 kịch bản giao diện trong `specs/024-ai-stylist-canvas-layout/quickstart.md`
- [X] T022 [P] Dọn dẹp mã nguồn thừa và đồng bộ hóa logic fallback trong `src/features/outfits/hooks/useOutfitCanvas.ts`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Bắt đầu ngay lập tức, không phụ thuộc.
- **Foundational (Phase 2)**: Phụ thuộc vào Phase 1; KHÓA các Phase User Story phía sau.
- **User Story 1 (Phase 3 - MVP)**: Phụ thuộc vào Phase 2.
- **User Story 2 (Phase 4)**: Phụ thuộc vào Phase 2; có thể chạy song song hoặc sau US1.
- **User Story 3 (Phase 5)**: Phụ thuộc vào Phase 2; có thể chạy song song hoặc sau US1.
- **User Story 4 (Phase 6)**: Phụ thuộc vào US1 (cần hoàn thiện hàm dàn trang trước khi tích hợp swap).
- **User Story 5 (Phase 7)**: Phụ thuộc vào US1 và US2.
- **Polish (Phase 8)**: Phụ thuộc vào tất cả các User Stories hoàn thành.

### Parallel Opportunities
- Các task có đánh dấu `[P]` (khác tệp hoặc không phụ thuộc) có thể chạy song song:
  - Phase 1: `T002` song song với `T001`.
  - Phase 2: `T003` và `T004` có thể chuẩn bị song song.
  - Các task unit test (`T005`, `T008`, `T011`, `T014`, `T017`) có thể viết song song với nhau.
  - Phase 8: `T020` và `T022` có thể chạy song song.

---

## Parallel Example: User Story 1 & 2

```bash
# Developer 1 triển khai User Story 1 (Trang phục chính):
Task: T005 [P] [US1] Unit tests cho bố cục dạng rời và liền
Task: T006 [US1] Cài đặt detectCompositionType và resolveCanvasOutfitItems
Task: T007 [US1] Tích hợp vào AIStylistClient.tsx

# Developer 2 triển khai User Story 2 (Lớp áo khoác):
Task: T008 [P] [US2] Unit tests cho phân tầng outerwear
Task: T009 [US2] Định vị Z-index outerwear
Task: T010 [US2] Cập nhật UI áo khoác
```

---

## Implementation Strategy

### MVP First (User Story 1)
1. Hoàn thành Phase 1 (Setup) và Phase 2 (Foundational).
2. Triển khai Phase 3 (User Story 1).
3. **DỪNG LẠI & KIỂM CHỨNG**: Chạy thử gợi ý đồ cơ bản trên trang `/ai-stylist` để xác nhận áo, quần, đầm, giày không còn bị đè chồng lộn xộn.
4. Đạt mốc MVP!

### Incremental Delivery
1. Đã có MVP cơ bản.
2. Thêm Phase 4 (Outerwear Layering) → Kiểm thử áo khoác ngoài phủ đẹp mắt.
3. Thêm Phase 5 (Phụ kiện & Mũ nón) → Kiểm thử lookbook hoàn chỉnh hai bên sườn.
4. Thêm Phase 6 (Hoán đổi Swap) → Kiểm thử trải nghiệm tương tác mix & match.
5. Thêm Phase 7 (Sản phẩm Thương hiệu) → Kiểm thử hòa nhập Brand/Ghost items.
6. Phase 8 (Polish) → Hoàn thiện và nghiệm thu toàn diện.
