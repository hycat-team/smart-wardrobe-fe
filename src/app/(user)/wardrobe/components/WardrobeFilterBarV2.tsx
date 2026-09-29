"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryRes, WardrobeCategoryDistribution } from "@/features/wardrobe/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface WardrobeFilterBarV2Props {
  categories?: CategoryRes[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  sortParam: string;
  onSortChange: (value: string) => void;
  distribution?: WardrobeCategoryDistribution | null;
  totalItems?: number;
}

export function WardrobeFilterBarV2({
  categories = [],
  selectedCategorySlug,
  onSelectCategory,
  sortParam,
  onSortChange,
  distribution,
  totalItems,
}: WardrobeFilterBarV2Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2 w-full">
      {/* ── 1. SEGMENTED SLIDING CAPSULE TABS (Atelier Lookbook Strip) ── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Thanh trượt tab với hiệu ứng bo tròn kén tằm (Capsule Pill) */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth"
        >
          {allCategories.map((cat) => {
            const isActive = selectedCategorySlug === cat.slug;

            return (
              <motion.button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
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
      </div>

      {/* ── 2. REFINED SORT PILL (Atelier Glass Control) ── */}
      <div className="flex items-center justify-end shrink-0">
        <div className="flex items-center gap-2 rounded-full border border-stone-200/90 dark:border-stone-800 bg-card dark:bg-stone-900/80 backdrop-blur-md px-4 py-2 shadow-xs hover:border-foreground/30 transition-all">
          <ArrowUpDown className="size-3.5 text-muted-foreground shrink-0" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground shrink-0">
            Sắp xếp
          </span>
          <Select value={sortParam} onValueChange={(val) => { if (val) onSortChange(val); }}>
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
                value="Mới nhất"
                className="text-xs font-medium cursor-pointer rounded-xl"
              >
                Mới nhất
              </SelectItem>
              <SelectItem
                value="Cũ nhất"
                className="text-xs font-medium cursor-pointer rounded-xl"
              >
                Cũ nhất
              </SelectItem>
              <SelectItem
                value="Tên"
                className="text-xs font-medium cursor-pointer rounded-xl"
              >
                Theo tên (A-Z)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
