import { serverFetch } from '@/lib/server-fetch';
import { WardrobeItemRes } from '@/features/wardrobe/types';
import { PaginationResult } from '@/types/api';
import WardrobeClient from './WardrobeClient';

export default async function WardrobeData() {
  const initialData = await serverFetch<PaginationResult<WardrobeItemRes>>('/me/wardrobe-items', {
    cache: 'no-store' // Hoặc sử dụng revalidate tags tùy logic
  });

  return <WardrobeClient initialData={initialData} />;
}
