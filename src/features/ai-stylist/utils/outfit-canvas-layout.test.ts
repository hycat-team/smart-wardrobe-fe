import {
  normalizeFashionRole,
  detectCompositionType,
  resolveCanvasOutfitItems,
  swapCanvasItemByRole,
  getItemBoundingBox,
  ROLE_BOUNDING_BOX_RATIOS,
  ROLE_COORDINATES_SEPARATE,
  ROLE_COORDINATES_FULLBODY,
} from "./outfit-canvas-layout";
import type { AIOutfitItem, AIOutfitProduct } from "@/features/ai-stylist/types";

function mockProduct(
  id: string,
  slug: string,
  extra: Partial<AIOutfitProduct> = {}
): AIOutfitProduct {
  return {
    id,
    userId: "user-1",
    status: 0,
    createdAt: "2026-09-26T00:00:00.000Z",
    name: `Product ${id}`,
    price: 500000,
    fashionItem: {
      id: `fi-${id}`,
      imageUrl: `https://example.com/${id}.png`,
      category: { id: `cat-${slug}`, name: slug, slug },
      color: "Đen",
      createdAt: "2026-09-26T00:00:00.000Z",
      updatedAt: "2026-09-26T00:00:00.000Z",
    } as any,
    category: { id: `cat-${slug}`, name: slug, slug },
    ...extra,
  };
}

function mockOutfitItem(
  role: string,
  slug: string,
  extraProduct: Partial<AIOutfitProduct> = {},
  alternatives: AIOutfitProduct[] = []
): AIOutfitItem {
  return {
    role,
    primary: mockProduct(`prod-${role}`, slug, extraProduct),
    alternatives,
  };
}

describe("normalizeFashionRole", () => {
  it("normalizes exact role strings correctly", () => {
    expect(normalizeFashionRole("headwear")).toBe("headwear");
    expect(normalizeFashionRole("top")).toBe("top");
    expect(normalizeFashionRole("bottom")).toBe("bottom");
    expect(normalizeFashionRole("fullbody")).toBe("fullbody");
    expect(normalizeFashionRole("outerwear")).toBe("outerwear");
    expect(normalizeFashionRole("footwear")).toBe("footwear");
    expect(normalizeFashionRole("accessory")).toBe("accessory");
    expect(normalizeFashionRole("other")).toBe("other");
  });

  it("handles case-insensitivity and whitespace", () => {
    expect(normalizeFashionRole("  TOP  ")).toBe("top");
    expect(normalizeFashionRole("OutErWear")).toBe("outerwear");
    expect(normalizeFashionRole("FullBody")).toBe("fullbody");
  });

  it("normalizes legacy Vietnamese role names", () => {
    expect(normalizeFashionRole("áo")).toBe("top");
    expect(normalizeFashionRole("quần")).toBe("bottom");
    expect(normalizeFashionRole("đầm")).toBe("fullbody");
    expect(normalizeFashionRole("áo khoác")).toBe("outerwear");
    expect(normalizeFashionRole("giày")).toBe("footwear");
    expect(normalizeFashionRole("mũ")).toBe("headwear");
    expect(normalizeFashionRole("phụ kiện")).toBe("accessory");
  });

  it("falls back to category slug when role is empty or missing", () => {
    expect(normalizeFashionRole("", "ao")).toBe("top");
    expect(normalizeFashionRole(undefined, "quan")).toBe("bottom");
    expect(normalizeFashionRole("", "dam")).toBe("fullbody");
    expect(normalizeFashionRole(undefined, "ao-khoac")).toBe("outerwear");
    expect(normalizeFashionRole("", "giay")).toBe("footwear");
    expect(normalizeFashionRole(undefined, "mu")).toBe("headwear");
    expect(normalizeFashionRole("", "phu-kien")).toBe("accessory");
    expect(normalizeFashionRole("", "unknown-slug")).toBe("other");
  });
});

describe("detectCompositionType", () => {
  it("identifies FULLBODY when fullbody item is present", () => {
    const items = [
      mockOutfitItem("fullbody", "dam"),
      mockOutfitItem("footwear", "giay"),
    ];
    expect(detectCompositionType(items)).toBe("FULLBODY");
  });

  it("identifies SEPARATE_PIECES when top and bottom are present", () => {
    const items = [
      mockOutfitItem("top", "ao"),
      mockOutfitItem("bottom", "quan"),
      mockOutfitItem("footwear", "giay"),
    ];
    expect(detectCompositionType(items)).toBe("SEPARATE_PIECES");
  });

  it("identifies INCOMPLETE when neither fullbody nor top/bottom are present", () => {
    const items = [
      mockOutfitItem("headwear", "mu"),
      mockOutfitItem("footwear", "giay"),
    ];
    expect(detectCompositionType(items)).toBe("INCOMPLETE");
  });
});

