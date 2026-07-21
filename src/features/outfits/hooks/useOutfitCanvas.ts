import { useState } from "react";
import { toast } from "sonner";
import { getWardrobeItemName } from "@/features/wardrobe/utils";
import { WardrobeItemStatus } from "@/features/wardrobe/types";

export interface CanvasItem {
  id: string;
  scale: number;
  x: number;
  y: number;
  zIndex: number;
  [key: string]: any;
}

export function useOutfitCanvas() {
  const [selectedItems, setSelectedItems] = useState<CanvasItem[]>([]);

  const bringToFront = (id: string) => {
    setSelectedItems((prev) => {
      const maxZ = Math.max(...prev.map((i) => i.zIndex || 0), 0);
      return prev.map((item) => (item.id === id ? { ...item, zIndex: maxZ + 1 } : item));
    });
  };

  const handleItemToggle = (item: any) => {
    if (selectedItems.some((x) => x.id === item.id)) {
      setSelectedItems((prev) => prev.filter((x) => x.id !== item.id));
    } else {
      const maxZ = Math.max(...selectedItems.map((i) => i.zIndex || 0), 0);
      
      let x = 0;
      let y = 0;
      let scale = 100;
      let zIndex = maxZ + 1;
      
      const isBrand = item.isGhost || item.brandName;
      
      if (isBrand) {
        x = 280 + (Math.random() * 40 - 20); // Right side
        y = -150 + (Math.random() * 100 - 50);
        zIndex = maxZ + 10;
        scale = 80;
      } else {
        const slug = (item.category?.slug || '').toLowerCase();
        
        if (slug === 'phu-kien' || slug.startsWith('phu-kien-') || slug.includes('accessory')) {
          x = -280 + (Math.random() * 40 - 20); // Left side
          y = -150 + (Math.random() * 100 - 50);
          zIndex = maxZ + 5;
        } else if (slug === 'mu' || slug === 'non' || slug.includes('hat')) {
          y = -350 + (Math.random() * 20 - 10);
          zIndex = maxZ + 4;
        } else if (slug === 'ao' || slug.startsWith('ao-') || slug.includes('top') || slug.includes('jacket')) {
          y = -180 + (Math.random() * 20 - 10);
          zIndex = maxZ + 3;
        } else if (slug === 'quan' || slug === 'vay' || slug.startsWith('quan-') || slug.startsWith('vay-') || slug.includes('bottom') || slug.includes('skirt')) {
          y = 120 + (Math.random() * 20 - 10);
          zIndex = maxZ + 2;
        } else if (slug === 'giay' || slug.startsWith('giay-') || slug.includes('shoes') || slug.includes('footwear')) {
          y = 270 + (Math.random() * 20 - 10);
          zIndex = maxZ + 3;
        } else {
          y = (Math.random() * 80 - 40);
          x = (Math.random() * 80 - 40);
        }
      }

      setSelectedItems((prev) => [
        ...prev,
        {
          ...item,
          scale,
          x,
          y,
          zIndex,
        },
      ]);
      // toast.success(`Đã thêm ${getWardrobeItemName(item)} vào bàn phối!`);
    }
  };

  const updateScale = (id: string, newScale: number) => {
    setSelectedItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, scale: Math.max(30, Math.min(250, newScale)) } : x))
    );
  };

  const removeItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((x) => x.id !== id));
  };

  const handleDragEnd = (id: string, info: any) => {
    setSelectedItems((prev) =>
      prev.map((x) => {
        if (x.id === id) {
          return {
            ...x,
            x: x.x + info.offset.x,
            y: x.y + info.offset.y,
          };
        }
        return x;
      })
    );
  };

  const handleAIMatch = (realItems: any[], setOutfitName: (name: string) => void) => {
    const tops = realItems.filter(
      (x) => x.category?.name === "Áo" && !x.isLocked && x.status === WardrobeItemStatus.InWardrobe
    );
    const bottoms = realItems.filter(
      (x) => x.category?.name === "Quần" && !x.isLocked && x.status === WardrobeItemStatus.InWardrobe
    );
    const shoes = realItems.filter(
      (x) => x.category?.name === "Giày" && !x.isLocked && x.status === WardrobeItemStatus.InWardrobe
    );

    if (tops.length === 0 || bottoms.length === 0) {
      toast.error("Không đủ quần áo trong tủ đồ để thực hiện AI match! Cần có ít nhất 1 Áo và 1 Quần.");
      return;
    }

    const randomTop = tops[Math.floor(Math.random() * tops.length)];
    const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    const randomShoes = shoes.length > 0 ? shoes[Math.floor(Math.random() * shoes.length)] : null;

    let z = 1;
    const matched = [
      { ...randomTop, scale: 100, x: 0, y: -80, zIndex: z++ },
      { ...randomBottom, scale: 100, x: 0, y: 100, zIndex: z++ },
    ];

    if (randomShoes) {
      matched.push({ ...randomShoes, scale: 70, x: 0, y: 240, zIndex: z++ });
    }

    setSelectedItems(matched);
    setOutfitName("AI Styled Outfit " + Math.floor(Math.random() * 100));
    toast.success("AI Stylist đã gợi ý bộ phối hợp hoàn chỉnh!");
  };

  return {
    selectedItems,
    setSelectedItems,
    bringToFront,
    handleItemToggle,
    updateScale,
    removeItem,
    handleDragEnd,
    handleAIMatch,
  };
}
