'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PostRes } from '../types';
import { ImageOff, Heart, MessageSquare, Trash2, Loader2, MessageCircle, Share, Share2 } from 'lucide-react';
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
      <article className="w-full flex flex-col bg-card text-card-foreground border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
        {/* Header Section */}
        <div className="p-2.5 flex items-center justify-between border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 ring-1 ring-background shadow-sm rounded-full relative overflow-hidden flex-shrink-0">
              <Image src={getUserAvatar(post as any)} alt={post.username || 'Avatar'} fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-foreground leading-tight hover:underline">
                {post.username || 'ATELIER CURATORS'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">
              {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </div>
            {isMounted && profile?.username && profile.username === post.username && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                title="Delete Post"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Media Section */}
        {hasMedia && mediaUrl && (
          <div className="relative w-full aspect-square bg-muted overflow-hidden">
            {!isImageLoaded && !hasImageError && (
              <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-gray-100" />
            )}

            {hasImageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
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
                  "object-cover group-hover:scale-105 transition-transform duration-1000 ease-out",
                  isImageLoaded ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="p-3 flex flex-col gap-2.5 bg-card">
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className="text-foreground hover:scale-110 transition-all outline-none"
              >
                <Heart
                  ref={heartIconRef}
                  className={cn("w-[18px] h-[18px] transition-colors hover:text-muted-foreground", post.isLiked ? "fill-destructive text-destructive hover:text-destructive" : "")}
                  strokeWidth={1.5}
                />
              </button>
              <button
                onClick={() => setIsCommentsOpen(true)}
                className="text-foreground hover:text-muted-foreground hover:scale-110 transition-all outline-none"
              >
                <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
              <button
                onClick={handleShare}
                className="text-foreground hover:text-muted-foreground hover:scale-110 transition-all outline-none"
              >
                <Share2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Title & Content */}
          <div className="text-xs text-foreground leading-relaxed">
            <span className="font-bold mr-2">{post.username || 'ATELIER CURATORS'}</span>
            <span className="text-muted-foreground">{post.content}</span>
          </div>

          {/* Footer Metrics */}
          <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">
            {post.likeCount.toLocaleString()} lượt thích • {post.commentCount} bình luận
          </div>
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
          shareUrl={post.sharePath ? `${window.location.origin}${post.sharePath}` : `${window.location.origin}/community/posts/${post.publicId}`}
        />
      )}
    </>
  );
};
