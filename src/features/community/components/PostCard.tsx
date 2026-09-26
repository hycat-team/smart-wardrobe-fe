'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PostRes } from '../types';
import { ImageOff, Heart, Trash2, Loader2, MessageCircle, Share2, Bookmark, Shirt, AlertCircle, Pencil } from 'lucide-react';
import gsap from 'gsap';
import { useLikePost, useDeletePost } from '../queries/community.queries';
import { useProfile } from '@/features/profile/queries/profile.queries';
import { PostCommentsModal } from './PostCommentsModal';
import { PostShareModal } from './PostShareModal';
import { PostLikesModal } from './PostLikesModal';
import { VideoPlayer } from './VideoPlayer';
import { FollowButton } from './FollowButton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { getCommunityUserAvatar, getCommunityUserDisplayName } from '../utils/community.utils';

interface PostCardProps {
  post: PostRes;
  onEdit?: (post: PostRes) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onEdit }) => {
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
  const [isLikesOpen, setIsLikesOpen] = useState(false);

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
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      deletePost(post.publicId);
    }
  };

  const handleShare = () => {
    setIsShareOpen(true);
  };

  // Determine media URL and type
  const isOutfit = post.postType === 'outfit';
  const outfitCover = post.outfit?.coverImageUrl;
  const firstMedia = post.media && post.media.length > 0 ? post.media[0] : null;
  const isVideo = firstMedia?.mediaType === 'video';
  const mediaUrl = isOutfit ? outfitCover : firstMedia?.mediaUrl;
  const hasMedia = !!mediaUrl;

  const isOwner = Boolean(
    isMounted && profile?.username && post.user?.username && profile.username === post.user.username
  );

  const authorUsername = post.user?.username || 'user';
  const authorDisplayName = getCommunityUserDisplayName(post.user);
  const authorAvatar = getCommunityUserAvatar(post.user);

  return (
    <>
      <article className="mx-auto max-w-[550px] w-full flex flex-col bg-card text-card-foreground border border-border rounded-2xl overflow-hidden transition-colors shadow-sm">
        {/* Post Status Alert if hidden */}
        {post.status === 'hidden' && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Bài viết này đang bị quản trị viên ẩn kiểm duyệt (chỉ hiển thị với bạn).</span>
          </div>
        )}

        {/* Header Section */}
        <div className="px-3.5 py-3 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3 min-w-0">
            <Link href={`/users/${authorUsername}`} className="relative shrink-0 group">
              <div className="w-9 h-9 rounded-full relative overflow-hidden ring-1 ring-border bg-muted">
                <Image
                  src={authorAvatar}
                  alt={authorUsername}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            </Link>

            <div className="flex flex-col min-w-0">
              <Link
                href={`/users/${authorUsername}`}
                className="font-semibold text-[13px] text-foreground leading-tight truncate hover:underline"
              >
                {authorDisplayName}
              </Link>
              <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] leading-tight">
                <span>@{authorUsername}</span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {!isOwner && (
              <FollowButton
                username={authorUsername}
                isFollowing={post.isFollowingAuthor}
                userId={post.user?.userId}
                className="h-7 px-3 text-[11px]"
              />
            )}
            {isOwner && (
              <>
                {onEdit && (
                  <button
                    onClick={() => onEdit(post)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-muted"
                    title="Chỉnh sửa bài viết"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-full hover:bg-muted disabled:opacity-60"
                  title="Xóa bài viết"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Media Section */}
        {hasMedia && (
          <div className="relative w-full aspect-[4/5] bg-muted/20 overflow-hidden flex items-center justify-center border-y border-border">
            {/* Tag for Outfit post */}
            {isOutfit && post.outfit && (
              <div className="absolute top-3 left-3 z-10 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-border shadow-sm">
                <Shirt className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                  {post.outfit.name}
                </span>
              </div>
            )}

            {isVideo && firstMedia ? (
              <VideoPlayer src={firstMedia.mediaUrl} />
            ) : (
              <Link href={`/posts/${post.publicId}`} className="relative w-full h-full block">
                {!isImageLoaded && !hasImageError && (
                  <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-muted" />
                )}

                {hasImageError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <ImageOff className="w-8 h-8 mb-2 opacity-50 stroke-1" />
                  </div>
                ) : (
                  <Image
                    src={mediaUrl!}
                    alt={post.title || 'Ảnh bài viết'}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    onLoad={() => setIsImageLoaded(true)}
                    onError={() => setHasImageError(true)}
                    className={cn(
                      'object-cover transition-opacity duration-300 hover:scale-[1.01] transition-transform',
                      isImageLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                )}
              </Link>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="px-3.5 pt-2 pb-3 flex flex-col bg-card">
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5 -ml-2">
              <button
                onClick={handleLike}
                className="text-foreground hover:text-muted-foreground active:scale-95 transition-all outline-none p-2 rounded-full"
                title={post.isLiked ? 'Bỏ thích' : 'Thích'}
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
                title="Bình luận"
              >
                <MessageCircle className="w-5.5 h-5.5" strokeWidth={1.8} />
              </button>

              <button
                onClick={handleShare}
                className="text-foreground hover:text-muted-foreground active:scale-95 transition-all outline-none p-2 rounded-full"
                title="Chia sẻ"
              >
                <Share2 className="w-5.5 h-5.5" strokeWidth={1.8} />
              </button>
            </div>

            <button className="text-foreground hover:text-muted-foreground active:scale-95 transition-all outline-none p-2 rounded-full -mr-2">
              <Bookmark className="w-5.5 h-5.5" strokeWidth={1.8} />
            </button>
          </div>

          {/* Likes Link */}
          {post.likeCount > 0 && (
            <button
              onClick={() => setIsLikesOpen(true)}
              className="mt-0.5 text-[13px] font-semibold text-foreground text-left hover:underline w-fit"
            >
              {post.likeCount.toLocaleString()} lượt thích
            </button>
          )}

          {/* Title & Content */}
          <div className="mt-1.5 text-[13px] text-foreground leading-relaxed break-words">
            {post.title && (
              <Link href={`/posts/${post.publicId}`} className="font-bold text-[14px] block mb-1 hover:underline">
                {post.title}
              </Link>
            )}
            <Link href={`/users/${authorUsername}`} className="font-semibold mr-1.5 hover:underline">
              @{authorUsername}
            </Link>
            <span className="line-clamp-3">{post.content}</span>
          </div>

          {/* Comments Link */}
          {post.commentCount > 0 && (
            <button
              onClick={() => setIsCommentsOpen(true)}
              className="mt-1.5 text-[13px] text-muted-foreground text-left hover:text-foreground transition-colors w-fit"
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
        <>
          <PostShareModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            shareUrl={
              post.sharePath
                ? `${window.location.origin}${post.sharePath}`
                : `${window.location.origin}/posts/${post.publicId}`
            }
          />

          <PostLikesModal
            isOpen={isLikesOpen}
            onClose={() => setIsLikesOpen(false)}
            postPublicId={post.publicId}
          />
        </>
      )}
    </>
  );
};
