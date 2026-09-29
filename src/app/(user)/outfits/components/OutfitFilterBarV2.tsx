"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
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

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 w-full">
      {/* ── 1. SEGMENTED SLIDING CAPSULE TABS ── */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth"
        >
          {tabs.map((tab) => {
            const isActive = filterParam === tab.value;

            return (
              <motion.button
                key={tab.value}
                type="button"
                onClick={() => onFilterChange(tab.value)}
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
      </div>

      {/* ── 2. REFINED SORT PILL (Atelier Glass Control) ── */}
      <div className="flex items-center justify-end shrink-0">
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
