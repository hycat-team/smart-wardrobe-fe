import { serverFetch } from '@/lib/server-fetch';
import { UserRes } from '@/features/profile/types';
import { ProfileUpdateClient } from '../../components/ProfileUpdateClient';
import { redirect } from 'next/navigation';

export async function ProfileUpdateData() {
  const initialProfile = await serverFetch<UserRes>('/me');
  
  if (!initialProfile) {
    redirect('/auth/login');
  }

  return <ProfileUpdateClient initialProfile={initialProfile} />;
}
