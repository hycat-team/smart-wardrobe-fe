"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CircleSlash,
  LoaderCircle,
  ShoppingBag,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  useCreateSampleFeedback,
  useGetBrandItemDetail,
} from "@/features/brands/queries/user-brands.queries";
import type { VoteType } from "@/features/brand-portal/types";
import type { BrandItemSnapshot } from "@/features/brands/types";

interface BrandItemFeedbackSheetProps {
  isOpen: boolean;
  onClose: () => void;
  brandItemId?: string;
  snapshot?: BrandItemSnapshot;
}

const VOTE_OPTIONS: Array<{
  value: VoteType;
  label: string;
  description: string;
  icon: typeof ThumbsUp;
}> = [
  {
    value: "like",
    label: "Thích",
    description: "Mẫu thiết kế phù hợp với bạn",
    icon: ThumbsUp,
  },
  {
    value: "dislike",
    label: "Không thích",
    description: "Mẫu này chưa đúng sở thích",
    icon: ThumbsDown,
  },
  {
    value: "would_buy",
    label: "Sẵn sàng mua",
    description: "Bạn sẽ cân nhắc mua khi sản xuất",
    icon: ShoppingBag,
  },
  {
    value: "not_interested",
    label: "Không quan tâm",
    description: "Sản phẩm chưa phù hợp nhu cầu",
    icon: CircleSlash,
  },
];

function formatPrice(price?: number) {
  if (price === undefined) return "Đang cập nhật";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function BrandItemFeedbackSheet({
  isOpen,
  onClose,
  brandItemId,
  snapshot,
}: BrandItemFeedbackSheetProps) {
  const [voteType, setVoteType] = useState<VoteType | null>(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  const detailQuery = useGetBrandItemDetail(brandItemId || "");
  const feedbackMutation = useCreateSampleFeedback();
  const detail = detailQuery.data;

  const product = {
    name: detail?.name || snapshot?.name || detail?.fashionItem?.category?.name || snapshot?.categoryName || "Sản phẩm thương hiệu",
    brandName: snapshot?.brandName,
    price: detail?.price ?? snapshot?.price,
    description: detail?.description || detail?.fashionItem?.description || snapshot?.description,
    imageUrl: detail?.fashionItem?.imageUrl || snapshot?.imageUrl,
    categoryName: detail?.fashionItem?.category?.name || snapshot?.categoryName,
    color: detail?.fashionItem?.color || snapshot?.color,
    material: detail?.fashionItem?.material || snapshot?.material,
    style: detail?.fashionItem?.style || snapshot?.style,
  };

  const attributes = [
    ["Danh mục", product.categoryName],
    ["Màu sắc", product.color],
    ["Chất liệu", product.material],
    ["Phong cách", product.style],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  const resetAndClose = () => {
    setVoteType(null);
    setRating(0);
    setFeedbackText("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!brandItemId || !voteType || rating < 1 || rating > 5) return;

    const trimmedFeedback = feedbackText.trim();

    try {
      await feedbackMutation.mutateAsync({
        itemId: brandItemId,
        payload: {
          voteType,
          rating,
          ...(trimmedFeedback ? { feedbackText: trimmedFeedback } : {}),
        },
      });
      resetAndClose();
    } catch {
      // The mutation displays the backend error and the form remains available for retry.
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) resetAndClose(); }}>
      <SheetContent
        side="right"
        className="w-[calc(100%-1rem)] sm:max-w-md p-0 overflow-hidden gap-0"
      >
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="relative aspect-[4/3] bg-muted overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 448px"
                className="object-contain p-8"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Chưa có hình ảnh
              </div>
            )}
            <div className="absolute left-4 top-4 rounded-full border border-border bg-background/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
              Mẫu thiết kế từ brand
            </div>
          </div>

          <div className="p-6 space-y-7">
            <SheetHeader className="p-0 gap-2 text-left">
              {product.brandName && (
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {product.brandName}
                </p>
              )}
              <SheetTitle className="text-2xl uppercase tracking-tight">
                {product.name}
              </SheetTitle>
              <SheetDescription className="sr-only">
                Thông tin và biểu mẫu đánh giá sản phẩm thương hiệu
              </SheetDescription>
              <p className="text-lg font-semibold text-primary">{formatPrice(product.price)}</p>
              {detailQuery.isLoading && (
                <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <LoaderCircle className="size-3.5 animate-spin" /> Đang tải thông tin sản phẩm
                </span>
              )}
              {detailQuery.isError && (
                <p className="text-xs text-muted-foreground">
                  Không thể tải thêm chi tiết. Đang hiển thị thông tin từ gợi ý AI.
                </p>
              )}
            </SheetHeader>

            {(product.description || attributes.length > 0) && (
              <section className="space-y-4 border-y border-border py-5">
                {product.description && (
                  <p className="text-sm leading-6 text-muted-foreground">{product.description}</p>
                )}
                {attributes.length > 0 && (
                  <dl className="grid grid-cols-2 gap-3">
                    {attributes.map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-muted p-3">
                        <dt className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{label}</dt>
                        <dd className="mt-1 text-sm font-semibold text-foreground">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </section>
            )}

            <section className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest">Bạn nghĩ gì về mẫu này?</h3>
                <p className="mt-1 text-xs text-muted-foreground">Chọn một phản hồi phù hợp nhất.</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {VOTE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = voteType === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setVoteType(option.value)}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted",
                      )}
                    >
                      <Icon className="size-4" />
                      <span className="mt-2 block text-[11px] font-bold uppercase tracking-wider">{option.label}</span>
                      <span className={cn("mt-1 block text-[10px] leading-4", isSelected ? "text-primary-foreground/75" : "text-muted-foreground")}>{option.description}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest">Đánh giá tổng thể</p>
                <div className="flex gap-1" role="group" aria-label="Đánh giá từ 1 đến 5 sao">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`${star} sao`}
                      aria-pressed={rating === star}
                      onClick={() => setRating(star)}
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Star className={cn("size-6", star <= rating && "fill-amber-400 text-amber-500")} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="brand-item-feedback" className="mb-2 block text-[10px] font-bold uppercase tracking-widest">
                  Nhận xét thêm <span className="font-normal text-muted-foreground">(không bắt buộc)</span>
                </label>
                <textarea
                  id="brand-item-feedback"
                  value={feedbackText}
                  onChange={(event) => setFeedbackText(event.target.value)}
                  maxLength={500}
                  placeholder="Chia sẻ cảm nhận về thiết kế, màu sắc hoặc chất liệu..."
                  className="min-h-24 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/30"
                />
                <p className="mt-1 text-right text-[10px] text-muted-foreground">{feedbackText.length}/500</p>
              </div>
            </section>
          </div>
        </div>

        <div className="shrink-0 border-t border-border bg-background/95 p-5 backdrop-blur-md">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!brandItemId || !voteType || rating < 1 || feedbackMutation.isPending}
            className="h-12 w-full rounded-full text-[11px] font-bold uppercase tracking-widest"
          >
            {feedbackMutation.isPending ? (
              <><LoaderCircle className="size-4 animate-spin" /> Đang gửi đánh giá...</>
            ) : (
              "Gửi đánh giá"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}