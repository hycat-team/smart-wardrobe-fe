'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, Bot, RefreshCw, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  AIErrorBreakdown,
  AIUsageByOperation,
  AdminInsightTab,
  RenewalStats,
  RevenueBreakdown,
  SubscriptionDistribution,
} from '@/features/admin/types';
import {
  formatCompactNumber,
  formatNumber,
  formatVND,
  isNotFoundError,
} from '@/features/admin/utils/dashboard';

const COLORS = ['#0f766e', '#d97706', '#2563eb', '#dc2626', '#7c3aed', '#64748b'];

type QueryState<T> = Pick<
  UseQueryResult<T | null>,
  'data' | 'error' | 'isFetching' | 'isLoading' | 'refetch'
>;

const humanize = (value: string) =>
  value
    .toLowerCase()
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center">
      <AlertTriangle className="size-7 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium">{label}</p>
    </div>
  );
}

function QueryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-destructive/30 p-6 text-center">
      <p className="text-sm font-medium">Không thể tải báo cáo này.</p>
      <Button className="mt-4" size="sm" variant="outline" onClick={onRetry}>
        <RefreshCw className="size-4" /> Thử lại
      </Button>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  children,
  isFetching,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  isFetching?: boolean;
}) {
  return (
    <section
      className={`rounded-3xl border border-border bg-card p-6 shadow-sm transition-opacity ${isFetching ? 'opacity-70' : ''}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-semibold">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function DistributionPanel({ query }: { query: QueryState<SubscriptionDistribution> }) {
  if (query.isLoading && !query.data) return <Skeleton className="h-72 rounded-3xl" />;
  if (query.error && !query.data && !isNotFoundError(query.error)) {
    return <QueryError onRetry={() => void query.refetch()} />;
  }
  
  let data: any = query.data;
  if (data && !data.distribution && data.data) {
    data = data.data;
  }
  if (data && !data.distribution && data.data) {
    data = data.data;
  }

  const rows = data?.distribution ?? [];
  const totalUsers = data?.totalUsers ?? 0;

  return (
    <Panel
      eyebrow="Subscriptions"
      title="Phân bổ người dùng theo gói"
      isFetching={query.isFetching}
    >
      {!rows.length && !totalUsers ? (
        <EmptyState label="Chưa có dữ liệu subscription." />
      ) : (
        <>
          <p className="text-3xl font-semibold tabular-nums">
            {formatCompactNumber(totalUsers)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Tổng người dùng có subscription</p>
          <div className="mt-6 space-y-4">
            {rows.map((item, index) => (
              <div key={item.planCode}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium">{humanize(item.planCode)}</span>
                  <span className="font-mono">
                    {formatNumber(item.userCount)} · {formatNumber(item.percentage)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, item.percentage)}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Panel>
  );
}

function RevenuePanel({ query }: { query: QueryState<RevenueBreakdown> }) {
  if (query.isLoading && !query.data) return <Skeleton className="h-96 rounded-3xl" />;
  if (query.error && !query.data && !isNotFoundError(query.error)) {
    return <QueryError onRetry={() => void query.refetch()} />;
  }
  
  // Resilient data extraction
  let data: any = query.data;
  if (data && !data.breakdown && data.data) {
    data = data.data;
  }
  if (data && !data.breakdown && data.data) {
    data = data.data;
  }

  const breakdown = data?.breakdown ?? [];
  const totalRevenueVnd = data?.totalRevenueVnd ?? 0;
  console.log(data)
  const plans = Array.from(new Set(breakdown.map((item: any) => item.planCode)));
  const rows = Array.from(new Set(breakdown.map((item: any) => item.month)))
    .sort()
    .map((month) => {
      const row: Record<string, string | number> = { month };
      breakdown
        .filter((item) => item.month === month)
        .forEach((item) => {
          row[item.planCode] = item.revenueVnd;
        });
      return row;
    });

  return (
    <Panel eyebrow="Revenue" title="Doanh thu theo gói và tháng" isFetching={query.isFetching}>
      {!rows.length && !totalRevenueVnd ? (
        <EmptyState label="Chưa có giao dịch subscription trong kỳ." />
      ) : (
        <>
          <div className="mb-5">
            <p className="text-3xl font-semibold tabular-nums">
              {formatVND(totalRevenueVnd)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Tổng doanh thu trong kỳ</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCompactNumber(Number(value))}
                />
                <Tooltip formatter={(value) => formatVND(Number(value))} />
                <Legend formatter={(value) => humanize(String(value))} />
                {plans.map((plan, index) => (
                  <Bar
                    key={plan}
                    dataKey={plan}
                    stackId="revenue"
                    fill={COLORS[index % COLORS.length]}
                    radius={index === plans.length - 1 ? [4, 4, 0, 0] : 0}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Panel>
  );
}

function RenewalPanel({ query }: { query: QueryState<RenewalStats> }) {
  if (query.isLoading && !query.data) return <Skeleton className="h-72 rounded-3xl" />;
  if (query.error && !query.data && !isNotFoundError(query.error)) {
    return <QueryError onRetry={() => void query.refetch()} />;
  }
  const data = query.data;
  return (
    <Panel eyebrow="Renewal" title="Hiệu quả gia hạn" isFetching={query.isFetching}>
      {!data ? (
        <EmptyState label="Chưa có dữ liệu gia hạn." />
      ) : (
        <>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-semibold">{formatNumber(data.successRate)}%</p>
              <p className="mt-1 text-xs text-muted-foreground">Tỷ lệ thành công</p>
            </div>
            <WalletCards className="size-9 text-primary" />
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.min(100, data.successRate)}%` }}
            />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Thành công</p>
              <p className="mt-1 text-xl font-semibold">{formatNumber(data.successCount)}</p>
            </div>
            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Thất bại</p>
              <p className="mt-1 text-xl font-semibold">{formatNumber(data.failedCount)}</p>
            </div>
            <div className="col-span-2 rounded-2xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Thử lại trung bình</p>
              <p className="mt-1 text-xl font-semibold">{formatNumber(data.avgRetryCount)}</p>
            </div>
          </div>
        </>
      )}
    </Panel>
  );
}

