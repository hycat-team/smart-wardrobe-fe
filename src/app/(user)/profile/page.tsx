import { Metadata } from 'next';
import { serverFetch } from '@/lib/server-fetch';
import { UserRes } from '@/features/profile/types';
import { ProfileClient } from './components/ProfileClient';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Hồ sơ cá nhân | Smart Wardrobe',
  description: 'Quản lý hồ sơ cá nhân và phân tích phong cách thời trang của bạn.',
};

export default async function UserProfilePage() {
  const initialProfile = await serverFetch<UserRes>('/me');
  if (!initialProfile) {
    redirect('/auth/login');
  }

  return <ProfileClient initialProfile={initialProfile} />;
}