describe("resolveCanvasOutfitItems - User Story 1 (Anatomical Alignment & Fullbody Exclusivity)", () => {
  it("places separate pieces (top, bottom, footwear) at anatomical coordinates", () => {
    const items = [
      mockOutfitItem("top", "ao"),
      mockOutfitItem("bottom", "quan"),
      mockOutfitItem("footwear", "giay"),
    ];

    const result = resolveCanvasOutfitItems(items);

    expect(result).toHaveLength(3);

    const topItem = result.find((i) => i._role === "top");
    const bottomItem = result.find((i) => i._role === "bottom");
    const footwearItem = result.find((i) => i._role === "footwear");

    expect(topItem).toBeDefined();
    expect(topItem?.x).toBe(ROLE_COORDINATES_SEPARATE.top.x);
    expect(topItem?.y).toBe(ROLE_COORDINATES_SEPARATE.top.y);
    expect(topItem?.scale).toBe(ROLE_COORDINATES_SEPARATE.top.scale);

    expect(bottomItem).toBeDefined();
    expect(bottomItem?.x).toBe(ROLE_COORDINATES_SEPARATE.bottom.x);
    expect(bottomItem?.y).toBe(ROLE_COORDINATES_SEPARATE.bottom.y);

    expect(footwearItem).toBeDefined();
    expect(footwearItem?.x).toBe(ROLE_COORDINATES_SEPARATE.footwear.x);
    expect(footwearItem?.y).toBe(295);
    expect(ROLE_COORDINATES_SEPARATE.footwear.y).toBe(295);
    expect(ROLE_COORDINATES_FULLBODY.footwear.y).toBe(295);
  });

  it("places fullbody at center and excludes top and bottom", () => {
    const items = [
      mockOutfitItem("fullbody", "dam"),
      mockOutfitItem("footwear", "giay"),
      // Unwanted top/bottom accidentally present in payload
      mockOutfitItem("top", "ao"),
      mockOutfitItem("bottom", "quan"),
    ];

    const result = resolveCanvasOutfitItems(items);

    const fullbodyItem = result.find((i) => i._role === "fullbody");
    const topItem = result.find((i) => i._role === "top");
    const bottomItem = result.find((i) => i._role === "bottom");

    expect(fullbodyItem).toBeDefined();
    expect(fullbodyItem?.y).toBe(ROLE_COORDINATES_FULLBODY.fullbody.y);
    expect(topItem).toBeUndefined();
    expect(bottomItem).toBeUndefined();
  });

  it("deduplicates multiple items with the same primary role", () => {
    const items = [
      mockOutfitItem("top", "ao", { name: "First Top" }),
      mockOutfitItem("top", "ao", { name: "Duplicate Top" }),
      mockOutfitItem("bottom", "quan"),
    ];

    const result = resolveCanvasOutfitItems(items);
    const tops = result.filter((i) => i._role === "top");

    expect(tops).toHaveLength(1);
  });
});

describe("resolveCanvasOutfitItems - User Story 2 (Outerwear Layering)", () => {
  it("places outerwear on top of inner top with higher z-index", () => {
    const items = [
      mockOutfitItem("top", "ao"),
      mockOutfitItem("outerwear", "ao-khoac"),
      mockOutfitItem("bottom", "quan"),
      mockOutfitItem("footwear", "giay"),
    ];

    const result = resolveCanvasOutfitItems(items);

    const topItem = result.find((i) => i._role === "top");
    const outerwearItem = result.find((i) => i._role === "outerwear");

    expect(topItem).toBeDefined();
    expect(outerwearItem).toBeDefined();
    expect(outerwearItem!.zIndex).toBeGreaterThan(topItem!.zIndex);
    expect(outerwearItem?.x).toBe(ROLE_COORDINATES_SEPARATE.outerwear.x);
    expect(outerwearItem?.y).toBe(ROLE_COORDINATES_SEPARATE.outerwear.y);
  });

  it("layers outerwear over fullbody correctly", () => {
    const items = [
      mockOutfitItem("fullbody", "dam"),
      mockOutfitItem("outerwear", "ao-khoac"),
      mockOutfitItem("footwear", "giay"),
    ];

    const result = resolveCanvasOutfitItems(items);

    const fullbodyItem = result.find((i) => i._role === "fullbody");
    const outerwearItem = result.find((i) => i._role === "outerwear");

    expect(outerwearItem!.zIndex).toBeGreaterThan(fullbodyItem!.zIndex);
  });
});

