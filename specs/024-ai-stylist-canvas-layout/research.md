# Research & Architecture Decisions: Bố cục Canvas Phối đồ Theo Vai trò Thời trang

**Feature**: `024-ai-stylist-canvas-layout`  
**Date**: 2026-09-26  
**Status**: Completed

---

## 1. Bối cảnh & Vấn đề Cần Giải Quyết

### 1.1 Hiện trạng Lỗi
Trên trang `/ai-stylist`, khi người dùng bấm tạo gợi ý phối đồ từ AI (`aiApi.getOutfitRecommendation`), danh sách món đồ trả về từ endpoint `http://localhost:3000/api/v1/ai/outfit-recommendations` được kết xuất lên `OutfitCanvasBoard` gặp các vấn đề nghiêm trọng:
1. **Lỗi đè chồng ngẫu nhiên**: Logic cũ kiểm tra chuỗi tiếng Việt như `role.includes('áo')`, `role.includes('quần')`, trong khi backend gửi về chuỗi tiếng Anh chuẩn (`role: "top"`, `role: "bottom"`, `role: "fullbody"`, `role: "outerwear"`, `role: "footwear"`, `role: "headwear"`, `role: "accessory"`, `role: "other"`). Khi không khớp, code rơi vào nhánh `else { y = Math.random() * 80 - 40; x = Math.random() * 80 - 40; }`, làm các món đồ đè chồng lên nhau lộn xộn tại tâm canvas.
2. **Cô lập sản phẩm thương hiệu (Brand / Ghost items)**: Logic cũ kiểm tra `if (isBrand) { x = 280; y = brandYOffset; ... }` đã tự động đẩy toàn bộ món đồ thương hiệu đối tác hoặc Ghost Item sang một cột dọc bên phải (`x = 280`), bất kể món đó là áo, đầm hay giày. Điều này phá vỡ cấu trúc phom dáng tổng thể của bộ trang phục.
3. **Thiếu hỗ trợ đầm liền thân (`fullbody`)**: Khi gợi ý trả về `fullbody` (đầm / jumpsuit), frontend không có nhánh xử lý riêng, dẫn đến việc đầm bị rơi vào nhánh fallback ngẫu nhiên.
4. **Xung đột lớp áo khoác (`outerwear`)**: Áo khoác bị gộp chung vào nhánh `ao-` và nhận cùng tọa độ `y = -180`, `zIndex = 3` như áo trong (`top`), che lấp hoặc đè trùng khít lên nhau mà không tạo được hiệu ứng phân tầng (layering).

### 1.2 Nghiệp vụ Backend & Vai trò Chuẩn
Theo tài liệu logic backend (`synthesis/prompt.go` và `recommendation.go`):
- **Cấu trúc bộ trang phục hợp lệ**:
  - Dạng rời: `top` + `bottom` + `footwear`.
  - Dạng liền: `fullbody` + `footwear`.
- **Lớp áo khoác (`outerwear`)**: Mặc layer ngoài, bổ trợ cho cả dạng rời và dạng liền.
- **Phụ kiện & mũ nón (`accessory`, `headwear`, `footwear`)**: Độc lập, không bị ràng buộc luật phối.
- **Ràng buộc loại trừ**: Nếu outfit có `fullbody` thì không có `top` và `bottom`.
- **Duy nhất theo vai trò**: Mỗi vai trò (`role`) xuất hiện tối đa 1 lần trong gợi ý.
- **Bảng ánh xạ vai trò (`role`) và Category Slug nguồn**:
  | Role | Ý nghĩa thời trang | Category slug nguồn |
  | :--- | :--- | :--- |
  | `headwear` | Mũ / nón | `mu` |
  | `top` | Áo (thân trên) | `ao` |
  | `bottom` | Quần / chân váy (thân dưới) | `quan`, `chan-vay` |
  | `fullbody` | Đầm / liền thân / jumpsuit | `dam` |
  | `outerwear` | Áo khoác (mặc layer ngoài) | `ao-khoac` |
  | `footwear` | Giày dép (chân) | `giay` |
  | `accessory` | Phụ kiện (túi, trang sức, thắt lưng, kính) | `phu-kien` |
  | `other` | Không xác định được loại | `default` |

---

## 2. Nghiên cứu Mô hình Bố cục Khung vẽ (Canvas Layout Model)

