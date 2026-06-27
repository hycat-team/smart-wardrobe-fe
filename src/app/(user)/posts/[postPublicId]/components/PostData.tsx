import { serverFetch } from '@/lib/server-fetch';
import { PostRes } from '@/features/community/types';
import PostDetailClient from './PostDetailClient';
import { notFound } from 'next/navigation';

export async function PostData({ postPublicId }: { postPublicId: string }) {
  let initialData: PostRes | null = null;
  try {
    initialData = await serverFetch<PostRes>(`/posts/${postPublicId}`, {
      cache: 'no-store'
    });
  } catch (error) {
    notFound();
  }

  if (!initialData) {
    notFound();
  }

  return <PostDetailClient postPublicId={postPublicId} initialData={initialData} />;
}
