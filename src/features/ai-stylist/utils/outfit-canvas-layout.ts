import type {
  AIOutfitItem,
  AIOutfitProduct,
  FashionRole,
  OutfitCompositionType,
} from "@/features/ai-stylist/types";
import type { CanvasItem } from "@/features/outfits/hooks/useOutfitCanvas";
import { getBrandItemCanvasMetadata } from "./brand-item-canvas";

export interface RolePlacement {
  x: number;
  y: number;
  scale: number;
  zIndex: number;
}

/**
 * Bố cục giải phẫu chuẩn cho trang phục dạng rời (top + bottom + footwear)
 * Gốc tọa độ (0, 0) tại tâm canvas
 */
export const ROLE_COORDINATES_SEPARATE: Record<FashionRole, RolePlacement> = {
  headwear: { x: 0, y: -330, scale: 80, zIndex: 8 },
  top: { x: 0, y: -140, scale: 100, zIndex: 5 },
  outerwear: { x: -25, y: -145, scale: 105, zIndex: 7 },
  bottom: { x: 0, y: 110, scale: 100, zIndex: 4 },
  footwear: { x: 0, y: 295, scale: 80, zIndex: 3 },
  accessory: { x: -240, y: 40, scale: 85, zIndex: 9 },
  other: { x: 250, y: 180, scale: 75, zIndex: 2 },
  fullbody: { x: 0, y: -15, scale: 105, zIndex: 5 }, // Fallback dự phòng
};

/**
 * Bố cục giải phẫu chuẩn cho trang phục liền thân (fullbody + footwear)
 */
export const ROLE_COORDINATES_FULLBODY: Record<FashionRole, RolePlacement> = {
  headwear: { x: 0, y: -330, scale: 80, zIndex: 8 },
  fullbody: { x: 0, y: -15, scale: 105, zIndex: 5 },
  outerwear: { x: -25, y: -130, scale: 105, zIndex: 7 },
  top: { x: 0, y: -140, scale: 100, zIndex: 5 }, // Fallback dự phòng
  bottom: { x: 0, y: 110, scale: 100, zIndex: 4 }, // Fallback dự phòng
  footwear: { x: 0, y: 295, scale: 80, zIndex: 3 },
  accessory: { x: -240, y: 20, scale: 85, zIndex: 9 },
  other: { x: 250, y: 170, scale: 75, zIndex: 2 },
};

/**
 * Tọa độ bổ sung dành cho phụ kiện thứ 2 trở lên (phân bổ so le sang cánh phải)
 */
export const SECONDARY_ACCESSORY_COORDINATES: RolePlacement[] = [
  { x: 240, y: -100, scale: 75, zIndex: 9 }, // Phụ kiện 2: cánh phải trên (kính mắt, trang sức)
  { x: 240, y: 80, scale: 75, zIndex: 9 },  // Phụ kiện 3: cánh phải dưới
  { x: -240, y: -120, scale: 75, zIndex: 9 }, // Phụ kiện 4: cánh trái trên
];

export interface RoleBoundingBox {
  width: number;
  height: number;
}

/**
 * Tỉ lệ khung hình giới hạn chuẩn theo từng vai trò trang phục (tọa độ giải phẫu cơ thể)
 * Giúp các món đồ có tỷ lệ hiển thị cân đối, ngăn việc các item dọc (như quần dài) bị kéo dãn quá mức
 * hoặc giày dép bị thu nhỏ quá mức so với tổng thể bộ đồ.
 */
export const ROLE_BOUNDING_BOX_RATIOS: Record<
  FashionRole,
  { widthRatio: number; heightRatio: number }
