'use client';

import React from 'react';
import { usePostDetail } from '@/features/community/queries/community.queries';
import { PostRes } from '@/features/community/types';
import { PostCard } from '@/features/community/components/PostCard';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PostDetailClientProps {
  postPublicId: string;
  initialData: PostRes;
}

export default function PostDetailClient({ postPublicId, initialData }: PostDetailClientProps) {
  const router = useRouter();
  const { data: post, isLoading } = usePostDetail(postPublicId, initialData);

  if (isLoading && !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-10 text-foreground animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-sm text-foreground font-medium">Không tìm thấy bài viết.</p>
        <button onClick={() => router.push('/community')} className="bg-foreground text-background rounded-full px-6 py-3 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity mt-2">
          Quay lại cộng đồng
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <button 
        onClick={() => router.push('/community')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full px-4 py-2 -ml-4 mb-6 transition-colors group outline-none font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        QUAY LẠI CỘNG ĐỒNG
      </button>
      
      <PostCard post={post} />
    </div>
  );
}
