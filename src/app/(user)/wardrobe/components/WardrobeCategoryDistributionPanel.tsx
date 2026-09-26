'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ChevronDown,
  Pin,
  PinOff,
  RefreshCw,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type {
  WardrobeCategoryDistribution,
  WardrobeCategoryDistributionItem,
} from '@/features/wardrobe/types';

// Curated fashion-grade palette with high contrast and harmonious tones
const CATEGORY_PALETTE = [
  { color: '#0d9488', bg: 'rgba(13, 148, 136, 0.08)' }, // Teal
  { color: '#d97706', bg: 'rgba(217, 119, 6, 0.08)' },  // Amber
  { color: '#2563eb', bg: 'rgba(37, 99, 235, 0.08)' },  // Royal Blue
  { color: '#e11d48', bg: 'rgba(225, 29, 72, 0.08)' },   // Rose
  { color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.08)' },  // Violet
  { color: '#059669', bg: 'rgba(5, 150, 105, 0.08)' },  // Emerald
  { color: '#ea580c', bg: 'rgba(234, 88, 12, 0.08)' },   // Orange
  { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.08)' },  // Indigo
];

function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload as WardrobeCategoryDistributionItem;
  const fill = payload[0].payload?.fill || payload[0].color || '#0d9488';

  return (
    <div className="rounded-xl border border-border/80 bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full" style={{ backgroundColor: fill }} />
        <span className="font-semibold text-popover-foreground">{item.categoryName}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-2 font-mono">
        <span className="font-bold text-foreground">{item.itemCount} món</span>
        <span className="text-muted-foreground">
          ({item.percentage.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%)
        </span>
      </div>
    </div>
  );
}