function AIUsagePanel({ query }: { query: QueryState<AIUsageByOperation> }) {
  if (query.isLoading && !query.data) return <Skeleton className="h-96 rounded-3xl" />;
  if (query.error && !query.data && !isNotFoundError(query.error))
    return <QueryError onRetry={() => void query.refetch()} />;
  const rows = query.data?.operations ?? [];
  return (
    <Panel eyebrow="Hoạt động AI" title="Sử dụng AI theo tác vụ" isFetching={query.isFetching}>
      {!rows.length ? (
        <EmptyState label="Chưa có lượt sử dụng AI trong kỳ." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b text-xs text-muted-foreground">
              <tr>
                <th className="pb-3">Tác vụ</th>
                <th className="pb-3 text-right">Lượt</th>
                <th className="pb-3 text-right">Chi phí</th>
                <th className="pb-3 text-right">Prompt tokens</th>
                <th className="pb-3 text-right">Output tokens</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr
                  key={`${item.operation}-${item.logicalRoute}`}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="py-3 font-medium">{humanize(item.operation)}</td>
                  <td className="py-3 text-right font-mono">{formatNumber(item.requestCount)}</td>
                  <td className="py-3 text-right font-mono">{formatVND(item.totalCostVnd)}</td>
                  <td className="py-3 text-right font-mono">
                    {formatCompactNumber(item.totalPromptTokens)}
                  </td>
                  <td className="py-3 text-right font-mono">
                    {formatCompactNumber(item.totalOutputTokens)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function AIErrorPanel({ query }: { query: QueryState<AIErrorBreakdown> }) {
  if (query.isLoading && !query.data) return <Skeleton className="h-96 rounded-3xl" />;
  if (query.error && !query.data && !isNotFoundError(query.error))
    return <QueryError onRetry={() => void query.refetch()} />;
  const data = query.data;
  return (
    <Panel eyebrow="Độ tin cậy của AI" title="Phân tích lỗi AI" isFetching={query.isFetching}>
      {!data ? (
        <EmptyState label="Chưa có dữ liệu lỗi AI." />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Tổng lượt</p>
              <p className="mt-1 text-2xl font-semibold">
                {formatCompactNumber(data.totalRequests)}
              </p>
            </div>
            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Tổng lỗi</p>
              <p className="mt-1 text-2xl font-semibold">{formatCompactNumber(data.totalErrors)}</p>
            </div>
            <div className="rounded-2xl bg-destructive/10 p-4">
              <p className="text-xs text-destructive">Tỷ lệ lỗi</p>
              <p className="mt-1 text-2xl font-semibold text-destructive">
                {formatNumber(data.errorRate)}%
              </p>
            </div>
          </div>
          {data.breakdown.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b text-xs text-muted-foreground">
                  <tr>
                    <th className="pb-3">Mã lỗi</th>
                    <th className="pb-3">Provider</th>
                    <th className="pb-3">Model</th>
                    <th className="pb-3 text-right">Số lỗi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.breakdown.map((item) => (
                    <tr
                      key={`${item.errorCode}-${item.provider}-${item.model}`}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="py-3 font-medium">{humanize(item.errorCode)}</td>
                      <td className="py-3">{humanize(item.provider)}</td>
                      <td className="py-3">{item.model || 'Không xác định'}</td>
                      <td className="py-3 text-right font-mono">{formatNumber(item.errorCount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </Panel>
  );
}

export function DashboardInsights({
  tab,
  onTabChange,
  subscriptionDistribution,
  revenueBreakdown,
  renewalStats,
  aiUsageByOperation,
  aiErrorBreakdown,
}: {
  tab: AdminInsightTab;
  onTabChange: (tab: AdminInsightTab) => void;
  subscriptionDistribution: QueryState<SubscriptionDistribution>;
  revenueBreakdown: QueryState<RevenueBreakdown>;
  renewalStats: QueryState<RenewalStats>;
  aiUsageByOperation: QueryState<AIUsageByOperation>;
  aiErrorBreakdown: QueryState<AIErrorBreakdown>;
}) {
  return (
    <section aria-labelledby="admin-insights-heading">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="admin-insights-heading" className="mt-2 text-2xl font-semibold">
            Báo cáo chuyên sâu
          </h2>
        </div>
        <Tabs value={tab} onValueChange={(value) => onTabChange(value as AdminInsightTab)}>
          <TabsList aria-label="Nhóm báo cáo Admin">
            <TabsTrigger value="subscriptions">
              <WalletCards className="size-4" /> Đăng ký
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Bot className="size-4" /> AI{' '}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {tab === 'subscriptions' ? (
        <div className="grid gap-6 xl:grid-cols-3">
          <DistributionPanel query={subscriptionDistribution} />
          <div className="xl:col-span-2">
            <RevenuePanel query={revenueBreakdown} />
          </div>
          <div className="xl:col-span-3">
            <RenewalPanel query={renewalStats} />
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          <AIUsagePanel query={aiUsageByOperation} />
          <AIErrorPanel query={aiErrorBreakdown} />
        </div>
      )}
    </section>
  );
}
