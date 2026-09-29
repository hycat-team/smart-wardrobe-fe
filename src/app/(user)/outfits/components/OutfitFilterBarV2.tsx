"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { OutfitRes as Outfit } from "@/features/outfits/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type OutfitSortOption = "Mới Nhất" | "Cũ Nhất";

export interface OutfitFilterBarV2Props {
  filterParam: string;
  onFilterChange: (filter: string) => void;
  sortParam: OutfitSortOption;
  onSortChange: (sort: OutfitSortOption) => void;
  outfits?: Outfit[];
  totalItems?: number;
}

export function OutfitFilterBarV2({
  filterParam,
  onFilterChange,
  sortParam,
  onSortChange,
  outfits = [],
  totalItems,
}: OutfitFilterBarV2Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const tabs = useMemo(() => {
    const allCount = totalItems ?? outfits.length;
    const aiCount = outfits.filter((o) => o.status === 1).length;
    const manualCount = outfits.filter(
      (o) => o.status === 0 || o.status === 2
    ).length;

    return [
      { label: "Tất cả", value: "all", count: allCount },
      { label: "Tạo bởi AI", value: "ai", count: aiCount },
      { label: "Thủ công", value: "manual", count: manualCount },
    ];
  }, [outfits, totalItems]);

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
  }, [updateScrollState, tabs]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(160, el.clientWidth * 0.65);
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleTabClick = (
    value: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    onFilterChange(value);
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 w-full">
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
                  className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-background via-background/80 to-transparent z-10"
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

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab) => {
              const isActive = filterParam === tab.value;

              return (
                <motion.button
                  key={tab.value}
                  type="button"
                  onClick={(e) => handleTabClick(tab.value, e)}
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
                      layoutId="outfit-active-filter-pill"
                      className="absolute inset-0 rounded-full bg-foreground dark:bg-stone-100 shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 32,
                      }}
                    />
                  )}

                  {/* Tên danh mục */}
                  <span className="relative z-10">{tab.label}</span>

                  {/* Badge số lượng outfit */}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={cn(
                        "relative z-10 px-2 py-0.5 rounded-full font-mono text-[11px] font-bold transition-colors leading-none tracking-normal",
                        isActive
                          ? "bg-background/25 dark:bg-stone-900/15 text-background dark:text-stone-900"
                          : "bg-muted text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {tab.count}
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
                  className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background via-background/80 to-transparent z-10"
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

      {/* ── 2. REFINED SORT PILL (Atelier Glass Control) ── */}
      <div className="flex items-center justify-end shrink-0 self-end sm:self-center">
        <div className="flex items-center gap-2 rounded-full border border-stone-200/90 dark:border-stone-800 bg-card dark:bg-stone-900/80 backdrop-blur-md px-4 py-2 shadow-xs hover:border-foreground/30 transition-all">
          <ArrowUpDown className="size-3.5 text-muted-foreground shrink-0" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground shrink-0">
            Sắp xếp
          </span>
          <Select
            value={sortParam}
            onValueChange={(val) => {
              if (val) onSortChange(val as OutfitSortOption);
            }}
          >
            <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-xs font-semibold uppercase tracking-widest text-foreground w-auto gap-1 cursor-pointer">
              <SelectValue placeholder="Mới nhất" />
            </SelectTrigger>
            <SelectContent
              alignItemWithTrigger={false}
              align="end"
              sideOffset={6}
              className="rounded-2xl border-border bg-card shadow-lg"
            >
              <SelectItem
                value="Mới Nhất"
                className="text-xs font-medium cursor-pointer rounded-xl"
              >
                Mới nhất
              </SelectItem>
              <SelectItem
                value="Cũ Nhất"
                className="text-xs font-medium cursor-pointer rounded-xl"
              >
                Cũ nhất
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
