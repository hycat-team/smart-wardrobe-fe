# Contract: Bố cục Canvas Phối đồ Theo Vai trò Thời trang

**Feature**: `024-ai-stylist-canvas-layout`  
**Date**: 2026-09-26  
**Status**: Completed

---

## 1. Hợp đồng Dữ liệu Đầu vào từ Backend API

### 1.1 Endpoint
- **URL**: `POST /api/v1/ai/outfit-recommendations`
- **Tài liệu tham chiếu**: `synthesis/prompt.go` và `recommendation.go`

### 1.2 Cấu trúc Phản hồi (JSON Schema Snippet)

```typescript
export interface AIOutfitRecommendationRes {
  title: string;
  explanation: string;
  isFallback: boolean;
  remainingQuota: number;
  items: AIOutfitItem[];
}

export interface AIOutfitItem {
  /**
   * Định danh vai trò thời trang chuẩn từ Backend:
   * 'headwear' | 'top' | 'bottom' | 'fullbody' | 'outerwear' | 'footwear' | 'accessory' | 'other'
   */
  role: string;
  itemContext?: 'brand_item' | 'wardrobe_item' | string;
  primary: AIOutfitProduct;
  alternatives: AIOutfitProduct[];
}

export interface AIOutfitProduct {
  id: string;
  fashionItemId?: string;
  name?: string;
  description?: string;
  price?: number;
  brandId?: string;
  brandName?: string;
  brandItemId?: string;
  itemContext?: string;
  fashionItem?: {
    id: string;
    imageUrl?: string;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
    color?: string;
    material?: string;
    style?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brandItem?: {
    id: string;
    brandId: string;
    brandName?: string;
    itemType?: string;
    name?: string;
    price?: number;
  };
  isGhost?: boolean;
}
```

---

## 2. Bảng Quy chuẩn Ánh xạ Vai trò & Cơ chế Dự phòng (Role Fallback Contract)

Khi giá trị `role` từ backend hợp lệ, hệ thống sử dụng trực tiếp. Nếu trường `role` bị khuyết thiếu hoặc không chuẩn hóa, hệ thống dựa vào `category.slug` theo bảng hợp đồng sau:

| Priority | Backend `role` (Chuẩn) | Slug Fallback (`category.slug`) | Phân loại Chuẩn (`FashionRole`) | Vị trí Mặc định trên Canvas |
| :---: | :--- | :--- | :--- | :--- |
| 1 | `headwear` | `mu`, `non`, `hat`, `cap` | `headwear` | Trục giữa đỉnh đầu ($X=0, Y=-330$) |
| 2 | `fullbody` | `dam`, `vay-lien`, `jumpsuit`, `dress` | `fullbody` | Trục giữa thân liền ($X=0, Y=-15$) |
| 3 | `top` | `ao`, `ao-thun`, `ao-so-mi`, `shirt` | `top` | Trục giữa thân trên ($X=0, Y=-140$) |
| 4 | `outerwear` | `ao-khoac`, `blazer`, `cardigan`, `jacket` | `outerwear` | Lớp ngoài thân trên ($X=-25, Y=-145$) |
| 5 | `bottom` | `quan`, `chan-vay`, `quan-jean`, `pants`, `skirt` | `bottom` | Trục giữa thân dưới ($X=0, Y=110$) |
| 6 | `footwear` | `giay`, `giay-sneaker`, `giay-cao-got`, `shoes` | `footwear` | Trục giữa đáy chân ($X=0, Y=305$) |
| 7 | `accessory` | `phu-kien`, `tui-xach`, `kinh`, `bag`, `accessory` | `accessory` | Cánh sườn vệ tinh ($X=\pm 240, Y=40$) |
| 8 | `other` hoặc khác | Bất kỳ slug nào khác | `other` | Góc ngoại vi ($X=250, Y=180$) |

---

## 3. Giao diện Module Tiện ích Bố cục Canvas (Canvas Layout API Contract)

```typescript
/**
 * src/features/ai-stylist/utils/outfit-canvas-layout.ts
 */

/**
 * Chuẩn hóa chuỗi role từ API về FashionRole hợp lệ
 */
export function normalizeFashionRole(
  rawRole?: string,
  categorySlug?: string
): FashionRole;

/**
 * Chuyển đổi danh sách AIOutfitItem nhận từ API thành mảng CanvasItem
 * đã được sắp xếp tọa độ thẩm mỹ theo giải phẫu thời trang
 */
export function resolveCanvasOutfitItems(
  items: AIOutfitItem[]
): CanvasItem[];

/**
 * Cập nhật món thay thế khi người dùng ấn nút Swap,
 * kế thừa toàn vẹn vị trí và kích thước của món cũ trên canvas
 */
export function swapCanvasItemByRole(
  currentItems: CanvasItem[],
  role: string,
  nextProduct: AIOutfitProduct,
  itemContext?: string
): CanvasItem[];
```

---

## 4. Hợp đồng Tương tác Bàn phối (`OutfitCanvasBoard` Props)

```typescript
export interface OutfitCanvasBoardProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  selectedItems: CanvasItem[];
  updateScale: (id: string, newScale: number) => void;
  bringToFront: (id: string) => void;
  removeItem: (id: string) => void;
  handleDragEnd: (id: string, info: any) => void;
  onSwap?: (role: string) => void;
  emptyState?: React.ReactNode;
  hasAlternativesCheck?: (role: string) => boolean;
  onGhostItemClick?: (item: CanvasItem) => void;
  onBrandItemFeedbackClick?: (item: CanvasItem) => void;
}
```

### 4.1 Quy tắc Hành vi Giao diện
1. **Không dịch chuyển khi Render lại**: Việc thay đổi món đồ qua `onSwap` chỉ thay thế thông tin ảnh và định danh sản phẩm của vị trí đó; tuyệt đối không kích hoạt lại hàm random hay đặt lại tọa độ gốc của các món đồ khác.
2. **Kéo thả tự do không làm gãy Role**: Khi người dùng kéo thả (`handleDragEnd`), trường `_role` vẫn được giữ nguyên để phục vụ cho tính năng hoán đổi món tiếp theo.
