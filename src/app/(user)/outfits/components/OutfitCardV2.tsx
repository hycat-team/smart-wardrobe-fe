'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Trash2, ArrowUpRight, Shirt, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OutfitRes as Outfit } from '@/features/outfits/types';
import { applyCloudinaryTrim } from '@/lib/cloudinary';

export interface OutfitCardV2Props {
  outfit: Outfit;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  index?: number;
}

export function OutfitCardV2({ outfit, onDelete, index = 0 }: OutfitCardV2Props) {
  const router = useRouter();

  const itemsInOutfit = outfit.items || [];
  const coverImage =
    outfit.coverImageUrl ||
    itemsInOutfit[0]?.fashionItem?.imageUrl ||
    itemsInOutfit[0]?.wardrobeItem?.fashionItem?.imageUrl ||
    (itemsInOutfit[0]?.wardrobeItem as any)?.imageUrl;

  // Trích xuất ảnh thumbnail của tối đa 3 món đồ trong bộ phối
  const previewItemImages = itemsInOutfit
    .map((item) => {
      return (
        item.fashionItem?.imageUrl ||
        item.wardrobeItem?.fashionItem?.imageUrl ||
        (item.wardrobeItem as any)?.imageUrl
      );
    })
    .filter(Boolean)
    .slice(0, 3);

  // Định dạng ngày tạo
  const formattedDate = outfit.createdAt
    ? new Date(outfit.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';

  const pieceCount = itemsInOutfit.length;

  return (
    <motion.div
      onClick={() => router.push(`/outfits/${outfit.id}`)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className={cn(
        'group relative flex flex-col h-full rounded-2xl bg-card dark:bg-[#18181b] border border-stone-200/90 dark:border-stone-800 overflow-hidden cursor-pointer select-none',
        'shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05),0_1px_3px_0_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.5)] transition-shadow duration-300'
      )}
    >
      {/* ── 1. FRAME CANVAS ATELIER LOOKBOOK (Aspect 4/5) ───────────────────── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-stone-100/70 via-stone-50/40 to-stone-100/70 dark:from-stone-900/60 dark:via-stone-950/40 dark:to-stone-900/60 p-2 sm:p-2.5 flex items-center justify-center">
        {/* Ảnh phối đồ Canvas */}
        {coverImage ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={applyCloudinaryTrim(coverImage)}
              alt={outfit.name || 'Outfit'}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-contain drop-shadow-md transition-transform duration-500 ease-out will-change-transform scale-[1]"
              priority={index < 4}
              unoptimized
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center">
              <Shirt className="size-6 stroke-1 text-muted-foreground/60" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70">
              Chưa có ảnh phối
            </span>
          </div>
        )}

        {/* ── Top Bar: Badges & Quick Controls ── */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
          {/* Badge phân loại AI / Lookbook */}
          <div>
            {outfit.status === 1 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-background/90 dark:bg-stone-900/90 backdrop-blur-md border border-border/60 text-foreground shadow-xs">
                <Sparkles className="size-3 text-amber-500 fill-amber-500/20" />
                <span>AI Curated</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-background/90 dark:bg-stone-900/90 backdrop-blur-md border border-border/60 text-foreground/80 shadow-xs">
                <Layers className="size-3 text-stone-500" />
                <span>Lookbook</span>
              </span>
            )}
          </div>

          {/* Controls: Nút Xóa nhanh khi hover */}
          <div className="flex items-center pointer-events-auto">
            <button
              type="button"
              onClick={(e) => onDelete(outfit.id, e)}
              title="Xóa bộ phối"
              className="size-8 rounded-full bg-background/90 dark:bg-stone-900/90 backdrop-blur-md border border-border/60 flex items-center justify-center shadow-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 hover:text-destructive hover:border-destructive/30"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. PHẦN THÔNG TIN ATELIER REFINED ───────────────────────────── */}
      <div className="flex flex-col p-3.5 sm:p-4 bg-card dark:bg-[#18181b] flex-grow justify-between gap-2.5">
        <div>
          {/* Tên bộ phối kèm indicator mở chi tiết khi hover */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[15px] sm:text-[16px] font-semibold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
              {outfit.name || 'Bộ phối phong cách'}
            </h3>
            <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0" />
          </div>

          {/* Mô tả / Phong cách */}
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {outfit.description || 'Bộ trang phục tinh tế cho ngày năng động'}
          </p>
        </div>

        {/* Footer: Mini item avatars + Số món & Ngày tạo */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
          {/* Item Thumbnails / Piece Count */}
          <div className="flex items-center gap-2">
            {previewItemImages.length > 0 ? (
              <div className="flex items-center -space-x-1.5 overflow-hidden">
                {previewItemImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative size-5 rounded-full ring-2 ring-background bg-stone-100 dark:bg-stone-800 overflow-hidden shrink-0"
                  >
                    <Image
                      src={img}
                      alt="Piece"
                      fill
                      sizes="20px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <span className="font-mono text-[11px] text-muted-foreground">
              {pieceCount > 0 ? `${pieceCount} món đồ` : 'Set hoàn chỉnh'}
            </span>
          </div>

          {/* Ngày tạo */}
          {formattedDate && (
            <span className="font-mono text-[11px] text-muted-foreground/70">{formattedDate}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
