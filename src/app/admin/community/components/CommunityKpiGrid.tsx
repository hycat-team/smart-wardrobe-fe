'use client';

import React from 'react';
import {
  FileText,
  EyeOff,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface CommunityKpiGridProps {
  totalPosts?: number;
  hiddenPosts?: number;
  totalComments?: number;
  activeComments?: number;
  isLoading?: boolean;
  onFilterHiddenPosts?: () => void;
  onFilterHiddenComments?: () => void;
}

export function CommunityKpiGrid({
  totalPosts = 0,
  hiddenPosts = 0,
  totalComments = 0,
  activeComments = 0,
  isLoading = false,
  onFilterHiddenPosts,
}: CommunityKpiGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-3xl" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Tổng bài viết',
      value: totalPosts.toLocaleString('vi-VN'),
      helper: 'Bài đăng phong cách trên bảng tin',
      icon: FileText,
      accent: 'text-primary',
      bgAccent: 'bg-primary/10',
    },
    {
      label: 'Bài viết đang ẩn',
      value: hiddenPosts.toLocaleString('vi-VN'),
      helper: hiddenPosts > 0 ? 'Nội dung đang bị khóa tạm thời' : 'Không có bài vi phạm',
      icon: EyeOff,
      accent: hiddenPosts > 0 ? 'text-amber-500' : 'text-muted-foreground',
      bgAccent: hiddenPosts > 0 ? 'bg-amber-500/10' : 'bg-muted',
      warning: hiddenPosts > 0,
      onClick: onFilterHiddenPosts,
      clickable: !!onFilterHiddenPosts,
    },
    {
      label: 'Tổng bình luận',
      value: totalComments.toLocaleString('vi-VN'),
      helper: 'Tương tác thảo luận toàn sàn',
      icon: MessageSquare,
      accent: 'text-blue-500',
      bgAccent: 'bg-blue-500/10',
    },
    {
      label: 'Bình luận hoạt động',
      value: activeComments.toLocaleString('vi-VN'),
      helper: 'Bình luận hợp chuẩn cộng đồng',
      icon: ShieldCheck,
      accent: 'text-emerald-500',
      bgAccent: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            onClick={card.onClick}
            className={cn(
              'relative overflow-hidden rounded-3xl border border-border/80 bg-card/95 p-6 shadow-sm transition-all',
              card.clickable && 'cursor-pointer hover:border-primary/60 hover:shadow-md active:scale-[0.99]',
              card.warning && 'border-amber-500/40 bg-amber-500/[0.02]'
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {card.value}
                  </span>
                  {card.warning && (
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                      Cần chú ý
                    </span>
                  )}
                </div>
              </div>
              <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-2xl', card.bgAccent)}>
                <Icon className={cn('size-5', card.accent)} strokeWidth={2} />
              </div>
            </div>
            <p className="mt-4 text-xs font-medium text-muted-foreground truncate">
              {card.helper}
            </p>
          </div>
        );
      })}
    </div>
  );
}
