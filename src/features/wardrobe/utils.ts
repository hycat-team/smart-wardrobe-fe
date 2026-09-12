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
  const categoryName = item.category?.name || item.fashionItem?.category?.name || "Trang phục";
  const itemColor = item.fashionItem?.color || item.color;
  const itemStyle = item.fashionItem?.style || item.style;
  const colorStr = itemColor ? `màu ${itemColor}` : "";
  const styleStr = itemStyle ? `phong cách ${itemStyle}` : "";
  return [categoryName, colorStr, styleStr].filter(Boolean).join(" ");
}

export function getColorHex(colorName: string): string {
  const c = COLORS.find(x => x.name.toLowerCase() === colorName.toLowerCase() || x.value === colorName.toLowerCase());
  return c ? c.hex : "#CCCCCC";
}
