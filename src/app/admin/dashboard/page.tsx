import type { Metadata } from 'next';
import { Suspense } from 'react';
import DashboardData from './components/DashboardData';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import type { DashboardSearchParams } from '@/features/admin/types';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Smart Wardrobe',
  description: 'Dashboard tổng quan quản trị hệ thống.',
};

export default function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData searchParams={searchParams} />
    </Suspense>
  );
}
