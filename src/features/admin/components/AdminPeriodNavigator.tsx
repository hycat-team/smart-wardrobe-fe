'use client';

import { useId, useState } from 'react';
import { vi } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { AdminPeriodNavigatorProps, PeriodPreset } from '../types/period';
import {
  createDateVN,
  formatPeriodLabel,
  getPeriodDateRange,
  isAtCurrentPeriod,
  navigatePeriod,
  parseVNDateParts,
  vnDate,
} from '../utils/period';

const PRESET_OPTIONS: { id: PeriodPreset; label: string }[] = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'this_week', label: 'Tuần này' },
  { id: 'this_month', label: 'Tháng này' },
  { id: 'this_year', label: 'Năm này' },
  { id: 'custom', label: 'Tuỳ chọn' },
];

export function AdminPeriodNavigator({
  preset = 'this_month',
  fromDate,
  toDate,
  onChange,
  isLoading = false,
  className,
}: AdminPeriodNavigatorProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverId = useId();

  // Khởi tạo date range cho Popover Calendar
  const [range, setRange] = useState<DateRange | undefined>(() => {
    try {
      if (fromDate && toDate) {
        const fp = parseVNDateParts(fromDate);
        const tp = parseVNDateParts(toDate);
        return {
          from: createDateVN(fp.year, fp.month, fp.day),
          to: createDateVN(tp.year, tp.month, tp.day),
        };
      }
    } catch {
      // fallback
    }
    return undefined;
  });

  const isAtCurrent = isAtCurrentPeriod(preset, toDate);
  const labelText = formatPeriodLabel(preset, fromDate, toDate);

  // Xử lý khi nhấn 1 trong 4 preset cố định
  const handleSelectPreset = (newPreset: PeriodPreset) => {
    if (newPreset === 'custom') {
      setIsPopoverOpen(true);
      return;
    }
    const rangeResult = getPeriodDateRange(newPreset);
    onChange({
      preset: newPreset,
      fromDate: rangeResult.fromDate,
      toDate: rangeResult.toDate,
    });
  };

  // Xử lý khi nhấn nút lùi ◀ hoặc tiến ▶
  const handleStep = (direction: 'prev' | 'next') => {
    if (direction === 'next' && isAtCurrent) return;
    const result = navigatePeriod(direction, { preset, fromDate, toDate });
    onChange({
      preset: result.preset,
      fromDate: result.fromDate,
      toDate: result.toDate,
    });
  };

  // Áp dụng khoảng ngày tùy chọn từ Calendar
  const handleApplyCustomRange = () => {
    if (!range?.from || !range?.to) return;
    const newFrom = vnDate(range.from);
    const newTo = vnDate(range.to);
    setIsPopoverOpen(false);
    onChange({
      preset: 'custom',
      fromDate: newFrom,
      toDate: newTo,
    });
  };

  // Đặt lại khoảng ngày tùy chọn
  const handleResetCustomRange = () => {
    const defaultRange = getPeriodDateRange('this_month');
    const fp = parseVNDateParts(defaultRange.fromDate);
    const tp = parseVNDateParts(defaultRange.toDate);
    setRange({
      from: createDateVN(fp.year, fp.month, fp.day),
      to: createDateVN(tp.year, tp.month, tp.day),
    });
  };

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 text-xs select-none',
        className
      )}
      role="region"
      aria-label="Bộ điều hướng kỳ thời gian"
    >
      {/* Nút ◀ Lùi kỳ */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9 shrink-0 rounded-full border-border/80 bg-background/80 hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary/40"
        onClick={() => handleStep('prev')}
        aria-label="Kỳ trước"
        title="Lùi về kỳ trước"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {/* Nhóm nút Preset Pills */}
      <div
        className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/40 p-1 shadow-xs"
        role="group"
        aria-label="Danh sách chu kỳ nhanh"
      >
        {PRESET_OPTIONS.map((item) => {
          const isActive = preset === item.id;
          return (
            <Button
              key={item.id}
              type="button"
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'h-7 rounded-full px-3 text-xs font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => handleSelectPreset(item.id)}
              aria-pressed={isActive}
            >
              {item.label}
            </Button>
          );
        })}
      </div>

      {/* Nút ▶ Tiến kỳ */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          'size-9 shrink-0 rounded-full border-border/80 bg-background/80 hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary/40',
          isAtCurrent && 'opacity-40 cursor-not-allowed hover:bg-background/80'
        )}
        onClick={() => handleStep('next')}
        disabled={isAtCurrent}
        aria-label="Kỳ sau"
        aria-disabled={isAtCurrent}
        title={isAtCurrent ? 'Đang ở kỳ hiện tại' : 'Tiến tới kỳ kế tiếp'}
      >
        <ChevronRight className="size-4" />
      </Button>

      {/* Nhãn kỳ kết hợp Popover chọn ngày tùy chọn */}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger
          className="inline-flex h-9 items-center justify-start gap-2 rounded-full border border-border/80 bg-background px-3.5 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary/40 outline-none"
          aria-label={`Khoảng thời gian đang chọn: ${labelText}`}
          aria-expanded={isPopoverOpen}
          aria-controls={popoverId}
        >
          {isLoading ? (
            <Loader2 className="size-3.5 animate-spin text-primary" />
          ) : (
            <CalendarDays className="size-3.5 text-primary shrink-0" />
          )}
          <span className="truncate max-w-[240px] sm:max-w-none">{labelText}</span>
        </PopoverTrigger>

        <PopoverContent
          id={popoverId}
          className="w-auto p-3 shadow-lg border-border"
          align="end"
        >
          <div className="space-y-3">
            <div className="text-xs font-semibold text-foreground px-1">
              Chọn khoảng ngày tùy chọn
            </div>

            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              locale={vi}
              disabled={{ after: new Date() }}
              defaultMonth={range?.from || new Date()}
              captionLayout="dropdown"
            />

            <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleResetCustomRange}
                className="text-xs h-8 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="mr-1 size-3" />
                Đặt lại
              </Button>

              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPopoverOpen(false)}
                  className="text-xs h-8"
                >
                  Đóng
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleApplyCustomRange}
                  disabled={!range?.from || !range?.to}
                  className="text-xs h-8 bg-primary text-primary-foreground font-medium"
                >
                  Áp dụng
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
