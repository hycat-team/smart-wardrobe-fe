import React from 'react';
import { CampaignSummaryRes } from '../types/campaign-admin.types';
import { CampaignBudgetProgressBar } from './CampaignBudgetProgressBar';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { Badge } from '@/components/ui/badge';
import { Lock, Clock, AlertTriangle, Tag } from 'lucide-react';

interface CampaignOverviewTabProps {
  campaign: CampaignSummaryRes;
}

export function CampaignOverviewTab({ campaign }: CampaignOverviewTabProps) {
  const startDate = new Date(campaign.startsAt).toLocaleString('vi-VN');
  const endDate = campaign.endsAt ? new Date(campaign.endsAt).toLocaleString('vi-VN') : 'Không giới hạn';
  const watermarkDate = campaign.watermarkAt ? new Date(campaign.watermarkAt).toLocaleString('vi-VN') : 'Chưa chốt';
  const sweepDate = campaign.lastSweepAt ? new Date(campaign.lastSweepAt).toLocaleString('vi-VN') : 'Chưa ghi nhận';
  const closedDate = campaign.closedAt ? new Date(campaign.closedAt).toLocaleString('vi-VN') : null;

  return (
    <div className="space-y-6">
      {/* 1. Tiến độ ngân sách trực quan */}
      <CampaignBudgetProgressBar
        quota={campaign.quota}
        reserve={campaign.reserve}
        grantedMainCount={campaign.grantedMainCount}
        grantedCompensationCount={campaign.grantedCompensationCount}
        hardCap={campaign.hardCap}
      />

      {/* 2. Cảnh báo suy giảm cơ chế cấp (nếu có) */}
      {campaign.degraded && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-800 dark:text-red-200 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-300">
            <AlertTriangle className="size-4 animate-pulse" />
            Cơ chế cấp gói nền bị lỗi suy giảm (degraded: true)
          </div>
          <p>{campaign.degradedReason || 'Hệ thống quét bù đang gặp sự cố gián đoạn.'}</p>
        </div>
      )}

      {/* 3. Lưới thông số chi tiết */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Thông tin cấu hình */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Tag className="size-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Cấu hình Chiến dịch</h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-muted-foreground">Mã chiến dịch (Code):</span>
              <span className="font-mono font-bold text-foreground">{campaign.code}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-muted-foreground">Gói cước tặng:</span>
              <span className="font-medium text-foreground">
                {campaign.planName} <span className="text-muted-foreground font-mono">({campaign.planSlug})</span>
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-muted-foreground">Trạng thái vòng đời:</span>
              <CampaignStatusBadge status={campaign.status} closedAt={campaign.closedAt} />
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-muted-foreground">Khóa hạn mức (Budget Lock):</span>
              {campaign.budgetLocked ? (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 gap-1 text-[11px]">
                  <Lock className="size-3" /> Đã khóa (đã phát sinh lượt cấp)
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[11px]">
                  Chưa khóa (cho phép sửa hạn mức)
                </Badge>
              )}
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground">Phiên bản kiểm soát (Version):</span>
              <span className="font-mono font-semibold bg-muted px-2 py-0.5 rounded">v{campaign.version}</span>
            </div>
          </div>
        </div>

        {/* Các mốc thời gian & Vận hành */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Clock className="size-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Thời Gian & Vận Hành</h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-muted-foreground">Thời điểm bắt đầu:</span>
              <span className="font-medium text-foreground">{startDate}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-muted-foreground">Thời điểm kết thúc:</span>
              <span className="font-medium text-foreground">{endDate}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-muted-foreground">Mốc ưu tiên (Watermark):</span>
              <span className="font-medium text-amber-600 dark:text-amber-400">{watermarkDate}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-muted-foreground">Quét bù thành công cuối:</span>
              <span className="font-medium text-foreground">{sweepDate}</span>
            </div>

            {closedDate && (
              <div className="flex justify-between items-center py-1 text-red-600 dark:text-red-400 font-medium">
                <span>Đóng cưỡng bức lúc:</span>
                <span>{closedDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
