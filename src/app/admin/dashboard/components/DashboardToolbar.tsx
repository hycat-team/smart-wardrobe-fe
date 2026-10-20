'use client';

import {
  AlertCircle,
  Clock3,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DashboardFilters } from '@/features/admin/types';
import type { PeriodPreset } from '@/features/admin/types/period';
import { formatDashboardDateTime } from '@/features/admin/utils/dashboard';
import { AdminPeriodNavigator } from '@/features/admin/components/AdminPeriodNavigator';

export function DashboardToolbar({
  filters,
  updatedAt,
  isRefreshing,
  errorMessage,
  onApply,
  onRefresh,
}: {
  filters: DashboardFilters;
  updatedAt?: string | null;
  isRefreshing: boolean;
  errorMessage?: string | null;
  onApply: (period: {
    preset: PeriodPreset;
    fromDate: string;
    toDate: string;
  }) => void;
  onRefresh: () => void;
}) {
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
            <span>
              Ảnh chụp KPI cập nhật lúc:{' '}
              <strong className="text-foreground">
                {formatDashboardDateTime(updatedAt)}
              </strong>{' '}
              (~15 phút/lần)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <AdminPeriodNavigator
            preset={filters.preset}
            fromDate={filters.fromDate}
            toDate={filters.toDate}
            onChange={onApply}
            isLoading={isRefreshing}
          />

          <Button
            type="button"
            variant="outline"
            className="h-9 text-xs"
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
