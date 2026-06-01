'use client';

import React from 'react';
import { WalletBalance } from '../types';
import { CreditCard, Wallet, Plus } from 'lucide-react';
import { TopupModal } from './TopupModal';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WalletBalanceWidgetProps {
  balanceData: WalletBalance;
}

export const WalletBalanceWidget: React.FC<WalletBalanceWidgetProps> = ({ balanceData }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-2xl group">
      {/* 3D Glass effects */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-110" />

      {/* Credit Card Simulation */}
      <div className="relative z-10 w-full max-w-sm mx-auto aspect-[1.586/1] bg-gradient-to-tr from-indigo-950 via-indigo-900/80 to-blue-900/80 rounded-2xl p-6 shadow-2xl border border-white/10 backdrop-blur-md flex flex-col justify-between overflow-hidden">
        
        {/* Card Overlay elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex justify-between items-start z-10">
          <div className="flex items-center gap-2">
            <Wallet className="text-blue-300" size={24} />
            <span className="text-blue-200/80 font-medium tracking-wide">Ví Nội Bộ</span>
          </div>
          <CreditCard className="text-white/30" size={28} />
        </div>

        <div className="z-10 mt-8">
          <p className="text-blue-200/60 text-sm mb-1 font-medium tracking-wider uppercase">Số dư khả dụng</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {balanceData.balance.toLocaleString('vi-VN')}
            </span>
            <span className="text-xl text-blue-200 font-semibold">{balanceData.currency || 'đ'}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10 flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] flex items-center gap-2">
              <Plus strokeWidth={3} size={20} />
              Nạp thêm tiền
            </Button>
          </DialogTrigger>
          
          <TopupModal />
        </Dialog>
      </div>
    </div>
  );
};
