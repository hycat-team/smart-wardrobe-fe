import type { LoyaltyTierRes } from '@/features/brand-portal/types';

export interface LoyaltyProgressSource {
  currentTier?: { id?: string; name?: string } | null;
  totalSpend?: number;
}

export interface TierProgressResult {
  tiers: LoyaltyTierRes[];
  currentTier?: LoyaltyTierRes;
  nextTier?: LoyaltyTierRes;
  remainingSpend: number;
  progressPercent: number;
  isMaxTier: boolean;
}

export function buildTierProgress(
  tiers: LoyaltyTierRes[] | undefined,
  loyalty: LoyaltyProgressSource | null | undefined,
): TierProgressResult {
  const sorted = [...(tiers || [])].sort((a, b) => a.rank - b.rank);
  if (sorted.length === 0) {
    return { tiers: sorted, remainingSpend: 0, progressPercent: 0, isMaxTier: false };
  }

  const totalSpend = Number(loyalty?.totalSpend || 0);

  const currentTier = sorted.find((tier) => tier.id === loyalty?.currentTier?.id);

  const nextTier = currentTier
    ? sorted.find((tier) => tier.rank > currentTier!.rank)
    : sorted[0];

  if (!nextTier) {
    return {
      tiers: sorted,
      currentTier,
      remainingSpend: 0,
      progressPercent: 100,
      isMaxTier: !!currentTier,
    };
  }

  const currentFloor = currentTier?.minTotalSpend ?? 0;
  const target = nextTier.minTotalSpend;
  const span = target - currentFloor;
  const progressPercent = span > 0
    ? Math.min(100, Math.max(0, ((totalSpend - currentFloor) / span) * 100))
    : 0;

  return {
    tiers: sorted,
    currentTier,
    nextTier,
    remainingSpend: Math.max(target - totalSpend, 0),
    progressPercent,
    isMaxTier: false,
  };
}