export function WardrobeCategoryDistributionPanel({
  data,
  isLoading,
  isFetching,
  error,
  onRetry,
}: {
  data?: WardrobeCategoryDistribution | null;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const isExpanded = isPinned || isHovered;
  const categories = data?.categories ?? [];

  // Sort descending by itemCount for natural visual hierarchy
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => b.itemCount - a.itemCount);
  }, [categories]);

  const topCategory = sortedCategories[0];
  const hoveredItem = activeIndex !== null ? sortedCategories[activeIndex] : null;
  const activeColor =
    activeIndex !== null
      ? CATEGORY_PALETTE[activeIndex % CATEGORY_PALETTE.length].color
      : null;

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setActiveIndex(null);
    }, 220);
  };

  const togglePinned = () => {
    setIsPinned((prev) => {
      const next = !prev;
      if (!next) {
        setIsHovered(false);
        setActiveIndex(null);
      }
      return next;
    });
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section
      className={cn(
        'group relative overflow-hidden rounded-3xl border bg-card/95 transition-all duration-300',
        isExpanded
          ? 'border-border shadow-md ring-1 ring-border/50'
          : 'border-border/70 hover:border-primary/30 hover:shadow-sm',
        isFetching && 'opacity-80'
      )}
      aria-labelledby="wardrobe-distribution-heading"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header bar: always visible, acts as compact summary and interactive trigger */}
      <div
        role="button"
        tabIndex={0}
        onClick={togglePinned}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            togglePinned();
          }
        }}
        aria-expanded={isExpanded}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {/* Left: Icon and Title */}
        <div className="flex items-center gap-4">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
            <Shirt className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Wardrobe analytics
              </p>
              {categories.length > 0 && (
                <span className="hidden sm:inline-flex items-center rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {categories.length} phân loại
                </span>
              )}
            </div>
            <h2
              id="wardrobe-distribution-heading"
              className="mt-0.5 text-lg font-semibold tracking-tight text-foreground sm:text-xl"
            >
              Phân bổ tủ đồ
            </h2>
          </div>
        </div>

        {/* Middle preview: Mini segmented progress bar when data is loaded */}
        {data && sortedCategories.length > 0 && (
          <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-sm flex-col gap-1.5 px-4">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>Tỷ lệ phân bổ</span>
              <span>
                {sortedCategories[0]?.categoryName}{' '}
                {sortedCategories[0]?.percentage.toFixed(0)}%
              </span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted/70">
              {sortedCategories.map((item, index) => (
                <div
                  key={item.categoryId}
                  className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor:
                      CATEGORY_PALETTE[index % CATEGORY_PALETTE.length].color,
                  }}
                  title={`${item.categoryName}: ${item.itemCount} món (${item.percentage.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%)`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Right: Items count, Pin button and Expand Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          {data && (
            <div className="flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-xs font-semibold text-foreground">
              <span className="font-mono">{data.totalItems}</span>
              <span className="font-normal text-muted-foreground">món</span>
            </div>
          )}

          {/* Pin toggle button to lock open */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePinned();
            }}
            className={cn(
              'hidden sm:flex size-8 items-center justify-center rounded-full transition-colors',
              isPinned
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            title={
              isPinned
                ? 'Bỏ ghim (tự động thu lại khi rời chuột)'
                : 'Ghim mở (giữ luôn hiển thị)'
            }
            aria-label={isPinned ? 'Bỏ ghim phân bổ' : 'Ghim mở phân bổ'}
          >
            {isPinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />}
          </button>

          {/* Expand badge with chevron */}
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
              isExpanded
                ? 'bg-primary/10 text-primary'
                : 'bg-muted/40 text-muted-foreground group-hover:bg-muted group-hover:text-foreground'
            )}
          >
            <span className="hidden md:inline text-[11px]">
              {isPinned ? 'Đã ghim' : isExpanded ? 'Thu lại' : 'Rê chuột xem'}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.25,
                ease: 'easeInOut',
              }}
            >
              <ChevronDown className="size-4" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Expanded body animated with Framer Motion */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="wardrobe-distribution-details"
            initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/60 px-5 py-6 sm:px-6">
              {isLoading && !data ? (
                <div className="grid gap-6 md:grid-cols-[280px_1fr]">
                  <Skeleton className="h-64 rounded-3xl" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Skeleton className="h-24 rounded-2xl" />
                    <Skeleton className="h-24 rounded-2xl" />
                    <Skeleton className="h-24 rounded-2xl" />
                    <Skeleton className="h-24 rounded-2xl" />
                  </div>
                </div>
              ) : error && !data ? (
                <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
                  <p className="text-sm font-medium text-destructive">
                    Không thể tải phân bổ danh mục.
                  </p>
                  <Button
                    className="mt-4 gap-2"
                    size="sm"
                    variant="outline"
                    onClick={onRetry}
                  >
                    <RefreshCw className="size-4" /> Thử lại
                  </Button>
                </div>
              ) : !data || categories.length === 0 ? (
                <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                  <Shirt className="mb-2 size-8 stroke-1 text-muted-foreground/60" />
                  <p>Thêm trang phục để bắt đầu xem phân bổ tủ đồ.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid items-center gap-8 md:grid-cols-[280px_1fr]">
                    {/* Donut Chart with interactive center */}
                    <div className="relative flex h-64 items-center justify-center">
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie
                            data={sortedCategories}
                            dataKey="itemCount"
                            nameKey="categoryName"
                            cx="50%"
                            cy="50%"
                            innerRadius={68}
                            outerRadius={100}
                            paddingAngle={3}
                            stroke="hsl(var(--card))"
                            strokeWidth={2}
                            isAnimationActive={!shouldReduceMotion}
                            animationDuration={600}
                            animationEasing="ease-out"
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                          >
                            {sortedCategories.map((item, index) => {
                              const isItemActive = activeIndex === index;
                              const isDimmed = activeIndex !== null && !isItemActive;
                              return (
                                <Cell
                                  key={item.categoryId}
                                  fill={
                                    CATEGORY_PALETTE[index % CATEGORY_PALETTE.length]
                                      .color
                                  }
                                  opacity={isDimmed ? 0.35 : 1}
                                  style={{
                                    cursor: 'pointer',
                                    transition: 'opacity 0.2s ease',
                                  }}
                                />
                              );
                            })}
                          </Pie>
                          <Tooltip content={<CustomPieTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Interactive Donut Center: dynamically shows hovered category or total */}
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        <AnimatePresence mode="wait">
                          {hoveredItem ? (
                            <motion.div
                              key={hoveredItem.categoryId}
                              initial={{ opacity: 0, scale: 0.92, y: 3 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.92, y: -3 }}
                              transition={{ duration: 0.15 }}
                              className="flex flex-col items-center"
                            >
                              <span
                                className="mb-1 size-2 rounded-full"
                                style={{ backgroundColor: activeColor || undefined }}
                              />
                              <p className="max-w-[120px] truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {hoveredItem.categoryName}
                              </p>
                              <p className="text-3xl font-bold tracking-tight text-foreground">
                                {hoveredItem.itemCount}
                              </p>
                              <p
                                className="text-xs font-semibold"
                                style={{ color: activeColor || undefined }}
                              >
                                {hoveredItem.percentage.toLocaleString('vi-VN', {
                                  maximumFractionDigits: 1,
                                })}
                                %
                              </p>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="default-center"
                              initial={{ opacity: 0, scale: 0.92 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.92 }}
                              transition={{ duration: 0.15 }}
                              className="flex flex-col items-center"
                            >
                              <p className="text-4xl font-bold tracking-tight text-foreground">
                                {data.totalItems}
                              </p>
                              <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                món đồ
                              </p>
                              <p className="mt-1 text-[11px] text-muted-foreground/80">
                                {categories.length} phân loại
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Category Breakdown Cards */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {sortedCategories.map((item, index) => {
                        const palette =
                          CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
                        const isCardActive = activeIndex === index;
                        const isDimmed = activeIndex !== null && !isCardActive;

                        return (
                          <motion.div
                            key={item.categoryId}
                            initial={
                              shouldReduceMotion ? false : { opacity: 0, y: 10 }
                            }
                            animate={{ opacity: isDimmed ? 0.45 : 1, y: 0 }}
                            transition={{
                              duration: 0.22,
                              delay: shouldReduceMotion ? 0 : index * 0.03,
                            }}
                            whileHover={shouldReduceMotion ? undefined : { scale: 1.015 }}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            className={cn(
                              'group relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 cursor-pointer',
                              isCardActive
                                ? 'border-primary/40 bg-card shadow-sm ring-1 ring-primary/20'
                                : 'border-border/60 bg-muted/40 hover:border-border hover:bg-muted/70'
                            )}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex min-w-0 items-center gap-2.5">
                                <span
                                  className="size-2.5 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-125"
                                  style={{
                                    backgroundColor: palette.color,
                                    boxShadow: isCardActive
                                      ? `0 0 8px ${palette.color}`
                                      : 'none',
                                  }}
                                />
                                <p className="truncate text-sm font-medium text-foreground">
                                  {item.categoryName}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-baseline gap-1 text-right">
                                <span className="font-mono text-sm font-bold text-foreground">
                                  {item.itemCount}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  món
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center gap-3">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background/80">
                                <motion.div
                                  className="h-full rounded-full"
                                  initial={
                                    shouldReduceMotion ? false : { width: 0 }
                                  }
                                  animate={{
                                    width: `${Math.min(100, item.percentage)}%`,
                                  }}
                                  transition={{
                                    duration: shouldReduceMotion ? 0 : 0.6,
                                    ease: [0.16, 1, 0.3, 1],
                                    delay: shouldReduceMotion
                                      ? 0
                                      : index * 0.04,
                                  }}
                                  style={{ backgroundColor: palette.color }}
                                />
                              </div>
                              <span className="w-12 text-right font-mono text-xs font-semibold text-muted-foreground">
                                {item.percentage.toLocaleString('vi-VN', {
                                  maximumFractionDigits: 1,
                                })}
                                %
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary insight bar */}
                  {topCategory && (
                    <motion.div
                      initial={
                        shouldReduceMotion ? false : { opacity: 0, y: 6 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.25 }}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/40 bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-3.5 shrink-0 text-primary" />
                        <span>
                          Chiếm đa số:{' '}
                          <strong className="font-semibold text-foreground">
                            {topCategory.categoryName}
                          </strong>{' '}
                          (
                          {topCategory.percentage.toLocaleString('vi-VN', {
                            maximumFractionDigits: 1,
                          })}
                          % · {topCategory.itemCount} món)
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px]">
                        <span>
                          Trung bình:{' '}
                          <strong className="font-mono text-foreground">
                            {(data.totalItems / categories.length).toFixed(1)}
                          </strong>{' '}
                          món / danh mục
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}