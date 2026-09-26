'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserPosts } from '@/features/community/queries/user-social.queries';
import { Heart, MessageCircle, Shirt, Video, AlertCircle, Loader2 } from 'lucide-react';
import { PostRes } from '@/features/community/types';

interface UserPostsGridProps {
  username: string;
}

export const UserPostsGrid: React.FC<UserPostsGridProps> = ({ username }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useUserPosts(username, page);

  const posts = data?.items || [];
  const metadata = data?.metadata;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-medium">Đang tải các bài đăng...</span>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Shirt className="w-8 h-8 opacity-40" />
        </div>
        <h3 className="text-base font-bold text-foreground">Chưa có bài đăng nào</h3>
        <p className="text-xs max-w-sm">
          Tác giả này chưa chia sẻ bài đăng phong cách nào trên cộng đồng.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        {posts.map((post: PostRes) => {
          const isOutfit = post.postType === 'outfit';
          const outfitCover = post.outfit?.coverImageUrl;
          const firstMedia = post.media && post.media.length > 0 ? post.media[0] : null;
          const isVideo = firstMedia?.mediaType === 'video';
          const coverUrl = isOutfit ? outfitCover : firstMedia?.mediaUrl;

          return (
            <Link
              key={post.id || post.publicId}
              href={`/posts/${post.publicId}`}
              className="group relative aspect-square bg-muted/40 rounded-xl overflow-hidden border border-border/60 shadow-sm"
            >
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={post.title || 'Post image'}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4 bg-muted text-muted-foreground text-center text-xs font-medium">
                  {post.title || post.content.slice(0, 50)}
                </div>
              )}

              {/* Type Badge Top Right */}
              <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
                {isOutfit && (
                  <div className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-sm shadow-md" title="Bài đăng Outfit">
                    <Shirt className="w-3.5 h-3.5" />
                  </div>
                )}
                {isVideo && (
                  <div className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-sm shadow-md" title="Video">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Hidden Status Badge */}
              {post.status === 'hidden' && (
                <div className="absolute top-2.5 left-2.5 z-10 bg-amber-600/90 text-white px-2 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-bold tracking-wide backdrop-blur-sm">
                  <AlertCircle className="w-3 h-3" />
                  <span>BỊ ẨN</span>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm z-20">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{post.likeCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{post.commentCount}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {metadata && metadata.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4 text-xs">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isFetching}
            className="px-4 py-2 rounded-full border border-border font-semibold text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
          >
            Trang trước
          </button>
          <span className="text-muted-foreground font-medium">
            Trang {metadata.page} / {metadata.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(metadata.totalPages, p + 1))}
            disabled={page >= metadata.totalPages || isFetching}
            className="px-4 py-2 rounded-full border border-border font-semibold text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};
