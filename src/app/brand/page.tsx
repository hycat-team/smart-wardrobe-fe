import { redirect } from 'next/navigation';
import { serverFetch } from '@/lib/server-fetch';
import { BrandInfo } from '@/features/brand-portal/types';

export default async function BrandRedirectPage() {
  const brands = await serverFetch<BrandInfo[]>('/brand-portal/me/brands');

  if (!brands || brands.length === 0) {
    redirect('/brand-portal/select');
  }

  // Redirect to the first brand's dashboard
  redirect(`/brand/${brands[0].id}/dashboard`);
}
