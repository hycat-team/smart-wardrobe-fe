'use client';

import React from 'react';
import { DailyQuota, UserSubscription } from '../types';
import { useToggleAutoRenewMutation } from '../queries/subscription.queries';
import { Calendar, RefreshCw, Layers, ScanLine } from 'lucide-react';
import { Switch } from '@/components/ui/switch'; // Wait, I might need to ensure Switch exists. If it doesn't I will just use standard HTML input for now or fallback if missing. I'll use a custom toggle.

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
    <div className="bg-primary text-primary-foreground rounded-[24px] p-8 shadow-xl relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#D9C5B2]/10 blur-3xl rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between gap-10 relative z-10">
        
        {/* Left: Plan Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display-lg text-3xl md:text-4xl font-bold tracking-tight text-[#F4F1EE]">
              {subscription.planName || subscription.PlanName || 'Gói Premium'}
            </h2>
            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase rounded-full tracking-widest border border-green-500/20">
              {subscription.status || 'ACTIVE'}
            </span>
          </div>
          
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 text-muted-foreground font-body-sm">
              <Calendar size={18} className="text-[#D9C5B2]" />
              <span>
                Còn lại <strong className="text-primary-foreground font-medium">{daysRemaining} ngày</strong> {expiresAtStr && `(Hết hạn: ${new Date(expiresAtStr).toLocaleDateString('vi-VN')})`}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-muted-foreground font-body-sm">
              <RefreshCw size={18} className="text-[#D9C5B2]" />
              <div className="flex items-center gap-3 w-full max-w-sm">
                <span>Tự động gia hạn qua ví:</span>
                {/* Custom Switch if shadcn switch is missing */}
                <button
                  role="switch"
                  aria-checked={autoRenew}
                  onClick={handleToggle}
                  disabled={toggleMutation.isPending}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#D9C5B2] focus:ring-offset-2 focus:ring-offset-primary ${
                    autoRenew ? 'bg-[#D9C5B2]' : 'bg-muted-foreground/30'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-primary shadow ring-0 transition duration-200 ease-in-out ${
                      autoRenew ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Daily Quota Usage */}
        <div className="flex-1 bg-background/5 rounded-[16px] p-6 border border-border/10">
          <h3 className="font-title-lg text-[13px] font-bold text-[#D9C5B2] uppercase tracking-widest mb-6">Hạn ngạch hôm nay</h3>
          
          <div className="space-y-6">
            {/* Outfits Quota */}
            <div>
              <div className="flex justify-between font-body-sm text-[13px] mb-2">
                <span className="flex items-center gap-2 text-primary-foreground/70"><Layers size={16} /> Tạo phối đồ</span>
                <span className="font-mono text-primary-foreground font-medium">{quota.outfitRecommendCount || quota.OutfitRecommendCount || 0} / {quota.maxOutfits || quota.MaxOutfits || '∞'}</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-1.5">
                <div 
                  className="bg-[#D9C5B2] h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, ((quota.outfitRecommendCount || quota.OutfitRecommendCount || 0) / (quota.maxOutfits || quota.MaxOutfits || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Scans Quota */}
            <div>
              <div className="flex justify-between font-body-sm text-[13px] mb-2">
                <span className="flex items-center gap-2 text-primary-foreground/70"><ScanLine size={16} /> Quét ảnh / Chat AI</span>
                <span className="font-mono text-primary-foreground font-medium">{quota.aiUsageCount || quota.AiUsageCount || 0} / {quota.aiOutfitDailyQuota || quota.AiOutfitDailyQuota || quota.aiChatDailyQuota || quota.AiChatDailyQuota || '∞'}</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-1.5">
                <div 
                  className="bg-[#D9C5B2] h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, ((quota.aiUsageCount || quota.AiUsageCount || 0) / (quota.aiOutfitDailyQuota || quota.AiOutfitDailyQuota || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
