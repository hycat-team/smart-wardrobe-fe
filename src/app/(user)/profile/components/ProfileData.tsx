import { serverFetch } from '@/lib/server-fetch';
import { UserRes } from '@/features/profile/types';
import { ProfileClient } from './ProfileClient';
import { redirect } from 'next/navigation';

export async function ProfileData() {
  const initialProfile = await serverFetch<UserRes>('/me');
  if (!initialProfile) {
    redirect('/auth/login');
  }

  return <ProfileClient initialProfile={initialProfile} />;
}
