# Quickstart: Hướng dẫn Kiểm chứng Bố cục Canvas Phối đồ Theo Vai trò

**Feature**: `024-ai-stylist-canvas-layout`  
**Date**: 2026-09-26  
**Status**: Completed

---

## 1. Mục đích
Tài liệu này cung cấp các kịch bản kiểm thử độc lập, có thể thực thi nhanh chóng để xác nhận tính chính xác của bố cục canvas dựa trên vai trò (`role`) trả về từ AI Stylist API.

---

## 2. Kịch bản Kiểm chứng Tự động (Unit Tests)

### Lệnh thực thi:
```bash
npm test -- src/features/ai-stylist/utils/outfit-canvas-layout.test.ts
```

### Các ca kiểm thử cần đạt 100% Pass:
1. `normalizeFashionRole()`:
   - Input: `role: "top"` → Output: `'top'`
   - Input: `role: "TOP"` (viết hoa) → Output: `'top'`
   - Input: `role: "áo"` (chuỗi tiếng Việt cũ) → Output: `'top'`
   - Input: `role: ""` kèm `category.slug: "dam"` → Output: `'fullbody'`
2. `resolveCanvasOutfitItems()` với bộ đồ phối rời (`top`, `bottom`, `footwear`):
   - Món `top` có tọa độ $X=0, Y=-140, \text{scale}=100$
   - Món `bottom` có tọa độ $X=0, Y=110, \text{scale}=100$
   - Món `footwear` có tọa độ $X=0, Y=305, \text{scale}=80$
3. `resolveCanvasOutfitItems()` với đầm liền (`fullbody`, `footwear`):
   - Món `fullbody` có tọa độ $X=0, Y=-15, \text{scale}=105$
   - Bất kỳ món `top` hay `bottom` nếu vô tình có trong danh sách đều bị lọc bỏ.
4. `resolveCanvasOutfitItems()` với áo khoác (`outerwear`):
   - Món `outerwear` có $\text{zIndex} > \text{zIndex}(\text{top})$ và tọa độ thân trên thích hợp.
5. `resolveCanvasOutfitItems()` với sản phẩm thương hiệu (Brand / Ghost Items):
   - Sản phẩm mang `role: "outerwear"` vẫn nhận đúng tọa độ vùng áo khoác trên canvas thay vì bị dạt sang $X=280$.
6. `resolveCanvasOutfitItems()` với 2 phụ kiện (`accessory`):
   - Phụ kiện 1 ở cánh trái $X=-240$, Phụ kiện 2 ở cánh phải $X=+240$.
7. `swapCanvasItemByRole()`:
   - Thay thế món mới giữ nguyên tọa độ $X, Y$ và $\text{scale}$ của vị trí đó.

---

## 3. Kịch bản Kiểm chứng Trực quan trên Giao diện (Manual UI Walkthrough)

### Kịch bản 1: Phối đồ đi làm công sở (Top + Bottom + Footwear + Outerwear)
1. **Truy cập**: Đăng nhập và mở màn hình `/ai-stylist`.
2. **Chọn thông số**:
   - Dịp: `Đi làm` (Work)
   - Phong cách: `Thanh lịch` (Elegant)
   - Bấm **"Tạo gợi ý phối đồ"**.
3. **Quan sát Canvas**:
   - Áo sơ mi (`top`) nằm ở thân trên.
   - Quần âu / chân váy (`bottom`) nằm ngay phía dưới áo sơ mi.
   - Giày cao gót / tây (`footwear`) nằm dưới cùng.
   - Áo khoác blazer (`outerwear`) phủ ở lớp trên áo sơ mi, nhìn rõ cổ áo và vạt áo sơ mi bên trong.
   - Không có món nào bị đè chồng lộn xộn tại tâm.

### Kịch bản 2: Phối đồ dự tiệc với Đầm liền thân (Fullbody + Footwear + Accessory)
1. **Chọn thông số**:
   - Dịp: `Dự tiệc` (Party)
   - Chi tiết: `Đầm dạ hội sang trọng`
   - Bấm **"Tạo gợi ý phối đồ"**.
2. **Quan sát Canvas**:
   - Đầm dạ hội (`fullbody`) chiếm vị trí trung tâm trải dài từ ngực xuống gối.
   - Hoàn toàn KHÔNG xuất hiện áo lẻ hay quần lẻ đè lên đầm.
   - Giày dự tiệc (`footwear`) nằm ở dưới chân đầm.
   - Túi xách/clutch (`accessory`) nằm bên hông trái.

### Kịch bản 3: Đổi món thay thế (Swap Alternative)
1. Trên món áo `top`, rê chuột vào món đồ để hiện thanh công cụ điều khiển.
2. Bấm nút **"THAY THẾ"** (`RefreshCcw`).
3. **Quan sát**: Chiếc áo đổi sang kiểu dáng mới ngay tại vị trí cũ, không bị nhảy giật vị trí, không ảnh hưởng đến vị trí của quần hay giày.

### Kịch bản 4: Kéo thả & Thu phóng tùy chỉnh
1. Kéo chiếc túi xách từ cánh trái sang cánh phải.
2. Dùng nút phóng to/thu nhỏ để đổi kích thước món đồ.
3. Bấm **"Lưu bộ phối đồ"**.
4. **Xác nhận**: Ảnh chụp canvas lưu lại chính xác bố cục người dùng đã tùy biến.
