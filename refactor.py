import re

with open(r'd:\Project\smart-wardrobe\smart-wardrobe-fe\src\app\(user)\outfits\create\components\CreateOutfitClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'export function CreateOutfitClient.*?Suspense fallback.*?CreateOutfitContent \/>\s*<\/Suspense>\s*;\s*}', '', content, flags=re.DOTALL)
content = content.replace('function CreateOutfitContent() {', '''interface OutfitDetailClientProps {
  outfitId: string;
  initialOutfit?: Outfit;
}

export function OutfitDetailClient({ outfitId, initialOutfit }: OutfitDetailClientProps) {''')
content = content.replace('import { useCreateOutfit } from "@/features/outfits/queries/outfits.queries";', '''import { useOutfitDetail, useUpdateOutfit } from "@/features/outfits/queries/outfits.queries";\nimport { OutfitRes as Outfit } from "@/features/outfits/types";''')
content = content.replace('const createOutfitMutation = useCreateOutfit();', '''const { data: outfit, isLoading: isLoadingOutfit } = useOutfitDetail(outfitId, initialOutfit);\n  const updateOutfitMutation = useUpdateOutfit();\n\n  // Populate data when outfit is loaded\n  useEffect(() => {\n    if (outfit) {\n      setOutfitName(outfit.name);\n      if (OCCASIONS.includes(outfit.description || "")) {\n        setOccasion(outfit.description || "Casual");\n        setCustomOccasion("");\n      } else {\n        setOccasion("Casual");\n        setCustomOccasion(outfit.description || "");\n      }\n      \n      const initialItems = (outfit.items || []).map((item: any) => ({\n        ...(item.wardrobe_item || {}),\n        scale: Math.round((item.scale || 1) * 100),\n        x: item.position_x || 0,\n        y: item.position_y || 0,\n        zIndex: item.layer_order || 1,\n      })).filter((x: any) => x.id);\n      \n      setSelectedItems(initialItems);\n    }\n  }, [outfit]);''')
content = content.replace('import { useState, useRef, Suspense } from "react";', 'import { useState, useRef, useEffect } from "react";')
content = content.replace('createOutfitMutation.mutateAsync(payload)', 'updateOutfitMutation.mutateAsync({ id: outfitId, data: payload })')
content = content.replace('Lưu bộ phối đồ thành công!', 'Cập nhật bộ phối đồ thành công!')
content = content.replace('LƯU PHỐI ĐỒ', 'CẬP NHẬT PHỐI ĐỒ')

with open(r'd:\Project\smart-wardrobe\smart-wardrobe-fe\src\app\(user)\outfits\[id]\components\OutfitDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
