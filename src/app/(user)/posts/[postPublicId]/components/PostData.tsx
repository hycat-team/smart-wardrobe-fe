import { serverFetch } from '@/lib/server-fetch';
import { PostRes } from '@/features/community/types';
import PostDetailClient from './PostDetailClient';
import { notFound } from 'next/navigation';
import { mockCommunityPosts } from '@/lib/mock-data/community.mock';

/*
// ==================== CODE CŨ (DÙNG KHI BE HOÀN THIỆN) ====================
// export async function PostData({ postPublicId }: { postPublicId: string }) {
//   let initialData: PostRes | null = null;
//   try {
//     initialData = await serverFetch<PostRes>(`/posts/${postPublicId}`, {
//       cache: 'no-store'
//     });
//   } catch (error) {
//     notFound();
//   }
//
//   if (!initialData) {
//     notFound();
//   }
//
//   return <PostDetailClient postPublicId={postPublicId} initialData={initialData} />;
// }
// =========================================================================
*/

export async function PostData({ postPublicId }: { postPublicId: string }) {
  let initialData: PostRes | null = null;
  try {
    initialData = await serverFetch<PostRes>(`/posts/${postPublicId}`, {
      cache: 'no-store'
    });
  } catch (error) {
    // Check fallback in mock data
    const mockPost = mockCommunityPosts.items.find(
      (p) => p.publicId === postPublicId || p.id === postPublicId
    );
    if (mockPost) {
      initialData = mockPost;
    } else {
      notFound();
    }
  }

  if (!initialData) {
    const mockPost = mockCommunityPosts.items.find(
      (p) => p.publicId === postPublicId || p.id === postPublicId
    );
    if (mockPost) {
      initialData = mockPost;
    } else {
      notFound();
    }
  }

  return <PostDetailClient postPublicId={postPublicId} initialData={initialData} />;
}


