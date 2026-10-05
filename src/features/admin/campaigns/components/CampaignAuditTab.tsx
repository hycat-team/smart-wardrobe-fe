'use client';

import React, { useState } from 'react';
import { useAdminCampaignAudit } from '../queries/campaign-admin.queries';
import { CampaignAuditDiffViewer } from './CampaignAuditDiffViewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, History, Info, RefreshCw, User, Globe } from 'lucide-react';

interface CampaignAuditTabProps {
  campaignCode: string;
}

export function CampaignAuditTab({ campaignCode }: CampaignAuditTabProps) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching, refetch } = useAdminCampaignAudit(campaignCode, {
    page,
    limit,
  });

  const auditItems = data?.items || [];
  const metadata = data?.metadata || { page: 1, limit: 10, totalItems: 0, totalPages: 1 };

  return (
    <div className="space-y-4">
      {/* 1. Thông báo cơ chế bất đồng bộ */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5 text-xs text-blue-900 dark:text-blue-200 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Info className="size-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Nhật ký kiểm toán được ghi nhận bất đồng bộ qua hệ thống event-bus. Nếu vừa thao tác sửa hoặc đóng chiến dịch, vui lòng làm mới sau ít giây để thấy bản ghi mới nhất.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/10 shrink-0 gap-1"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`size-3 ${isFetching ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* 2. Tiêu đề danh sách và phân trang */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground font-medium">
          Tổng số <span className="font-semibold text-foreground">{metadata.totalItems}</span> bản ghi kiểm toán
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

      {/* 3. Danh sách dòng kiểm toán */}
      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="inline-block size-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-2" />
          <p className="text-xs text-muted-foreground">Đang tải nhật ký kiểm toán...</p>
        </div>
      ) : auditItems.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <div className="size-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2 text-muted-foreground">
            <History className="size-5" />
          </div>
          <h4 className="text-sm font-semibold">Chưa có bản ghi kiểm toán</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Chiến dịch này chưa phát sinh thêm thao tác kiểm toán nào được lưu vết.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {auditItems.map((item) => {
            const formattedDate = new Date(item.createdAt).toLocaleString('vi-VN');

            return (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-2xs hover:border-border/80 transition-colors"
              >
                {/* Header dòng kiểm toán */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-[10px] px-2 py-0.5">
                      {item.action}
                    </Badge>
                    <span className="font-medium text-foreground">{formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                    <div className="flex items-center gap-1">
                      <User className="size-3" />
                      <span className="font-mono" title={item.actorUserId}>
                        {item.actorUserId ? `${item.actorUserId.slice(0, 8)}...` : 'Hệ thống'}
                      </span>
                    </div>

                    {item.requestIp && (
                      <div className="flex items-center gap-1">
                        <Globe className="size-3" />
                        <span className="font-mono">{item.requestIp}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nội dung đối chiếu thay đổi */}
                <CampaignAuditDiffViewer action={item.action} payload={item.payload} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
