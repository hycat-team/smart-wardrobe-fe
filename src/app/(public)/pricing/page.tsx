'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { subscriptionApi } from '@/features/subscription/api/subscription.api';
import { PricingCard } from '@/features/subscription/components/PricingCard';
import { CurrentPlanCard } from '@/features/subscription/components/CurrentPlanCard';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Public pricing page.
 *
 * Plans are public data, so guests must be able to read them without an account; only the purchase
 * action requires one. This page therefore lives in the public route group and switches the card CTA
 * to "log in to buy" for guests.
 */
export default function PricingPage() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;

  const { data: plans = [], isLoading: isLoadingPlans } = useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: () => subscriptionApi.getSubscriptionPlans(),
  });

  const { data: mySubscription, isLoading: isLoadingSub } = useQuery({
    queryKey: ['subscription', 'me'],
    queryFn: () => subscriptionApi.getMySubscription(),
    retry: 0,
    enabled: isAuthenticated,
  });

  const { data: dailyQuota } = useQuery({
    queryKey: ['subscription', 'quota'],
    queryFn: () => subscriptionApi.getDailyQuota(),
    retry: 0,
    enabled: isAuthenticated,
  });

  if (isLoadingPlans || (isAuthenticated && isLoadingSub)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-foreground" size={40} strokeWidth={1} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <div className="pt-28 pb-20 px-6 md:px-12 text-center max-w-4xl mx-auto border-b border-border mb-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-border" />
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 leading-[1.3] text-foreground">
          Khám phá tiềm năng<br />
          <span className="italic text-primary">tủ đồ của bạn.</span>
        </h1>
        <p className="font-medium text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Trải nghiệm quyền năng của AI Stylist với các thẻ hội viên cao cấp từ Closy. Thanh toán an toàn, linh hoạt mọi lúc.
        </p>
        {!isAuthenticated && (
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Đăng nhập để mua gói ·{' '}
            <Link href="/auth/register" className="text-foreground underline underline-offset-4">
              Tạo tài khoản
            </Link>
          </p>
        )}
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 space-y-32">
        {isAuthenticated && mySubscription && dailyQuota && (
          <section className="mx-auto w-full max-w-5xl">
            <h2 className="font-bold text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6 text-center">
              GÓI HIỆN TẠI CỦA BẠN
            </h2>
            <CurrentPlanCard subscription={mySubscription} quota={dailyQuota} />
          </section>
        )}

        <section className="mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6">Thẻ Hội Viên</h2>
            <div className="w-12 h-px bg-primary mx-auto mb-6" />
            <p className="font-bold text-[11px] uppercase tracking-widest text-muted-foreground">
              Chọn gói phù hợp với phong cách của bạn
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 ${plans.length === 2 ? 'max-w-4xl mx-auto' : 'lg:grid-cols-3'} gap-6 mt-4`}>
            {plans.length > 0 ? (
              plans.map((plan, index) => {
                const isPopular = index === 1;
                return (
                  <div key={plan.id} className={`flex flex-col h-full ${isPopular ? 'z-20 relative lg:scale-105' : 'z-10 relative'}`}>
                    <PricingCard
                      plan={plan}
                      isPopular={isPopular}
                      currentPlanSlug={mySubscription?.planSlug || mySubscription?.PlanSlug}
                      readOnly={!isAuthenticated}
                    />
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-muted/50 rounded-3xl border border-border text-center text-muted-foreground py-32 font-bold text-[12px] uppercase tracking-widest">
                Chưa có gói hội viên nào được cấu hình.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
