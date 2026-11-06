'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Filter,
  RefreshCw,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminPeriodNavigator } from '@/features/admin/components/AdminPeriodNavigator';
import type { PeriodPreset } from '@/features/admin/types/period';
import { isValidUUID } from '@/features/admin/utils/activity';
import { formatNumber } from '@/features/admin/utils/dashboard';

// Base UI's Select resolves its trigger label from the `items` prop, not from
// the SelectItems rendered in the popup. Without these the trigger printed the
// raw value (`all`, `login`, `20`).
const ACTIVITY_TYPE_ITEMS = [
  { value: 'all', label: 'Tất cả hoạt động' },
  { value: 'login', label: 'Đăng nhập' },
  { value: 'refresh', label: 'Làm mới phiên' },
];

const ACTIVITY_LIMIT_ITEMS = [
  { value: '10', label: '10 / trang' },
  { value: '20', label: '20 / trang' },
  { value: '50', label: '50 / trang' },
  { value: '100', label: '100 / trang' },
];

export function ActivityEventsToolbar({
  userId,
  activityType,
  preset,
  fromDate,
  toDate,
  limit,
  totalItems,
  onFilterChange,
  onReset,
  onRefresh,
  isRefreshing,
  errorMessage,
}: {
  userId?: string;
  activityType?: string;
  preset?: PeriodPreset;
  fromDate: string;
  toDate: string;
  limit: number;
  /** Tổng số hoạt động khớp bộ lọc (metadata.totalItems), hiển thị phía trên bảng. */
  totalItems?: number;
  onFilterChange: (updates: {
    userId?: string | null;
    activityType?: string | null;
    preset?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
    limit?: number;
    page?: number;
  }) => void;
  onReset: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  errorMessage?: string | null;
}) {
  const [searchInput, setSearchInput] = useState(userId || '');
  const [prevUserId, setPrevUserId] = useState(userId);
  const [uuidError, setUuidError] = useState<string | null>(null);

  if (userId !== prevUserId) {
    setPrevUserId(userId);
    setSearchInput(userId || '');
  }

  const handleSearchSubmit = () => {
    const trimmed = searchInput.trim();
    if (trimmed && !isValidUUID(trimmed)) {
      setUuidError(
        'Mã người dùng phải đúng định dạng UUID (ví dụ: 1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f)'
      );
      return;
    }
    setUuidError(null);
    onFilterChange({ userId: trimmed || null, page: 1 });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setUuidError(null);
    onFilterChange({ userId: null, page: 1 });
  };

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
            Tra cứu nhật ký đăng nhập và làm mới phiên xác thực người dùng theo
            thời gian thực (Giờ Việt Nam).
          </p>
          {typeof totalItems === 'number' && (
            <p className="mt-2 text-xs text-muted-foreground">
              Tổng cộng{' '}
              <span className="font-semibold tabular-nums text-foreground">
                {formatNumber(totalItems)}
              </span>{' '}
              hoạt động
            </p>
          )}
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
            {isRefreshing ? 'Đang tải' : 'Làm mới'}
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
          items={ACTIVITY_TYPE_ITEMS}
          value={activityType || 'all'}
          onValueChange={(val) =>
            onFilterChange({
              activityType: val === 'all' ? null : val,
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 w-full sm:w-[180px] text-xs" aria-label="Lọc theo loại hoạt động">
            <Filter className="mr-2 size-3.5 text-muted-foreground" />
            <SelectValue placeholder="Tất cả hoạt động" />
          </SelectTrigger>
          <SelectContent>
            {ACTIVITY_TYPE_ITEMS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Shared Period Navigator */}
        <AdminPeriodNavigator
          preset={preset}
          fromDate={fromDate}
          toDate={toDate}
          onChange={(p) =>
            onFilterChange({
              preset: p.preset,
              fromDate: p.fromDate,
              toDate: p.toDate,
              page: 1,
            })
          }
          isLoading={isRefreshing}
        />

        {/* Limit Selector */}
        <Select
          items={ACTIVITY_LIMIT_ITEMS}
          value={String(limit)}
          onValueChange={(val) => onFilterChange({ limit: Number(val), page: 1 })}
        >
          <SelectTrigger className="h-9 w-[130px] text-xs" aria-label="Số bản ghi mỗi trang">
            <SelectValue placeholder="Số bản ghi" />
          </SelectTrigger>
          <SelectContent>
            {ACTIVITY_LIMIT_ITEMS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
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