> = {
  headwear: { widthRatio: 1.8, heightRatio: 1.4 },   // ~144x112px tại scale 80
  top: { widthRatio: 2.1, heightRatio: 2.1 },        // ~210x210px tại scale 100
  outerwear: { widthRatio: 2.3, heightRatio: 2.3 },  // ~242x242px tại scale 105
  bottom: { widthRatio: 1.9, heightRatio: 2.3 },     // ~190x230px tại scale 100
  fullbody: { widthRatio: 2.1, heightRatio: 3.2 },   // ~221x336px tại scale 105
  footwear: { widthRatio: 1.8, heightRatio: 1.3 },   // ~144x104px tại scale 80
  accessory: { widthRatio: 1.6, heightRatio: 1.6 },  // ~136x136px tại scale 85
  other: { widthRatio: 2.0, heightRatio: 2.0 },      // ~150x150px tại scale 75
};

/**
 * Tính toán kích thước hộp bao (bounding box) giới hạn cho món đồ theo vai trò và scale
 */
export function getItemBoundingBox(
  role?: string,
  scale: number = 100,
  categorySlug?: string
): RoleBoundingBox {
  const normRole = normalizeFashionRole(role, categorySlug);
  const ratio = ROLE_BOUNDING_BOX_RATIOS[normRole] || {
    widthRatio: 2.0,
    heightRatio: 2.0,
  };
  return {
    width: Math.round(scale * ratio.widthRatio),
    height: Math.round(scale * ratio.heightRatio),
  };
}

/**
 * Chuẩn hóa chuỗi vai trò từ API hoặc danh mục về FashionRole chuẩn
 */
export function normalizeFashionRole(
  rawRole?: string,
  categorySlug?: string
): FashionRole {
  const roleStr = (rawRole || "").trim().toLowerCase();

  // Khớp chính xác hoặc khớp từ khóa đặc trưng cho vai trò
  if (
    roleStr === "headwear" ||
    roleStr === "mu" ||
    roleStr === "non" ||
    roleStr.includes("mũ") ||
    roleStr.includes("nón") ||
    roleStr.includes("hat") ||
    roleStr.includes("cap")
  ) {
    return "headwear";
  }

  if (
    roleStr === "fullbody" ||
    roleStr === "dam" ||
    roleStr.includes("đầm") ||
    roleStr.includes("liền") ||
    roleStr.includes("dress") ||
    roleStr.includes("jumpsuit")
  ) {
    return "fullbody";
  }

  if (
    roleStr === "outerwear" ||
    roleStr.includes("khoác") ||
    roleStr.includes("jacket") ||
    roleStr.includes("blazer") ||
    roleStr.includes("coat") ||
    roleStr.includes("cardigan")
  ) {
    return "outerwear";
  }

  if (
    roleStr === "top" ||
    roleStr.includes("áo") ||
    roleStr.includes("top") ||
    roleStr.includes("shirt")
  ) {
    return "top";
  }

  if (
    roleStr === "bottom" ||
    roleStr.includes("quần") ||
    roleStr.includes("váy") ||
    roleStr.includes("pants") ||
    roleStr.includes("skirt")
  ) {
    return "bottom";
  }

  if (
    roleStr === "footwear" ||
    roleStr.includes("giày") ||
    roleStr.includes("dép") ||
    roleStr.includes("shoes") ||
    roleStr.includes("footwear") ||
    roleStr.includes("sneaker")
  ) {
    return "footwear";
  }

  if (
    roleStr === "accessory" ||
    roleStr.includes("phụ kiện") ||
    roleStr.includes("phu-kien") ||
    roleStr.includes("túi") ||
    roleStr.includes("bag") ||
    roleStr.includes("accessory") ||
    roleStr.includes("kính") ||
    roleStr.includes("glasses")
  ) {
    return "accessory";
  }

  if (roleStr === "other") {
    return "other";
  }

  // Fallback dựa vào category slug nếu rawRole rỗng hoặc không khớp
  const slug = (categorySlug || "").trim().toLowerCase();
  if (slug === "mu" || slug === "non" || slug.includes("hat") || slug.includes("cap")) {
    return "headwear";
  }
  if (slug === "dam" || slug.includes("dress") || slug.includes("jumpsuit") || slug.includes("vay-lien")) {
    return "fullbody";
  }
  if (
    slug === "ao-khoac" ||
    slug.includes("jacket") ||
    slug.includes("blazer") ||
    slug.includes("coat") ||
    slug.includes("cardigan")
  ) {
    return "outerwear";
  }
  if (slug === "ao" || slug.startsWith("ao-") || slug.includes("top") || slug.includes("shirt")) {
    return "top";
  }
  if (
    slug === "quan" ||
    slug === "chan-vay" ||
    slug.startsWith("quan-") ||
    slug.startsWith("vay-") ||
    slug.includes("bottom") ||
    slug.includes("skirt") ||
    slug.includes("pants")
  ) {
    return "bottom";
  }
  if (
    slug === "giay" ||
    slug.startsWith("giay-") ||
    slug.includes("shoes") ||
    slug.includes("footwear") ||
    slug.includes("sneaker")
  ) {
    return "footwear";
  }
  if (
    slug === "phu-kien" ||
    slug.startsWith("phu-kien-") ||
    slug.includes("bag") ||
    slug.includes("accessory") ||
    slug.includes("tui")
  ) {
    return "accessory";
  }

  return "other";
}

