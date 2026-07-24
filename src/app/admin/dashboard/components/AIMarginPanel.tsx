import {
  Bot,
  CircleDollarSign,
  Coins,
  Gauge,
  TriangleAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { AIMarginAnalytics } from '@/features/admin/types';
import {
  formatNumber,
  formatVND,
  isNotFoundError,
  safePercentage,
} from '@/features/admin/utils/dashboard';
import { cn } from '@/lib/utils';

export function AIMarginPanel({
  data,
  isLoading,
  isFetching,
  error,
  onRetry,
}: {
  data?: AIMarginAnalytics | null;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  if (isLoading && !data) {
    return <Skeleton className="h-[410px] rounded-3xl xl:col-span-2" />;
  }

  if (error && !data && !isNotFoundError(error)) {
    return (
      <section className="rounded-3xl border border-destructive/30 bg-card p-8 xl:col-span-2">
        <h2 className="text-xl font-semibold">Không thể tải AI margin</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Hãy thử tải lại riêng báo cáo của khoảng thời gian này.
        </p>
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          Thử lại
        </Button>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-3xl border border-dashed border-border bg-card p-10 text-center xl:col-span-2">
        <Bot className="mx-auto size-8 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Chưa có dữ liệu AI margin</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Hãy chọn một khoảng ngày khác hoặc chờ snapshot tiếp theo.
        </p>
      </section>
    );
  }

  const errorRate = safePercentage(data.aiErrorCount, data.aiRequestsCount);
  const financials = [
    {
      label: 'Doanh thu',
      value: formatVND(data.totalSubscriptionRevVnd),
      icon: CircleDollarSign,
    },
    {
      label: 'Chi phí AI',
      value: formatVND(data.totalAiActualCostVnd),
      icon: Coins,
    },
    {
      label: 'Lợi nhuận ròng',
      value: formatVND(data.netAiMarginVnd),
      icon: Gauge,
      warning: data.netAiMarginVnd < 0,
    },
    {
      label: 'Biên lợi nhuận',
      value: `${formatNumber(data.marginPercentage)}%`,
      icon: Gauge,
      warning: data.marginPercentage < 0,
    },
  ];

  return (
    <section
      className={cn(
        'rounded-3xl border border-border bg-card p-6 shadow-sm transition-opacity md:p-8 xl:col-span-2',
        isFetching && 'opacity-70',
      )}
      aria-labelledby="ai-margin-heading"
      aria-busy={isFetching}
    >
      <div className="flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            Kinh tế AI
          </p>
          <h2 id="ai-margin-heading" className="mt-2 text-2xl font-semibold">
            Hiệu quả chi phí AI
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          {new Date(data.fromDate).toLocaleDateString('vi-VN')} –{' '}
          {new Date(data.toDate).toLocaleDateString('vi-VN')}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {financials.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl bg-muted/50 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold text-muted-foreground">
                  {item.label}
                </p>
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <p
                className={cn(
                  'mt-3 text-2xl font-semibold tabular-nums',
                  item.warning ? 'text-destructive' : 'text-foreground',
                )}
              >
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-3 border-t border-border pt-6 sm:grid-cols-4">
        <Metric label="Paid tokens" value={formatNumber(data.totalAiPaidTokens)} />
        <Metric label="AI requests" value={formatNumber(data.aiRequestsCount)} />
        <Metric
          label="Lỗi AI"
          value={formatNumber(data.aiErrorCount)}
          warning={data.aiErrorCount > 0}
        />
        <Metric
          label="Tỷ lệ lỗi"
          value={`${formatNumber(errorRate)}%`}
          warning={errorRate > 0}
          icon={<TriangleAlert className="size-3.5" />}
        />
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  warning,
  icon,
}: {
  label: string;
  value: string;
  warning?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <p
        className={cn(
          'mt-2 text-lg font-semibold tabular-nums',
          warning ? 'text-destructive' : 'text-foreground',
        )}
      >
        {value}
      </p>
    </div>
  );
}
