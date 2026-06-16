'use client';

import React from 'react';
import { SubscriptionPlan } from '../types';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { usePurchaseDirectMutation, usePurchaseWithWalletMutation } from '@/features/billing/queries/billing.queries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PricingCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
  currentPlanSlug?: string;
}

export const PricingCard = ({ plan, isPopular, currentPlanSlug }: PricingCardProps) => {
  const purchaseDirect = usePurchaseDirectMutation();
  const purchaseWallet = usePurchaseWithWalletMutation();

  const handlePurchaseDirect = () => {
    purchaseDirect.mutate({ planSlug: plan.slug || (plan as any).planSlug });
  };

  const handlePurchaseWallet = () => {
    purchaseWallet.mutate({ planSlug: plan.slug || (plan as any).planSlug });
  };

  const isFreePlan = (plan.price || plan.Price) === 0;
  const planSlug = plan.slug || plan.planSlug || plan.PlanSlug || (plan as any).slug;
  const isCurrentPlan = currentPlanSlug && planSlug === currentPlanSlug;
  const shouldHideButton = isFreePlan || isCurrentPlan;

  return (
    <div
      className={`relative flex flex-col p-8 lg:p-10 rounded-none transition-all duration-500 hover:-translate-y-2 ${
        isPopular
          ? 'bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-xl'
          : 'bg-[#F4F1EE] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#1A1A1A]'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#D9C5B2] text-[10px] font-['IBM_Plex_Mono'] font-semibold tracking-widest text-white uppercase shadow-sm flex items-center gap-1.5">
          <Sparkles className="size-3" />
          KHUYÊN DÙNG
        </div>
      )}

      <div className="mb-6 border-b border-current/10 pb-6">
        <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl font-medium mb-3 tracking-tight">{plan.name || plan.Name}</h3>
        <p className={`font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider leading-relaxed min-h-[40px] ${isPopular ? 'text-white/70' : 'text-[#1A1A1A]/70'}`}>
          {plan.description || plan.Description || 'Quản lý tủ đồ thông minh mỗi ngày.'}
        </p>
      </div>

      <div className="mb-8 flex items-baseline gap-2">
        <span className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold tracking-tight">
          {(plan.price || plan.Price) === 0 ? 'Miễn phí' : (plan.price || plan.Price || 0).toLocaleString('vi-VN')}
        </span>
        {(plan.price || plan.Price) !== 0 && (
          <span className={`font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-wider ${isPopular ? 'text-[#D9C5B2]' : 'text-[#1A1A1A]/50'}`}>
            VNĐ / {plan.durationDays || plan.DurationDays || 30} NGÀY
          </span>
        )}
      </div>

      <div className="flex-1">
        <ul className="space-y-4 mb-10">
          <li className="flex items-start gap-3">
            <Check size={16} strokeWidth={1.5} className={`mt-0.5 shrink-0 ${isPopular ? 'text-[#D9C5B2]' : 'text-[#1A1A1A]'}`} />
            <span className={`font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-wider ${isPopular ? 'text-white/90' : 'text-[#1A1A1A]'}`}>
              TỐI ĐA <strong>{plan.maxOutfits || plan.MaxOutfits}</strong> BỘ PHỐI ĐỒ
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={16} strokeWidth={1.5} className={`mt-0.5 shrink-0 ${isPopular ? 'text-[#D9C5B2]' : 'text-[#1A1A1A]'}`} />
            <span className={`font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-wider ${isPopular ? 'text-white/90' : 'text-[#1A1A1A]'}`}>
              LƯỢT TẠO PHỐI ĐỒ AI: <strong>{plan.aiOutfitDailyQuota || plan.AiOutfitDailyQuota || '∞'}</strong> / NGÀY
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={16} strokeWidth={1.5} className={`mt-0.5 shrink-0 ${isPopular ? 'text-[#D9C5B2]' : 'text-[#1A1A1A]'}`} />
            <span className={`font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-wider ${isPopular ? 'text-white/90' : 'text-[#1A1A1A]'}`}>
              LƯỢT CHAT AI: <strong>{plan.aiChatDailyQuota || plan.AiChatDailyQuota || '∞'}</strong> / NGÀY
            </span>
          </li>
          {plan.features?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <Check size={16} strokeWidth={1.5} className={`mt-0.5 shrink-0 ${isPopular ? 'text-[#D9C5B2]' : 'text-[#1A1A1A]'}`} />
              <span className={`font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-wider ${isPopular ? 'text-white/90' : 'text-[#1A1A1A]'}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {!shouldHideButton && (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              className={`w-full h-12 rounded-none font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.15em] transition-all duration-300 ${
                isPopular 
                  ? 'bg-[#D9C5B2] text-white hover:bg-white hover:text-[#1A1A1A]' 
                  : 'bg-transparent text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
              }`}
            >
              Đăng ký ngay
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-[#F4F1EE] border-[#1A1A1A]/10 rounded-none p-8">
            <DialogHeader>
              <DialogTitle className="font-['Playfair_Display'] text-3xl font-medium text-[#1A1A1A]">Phương thức thanh toán</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-5 py-6">
              <p className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-wider text-[#1A1A1A]/70 leading-relaxed border-l-2 border-[#D9C5B2] pl-3">
                Kích hoạt gói <span className="font-bold text-[#1A1A1A]">{plan.name || plan.Name}</span><br />
                Tổng cộng: <span className="font-bold text-[#1A1A1A]">{(plan.price || plan.Price || 0).toLocaleString('vi-VN')} VNĐ</span>
              </p>
              
              <Button 
                onClick={handlePurchaseDirect} 
                disabled={purchaseDirect.isPending}
                className="h-14 rounded-none bg-[#1A1A1A] text-white hover:bg-[#D9C5B2] font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-colors"
              >
                {purchaseDirect.isPending ? 'Đang xử lý...' : 'Chuyển khoản (VietQR / PayOS)'}
              </Button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-[#1A1A1A]/10"></div>
                <span className="flex-shrink-0 mx-4 text-[#1A1A1A]/40 text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-widest">HOẶC</span>
                <div className="flex-grow border-t border-[#1A1A1A]/10"></div>
              </div>

              <Button 
                onClick={handlePurchaseWallet} 
                disabled={purchaseWallet.isPending}
                variant="outline"
                className="h-14 rounded-none border border-[#1A1A1A] bg-transparent hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-colors"
              >
                {purchaseWallet.isPending ? 'Đang xử lý...' : 'Thanh toán bằng số dư ví'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

