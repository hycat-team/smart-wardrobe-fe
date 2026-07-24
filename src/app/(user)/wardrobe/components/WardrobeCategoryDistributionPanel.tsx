'use client';

import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown, ChevronUp, RefreshCw, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { WardrobeCategoryDistribution } from '@/features/wardrobe/types';

const COLORS = ['#0f766e', '#d97706', '#2563eb', '#dc2626', '#7c3aed', '#64748b', '#db2777', '#65a30d'];

export function WardrobeCategoryDistributionPanel({
  data,
  isLoading,
  isFetching,
  error,
  onRetry,
}: {
  data?: WardrobeCategoryDistribution | null;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const categories = data?.categories ?? [];

  return (
    <section className={`overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-opacity ${isFetching ? 'opacity-70' : ''}`} aria-labelledby="wardrobe-distribution-heading">
      <button type="button" className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen}>
        <div className="flex items-center gap-4"><span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Shirt className="size-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Wardrobe analytics</p><h2 id="wardrobe-distribution-heading" className="mt-1 text-xl font-semibold">Phân bổ tủ đồ</h2></div></div>
        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">{data ? `${data.totalItems} món đồ` : ''}{isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}</span>
      </button>

      {isOpen && (
        <div className="border-t border-border px-5 py-6 sm:px-6">
          {isLoading && !data ? (
            <div className="grid gap-6 md:grid-cols-[280px_1fr]"><Skeleton className="h-64 rounded-3xl" /><Skeleton className="h-64 rounded-3xl" /></div>
          ) : error && !data ? (
            <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-destructive/30 text-center"><p className="text-sm font-medium">Không thể tải phân bổ danh mục.</p><Button className="mt-4" size="sm" variant="outline" onClick={onRetry}><RefreshCw className="size-4" /> Thử lại</Button></div>
          ) : !data || categories.length === 0 ? (
            <div className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed text-sm text-muted-foreground">Thêm trang phục để bắt đầu xem phân bổ tủ đồ.</div>
          ) : (
            <div className="grid items-center gap-8 md:grid-cols-[280px_1fr]">
              <div className="relative h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categories} dataKey="itemCount" nameKey="categoryName" cx="50%" cy="50%" innerRadius={68} outerRadius={104} paddingAngle={2} stroke="none">{categories.map((item, index) => <Cell key={item.categoryId} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip formatter={(value, _name, item) => [`${Number(value)} món`, item.payload.categoryName]} /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><p className="text-3xl font-semibold">{data.totalItems}</p><p className="text-xs text-muted-foreground">món đồ</p></div></div>
              <div className="grid gap-3 sm:grid-cols-2">{categories.map((item, index) => <div key={item.categoryId} className="rounded-2xl bg-muted/50 p-4"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><span className="mt-1 size-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} /><p className="font-medium">{item.categoryName}</p></div><p className="font-mono text-sm">{item.itemCount}</p></div><div className="mt-3 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background"><div className="h-full rounded-full" style={{ width: `${Math.min(100, item.percentage)}%`, backgroundColor: COLORS[index % COLORS.length] }} /></div><span className="w-12 text-right text-xs text-muted-foreground">{item.percentage.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%</span></div></div>)}</div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}