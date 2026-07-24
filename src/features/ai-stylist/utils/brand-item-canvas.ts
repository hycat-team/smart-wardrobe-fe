import type { AIOutfitProduct } from "@/features/ai-stylist/types";
import type { BrandItemSnapshot } from "@/features/brands/types";

export function getBrandItemCanvasMetadata(
  itemContext: string | undefined,
  product: AIOutfitProduct,
) {
  const outfitContext = itemContext?.trim().toLowerCase();
  const productContext = product.itemContext?.trim().toLowerCase();
  const resolvedContext = outfitContext === "brand_item" || productContext === "brand_item"
    ? "brand_item"
    : outfitContext || productContext;

  if (resolvedContext !== "brand_item") {
    return {
      itemContext: resolvedContext,
      brandItemId: undefined,
      brandItemSnapshot: undefined,
    };
  }

  const brandItemId = product.brandItem?.id || product.brandItemId || product.id;

  return {
    itemContext: resolvedContext,
    brandItemId,
    brandItemSnapshot: {
      id: brandItemId,
      name: product.brandItem?.name || product.name,
      description: product.description || product.fashionItem?.description,
      price: product.brandItem?.price ?? product.price,
      brandId: product.brandItem?.brandId || product.brandId,
      brandName: product.brandItem?.brandName || product.brandName,
      imageUrl: product.fashionItem?.imageUrl,
      categoryName: product.fashionItem?.category?.name || product.category?.name,
      color: product.fashionItem?.color,
      material: product.fashionItem?.material,
      style: product.fashionItem?.style,
    } satisfies BrandItemSnapshot,
  };
}