/**
 * Xác định dạng phối đồ của danh sách gợi ý
 */
export function detectCompositionType(
  items: Array<{ role: FashionRole | string; primary?: AIOutfitProduct }>
): OutfitCompositionType {
  const roles = items.map((i) =>
    normalizeFashionRole(
      i.role,
      i.primary?.fashionItem?.category?.slug || i.primary?.category?.slug
    )
  );

  if (roles.includes("fullbody")) {
    return "FULLBODY";
  }

  if (roles.includes("top") || roles.includes("bottom")) {
    return "SEPARATE_PIECES";
  }

  return "INCOMPLETE";
}

export interface ResolveCanvasOptions {
  /**
   * Hệ số điều chỉnh tỉ lệ kích thước ban đầu (mặc định = 1, ví dụ: 0.85 = 85%, 1.15 = 115%)
   */
  scaleMultiplier?: number;
}

/**
 * Chuyển đổi danh sách gợi ý AI thành mảng CanvasItem với tọa độ giải phẫu chuẩn
 */
export function resolveCanvasOutfitItems(
  items: AIOutfitItem[],
  options?: ResolveCanvasOptions
): CanvasItem[] {
  if (!items || items.length === 0) return [];

  const scaleMultiplier =
    options?.scaleMultiplier && options.scaleMultiplier > 0
      ? options.scaleMultiplier
      : 1;

  // 1. Chuẩn hóa vai trò cho từng món đồ
  const normalizedItems = items.map((item) => {
    const primary = item.primary;
    const catSlug =
      primary?.fashionItem?.category?.slug || primary?.category?.slug;
    const role = normalizeFashionRole(item.role, catSlug);
    return {
      originalItem: item,
      role,
    };
  });

  // 2. Quy tắc loại trừ: nếu có đầm liền thân (fullbody), loại bỏ áo (top) và quần (bottom)
  const hasFullbody = normalizedItems.some((i) => i.role === "fullbody");
  const filteredItems = hasFullbody
    ? normalizedItems.filter((i) => i.role !== "top" && i.role !== "bottom")
    : normalizedItems;

  // 3. Khử trùng lặp: mỗi vai trò chính chỉ xuất hiện tối đa 1 lần (trừ accessory và other)
  const seenRoles = new Set<FashionRole>();
  const dedupedItems: typeof filteredItems = [];

  for (const item of filteredItems) {
    if (item.role !== "accessory" && item.role !== "other") {
      if (seenRoles.has(item.role)) {
        continue;
      }
      seenRoles.add(item.role);
    }
    dedupedItems.push(item);
  }

  // 4. Chọn bảng tọa độ theo loại cấu trúc phối
  const coordinateMap = hasFullbody
    ? ROLE_COORDINATES_FULLBODY
    : ROLE_COORDINATES_SEPARATE;

  let accessoryCount = 0;

  // 5. Kết xuất danh sách CanvasItem
  return dedupedItems.map(({ originalItem, role }) => {
    const primary = originalItem.primary;
    const brandItemMetadata = getBrandItemCanvasMetadata(
      originalItem.itemContext,
      primary
    );
    const ghostData = primary.isGhost ? primary : undefined;

    let placement: RolePlacement;
    if (role === "accessory") {
      if (accessoryCount === 0) {
        placement = coordinateMap.accessory;
      } else {
        const secIndex = accessoryCount - 1;
        placement =
          SECONDARY_ACCESSORY_COORDINATES[secIndex] || {
            x: 240,
            y: 80 + (secIndex - 1) * 60,
            scale: 75,
            zIndex: 9,
          };
      }
      accessoryCount++;
    } else {
      placement = coordinateMap[role] || coordinateMap.other;
    }

    const effectiveScale = Math.round(placement.scale * scaleMultiplier);

    return {
      id: crypto.randomUUID(),
      clothingItemId: primary.fashionItem?.id || primary.id,
      imageUrl:
        primary.fashionItem?.imageUrl || (primary as AIOutfitProduct & { imageUrl?: string }).imageUrl || "",
      category: primary.category || primary.fashionItem?.category,
      _role: role,
      isGhost: ghostData?.isGhost,
      brandName:
        ghostData?.brandName ||
        brandItemMetadata.brandItemSnapshot?.brandName ||
        primary.brandName,
      wardrobeImpact: ghostData?.wardrobeImpact,
      price: brandItemMetadata.brandItemSnapshot?.price ?? primary.price,
      ...brandItemMetadata,
      x: placement.x,
      y: placement.y,
      scale: effectiveScale,
      zIndex: placement.zIndex,
    };
  });
}

