import type { Metadata } from 'next';
import { Suspense } from 'react';
import type { BrandDashboardSearchParams } from '@/features/brand-portal/types';
import DashboardData from './components/DashboardData';
import { BrandDashboardSkeleton } from './components/BrandDashboardSkeleton';

export const metadata: Metadata = {
  title: 'Dashboard | Brand Workspace',
  description:
    'Theo dõi loyalty, vận hành chăm sóc khách hàng và hiệu quả Digital Sample Lab.',
};

export default function BrandDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ brandId: string }>;
  searchParams: Promise<BrandDashboardSearchParams>;
}) {
  return (
    <Suspense fallback={<BrandDashboardSkeleton />}>
      <DashboardData params={params} searchParams={searchParams} />
    </Suspense>
  );
}
