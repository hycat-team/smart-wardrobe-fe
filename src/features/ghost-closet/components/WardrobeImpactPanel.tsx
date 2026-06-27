import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { GhostItem } from "../types";
import { Check, ArrowDown, ArrowUp, X, BookmarkPlus, ShoppingBag, EyeOff, ThumbsDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface WardrobeImpactPanelProps {
  isOpen: boolean;
  onClose: () => void;
  item: GhostItem | null;
  onKeep: () => void;
  onSwap: () => void;
  onSave: () => void;
  onWaitlist: () => void;
  onHideBrand: () => void;
  onNotMyStyle: () => void;
}

export function WardrobeImpactPanel({
  isOpen,
  onClose,
  item,
  onKeep,
  onSwap,
  onSave,
  onWaitlist,
  onHideBrand,
  onNotMyStyle,
}: WardrobeImpactPanelProps) {
  if (!item) return null;

  const formatPrice = (price?: number) => {
    if (price === undefined) return 'Đang cập nhật';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-cream p-0 overflow-y-auto border-l border-ink/10 flex flex-col h-full rounded-none">
        <div className="flex-1 overflow-y-auto">
          {/* Header Image */}
          <div className="relative aspect-[4/5] w-full bg-muted">
            <Image
              src={item.imageUrl}
              alt={item.brandName}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#A0522D] text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1">
              Ghost Item
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/20 text-white p-2 hover:bg-black/40 transition-colors backdrop-blur-sm"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Product Info */}
            <div>
              <p className="text-xs font-mono text-ink-muted uppercase tracking-[0.2em] mb-2">{item.brandName}</p>
              <h2 className="text-2xl font-semibold font-medium text-ink mb-1 uppercase">
                {item.category?.name || "Sản phẩm"} {item.color}
              </h2>
              <p className="font-mono text-sm tracking-widest text-[#A0522D]">{formatPrice(item.price)}</p>
            </div>

            {/* Wardrobe Impact */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-ink pb-2 border-b border-ink/10">
                Wardrobe Impact
              </h3>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="size-4 text-[#A0522D] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-ink font-medium">Phù hợp với {item.wardrobeImpact.compatibleItemCount} món đồ</p>
                    <p className="text-[11px] font-mono uppercase tracking-widest text-ink-muted mt-0.5">Bạn đang sở hữu</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Check className="size-4 text-[#A0522D] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-ink font-medium">Tạo thêm {item.wardrobeImpact.newOutfitsUnlocked} outfits mới</p>
                    <p className="text-[11px] font-mono uppercase tracking-widest text-ink-muted mt-0.5">Mở rộng lựa chọn</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Check className="size-4 text-[#A0522D] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-ink font-medium">Lý tưởng cho {item.wardrobeImpact.suitableOccasions.join(', ')}</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <ArrowDown className="size-4 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-ink font-medium">Rủi ro trùng lặp: Thấp</p>
                    <p className="text-[11px] font-mono uppercase tracking-widest text-ink-muted mt-0.5">Bạn chưa có món tương tự</p>
                  </div>
                </li>

                {item.wardrobeImpact.wardrobeGapFilled && (
                  <li className="flex items-start gap-3">
                    <ArrowUp className="size-4 text-[#A0522D] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-ink font-medium">Lấp đầy khoảng trống {item.wardrobeImpact.wardrobeGapFilled}</p>
                    </div>
                  </li>
                )}
              </ul>

              {/* Color Compatibility */}
              <div className="pt-2">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-ink-muted">Mức độ hòa hợp màu</span>
                  <span className="text-sm font-medium">{item.wardrobeImpact.colorCompatibilityScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-ink/10">
                  <div
                    className="h-full bg-[#A0522D] transition-all duration-1000"
                    style={{ width: `${item.wardrobeImpact.colorCompatibilityScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 border-t border-ink/10 bg-cream/90 backdrop-blur-md shrink-0 space-y-3">
          <div className="flex gap-3">
            <Button
              onClick={onKeep}
              className="flex-1 rounded-none bg-ink text-cream hover:bg-ink/80 text-xs font-mono tracking-widest uppercase h-12"
            >
              Giữ trong Outfit
            </Button>
            <Button
              onClick={onSwap}
              variant="outline"
              className="flex-1 rounded-none border-ink text-ink hover:bg-ink hover:text-cream text-xs font-mono tracking-widest uppercase h-12"
            >
              Đổi món khác
            </Button>
          </div>

          <div className="flex gap-2 justify-between">
            <Button onClick={onSave} variant="ghost" size="sm" className="flex-1 rounded-none text-[10px] font-mono uppercase tracking-widest text-ink-muted hover:text-ink hover:bg-ink/5">
              <BookmarkPlus className="size-3.5 mr-1.5" /> Lưu
            </Button>
            <Button onClick={onWaitlist} variant="ghost" size="sm" className="flex-1 rounded-none text-[10px] font-mono uppercase tracking-widest text-ink-muted hover:text-ink hover:bg-ink/5">
              <ShoppingBag className="size-3.5 mr-1.5" /> Waitlist
            </Button>
          </div>

          <div className="flex gap-2 justify-between pt-2 border-t border-ink/5">
            <Button onClick={onNotMyStyle} variant="ghost" size="sm" className="flex-1 rounded-none text-[10px] font-mono uppercase tracking-widest text-red-500/70 hover:text-red-600 hover:bg-red-50">
              <ThumbsDown className="size-3.5 mr-1.5" /> Không hợp gu
            </Button>
            <Button onClick={onHideBrand} variant="ghost" size="sm" className="flex-1 rounded-none text-[10px] font-mono uppercase tracking-widest text-red-500/70 hover:text-red-600 hover:bg-red-50">
              <EyeOff className="size-3.5 mr-1.5" /> Ẩn Brand
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