/**
 * Cập nhật món thay thế khi người dùng ấn nút Swap, kế thừa toàn vẹn vị trí và kích cỡ
 */
export function swapCanvasItemByRole(
  currentItems: CanvasItem[],
  role: string,
  nextProduct: AIOutfitProduct,
  itemContext?: string
): CanvasItem[] {
  const existingIndex = currentItems.findIndex((item) => item._role === role);
  if (existingIndex === -1) return currentItems;

  const existing = currentItems[existingIndex];
  const brandItemMetadata = getBrandItemCanvasMetadata(itemContext, nextProduct);
  const nextGhostData = nextProduct.isGhost ? nextProduct : undefined;

  const updatedItems = [...currentItems];
  updatedItems[existingIndex] = {
    ...existing,
    clothingItemId: nextProduct.fashionItem?.id || nextProduct.id,
    imageUrl:
      nextProduct.fashionItem?.imageUrl || (nextProduct as AIOutfitProduct & { imageUrl?: string }).imageUrl || "",
    category: nextProduct.category || nextProduct.fashionItem?.category,
    isGhost: nextGhostData?.isGhost,
    brandName:
      nextGhostData?.brandName ||
      brandItemMetadata.brandItemSnapshot?.brandName ||
      nextProduct.brandName,
    wardrobeImpact: nextGhostData?.wardrobeImpact,
    price: brandItemMetadata.brandItemSnapshot?.price ?? nextProduct.price,
    ...brandItemMetadata,
    // Kế thừa trọn vẹn tọa độ và tỉ lệ của món đang hiển thị trên canvas
    x: existing.x,
    y: existing.y,
    scale: existing.scale,
    zIndex: existing.zIndex,
  };

  return updatedItems;
}

export interface RestoredPlacement {
  x: number;
  y: number;
  zIndex: number;
  role: FashionRole;
}

/**
 * Chuẩn hóa toạ độ khi tải một outfit item đã lưu từ backend:
 * - Khắc phục dữ liệu cũ từng bị đảo dấu bởi hàm Math.abs() (ví dụ: áo/top bị đảo từ -140 thành +140)
 * - Tự động định vị giải phẫu chuẩn nếu toạ độ bị rỗng hoặc gần 0
 * - Bổ sung role và kích thước chuẩn cho từng item trên canvas
 */
