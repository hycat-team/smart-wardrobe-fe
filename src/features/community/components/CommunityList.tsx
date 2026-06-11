'use client';

import React, { useRef, useEffect } from 'react';
import { PostCard } from './PostCard';
import { PostRes } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface CommunityListProps {
  data: { pages: { items: PostRes[] }[] } | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
}

export const CommunityList = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
}: CommunityListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // GSAP Animation for Cards
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.community-post-card');
      
      cards.forEach((card) => {
        // Only animate if it hasn't been animated yet
        if (!card.dataset.animated) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
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

  // Intersection Observer for Infinite Scroll
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

  if (isLoading && !data) {
    return (
      <div className="w-full max-w-[470px] mx-auto py-8 flex flex-col space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full bg-background border-b border-border/40 md:border-b-0 pb-5">
            <div className="flex items-center justify-between py-[14px]">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
              <Skeleton className="w-5 h-5 rounded-full" />
            </div>
            <Skeleton className="w-full aspect-[4/5] rounded-[4px]" />
            <div className="flex items-center justify-between py-3 mt-1">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-6 h-6 rounded-full" />
              </div>
              <Skeleton className="w-6 h-6 rounded-full" />
            </div>
            <div className="flex flex-col gap-2 mt-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const allPosts: PostRes[] = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6" ref={containerRef}>
      <div className="flex flex-col space-y-8">
        {allPosts.map((post) => (
          <div key={post.id} className="community-post-card">
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div
        ref={loadMoreRef}
        className="w-full h-32 flex items-center justify-center mt-4"
      >
        {isFetchingNextPage && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Đang tải thêm...</span>
          </div>
        )}
        {!hasNextPage && allPosts.length > 0 && (
          <p className="text-sm text-muted-foreground font-medium">
            Bạn đã xem hết bảng tin.
          </p>
        )}
        {!hasNextPage && allPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg font-semibold text-foreground">Chưa có bài viết nào</p>
            <p className="text-muted-foreground">Hãy trở thành người đầu tiên chia sẻ phong cách của bạn!</p>
          </div>
        )}
      </div>
    </div>
  );
};
