'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Gift, Ticket, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useGetLoyaltyTierDetails } from '@/features/brands/queries/user-brands.queries';
import { useGetActiveBrandDetail } from '@/features/brands/queries/user-brands.queries';

export default function TierDetailsClient({ brandId, tierId }: { brandId: string, tierId: string }) {
  const { data: brand, isLoading: isLoadingBrand } = useGetActiveBrandDetail(brandId);
  const { data: tierData, isLoading: isLoadingTier } = useGetLoyaltyTierDetails(brandId, tierId);

  if (isLoadingBrand || isLoadingTier) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-zinc-50">
        <motion.div 
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin"
        />
      </div>
    );
  }

  if (!tierData) {
    return (
      <div className="min-h-[100dvh] bg-zinc-50 pt-20 px-4 text-center">
        <h2 className="text-xl font-bold">Không tìm thấy thông tin hạng</h2>
        <Link href={`/brands/${brandId}/loyalty`} className="text-primary mt-4 inline-block hover:underline">
          Quay lại
        </Link>
      </div>
    );
  }

  const benefits = (tierData.benefits || []).filter((b: any) => b.unlockType !== 'manual_grant');

  const getBenefitIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'voucher': return <Ticket className="w-6 h-6 text-amber-500" />;
      case 'feature_access': return <ShieldCheck className="w-6 h-6 text-rose-500" />;
      default: return <Gift className="w-6 h-6 text-indigo-500" />;
    }
  };

  const getBenefitTypeName = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'voucher': return 'Voucher giảm giá';
      case 'discount': return 'Giảm giá trực tiếp';
      case 'free_shipping': return 'Miễn phí vận chuyển';
      case 'early_access': return 'Đặc quyền mua sớm';
      case 'feature_access': return 'Quyền truy cập đặc biệt';
      case 'gift': return 'Quà tặng';
      default: return type;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-zinc-50 pb-20">
      <div className="sticky top-0 z-40 bg-zinc-50/80 backdrop-blur-xl border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/brands/${brandId}/loyalty`} className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium text-sm">Quay lại</span>
          </Link>
          <div className="flex items-center gap-2 font-bold text-zinc-900">
            {brand?.name}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-10">
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/50 mb-8 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 fill-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">{tierData.name}</h1>
          <p className="text-zinc-500 mb-6">{tierData.description || `Đạt được khi chi tiêu tích lũy từ ${tierData.minTotalSpend.toLocaleString()}đ`}</p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full font-semibold text-zinc-700 text-sm">
            <span>Cấp độ: {tierData.rank}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-400" />
            <span>Chi tiêu tối thiểu: {tierData.minTotalSpend.toLocaleString()}đ</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Quyền lợi của hạng {tierData.name}
          </h2>
          
          {benefits.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-10 text-center border border-slate-200/50">
              <Gift className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-zinc-900">Chưa có quyền lợi</h3>
              <p className="text-zinc-500 mt-2">Hạng thành viên này hiện chưa được thiết lập đặc quyền nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit: any, idx: number) => (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-[1.5rem] border border-slate-200/50 shadow-sm flex flex-col h-full hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {getBenefitIcon(benefit.benefitType)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {getBenefitTypeName(benefit.benefitType)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{benefit.name}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-4 flex-1">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
