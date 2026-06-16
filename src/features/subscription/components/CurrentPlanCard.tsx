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
    <div className="bg-[#1A1A1A] text-white rounded-none p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12 relative z-10">
        
        {/* Left: Plan Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium tracking-tight text-white">
              {subscription.planName || subscription.PlanName || 'Gói Premium'}
            </h2>
            <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-['IBM_Plex_Mono'] font-bold uppercase tracking-widest border border-white/20">
              {subscription.status || 'ACTIVE'}
            </span>
          </div>
          
          <div className="space-y-6 mt-10">
            <div className="flex items-start gap-4 text-white/70 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-wider">
              <Calendar size={18} className="text-[#D9C5B2] mt-0.5 shrink-0" />
              <div className="leading-relaxed">
                <span className="block mb-1">Thời hạn còn lại</span>
                <strong className="text-white text-[14px]">{daysRemaining} NGÀY</strong> 
                {expiresAtStr && <span className="block mt-1 text-white/50 lowercase tracking-normal">Hết hạn: {new Date(expiresAtStr).toLocaleDateString('vi-VN')}</span>}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-white/70 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-wider">
              <RefreshCw size={18} className="text-[#D9C5B2] shrink-0" />
              <div className="flex items-center justify-between w-full max-w-[280px]">
                <span>Tự động gia hạn qua ví</span>
                <button
                  role="switch"
                  aria-checked={autoRenew}
                  onClick={handleToggle}
                  disabled={toggleMutation.isPending}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-none border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#D9C5B2] focus:ring-offset-1 focus:ring-offset-[#1A1A1A] ${
                    autoRenew ? 'bg-[#D9C5B2]' : 'bg-white/20'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform bg-[#1A1A1A] transition duration-200 ease-in-out ${
                      autoRenew ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Daily Quota Usage */}
        <div className="flex-1 bg-white/5 p-6 md:p-8 border border-white/10">
          <h3 className="font-['IBM_Plex_Mono'] text-[11px] font-bold text-[#D9C5B2] uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-4">
            HẠN NGẠCH HÔM NAY
          </h3>
          
          <div className="space-y-8">
            {/* Outfits Quota */}
            <div>
              <div className="flex justify-between font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider mb-3">
                <span className="flex items-center gap-2 text-white/70"><Layers size={14} /> TẠO PHỐI ĐỒ</span>
                <span className="font-medium text-white">{quota.outfitRecommendCount || quota.OutfitRecommendCount || 0} / {quota.maxOutfits || quota.MaxOutfits || '∞'}</span>
              </div>
              <div className="w-full bg-black/50 h-1">
                <div 
                  className="bg-[#D9C5B2] h-1 transition-all duration-1000 min-w-[4px]"
                  style={{ width: `${Math.min(100, ((quota.outfitRecommendCount || quota.OutfitRecommendCount || 0) / (quota.maxOutfits || quota.MaxOutfits || 1)) * 100)}%` }}
                />
              </div>
              {(quota.outfitRecommendCount || quota.OutfitRecommendCount || 0) === 0 && (
                <p className="text-[9px] text-white/40 mt-2 italic font-['IBM_Plex_Mono'] uppercase">Chưa sử dụng</p>
              )}
            </div>

            {/* Scans Quota */}
            <div>
              <div className="flex justify-between font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider mb-3">
                <span className="flex items-center gap-2 text-white/70"><ScanLine size={14} /> QUÉT ẢNH & CHAT AI</span>
                <span className="font-medium text-white">{quota.aiUsageCount || quota.AiUsageCount || 0} / {quota.aiOutfitDailyQuota || quota.AiOutfitDailyQuota || quota.aiChatDailyQuota || quota.AiChatDailyQuota || '∞'}</span>
              </div>
              <div className="w-full bg-black/50 h-1">
                <div 
                  className="bg-[#D9C5B2] h-1 transition-all duration-1000 min-w-[4px]"
                  style={{ width: `${Math.min(100, ((quota.aiUsageCount || quota.AiUsageCount || 0) / (quota.aiOutfitDailyQuota || quota.AiOutfitDailyQuota || 1)) * 100)}%` }}
                />
              </div>
              {(quota.aiUsageCount || quota.AiUsageCount || 0) === 0 && (
                <p className="text-[9px] text-white/40 mt-2 italic font-['IBM_Plex_Mono'] uppercase">Chưa sử dụng</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
