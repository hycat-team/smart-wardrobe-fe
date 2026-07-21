import { WardrobeItemRes } from '@/features/wardrobe/types';

export interface WardrobeImpact {
  compatibleItemCount: number;
  newOutfitsUnlocked: number;
  suitableOccasions: string[];
  redundancyRisk: 'low' | 'medium' | 'high';
  wardrobeGapFilled?: string;
  colorCompatibilityScore: number;
}

export interface GhostItem extends WardrobeItemRes {
  isGhost: true;
  brandName: string;
  brandId: string;
  productUrl?: string;
  wardrobeImpact: WardrobeImpact;
}

export interface SampleVariant {
  id: string;
  name: string;
  imageUrl: string;
}

export interface DigitalSample {
  id: string;
  productName: string;
  concept: string;
  imageUrl: string;
  variants: SampleVariant[];
  targetGender: 'female' | 'male' | 'unisex';
  targetStyleTags: string[];
  priceMin: number;
  priceMax: number;
  status: 'pending' | 'running' | 'completed';
  createdAt: string;
}

export interface VariantComparisonData {
  variantName: string;
  keptRate: number;
  savedRate: number;
}

export interface CohortData {
  label: string;
  matchCount: number;
}

export interface WardrobeFitReport {
  sampleId: string;
  usersExposed: number;
  qualifiedWardrobes: number;
  keptRate: number;
  swappedRate: number;
  savedOrWaitlistRate: number;
  medianNewOutfits: number;
  medianCompatibleItems: number;
  bestPerformingColor: string;
  bestOccasions: string[];
  topCompatibleItems: string[];
  wardrobePenetration: number;
  incrementalOutfitValue: number;
  variantComparison: VariantComparisonData[];
  opportunityCohorts: CohortData[];
}
