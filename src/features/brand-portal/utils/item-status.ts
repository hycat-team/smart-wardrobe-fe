import type { BrandItemRes } from '@/features/brand-portal/types';

export type BrandItemDisplayStatus =
  | 'analyzing'
  | 'failed'
  | 'needs_review'
  | 'active'
  | 'archived'
  | 'draft';

export function isItemAnalyzing(item: Pick<BrandItemRes, 'taskId' | 'status'>): boolean {
  return Boolean(item?.taskId) && String(item?.status || '').toLowerCase() === 'draft';
}

export function getItemDisplayStatus(item: BrandItemRes): BrandItemDisplayStatus {
  const status = String(item.status || '').toLowerCase();

  if (status === 'failed') return 'failed';
  if (status === 'active') return 'active';
  if (status === 'archived') return 'archived';
  if (item.fashionItem?.reviewReason) return 'needs_review';
  if (isItemAnalyzing(item)) return 'analyzing';
  return 'draft';
}

export function getItemErrorReason(item: BrandItemRes): string | undefined {
  return item.fashionItem?.processingErrorReason || item.processingErrorReason || undefined;
}

export function getItemReviewReason(item: BrandItemRes): string | undefined {
  return item.fashionItem?.reviewReason || undefined;
}

export function itemHasAnalysisMeta(item: BrandItemRes): boolean {
  return Boolean(item.fashionItem?.category || item.fashionItem?.color || item.fashionItem?.material);
}