describe("resolveCanvasOutfitItems - User Story 3 (Headwear & Accessories)", () => {
  it("places headwear at top-center and distributes multiple accessories to opposite sides", () => {
    const items = [
      mockOutfitItem("headwear", "mu"),
      mockOutfitItem("top", "ao"),
      mockOutfitItem("bottom", "quan"),
      mockOutfitItem("footwear", "giay"),
      mockOutfitItem("accessory", "phu-kien", { name: "Túi xách" }),
      mockOutfitItem("accessory", "phu-kien", { name: "Kính mát" }),
    ];

    const result = resolveCanvasOutfitItems(items);

    const headwear = result.find((i) => i._role === "headwear");
    const accessories = result.filter((i) => i._role === "accessory");

    expect(headwear).toBeDefined();
    expect(headwear?.y).toBe(ROLE_COORDINATES_SEPARATE.headwear.y);

    expect(accessories).toHaveLength(2);
    // 1st accessory at left wing
    expect(accessories[0].x).toBe(-240);
    // 2nd accessory at right wing
    expect(accessories[1].x).toBe(240);
  });
});

describe("swapCanvasItemByRole - User Story 4 (Swap Alternative Preserving Position)", () => {
  it("replaces product data while strictly preserving existing canvas coordinates and scale", () => {
    const items = [
      mockOutfitItem("top", "ao"),
      mockOutfitItem("bottom", "quan"),
    ];

    const initialCanvasItems = resolveCanvasOutfitItems(items);
    // Simulate user dragging the top item
    initialCanvasItems[0].x = 45;
    initialCanvasItems[0].y = -120;
    initialCanvasItems[0].scale = 115;

    const replacementProduct = mockProduct("alt-top-2", "ao", {
      name: "Áo polo mới",
    });

    const updated = swapCanvasItemByRole(
      initialCanvasItems,
      "top",
      replacementProduct
    );

    const swappedTop = updated.find((i) => i._role === "top");
    expect(swappedTop).toBeDefined();
    expect(swappedTop?.clothingItemId).toBe("fi-alt-top-2");
    expect(swappedTop?.x).toBe(45);
    expect(swappedTop?.y).toBe(-120);
    expect(swappedTop?.scale).toBe(115);
  });
});

describe("resolveCanvasOutfitItems - User Story 5 (Brand & Ghost Items Integration)", () => {
  it("keeps brand item in its role position instead of pushing to x=280", () => {
    const brandOuterwear = mockOutfitItem("outerwear", "ao-khoac", {
      itemContext: "brand_item",
      brandItemId: "brand-blazer-1",
      brandName: "Zara",
      price: 1800000,
      brandItem: {
        id: "brand-blazer-1",
        brandId: "brand-1",
        brandName: "Zara",
        name: "Blazer Zara",
        price: 1800000,
      },
    });

    const items = [
      mockOutfitItem("top", "ao"),
      brandOuterwear,
      mockOutfitItem("bottom", "quan"),
      mockOutfitItem("footwear", "giay"),
    ];

    const result = resolveCanvasOutfitItems(items);
    const outerwear = result.find((i) => i._role === "outerwear");

    expect(outerwear).toBeDefined();
    // Placed in anatomical outerwear position, NOT x=280
    expect(outerwear?.x).toBe(ROLE_COORDINATES_SEPARATE.outerwear.x);
    expect(outerwear?.y).toBe(ROLE_COORDINATES_SEPARATE.outerwear.y);
    expect(outerwear?.itemContext).toBe("brand_item");
    expect(outerwear?.brandItemId).toBe("brand-blazer-1");
    expect(outerwear?.brandName).toBe("Zara");
  });

  it("retains ghost item badge and placement correctly", () => {
    const ghostShoes = mockOutfitItem("footwear", "giay", {
      isGhost: true,
      brandName: "Nike Virtual",
      wardrobeImpact: { score: 90 },
    });

    const items = [
      mockOutfitItem("top", "ao"),
      mockOutfitItem("bottom", "quan"),
      ghostShoes,
    ];

    const result = resolveCanvasOutfitItems(items);
    const shoes = result.find((i) => i._role === "footwear");

    expect(shoes).toBeDefined();
    expect(shoes?.x).toBe(ROLE_COORDINATES_SEPARATE.footwear.x);
    expect(shoes?.y).toBe(ROLE_COORDINATES_SEPARATE.footwear.y);
    expect(shoes?.isGhost).toBe(true);
    expect(shoes?.brandName).toBe("Nike Virtual");
  });
});

