'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle2, Crown, ShieldAlert, Gift, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  useGetActiveBrandDetail, 
  useGetBenefitDetail, 
  useRedeemBenefit,
  useGetMyLoyaltyAtBrand
} from '@/features/brands/queries/user-brands.queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function BenefitDetailClient({ brandId, benefitId }: { brandId: string, benefitId: string }) {
  const router = useRouter();
  
  // Queries
  const { data: brandData, isLoading: isLoadingBrand } = useGetActiveBrandDetail(brandId);
  const { data: benefit, isLoading: isLoadingBenefit } = useGetBenefitDetail(benefitId);
  const { data: loyaltyData } = useGetMyLoyaltyAtBrand(brandId);
  
  const { mutateAsync: redeemBenefit, isPending: isRedeeming } = useRedeemBenefit();

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);

  const handleRedeem = async () => {
    try {
      const result = await redeemBenefit(benefitId);
      setVoucherCode(result?.voucherCode || result?.id || `VOUCHER-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      setShowSuccessDialog(true);
    } catch (e) {
      // Error is handled in the mutation hook (toast)
    }
  };

  if (isLoadingBrand || isLoadingBenefit) {
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

  const currentPoints = loyaltyData?.currentPoints || 0;
  const currentTierRank = loyaltyData?.currentTier?.rank || 0;
  
  const unlockType = benefit?.unlockType?.toLowerCase();
  
  let canAccess = false;
  let reasonBlocked = '';
  
  if (unlockType === 'point_redemption') {
    const requiredPoints = benefit?.requiredPoints || 0;
    canAccess = currentPoints >= requiredPoints;
    if (!canAccess) {
      reasonBlocked = `Thiếu ${(requiredPoints - currentPoints).toLocaleString()} pts`;
    }
  } else if (unlockType === 'tier_privilege') {
    const requiredRank = benefit?.requiredTier?.rank || 0;
    canAccess = currentTierRank >= requiredRank;
    if (!canAccess) {
      reasonBlocked = `Yêu cầu hạng ${benefit?.requiredTier?.name || 'cao hơn'}`;
    }
  } else if (unlockType === 'manual_grant') {
    canAccess = false;
    reasonBlocked = 'Không thể tự đổi';
  }

  const getLabelTag = () => {
    if (unlockType === 'point_redemption') return 'Đổi bằng điểm';
    if (unlockType === 'tier_privilege') return 'Đặc quyền hạng';
    if (unlockType === 'manual_grant') return 'Quà tặng';
    return 'Ưu đãi';
  };

  const getButtonText = () => {
    if (isRedeeming) return 'Đang xử lý...';
    if (!canAccess) {
      if (unlockType === 'manual_grant') return 'Không thể tự đổi';
      if (unlockType === 'tier_privilege') return 'Chưa đủ hạng';
      return 'Không đủ điểm';
    }
    if (unlockType === 'tier_privilege') return 'Kích hoạt đặc quyền';
    return 'Đổi ưu đãi này';
  };

  return (
    <div className="min-h-[100dvh] bg-zinc-50 font-sans text-zinc-900 pb-24">
      {/* Navbar */}
      <nav className="sticky top-0 w-full z-40 bg-zinc-50/80 backdrop-blur-xl border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href={`/brands/${brandId}/loyalty`} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold text-sm">Quay lại Thẻ</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-base font-bold text-emerald-600">{currentPoints.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">pts</span>
            </div>
            <div className="w-px h-4 bg-zinc-200" />
            <Avatar className="w-7 h-7 border border-zinc-200 shadow-sm">
              <AvatarImage src={brandData?.logoUrl} alt={brandData?.name} />
              <AvatarFallback className="bg-zinc-100 text-xs text-zinc-600">{brandData?.name?.[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 md:pt-16">
        <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm p-6 md:p-10 overflow-hidden relative">
          {/* Subtle top decoration */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 relative z-10">
            {/* LEFT COL: Visual representation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="flex flex-col items-center justify-center p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100 relative overflow-hidden group"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-100/50 blur-[60px] rounded-full group-hover:bg-emerald-200/50 transition-colors duration-700" />
              
              <div className="w-20 h-20 bg-white shadow-md rounded-2xl flex items-center justify-center mb-6 relative z-10 border border-slate-100">
                {benefit?.benefitType === 'gift' ? (
                  <Gift className="w-10 h-10 text-emerald-500" />
                ) : (
                  <Sparkles className="w-10 h-10 text-emerald-500" />
                )}
              </div>
              
              <div className="text-center relative z-10">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                  PHẦN THƯỞNG TỪ
                </p>
                <h3 className="text-lg font-bold text-zinc-900">{brandData?.name}</h3>
              </div>
            </motion.div>

            {/* RIGHT COL: Details */}
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 mb-5 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">{getLabelTag()}</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4 leading-tight">
                  {benefit?.name}
                </h1>
                
                <p className="text-base text-zinc-500 leading-relaxed mb-8">
                  {benefit?.description}
                </p>

                <div className="pt-8 border-t border-slate-100 mb-8">
                  {/* Cost / Requirement */}
                  {unlockType === 'point_redemption' && (
                    <div>
                      <p className="text-sm font-semibold text-zinc-500 mb-2">Điểm yêu cầu</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl md:text-5xl font-mono font-bold tracking-tighter text-zinc-900">
                          {(benefit?.requiredPoints || 0).toLocaleString()}
                        </span>
                        <span className="text-sm font-semibold text-zinc-500 uppercase">pts</span>
                      </div>
                    </div>
                  )}
                  {unlockType === 'tier_privilege' && (
                    <div>
                      <p className="text-sm font-semibold text-zinc-500 mb-2">Hạng yêu cầu</p>
                      <div className="flex items-center gap-2">
                        <Crown className="w-7 h-7 text-amber-500" />
                        <span className="text-2xl font-bold text-zinc-900">{benefit?.requiredTier?.name || benefit?.requiredTierId}</span>
                      </div>
                    </div>
                  )}

                  {/* Validation message */}
                  {!canAccess && reasonBlocked && (
                    <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-3 rounded-xl border border-amber-100">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">{reasonBlocked}</span>
                    </div>
                  )}
                </div>

                {/* Action */}
                <Button
                  size="lg"
                  onClick={handleRedeem}
                  disabled={!canAccess || isRedeeming}
                  className={`w-full h-14 rounded-2xl text-base font-semibold shadow-sm transition-all active:scale-[0.98] ${
                    canAccess 
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-white' 
                      : 'bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  {getButtonText()}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Success State Overlay */}
      <AnimatePresence>
        {showSuccessDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 text-center relative overflow-hidden shadow-2xl border border-slate-200/50"
            >
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-emerald-50 to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
                  <Check className="w-10 h-10" />
                </div>

                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-3">
                  Đổi Ưu Đãi Thành Công
                </h2>

                <p className="text-base text-zinc-500 mb-8">
                  {unlockType === 'point_redemption' 
                    ? `Bạn đã sử dụng ${(benefit?.requiredPoints || 0).toLocaleString()} pts để đổi ưu đãi này.`
                    : `Đặc quyền hạng thành viên đã được kích hoạt.`
                  }
                </p>

                {voucherCode && benefit?.benefitType !== 'feature_access' && (
                  <div className="w-full bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl p-6 mb-8 text-center">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Mã Code / ID</p>
                    <p className="text-2xl font-mono font-bold tracking-widest text-zinc-900 break-all">
                      {voucherCode}
                    </p>
                  </div>
                )}

                <Button 
                  size="lg"
                  className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-semibold transition-colors"
                  onClick={() => {
                    setShowSuccessDialog(false);
                    router.push(`/brands/${brandId}/loyalty`);
                  }}
                >
                  Trở về Thẻ Thành Viên
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
