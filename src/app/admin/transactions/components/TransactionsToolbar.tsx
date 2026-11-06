'use client';

import { AlertCircle, Filter, RefreshCw, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminPeriodNavigator } from '@/features/admin/components/AdminPeriodNavigator';
import type { PeriodPreset } from '@/features/admin/types/period';
import { formatNumber } from '@/features/admin/utils/dashboard';
import {
  TRANSACTION_STATUS_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from '@/features/admin/utils/transactions';

// Base UI's Select resolves the trigger label from the `items` prop; the items
// rendered inside SelectContent are not enough. Without this the trigger prints
// the raw value (`all`, `reconciliation_required`, `20`).
const STATUS_ITEMS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  ...TRANSACTION_STATUS_OPTIONS,
];

const TYPE_ITEMS = [
  { value: 'all', label: 'Tất cả loại' },
  ...TRANSACTION_TYPE_OPTIONS,
];

const LIMIT_ITEMS = [
  { value: '20', label: '20 / trang' },
  { value: '50', label: '50 / trang' },
  { value: '100', label: '100 / trang' },
];

export function TransactionsToolbar({
  status,
  transactionType,
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
  status?: string;
  transactionType?: string;
  preset?: PeriodPreset;
  fromDate: string;
  toDate: string;
  limit: number;
  /** Tổng số giao dịch khớp bộ lọc (metadata.totalItems), hiển thị phía trên bảng. */
  totalItems?: number;
  onFilterChange: (updates: {
    status?: string | null;
    transactionType?: string | null;
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
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 pt-6">
      {/* Title & Actions Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Giao Dịch payOS
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi và đối soát thủ công các giao dịch thanh toán gói và nạp ví
            (Giờ Việt Nam).
          </p>
          {typeof totalItems === 'number' && (
            <p className="mt-2 text-xs text-muted-foreground">
              Tổng cộng{' '}
              <span className="font-semibold tabular-nums text-foreground">
                {formatNumber(totalItems)}
              </span>{' '}
              giao dịch khớp bộ lọc
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
            Làm mới
          </Button>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="w-full sm:w-56">
          <Select
            items={STATUS_ITEMS}
            value={status || 'all'}
            onValueChange={(val) =>
              onFilterChange({
                status: val === 'all' ? null : val,
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-9 text-xs" aria-label="Lọc theo trạng thái">
              <Filter className="mr-2 size-3.5 text-muted-foreground" />
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ITEMS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transaction Type Filter */}
        <div className="w-full sm:w-48">
          <Select
            items={TYPE_ITEMS}
            value={transactionType || 'all'}
            onValueChange={(val) =>
              onFilterChange({
                transactionType: val === 'all' ? null : val,
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-9 text-xs" aria-label="Lọc theo loại giao dịch">
              <Filter className="mr-2 size-3.5 text-muted-foreground" />
              <SelectValue placeholder="Tất cả loại" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_ITEMS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

        {/* Page Limit */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Hiển thị:</span>
          <Select
            items={LIMIT_ITEMS}
            value={String(limit)}
            onValueChange={(val) => onFilterChange({ limit: Number(val), page: 1 })}
          >
            <SelectTrigger className="h-9 w-28 text-xs" aria-label="Số bản ghi mỗi trang">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LIMIT_ITEMS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Validation / API Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
