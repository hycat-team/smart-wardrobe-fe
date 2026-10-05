import React from 'react';
import { EligibilityRes } from '../types/campaign-admin.types';
import { getEligibilityStatusConfig, formatEligibilityReason } from '../utils/eligibility-reason';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle, Calendar, User, ShieldCheck } from 'lucide-react';

interface CustomerEligibilityResultProps {
  result: EligibilityRes;
}

export function CustomerEligibilityResult({ result }: CustomerEligibilityResultProps) {
  const statusConfig = getEligibilityStatusConfig(result.eligibility);
  const reasonText = formatEligibilityReason(result.reason);

  const registeredDate = result.userRegisteredAt
    ? new Date(result.userRegisteredAt).toLocaleString('vi-VN')
    : 'Chưa rõ';

  const watermarkDate = result.watermarkAt
    ? new Date(result.watermarkAt).toLocaleString('vi-VN')
    : null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
      {/* 1. Header with Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          {result.eligibility === 'granted' ? (
            <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
          ) : result.eligibility === 'eligible_pending' ? (
            <Clock className="size-5 text-amber-600 dark:text-amber-400 animate-spin" />
          ) : (
            <XCircle className="size-5 text-rose-500" />
          )}
          <span className="text-sm font-semibold text-foreground">
            Kết quả tra cứu điều kiện tài khoản
          </span>
        </div>

        <Badge variant="outline" className={`px-2.5 py-0.5 text-xs rounded-full border ${statusConfig.badgeClassName}`}>
          {statusConfig.label}
        </Badge>
      </div>

      {/* 2. Customer-Facing Explanation Message */}
      <div
        className={`p-3.5 rounded-lg text-sm ${
          result.eligibility === 'eligible_pending'
            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 font-medium'
            : result.eligibility === 'granted'
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
            : 'bg-muted border border-border text-foreground'
        }`}
      >
        <div className="font-semibold text-xs uppercase tracking-wider mb-1 opacity-75">
          Thông điệp giải thích cho khách hàng:
        </div>
        <p className="leading-relaxed">
          {result.eligibility === 'eligible_pending' ? (
            <>
              ✨ <strong>Bạn đủ điều kiện, hệ thống đang xử lý — thường chưa tới 1 phút.</strong>
              <span className="block text-xs font-normal opacity-90 mt-1">
                (Lưu ý CS: Tài khoản này hoàn toàn hợp lệ, thông điệp đang trong hàng đợi worker nền hoặc đợi lượt quét bù. Không thông báo hết suất cho khách).
              </span>
            </>
          ) : result.eligibility === 'granted' ? (
            <>🎉 Tài khoản đã được tặng gói thành công trong chiến dịch này.</>
          ) : (
            <>
              ❌ {statusConfig.customerMessage()}
              {reasonText && (
                <span className="block mt-1 text-xs opacity-90 font-medium">
                  {reasonText}
                </span>
              )}
            </>
          )}
        </p>
      </div>

      {/* 3. Detailed Technical Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-muted/40 p-3.5 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <User className="size-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Mã tài khoản (User ID):</span>
          <span className="font-mono font-medium truncate" title={result.userId}>
            {result.userId}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Chiến dịch:</span>
          <span className="font-mono font-semibold text-primary">{result.campaignCode}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="size-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Ngày đăng ký tài khoản:</span>
          <span className="font-medium">{registeredDate}</span>
        </div>

        {watermarkDate && (
          <div className="flex items-center gap-2">
            <Clock className="size-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Mốc ưu tiên chiến dịch:</span>
            <span className="font-medium text-amber-600 dark:text-amber-400">{watermarkDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
