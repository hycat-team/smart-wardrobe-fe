'use client';

import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { BrandMetricResponseKey, DynamicQueryResponse } from '@/features/brand-portal/types';
import {
  formatBrandCompactNumber,
  formatBrandNumber,
  isBrandDashboardNotFoundError,
} from '@/features/brand-portal/utils/dashboard';
import { cn } from '@/lib/utils';

const staticLabels: Partial<Record<BrandMetricResponseKey, string>> = {
  total_members: 'Tổng hội viên',
  points_issued: 'Điểm phát hành',
  points_redeemed: 'Điểm quy đổi',
  active_vouchers: 'Voucher hoạt động',
  new_customers: 'Khách hàng mới',
  customer_claim_rate: 'Tỷ lệ claim',
  benefit_redemption_count: 'Lượt đổi benefit',
  brand_item_count: 'Sản phẩm catalog',
};

const COLORS = ['#0f766e', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#64748b'];
type TrendTab = 'loyalty' | 'customers' | 'operations';

const metricLabel = (metric: BrandMetricResponseKey) => {
  if (staticLabels[metric]) return staticLabels[metric]!;
  if (metric.startsWith('brand_item_count_')) {
    const type = metric.replace('brand_item_count_', '');
    return `Catalog · ${type
      .split(/[_-]+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')}`;
  }
  return metric;
};

const formatMetric = (metric: BrandMetricResponseKey, value: number) =>
  metric.endsWith('_rate') ? `${formatBrandNumber(value)}%` : formatBrandNumber(value);

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
  const [tab, setTab] = useState<TrendTab>('loyalty');
  const chartData = useMemo(
    () => data?.series.map((point) => ({ timestamp: point.timestamp, ...point.metrics })) ?? [],
    [data]
  );
  const dynamicCatalogMetrics = useMemo(
    () =>
      Array.from(
        new Set(
          chartData.flatMap((point) =>
            Object.keys(point).filter((key) => key.startsWith('brand_item_count_'))
          )
        )
      ) as BrandMetricResponseKey[],
    [chartData]
  );

  if (isLoading && !data) return <Skeleton className="h-[440px] rounded-3xl" />;
  if (error && !data && !isBrandDashboardNotFoundError(error))
    return (
      <section className="rounded-3xl border border-destructive/30 bg-card p-8">
        <h2 className="text-xl font-semibold">Không thể tải biểu đồ xu hướng</h2>
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          Thử lại
        </Button>
      </section>
    );
  if (!data || chartData.length === 0)
    return (
      <section className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
        <BarChart3 className="mx-auto size-9 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Chưa có dữ liệu xu hướng</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Hãy chọn khoảng ngày khác hoặc chờ snapshot mới.
        </p>
      </section>
    );

  const visibleMetrics: BrandMetricResponseKey[] =
    tab === 'loyalty'
      ? ['points_issued', 'points_redeemed', 'active_vouchers']
      : tab === 'customers'
        ? ['total_members', 'new_customers', 'customer_claim_rate']
        : ['benefit_redemption_count', 'brand_item_count', ...dynamicCatalogMetrics];
  const latest = chartData.at(-1);
  const hasRateAxis = visibleMetrics.some((metric) => metric.endsWith('_rate'));

  return (
    <section
      className={cn(
        'rounded-3xl border border-border bg-card p-6 shadow-sm transition-opacity md:p-8',
        isFetching && 'opacity-70'
      )}
      aria-labelledby="brand-trend-heading"
      aria-busy={isFetching}
    >
      <div className="flex flex-col gap-5 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="brand-trend-heading" className="mt-2 text-2xl font-semibold">
            Xu hướng vận hành
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">Theo : {data.granularity}</p>
        </div>
        <Tabs value={tab} onValueChange={(value) => setTab(value as TrendTab)}>
          <TabsList aria-label="Nhóm dữ liệu biểu đồ">
            <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
            <TabsTrigger value="customers">Khách hàng</TabsTrigger>
            <TabsTrigger value="operations">Vận hành</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="mt-6 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
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
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              width={58}
              tickFormatter={(value) => formatBrandCompactNumber(Number(value))}
            />
            {hasRateAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                width={52}
                domain={[0, 100]}
                tickFormatter={(value) => `${formatBrandNumber(Number(value))}%`}
              />
            )}
            <Tooltip
              labelFormatter={(value) => new Date(String(value)).toLocaleDateString('vi-VN')}
              formatter={(value, name) =>
                formatMetric(String(name) as BrandMetricResponseKey, Number(value))
              }
            />
            <Legend formatter={(value) => metricLabel(String(value) as BrandMetricResponseKey)} />
            {visibleMetrics.map((metric, index) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                yAxisId={metric.endsWith('_rate') ? 'right' : 'left'}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleMetrics.map((metric) => (
          <div key={metric} className="rounded-2xl bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="size-3.5" />
              {metricLabel(metric)}
            </div>
            <p className="mt-2 font-semibold tabular-nums">
              {formatMetric(
                metric,
                Number((latest as Record<string, unknown> | undefined)?.[metric] ?? 0)
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
