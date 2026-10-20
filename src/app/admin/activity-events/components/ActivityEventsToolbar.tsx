'use client';

import { useEffect, useState } from 'react';
import { format, parse } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import {
  AlertCircle,
  CalendarDays,
  Filter,
  RefreshCw,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
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
import { isValidUUID } from '@/features/admin/utils/activity';

export function ActivityEventsToolbar({
  userId,
  activityType,
  fromDate,
  toDate,
  limit,
  onFilterChange,
  onReset,
  onRefresh,
  isRefreshing,
  errorMessage,
}: {
  userId?: string;
  activityType?: string;
  fromDate?: string;
  toDate?: string;
  limit: number;
  onFilterChange: (updates: {
    userId?: string | null;
    activityType?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
    limit?: number;
  }) => void;
  onReset: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  errorMessage?: string | null;
}) {
  const [searchInput, setSearchInput] = useState(userId || '');
  const [uuidError, setUuidError] = useState<string | null>(null);

  useEffect(() => {
    setSearchInput(userId || '');
  }, [userId]);

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

  const handleSearchSubmit = () => {
    const trimmed = searchInput.trim();
    if (trimmed && !isValidUUID(trimmed)) {
      setUuidError('Mã người dùng phải đúng định dạng UUID (ví dụ: 1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f)');
      return;
    }
    setUuidError(null);
    onFilterChange({ userId: trimmed || null });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setUuidError(null);
    onFilterChange({ userId: null });
  };

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
      {/* Title & Actions Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Hoạt Động Người Dùng
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Tra cứu nhật ký đăng nhập và làm mới phiên xác thực người dùng theo thời gian thực (Giờ Việt Nam).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground"
            title="Đặt lại toàn bộ bộ lọc"
          >
            <RotateCcw className="mr-1.5 size-3.5" />
            Đặt lại
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-xs"
            title="Tải lại dữ liệu"
          >
            <RefreshCw
              className={`mr-1.5 size-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* User ID Search Box */}
        <div className="relative flex w-full max-w-sm items-center">
          <Search className="absolute left-3 size-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (uuidError) setUuidError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchSubmit();
              }
            }}
            placeholder="Tìm theo User UUID..."
            className="h-9 pl-9 pr-8 text-xs font-mono"
            aria-label="Lọc theo mã người dùng UUID"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 text-muted-foreground hover:text-foreground"
              aria-label="Xóa mã người dùng"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSearchSubmit}
          className="h-9 text-xs"
        >
          Tìm
        </Button>

        {/* Activity Type Dropdown */}
        <Select
          value={activityType || 'all'}
          onValueChange={(val) =>
            onFilterChange({
              activityType: val === 'all' ? null : val,
            })
          }
        >
          <SelectTrigger className="h-9 w-full sm:w-[180px] text-xs">
            <Filter className="mr-2 size-3.5 text-muted-foreground" />
            <SelectValue placeholder="Tất cả hoạt động" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả hoạt động</SelectItem>
            <SelectItem value="login">Đăng nhập</SelectItem>
            <SelectItem value="refresh">Làm mới phiên</SelectItem>
          </SelectContent>
        </Select>

        {/* Preset Range Buttons */}
        <div className="hidden items-center gap-1 xl:flex">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset('today')}
            className="h-9 text-xs"
          >
            Hôm nay
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset('this_month')}
            className="h-9 text-xs"
          >
            Tháng này
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset('last_30_days')}
            className="h-9 text-xs"
          >
            30 ngày gần nhất
          </Button>
        </div>

        {/* Date Range Picker Popover */}
        <Popover>
          <PopoverTrigger
            className="inline-flex h-9 items-center justify-start gap-2 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted outline-none"
            aria-label="Chọn khoảng ngày"
          >
            <CalendarDays className="size-3.5 text-muted-foreground" />
            {rangeLabel}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <div className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between border-b border-border">
              <span className="text-xs font-medium text-muted-foreground">
                Chọn khoảng ngày (giờ Việt Nam)
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => applyPreset('today')}
                  className="h-7 text-xs"
                >
                  Hôm nay
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => applyPreset('this_month')}
                  className="h-7 text-xs"
                >
                  Tháng này
                </Button>
              </div>
            </div>
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

        {/* Limit Selector */}
        <Select
          value={String(limit)}
          onValueChange={(val) => onFilterChange({ limit: Number(val) })}
        >
          <SelectTrigger className="h-9 w-[120px] text-xs">
            <SelectValue placeholder="Số bản ghi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / trang</SelectItem>
            <SelectItem value="20">20 / trang</SelectItem>
            <SelectItem value="50">50 / trang</SelectItem>
            <SelectItem value="100">100 / trang</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Validation / API Error Banner */}
      {(uuidError || errorMessage) && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{uuidError || errorMessage}</span>
        </div>
      )}
    </div>
  );
}
