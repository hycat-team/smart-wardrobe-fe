'use client';

import React from 'react';
import { DailyQuota, UserSubscription } from '../types';
import { useToggleAutoRenewMutation } from '../queries/subscription.queries';
import { Calendar, RefreshCw, Layers, ScanLine } from 'lucide-react';

interface CurrentPlanCardProps {
  subscription: UserSubscription;
  quota: DailyQuota;
}

export const CurrentPlanCard = ({ subscription, quota }: CurrentPlanCardProps) => {
  const toggleMutation = useToggleAutoRenewMutation();
  const [autoRenew, setAutoRenew] = React.useState(subscription.isAutoRenewEnabled || subscription.IsAutoRenewEnabled || false);

  const handleToggle = () => {
    const newValue = !autoRenew;
    setAutoRenew(newValue);
    toggleMutation.mutate(newValue, {
      onError: () => setAutoRenew(!newValue) // revert on error
    });
  };

  const expiresAtStr = subscription.expiresAt || subscription.ExpiresAt;
  const daysRemaining = expiresAtStr ? Math.max(
    0,
    Math.ceil((new Date(expiresAtStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  ) : 'Vô hạn';

  return (
    <div className="bg-foreground text-background rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12 relative z-10">

        {/* Left: Plan Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-background">
              {subscription.planName || subscription.PlanName || 'Gói Premium'}
            </h2>
            <span className="px-3 py-1 bg-background/20 text-background text-[10px] font-bold uppercase tracking-widest border border-background/20 rounded-full">
              {subscription.status || 'ACTIVE'}
            </span>
          </div>

          <div className="space-y-6 mt-10">
            <div className="flex items-start gap-4 text-background/70 font-bold text-[12px] uppercase tracking-wider">
              <Calendar size={18} className="text-primary mt-0.5 shrink-0" />
              <div className="leading-relaxed">
                <span className="block mb-1">Thời hạn còn lại</span>
                <strong className="text-background text-[14px]">{daysRemaining} NGÀY</strong>
                {expiresAtStr && <span className="block mt-1 text-background/50 lowercase tracking-normal">Hết hạn: {new Date(expiresAtStr).toLocaleDateString('vi-VN')}</span>}
              </div>
            </div>

            <div className="flex items-center gap-4 text-background/70 font-bold text-[12px] uppercase tracking-wider">
              <RefreshCw size={18} className="text-primary shrink-0" />
              <div className="flex items-center justify-between w-full max-w-[280px]">
                <span>Tự động gia hạn qua ví</span>
                <button
                  role="switch"
                  aria-checked={autoRenew}
                  onClick={handleToggle}
                  disabled={toggleMutation.isPending}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-secondary focus:ring-offset-1 focus:ring-offset-foreground ${autoRenew ? 'bg-secondary' : 'bg-background/20'
                    }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform bg-foreground transition duration-200 ease-in-out rounded-full ${autoRenew ? 'translate-x-4' : 'translate-x-0'
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Daily Quota Usage */}
        <div className="flex-1 bg-background/10 p-6 md:p-8 border border-background/10 rounded-2xl">
          <h3 className="font-bold text-[11px] text-secondary uppercase tracking-[0.2em] mb-8 border-b border-background/10 pb-4">
            HẠN MỨC GÓI CƯỚC
          </h3>

          <div className="space-y-8">
            {/* Max Outfits */}
            <div className="flex justify-between font-bold text-[11px] uppercase tracking-wider">
              <span className="flex items-center gap-2 text-background/70"><Layers size={14} /> TỐI ĐA BỘ PHỐI ĐỒ</span>
              <span className="font-medium text-background">{quota.maxOutfits || quota.MaxOutfits || '∞'} BỘ</span>
            </div>

            {/* Outfits Quota */}
            <div>
              <div className="flex justify-between font-bold text-[11px] uppercase tracking-wider mb-3">
                <span className="flex items-center gap-2 text-background/70"><ScanLine size={14} /> TẠO PHỐI ĐỒ AI</span>
                <span className="font-medium text-background">{quota.outfitRecommendCount || quota.OutfitRecommendCount || 0} / {quota.aiOutfitDailyQuota || quota.AiOutfitDailyQuota || '∞'}</span>
              </div>
              <div className="w-full bg-background/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-1000 min-w-[8px] rounded-full"
                  style={{ width: `${Math.min(100, ((quota.outfitRecommendCount || quota.OutfitRecommendCount || 0) / (quota.aiOutfitDailyQuota || quota.AiOutfitDailyQuota || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Scans Quota */}
            <div>
              <div className="flex justify-between font-bold text-[11px] uppercase tracking-wider mb-3">
                <span className="flex items-center gap-2 text-background/70"><ScanLine size={14} /> CHAT VỚI AI</span>
                <span className="font-medium text-background">{quota.aiUsageCount || quota.AiUsageCount || 0} / {quota.aiChatDailyQuota || quota.AiChatDailyQuota || '∞'}</span>
              </div>
              <div className="w-full bg-background/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-1000 min-w-[8px] rounded-full"
                  style={{ width: `${Math.min(100, ((quota.aiUsageCount || quota.AiUsageCount || 0) / (quota.aiChatDailyQuota || quota.AiChatDailyQuota || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
