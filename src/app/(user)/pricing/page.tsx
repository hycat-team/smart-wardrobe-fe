'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { subscriptionApi } from '@/features/subscription/api/subscription.api';
import { PricingCard } from '@/features/subscription/components/PricingCard';
import { CurrentPlanCard } from '@/features/subscription/components/CurrentPlanCard';
import { Loader2 } from 'lucide-react';

export default function PricingPage() {
  const { data: plans = [], isLoading: isLoadingPlans } = useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: () => subscriptionApi.getSubscriptionPlans(),
  });

  const { data: mySubscription, isLoading: isLoadingSub } = useQuery({
    queryKey: ['subscription', 'me'],
    queryFn: () => subscriptionApi.getMySubscription(),
    retry: 0,
  });

  const { data: dailyQuota } = useQuery({
    queryKey: ['subscription', 'quota'],
    queryFn: () => subscriptionApi.getDailyQuota(),
    retry: 0,
  });

  if (isLoadingPlans) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary pb-24">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        <div className="container relative z-10 px-4 mx-auto text-center max-w-3xl">
          <h1 className="font-display-lg text-5xl md:text-7xl font-bold tracking-tight mb-6 text-primary leading-tight">
            Elevate Your Style
          </h1>
          <p className="font-body-lg text-muted-foreground text-lg md:text-xl">
            Khám phá tiềm năng tủ đồ của bạn với các gói hội viên cao cấp. Trải nghiệm không giới hạn quyền năng của AI Stylist.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 space-y-24 max-w-[1200px]">
        {/* Current Subscription Section */}
        {mySubscription && dailyQuota && (
          <section className="mx-auto">
            <CurrentPlanCard subscription={mySubscription} quota={dailyQuota} />
          </section>
        )}

        {/* Pricing Plans Section */}
        <section className="mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-3xl md:text-4xl font-bold mb-4">Membership Plans</h2>
            <p className="font-body-sm text-muted-foreground tracking-wide uppercase">Thanh toán an toàn - Hủy bất kỳ lúc nào</p>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 ${plans.length === 2 ? 'max-w-4xl mx-auto' : 'lg:grid-cols-3'} gap-6 lg:gap-8 items-stretch`}>
            {plans.length > 0 ? (
              plans.map((plan, index) => (
                <PricingCard 
                  key={plan.id} 
                  plan={plan} 
                  isPopular={index === 1} // Vd: gói ở giữa là popular
                />
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-20 font-body-sm border border-dashed border-border rounded-2xl">
                Hiện chưa có gói hội viên nào.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
