'use client';

import { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { WalletDTO } from '../types';
import { TopUpModal } from './TopUpModal';
import { Plus } from 'lucide-react';

gsap.registerPlugin(useGSAP);

export function WalletBalanceCard({ balanceData }: { balanceData?: WalletDTO }) {
  const container = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLHeadingElement>(null);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  useGSAP(() => {
    if (numberRef.current && balanceData !== undefined) {
      // Counter animation
      const obj = { val: 0 };
      gsap.to(obj, {
        val: balanceData.balance,
        duration: 1.5,
        ease: 'power3.out',
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.innerText = formatVND(Math.round(obj.val));
          }
        }
      });

      // Simple reveal
      gsap.from(container.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }, { scope: container, dependencies: [balanceData] });

  return (
    <Card ref={container} className="relative overflow-hidden border-0 bg-gradient-to-br from-zinc-900 to-black text-white p-6 md:p-8 shadow-2xl">
      {/* Glassmorphism accents */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Số dư khả dụng</h3>
          <h1 ref={numberRef} className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
            {formatVND(0)}
          </h1>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsTopUpOpen(true)}
            size="lg"
            className="bg-white text-black hover:bg-zinc-200 transition-colors font-medium cursor-pointer"
          >
            <Plus className="mr-2 size-4" data-icon="inline-start" />
            Nạp tiền
          </Button>
        </div>
      </div>

      <TopUpModal open={isTopUpOpen} onOpenChange={setIsTopUpOpen} />
    </Card>
  );
}
