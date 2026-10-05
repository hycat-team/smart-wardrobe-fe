import React from 'react';

interface CampaignBudgetProgressBarProps {
  quota: number;
  reserve: number;
  grantedMainCount: number;
  grantedCompensationCount: number;
  hardCap: number;
}

export function CampaignBudgetProgressBar({
  quota,
  reserve,
  grantedMainCount,
  grantedCompensationCount,
  hardCap,
}: CampaignBudgetProgressBarProps) {
  const mainPercent = Math.min(100, Math.round((grantedMainCount / Math.max(1, quota)) * 100));
  const reservePercent =
    reserve > 0
      ? Math.min(100, Math.round((grantedCompensationCount / reserve) * 100))
      : 0;

  const totalGranted = grantedMainCount + grantedCompensationCount;
  const totalPercent = Math.min(100, Math.round((totalGranted / Math.max(1, hardCap)) * 100));

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Tiến Độ Ngân Sách Cấp Gói</h3>
          <p className="text-xs text-muted-foreground">
            Trần cứng tối đa: <strong className="text-foreground">{hardCap}</strong> suất ({quota} chính + {reserve} dự phòng)
          </p>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold font-mono text-primary">{totalGranted}</span>
          <span className="text-xs text-muted-foreground font-mono"> / {hardCap} ({totalPercent}%)</span>
        </div>
      </div>

      {/* Main Combined Progress Bar */}
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden flex shadow-inner">
        {/* Main Quota Granted */}
        <div
          className="bg-emerald-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${(grantedMainCount / Math.max(1, hardCap)) * 100}%` }}
          title={`Hạn mức chính: ${grantedMainCount}/${quota}`}
        />
        {/* Reserve Granted */}
        <div
          className="bg-amber-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${(grantedCompensationCount / Math.max(1, hardCap)) * 100}%` }}
          title={`Suất dự phòng: ${grantedCompensationCount}/${reserve}`}
        />
      </div>

      {/* Detailed Dual Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Hạn mức chính */}
        <div className="p-3 rounded-lg border border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              Hạn mức chính (Quota)
            </span>
            <span className="font-mono font-semibold">
              {grantedMainCount} / {quota} ({mainPercent}%)
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${mainPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Còn lại: {Math.max(0, quota - grantedMainCount)} suất
          </div>
        </div>

        {/* Suất dự phòng */}
        <div className="p-3 rounded-lg border border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500" />
              Suất dự phòng (Reserve)
            </span>
            <span className="font-mono font-semibold">
              {grantedCompensationCount} / {reserve} ({reservePercent}%)
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${reservePercent}%` }}
            />
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Còn lại: {Math.max(0, reserve - grantedCompensationCount)} suất
          </div>
        </div>
      </div>
    </div>
  );
}
