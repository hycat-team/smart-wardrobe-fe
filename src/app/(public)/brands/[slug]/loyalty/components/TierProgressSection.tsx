'use client';

import Link from 'next/link';
import { Crown, Lock, ShieldCheck, Sparkles, Star, Trophy } from 'lucide-react';
import type { LoyaltyTierRes } from '@/features/brand-portal/types';
import { benefitTypeLabel } from '@/features/brand-portal/utils/benefit-labels';
import { buildTierProgress, type LoyaltyProgressSource } from '@/features/brands/utils/loyalty';

interface TierProgressSectionProps {
  brandId: string;
  tiers?: LoyaltyTierRes[];
  loyalty: LoyaltyProgressSource | null | undefined;
  isMember: boolean;
  isLoading?: boolean;
}

export function TierProgressSection({
  brandId,
  tiers,
  loyalty,
  isMember,
  isLoading,
}: TierProgressSectionProps) {
  const progress = buildTierProgress(tiers, loyalty);

  if (isLoading) {
    return <div className="h-56 animate-pulse rounded-[2.5rem] bg-white border border-slate-200/50" />;
  }

  if (progress.tiers.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Hạng thành viên</h2>
        <p className="text-sm text-zinc-500">
          Chi tiêu càng nhiều, hạng càng cao và quyền lợi càng nhiều. Quyền lợi được cộng dồn từ hạng thấp lên.
        </p>
      </div>

      {isMember && (
        <div className="rounded-[2rem] border border-slate-200/50 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B5952F]/20 text-[#B5952F]">
                <MedalIcon />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hạng hiện tại</p>
                <p className="text-xl font-bold text-zinc-900">{progress.currentTier?.name || 'Thành viên'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tổng chi tiêu</p>
              <p className="text-xl font-bold font-mono text-zinc-900">
                {Number(loyalty?.totalSpend || 0).toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {progress.nextTier ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-zinc-700">
                    Còn {progress.remainingSpend.toLocaleString('vi-VN')}đ để lên hạng {progress.nextTier.name}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {Math.round(progress.progressPercent)}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B5952F] transition-all"
                    style={{ width: `${progress.progressPercent}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <Trophy className="h-4 w-4" />
                Bạn đang ở hạng cao nhất của chương trình.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {progress.tiers.map((tier) => {
          const isCurrent = progress.currentTier?.id === tier.id;
          return (
            <Link
              key={tier.id}
              href={`/brands/${brandId}/loyalty/tiers/${tier.id}`}
              className={`group flex h-full flex-col rounded-[2rem] border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                isCurrent ? 'border-[#D4AF37]/60 ring-1 ring-[#D4AF37]/30' : 'border-slate-200/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      isCurrent ? 'bg-[#D4AF37]/15 text-[#9A7820]' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {tier.rank >= 3 ? <Crown className="h-5 w-5" /> : <Star className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{tier.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Hạng {tier.rank}
                    </p>
                  </div>
                </div>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                    <ShieldCheck className="h-3 w-3" />
                    Hiện tại
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm text-zinc-500">
                Chi tiêu tối thiểu{' '}
                <span className="font-semibold text-zinc-800">{tier.minTotalSpend.toLocaleString('vi-VN')}đ</span>
              </p>

              <div className="mt-4 flex flex-1 flex-col gap-2">
                {tier.benefits && tier.benefits.length > 0 ? (
                  <>
                    {tier.benefits.slice(0, 3).map((benefit) => (
                      <span
                        key={benefit.id}
                        className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600"
                      >
                        {benefit.benefitType === 'feature_access' ? (
                          <Sparkles className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                        ) : (
                          <Lock className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        )}
                        <span className="line-clamp-1">
                          {benefit.name} · {benefitTypeLabel(benefit.benefitType)}
                        </span>
                      </span>
                    ))}
                    {tier.benefits.length > 3 && (
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        +{tier.benefits.length - 3} quyền lợi khác
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">Chưa cấu hình quyền lợi.</span>
                )}
              </div>

              <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary">
                Xem chi tiết
              </span>
            </Link>
          );
        })}
      </div>

      {!isMember && (
        <p className="rounded-2xl bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Tham gia thành viên để tích điểm, lên hạng và mở khoá quyền lợi theo hạng.
        </p>
      )}
    </section>
  );
}

function MedalIcon() {
  return <Star className="h-6 w-6 fill-current" />;
}
