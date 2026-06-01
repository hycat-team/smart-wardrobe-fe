import React from 'react';
import { Metadata } from 'next';
import { subscriptionApi } from '@/features/subscription/api/subscription.api';
import { createServerApi } from '@/lib/axios-server';
import { PricingCard } from '@/features/subscription/components/PricingCard';
import { CurrentPlanCard } from '@/features/subscription/components/CurrentPlanCard';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

export const metadata: Metadata = {
  title: 'Gói Hội Viên | Smart Wardrobe',
  description: 'Nâng cấp trải nghiệm thời trang của bạn với các gói cao cấp từ Smart Wardrobe',
};

export default async function PricingPage() {
  const serverApi = createServerApi();
  const queryClient = new QueryClient();

  // Fetch all plans in parallel with user subscription & quota
  const [plans, mySubscription, dailyQuota] = await Promise.all([
    subscriptionApi.getSubscriptionPlans(serverApi).catch(() => []),
    subscriptionApi.getMySubscription(serverApi).catch(() => null),
    subscriptionApi.getDailyQuota(serverApi).catch(() => null),
  ]);

  // Pre-fetch for client-side queries if needed
  await queryClient.prefetchQuery({
    queryKey: ['subscription', 'me'],
    queryFn: () => subscriptionApi.getMySubscription(serverApi),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-zinc-950 text-white pb-20">
        {/* Hero Section */}
        <div className="relative pt-20 pb-16 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="container relative z-10 px-4 mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Nâng tầm phong cách <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                không giới hạn
              </span>
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Trải nghiệm tủ đồ thông minh với các gói hội viên cao cấp. Tạo nhiều phối đồ hơn, quét quần áo không giới hạn và nhận gợi ý chuẩn xác từ AI.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 space-y-16">
          {/* Current Subscription Section */}
          {mySubscription && dailyQuota && (
            <section className="max-w-4xl mx-auto">
              <CurrentPlanCard subscription={mySubscription} quota={dailyQuota} />
            </section>
          )}

          {/* Pricing Plans Section */}
          <section className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Chọn gói phù hợp với bạn</h2>
              <p className="text-zinc-400">Thanh toán an toàn - Hủy bất kỳ lúc nào</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {plans.length > 0 ? (
                plans.map((plan, index) => (
                  <PricingCard 
                    key={plan.id} 
                    plan={plan} 
                    isPopular={index === 1} // Vd: gói ở giữa là popular
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-zinc-500 py-10">
                  Hiện chưa có gói hội viên nào.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </HydrationBoundary>
  );
}
