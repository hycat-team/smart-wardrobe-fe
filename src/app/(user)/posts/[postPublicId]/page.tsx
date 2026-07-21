import { serverFetch } from '@/lib/server-fetch';
import { PostRes } from '@/features/community/types';

export async function generateMetadata({ params }: { params: Promise<{ postPublicId: string }> }) {
  try {
    const resolvedParams = await params;
    const post = await serverFetch<PostRes>(`/posts/${resolvedParams.postPublicId}`, { cache: 'no-store' });
    return {
      title: `${post?.title || 'Bài viết'} | Atelier Curators`,
      description: post?.content || 'Xem bài viết này trên Atelier Curators',
    };
  } catch (error) {
    return {
      title: 'Bài viết | Atelier Curators',
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
