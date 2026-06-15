'use client';

import React, { useRef, useState } from 'react';
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

  const hasMedia = post.media && post.media.length > 0;
  const mediaUrl = hasMedia ? post.media[0].mediaUrl : null;

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
        <div className="p-6 md:p-8 flex flex-col gap-4">
          <h2 className="font-bold text-3xl md:text-4xl text-[#1A1A1A] leading-[1.1] tracking-tight">
            {post.title || `The Editorial Feature #${post.publicId.slice(0, 4)}`}
          </h2>
          
          <p className="text-[#666666] text-[15px] leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Footer Section */}
        <div className="mx-6 md:mx-8 border-t border-[#E5E5E5] py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
              BY {post.username || 'ATELIER CURATORS'}
            </span>
            {profile?.username && profile.username === post.username && (
              <button 
                onClick={() => deletePost(post.publicId)} 
                disabled={isDeleting} 
                className="text-[#A3A3A3] hover:text-red-500 transition-colors"
                title="Delete Post"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          <div className="flex items-center gap-5 text-[#888888]">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1.5 hover:text-[#1A1A1A] transition-colors outline-none"
            >
              <Heart 
                ref={heartIconRef}
                className={cn("w-4 h-4", post.isLiked ? "fill-current text-rose-500" : "")} 
                strokeWidth={2}
              />
              <span className="text-xs font-medium">
                {post.likeCount >= 1000 ? `${(post.likeCount / 1000).toFixed(1)}k` : post.likeCount}
              </span>
            </button>
            <button 
              onClick={() => setIsCommentsOpen(true)}
              className="flex items-center gap-1.5 hover:text-[#1A1A1A] transition-colors outline-none"
            >
              <MessageSquare className="w-4 h-4" strokeWidth={2} />
              <span className="text-xs font-medium">{post.commentCount}</span>
            </button>
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
