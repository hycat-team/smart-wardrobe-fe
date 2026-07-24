'use client';

import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  BrandMetricKey,
  DynamicQueryResponse,
} from '@/features/brand-portal/types';
import {
  formatBrandCompactNumber,
  formatBrandNumber,
  isBrandDashboardNotFoundError,
} from '@/features/brand-portal/utils/dashboard';
import { cn } from '@/lib/utils';

const labels: Record<BrandMetricKey, string> = {
  total_members: 'Tổng hội viên',
  points_issued: 'Điểm phát hành',
  points_redeemed: 'Điểm quy đổi',
  active_vouchers: 'Voucher hoạt động',
};

const chartConfig = {
  total_members: {
    label: labels.total_members,
    color: 'var(--foreground)',
  },
  points_issued: {
    label: labels.points_issued,
    color: 'var(--primary)',
  },
  points_redeemed: {
    label: labels.points_redeemed,
    color: 'var(--muted-foreground)',
  },
  active_vouchers: {
    label: labels.active_vouchers,
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export function DashboardTrendChart({
  data,
  isLoading,
  isFetching,
  error,
  onRetry,
}: {
  data?: DynamicQueryResponse | null;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  const [tab, setTab] = useState<'loyalty' | 'growth'>('loyalty');
  const chartData = useMemo(
    () =>
      data?.series.map((point) => ({
        timestamp: point.timestamp,
        ...point.metrics,
      })) ?? [],
    [data],
  );

  if (isLoading && !data) {
    return <Skeleton className="h-[440px] rounded-3xl" />;
  }

  if (error && !data && !isBrandDashboardNotFoundError(error)) {
    return (
      <section className="rounded-3xl border border-destructive/30 bg-card p-8">
        <h2 className="text-xl font-semibold">Không thể tải biểu đồ xu hướng</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          KPI và các báo cáo khác vẫn được giữ nguyên.
        </p>
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          Thử lại
        </Button>
      </section>
    );
  }

  if (!data || chartData.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
        <BarChart3 className="mx-auto size-9 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">
          Chưa có dữ liệu xu hướng
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Hãy chọn khoảng ngày khác hoặc chờ hệ thống tạo snapshot mới.
        </p>
      </section>
    );
  }

  const visibleMetrics: BrandMetricKey[] =
    tab === 'loyalty'
      ? ['points_issued', 'points_redeemed']
      : ['total_members', 'active_vouchers'];
  const latest = chartData.at(-1);

  return (
    <section
      className={cn(
        'rounded-3xl border border-border bg-card p-6 shadow-sm transition-opacity md:p-8',
        isFetching && 'opacity-70',
      )}
      aria-labelledby="brand-trend-heading"
      aria-busy={isFetching}
    >
      <div className="flex flex-col gap-5 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            Time series
          </p>
          <h2 id="brand-trend-heading" className="mt-2 text-2xl font-semibold">
            Xu hướng vận hành
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Độ mịn thực tế: {data.granularity}
          </p>
        </div>
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as 'loyalty' | 'growth')}
        >
          <TabsList aria-label="Nhóm dữ liệu biểu đồ">
            <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
            <TabsTrigger value="growth">Tăng trưởng</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ChartContainer
        config={chartConfig}
        className="mt-6 h-[300px] w-full"
        initialDimension={{ width: 900, height: 300 }}
      >
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 12, left: 4, bottom: 0 }}
          accessibilityLayer
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            minTickGap={28}
            tickFormatter={(value) =>
              new Date(String(value)).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
              })
            }
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={58}
            tickFormatter={(value) =>
              formatBrandCompactNumber(Number(value))
            }
          />
          <ChartTooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const timestamp = payload?.[0]?.payload?.timestamp;
                  return timestamp
                    ? new Date(timestamp).toLocaleDateString('vi-VN')
                    : '';
                }}
                formatter={(value, name) => {
                  const metric = String(name) as BrandMetricKey;
                  return (
                    <div className="flex min-w-48 items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {labels[metric] ?? metric}
                      </span>
                      <span className="font-mono font-semibold tabular-nums">
                        {formatBrandNumber(Number(value))}
                      </span>
                    </div>
                  );
                }}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          {visibleMetrics.map((metric) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={`var(--color-${metric})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ChartContainer>

      <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
        {visibleMetrics.map((metric) => (
          <div key={metric} className="rounded-2xl bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="size-3.5" />
              {labels[metric]}
            </div>
            <p className="mt-2 font-semibold tabular-nums">
              {formatBrandNumber(Number(latest?.[metric] ?? 0))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
