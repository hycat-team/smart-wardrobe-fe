const fs = require('fs');

const srcPath = 'd:\\Project\\smart-wardrobe\\smart-wardrobe-fe\\src\\app\\(user)\\outfits\\create\\components\\CreateOutfitClient.tsx';
const destPath = 'd:\\Project\\smart-wardrobe\\smart-wardrobe-fe\\src\\app\\(user)\\outfits\\[id]\\components\\OutfitDetailClient.tsx';

let content = fs.readFileSync(srcPath, 'utf8');

// Remove Suspense wrapper
content = content.replace(/export function CreateOutfitClient\(\) \{[\s\S]*?Suspense fallback[\s\S]*?CreateOutfitContent \/>[\s\S]*?<\/Suspense>[\s\S]*?;\n\}/g, '');

content = content.replace('function CreateOutfitContent() {', `interface OutfitDetailClientProps {
  outfitId: string;
  initialOutfit?: Outfit;
}

export function OutfitDetailClient({ outfitId, initialOutfit }: OutfitDetailClientProps) {`);

content = content.replace('import { useCreateOutfit } from "@/features/outfits/queries/outfits.queries";', `import { useOutfitDetail, useUpdateOutfit } from "@/features/outfits/queries/outfits.queries";\nimport { OutfitRes as Outfit } from "@/features/outfits/types";`);

content = content.replace('const createOutfitMutation = useCreateOutfit();', `const { data: outfit, isLoading: isLoadingOutfit } = useOutfitDetail(outfitId, initialOutfit);\n  const updateOutfitMutation = useUpdateOutfit();\n\n  // Populate data when outfit is loaded\n  useEffect(() => {\n    if (outfit) {\n      setOutfitName(outfit.name);\n      if (OCCASIONS.includes(outfit.description || "")) {\n        setOccasion(outfit.description || "Casual");\n        setCustomOccasion("");\n      } else {\n        setOccasion("Casual");\n        setCustomOccasion(outfit.description || "");\n      }\n      \n      const initialItems = (outfit.items || []).map((item: any) => ({\n        ...(item.wardrobe_item || {}),\n        scale: Math.round((item.scale || 1) * 100),\n        x: item.position_x || 0,\n        y: item.position_y || 0,\n        zIndex: item.layer_order || 1,\n      })).filter((x: any) => x.id);\n      \n      setSelectedItems(initialItems);\n    }\n  }, [outfit]);`);

content = content.replace('import { useState, useRef, Suspense } from "react";', 'import { useState, useRef, useEffect, Suspense } from "react";');

content = content.replace(/createOutfitMutation\.mutateAsync\(payload\)/g, 'updateOutfitMutation.mutateAsync({ id: outfitId, data: payload })');
content = content.replace(/Lưu bộ phối đồ thành công!/g, 'Cập nhật bộ phối đồ thành công!');
content = content.replace(/LƯU PHỐI ĐỒ/g, 'CẬP NHẬT PHỐI ĐỒ');
content = content.replace(/Đang chụp ảnh Canvas và lưu phối đồ/g, 'Đang chụp ảnh Canvas và cập nhật phối đồ');

fs.writeFileSync(destPath, content, 'utf8');
console.log('Done replacing content.');
