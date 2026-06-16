'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PostRes } from '../types';
import { ImageOff, Heart, MessageSquare, Trash2, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useLikePost, useDeletePost } from '../queries/community.queries';
import { useProfile } from '@/features/profile/queries/profile.queries';
import { PostCommentsModal } from './PostCommentsModal';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

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

  const mediaUrl = post.media && post.media.length > 0
    ? post.media[0].mediaUrl
    : post.items && post.items.length > 0
      ? (post.items[0].item as any).imageUrl
      : null;

  const hasMedia = !!mediaUrl;

  return (
    <>
      <article className="w-full flex flex-col bg-white border border-[#E5E5E5] shadow-sm">
        {/* Media Section */}
        {hasMedia && mediaUrl && (
          <div className="relative w-full aspect-[4/5] sm:aspect-auto sm:h-[600px] bg-gray-50 overflow-hidden">
            {/* Editorial Tag */}
            <div className="absolute top-4 left-4 z-10 bg-white px-3 py-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">Editorial</span>
            </div>

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
                alt={post.title || 'Editorial image'}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setHasImageError(true)}
                className={cn(
                  "object-contain transition-opacity duration-700",
                  isImageLoaded ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="p-5 md:p-6 flex flex-col">
          {/* Header row: Avatar + Username + Delete Button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#E5E5E5] overflow-hidden relative border border-[#1A1A1A]/10 flex-shrink-0">
                {post.avatarUrl ? (
                  <Image src={post.avatarUrl} alt={post.username} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#888888] font-bold text-[10px] uppercase bg-[#F3F0EA]">
                    {(post.username || 'A')[0]}
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A]">
                {post.username || 'ATELIER CURATORS'}
              </span>
            </div>
            
            {isMounted && profile?.username && profile.username === post.username && (
              <button
                onClick={() => deletePost(post.publicId)}
                disabled={isDeleting}
                className="text-[#A3A3A3] hover:text-[#D03027] transition-colors p-1"
                title="Delete Post"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Title & Content */}
          <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2] tracking-tight mb-2">
            {post.title || `The Editorial Feature #${post.publicId.slice(0, 4)}`}
          </h2>

          <p className="text-[#666666] text-sm leading-relaxed mb-6 line-clamp-3">
            {post.content}
          </p>

          {/* Footer Section */}
          <div className="border-t border-[#E5E5E5] pt-4 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-5 text-[#888888]">
              <button
                onClick={handleLike}
                className="flex items-center gap-1.5 hover:text-[#1A1A1A] transition-colors outline-none group"
              >
                <Heart
                  ref={heartIconRef}
                  className={cn("w-4 h-4 transition-colors", post.isLiked ? "fill-[#D03027] text-[#D03027]" : "group-hover:text-[#D03027]")}
                  strokeWidth={2}
                />
                <span className="text-[11px] font-medium">
                  {post.likeCount}
                </span>
              </button>
              <button
                onClick={() => setIsCommentsOpen(true)}
                className="flex items-center gap-1.5 hover:text-[#1A1A1A] transition-colors outline-none"
              >
                <MessageSquare className="w-4 h-4" strokeWidth={2} />
                <span className="text-[11px] font-medium">
                  {post.commentCount}
                </span>
              </button>
            </div>
            
            <span className="text-[10px] uppercase tracking-widest text-[#A3A3A3]">
              {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      </article>

      <PostCommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        post={post}
      />
    </>
  );
};
