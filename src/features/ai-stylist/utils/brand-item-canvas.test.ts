import { getBrandItemCanvasMetadata } from "./brand-item-canvas";
import type { AIOutfitProduct } from "@/features/ai-stylist/types";

function product(id: string, fashionItemId: string): AIOutfitProduct {
  return {
    id,
    userId: "user-1",
    status: 0,
    createdAt: "2026-07-24T00:00:00.000Z",
    name: `Product ${id}`,
    price: 750000,
    fashionItem: {
      id: fashionItemId,
      category: { id: "cat-1", name: "Áo", slug: "ao" },
      imageUrl: "https://res.cloudinary.com/demo/image/upload/item.png",
      color: "Đen",
      colorHex: "#000000",
      colorHue: 0,
      colorSaturation: 0,
      colorLightness: 0,
      style: "Minimal",
      material: "Cotton",
      pattern: "Solid",
      fit: "Regular",
      seasonality: "All season",
      description: "Mẫu thiết kế",
      createdAt: "2026-07-24T00:00:00.000Z",
      updatedAt: "2026-07-24T00:00:00.000Z",
    },
  };
}

describe("getBrandItemCanvasMetadata", () => {
  it("uses brandItem.id from the real API response shape", () => {
    const brandProduct = product("fashion-item-1", "fashion-item-1");
    brandProduct.itemContext = "brand_item";
    brandProduct.brandItem = {
      id: "brand-item-1",
      brandId: "brand-1",
      brandName: "Local Brand",
      itemType: "product",
      name: "Áo mẫu",
      price: 1000000,
    };

    const metadata = getBrandItemCanvasMetadata(undefined, brandProduct);

    expect(metadata.brandItemId).toBe("brand-item-1");
    expect(metadata.brandItemSnapshot).toMatchObject({
      id: "brand-item-1",
      brandId: "brand-1",
      brandName: "Local Brand",
      name: "Áo mẫu",
      price: 1000000,
    });
    expect(metadata.brandItemSnapshot?.imageUrl).toContain("item.png");
  });

  it("updates metadata for the currently selected alternative", () => {
    const metadata = getBrandItemCanvasMetadata(
      "brand_item",
      product("brand-item-2", "fashion-item-2"),
    );

    expect(metadata.brandItemId).toBe("brand-item-2");
  });

  it("recognizes itemContext provided inside the product", () => {
    const nestedContextProduct = product("brand-item-3", "fashion-item-3");
    nestedContextProduct.itemContext = "brand_item";

    const metadata = getBrandItemCanvasMetadata(undefined, nestedContextProduct);

    expect(metadata.itemContext).toBe("brand_item");
    expect(metadata.brandItemId).toBe("brand-item-3");
  });

  it("prefers an explicit brandItemId from the backend", () => {
    const explicitIdProduct = product("recommendation-item-1", "fashion-item-1");
    explicitIdProduct.brandItemId = "brand-item-explicit";

    const metadata = getBrandItemCanvasMetadata("brand_item", explicitIdProduct);

    expect(metadata.brandItemId).toBe("brand-item-explicit");
    expect(metadata.brandItemSnapshot?.id).toBe("brand-item-explicit");
  });

  it("does not expose feedback metadata for wardrobe items", () => {
    const metadata = getBrandItemCanvasMetadata(
      "wardrobe_item",
      product("wardrobe-item-1", "fashion-item-1"),
    );

    expect(metadata.brandItemId).toBeUndefined();
    expect(metadata.brandItemSnapshot).toBeUndefined();
  });
});