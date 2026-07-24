'use client';

import { useMemo, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AdminMetricKey, DynamicQueryResponse } from '@/features/admin/types';
import { formatCompactNumber, formatNumber, formatVND, isNotFoundError } from '@/features/admin/utils/dashboard';
import { cn } from '@/lib/utils';

const labels: Record<AdminMetricKey, string> = {
  total_users: 'Tổng người dùng',
  new_users: 'Người dùng mới',
  active_users_dau: 'DAU',
  ai_requests_count: 'AI requests',
  ai_error_count: 'AI errors',
  ai_error_rate: 'Tỷ lệ lỗi AI',
  subscription_revenue_vnd: 'Doanh thu',
  net_ai_margin_vnd: 'Biên lợi nhuận AI',
};

const colors: Record<AdminMetricKey, string> = {
  total_users: '#111827',
  new_users: '#0f766e',
  active_users_dau: '#2563eb',
  ai_requests_count: '#2563eb',
  ai_error_count: '#dc2626',
  ai_error_rate: '#d97706',
  subscription_revenue_vnd: '#0f766e',
  net_ai_margin_vnd: '#111827',
};

type TrendTab = 'activity' | 'finance' | 'ai';

const formatMetric = (metric: AdminMetricKey, value: number) => {
  if (metric.endsWith('_vnd')) return formatVND(value);
  if (metric.endsWith('_rate')) return `${formatNumber(value)}%`;
  return formatNumber(value);
};

export function DashboardTrendChart({ data, isLoading, isFetching, error, fromDate, toDate, onRetry }: { data?: DynamicQueryResponse | null; isLoading: boolean; isFetching: boolean; error: unknown; fromDate?: string; toDate?: string; onRetry: () => void }) {
  const [tab, setTab] = useState<TrendTab>('activity');
  const chartData = useMemo(() => data?.series.map((point) => ({ timestamp: point.timestamp, ...point.metrics })) ?? [], [data]);

  if (isLoading && !data) return <Skeleton className="h-[440px] rounded-3xl" />;
  if (error && !data && !isNotFoundError(error)) return <section className="rounded-3xl border border-destructive/30 bg-card p-8"><h2 className="text-xl font-semibold">Không thể tải biểu đồ xu hướng</h2><Button className="mt-5" variant="outline" onClick={onRetry}>Thử lại</Button></section>;
  if (!data || chartData.length === 0) return <section className="rounded-3xl border border-dashed border-border bg-card p-12 text-center"><BarChart3 className="mx-auto size-9 text-muted-foreground" /><h2 className="mt-4 text-lg font-semibold">Chưa có dữ liệu xu hướng</h2><p className="mt-2 text-sm text-muted-foreground">Hãy chọn khoảng ngày khác để xem dữ liệu đã tổng hợp.</p></section>;

  const visibleMetrics: AdminMetricKey[] = tab === 'finance'
    ? ['subscription_revenue_vnd', 'net_ai_margin_vnd']
    : tab === 'ai'
      ? ['ai_requests_count', 'ai_error_count', 'ai_error_rate']
      : ['total_users', 'new_users', 'active_users_dau'];
  const latest = chartData.at(-1);
  const hasRateAxis = visibleMetrics.some((metric) => metric.endsWith('_rate'));

  return (
    <section className={cn('rounded-3xl border border-border bg-card p-6 shadow-sm transition-opacity md:p-8', isFetching && 'opacity-70')} aria-labelledby="trend-heading" aria-busy={isFetching}>
      <div className="flex flex-col gap-5 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 id="trend-heading" className="mt-2 text-2xl font-semibold">Xu hướng hệ thống</h2><div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">{fromDate && toDate && <p>Thời gian: {fromDate} – {toDate}</p>}<p>Tính theo : {data.granularity}</p></div></div>
        <Tabs value={tab} onValueChange={(value) => setTab(value as TrendTab)}><TabsList aria-label="Nhóm dữ liệu biểu đồ"><TabsTrigger value="activity">Hoạt động</TabsTrigger><TabsTrigger value="finance">Tài chính</TabsTrigger><TabsTrigger value="ai">AI Health</TabsTrigger></TabsList></Tabs>
      </div>

      <div className="mt-6 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: hasRateAxis ? 8 : 12, left: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickLine={false} axisLine={false} minTickGap={28} tickFormatter={(value) => new Date(String(value)).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} width={tab === 'finance' ? 78 : 54} tickFormatter={(value) => formatCompactNumber(Number(value))} />
            {hasRateAxis && <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={52} domain={[0, 100]} tickFormatter={(value) => `${formatNumber(Number(value))}%`} />}
            <Tooltip labelFormatter={(value) => new Date(String(value)).toLocaleDateString('vi-VN')} formatter={(value, name) => formatMetric(String(name) as AdminMetricKey, Number(value))} />
            <Legend formatter={(value) => labels[String(value) as AdminMetricKey] ?? value} />
            {visibleMetrics.map((metric) => <Line key={metric} type="monotone" dataKey={metric} yAxisId={metric.endsWith('_rate') ? 'right' : 'left'} stroke={colors[metric]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} connectNulls />)}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">{visibleMetrics.map((metric) => <div key={metric} className="rounded-2xl bg-muted/50 px-4 py-3"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Activity className="size-3.5" />{labels[metric]}</div><p className="mt-2 font-semibold tabular-nums">{formatMetric(metric, Number(latest?.[metric] ?? 0))}</p></div>)}</div>
    </section>
  );
}