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

export const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({ subscription, quota }) => {
  const toggleMutation = useToggleAutoRenewMutation();
  const [autoRenew, setAutoRenew] = React.useState(subscription.autoRenew);

  const handleToggle = () => {
    const newValue = !autoRenew;
    setAutoRenew(newValue);
    toggleMutation.mutate(newValue, {
      onError: () => setAutoRenew(!newValue) // revert on error
    });
  };

  const daysRemaining = Math.max(
    0, 
    Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
        
        {/* Left: Plan Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {subscription.plan.name}
            </h2>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold uppercase rounded-full tracking-wider border border-green-500/20">
              {subscription.status}
            </span>
          </div>
          
          <div className="space-y-3 mt-6">
            <div className="flex items-center gap-3 text-zinc-400">
              <Calendar size={18} className="text-purple-400" />
              <span>
                Còn lại <strong className="text-white">{daysRemaining} ngày</strong> (Hết hạn: {new Date(subscription.endDate).toLocaleDateString('vi-VN')})
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-zinc-400">
              <RefreshCw size={18} className="text-blue-400" />
              <div className="flex items-center gap-3 w-full max-w-sm">
                <span>Tự động gia hạn qua ví:</span>
                {/* Custom Switch if shadcn switch is missing */}
                <button
                  role="switch"
                  aria-checked={autoRenew}
                  onClick={handleToggle}
                  disabled={toggleMutation.isPending}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                    autoRenew ? 'bg-purple-500' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      autoRenew ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Daily Quota Usage */}
        <div className="flex-1 bg-black/20 rounded-2xl p-6 border border-white/5">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">Hạn ngạch hôm nay</h3>
          
          <div className="space-y-6">
            {/* Outfits Quota */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2 text-zinc-300"><Layers size={16} /> Tạo phối đồ</span>
                <span className="font-mono text-white">{quota.outfitsCreated} / {quota.maxOutfits}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (quota.outfitsCreated / quota.maxOutfits) * 100)}%` }}
                />
              </div>
            </div>

            {/* Scans Quota */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2 text-zinc-300"><ScanLine size={16} /> Quét ảnh</span>
                <span className="font-mono text-white">{quota.scansUsed} / {quota.maxScans}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (quota.scansUsed / quota.maxScans) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
