"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CategoryRes,
  WardrobeCategoryDistribution,
} from "@/features/wardrobe/types";

export interface WardrobeFilterBarV2Props {
  categories?: CategoryRes[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  distribution?: WardrobeCategoryDistribution | null;
  totalItems?: number;
}

export function WardrobeFilterBarV2({
  categories = [],
  selectedCategorySlug,
  onSelectCategory,
  distribution,
  totalItems,
}: WardrobeFilterBarV2Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Trạng thái nhận diện tràn và nút điều hướng
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Tạo map tra cứu số lượng theo category slug/name
  const countMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!distribution?.categories) return map;

    for (const item of distribution.categories) {
      if (item.categoryName) {
        map.set(item.categoryName.toLowerCase().trim(), item.itemCount);
      }
      if (item.categoryId) {
        map.set(item.categoryId, item.itemCount);
      }
    }
    return map;
  }, [distribution]);

  const allCount = totalItems ?? distribution?.totalItems ?? 0;

  const allCategories = useMemo(() => {
    return [
      { id: "all", name: "Tất cả", slug: "", count: allCount },
      ...categories.map((cat) => {
        const c =
          countMap.get(cat.name.toLowerCase().trim()) ??
          countMap.get(cat.id) ??
          0;
        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          count: c,
        };
      }),
    ];
  }, [categories, countMap, allCount]);

  // Kiểm tra trạng thái cuộn
  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    const hasOverflow = maxScroll > 2;

    setCanScrollLeft(hasOverflow && scrollLeft > 4);
    setCanScrollRight(hasOverflow && scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState, allCategories]);

  // Cuộn sang trái hoặc phải
  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(200, el.clientWidth * 0.65);
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleCategoryClick = (
    slug: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    onSelectCategory(slug);
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2 w-full">
      {/* ── 1. SEGMENTED SLIDING CAPSULE TABS (Ẩn thanh cuộn, giữ nút điều hướng & gradient) ── */}
      <div className="relative flex-1 min-w-0">
        <div className="relative overflow-hidden group">
          {/* Nút & Hiệu ứng làm mờ bên trái */}
          <AnimatePresence>
            {canScrollLeft && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background via-background/80 to-transparent z-10"
                />
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={() => handleScroll("left")}
                  className="absolute left-1 top-1/2 -translate-y-1/2 z-20 size-7.5 rounded-full bg-background/95 dark:bg-stone-900/95 border border-border shadow-md backdrop-blur-md flex items-center justify-center text-foreground hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  aria-label="Cuộn sang trái"
                >
                  <ChevronLeft className="size-4" />
                </motion.button>
              </>
            )}
          </AnimatePresence>

          {/* Thanh trượt tab - Ẩn hoàn toàn scrollbar */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {allCategories.map((cat) => {
              const isActive = selectedCategorySlug === cat.slug;

              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  onClick={(e) => handleCategoryClick(cat.slug, e)}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-colors whitespace-nowrap cursor-pointer select-none group shrink-0",
                    isActive
                      ? "text-background dark:text-stone-900"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {/* Active Indicator Sliding Capsule */}
                  {isActive && (
                    <motion.div
                      layoutId="wardrobe-active-category-pill"
                      className="absolute inset-0 rounded-full bg-foreground dark:bg-stone-100 shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 32,
                      }}
                    />
                  )}

                  {/* Tên danh mục */}
                  <span className="relative z-10">{cat.name}</span>

                  {/* Badge số lượng item */}
                  {cat.count !== undefined && cat.count > 0 && (
                    <span
                      className={cn(
                        "relative z-10 px-2 py-0.5 rounded-full font-mono text-[11px] font-bold transition-colors leading-none tracking-normal",
                        isActive
                          ? "bg-background/25 dark:bg-stone-900/15 text-background dark:text-stone-900"
                          : "bg-muted text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {cat.count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Nút & Hiệu ứng làm mờ bên phải */}
          <AnimatePresence>
            {canScrollRight && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background via-background/80 to-transparent z-10"
                />
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={() => handleScroll("right")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 z-20 size-7.5 rounded-full bg-background/95 dark:bg-stone-900/95 border border-border shadow-md backdrop-blur-md flex items-center justify-center text-foreground hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  aria-label="Cuộn sang phải"
                >
                  <ChevronRight className="size-4" />
                </motion.button>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
