'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PostRes } from '../types';
import { ImageOff, Heart, MessageSquare, Trash2, Loader2, MessageCircle, Share, Share2, Bookmark } from 'lucide-react';
import gsap from 'gsap';
import { useLikePost, useDeletePost } from '../queries/community.queries';
import { useProfile } from '@/features/profile/queries/profile.queries';
import { PostCommentsModal } from './PostCommentsModal';
import { PostShareModal } from './PostShareModal';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getUserAvatar } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
interface PostCardProps {
  post: PostRes;
}

export const PostCard = ({ post }: PostCardProps) => {
  const heartIconRef = useRef<SVGSVGElement>(null);
  const { mutate: likePost } = useLikePost();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { data: profile } = useProfile();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const handleLike = () => {
    const newIsLiked = !post.isLiked;

    if (heartIconRef.current) {
      gsap.fromTo(
        heartIconRef.current,
        { scale: 1 },
        {
          scale: 1.3,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        }
      );
    }

    likePost({ postPublicID: post.publicId, isLiked: newIsLiked });
  };

  const handleDelete = () => {
    deletePost(post.publicId);
  };

  const handleShare = () => {
    setIsShareOpen(true);
  };

  const mediaUrl = post.media && post.media.length > 0
    ? post.media[0].mediaUrl
    : post.items && post.items.length > 0
      ? (post.items[0].item as any).imageUrl
      : null;

  const hasMedia = !!mediaUrl;

  return (
    <>
      <article className="mx-auto max-w-[550px] w-full flex flex-col bg-card text-card-foreground border border-border rounded-2xl overflow-hidden transition-colors">
        {/* Header Section */}
        <div className="px-3 py-2.5 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full relative overflow-hidden flex-shrink-0 ring-1 ring-border bg-muted">
              <Image
                src={getUserAvatar(post as any)}
                alt={post.username || 'Avatar'}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-[13px] text-foreground leading-tight truncate hover:underline cursor-pointer">
                {post.username || 'ATELIER CURATORS'}
              </span>
              <span className="text-muted-foreground text-[11px] leading-tight">
                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          <div className="flex items-center">
            {isMounted && profile?.username && profile.username === post.username && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-full hover:bg-muted disabled:opacity-60"
                title="Delete Post"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Media Section */}
        {hasMedia && mediaUrl && (
          <div className="relative w-full aspect-[4/5] bg-muted/20 overflow-hidden flex items-center justify-center border-y border-border">
            {!isImageLoaded && !hasImageError && (
              <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-muted" />
            )}

            {hasImageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <ImageOff className="w-8 h-8 mb-2 opacity-50 stroke-1" />
              </div>
            ) : (
              <Image
                src={mediaUrl}
                alt={post.title || 'Post image'}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setHasImageError(true)}
                className={cn(
                  'object-cover transition-opacity duration-300',
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                )}
              />
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="px-3 pt-1.5 pb-2 flex flex-col bg-card">
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5 -ml-2">
              <button
                onClick={handleLike}
                className="text-foreground hover:text-muted-foreground active:scale-95 transition-all outline-none p-2 rounded-full"
              >
                <Heart
                  ref={heartIconRef}
                  className={cn(
                    'w-5.5 h-5.5 transition-colors',
                    post.isLiked ? 'fill-destructive text-destructive' : ''
                  )}
                  strokeWidth={1.8}
                />
              </button>

              <button
                onClick={() => setIsCommentsOpen(true)}
                className="text-foreground hover:text-muted-foreground active:scale-95 transition-all outline-none p-2 rounded-full"
              >
                <MessageCircle className="w-5.5 h-5.5" strokeWidth={1.8} />
              </button>

              <button
                onClick={handleShare}
                className="text-foreground hover:text-muted-foreground active:scale-95 transition-all outline-none p-2 rounded-full"
              >
                <Share2 className="w-5.5 h-5.5" strokeWidth={1.8} />
              </button>
            </div>

            <button className="text-foreground hover:text-muted-foreground active:scale-95 transition-all outline-none p-2 rounded-full -mr-2">
              <Bookmark className="w-5.5 h-5.5" strokeWidth={1.8} />
            </button>
          </div>

          {/* Likes */}
          {post.likeCount > 0 && (
            <div className="mt-0.5 text-[13px] font-semibold text-foreground">
              {post.likeCount.toLocaleString()} lượt thích
            </div>
          )}

          {/* Title & Content */}
          <div className="mt-1 text-[13px] text-foreground leading-relaxed break-words line-clamp-2">
            <span className="font-semibold mr-1.5 hover:underline cursor-pointer">
              {post.username || 'ATELIER CURATORS'}
            </span>
            <span>{post.content}</span>
          </div>

          {/* Comments Link */}
          {post.commentCount > 0 && (
            <button
              onClick={() => setIsCommentsOpen(true)}
              className="mt-1.5 text-[13px] text-muted-foreground text-left hover:text-foreground transition-colors"
            >
              Xem tất cả {post.commentCount} bình luận
            </button>
          )}
        </div>
      </article>

      <PostCommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        post={post}
      />

      {isMounted && (
        <PostShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          shareUrl={
            post.sharePath
              ? `${window.location.origin}${post.sharePath}`
              : `${window.location.origin}/community/posts/${post.publicId}`
          }
        />
      )}
    </>
  );
};
