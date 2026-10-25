import { buildTierProgress } from './loyalty';
import type { LoyaltyTierRes } from '@/features/brand-portal/types';

const tiers: LoyaltyTierRes[] = [
  { id: 'gold', brandId: 'b', name: 'Gold', rank: 3, minTotalSpend: 3000000, createdAt: '' },
  { id: 'bronze', brandId: 'b', name: 'Bronze', rank: 1, minTotalSpend: 0, createdAt: '' },
  { id: 'silver', brandId: 'b', name: 'Silver', rank: 2, minTotalSpend: 1000000, createdAt: '' },
];

describe('buildTierProgress', () => {
  it('sorts tiers by rank and computes the next tier requirement', () => {
    const result = buildTierProgress(tiers, { currentTier: { id: 'silver' }, totalSpend: 1500000 });

    expect(result.tiers.map((tier) => tier.name)).toEqual(['Bronze', 'Silver', 'Gold']);
    expect(result.currentTier?.id).toBe('silver');
    expect(result.nextTier?.id).toBe('gold');
    expect(result.remainingSpend).toBe(1500000);
    expect(result.progressPercent).toBe(25);
  });

  it('uses the first tier as next when the current tier id is missing', () => {
    const result = buildTierProgress(tiers, { totalSpend: 2000000 });

    expect(result.currentTier).toBeUndefined();
    expect(result.nextTier?.id).toBe('bronze');
  });

  it('marks the highest tier as complete', () => {
    const result = buildTierProgress(tiers, { currentTier: { id: 'gold' }, totalSpend: 4000000 });

    expect(result.isMaxTier).toBe(true);
    expect(result.nextTier).toBeUndefined();
    expect(result.progressPercent).toBe(100);
  });

  it('returns the first tier as next when the user has no current tier', () => {
    const result = buildTierProgress(tiers, { totalSpend: 0 });

    expect(result.currentTier).toBeUndefined();
    expect(result.nextTier?.id).toBe('bronze');
  });

  it('handles missing tiers', () => {
    expect(buildTierProgress(undefined, null).tiers).toEqual([]);
  });
});
