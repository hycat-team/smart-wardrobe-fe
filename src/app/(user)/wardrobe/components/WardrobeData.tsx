import { serverFetch } from '@/lib/server-fetch';
import {
  WardrobeCategoryDistribution,
  WardrobeItemRes,
} from '@/features/wardrobe/types';
import { PaginationResult } from '@/types/api';
import WardrobeClient from './WardrobeClient';

export default async function WardrobeData() {
  const [initialData, initialDistribution] = await Promise.all([
    serverFetch<PaginationResult<WardrobeItemRes>>('/me/wardrobe-items', {
      cache: 'no-store',
    }),
    serverFetch<WardrobeCategoryDistribution>(
      '/me/dashboard/wardrobe/category-distribution',
      { cache: 'no-store' },
    ),
  ]);

  return (
    <WardrobeClient
      initialData={initialData}
      initialDistribution={initialDistribution}
    />
  );
}
