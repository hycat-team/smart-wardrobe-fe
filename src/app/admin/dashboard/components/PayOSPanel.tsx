import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  ReceiptText,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { PayOSReconciliation } from '@/features/admin/types';
import {
  formatNumber,
  formatVND,
  formatVNDateString,
  isNotFoundError,
  safePercentage,
} from '@/features/admin/utils/dashboard';

export function PayOSPanel({
  data,
  isLoading,
  error,
  fromDate,
  toDate,
  onRetry,
}: {
  data?: PayOSReconciliation | null;
  isLoading: boolean;
  error: unknown;
  fromDate?: string;
  toDate?: string;
  onRetry: () => void;
}) {
  if (isLoading && !data) {
    return <Skeleton className="h-[430px] rounded-3xl" />;
  }

  if (error && !data && !isNotFoundError(error)) {
    return (
      <section className="rounded-3xl border border-destructive/30 bg-card p-8">
        <h2 className="text-xl font-semibold text-destructive">Không thể tải đối soát PayOS</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Đã có lỗi khi tổng hợp giao dịch theo khoảng ngày đã chọn.
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
        <CreditCard className="mx-auto size-8 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Chưa có dữ liệu PayOS</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Chưa có giao dịch nào trong khoảng thời gian này.
        </p>
      </section>
    );
  }

  const successRate = safePercentage(
    data.successCount,
    data.totalTransactions,
  );

  return (
    <section
      className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
      aria-labelledby="payos-heading"
    >
      <div className="flex items-start justify-between border-b border-border pb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            Thanh toán theo kỳ
          </p>
          <h2 id="payos-heading" className="mt-1 text-2xl font-semibold">
            Đối soát PayOS
          </h2>
          {fromDate && toDate && (
            <p className="mt-1 text-xs text-muted-foreground">
              Kỳ: {formatVNDateString(fromDate)} – {formatVNDateString(toDate)}
            </p>
          )}
        </div>

        <Link
          href="/admin/transactions"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Chi tiết
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Tỷ lệ thành công</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              {formatNumber(successRate)}%
            </p>
          </div>
          <ReceiptText className="size-7 text-muted-foreground" />
        </div>
        <div
          className="mt-3.5 h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label="Tỷ lệ giao dịch PayOS thành công"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(successRate, 100)}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${Math.min(Math.max(successRate, 0), 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <PaymentMetric
          label="Tổng đơn"
          value={formatNumber(data.totalTransactions)}
          icon={<CreditCard className="size-3.5" />}
        />
        <PaymentMetric
          label="Thành công"
          value={formatNumber(data.successCount)}
          icon={<CheckCircle2 className="size-3.5" />}
        />
        <PaymentMetric
          label="Thất bại"
          value={formatNumber(data.failedCount)}
          icon={<XCircle className="size-3.5" />}
          warning={data.failedCount > 0}
        />
        <PaymentMetric
          label="Đang xử lý"
          value={formatNumber(data.pendingCount ?? 0)}
          icon={<Clock className="size-3.5" />}
        />
      </div>

      <div className="mt-auto border-t border-border pt-5">
        <p className="text-xs text-muted-foreground">Tổng tiền thực nhận thành công (cả mua gói & nạp ví)</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
          {formatVND(data.totalSuccessValue)}
        </p>
      </div>
    </section>
  );
}

function PaymentMetric({
  label,
  value,
  icon,
  warning,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-muted/50 p-2.5">
      <div className={warning ? 'text-destructive' : 'text-muted-foreground'}>
        {icon}
      </div>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
        {label}
      </p>
      <p
        className={`mt-0.5 text-base font-semibold tabular-nums ${
          warning ? 'text-destructive' : 'text-foreground'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