### 2.1 So sánh Các Phương pháp Sắp đặt (Placement Approaches)

| Tiêu chí | Phương án A: Lưới Cố định (Fixed Grid Bento) | Phương án B: Giải phẫu Ma-nơ-canh Thời trang (Anatomical Fashion Collage - Được chọn) | Phương án C: Vật lý Trọng lực (Physics Simulation) |
| :--- | :--- | :--- | :--- |
| **Mô tả** | Chia canvas thành các ô vuông/chữ nhật cố định (top ở ô 1, bottom ở ô 2). | Sắp đặt theo trục nhân trắc học cơ thể người (đầu -> thân -> chân) kết hợp vệ tinh sườn. | Sử dụng mô phỏng vật lý kéo giãn để các món đẩy nhau không va chạm. |
| **Tính thẩm mỹ thời trang** | Thô cứng, giống danh mục thương mại điện tử hơn là một bộ đồ phối sẵn. | **Rất cao**: Chuẩn phong cách tạp chí thời trang (Polyvore, Lookbook Studio, SSENSE). | Khó kiểm soát, dễ làm vặn vẹo hình ảnh thời trang. |
| **Khả năng tương tác** | Gò bó, người dùng khó hình dung khi mặc lên người. | **Tối ưu**: Người dùng vẫn tự do kéo thả, phóng to thu nhỏ sau khi nạp bố cục chuẩn. | Phức tạp, dễ giật lag trên trình duyệt di động. |
| **Xử lý Đầm liền (`fullbody`)** | Khó xếp vì ô lưới áo/quần bị trống hoặc mất cân đối. | **Linh hoạt**: `fullbody` tự động mở rộng chiếm toàn bộ trục thân trung tâm. | Phức tạp trong việc định nghĩa thể tích va chạm. |
| **Độ phức tạp code** | Trung bình. | **Thấp - Ổn định**: Tính toán tọa độ toán học thuần túy (Pure Function), hiệu năng O(N). | Rất cao, phụ thuộc thư viện ngoài (Matter.js/Rapier). |

**Quyết định**: Chọn **Phương án B (Anatomical Fashion Collage)**. Phương pháp này mô phỏng bố cục ma-nơ-canh kết hợp góc nhìn tạp chí lookbook:
- Trục dọc trung tâm `X = 0`: Dành cho các món trang phục chính định hình phom dáng cơ thể (`headwear` -> `top` / `fullbody` -> `bottom` -> `footwear`).
- Trục phân tầng Z-Index: `footwear` (3) < `bottom` (4) < `top` (5) < `fullbody` (5) < `outerwear` (7) < `headwear` (8) < `accessory` (9).
- Hai cánh vệ tinh `X = ±240px`: Dành cho phụ kiện (`accessory`), túi xách, kính mắt và vật phẩm bổ trợ (`other`).

---

## 3. Chi tiết Tọa độ và Quy chuẩn Tỷ lệ (Coordinates & Scale Specifications)

Khung vẽ `OutfitCanvasBoard` sử dụng hệ trục tọa độ gốc `(0, 0)` tại **tâm chính giữa** của khung hình:
- Trục `X`: Chiều âm sang trái, chiều dương sang phải.
- Trục `Y`: Chiều âm hướng lên trên (đỉnh đầu), chiều dương hướng xuống dưới (chân).

### 3.1 Bố cục Bộ Trang Phục Phối Rời (`top` + `bottom` + `footwear`)

