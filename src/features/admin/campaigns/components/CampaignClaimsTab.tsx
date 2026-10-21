'use client';

import React, { useState } from 'react';
import { useAdminCampaignClaims } from '../queries/campaign-admin.queries';
import { CampaignClaimsFilter } from './CampaignClaimsFilter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

interface CampaignClaimsTabProps {
  campaignCode: string;
}

export function CampaignClaimsTab({ campaignCode }: CampaignClaimsTabProps) {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [fromTime, setFromTime] = useState<string | undefined>();
  const [toTime, setToTime] = useState<string | undefined>();

  const { data, isLoading, isFetching } = useAdminCampaignClaims(campaignCode, {
    page,
    limit,
    from: fromTime,
    to: toTime,
  });

  const claims = data?.items || [];
  const metadata = data?.metadata || { page: 1, limit: 20, totalItems: 0, totalPages: 1 };

  const handleFilter = (from?: string, to?: string) => {
    setFromTime(from);
    setToTime(to);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* 1. Bộ lọc khoảng thời gian */}
      <CampaignClaimsFilter onFilter={handleFilter} isLoading={isFetching} />

      {/* 2. Tiêu đề danh sách và phân trang */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground font-medium">
          Tìm thấy <span className="font-semibold text-foreground">{metadata.totalItems}</span> lượt cấp
        </div>

        {metadata.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground">
              Trang {metadata.page} / {metadata.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2"
              onClick={() => setPage((p) => Math.min(metadata.totalPages, p + 1))}
              disabled={page >= metadata.totalPages || isFetching}
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* 3. Bảng dữ liệu lượt cấp */}
      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="inline-block size-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-2" />
          <p className="text-xs text-muted-foreground">Đang tải danh sách lượt cấp...</p>
        </div>
      ) : claims.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <div className="size-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2 text-muted-foreground">
            <Inbox className="size-5" />
          </div>
          <h4 className="text-sm font-semibold">Chưa có lượt cấp nào</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Không tìm thấy lượt cấp gói nào phù hợp với điều kiện tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="font-semibold text-xs tracking-wider uppercase text-foreground">
                  Người nhận (User)
                </TableHead>
                <TableHead className="font-semibold text-xs tracking-wider uppercase text-foreground">
                  Gói cước
                </TableHead>
                <TableHead className="font-semibold text-xs tracking-wider uppercase text-foreground text-center">
                  Nguồn ngân sách
                </TableHead>
                <TableHead className="font-semibold text-xs tracking-wider uppercase text-foreground">
                  Thời điểm đăng ký
                </TableHead>
                <TableHead className="font-semibold text-xs tracking-wider uppercase text-foreground">
                  Thời điểm cấp gói
                </TableHead>
                <TableHead className="font-semibold text-xs tracking-wider uppercase text-foreground">
                  Thời điểm hết hạn
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim, idx) => (
                <TableRow key={`${claim.userId}-${idx}`} className="hover:bg-muted/30 transition-colors">
                  {/* Người nhận */}
                  <TableCell>
                    <div className="font-medium text-xs text-foreground">
                      {claim.username || 'Người dùng ẩn danh'}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground truncate max-w-[200px]" title={claim.userId}>
                      {claim.userId}
                    </div>
                  </TableCell>

                  {/* Gói cước */}
                  <TableCell>
                    <span className="font-mono text-xs font-medium">{claim.planSlug}</span>
                  </TableCell>

                  {/* Nguồn ngân sách */}
                  <TableCell className="text-center">
                    {claim.source === 'main' ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-medium">
                        Hạn mức chính
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-[11px] font-medium">
                        Suất dự phòng
                      </Badge>
                    )}
                  </TableCell>

                  {/* Thời điểm đăng ký */}
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(claim.registeredAt).toLocaleString('vi-VN')}
                  </TableCell>

                  {/* Thời điểm cấp */}
                  <TableCell className="text-xs font-medium text-foreground">
                    {new Date(claim.grantedAt).toLocaleString('vi-VN')}
                  </TableCell>

                  {/* Thời điểm hết hạn */}
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(claim.expiresAt).toLocaleString('vi-VN')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
