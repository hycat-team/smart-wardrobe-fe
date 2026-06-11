'use client';

import React, { useRef, useState } from 'react';
import { PostRes } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, MoreHorizontal, ImageOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import gsap from 'gsap';
import { useLikePost } from '../queries/community.queries';
import { PostCommentsModal } from './PostCommentsModal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface PostCardProps {
  post: PostRes;
}

export const PostCard = ({ post }: PostCardProps) => {
  const heartIconRef = useRef<SVGSVGElement>(null);
  const { mutate: likePost } = useLikePost();
  
  // Comments state
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  
  // Image loading state
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const handleLike = () => {
    // Optimistic toggle
    const newIsLiked = !post.isLiked;
    
    // Trigger GSAP micro-animation on the icon
    if (heartIconRef.current) {
      gsap.fromTo(
        heartIconRef.current,
        { scale: 1 },
        {
          scale: 1.3,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut',
        }
      );
    }

    // Call API
    likePost({ postPublicID: post.publicId, isLiked: newIsLiked });
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.content,
      url: post.sharePath ? `${window.location.origin}${post.sharePath}` : `${window.location.origin}/community/post/${post.publicId}`,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed silently
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareData.url)
        .then(() => toast.success('Đã sao chép liên kết vào clipboard!'))
        .catch(() => toast.error('Không thể sao chép liên kết.'));
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`;
    if (firstName) return firstName[0];
    if (post.username) return post.username[0].toUpperCase();
    return 'U';
  };

  const hasMedia = post.media && post.media.length > 0;
  const mediaUrl = hasMedia ? post.media[0].mediaUrl : null;
  const isTextOnly = !hasMedia || !mediaUrl;

  return (
    <>
      <article className="w-full max-w-[470px] mx-auto bg-background border-b border-border/40 md:border-b-0 mb-5 pb-5">
        {/* Header */}
        <div className="flex items-center justify-between py-[14px]">
          <div className="flex items-center space-x-3 cursor-pointer group/user">
            <Avatar className="w-8 h-8 ring-2 ring-transparent group-hover/user:ring-[#D9C5B2]/40 transition-all duration-300">
              <AvatarImage src={post.avatarUrl || ''} alt={post.username} />
              <AvatarFallback className="bg-muted text-primary font-medium text-xs">
                {getInitials(post.firstName, post.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-1">
              <p className="font-semibold text-[14px] text-foreground hover:text-muted-foreground transition-colors">
                {post.username}
              </p>
              <span className="text-[14px] text-muted-foreground mx-1">•</span>
              <p className="text-[14px] text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: false, locale: vi })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-foreground hover:text-muted-foreground rounded-full w-8 h-8">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Media Content */}
        {!isTextOnly && mediaUrl && (
          <div className="relative w-full aspect-[4/5] rounded-[4px] border border-border/40 overflow-hidden flex items-center justify-center bg-black/5">
            {!isImageLoaded && !hasImageError && (
              <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
            )}
            
            {hasImageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <ImageOff className="w-8 h-8 mb-2 opacity-50" />
              </div>
            ) : (
              <Image
                src={mediaUrl}
                alt={post.title || 'Post image'}
                fill
                sizes="(max-width: 768px) 100vw, 470px"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setHasImageError(true)}
                className={`object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
          </div>
        )}

        {/* Primary Text Content (If text-only, show prominently) */}
        {isTextOnly && (
          <div className="py-2 border border-border/40 rounded-[4px] px-4 min-h-[200px] flex flex-col justify-center bg-black/5">
            {post.title && (
              <h3 className="font-semibold text-[15px] text-foreground mb-1">
                {post.title}
              </h3>
            )}
            <p className="text-[14px] text-foreground/90 whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="group/btn outline-none hover:opacity-50 transition-opacity"
              aria-label={post.isLiked ? 'Bỏ thích bài viết' : 'Thích bài viết'}
            >
              <Heart
                ref={heartIconRef}
                className={`w-6 h-6 transition-colors ${
                  post.isLiked ? 'fill-rose-500 text-rose-500' : 'text-foreground'
                }`}
                strokeWidth={post.isLiked ? 2 : 1.5}
              />
            </button>

            <button
              onClick={() => setIsCommentsOpen(true)}
              className="group/btn outline-none hover:opacity-50 transition-opacity"
              aria-label="Bình luận"
            >
              <MessageCircle className="w-6 h-6 text-foreground" strokeWidth={1.5} />
            </button>

            <button
              onClick={handleShare}
              className="group/btn outline-none hover:opacity-50 transition-opacity"
              aria-label="Chia sẻ bài viết"
            >
              <Share2 className="w-6 h-6 text-foreground" strokeWidth={1.5} />
            </button>
          </div>
          {/* Placeholder for Bookmark icon on the right side if needed */}
          <div>
             <svg aria-label="Lưu" className="text-foreground hover:opacity-50 transition-opacity cursor-pointer" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
          </div>
        </div>

        {/* Footer (Likes & Caption) */}
        <div className="flex flex-col gap-1">
          {post.likeCount > 0 && (
            <p className="font-semibold text-[14px] text-foreground">{post.likeCount} lượt thích</p>
          )}
          
          {/* Caption */}
          <div className="text-[14px] leading-[18px]">
            <span className="font-semibold mr-1.5 cursor-pointer hover:text-muted-foreground transition-colors">{post.username}</span>
            {post.title && <span className="font-semibold mr-1.5">{post.title}</span>}
            <span className="text-foreground">{post.content}</span>
          </div>

          {/* Comments */}
          {post.commentCount > 0 && (
            <button 
               onClick={() => setIsCommentsOpen(true)}
               className="text-[14px] text-muted-foreground text-left mt-1 hover:text-foreground transition-colors outline-none"
            >
              Xem tất cả {post.commentCount} bình luận
            </button>
          )}

          {/* Add comment dummy input */}
          <div className="flex items-center justify-between mt-1 cursor-pointer" onClick={() => setIsCommentsOpen(true)}>
             <span className="text-[14px] text-muted-foreground">Thêm bình luận...</span>
             <span className="text-[12px] opacity-50">😊</span>
          </div>
        </div>
      </article>

      <PostCommentsModal 
        isOpen={isCommentsOpen} 
        onClose={() => setIsCommentsOpen(false)} 
        postPublicID={post.publicId} 
      />
    </>
  );
};