| Role | X (px) | Y (px) | Scale (%) | Z-Index | Ghi chú trực quan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headwear` | `0` | `-330` | `80` | `8` | Đỉnh đầu, cân giữa trục dọc |
| `top` | `0` | `-140` | `100` | `5` | Thân trên (ngực & eo) |
| `outerwear` | `-25` (hoặc `0`) | `-145` | `105` | `7` | Layer ngoài: hơi chếch nhẹ hoặc phủ lên `top`, z-index cao hơn |
| `bottom` | `0` | `110` | `100` | `4` | Thân dưới (hông & chân), nằm dưới gấu áo `top` |
| `footwear` | `0` | `305` | `80` | `3` | Vị trí chân dưới cùng |
| `accessory` (món 1) | `-240` | `40` | `85` | `9` | Cánh trái (thường là túi xách đeo vai/cầm tay ngang hông) |
| `accessory` (món 2+) | `+240` | `-100` | `75` | `9` | Cánh phải (trang sức, kính mắt, đồng hồ đặt ngang thân trên) |
| `other` | `+250` | `180` | `75` | `2` | Vệ tinh góc dưới bên phải |

### 3.2 Bố cục Bộ Trang Phục Liền Thân (`fullbody` + `footwear`)

| Role | X (px) | Y (px) | Scale (%) | Z-Index | Ghi chú trực quan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headwear` | `0` | `-330` | `80` | `8` | Đỉnh đầu |
| `fullbody` | `0` | `-15` | `105` | `5` | Đầm liền thân trải dài từ ngực qua eo xuống gối |
| `outerwear` | `-25` (hoặc `0`) | `-130` | `105` | `7` | Áo khoác ngoài che phủ phần thân trên của đầm |
| `footwear` | `0` | `305` | `80` | `3` | Giày dép dưới chân |
| `accessory` (món 1) | `-240` | `20` | `85` | `9` | Cánh trái ngang eo/hông đầm |
| `accessory` (món 2+) | `+240` | `-90` | `75` | `9` | Cánh phải |
| `other` | `+250` | `170` | `75` | `2` | Vệ tinh lề ngoài |

---

## 4. Xử lý Sản phẩm Thương hiệu (Brand Items & Ghost Items)

### 4.1 Vấn đề Cũ
Trước đây `isBrand` ghi đè tọa độ khiến món đồ bị tách ra cột phụ bên ngoài (`x = 280`).

### 4.2 Giải pháp Chuẩn hóa
1. **Bảo toàn vị trí theo vai trò (`role`)**: Bất kể món đồ là đồ cá nhân trong tủ đồ, đồ từ thương hiệu đối tác (Brand Item) hay đồ thử nghiệm (Ghost Item), vị trí của món đồ trên canvas **hoàn toàn do `role` quyết định**.
2. **Nhận diện trực quan**:
   - Nếu là Ghost Item: Hiển thị `<GhostItemBadge brandName={...} />` ngay trên góc của hình ảnh món đồ.
   - Nếu là Brand Item: Duy trì nút đánh giá `<Star /> ĐÁNH GIÁ` trên thanh điều khiển khi hover và thẻ tên thương hiệu.
   - Giữ tỷ lệ hiển thị cân đối (`scale` tương thích theo vai trò, không bị cưỡng chế thu nhỏ về 80% làm lọt thỏm trong outfit).

---

## 5. Xử lý Hoán đổi Món Thay thế (Swap Alternatives)

Khi người dùng ấn "THAY THẾ" (`onSwap(role)`):
- Thuật toán tìm `outfitItem` theo `item.role`.
- Món đồ thay thế tiếp theo (`allOptions[nextIndex]`) kế thừa:
  - Tọa độ hiện tại `x`, `y` của món đang đứng trên canvas (kể cả khi người dùng đã kéo thả sang vị trí mong muốn).
  - Tỷ lệ `scale` và độ sâu `zIndex` hiện thời.
  - Thuộc tính vai trò `_role`.
- Cập nhật mượt mà không làm rung lắc hay dịch chuyển ngoài ý muốn các món đồ còn lại.

---

## 6. Kết luận & Kiến trúc Module

Chúng ta sẽ tách toàn bộ logic tính toán bố cục thành một module tiện ích độc lập và có unit test đầy đủ:
- **Tệp nguồn mới**: `src/features/ai-stylist/utils/outfit-canvas-layout.ts`
  - Hàm `resolveCanvasItemCoordinates(items: AIOutfitItem[]): CanvasItem[]`: Đầu vào là danh sách gợi ý từ API, tự động nhận diện dạng phối (`hasFullbody` vs `hasTopBottom`), gán tọa độ chuẩn, phân phối phụ kiện hai bên cánh và xuất ra mảng `CanvasItem` hoàn chỉnh.
  - Hàm `normalizeFashionRole(role?: string, categorySlug?: string): FashionRole`: Chuẩn hóa chuỗi role từ API/danh mục (loại bỏ nhầm lẫn hoa thường, khoảng trắng, fallback về slug danh mục nếu role rỗng).
- **Cập nhật component**: `AIStylistClient.tsx` chuyển sang gọi hàm `resolveCanvasItemCoordinates` thay cho khối mã gán tọa độ thủ công rải rác hiện tại.