export function restoreCanvasOutfitItem(
  item: any,
  compositionType: OutfitCompositionType = "SEPARATE_PIECES"
): RestoredPlacement {
  const fashionItem = item.fashionItem || item.wardrobeItem;
  const catSlug =
    fashionItem?.category?.slug ||
    item.wardrobeItem?.category?.slug ||
    item.category?.slug;
  const rawRole = item._role || item.role || item.wardrobeItem?.role;
  const role = normalizeFashionRole(rawRole, catSlug);

  const coordinateMap =
    compositionType === "FULLBODY"
      ? ROLE_COORDINATES_FULLBODY
      : ROLE_COORDINATES_SEPARATE;
  const defaultCoord = coordinateMap[role] || coordinateMap.other;

  let x = typeof item.positionX === "number" ? item.positionX : defaultCoord.x;
  let y = typeof item.positionY === "number" ? item.positionY : defaultCoord.y;
  let zIndex = item.layerOrder || defaultCoord.zIndex || 1;

  // 1. Khắc phục lỗi Math.abs() của dữ liệu cũ:
  // Đối với các vai trò thân trên (top, headwear, outerwear, fullbody),
  // toạ độ Y trên canvas chuẩn luôn phải là số âm (nằm trên tâm/thắt lưng).
  // Nếu y > 0 (ví dụ: +140 cho áo thun), đảo dấu lại thành âm:
  if (
    (role === "top" || role === "headwear" || role === "outerwear" || role === "fullbody") &&
    y > 0
  ) {
    y = -y;
  }

  // 2. Khắc phục x = 1 do Math.max(1, 0)
  if (Math.abs(x) === 1 && defaultCoord.x === 0) {
    x = 0;
  }

  // 3. Khắc phục x = 25 cho outerwear (nguyên gốc là x = -25)
  if (role === "outerwear" && x === 25) {
    x = -25;
  }

  // 4. Tự động nâng vị trí giày dép lên 295 nếu lưu ở toạ độ cũ 305
  if (role === "footwear" && y === 305) {
    y = 295;
  }

  // 5. Nếu toạ độ quá gần 0 (missing hoặc chưa được bố cục)
  if (Math.abs(x) < 2 && Math.abs(y) < 2 && (defaultCoord.x !== 0 || defaultCoord.y !== 0)) {
    x = defaultCoord.x;
    y = defaultCoord.y;
    zIndex = defaultCoord.zIndex;
  }

  return { x, y, zIndex, role };
}

/**
 * Khôi phục danh sách CanvasItem hoàn chỉnh từ dữ liệu Outfit Res của backend
 */
export function restoreCanvasOutfitItems(items: any[]): CanvasItem[] {
  if (!items || items.length === 0) return [];

  const compositionType = detectCompositionType(
    items.map((i) => ({
      role: i._role || i.role || i.wardrobeItem?.role,
      primary: i.fashionItem || i.wardrobeItem || i,
    }))
  );

  return items
    .map((item) => {
      const fashionItem = item.fashionItem || item.wardrobeItem;
      const wardrobeItem = item.wardrobeItem || (item.fashionItem ? {
        ...item,
        id: item.fashionItem.id || item.id,
        category: item.fashionItem.category,
      } : {});

      const { x, y, zIndex, role } = restoreCanvasOutfitItem(item, compositionType);

      return {
        ...wardrobeItem,
        id: item.id || fashionItem?.id || crypto.randomUUID(),
        clothingItemId: fashionItem?.id || wardrobeItem.id || item.clothingItemId,
        imageUrl: fashionItem?.imageUrl || wardrobeItem.imageUrl || item.imageUrl || "",
        category: fashionItem?.category || wardrobeItem.category || item.category,
        _role: role,
        scale: Math.round((item.scale || 1) * 100),
        x,
        y,
        zIndex,
      };
    })
    .filter((x) => x.clothingItemId || x.id);
}
