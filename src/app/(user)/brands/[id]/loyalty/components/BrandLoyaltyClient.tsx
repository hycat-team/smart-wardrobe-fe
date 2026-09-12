'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Award, 
  Clock, 
  CreditCard, 
  Gift, 
  History, 
  ShieldCheck, 
  Sparkles, 
  Ticket, 
  TrendingUp, 
  Wallet 
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useGetActiveBrandDetail, 
  useGetMyLoyaltyAtBrand, 
  useGetMyLoyaltyTransactions, 
  useGetMyLoyaltyLots,
  useGetBrandBenefits,
  useGetMyBenefitRedemptions,
  useJoinLoyalty
} from '@/features/brands/queries/user-brands.queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export default function BrandLoyaltyClient({ brandId }: { brandId: string }) {
  const router = useRouter();
  
  // Queries
  const { data: brandData, isLoading: isLoadingBrand } = useGetActiveBrandDetail(brandId);
  const { data: loyaltyData, isLoading: isLoadingLoyalty } = useGetMyLoyaltyAtBrand(brandId);
  const { data: transactions } = useGetMyLoyaltyTransactions(brandId);
  const { data: lots } = useGetMyLoyaltyLots(brandId);
  const { data: benefitsData } = useGetBrandBenefits(brandId, { unlockType: 'point_redemption' });
  const benefits = benefitsData?.items || [];
  const { data: redemptions } = useGetMyBenefitRedemptions(brandId);
  
  const { mutateAsync: joinLoyalty, isPending: isJoining } = useJoinLoyalty();

  // Handle joining loyalty
  const handleJoin = async () => {
    try {
      await joinLoyalty(brandId);
      // Data will be refetched automatically due to onSuccess invalidation
    } catch (e) {
      // Error handled by query hook
    }
  };

  const isMember = !!loyaltyData;

  if (isLoadingBrand || isLoadingLoyalty) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-zinc-50">
        <motion.div 
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-50 pb-20">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-zinc-50/80 backdrop-blur-xl border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/brands/${brandId}`} className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium text-sm">Quay lại Brand</span>
          </Link>
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 border border-zinc-200 shadow-sm">
              <AvatarImage src={brandData?.logoUrl} alt={brandData?.name} />
              <AvatarFallback>{brandData?.name?.[0]}</AvatarFallback>
            </Avatar>
            <span className="font-bold text-zinc-900 tracking-tight">{brandData?.name}</span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-10">
        {!isMember ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center max-w-lg mx-auto mt-20 p-10 bg-white rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-200/50"
          >
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <Award className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-zinc-950 mb-3">Tham gia Thành viên</h1>
            <p className="text-zinc-500 leading-relaxed mb-8">
              Trở thành viên của {brandData?.name} để bắt đầu tích điểm, thăng hạng và nhận các đặc quyền không giới hạn.
            </p>
            <Button 
              size="lg" 
              onClick={handleJoin} 
              disabled={isJoining}
              className="w-full h-14 rounded-2xl text-base font-semibold bg-zinc-950 hover:bg-zinc-800 text-white shadow-lg transition-transform active:scale-[0.98]"
            >
              {isJoining ? "Đang tham gia..." : "Mở Thẻ Thành Viên Miễn Phí"}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {/* The Glass Loyalty Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative overflow-hidden bg-zinc-950 rounded-[2.5rem] p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white/10"
            >
              {/* Glass Refraction effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
              <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] pointer-events-none" />
              
              {/* Decorative Mesh Blob */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute -top-[50%] -right-[20%] w-[80%] h-[150%] bg-emerald-500/30 rounded-full blur-3xl pointer-events-none"
              />

              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {loyaltyData?.currentTier?.name || 'Thành Viên'}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-zinc-400 text-sm font-medium mb-1 uppercase tracking-widest">Điểm Hiện Có</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl md:text-7xl font-bold tracking-tighter text-white font-mono">
                        {loyaltyData?.currentPoints?.toLocaleString() || 0}
                      </span>
                      <span className="text-xl text-emerald-400 font-medium">pts</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
                  <Avatar className="w-12 h-12 border-2 border-white/20">
                    <AvatarImage src={brandData?.logoUrl} />
                    <AvatarFallback>{brandData?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-zinc-400 font-medium">Phát hành bởi</p>
                    <p className="text-base font-bold text-white">{brandData?.name}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bento Grid layout for content */}
            <Tabs defaultValue="benefits" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white border border-slate-200/50 p-1.5 rounded-2xl shadow-sm h-auto inline-flex gap-1">
                  <TabsTrigger value="benefits" className="rounded-xl px-6 py-3 text-sm font-semibold data-[state=active]:bg-zinc-950 data-[state=active]:text-white transition-all">
                    Đặc Quyền
                  </TabsTrigger>
                  <TabsTrigger value="redemptions" className="rounded-xl px-6 py-3 text-sm font-semibold data-[state=active]:bg-zinc-950 data-[state=active]:text-white transition-all">
                    Quyền lợi Của Tôi
                  </TabsTrigger>
                  <TabsTrigger value="history" className="rounded-xl px-6 py-3 text-sm font-semibold data-[state=active]:bg-zinc-950 data-[state=active]:text-white transition-all">
                    Lịch Sử Điểm
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* BENEFITS TAB */}
              <TabsContent value="benefits" className="focus-visible:outline-none">
                {benefits?.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-200/50">
                    <Gift className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-zinc-900">Chưa có đặc quyền</h3>
                    <p className="text-zinc-500 mt-1">Brand hiện tại chưa phát hành ưu đãi nào.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {benefits?.map((benefit: any, idx: number) => (
                        <motion.div
                          key={benefit.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                          className="group relative bg-white p-6 rounded-[2rem] border border-slate-200/50 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                              <Gift className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">{benefit.name}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-6">
                              {benefit.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold font-mono text-zinc-900">{benefit.requiredPoints}</span>
                                <span className="text-xs font-semibold text-zinc-500 uppercase">pts</span>
                              </div>
                              {benefit.requiredTierId && benefit.requiredTierName && (
                                <span className="text-[10px] font-semibold text-primary/80 uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full inline-flex w-fit">
                                  Yêu cầu hạng: {benefit.requiredTierName}
                                </span>
                              )}
                            </div>
                            <Button 
                              variant="ghost"
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl font-semibold transition-transform active:scale-95"
                              onClick={() => router.push(`/brands/${brandId}/benefits/${benefit.id}`)}
                            >
                              Đổi ngay
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </TabsContent>

              {/* REDEMPTIONS TAB */}
              <TabsContent value="redemptions" className="focus-visible:outline-none">
                {(!redemptions || redemptions.length === 0) ? (
                  <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-200/50">
                    <Ticket className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-zinc-900">Chưa có Voucher</h3>
                    <p className="text-zinc-500 mt-1">Bạn chưa đổi điểm lấy voucher nào.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Render filtered redemptions for this brand (if data contains brandId) or all */}
                    {redemptions.map((redemption: any, idx: number) => (
                      <motion.div
                        key={redemption.id || idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 rounded-[2rem] border border-emerald-100 shadow-sm relative overflow-hidden"
                      >
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full blur-2xl" />
                        <h3 className="text-lg font-bold text-zinc-900 mb-1 relative z-10">{redemption.name || "Voucher Ưu đãi"}</h3>
                        <p className="text-sm text-zinc-500 mb-6 relative z-10">
                          Đã đổi vào {(redemption.redeemedAt || redemption.createdAt) ? format(new Date(redemption.redeemedAt || redemption.createdAt), 'dd/MM/yyyy HH:mm') : 'Gần đây'}
                        </p>
                        
                        <div className="bg-zinc-50 p-4 rounded-2xl border border-dashed border-zinc-300 text-center relative z-10">
                          <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">Mã Code / ID</p>
                          <p className="text-xl font-mono font-bold text-zinc-900 tracking-widest">{redemption.voucherCode || redemption.id?.substring(0, 8).toUpperCase() || "N/A"}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* HISTORY TAB */}
              <TabsContent value="history" className="focus-visible:outline-none">
                {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> */}
                  {/* Left Column: Transactions */}
                  <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Biến Động Điểm</h2>
                    <div className="bg-white rounded-[2.5rem] border border-slate-200/50 p-6 md:p-8">
                      {!transactions || transactions.length === 0 ? (
                        <div className="text-center py-10">
                          <History className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                          <p className="text-zinc-500">Chưa có giao dịch điểm nào.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {transactions.map((tx: any) => {
                            const isPositive = tx.transactionType === 'earn' || tx.transactionType === 'refund';
                            return (
                              <div key={tx.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {isPositive ? <TrendingUp className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                                  </div>
                                  <div>
                                    <p className="text-base font-bold text-zinc-900">{tx.reason}</p>
                                    <p className="text-sm text-zinc-500 font-medium">
                                      {format(new Date(tx.createdAt), "dd MMM, yyyy • HH:mm", { locale: vi })}
                                    </p>
                                  </div>
                                </div>
                                <div className={`text-lg font-bold font-mono ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {isPositive ? '+' : '-'}{Math.abs(tx.pointsDelta)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Expiry Lots */}
                  {/* <div className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Điểm Sắp Hết Hạn</h2>
                    <div className="bg-white rounded-[2.5rem] border border-slate-200/50 p-6">
                      {!lots || lots.length === 0 ? (
                        <div className="text-center py-8">
                          <Clock className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                          <p className="text-zinc-500 text-sm">Điểm của bạn đang an toàn, chưa có điểm nào sắp hết hạn.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {lots.map((lot: any) => (
                            <div key={lot.id} className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-bold text-amber-900">Hết hạn vào</p>
                                <p className="text-xs text-amber-700 font-medium mt-0.5">
                                  {format(new Date(lot.expiresAt), "dd/MM/yyyy")}
                                </p>
                              </div>
                              <div className="text-lg font-bold font-mono text-amber-600">
                                {lot.remainingPoints} <span className="text-xs">pts</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div> */}
                {/* </div> */}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
