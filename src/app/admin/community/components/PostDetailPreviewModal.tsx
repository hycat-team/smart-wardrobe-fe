'use client';

import React from 'react';
import Image from 'next/image';
import { PostRes } from '@/features/community/types';
import { getCommunityUserAvatar, getCommunityUserDisplayName } from '@/features/community/utils/community.utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  EyeOff,
  RefreshCcw,
  Trash2,
  Heart,
  MessageSquare,
  Shirt,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PostDetailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostRes | null;
  onHide?: (id: string) => void;
  onRestore?: (id: string) => void;
  onDeleteRequest?: (post: PostRes) => void;
  onOpenComments?: (post: PostRes) => void;
  isActionPending?: boolean;
}

export function PostDetailPreviewModal({
  isOpen,
  onClose,
  post,
  onHide,
  onRestore,
  onDeleteRequest,
  onOpenComments,
  isActionPending = false,
}: PostDetailPreviewModalProps) {
  if (!post) return null;

  const authorName = getCommunityUserDisplayName(post.user);
  const avatarUrl = getCommunityUserAvatar(post.user);
  const createdDate = post.createdAt
    ? new Date(post.createdAt).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-card border-border shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-border/80">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative size-11 rounded-full overflow-hidden bg-muted border border-border shrink-0">
                <Image
                  src={avatarUrl}
                  alt={authorName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-foreground truncate">{authorName}</h3>
                <p className="text-xs text-muted-foreground truncate">@{post.user?.username || 'member'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider',
                  post.status === 'published'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : post.status === 'hidden'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-muted text-muted-foreground border border-border'
                )}
              >
                {post.status === 'published' ? 'Công khai' : post.status === 'hidden' ? 'Đang ẩn' : 'Đã xóa'}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="space-y-6 py-4">
          {/* Title & Text */}
          <div className="space-y-2">
            {post.title && (
              <h2 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                {post.title}
              </h2>
            )}
            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* Outfit Showcase */}
          {post.postType === 'outfit' && post.outfit && (
            <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center gap-4">
              <div className="relative size-16 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/80">
                {post.outfit.coverImageUrl ? (
                  <Image
                    src={post.outfit.coverImageUrl}
                    alt={post.outfit.name || 'Outfit'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Shirt className="size-6 text-primary" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary flex items-center gap-1">
                  <Sparkles className="size-3" /> Trang phục từ tủ đồ
                </span>
                <h4 className="font-semibold text-sm text-foreground truncate mt-0.5">
                  {post.outfit.name || 'Set trang phục'}
                </h4>
              </div>
            </div>
          )}

          {/* Media Items */}
          {post.media && post.media.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tệp đính kèm ({post.media.length})
              </span>
              <div className="grid grid-cols-2 gap-3">
                {post.media.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border group"
                  >
                    {item.mediaType === 'video' ? (
                      <video
                        src={item.mediaUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={item.mediaUrl}
                        alt="Media attachment"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60 text-xs text-muted-foreground">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 font-medium">
                <Heart className="size-4 text-rose-500 fill-rose-500/20" />
                {post.likeCount} lượt thích
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <MessageSquare className="size-4 text-blue-500" />
                {post.commentCount} bình luận
              </span>
            </div>

            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="size-3.5" />
              {createdDate}
            </span>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
          {onOpenComments && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onOpenComments(post);
              }}
              className="rounded-full text-xs font-semibold uppercase tracking-wider border-border hover:bg-muted"
            >
              <MessageSquare className="size-3.5 mr-1.5" /> Xem bình luận ({post.commentCount})
            </Button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {post.status === 'published' && onHide && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isActionPending}
                onClick={() => onHide(post.id || post.publicId)}
                className="rounded-full text-xs font-semibold uppercase tracking-wider border-amber-500/40 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700"
              >
                <EyeOff className="size-3.5 mr-1.5" /> Ẩn bài viết
              </Button>
            )}

            {post.status === 'hidden' && onRestore && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isActionPending}
                onClick={() => onRestore(post.id || post.publicId)}
                className="rounded-full text-xs font-semibold uppercase tracking-wider border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
              >
                <RefreshCcw className="size-3.5 mr-1.5" /> Khôi phục
              </Button>
            )}

            {post.status !== 'deleted' && onDeleteRequest && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isActionPending}
                onClick={() => {
                  onClose();
                  onDeleteRequest(post);
                }}
                className="rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                <Trash2 className="size-3.5 mr-1.5" /> Xóa bài
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
