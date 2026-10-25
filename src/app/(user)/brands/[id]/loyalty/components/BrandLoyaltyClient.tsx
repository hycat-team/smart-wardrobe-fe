'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Crown,
  Gift,
  History,
  Lock,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetActiveBrandDetail,
  useGetMyLoyaltyAtBrand,
  useGetMyLoyaltyTransactions,
  useGetMyLoyaltyLots,
  useGetMyBenefits,
  useGetMyBenefitRedemptions,
  useGetPublicLoyaltyTiers,
  useRedeemBenefit,
  useJoinLoyalty,
} from '@/features/brands/queries/user-brands.queries';
import type { MyBenefit } from '@/features/brand-portal/types';
import { benefitTypeLabel } from '@/features/brand-portal/utils/benefit-labels';
import { TierProgressSection } from './TierProgressSection';

export default function BrandLoyaltyClient({ brandId }: { brandId: string }) {
  const { data: brandData, isLoading: isLoadingBrand } = useGetActiveBrandDetail(brandId);
  const { data: loyaltyData, isLoading: isLoadingLoyalty } = useGetMyLoyaltyAtBrand(brandId);
  const { data: transactions } = useGetMyLoyaltyTransactions(brandId);
  const { data: lots } = useGetMyLoyaltyLots(brandId);
  const { data: tiers, isLoading: isLoadingTiers } = useGetPublicLoyaltyTiers(brandId);
  const { data: myBenefits, isLoading: isLoadingMyBenefits } = useGetMyBenefits(brandId, undefined, !!loyaltyData);
  const { data: redemptions } = useGetMyBenefitRedemptions(brandId);

  const { mutateAsync: joinLoyalty, isPending: isJoining } = useJoinLoyalty();
  const { mutateAsync: redeemBenefit, isPending: isRedeeming } = useRedeemBenefit();

  const isMember = !!loyaltyData;
  const myBenefitItems = myBenefits?.items || [];
  const featureBenefits = myBenefitItems.filter(
    (benefit) => (benefit.benefitType || '').toLowerCase() === 'feature_access',
  );
  const voucherBenefits = myBenefitItems.filter(
    (benefit) =>
      (benefit.benefitType || '').toLowerCase() !== 'feature_access' &&
      benefit.unlockType !== 'manual_grant',
  );
  const voucherRedemptions = (redemptions || []).filter(
    (redemption: any) => (redemption.benefit?.benefitType || '').toLowerCase() !== 'feature_access',
  );

  const handleJoin = async () => {
    try {
      await joinLoyalty(brandId);
    } catch {
      // Error toast is handled by the mutation hook.
    }
  };

  const handleRedeemBenefit = async (benefitId: string) => {
    try {
      await redeemBenefit({ benefitId, brandId });
    } catch {
      // Error toast is handled by the mutation hook.
    }
  };

  if (isLoadingBrand || isLoadingLoyalty) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-zinc-50">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-50 pb-20">
      <div className="sticky top-0 z-40 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href={`/brands/${brandId}`} className="flex items-center gap-2 text-zinc-600 transition-colors hover:text-zinc-900">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Quay lại Brand</span>
          </Link>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-zinc-200 shadow-sm">
              <AvatarImage src={brandData?.logoUrl} alt={brandData?.name} />
              <AvatarFallback>{brandData?.name?.[0]}</AvatarFallback>
            </Avatar>
            <span className="font-bold tracking-tight text-zinc-900">{brandData?.name}</span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 pt-10">
        {!isMember ? (
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-10 flex max-w-lg flex-col items-center rounded-[2.5rem] border border-slate-200/50 bg-white p-10 text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Award className="h-10 w-10" />
              </div>
              <h1 className="mb-3 text-3xl font-bold tracking-tighter text-zinc-950">Tham gia Thành viên</h1>
              <p className="mb-8 leading-relaxed text-zinc-500">
                Trở thành viên của {brandData?.name} để tích điểm, thăng hạng và nhận quyền lợi theo hạng.
              </p>
              <Button
                size="lg"
                onClick={handleJoin}
                disabled={isJoining}
                className="h-14 w-full rounded-2xl bg-zinc-950 text-base font-semibold text-white shadow-lg transition-transform hover:bg-zinc-800 active:scale-[0.98]"
              >
                {isJoining ? 'Đang tham gia...' : 'Mở Thẻ Thành Viên Miễn Phí'}
              </Button>
            </motion.div>

            <TierProgressSection
              brandId={brandId}
              tiers={tiers}
              loyalty={loyaltyData}
              isMember={false}
              isLoading={isLoadingTiers}
            />
          </div>
        ) : (
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950 p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] md:p-12"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              <div className="pointer-events-none absolute -right-[20%] -top-[50%] h-[150%] w-[80%] rounded-full bg-emerald-500/30 blur-3xl" />

              <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      {loyaltyData?.currentTier?.name || 'Thành Viên'}
                    </span>
                  </div>

                  <div>
                    <p className="mb-1 text-sm font-medium uppercase tracking-widest text-zinc-400">Điểm Hiện Có</p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-5xl font-bold tracking-tighter text-white md:text-7xl">
                        {loyaltyData?.currentPoints?.toLocaleString() || 0}
                      </span>
                      <span className="text-xl font-medium text-emerald-400">pts</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                  <Avatar className="h-12 w-12 border-2 border-white/20">
                    <AvatarImage src={brandData?.logoUrl} />
                    <AvatarFallback>{brandData?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-zinc-400">Phát hành bởi</p>
                    <p className="text-base font-bold text-white">{brandData?.name}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <TierProgressSection
              brandId={brandId}
              tiers={tiers}
              loyalty={loyaltyData}
              isMember
              isLoading={isLoadingTiers}
            />

            <Tabs defaultValue="feature-benefits" className="w-full">
              <div className="mb-8 flex justify-center">
                <TabsList className="inline-flex h-auto gap-1 rounded-2xl border border-slate-200/50 bg-white p-1.5 shadow-sm">
                  <TabsTrigger value="feature-benefits" className="rounded-xl px-4 py-3 text-sm font-semibold transition-all data-[state=active]:bg-zinc-950 data-[state=active]:text-white sm:px-6">
                    Quyền lợi
                  </TabsTrigger>
                  <TabsTrigger value="vouchers" className="rounded-xl px-4 py-3 text-sm font-semibold transition-all data-[state=active]:bg-zinc-950 data-[state=active]:text-white sm:px-6">
                    Đổi voucher
                  </TabsTrigger>
                  <TabsTrigger value="my-vouchers" className="rounded-xl px-4 py-3 text-sm font-semibold transition-all data-[state=active]:bg-zinc-950 data-[state=active]:text-white sm:px-6">
                    Voucher của tôi
                  </TabsTrigger>
                  <TabsTrigger value="history" className="rounded-xl px-4 py-3 text-sm font-semibold transition-all data-[state=active]:bg-zinc-950 data-[state=active]:text-white sm:px-6">
                    Lịch sử điểm
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="feature-benefits" className="focus-visible:outline-none">
                {isLoadingMyBenefits ? (
                  <LoadingBlock />
                ) : featureBenefits.length === 0 ? (
                  <EmptyBlock
                    icon={<Award className="h-10 w-10 text-zinc-300" />}
                    title="Chưa có quyền lợi"
                    description="Brand hiện tại chưa phát hành quyền lợi nào."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {featureBenefits.map((benefit: MyBenefit, idx: number) => {
                      const isActive =
                        !!benefit.redemption ||
                        (benefit.unlockType === 'tier_privilege' && benefit.unlocked);
                      return (
                        <motion.div
                          key={benefit.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex flex-col justify-between rounded-[2rem] border border-slate-200/50 bg-white p-6 shadow-sm"
                        >
                          <div>
                            <div className="mb-5 flex items-start justify-between gap-3">
                              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                <ShieldCheck className="h-6 w-6" />
                              </div>
                              <StatusBadge active={isActive} label={isActive ? 'Đang áp dụng' : 'Chưa áp dụng'} />
                            </div>
                            <h3 className="mb-2 text-xl font-bold tracking-tight text-zinc-900">{benefit.name}</h3>
                            <p className="text-sm leading-relaxed text-zinc-500 line-clamp-3">{benefit.description}</p>
                            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500">
                              <span className="rounded-full bg-muted px-2.5 py-1">{benefitTypeLabel(benefit.benefitType)}</span>
                              {benefit.unlockType === 'tier_privilege' && (
                                <span className="inline-flex items-center gap-1">
                                  <Crown className="h-3.5 w-3.5 text-amber-500" />
                                  Hạng {benefit.requiredTierName || '—'}
                                  {benefit.requiredTierRank ? ` (rank ${benefit.requiredTierRank})` : ''}
                                </span>
                              )}
                              {benefit.unlockType === 'manual_grant' && (
                                <span className="inline-flex items-center gap-1">
                                  <Gift className="h-3.5 w-3.5 text-zinc-400" />
                                  Brand tặng
                                </span>
                              )}
                              {benefit.unlockType === 'point_redemption' && (
                                <span className="inline-flex items-center gap-1 text-zinc-400">
                                  <Lock className="h-3.5 w-3.5" />
                                  Không còn hỗ trợ kích hoạt
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-zinc-500">
                            {isActive
                              ? 'Quyền lợi được áp dụng tự động, bạn không cần thao tác nhận.'
                              : benefit.unlockType === 'tier_privilege'
                                ? `Cần đạt hạng ${benefit.requiredTierName || 'cao hơn'} để sử dụng.`
                                : benefit.unlockType === 'manual_grant'
                                  ? 'Quyền lợi sẽ xuất hiện khi brand trao tặng.'
                                  : 'Quyền lợi này không còn hỗ trợ kích hoạt.'}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="vouchers" className="focus-visible:outline-none">
                {isLoadingMyBenefits ? (
                  <LoadingBlock />
                ) : voucherBenefits.length === 0 ? (
                  <EmptyBlock
                    icon={<Ticket className="h-10 w-10 text-zinc-300" />}
                    title="Chưa có voucher"
                    description="Brand hiện tại chưa phát hành voucher nào."
                  />
                ) : (
                  <>
                  <p className="mb-5 text-sm text-zinc-500">
                    Voucher có thể đổi nhiều lần khi bạn còn đủ điểm/hạng. Lịch sử đổi xem ở tab "Voucher của tôi".
                  </p>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {voucherBenefits.map((benefit: MyBenefit, idx: number) => {
                      const canRedeem = benefit.unlocked;
                      return (
                        <motion.div
                          key={benefit.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex flex-col justify-between rounded-[2rem] border border-slate-200/50 bg-white p-6 shadow-sm"
                        >
                          <div>
                            <div className="mb-5 flex items-start justify-between gap-3">
                              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${canRedeem ? 'bg-amber-50 text-amber-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                <Ticket className="h-6 w-6" />
                              </div>
                              <StatusBadge
                                active={canRedeem}
                                label={canRedeem ? 'Đủ điều kiện' : 'Chưa đủ điều kiện'}
                              />
                            </div>
                            <h3 className="mb-2 text-xl font-bold tracking-tight text-zinc-900">{benefit.name}</h3>
                            <p className="text-sm leading-relaxed text-zinc-500 line-clamp-3">{benefit.description}</p>
                            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500">
                              <span className="rounded-full bg-muted px-2.5 py-1">{benefitTypeLabel(benefit.benefitType)}</span>
                              {benefit.unlockType === 'point_redemption' && (
                                <span className="inline-flex items-center gap-1">
                                  <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                                  {(benefit.requiredPoints || 0).toLocaleString()} pts
                                </span>
                              )}
                              {benefit.unlockType === 'tier_privilege' && (
                                <span className="inline-flex items-center gap-1">
                                  <Crown className="h-3.5 w-3.5 text-amber-500" />
                                  Hạng {benefit.requiredTierName || '—'}
                                  {benefit.requiredTierRank ? ` (rank ${benefit.requiredTierRank})` : ''}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-6 border-t border-slate-100 pt-4">
                            {canRedeem ? (
                              <Button
                                size="sm"
                                disabled={isRedeeming}
                                onClick={() => handleRedeemBenefit(benefit.id)}
                                className="h-11 w-full rounded-xl bg-zinc-950 text-sm font-semibold text-white transition-transform hover:bg-zinc-800 active:scale-[0.98]"
                              >
                                {isRedeeming ? 'Đang xử lý...' : 'Đổi ngay'}
                              </Button>
                            ) : (
                              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                                <Lock className="h-3.5 w-3.5" />
                                {benefit.unlockType === 'tier_privilege'
                                  ? `Cần hạng ${benefit.requiredTierName || 'cao hơn'}`
                                  : `Cần thêm ${Math.max((benefit.requiredPoints || 0) - (myBenefits?.currentPoints || 0), 0).toLocaleString()} pts`}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="my-vouchers" className="focus-visible:outline-none">
                {voucherRedemptions.length === 0 ? (
                  <EmptyBlock
                    icon={<Ticket className="h-10 w-10 text-zinc-300" />}
                    title="Chưa có voucher nào"
                    description="Bạn chưa đổi voucher nào của brand này."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {voucherRedemptions.map((redemption: any, idx: number) => {
                      const redeemedBenefit = redemption.benefit;
                      return (
                        <motion.div
                          key={redemption.id || idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm"
                        >
                          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-50 blur-2xl" />
                          <h3 className="relative z-10 mb-1 text-lg font-bold text-zinc-900">
                            {redeemedBenefit?.name || 'Voucher ưu đãi'}
                          </h3>
                          <p className="relative z-10 mb-2 text-sm text-zinc-500">
                            Đã đổi vào{' '}
                            {redemption.redeemedAt || redemption.createdAt
                              ? format(new Date(redemption.redeemedAt || redemption.createdAt), 'dd/MM/yyyy HH:mm')
                              : 'Gần đây'}
                          </p>
                          <div className="relative z-10 mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500">
                            <span className="uppercase tracking-wide">{redemption.status}</span>
                            <span>•</span>
                            <span>{redemption.pointsSpent || 0} pts</span>
                            {redemption.expiresAt && (
                              <>
                                <span>•</span>
                                <span>Hết hạn {format(new Date(redemption.expiresAt), 'dd/MM/yyyy')}</span>
                              </>
                            )}
                          </div>
                          <div className="relative z-10 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-center">
                            <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">Mã tham chiếu</p>
                            <p className="font-mono text-xl font-bold tracking-widest text-zinc-900">
                              {redemption.id?.substring(0, 8).toUpperCase() || 'N/A'}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="focus-visible:outline-none">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div className="space-y-6 lg:col-span-2">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Biến động điểm</h2>
                    <div className="rounded-[2.5rem] border border-slate-200/50 bg-white p-6 md:p-8">
                      {!transactions || transactions.length === 0 ? (
                        <div className="py-10 text-center">
                          <History className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
                          <p className="text-zinc-500">Chưa có giao dịch điểm nào.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {transactions.map((tx: any) => {
                            const isPositive = tx.transactionType === 'earn' || tx.transactionType === 'refund';
                            return (
                              <div key={tx.id} className="group flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {isPositive ? <TrendingUp className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
                                  </div>
                                  <div>
                                    <p className="text-base font-bold text-zinc-900">{tx.reason}</p>
                                    <p className="text-sm font-medium text-zinc-500">
                                      {format(new Date(tx.createdAt), 'dd MMM, yyyy • HH:mm', { locale: vi })}
                                    </p>
                                  </div>
                                </div>
                                <div className={`font-mono text-lg font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {isPositive ? '+' : '-'}
                                  {Math.abs(tx.pointsDelta)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Điểm sắp hết hạn</h2>
                    <div className="rounded-[2.5rem] border border-slate-200/50 bg-white p-6">
                      {!lots || lots.length === 0 ? (
                        <div className="py-8 text-center">
                          <Clock className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
                          <p className="text-sm text-zinc-500">Điểm của bạn đang an toàn, chưa có điểm nào sắp hết hạn.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {lots.map((lot: { id: string; expiresAt: string; remainingPoints: number }) => (
                            <div key={lot.id} className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50 p-4">
                              <div>
                                <p className="text-sm font-bold text-amber-900">Hết hạn vào</p>
                                <p className="mt-0.5 text-xs font-medium text-amber-700">
                                  {format(new Date(lot.expiresAt), 'dd/MM/yyyy')}
                                </p>
                              </div>
                              <div className="font-mono text-lg font-bold text-amber-600">
                                {lot.remainingPoints} <span className="text-xs">pts</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}

function LoadingBlock() {
  return (
    <div className="flex justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
    </div>
  );
}

function EmptyBlock({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-[2.5rem] border border-slate-200/50 bg-white py-20 text-center">
      <div className="mx-auto mb-4 flex justify-center">{icon}</div>
      <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
      <p className="mt-1 text-zinc-500">{description}</p>
    </div>
  );
}

function StatusBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
        active ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
      }`}
    >
      {active && <CheckCircle2 className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}
