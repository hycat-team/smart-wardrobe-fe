import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { GhostItem } from "../types";
import { Check, ArrowDown, ArrowUp, X, BookmarkPlus, ShoppingBag, EyeOff, ThumbsDown, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SampleFeedbackPayload, VoteType } from "@/features/brand-portal/types";

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
  onFeedback?: (itemId: string, payload: SampleFeedbackPayload) => void;
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
  onFeedback,
}: WardrobeImpactPanelProps) {
  const [voteType, setVoteType] = useState<VoteType | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Reset state when sheet opens/closes or item changes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setVoteType(null);
      setRating(0);
      setFeedbackText("");
      onClose();
    }
  };

  if (!item) return null;

  const formatPrice = (price?: number) => {
    if (price === undefined) return 'Đang cập nhật';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent aria-describedby={undefined} showCloseButton={false} side="right" className="w-full sm:max-w-md bg-background p-0 overflow-hidden border-l border-border flex flex-col h-full sm:rounded-l-3xl shadow-2xl z-200">
        <SheetHeader className="sr-only">
          <SheetTitle>Chi tiết món đồ</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto w-full min-h-0">
          {/* Header Image */}
          <div className="relative aspect-[4/5] w-full bg-muted">
            <Image
              src={item.imageUrl}
              alt={item.brandName}
              fill
              sizes="(max-width: 640px) 100vw, 400px"
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-border shadow-sm">
              Món đồ chưa sở hữu
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-background/80 text-foreground p-2 hover:bg-background transition-colors backdrop-blur-md rounded-full border border-border shadow-sm"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Product Info */}
            <div className="flex flex-col items-center text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">{item.brandName}</p>
              <h2 className="text-2xl font-bold text-foreground mb-2 uppercase tracking-tight">
                {item.category?.name || "Sản phẩm"} {item.color}
              </h2>
              <p className="font-semibold text-lg text-primary">{formatPrice(item.price)}</p>
            </div>

            {/* Wardrobe Impact */}
            {/* <div className="space-y-5 bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                  Wardrobe Impact
                </h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-full text-primary shrink-0 mt-0.5">
                    <Check className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-semibold">Phù hợp với {item.wardrobeImpact.compatibleItemCount} món đồ</p>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">Bạn đang sở hữu</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-full text-primary shrink-0 mt-0.5">
                    <Check className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-semibold">Tạo thêm {item.wardrobeImpact.newOutfitsUnlocked} outfits mới</p>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">Mở rộng lựa chọn</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-full text-primary shrink-0 mt-0.5">
                    <Check className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-semibold">Lý tưởng cho {item.wardrobeImpact.suitableOccasions.join(', ')}</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="bg-green-500/10 p-1.5 rounded-full text-green-600 shrink-0 mt-0.5">
                    <ArrowDown className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-semibold">Rủi ro trùng lặp: Thấp</p>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">Bạn chưa có món tương tự</p>
                  </div>
                </li>

                {item.wardrobeImpact.wardrobeGapFilled && (
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 p-1.5 rounded-full text-primary shrink-0 mt-0.5">
                      <ArrowUp className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground font-semibold">Lấp đầy khoảng trống {item.wardrobeImpact.wardrobeGapFilled}</p>
                    </div>
                  </li>
                )}
              </ul>

              <div className="pt-4 border-t border-border mt-2">
                <div className="flex justify-between items-end mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mức độ hòa hợp màu</span>
                  <span className="text-sm font-bold text-foreground">{item.wardrobeImpact.colorCompatibilityScore}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-1000 rounded-full"
                    style={{ width: `${item.wardrobeImpact.colorCompatibilityScore}%` }}
                  />
                </div>
              </div>
            </div> */}

            {/* Feedback Section */}
            {onFeedback && item.isGhost && (
              <div className="space-y-4 bg-card border border-border rounded-2xl p-5 shadow-sm mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                    Đánh giá mẫu thiết kế này
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setVoteType('like')}
                    className={cn("h-10 text-[10px] font-bold uppercase tracking-widest border-border hover:bg-muted", voteType === 'like' && "bg-primary text-primary-foreground border-primary hover:bg-primary/90")}
                  >
                    👍 Thích
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setVoteType('dislike')}
                    className={cn("h-10 text-[10px] font-bold uppercase tracking-widest border-border hover:bg-muted", voteType === 'dislike' && "bg-primary text-primary-foreground border-primary hover:bg-primary/90")}
                  >
                    👎 Không thích
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setVoteType('would_buy')}
                    className={cn("h-10 text-[10px] font-bold uppercase tracking-widest border-border hover:bg-muted", voteType === 'would_buy' && "bg-primary text-primary-foreground border-primary hover:bg-primary/90")}
                  >
                    🛒 Sẽ mua
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setVoteType('not_interested')}
                    className={cn("h-10 text-[10px] font-bold uppercase tracking-widest border-border hover:bg-muted", voteType === 'not_interested' && "bg-primary text-primary-foreground border-primary hover:bg-primary/90")}
                  >
                    — Bỏ qua
                  </Button>
                </div>

                <div>
                   <textarea 
                      placeholder="Chia sẻ ý kiến của bạn về thiết kế, chất liệu, màu sắc..."
                      value={feedbackText}
                      onChange={e => setFeedbackText(e.target.value)}
                      maxLength={500}
                      className="w-full min-h-[80px] text-sm p-3 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary bg-background resize-none"
                   />
                </div>

                <Button 
                  onClick={async () => {
                     if (!voteType) return;
                     setIsSubmittingFeedback(true);
                     try {
                        await onFeedback(item.id, { voteType, feedbackText, rating });
                        setVoteType(null);
                        setFeedbackText("");
                        setRating(0);
                     } finally {
                        setIsSubmittingFeedback(false);
                     }
                  }}
                  disabled={!voteType || isSubmittingFeedback}
                  className="w-full text-[10px] font-bold uppercase tracking-widest rounded-xl"
                >
                  {isSubmittingFeedback ? "Đang gửi..." : "Gửi đánh giá cho Brand"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-5 border-t border-border bg-background/90 backdrop-blur-md shrink-0 space-y-4">

          <Button
            onClick={onWaitlist}
            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] font-bold tracking-widest uppercase h-12 shadow-sm"
          >

            <ShoppingBag className="size-3.5 mr-1.5" /> Thêm giỏ hàng
          </Button>

          <div className="flex gap-2 justify-between">
            <Button onClick={onSwap} variant="ghost" size="sm" className="flex-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted">
              <RefreshCcw className="size-3.5 mr-1.5" />  Đổi món khác
            </Button>
            <Button onClick={onSave} variant="ghost" size="sm" className="flex-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted">
              <BookmarkPlus className="size-3.5 mr-1.5" /> Lưu
            </Button>
            <Button onClick={onNotMyStyle} variant="ghost" size="sm" className="flex-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-destructive hover:text-destructive hover:bg-destructive/10">
              <ThumbsDown className="size-3.5 mr-1.5" /> Bỏ qua
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
