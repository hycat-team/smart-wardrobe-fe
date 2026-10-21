const COLORS = [
  { name: "Trắng", value: "white", hex: "#FFFFFF" },
  { name: "Đen", value: "black", hex: "#1A1A1A" },
  { name: "Xanh dương", value: "blue", hex: "#2563EB" },
  { name: "Xám", value: "gray", hex: "#9CA3AF" },
  { name: "Đỏ", value: "red", hex: "#DC2626" },
  { name: "Vàng", value: "yellow", hex: "#F59E0B" },
  { name: "Be", value: "beige", hex: "#F5F5DC" },
];

export function getWardrobeItemName(item: any) {
  if (!item) return "Trang phục";
  if (item.name) return item.name;
  if (item.brandItem?.name) return item.brandItem.name;
  const categoryName =
    item.category?.name ||
    item.fashionItem?.category?.name ||
    (typeof item.category === "string" ? item.category : "") ||
    (item as any).categoryName ||
    "";
  const itemColor = item.fashionItem?.color || item.color;
  const itemStyle = item.fashionItem?.style || item.style;
  const colorStr = itemColor ? `màu ${itemColor}` : "";
  const styleStr = itemStyle ? `phong cách ${itemStyle}` : "";

  if (!categoryName && !itemColor && !itemStyle) {
    return "Trang phục chưa phân loại";
  }

  return [categoryName || "Trang phục", colorStr, styleStr].filter(Boolean).join(" ");
}

export function getWardrobeItemTitle(item: any): string {
  if (!item) return "Trang phục";
  if (item.name) return item.name;
  if (item.brandItem?.name) return item.brandItem.name;

  const categoryName =
    item.category?.name ||
    item.fashionItem?.category?.name ||
    (typeof item.category === "string" ? item.category : "") ||
    (item as any).categoryName ||
    "";

  const color = item.fashionItem?.color || item.color || "";
  const style = item.fashionItem?.style || item.style || "";

  if (categoryName) {
    return [categoryName, color, style].filter(Boolean).join(" ");
  }

  if (color || style) {
    return `Trang phục ${[color, style].filter(Boolean).join(" ")}`.trim();
  }

  return "Trang phục chưa phân loại";
}

export function getColorHex(colorName: string): string {
  const c = COLORS.find(x => x.name.toLowerCase() === colorName.toLowerCase() || x.value === colorName.toLowerCase());
  return c ? c.hex : "#CCCCCC";
}

