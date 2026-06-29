import { serverFetch } from '@/lib/server-fetch';
import { WardrobeItemRes } from '@/features/wardrobe/types';
import WardrobeClient from './WardrobeClient';

export default async function WardrobeData() {
  const initialItems = await serverFetch<WardrobeItemRes[]>('/me/wardrobe-items', {
    cache: 'no-store' // Hoặc sử dụng revalidate tags tùy logic
  });

  return <WardrobeClient initialData={initialItems || []} />;
}
