import { getItemDisplayStatus, isItemAnalyzing } from './item-status';
import type { BrandItemRes } from '@/features/brand-portal/types';

function item(partial: Partial<BrandItemRes>): BrandItemRes {
  return {
    id: 'item-1',
    brandId: 'brand-1',
    status: 'draft',
    ...partial,
  } as BrandItemRes;
}

describe('item-status', () => {
  it('treats legacy taskId on terminal items as terminal', () => {
    expect(getItemDisplayStatus(item({ status: 'active', taskId: 'legacy-task' }))).toBe('active');
    expect(getItemDisplayStatus(item({ status: 'failed', taskId: 'legacy-task' }))).toBe('failed');
    expect(getItemDisplayStatus(item({ status: 'archived', taskId: 'legacy-task' }))).toBe('archived');
  });

  it('shows analyzing only for draft items with a task id', () => {
    expect(getItemDisplayStatus(item({ status: 'draft', taskId: 'task-1' }))).toBe('analyzing');
    expect(isItemAnalyzing(item({ status: 'active', taskId: 'task-1' }))).toBe(false);
    expect(isItemAnalyzing(item({ status: 'draft', taskId: undefined }))).toBe(false);
  });

  it('prefers needs_review when the fashion item is awaiting a category', () => {
    expect(
      getItemDisplayStatus(item({ status: 'draft', taskId: 'legacy-task', fashionItem: { id: 'fi-1', reviewReason: 'uncertain' } })),
    ).toBe('needs_review');
    expect(
      getItemDisplayStatus(item({ status: 'draft', fashionItem: { id: 'fi-1', reviewReason: 'uncertain' } })),
    ).toBe('needs_review');
  });

  it('falls back to draft', () => {
    expect(getItemDisplayStatus(item({ status: 'draft' }))).toBe('draft');
  });
});
