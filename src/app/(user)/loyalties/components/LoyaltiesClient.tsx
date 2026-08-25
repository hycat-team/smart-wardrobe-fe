'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Loader2, ChevronRight, Store, Star, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useGetMyLoyalties } from '@/features/brands/queries/user-brands.queries';

export default function LoyaltiesClient() {
  const { data: loyalties, isLoading } = useGetMyLoyalties();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-50 pb-20">
      <div className="sticky top-0 z-40 bg-zinc-50/80 backdrop-blur-xl border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <h1 className="font-bold text-xl text-zinc-900">Thẻ Thành Viên</h1>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        {!loyalties || loyalties.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-10 text-center border border-slate-200/50 flex flex-col items-center max-w-lg mx-auto mt-10">
            <div className="w-16 h-16 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">Chưa có thẻ thành viên nào</h2>
            <p className="text-zinc-500 mb-6">Bạn chưa tham gia chương trình khách hàng thân thiết của thương hiệu nào.</p>
            <Link href="/brands" className="px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors">
              Khám phá các thương hiệu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loyalties.map((loyalty: any, idx: number) => (
              <Link key={loyalty.id || idx} href={`/brands/${loyalty.brandId}/loyalty`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-[1.5rem] border border-slate-200/50 shadow-sm hover:shadow-md hover:border-primary/50 transition-all group flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200 overflow-hidden">
                        <Store className="w-6 h-6 text-zinc-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900 line-clamp-1">{loyalty.brand?.name || 'Thương hiệu'}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-zinc-600">{loyalty.tier?.name || 'Thành viên mới'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Điểm hiện tại</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-xl font-bold font-mono text-zinc-900">{loyalty.currentPoints || 0}</span>
                        <span className="text-xs font-semibold text-zinc-500">pts</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Tổng chi tiêu</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <CreditCard className="w-4 h-4 text-zinc-400" />
                        <span className="text-sm font-bold text-zinc-900">
                          {((loyalty.totalSpend as number) || 0).toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
