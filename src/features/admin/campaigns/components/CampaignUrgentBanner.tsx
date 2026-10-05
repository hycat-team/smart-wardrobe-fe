import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CampaignUrgentBannerProps {
  degradedCampaigns: Array<{
    code: string;
    degradedReason?: string;
    lastSweepAt?: string | null;
  }>;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function CampaignUrgentBanner({
  degradedCampaigns,
  onRefresh,
  isRefreshing,
}: CampaignUrgentBannerProps) {
  if (!degradedCampaigns || degradedCampaigns.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-900 dark:text-red-200 shadow-sm animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 shrink-0 mt-0.5">
            <AlertCircle className="size-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-tight text-red-700 dark:text-red-300">
              Cảnh báo nghiêm trọng: Cơ chế cấp gói đang bị lỗi gián đoạn!
            </h4>
            <p className="text-xs text-red-600/90 dark:text-red-300/80 mt-1 leading-relaxed">
              Hệ thống phát hiện worker nền không thể tự động cấp gói cho người dùng ở{' '}
              <span className="font-semibold underline underline-offset-2">
                {degradedCampaigns.length} chiến dịch
              </span>
              . Người dùng đăng ký mới có thể bị tồn đọng ở trạng thái chờ xử lý (eligible_pending).
            </p>

            <div className="mt-2.5 space-y-1.5">
              {degradedCampaigns.map((c) => (
                <div key={c.code} className="text-xs flex flex-wrap items-center gap-2">
                  <span className="font-mono font-medium px-2 py-0.5 rounded bg-red-500/20 text-red-800 dark:text-red-200">
                    {c.code}
                  </span>
                  {c.degradedReason && (
                    <span className="italic text-red-700/80 dark:text-red-300/80">
                      Lý do: &ldquo;{c.degradedReason}&rdquo;
                    </span>
                  )}
                  {c.lastSweepAt && (
                    <span className="text-[11px] opacity-75">
                      (Quét bù thành công cuối: {new Date(c.lastSweepAt).toLocaleTimeString('vi-VN')} {new Date(c.lastSweepAt).toLocaleDateString('vi-VN')})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {onRefresh && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="shrink-0 border-red-500/30 text-red-700 dark:text-red-300 hover:bg-red-500/15"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Kiểm tra lại
          </Button>
        )}
      </div>
    </div>
  );
}
