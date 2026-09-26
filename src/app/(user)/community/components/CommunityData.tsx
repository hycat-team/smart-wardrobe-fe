import { serverFetch } from '@/lib/server-fetch';
import { PaginationResult } from '@/types/api';
import { PostRes } from '@/features/community/types';
import CommunityClient from './CommunityClient';

export async function CommunityData() {
  let initialData: PaginationResult<PostRes> | null = null;
  try {
    initialData = await serverFetch<PaginationResult<PostRes>>('/posts?page=1&limit=10&type=explore&sort=hot', {
      cache: 'no-store',
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu ban đầu cho bảng tin cộng đồng:', error);
  }

  return <CommunityClient initialData={initialData} />;
}
