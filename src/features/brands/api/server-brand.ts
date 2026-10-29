import { serverFetch } from '@/lib/server-fetch';
import type { BrandInfo } from '@/features/brand-portal/types';

export async function fetchPublicBrand(brandSlug: string): Promise<BrandInfo | null> {
  if (!brandSlug) return null;
  return serverFetch<BrandInfo>(`/brands/${encodeURIComponent(brandSlug)}`, {
    withAuth: false,
    revalidate: 300,
    tags: [`brand:${brandSlug}`],
  });
}
