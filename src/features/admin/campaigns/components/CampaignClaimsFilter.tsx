'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar, Filter, X } from 'lucide-react';

interface CampaignClaimsFilterProps {
  onFilter: (from?: string, to?: string) => void;
  isLoading?: boolean;
}

// Chuyển chuỗi datetime-local sang RFC3339 có múi giờ
function toRFC3339String(localDateTimeStr?: string | null): string | undefined {
  if (!localDateTimeStr) return undefined;
  const d = new Date(localDateTimeStr);
  if (isNaN(d.getTime())) return undefined;

  const offset = -d.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const pad = (num: number) => String(Math.floor(Math.abs(num))).padStart(2, '0');
  const tzHours = pad(offset / 60);
  const tzMinutes = pad(offset % 60);
  const tzFormatted = `${sign}${tzHours}:${tzMinutes}`;

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzFormatted}`;
}

export function CampaignClaimsFilter({ onFilter, isLoading }: CampaignClaimsFilterProps) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(toRFC3339String(fromDate), toRFC3339String(toDate));
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    onFilter(undefined, undefined);
  };

  const hasFilter = !!fromDate || !!toDate;

  return (
    <form onSubmit={handleApply} className="flex flex-wrap items-end gap-3 p-3.5 rounded-xl border border-border bg-card shadow-2xs">
      <div className="space-y-1">
        <Label htmlFor="claims-from" className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Calendar className="size-3" /> Từ thời điểm cấp
        </Label>
        <Input
          id="claims-from"
          type="datetime-local"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="h-8 text-xs font-mono"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="claims-to" className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Calendar className="size-3" /> Đến thời điểm cấp
        </Label>
        <Input
          id="claims-to"
          type="datetime-local"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="h-8 text-xs font-mono"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" variant="secondary" className="h-8 gap-1.5 text-xs" disabled={isLoading}>
          <Filter className="size-3.5" />
          Lọc kết quả
        </Button>

        {hasFilter && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 gap-1 text-xs text-muted-foreground"
            onClick={handleReset}
            disabled={isLoading}
          >
            <X className="size-3.5" />
            Xóa lọc
          </Button>
        )}
      </div>
    </form>
  );
}
