'use client';

import { useState } from 'react';
import { format, parse } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import {
  AlertCircle,
  CalendarDays,
  Filter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DASHBOARD_DATE_FORMAT,
  getPresetDateRange,
} from '@/features/admin/utils/dashboard';
import { TRANSACTION_STATUS_OPTIONS } from '@/features/admin/utils/transactions';

export function TransactionsToolbar({
  status,
  fromDate,
  toDate,
  limit,
  onFilterChange,
  onReset,
  onRefresh,
  isRefreshing,
  errorMessage,
}: {
  status?: string;
  fromDate?: string;
  toDate?: string;
  limit: number;
  onFilterChange: (updates: {
    status?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
    limit?: number;
  }) => void;
  onReset: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  errorMessage?: string | null;
}) {
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (fromDate && toDate) {
      try {
        return {
          from: parse(fromDate, DASHBOARD_DATE_FORMAT, new Date()),
          to: parse(toDate, DASHBOARD_DATE_FORMAT, new Date()),
        };
      } catch {
        return undefined;
      }
    }
    return undefined;
  });

  const applyRange = (newRange: DateRange | undefined) => {
    if (!newRange?.from || !newRange.to) return;
    onFilterChange({
      fromDate: format(newRange.from, DASHBOARD_DATE_FORMAT),
      toDate: format(newRange.to, DASHBOARD_DATE_FORMAT),
    });
  };

  const applyPreset = (preset: 'today' | 'this_month' | 'last_30_days') => {
    const p = getPresetDateRange(preset);
    setRange({
      from: parse(p.fromDate, DASHBOARD_DATE_FORMAT, new Date()),
      to: parse(p.toDate, DASHBOARD_DATE_FORMAT, new Date()),
    });
    onFilterChange({ fromDate: p.fromDate, toDate: p.toDate });
  };

  const rangeLabel =
    fromDate && toDate
      ? `${format(parse(fromDate, DASHBOARD_DATE_FORMAT, new Date()), 'dd/MM/yyyy')} – ${format(
          parse(toDate, DASHBOARD_DATE_FORMAT, new Date()),
          'dd/MM/yyyy',
        )}`
      : 'Khoảng thời gian';

  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 pt-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <span className="size-2 rounded-full bg-primary" />
            Cổng thanh toán PayOS
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Giao dịch & Đối soát
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi, tra cứu trạng thái và thực hiện các quyết định xử lý đối soát thanh toán thủ công.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 text-xs"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`mr-1.5 size-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            {isRefreshing ? 'Đang tải' : 'Làm mới'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-10 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-1.5 size-3.5" />
            Đặt lại
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs font-medium text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="w-full sm:w-56">
          <Select
            value={status || 'all'}
            onValueChange={(val) =>
              onFilterChange({ status: val === 'all' ? null : val })
            }
          >
            <SelectTrigger className="h-10 text-xs">
              <Filter className="mr-2 size-3.5 text-muted-foreground" />
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {TRANSACTION_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Presets */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 rounded-lg px-2.5 text-xs"
            onClick={() => applyPreset('today')}
          >
            Hôm nay
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 rounded-lg px-2.5 text-xs"
            onClick={() => applyPreset('this_month')}
          >
            Tháng này
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 rounded-lg px-2.5 text-xs"
            onClick={() => applyPreset('last_30_days')}
          >
            30 ngày
          </Button>
        </div>

        {/* Date Picker Popover */}
        <Popover>
          <PopoverTrigger
            className="inline-flex h-10 items-center justify-start gap-2 rounded-xl border border-border bg-background px-3.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted outline-none"
            aria-label="Chọn khoảng ngày"
          >
            <CalendarDays className="size-3.5 text-muted-foreground" />
            {rangeLabel}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              locale={vi}
              disabled={{ after: new Date() }}
              defaultMonth={range?.from}
              captionLayout="dropdown"
            />
            <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setRange(undefined);
                  onFilterChange({ fromDate: null, toDate: null });
                }}
              >
                Xóa ngày
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => applyRange(range)}
                disabled={!range?.from || !range.to}
              >
                Áp dụng
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Page Limit */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Hiển thị:</span>
          <Select
            value={String(limit)}
            onValueChange={(val) => onFilterChange({ limit: Number(val) })}
          >
            <SelectTrigger className="h-10 w-24 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20 / trang</SelectItem>
              <SelectItem value="50">50 / trang</SelectItem>
              <SelectItem value="100">100 / trang</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
