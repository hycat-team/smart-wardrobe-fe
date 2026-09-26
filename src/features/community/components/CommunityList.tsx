'use client';

import React, { useRef, useEffect } from 'react';
import { PostCard } from './PostCard';
import { PostRes } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Loader2, Plus, Flame, Clock, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { getUserAvatar } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface CommunityListProps {
  data: { pages: { items: PostRes[] }[] } | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  feedType?: 'explore' | 'following';
  onFeedTypeChange?: (type: 'explore' | 'following') => void;
  feedSort?: 'hot' | 'latest';
  onFeedSortChange?: (sort: 'hot' | 'latest') => void;
  onOpenComposer?: () => void;
  onEditPost?: (post: PostRes) => void;
}

export const CommunityList: React.FC<CommunityListProps> = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  feedType = 'explore',
  onFeedTypeChange,
  feedSort = 'hot',
  onFeedSortChange,
  onOpenComposer,
  onEditPost,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const handleFollowingTabClick = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để xem bài viết từ những người bạn đang theo dõi.');
      router.push('/auth/login');
      return;
    }
    onFeedTypeChange?.('following');
  };

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.community-post-card');

      cards.forEach((card) => {
        if (!card.dataset.animated) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom-=80',
                toggleActions: 'play none none none',
              },
              onComplete: () => {
                card.dataset.animated = 'true';
              },
            }
          );
        }
      });
    },
    { dependencies: [data], scope: containerRef }
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts: PostRes[] = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="w-full flex flex-col gap-6" ref={containerRef}>
      {/* Feed Controls: Tabs & Sort Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card border border-border p-3 rounded-2xl shadow-sm">
        {/* Tabs: Explore vs Following */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onFeedTypeChange?.('explore')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider',
              feedType === 'explore'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Khám phá
          </button>
          <button
            type="button"
            onClick={handleFollowingTabClick}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5',
              feedType === 'following'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <span>Đang theo dõi</span>
            {!user && <span className="text-[10px] text-muted-foreground opacity-60">🔒</span>}
          </button>
        </div>

        {/* Sort: Hot vs Latest */}
        <div className="flex items-center gap-1 justify-end">
          <button
            type="button"
            onClick={() => onFeedSortChange?.('hot')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              feedSort === 'hot'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:bg-muted'
            )}
            title="Sắp xếp theo độ nổi bật"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Nổi bật</span>
          </button>
          <button
            type="button"
            onClick={() => onFeedSortChange?.('latest')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              feedSort === 'latest'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:bg-muted'
            )}
            title="Sắp xếp theo thời gian mới nhất"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Mới nhất</span>
          </button>
        </div>
      </div>

      {/* Quick Create Post Bar */}
      <div
        onClick={() => {
          if (!user) {
            toast.error('Vui lòng đăng nhập để tạo bài viết.');
            router.push('/auth/login');
            return;
          }
          onOpenComposer?.();
        }}
        className="w-full border border-border rounded-2xl bg-card p-4 flex items-center gap-3 shadow-sm text-card-foreground cursor-pointer hover:border-primary/50 hover:bg-card/80 transition-all group"
      >
        <Avatar className="w-9 h-9 ring-1 ring-border shrink-0">
          <AvatarImage src={getUserAvatar(user)} className="object-cover" />
          <AvatarFallback className="bg-muted text-foreground font-medium text-xs">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 bg-muted/60 hover:bg-muted rounded-full px-4 py-2 text-xs sm:text-sm text-muted-foreground transition-colors truncate">
          Bạn đang nghĩ gì về phong cách hôm nay? Chia sẻ ngay...
        </div>
        <Button
          type="button"
          size="sm"
          className="rounded-full gap-1.5 font-bold uppercase tracking-wider text-[11px] h-9 px-4 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tạo bài</span>
        </Button>
      </div>

      {/* Posts List & Loading States */}
      {isLoading && !data ? (
        <div className="w-full flex flex-col gap-8 mt-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-full max-w-[550px] mx-auto bg-card border border-border pb-5 flex flex-col gap-4 shadow-sm rounded-2xl overflow-hidden"
            >
              <div className="p-3 flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full bg-muted" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <Skeleton className="h-3.5 w-32 bg-muted" />
                  <Skeleton className="h-2.5 w-20 bg-muted" />
                </div>
              </div>
              <Skeleton className="w-full aspect-[4/5] rounded-none bg-muted" />
              <div className="px-4 flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4 bg-muted" />
                <Skeleton className="h-3 w-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : allPosts.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center justify-center space-y-3 bg-card border border-border rounded-2xl max-w-[550px] mx-auto w-full p-8">
          <Sparkles className="w-10 h-10 text-muted-foreground stroke-1 mb-1" />
          <h3 className="font-bold text-lg text-foreground tracking-tight">
            {feedType === 'following' ? 'Chưa có bài viết từ người bạn theo dõi' : 'Chưa có bài viết nào'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            {feedType === 'following'
              ? 'Hãy khám phá cộng đồng và theo dõi thêm các thành viên phong cách để cập nhật trang phục mới.'
              : 'Hãy trở thành người đầu tiên chia sẻ cảm hứng và phong cách của bạn với cộng đồng.'}
          </p>
          <Button
            type="button"
            onClick={() => (feedType === 'following' ? onFeedTypeChange?.('explore') : onOpenComposer?.())}
            variant="outline"
            className="rounded-full text-xs font-bold uppercase tracking-wider mt-3"
          >
            {feedType === 'following' ? 'Khám phá cộng đồng' : 'Tạo bài viết đầu tiên'}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-8 mt-1">
          {allPosts.map((post) => (
            <div key={post.id} className="community-post-card">
              <PostCard post={post} onEdit={onEditPost} />
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={loadMoreRef} className="w-full h-24 flex items-center justify-center mt-4">
        {isFetchingNextPage && (
          <div className="flex items-center space-x-2 text-muted-foreground font-bold uppercase tracking-widest text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Đang tải thêm bài viết...</span>
          </div>
        )}
      </div>
    </div>
  );
};
