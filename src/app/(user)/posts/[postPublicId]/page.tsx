import { serverFetch } from '@/lib/server-fetch';
import { PostRes } from '@/features/community/types';

export async function generateMetadata({ params }: { params: Promise<{ postPublicId: string }> }) {
  try {
    const resolvedParams = await params;
    const post = await serverFetch<PostRes>(`/posts/${resolvedParams.postPublicId}`, { cache: 'no-store' });
    const authorName = post?.user?.username ? `@${post.user.username}` : 'Cộng đồng';
    return {
      title: `${post?.title || 'Bài viết thời trang'} - ${authorName} | Smart Wardrobe`,
      description: post?.content || 'Xem bài viết thời trang này trên Smart Wardrobe Community',
    };
  } catch (error) {
    return {
      title: 'Bài viết | Smart Wardrobe Community',
    };
  }
}

import { Suspense } from 'react';
import { PostData } from './components/PostData';
import Loading from './loading';

export default function PostDetailPage({ params }: { params: Promise<{ postPublicId: string }> }) {
  return (
    <Suspense fallback={<Loading />}>
      <PostWrapper params={params} />
    </Suspense>
  );
}

async function PostWrapper({ params }: { params: Promise<{ postPublicId: string }> }) {
  const resolvedParams = await params;
  return <PostData postPublicId={resolvedParams.postPublicId} />;
}
