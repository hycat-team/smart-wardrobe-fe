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
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import type {
  AdminMetricKey,
  DynamicQueryResponse,
} from '@/features/admin/types';
import {
  formatCompactNumber,
  formatNumber,
  formatVND,
  isNotFoundError,
} from '@/features/admin/utils/dashboard';
import { cn } from '@/lib/utils';

const labels: Record<AdminMetricKey, string> = {
  total_users: 'Tổng người dùng',
  active_users_dau: 'DAU',
  ai_requests_count: 'AI requests',
  subscription_revenue_vnd: 'Doanh thu',
  net_ai_margin_vnd: 'Net AI margin',
};

const chartConfig = {
  total_users: {
    label: labels.total_users,
    color: 'var(--foreground)',
  },
  active_users_dau: {
    label: labels.active_users_dau,
    color: 'var(--primary)',
  },
  ai_requests_count: {
    label: labels.ai_requests_count,
    color: 'var(--muted-foreground)',
  },
  subscription_revenue_vnd: {
    label: labels.subscription_revenue_vnd,
    color: 'var(--primary)',
  },
  net_ai_margin_vnd: {
    label: labels.net_ai_margin_vnd,
    color: 'var(--foreground)',
  },
} satisfies ChartConfig;

export function DashboardTrendChart({
  data,
  isLoading,
  isFetching,
  error,
  fromDate,
  toDate,
  onRetry,
}: {
  data?: DynamicQueryResponse | null;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  fromDate?: string;
  toDate?: string;
  onRetry: () => void;
}) {
  const [tab, setTab] = useState<'activity' | 'finance'>('activity');

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

  if (error && !data && !isNotFoundError(error)) {
    return (
      <section className="rounded-3xl border border-destructive/30 bg-card p-8">
        <h2 className="text-xl font-semibold">Không thể tải biểu đồ xu hướng</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Dữ liệu tổng quan và đối soát vẫn được giữ nguyên.
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
        <h2 className="mt-4 text-lg font-semibold">Chưa có dữ liệu xu hướng</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Hãy chọn khoảng ngày khác để xem các snapshot đã được tổng hợp.
        </p>
      </section>
    );
  }

  const isFinance = tab === 'finance';
  const latest = chartData.at(-1);
  const visibleMetrics: AdminMetricKey[] = isFinance
    ? ['subscription_revenue_vnd', 'net_ai_margin_vnd']
    : ['total_users', 'active_users_dau', 'ai_requests_count'];

  return (
    <section
      className={cn(
        'rounded-3xl border border-border bg-card p-6 shadow-sm transition-opacity md:p-8',
        isFetching && 'opacity-70',
      )}
      aria-labelledby="trend-heading"
      aria-busy={isFetching}
    >
      <div className="flex flex-col gap-5 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            Time series
          </p>
          <h2 id="trend-heading" className="mt-2 text-2xl font-semibold">
            Xu hướng hệ thống
          </h2>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            {fromDate && toDate && (
              <p>Thời gian: {fromDate} – {toDate}</p>
            )}
            <p>Độ mịn thực tế: {data.granularity}</p>
          </div>
        </div>
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as 'activity' | 'finance')}
        >
          <TabsList aria-label="Nhóm dữ liệu biểu đồ">
            <TabsTrigger value="activity">Hoạt động</TabsTrigger>
            <TabsTrigger value="finance">Tài chính</TabsTrigger>
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
            width={isFinance ? 78 : 54}
            tickFormatter={(value) =>
              isFinance
                ? formatCompactNumber(Number(value))
                : formatCompactNumber(Number(value))
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
                  const metric = String(name) as AdminMetricKey;
                  const numericValue = Number(value);
                  return (
                    <div className="flex min-w-48 items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {labels[metric] ?? metric}
                      </span>
                      <span className="font-mono font-semibold tabular-nums">
                        {metric.endsWith('_vnd')
                          ? formatVND(numericValue)
                          : formatNumber(numericValue)}
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

      <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
        {visibleMetrics.map((metric) => (
          <div key={metric} className="rounded-2xl bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="size-3.5" />
              {labels[metric]}
            </div>
            <p className="mt-2 font-semibold tabular-nums">
              {metric.endsWith('_vnd')
                ? formatVND(Number(latest?.[metric] ?? 0))
                : formatNumber(Number(latest?.[metric] ?? 0))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
