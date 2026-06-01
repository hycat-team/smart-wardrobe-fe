'use client';

import React from 'react';
import { SubscriptionPlan } from '../types';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';
import { usePurchaseDirectMutation, usePurchaseWithWalletMutation } from '@/features/billing/queries/billing.queries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PricingCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, isPopular }) => {
  const purchaseDirect = usePurchaseDirectMutation();
  const purchaseWallet = usePurchaseWithWalletMutation();

  const handlePurchaseDirect = () => {
    purchaseDirect.mutate({ planSlug: plan.planSlug });
  };

  const handlePurchaseWallet = () => {
    purchaseWallet.mutate({ planSlug: plan.planSlug });
  };

  return (
    <div
      className={`relative flex flex-col p-8 rounded-3xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
        isPopular
          ? 'bg-gradient-to-b from-white/10 to-white/5 border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.15)]'
          : 'bg-white/5 border border-white/10 hover:border-white/20'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-xs font-semibold text-white tracking-wider flex items-center gap-1 shadow-lg shadow-purple-500/25">
          <Zap size={14} className="fill-white" />
          PHỔ BIẾN NHẤT
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <p className="text-sm text-zinc-400 min-h-[40px]">{plan.description}</p>
      </div>

      <div className="mb-6 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400">
          {plan.price.toLocaleString('vi-VN')}đ
        </span>
        <span className="text-zinc-500 font-medium">/{plan.durationDays} ngày</span>
      </div>

      <div className="flex-1">
        <ul className="space-y-4 mb-8">
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-purple-500/20 p-1 rounded-full text-purple-400">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-zinc-300 text-sm">Tối đa <strong className="text-white">{plan.maxOutfits}</strong> bộ phối đồ</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-purple-500/20 p-1 rounded-full text-purple-400">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-zinc-300 text-sm">Lượt quét ảnh/ngày: <strong className="text-white">{plan.maxScans}</strong></span>
          </li>
          {plan.features?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="mt-1 bg-purple-500/20 p-1 rounded-full text-purple-400">
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="text-zinc-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className={`w-full h-12 rounded-xl font-semibold text-base transition-all duration-300 ${
              isPopular 
                ? 'bg-white text-zinc-900 hover:bg-zinc-200 shadow-lg shadow-white/10' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Đăng ký gói này
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Chọn phương thức thanh toán</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button 
              onClick={handlePurchaseDirect} 
              disabled={purchaseDirect.isPending}
              className="h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              {purchaseDirect.isPending ? 'Đang tạo...' : 'Thanh toán trực tiếp (VietQR / PayOS)'}
            </Button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink-0 mx-4 text-zinc-500 text-sm font-medium">HOẶC</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <Button 
              onClick={handlePurchaseWallet} 
              disabled={purchaseWallet.isPending}
              variant="outline"
              className="h-14 border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-white rounded-xl flex items-center justify-center gap-2"
            >
              {purchaseWallet.isPending ? 'Đang xử lý...' : 'Thanh toán bằng ví nội bộ'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
