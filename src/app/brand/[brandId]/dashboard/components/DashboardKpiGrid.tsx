import type { LucideIcon } from 'lucide-react';
import {
  Award,
  Gift,
  Headphones,
  TestTubeDiagonal,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { BrandKPICards } from '@/features/brand-portal/types';
import {
  formatBrandNumber,
  formatResponseDuration,
  isBrandDashboardNotFoundError,
} from '@/features/brand-portal/utils/dashboard';

interface KpiCardConfig {
  label: string;
  primary: string;
  secondary?: string;
  icon: LucideIcon;
}

export function DashboardKpiGrid({
  data,
  isLoading,
  error,
  onRetry,
}: {
  data?: BrandKPICards | null;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  if (isLoading && !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-40 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (error && !data && !isBrandDashboardNotFoundError(error)) {
    return (
      <section className="rounded-3xl border border-destructive/30 bg-card p-8">
        <h2 className="text-xl font-semibold">Không thể tải KPI thương hiệu</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Các khu vực khác của dashboard vẫn có thể hoạt động bình thường.
        </p>
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          Thử lại
        </Button>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
        <h2 className="text-lg font-semibold">Chưa có KPI thương hiệu</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Dữ liệu sẽ xuất hiện sau khi hệ thống tổng hợp hoạt động của brand.
        </p>
      </section>
    );
  }

  const cards: KpiCardConfig[] = [
    {
      label: 'Hội viên loyalty',
      primary: formatBrandNumber(data.totalMembers),
      icon: Users,
    },
    {
      label: 'Điểm loyalty',
      primary: `${formatBrandNumber(data.pointsIssued)} phát hành`,
      secondary: `${formatBrandNumber(data.pointsRedeemed)} đã quy đổi`,
      icon: Award,
    },
    {
      label: 'Voucher',
      primary: `${formatBrandNumber(data.activeVouchers)} hoạt động`,
      secondary: `${formatBrandNumber(data.vouchersRedeemed)} đã quy đổi`,
      icon: Gift,
    },
    {
      label: 'Digital Sample Lab',
      primary: `${formatBrandNumber(data.digitalSampleVotesCount)} lượt vote`,
      secondary: `${formatBrandNumber(data.digitalSampleAvgRating)}/5 rating`,
      icon: TestTubeDiagonal,
    },
    {
      label: 'Chăm sóc khách hàng',
      primary: `${formatBrandNumber(data.openCsTickets)} ticket mở`,
      secondary: `Phản hồi ${formatResponseDuration(data.csFirstResponseAvgSeconds)}`,
      icon: Headphones,
    },
  ];

  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
      aria-label="KPI thương hiệu"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.label}
            className="rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {card.label}
              </p>
              <span className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-6 text-xl font-semibold tabular-nums">
              {card.primary}
            </p>
            {card.secondary ? (
              <p className="mt-2 text-xs text-muted-foreground">
                {card.secondary}
              </p>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}
