import { EyeOff, ShieldCheck, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { BrandPointsLiability } from '@/features/brand-portal/types';
import {
  formatBrandNumber,
  formatBrandVND,
  isBrandDashboardNotFoundError,
} from '@/features/brand-portal/utils/dashboard';

export function PointsLiabilityPanel({
  data,
  isStaff,
  isRoleLoading,
  isLoading,
  error,
  onRetry,
}: {
  data?: BrandPointsLiability | null;
  isStaff: boolean;
  isRoleLoading: boolean;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  if ((isLoading || isRoleLoading) && !data) {
    return <Skeleton className="h-[440px] rounded-3xl" />;
  }

  if (error && !data && !isBrandDashboardNotFoundError(error)) {
    return (
      <section className="h-full rounded-3xl border border-destructive/30 bg-card p-8">
        <h2 className="text-xl font-semibold">
          Không thể tải nghĩa vụ điểm
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Hãy thử lại mà không cần tải lại toàn bộ dashboard.
        </p>
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          Thử lại
        </Button>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="h-full rounded-3xl border border-dashed border-border bg-card p-10 text-center">
        <WalletCards className="mx-auto size-9 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">
          Chưa có dữ liệu nghĩa vụ điểm
        </h2>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            Tài chính
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Điểm trong 30 ngày</h2>
        </div>
        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <WalletCards className="size-5" />
        </span>
      </div>

      <div className="mt-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Điểm sắp hết hạn
        </p>
        <p className="text-4xl font-semibold tabular-nums">
          {formatBrandNumber(data.pointsExpiring30d)}
        </p>
      </div>

      <div className="mt-6 rounded-2xl bg-muted/50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Giá trị quy đổi ước tính
        </p>
        {isStaff ? (
          <div className="mt-3 flex items-center gap-2 font-semibold text-muted-foreground">
            <EyeOff className="size-4" />
            Ẩn theo quyền Staff
          </div>
        ) : (
          <p className="mt-3 text-2xl font-semibold tabular-nums">
            {formatBrandVND(data.pointsLiabilityValueVnd)}
          </p>
        )}
      </div>

      <div className="mt-auto flex items-start gap-3 pt-8 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        Giá trị tài chính được bảo vệ theo vai trò; Staff chỉ xem số điểm cần
        xử lý.
      </div>
    </section>
  );
}
