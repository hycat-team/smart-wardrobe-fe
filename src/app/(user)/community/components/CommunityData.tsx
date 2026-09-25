import { serverFetch } from '@/lib/server-fetch';
import { PaginationResult } from '@/types/api';
import { PostRes } from '@/features/community/types';
import CommunityClient from './CommunityClient';
import { mockCommunityPosts } from '@/lib/mock-data/community.mock';

/*
// ==================== CODE CŨ (DÙNG KHI BE HOÀN THIỆN) ====================
// export async function CommunityData() {
//   const initialData = await serverFetch<PaginationResult<PostRes>>('/posts?page=1&limit=10', {
//     cache: 'no-store'
//   });
//
//   return <CommunityClient initialData={initialData} />;
// }
// =========================================================================
*/

export async function CommunityData() {
  // Dùng mockData (10 bài viết) cho đến khi BE hoàn thiện
  const initialData: PaginationResult<PostRes> = mockCommunityPosts;

  return <CommunityClient initialData={initialData} />;
}


