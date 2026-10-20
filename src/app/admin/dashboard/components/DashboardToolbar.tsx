'use client';

import { useState } from 'react';
import { format, parse } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import {
  AlertCircle,
  CalendarDays,
  Clock3,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { DashboardFilters } from '@/features/admin/types';
import {
  DASHBOARD_DATE_FORMAT,
  formatDashboardDateTime,
  getPresetDateRange,
} from '@/features/admin/utils/dashboard';

export function DashboardToolbar({
  filters,
  updatedAt,
  isRefreshing,
  errorMessage,
  onApply,
  onReset,
  onRefresh,
}: {
  filters: DashboardFilters;
  updatedAt?: string | null;
  isRefreshing: boolean;
  errorMessage?: string | null;
  onApply: (fromDate: string, toDate: string) => void;
  onReset: () => void;
  onRefresh: () => void;
}) {
  const [range, setRange] = useState<DateRange | undefined>(() => {
    try {
      return {
        from: parse(filters.fromDate, DASHBOARD_DATE_FORMAT, new Date()),
        to: parse(filters.toDate, DASHBOARD_DATE_FORMAT, new Date()),
      };
    } catch {
      return undefined;
    }
  });

  const applyRange = () => {
    if (!range?.from || !range.to) return;
    onApply(
      format(range.from, DASHBOARD_DATE_FORMAT),
      format(range.to, DASHBOARD_DATE_FORMAT),
    );
  };

  const applyPreset = (preset: 'today' | 'this_month' | 'last_30_days') => {
    const p = getPresetDateRange(preset);
    setRange({
      from: parse(p.fromDate, DASHBOARD_DATE_FORMAT, new Date()),
      to: parse(p.toDate, DASHBOARD_DATE_FORMAT, new Date()),
    });
    onApply(p.fromDate, p.toDate);
  };

  const rangeLabel =
    filters.fromDate && filters.toDate
      ? `${format(parse(filters.fromDate, DASHBOARD_DATE_FORMAT, new Date()), 'dd/MM/yyyy')} – ${format(
          parse(filters.toDate, DASHBOARD_DATE_FORMAT, new Date()),
          'dd/MM/yyyy',
        )}`
      : 'Chọn khoảng ngày';

  return (
    <div className="flex flex-col gap-6 border-b border-border pb-6 pt-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <span className="size-2 rounded-full bg-primary" />
            Closy System Operations
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            Tổng quan vận hành
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Theo dõi người dùng, doanh thu, chi phí AI và chất lượng thanh toán
            từ cùng một nguồn dữ liệu thời gian thực.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <Clock3 className="size-3.5 text-primary" aria-hidden="true" />
            <span>Ảnh chụp KPI cập nhật lúc: <strong className="text-foreground">{formatDashboardDateTime(updatedAt)}</strong> (~15 phút/lần)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 rounded-full px-3 text-xs"
              onClick={() => applyPreset('today')}
            >
              Hôm nay
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 rounded-full px-3 text-xs"
              onClick={() => applyPreset('this_month')}
            >
              Tháng này
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 rounded-full px-3 text-xs"
              onClick={() => applyPreset('last_30_days')}
            >
              30 ngày
            </Button>
          </div>

          <Popover>
            <PopoverTrigger
              className="inline-flex h-10 min-w-56 items-center justify-start gap-2 rounded-full border border-border bg-background px-4 text-xs font-semibold text-foreground shadow-sm outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/60"
              aria-label="Chọn khoảng ngày dashboard"
            >
              <CalendarDays className="size-3.5 text-muted-foreground" />
              {rangeLabel}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="end">
              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                locale={vi}
                disabled={{ after: new Date() }}
                defaultMonth={range?.from}
                captionLayout="dropdown"
              />
              <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={onReset}
                  className="text-xs"
                >
                  <RotateCcw className="mr-1 size-3" />
                  Đặt lại
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={applyRange}
                  disabled={!range?.from || !range.to}
                  className="text-xs"
                >
                  Áp dụng
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            variant="outline"
            className="h-10 text-xs"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Làm mới dữ liệu dashboard"
          >
            <RefreshCw
              className={`mr-1.5 size-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            {isRefreshing ? 'Đang tải' : 'Làm mới'}
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