describe("getItemBoundingBox - Anatomical Bounding Box Balance", () => {
  it("calculates proportional bounding box for various roles", () => {
    // Top at scale 100: width 210, height 210
    const topBox = getItemBoundingBox("top", 100);
    expect(topBox.width).toBe(210);
    expect(topBox.height).toBe(210);

    // Bottom at scale 100: capped at height 230 so long pants don't stretch indefinitely
    const bottomBox = getItemBoundingBox("bottom", 100);
    expect(bottomBox.width).toBe(190);
    expect(bottomBox.height).toBe(230);

    // Footwear at scale 80: width 144, height 104
    const footwearBox = getItemBoundingBox("footwear", 80);
    expect(footwearBox.width).toBe(144);
    expect(footwearBox.height).toBe(104);

    // Fullbody at scale 105: width 221, height 336
    const fullbodyBox = getItemBoundingBox("fullbody", 105);
    expect(fullbodyBox.width).toBe(221);
    expect(fullbodyBox.height).toBe(336);

    // Headwear at scale 80: width 144, height 112
    const headwearBox = getItemBoundingBox("headwear", 80);
    expect(headwearBox.width).toBe(144);
    expect(headwearBox.height).toBe(112);
  });

  it("handles category slug fallback when role is omitted", () => {
    const shoeBox = getItemBoundingBox(undefined, 80, "giay-the-thao");
    expect(shoeBox.width).toBe(144);
    expect(shoeBox.height).toBe(104);

    const pantsBox = getItemBoundingBox("", 100, "quan-tay");
    expect(pantsBox.width).toBe(190);
    expect(pantsBox.height).toBe(230);
  });

  it("gracefully falls back for unknown roles", () => {
    const fallbackBox = getItemBoundingBox("unknown-custom-role", 100);
    expect(fallbackBox.width).toBe(200);
    expect(fallbackBox.height).toBe(200);
  });
});

describe("resolveCanvasOutfitItems - User Story 6 (Pre-generation Size / Scale Multiplier)", () => {
  const baseItems = [
    mockOutfitItem("top", "ao"),
    mockOutfitItem("bottom", "quan"),
    mockOutfitItem("footwear", "giay"),
  ];

  it("scales items down when scaleMultiplier < 1 (e.g. 0.85 gọn gàng)", () => {
    const result = resolveCanvasOutfitItems(baseItems, { scaleMultiplier: 0.85 });

    const top = result.find((i) => i._role === "top");
    const bottom = result.find((i) => i._role === "bottom");
    const footwear = result.find((i) => i._role === "footwear");

    // 100 * 0.85 = 85
    expect(top?.scale).toBe(85);
    expect(bottom?.scale).toBe(85);
    // 80 * 0.85 = 68
    expect(footwear?.scale).toBe(68);
  });

  it("scales items up when scaleMultiplier > 1 (e.g. 1.15 phóng to)", () => {
    const result = resolveCanvasOutfitItems(baseItems, { scaleMultiplier: 1.15 });

    const top = result.find((i) => i._role === "top");
    const footwear = result.find((i) => i._role === "footwear");

    // 100 * 1.15 = 115
    expect(top?.scale).toBe(115);
    // 80 * 1.15 = 92
    expect(footwear?.scale).toBe(92);
  });

  it("defaults to 1.0 when scaleMultiplier is not provided", () => {
    const result = resolveCanvasOutfitItems(baseItems);

    const top = result.find((i) => i._role === "top");
    const footwear = result.find((i) => i._role === "footwear");

    expect(top?.scale).toBe(100);
    expect(footwear?.scale).toBe(80);
  });
});
