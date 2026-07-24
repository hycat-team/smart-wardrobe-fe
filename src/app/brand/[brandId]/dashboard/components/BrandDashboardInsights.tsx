'use client';

import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Boxes, RefreshCw, Sparkles, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  BenefitRedemptionAnalytics,
  BrandInsightTab,
  CatalogStats,
  CustomerAcquisition,
  PointExpiryForecast,
  SpendSegmentation,
  TierDistribution,
} from '@/features/brand-portal/types';
import {
  formatBrandCompactNumber,
  formatBrandNumber,
  formatBrandVND,
  isBrandDashboardNotFoundError,
} from '@/features/brand-portal/utils/dashboard';

const COLORS = ['#0f766e', '#d97706', '#2563eb', '#dc2626', '#7c3aed', '#64748b'];
const SEGMENT_ORDER = ['low', 'medium', 'high', 'premium'];

type QueryState<T> = Pick<
  UseQueryResult<T | null>,
  'data' | 'error' | 'isFetching' | 'isLoading' | 'refetch'
>;

const humanize = (value: string) =>
  value
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

function Panel({
  eyebrow,
  title,
  isFetching,
  children,
}: {
  eyebrow: string;
  title: string;
  isFetching?: boolean;
  children: ReactNode;
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

function Empty({ label }: { label: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-destructive/30 p-6">
      <p className="text-sm">Không thể tải báo cáo này.</p>
      <Button className="mt-4" size="sm" variant="outline" onClick={onRetry}>
        <RefreshCw className="size-4" /> Thử lại
      </Button>
    </div>
  );
}

function ProgressRows({
  rows,
  disableHumanize = false,
}: {
  rows: Array<{ label: string; count: number; percentage: number }>;
  disableHumanize?: boolean;
}) {
  return (
    <div className="space-y-4">
      {rows.map((row, index) => (
        <div key={`${row.label}-${index}`}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
            <span className="font-medium">
              {disableHumanize ? row.label || 'unknown' : humanize(row.label || 'unknown')}
            </span>
            <span className="font-mono">
              {formatBrandNumber(row.count)} · {formatBrandNumber(row.percentage)}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, row.percentage)}%`,
                backgroundColor: COLORS[index % COLORS.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function AcquisitionPanel({ query }: { query: QueryState<CustomerAcquisition> }) {
  if (query.isLoading && !query.data) return <Skeleton className="h-80 rounded-3xl" />;
  if (query.error && !query.data && !isBrandDashboardNotFoundError(query.error))
    return <ErrorState onRetry={() => void query.refetch()} />;
  const rows =
    query.data?.sources.map((item) => ({
      label: item.source,
      count: item.customerCount,
      percentage: item.percentage,
    })) ?? [];
  return (
    <Panel eyebrow="" title="Kênh thu hút khách hàng" isFetching={query.isFetching}>
      {!rows.length ? (
        <Empty label="Chưa có dữ liệu kênh thu hút." />
      ) : (
        <>
          <p className="mb-5 text-3xl font-semibold">
            {formatBrandCompactNumber(query.data?.totalCustomers ?? 0)}{' '}
            <span className="text-sm font-normal text-muted-foreground">khách hàng</span>
          </p>
          <ProgressRows rows={rows} />
        </>
      )}
    </Panel>
  );
}

function SpendPanel({ query }: { query: QueryState<SpendSegmentation> }) {
  if (query.isLoading && !query.data) return <Skeleton className="h-80 rounded-3xl" />;
  if (query.error && !query.data && !isBrandDashboardNotFoundError(query.error))
    return <ErrorState onRetry={() => void query.refetch()} />;
  const segments = [...(query.data?.segments ?? [])].sort(
    (a, b) => SEGMENT_ORDER.indexOf(a.segment) - SEGMENT_ORDER.indexOf(b.segment)
  );
  return (
    <Panel eyebrow="" title="Phân khúc chi tiêu" isFetching={query.isFetching}>
      {!segments.length ? (
        <Empty label="Chưa có dữ liệu chi tiêu." />
      ) : (
        <div className="space-y-3">
          {segments.map((item, index) => (
            <div key={item.segment} className="rounded-2xl bg-muted/50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{humanize(item.segment)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatBrandVND(item.minVnd)} –{' '}
                    {item.maxVnd == null ? 'Không giới hạn' : formatBrandVND(item.maxVnd)}
                  </p>
                </div>
                <p className="font-mono text-sm">
                  {formatBrandNumber(item.customerCount)} · {formatBrandNumber(item.percentage)}%
                </p>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background">
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
      )}
    </Panel>
  );
}

function TierPanel({ query }: { query: QueryState<TierDistribution> }) {
  if (query.isLoading && !query.data) return <Skeleton className="h-80 rounded-3xl" />;
  if (query.error && !query.data && !isBrandDashboardNotFoundError(query.error))
    return <ErrorState onRetry={() => void query.refetch()} />;
  const tiers = [...(query.data?.tiers ?? [])].sort((a, b) => a.tierRank - b.tierRank);
  return (
    <Panel eyebrow="" title="Phân bổ hạng thành viên" isFetching={query.isFetching}>
      {!tiers.length ? (
        <Empty label="Chưa có dữ liệu hạng loyalty." />
      ) : (
        <ProgressRows
          disableHumanize
          rows={tiers.map((item) => ({
            label: `${item.tierRank}. ${item.tierName}`,
            count: item.memberCount,
            percentage: item.percentage,
          }))}
        />
      )}
    </Panel>
  );
}

function ExpiryPanel({ query }: { query: QueryState<PointExpiryForecast> }) {
  if (query.isLoading && !query.data) return <Skeleton className="h-80 rounded-3xl" />;
  if (query.error && !query.data && !isBrandDashboardNotFoundError(query.error))
    return <ErrorState onRetry={() => void query.refetch()} />;
  const rows = [...(query.data?.forecast ?? [])]
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(0, 6);
  return (
    <Panel eyebrow="" title="Điểm sắp hết hạn" isFetching={query.isFetching}>
      {!rows.length ? (
        <Empty label="Không có điểm sắp hết hạn." />
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatBrandCompactNumber(Number(value))}
              />
              <Tooltip formatter={(value) => formatBrandNumber(Number(value))} />
              <Bar dataKey="pointsExpiring" fill="#0f766e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}

function BenefitPanel({ query }: { query: QueryState<BenefitRedemptionAnalytics> }) {
  if (query.isLoading && !query.data) return <Skeleton className="h-96 rounded-3xl" />;
  if (query.error && !query.data && !isBrandDashboardNotFoundError(query.error))
    return <ErrorState onRetry={() => void query.refetch()} />;
  const data = query.data;
  return (
    <Panel eyebrow="Benefits" title="Hiệu quả đổi quyền lợi" isFetching={query.isFetching}>
      {!data || (!data.trend.length && !data.topBenefits.length) ? (
        <Empty label="Chưa có lượt đổi benefit." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-3xl font-semibold">
              {formatBrandCompactNumber(data.totalRedemptions)}{' '}
              <span className="text-sm font-normal text-muted-foreground">lượt đổi</span>
            </p>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trend}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="redemptionCount"
                    stroke="#0f766e"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-3">
            {data.topBenefits.map((item, index) => (
              <div key={item.benefitId} className="rounded-2xl bg-muted/50 p-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.benefitName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {humanize(item.benefitType)}
                    </p>
                  </div>
                  <p className="font-mono text-sm">
                    {formatBrandNumber(item.redemptionCount)} · {formatBrandNumber(item.percentage)}
                    %
                  </p>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-background">
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
        </div>
      )}
    </Panel>
  );
}

function CatalogPanel({ query }: { query: QueryState<CatalogStats> }) {
  if (query.isLoading && !query.data) return <Skeleton className="h-96 rounded-3xl" />;
  if (query.error && !query.data && !isBrandDashboardNotFoundError(query.error))
    return <ErrorState onRetry={() => void query.refetch()} />;
  const data = query.data;
  return (
    <Panel eyebrow="" title="Cấu trúc danh mục sản phẩm" isFetching={query.isFetching}>
      {!data ? (
        <Empty label="Chưa có dữ liệu catalog." />
      ) : (
        <>
          <p className="text-4xl font-semibold">
            {formatBrandCompactNumber(data.totalItems)}{' '}
            <span className="text-sm font-normal text-muted-foreground">sản phẩm</span>
          </p>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <h4 className="mb-4 text-sm font-semibold">Theo trạng thái</h4>
              <ProgressRows
                rows={data.byStatus.map((item) => ({
                  label: item.label,
                  count: item.count,
                  percentage: item.percentage,
                }))}
              />
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Theo loại sản phẩm</h4>
              <ProgressRows
                rows={data.byType.map((item) => ({
                  label: item.label,
                  count: item.count,
                  percentage: item.percentage,
                }))}
              />
            </div>
          </div>
        </>
      )}
    </Panel>
  );
}

export function BrandDashboardInsights({
  tab,
  onTabChange,
  customerAcquisition,
  spendSegmentation,
  tierDistribution,
  pointExpiryForecast,
  benefitRedemptionAnalytics,
  catalogStats,
}: {
  tab: BrandInsightTab;
  onTabChange: (tab: BrandInsightTab) => void;
  customerAcquisition: QueryState<CustomerAcquisition>;
  spendSegmentation: QueryState<SpendSegmentation>;
  tierDistribution: QueryState<TierDistribution>;
  pointExpiryForecast: QueryState<PointExpiryForecast>;
  benefitRedemptionAnalytics: QueryState<BenefitRedemptionAnalytics>;
  catalogStats: QueryState<CatalogStats>;
}) {
  return (
    <section aria-labelledby="brand-insights-heading">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="brand-insights-heading" className="mt-2 text-2xl font-semibold">
            Phân tích chuyên sâu
          </h2>
        </div>
        <Tabs value={tab} onValueChange={(value) => onTabChange(value as BrandInsightTab)}>
          <TabsList aria-label="Nhóm báo cáo Brand">
            <TabsTrigger value="customers">
              <UsersRound className="size-4" /> Khách hàng
            </TabsTrigger>
            <TabsTrigger value="loyalty">
              <Sparkles className="size-4" /> Loyalty
            </TabsTrigger>
            <TabsTrigger value="operations">
              <Boxes className="size-4" /> Vận hành
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {tab === 'customers' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <AcquisitionPanel query={customerAcquisition} />
          <SpendPanel query={spendSegmentation} />
        </div>
      ) : tab === 'loyalty' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <TierPanel query={tierDistribution} />
          <ExpiryPanel query={pointExpiryForecast} />
          <div className="lg:col-span-2">
            <BenefitPanel query={benefitRedemptionAnalytics} />
          </div>
        </div>
      ) : (
        <CatalogPanel query={catalogStats} />
      )}
    </section>
  );
}
