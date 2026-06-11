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
}

export const PricingCard = ({ plan, isPopular }: PricingCardProps) => {
  const purchaseDirect = usePurchaseDirectMutation();
  const purchaseWallet = usePurchaseWithWalletMutation();

  const handlePurchaseDirect = () => {
    purchaseDirect.mutate({ planSlug: plan.slug || (plan as any).planSlug });
  };

  const handlePurchaseWallet = () => {
    purchaseWallet.mutate({ planSlug: plan.slug || (plan as any).planSlug });
  };

  return (
    <div
      className={`relative flex flex-col p-8 lg:p-10 rounded-[24px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
        isPopular
          ? 'bg-primary text-primary-foreground border border-transparent shadow-xl'
          : 'bg-background text-primary border border-border/60 hover:border-primary/20'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#D9C5B2] rounded-full text-[10px] font-bold text-primary tracking-widest uppercase shadow-sm flex items-center gap-1.5">
          <Sparkles className="size-3" />
          MEMBER
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-display-lg text-2xl md:text-3xl font-bold mb-2 tracking-tight">{plan.name || plan.Name}</h3>
        <p className={`font-body-sm text-[13px] leading-relaxed min-h-[40px] ${isPopular ? 'text-[#F4F1EE]/70' : 'text-muted-foreground'}`}>
          {plan.description || plan.Description || 'Gói hội viên thông minh giúp quản lý tủ đồ dễ dàng hơn.'}
        </p>
      </div>

      <div className="mb-8 flex items-baseline gap-1">
        <span className="font-title-lg text-4xl font-extrabold tracking-tight">
          {(plan.price || plan.Price || 0).toLocaleString('vi-VN')}đ
        </span>
        <span className={`font-body-sm text-[13px] font-medium ${isPopular ? 'text-[#D9C5B2]' : 'text-muted-foreground'}`}>
          /{plan.durationDays || plan.DurationDays || 30} ngày
        </span>
      </div>

      <div className="flex-1">
        <ul className="space-y-4 mb-10">
          <li className="flex items-start gap-3">
            <Check size={16} strokeWidth={2} className={`mt-0.5 shrink-0 ${isPopular ? 'text-[#D9C5B2]' : 'text-primary'}`} />
            <span className={`font-body-sm text-[14px] ${isPopular ? 'text-[#F4F1EE]' : 'text-primary'}`}>
              Tối đa <strong>{plan.maxOutfits || plan.MaxOutfits}</strong> bộ phối đồ
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={16} strokeWidth={2} className={`mt-0.5 shrink-0 ${isPopular ? 'text-[#D9C5B2]' : 'text-primary'}`} />
            <span className={`font-body-sm text-[14px] ${isPopular ? 'text-[#F4F1EE]' : 'text-primary'}`}>
              Lượt AI tạo phối đồ: <strong>{plan.aiOutfitDailyQuota || plan.AiOutfitDailyQuota || '∞'}</strong>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={16} strokeWidth={2} className={`mt-0.5 shrink-0 ${isPopular ? 'text-[#D9C5B2]' : 'text-primary'}`} />
            <span className={`font-body-sm text-[14px] ${isPopular ? 'text-[#F4F1EE]' : 'text-primary'}`}>
              Lượt Chat AI: <strong>{plan.aiChatDailyQuota || plan.AiChatDailyQuota || '∞'}</strong>
            </span>
          </li>
          {plan.features?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <Check size={16} strokeWidth={2} className={`mt-0.5 shrink-0 ${isPopular ? 'text-[#D9C5B2]' : 'text-primary'}`} />
              <span className={`font-body-sm text-[14px] ${isPopular ? 'text-[#F4F1EE]' : 'text-primary'}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className={`w-full h-12 rounded-full font-body-sm text-[14px] font-semibold transition-all duration-300 ${
              isPopular 
                ? 'bg-[#D9C5B2] text-primary hover:bg-white' 
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            Đăng ký gói này
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-background border-border text-primary rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display-lg text-2xl">Chọn phương thức thanh toán</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="font-body-sm text-[14px] text-muted-foreground mb-2">
              Bạn sẽ thanh toán gói <strong className="text-primary">{plan.name || plan.Name}</strong> với giá <strong className="text-primary">{(plan.price || plan.Price || 0).toLocaleString('vi-VN')}đ</strong>.
            </p>
            
            <Button 
              onClick={handlePurchaseDirect} 
              disabled={purchaseDirect.isPending}
              className="h-12 bg-primary text-primary-foreground hover:opacity-90 rounded-xl shadow-none font-body-sm font-semibold flex items-center justify-center gap-2"
            >
              {purchaseDirect.isPending ? 'Đang tạo...' : 'Thanh toán chuyển khoản (VietQR / PayOS)'}
            </Button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink-0 mx-4 text-muted-foreground text-[10px] font-mono tracking-widest">HOẶC</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <Button 
              onClick={handlePurchaseWallet} 
              disabled={purchaseWallet.isPending}
              variant="outline"
              className="h-12 border-border bg-secondary/50 hover:bg-secondary text-primary rounded-xl font-body-sm font-semibold flex items-center justify-center gap-2"
            >
              {purchaseWallet.isPending ? 'Đang xử lý...' : 'Thanh toán bằng ví nội bộ'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
