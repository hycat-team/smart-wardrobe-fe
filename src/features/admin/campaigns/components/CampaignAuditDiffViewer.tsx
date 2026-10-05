import React from 'react';
import {
  CampaignAuditAction,
  CampaignAuditPayload,
  CampaignAuditCreatePayload,
  CampaignAuditUpdatePayload,
  CampaignAuditClosePayload,
} from '../types/campaign-admin.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit3, XCircle } from 'lucide-react';

interface CampaignAuditDiffViewerProps {
  action: CampaignAuditAction;
  payload: CampaignAuditPayload;
}

export function CampaignAuditDiffViewer({ action, payload }: CampaignAuditDiffViewerProps) {
  if (action === 'campaign.create') {
    const p = payload as CampaignAuditCreatePayload;
    return (
      <div className="space-y-1.5 text-xs bg-muted/30 p-3 rounded-lg border border-border">
        <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
          <PlusCircle className="size-3.5" />
          Khởi tạo chiến dịch mới
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-muted-foreground">
          <div>Gói cước: <strong className="text-foreground font-mono">{p.planSlug}</strong></div>
          <div>Hạn mức: <strong className="text-foreground">{p.quota}</strong></div>
          <div>Dự phòng: <strong className="text-foreground">{p.reserve}</strong></div>
          <div>Bắt đầu: <strong className="text-foreground">{new Date(p.startsAt).toLocaleDateString('vi-VN')}</strong></div>
          <div>Kết thúc: <strong className="text-foreground">{p.endsAt ? new Date(p.endsAt).toLocaleDateString('vi-VN') : 'Không giới hạn'}</strong></div>
        </div>
      </div>
    );
  }

  if (action === 'campaign.close') {
    const p = payload as CampaignAuditClosePayload;
    return (
      <div className="space-y-2 text-xs bg-red-500/5 p-3 rounded-lg border border-red-500/20">
        <div className="flex items-center gap-1.5 font-semibold text-red-600 dark:text-red-400">
          <XCircle className="size-3.5" />
          Đóng cưỡng bức chiến dịch (v{p.before?.version} &rarr; v{p.after?.version})
        </div>
        <div className="text-foreground">
          <span className="text-muted-foreground font-medium">Lý do giải trình: </span>
          <span className="italic font-medium">&ldquo;{p.reason}&rdquo;</span>
        </div>
      </div>
    );
  }

  if (action === 'campaign.update') {
    const p = payload as CampaignAuditUpdatePayload;
    const before = (p.before || {}) as Record<string, unknown>;
    const after = (p.after || {}) as Record<string, unknown>;

    // Tập hợp toàn bộ các trường thay đổi
    const allKeys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)])).filter(
      (k) => k !== 'campaignCode'
    );

    const keyLabels: Record<string, string> = {
      version: 'Phiên bản (version)',
      quota: 'Hạn mức chính (quota)',
      reserve: 'Suất dự phòng (reserve)',
      planSlug: 'Mã gói cước (planSlug)',
      startsAt: 'Thời điểm bắt đầu',
      endsAt: 'Thời điểm kết thúc',
    };

    const formatVal = (key: string, val: unknown) => {
      if (val === undefined || val === null) return '—';
      if (val === '') return <span className="italic text-muted-foreground">(đã xóa / vô thời hạn)</span>;
      if (key === 'startsAt' || key === 'endsAt') {
        const d = new Date(String(val));
        return isNaN(d.getTime()) ? String(val) : d.toLocaleString('vi-VN');
      }
      return String(val);
    };

    return (
      <div className="space-y-2 text-xs bg-muted/20 rounded-lg border border-border p-3">
        <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400 mb-1">
          <Edit3 className="size-3.5" />
          Thay đổi thông số (Trước &rarr; Sau)
        </div>

        <Table className="text-xs">
          <TableHeader>
            <TableRow className="h-7 border-border/50">
              <TableHead className="h-7 text-[11px] font-semibold text-muted-foreground w-1/3">Trường thay đổi</TableHead>
              <TableHead className="h-7 text-[11px] font-semibold text-muted-foreground w-1/3">Giá trị trước (Before)</TableHead>
              <TableHead className="h-7 text-[11px] font-semibold text-muted-foreground w-1/3">Giá trị sau (After)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allKeys.map((key) => (
              <TableRow key={key} className="h-7 border-border/40">
                <TableCell className="py-1 font-medium text-foreground">
                  {keyLabels[key] || key}
                </TableCell>
                <TableCell className="py-1 font-mono text-muted-foreground">
                  {formatVal(key, before[key])}
                </TableCell>
                <TableCell className="py-1 font-mono font-semibold text-primary">
                  {formatVal(key, after[key])}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <pre className="text-[11px] font-mono p-2 bg-muted rounded overflow-auto max-h-40">
      {JSON.stringify(payload, null, 2)}
    </pre>
  );
}
