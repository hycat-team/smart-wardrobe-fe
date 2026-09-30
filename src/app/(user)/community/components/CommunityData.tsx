import { serverFetch } from '@/lib/server-fetch';
import { PaginationResult } from '@/types/api';
import { PostRes } from '@/features/community/types';
import CommunityClient from './CommunityClient';

export async function CommunityData() {
  const initialData = await serverFetch<PaginationResult<PostRes>>(
    '/posts?page=1&limit=10&type=explore&sort=hot',
    {
      cache: 'no-store',
    }
  );

  return <CommunityClient initialData={initialData} />;
}
