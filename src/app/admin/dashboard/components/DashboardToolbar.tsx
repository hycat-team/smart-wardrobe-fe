'use client';

import { useState } from 'react';
import { format, parse } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import { CalendarDays, Clock3, RefreshCw, RotateCcw } from 'lucide-react';
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
} from '@/features/admin/utils/dashboard';

export function DashboardToolbar({
  filters,
  updatedAt,
  isRefreshing,
  onApply,
  onReset,
  onRefresh,
}: {
  filters: DashboardFilters;
  updatedAt?: string | null;
  isRefreshing: boolean;
  onApply: (fromDate: string, toDate: string) => void;
  onReset: () => void;
  onRefresh: () => void;
}) {
  const [range, setRange] = useState<DateRange | undefined>({
    from: parse(filters.fromDate, DASHBOARD_DATE_FORMAT, new Date()),
    to: parse(filters.toDate, DASHBOARD_DATE_FORMAT, new Date()),
  });

  const applyRange = () => {
    if (!range?.from || !range.to) return;
    onApply(
      format(range.from, DASHBOARD_DATE_FORMAT),
      format(range.to, DASHBOARD_DATE_FORMAT),
    );
  };

  const rangeLabel =
    range?.from && range.to
      ? `${format(range.from, 'dd/MM/yyyy')} – ${format(range.to, 'dd/MM/yyyy')}`
      : 'Chọn khoảng ngày';

  return (
    <div className="flex flex-col gap-6 border-b border-border pb-6 pt-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        {/* <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          <span className="size-2 rounded-full bg-primary" />
          System intelligence
        </div> */}
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Tổng quan vận hành
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Theo dõi người dùng, doanh thu, chi phí AI và chất lượng thanh toán
          từ cùng một nguồn dữ liệu.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock3 className="size-3.5" aria-hidden="true" />
          Snapshot gần nhất: {formatDashboardDateTime(updatedAt)}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Popover>
          <PopoverTrigger
            className="inline-flex h-11 min-w-64 items-center justify-start gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground shadow-sm outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/60"
            aria-label="Chọn khoảng ngày dashboard"
          >
            <CalendarDays className="size-4 text-muted-foreground" />
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
              >
                <RotateCcw className="size-3.5" />
                Đặt lại
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={applyRange}
                disabled={!range?.from || !range.to}
              >
                Áp dụng
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Làm mới dữ liệu dashboard"
        >
          <RefreshCw
            className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          {isRefreshing ? 'Đang tải' : 'Làm mới'}
        </Button>
      </div>
    </div>
  );
}
