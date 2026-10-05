import React from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { CampaignSummaryRes } from '../types/campaign-admin.types';
import { Lock, ArrowUpRight, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CampaignTableProps {
  campaigns: CampaignSummaryRes[];
  isLoading?: boolean;
}

export function CampaignTable({ campaigns, isLoading }: CampaignTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <div className="inline-block size-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
        <p className="text-sm text-muted-foreground">Đang tải danh sách chiến dịch...</p>
      </div>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
          <Lock className="size-6" />
        </div>
        <h3 className="text-base font-semibold">Chưa có chiến dịch nào</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Hệ thống chưa ghi nhận chiến dịch tặng gói nào. Bạn có thể mở một chiến dịch mới ngay bây giờ.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="font-semibold text-xs tracking-wider uppercase text-foreground">
              Mã chiến dịch
            </TableHead>
            <TableHead className="font-semibold text-xs tracking-wider uppercase text-foreground">
              Gói cước
            </TableHead>
            <TableHead className="font-semibold text-xs tracking-wider uppercase text-foreground text-center">
              Ngân sách (Chính + Dự phòng)
            </TableHead>
            <TableHead className="font-semibold text-xs tracking-wider uppercase text-foreground text-center">
              Đã cấp / Còn lại
            </TableHead>
            <TableHead className="font-semibold text-xs tracking-wider uppercase text-foreground">
              Trạng thái
            </TableHead>
            <TableHead className="font-semibold text-xs tracking-wider uppercase text-foreground">
              Thời gian diễn ra
            </TableHead>
            <TableHead className="font-semibold text-xs tracking-wider uppercase text-foreground text-right">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((item) => {
            const startDate = new Date(item.startsAt).toLocaleDateString('vi-VN');
            const endDate = item.endsAt
              ? new Date(item.endsAt).toLocaleDateString('vi-VN')
              : 'Vô thời hạn';

            return (
              <TableRow key={item.code} className="hover:bg-muted/30 transition-colors">
                {/* 1. Mã chiến dịch */}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/campaigns/${encodeURIComponent(item.code)}`}
                      className="font-mono text-sm text-primary hover:underline font-semibold"
                    >
                      {item.code}
                    </Link>
                    {item.budgetLocked && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-4 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 font-normal cursor-help gap-1"
                            >
                              <Lock className="size-2.5" />
                              Khóa
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">
                            Chiến dịch đã có người nhận gói. Hạn mức ngân sách đã bị khóa tự động.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {item.degraded && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-4 bg-red-500/10 text-red-600 border-red-500/30 gap-1 cursor-help animate-pulse"
                            >
                              <AlertTriangle className="size-2.5 text-red-600" />
                              Lỗi worker
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">
                            Cơ chế cấp bị lỗi gián đoạn! {item.degradedReason}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>

                {/* 2. Gói cước */}
                <TableCell>
                  <div className="text-sm font-medium text-foreground">
                    {item.planName || item.planSlug}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{item.planSlug}</div>
                </TableCell>

                {/* 3. Ngân sách */}
                <TableCell className="text-center">
                  <div className="text-sm font-semibold">
                    {item.quota}{' '}
                    <span className="text-xs font-normal text-muted-foreground">
                      + {item.reserve} ({item.hardCap})
                    </span>
                  </div>
                </TableCell>

                {/* 4. Đã cấp / Còn lại */}
                <TableCell className="text-center">
                  <div className="text-sm font-semibold">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {item.grantedTotalCount}
                    </span>{' '}
                    <span className="text-muted-foreground">/</span>{' '}
                    <span className="text-amber-600 dark:text-amber-400">
                      {item.remainingMain + item.remainingCompensation}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Chính: {item.grantedMainCount}/{item.quota} · Dự phòng:{' '}
                    {item.grantedCompensationCount}/{item.reserve}
                  </div>
                </TableCell>

                {/* 5. Trạng thái */}
                <TableCell>
                  <CampaignStatusBadge status={item.status} closedAt={item.closedAt} />
                </TableCell>

                {/* 6. Thời gian */}
                <TableCell className="text-xs text-muted-foreground">
                  <div>Từ: {startDate}</div>
                  <div>Đến: {endDate}</div>
                </TableCell>

                {/* 7. Thao tác */}
                <TableCell className="text-right">
                  <Link
                    href={`/admin/campaigns/${encodeURIComponent(item.code)}`}
                    className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'h-8 gap-1' })}
                  >
                    Chi tiết
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
