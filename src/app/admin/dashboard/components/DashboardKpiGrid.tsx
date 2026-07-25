import type { ComponentType } from 'react';
import {
  Activity,
  Building2,
  CircleDollarSign,
  ShieldAlert,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { AdminKPICards } from '@/features/admin/types';
import {
  formatNumber,
  formatVND,
  isNotFoundError,
} from '@/features/admin/utils/dashboard';
import { cn } from '@/lib/utils';

interface KpiCard {
  label: string;
  value: string;
  helper: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  warning?: boolean;
}

export function DashboardKpiGrid({
  data,
  isLoading,
  error,
  onRetry,
}: {
  data?: AdminKPICards | null;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  if (isLoading && !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (error && !data && !isNotFoundError(error)) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8">
        <h2 className="text-lg font-semibold">Không thể tải KPI hệ thống</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Các phần còn lại của dashboard vẫn có thể tiếp tục hoạt động.
        </p>
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          Thử lại
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-10 text-center">
        <h2 className="text-lg font-semibold">Chưa có snapshot KPI</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Dữ liệu sẽ xuất hiện sau lần tổng hợp dashboard tiếp theo.
        </p>
      </div>
    );
  }

  const cards: KpiCard[] = [
    {
      label: 'Tổng người dùng',
      value: formatNumber(data.totalUsers),
      helper: 'Tài khoản đã đăng ký',
      icon: Users,
    },
    {
      label: 'DAU hôm nay',
      value: formatNumber(data.activeUsersDau),
      helper: 'Người dùng hoạt động',
      icon: Activity,
    },
    {
      label: 'Thương hiệu',
      value: formatNumber(data.totalBrands),
      helper: 'Đang hoạt động',
      icon: Building2,
    },
    {
      label: 'Thương hiệu chờ phê duyệt',
      value: formatNumber(data.pendingReviewBrands),
      helper: 'Yêu cầu cần xử lý',
      icon: ShieldAlert,
      warning: data.pendingReviewBrands > 0,
    },
    {
      label: 'Doanh thu subscription',
      value: formatVND(data.subscriptionRevenueVnd),
      helper: 'Snapshot gần nhất',
      icon: CircleDollarSign,
    },
    {
      label: 'Biên lợi nhuận AI',
      value: formatVND(data.netAiMarginVnd),
      helper: 'Doanh thu trừ chi phí AI',
      icon: TrendingUp,
      warning: data.netAiMarginVnd < 0,
    },
  ];

  return (
    <section aria-labelledby="kpi-heading">
      <h2 id="kpi-heading" className="sr-only">
        Chỉ số KPI hệ thống
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              className={cn(
                'group rounded-3xl border bg-card p-6 shadow-sm transition-colors',
                card.warning
                  ? 'border-destructive/30'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    {card.label}
                  </p>
                  <p
                    className={cn(
                      'mt-4 text-3xl font-semibold tracking-tight tabular-nums',
                      card.warning ? 'text-destructive' : 'text-foreground',
                    )}
                  >
                    {card.value}
                  </p>
                </div>
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-2xl',
                    card.warning
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-muted text-muted-foreground group-hover:text-foreground',
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.7} />
                </div>
              </div>
              <p className="mt-5 text-xs text-muted-foreground">{card.helper}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
