'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Eye, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WardrobeItemRes as WardrobeItem } from '@/features/wardrobe/types';
import { applyCloudinaryTrim } from '@/lib/cloudinary';

export interface WardrobeCardV2Props {
  item: WardrobeItem;
  isLocked?: boolean;
  isProcessing?: boolean;
  isSelectMode?: boolean;
  isSelected?: boolean;
  onClick: () => void;
  getWardrobeItemName?: (item: WardrobeItem) => string;
  hideDetails?: boolean;
  hideTitle?: boolean;
  priority?: boolean;
  onQuickOutfit?: (item: WardrobeItem) => void;
}

export function WardrobeCardV2({
  item,
  isLocked = false,
  isProcessing = false,
  isSelectMode = false,
  isSelected = false,
  onClick,
  getWardrobeItemName,
  hideDetails = false,
  hideTitle = false,
  priority = false,
  onQuickOutfit,
}: WardrobeCardV2Props) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Trích xuất metadata thời trang
  const fashion = item.fashionItem;
  const categoryName =
    item.category?.name ||
    fashion?.category?.name ||
    (typeof item.category === 'string' ? item.category : '') ||
    'Trang phục';

  const colorName = fashion?.color || (item as any).color;
  const colorHex = fashion?.colorHex || (item as any).colorHex;
  const styleName = fashion?.style || (item as any).style;
  const material = fashion?.material || (item as any).material;
  const brandName = item.brandItem?.brandName || item.brandItem?.name || (item as any).brand;

  // Tiêu đề trang phục tinh tế
  const rawTitle =
    item.brandItem?.name ||
    fashion?.description ||
    (getWardrobeItemName ? getWardrobeItemName(item) : categoryName);

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className={cn(
        'group relative flex flex-col h-full rounded-2xl bg-card dark:bg-[#18181b] border border-stone-200/90 dark:border-stone-800 overflow-hidden cursor-pointer select-none',
        'shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05),0_1px_3px_0_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.5)] transition-shadow duration-300',
        isSelectMode && isSelected && 'ring-2 ring-foreground border-transparent shadow-md',
        isLocked && 'opacity-65 grayscale-[0.3]'
      )}
      style={{
        boxShadow:
          isHovered && colorHex
            ? `0 16px 36px -10px ${colorHex}25, 0 4px 12px -2px rgba(0,0,0,0.06)`
            : undefined,
      }}
    >
      {/* ── 1. FRAME ẢNH ATELIER STUDIO (Aspect 4/5) ─────────────────────────── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-stone-100/70 via-stone-50/40 to-stone-100/70 dark:from-stone-900/60 dark:via-stone-950/40 dark:to-stone-900/60 p-4 sm:p-5 flex items-center justify-center">
        {/* Ảnh trang phục đã tách nền */}
        <div className="relative w-full h-full">
          <Image
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            alt={rawTitle}
            src={applyCloudinaryTrim(fashion?.imageUrl || (item as any).imageUrl || '')}
            unoptimized
            className={cn(
              'object-contain drop-shadow-md transition-transform duration-500 ease-out will-change-transform',
              !isProcessing && 'group-hover:scale-105',
              isProcessing && 'blur-md opacity-50'
            )}
          />
        </div>

        {/* Top Header: Badge Danh mục & Swatch Màu */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
          {/* Badge Danh mục */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-background/90 dark:bg-stone-900/90 backdrop-blur-md border border-border/60 text-foreground/80 shadow-xs">
            {categoryName}
          </span>

          {/* Color Indicator với Halo */}
          {colorHex && (
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/90 dark:bg-stone-900/90 backdrop-blur-md border border-border/60 shadow-xs"
              title={colorName ? `Màu: ${colorName}` : undefined}
            >
              <span
                className="size-2.5 rounded-full ring-1 ring-black/15 dark:ring-white/25 shrink-0"
                style={{ backgroundColor: colorHex }}
              />
              {colorName && (
                <span className="text-[10px] font-medium text-muted-foreground max-w-[64px] truncate">
                  {colorName}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Lock Overlay khi item bị khóa */}
        {isLocked && (
          <div className="absolute top-3 right-3 z-20 size-7 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center border border-border/60 shadow-xs">
            <Lock className="size-3.5 text-muted-foreground" />
          </div>
        )}

        {/* Selection Checkbox (Select Mode) */}
        {isSelectMode && (
          <div className="absolute top-3 left-3 z-20">
            <motion.div
              initial={false}
              animate={{ scale: isSelected ? 1 : 0.9 }}
              className={cn(
                'size-6 rounded-full flex items-center justify-center border shadow-xs transition-colors',
                isSelected
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background/90 border-border text-transparent hover:border-foreground/60'
              )}
            >
              <Check className="size-3.5 stroke-[2.5]" />
            </motion.div>
          </div>
        )}

        {/* AI Processing State */}
        {isProcessing && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/60 backdrop-blur-xs">
            <div className="size-7 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-2" />
            <span className="text-[10px] font-mono uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-card border border-border text-foreground shadow-sm">
              AI Đang Xử Lý
            </span>
          </div>
        )}

        {/* Floating Quick Action Pill khi Hover */}
        <AnimatePresence>
          {isHovered && !isSelectMode && !isProcessing && !isLocked && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-center gap-1.5 p-1 rounded-xl bg-background/95 dark:bg-stone-900/95 backdrop-blur-md border border-border/80 shadow-lg"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onQuickOutfit) {
                    onQuickOutfit(item);
                  } else {
                    router.push('/outfits/create');
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors active:scale-95"
              >
                <Sparkles className="size-3.5 text-[#D9C5B2]" />
                <span>Phối đồ</span>
              </button>
              <div className="w-px h-3.5 bg-border" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95"
              >
                <Eye className="size-3.5" />
                <span>Chi tiết</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 2. PHẦN THÔNG TIN ATELIER REFINED ───────────────────────────── */}
      {(!hideTitle || !hideDetails) && (
        <div className="flex flex-col p-3.5 sm:p-4 bg-card dark:bg-[#18181b] flex-grow justify-between gap-1.5">
          {/* Tên trang phục thanh lịch */}
          {!hideTitle && (
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
              {rawTitle}
            </h3>
          )}

          {/* Dòng đặc tả phong cách / chất liệu / thương hiệu */}
          {!hideDetails && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-hidden">
              {styleName && <span className="shrink-0">{styleName}</span>}
              {styleName && (material || brandName) && <span className="opacity-40">•</span>}
              {material && <span className="truncate">{material}</span>}
              {material && brandName && <span className="opacity-40">•</span>}
              {brandName && (
                <span className="truncate font-medium text-foreground/80">{brandName}</span>
              )}
              {!styleName && !material && !brandName && (
                <span className="text-[11px] font-mono text-muted-foreground/80 uppercase tracking-widest">
                  Atelier Item
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
