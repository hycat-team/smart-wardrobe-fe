'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  useAdminPosts,
  useAdminHidePost,
  useAdminRestorePost,
  useAdminDeletePost,
} from '@/features/admin/queries/community-admin.queries';
import { PostRes } from '@/features/community/types';
import { getCommunityUserAvatar, getCommunityUserDisplayName } from '@/features/community/utils/community.utils';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, RefreshCcw, Trash2, Heart, MessageSquare, Shirt, Video, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PostCommentsModal } from '@/features/community/components/PostCommentsModal';

interface AdminPostsModerationProps {
  searchTerm: string;
}

export const AdminPostsModeration: React.FC<AdminPostsModerationProps> = ({ searchTerm }) => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeCommentsPost, setActiveCommentsPost] = useState<PostRes | null>(null);

  const { data, isLoading, isError, isFetching } = useAdminPosts({
    q: searchTerm.trim() || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: 10,
  });

  const { mutate: hidePost, isPending: isHiding } = useAdminHidePost();
  const { mutate: restorePost, isPending: isRestoring } = useAdminRestorePost();
  const { mutate: deletePost, isPending: isDeleting } = useAdminDeletePost();

  const posts = data?.items || [];
  const metadata = data?.metadata;
  const isBusy = isHiding || isRestoring || isDeleting;

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trạng thái:</span>
          {['all', 'published', 'hidden', 'deleted'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors',
                statusFilter === st
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground'
              )}
            >
              {st === 'all' ? 'Tất cả' : st === 'published' ? 'Công khai' : st === 'hidden' ? 'Đang ẩn' : 'Đã xóa'}
            </button>
          ))}
        </div>

        {metadata && (
          <span className="text-xs text-muted-foreground font-medium">
            Tổng cộng {metadata.totalItems} bài viết
          </span>
        )}
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs uppercase tracking-widest font-semibold">Đang tải danh sách bài viết...</span>
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 text-xs font-semibold">
          Có lỗi xảy ra khi tải danh sách bài viết kiểm duyệt.
        </div>
      ) : posts.length === 0 ? (
        <div className="p-16 text-center bg-muted/20 rounded-2xl border border-dashed border-border text-muted-foreground text-xs font-semibold uppercase tracking-widest">
          Không tìm thấy bài viết nào phù hợp.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const author = post.user;
            const displayName = getCommunityUserDisplayName(author);
            const avatar = getCommunityUserAvatar(author);
            const username = author?.username || 'user';

            const isOutfit = post.postType === 'outfit';
            const outfitCover = post.outfit?.coverImageUrl;
            const firstMedia = post.media && post.media.length > 0 ? post.media[0] : null;
            const isVideo = firstMedia?.mediaType === 'video';
            const coverUrl = isOutfit ? outfitCover : firstMedia?.mediaUrl;

            const isHidden = post.status === 'hidden';
            const isDeleted = post.status === 'deleted';

            return (
              <div
                key={post.id || post.publicId}
                className={cn(
                  'p-5 sm:p-6 border border-border bg-card shadow-sm rounded-3xl flex flex-col md:flex-row gap-6 transition-all hover:border-primary/40',
                  (isHidden || isDeleted) && 'opacity-85 bg-muted/20'
                )}
              >
                {/* Media thumbnail */}
                <div className="relative size-24 sm:size-28 bg-muted rounded-2xl overflow-hidden shrink-0 border border-border">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={post.title || 'Post media'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2 text-center text-[10px] text-muted-foreground">
                      Không có ảnh
                    </div>
                  )}

                  <div className="absolute top-1.5 right-1.5 z-10 flex gap-1">
                    {isOutfit && (
                      <div className="p-1 rounded-full bg-black/70 text-white" title="Outfit">
                        <Shirt className="w-3 h-3" />
                      </div>
                    )}
                    {isVideo && (
                      <div className="p-1 rounded-full bg-black/70 text-white" title="Video">
                        <Video className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content details */}
                <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                          post.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : post.status === 'hidden'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        )}
                      >
                        {post.status}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <h4 className="font-bold text-base sm:text-lg text-foreground line-clamp-2 leading-snug">
                      {post.title || post.content.slice(0, 100)}
                    </h4>

                    {post.title && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {post.content}
                      </p>
                    )}
                  </div>

                  {/* Author & Interactions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/60">
                    <Link
                      href={`/users/${username}`}
                      target="_blank"
                      className="flex items-center gap-2.5 group"
                    >
                      <div className="relative w-6 h-6 rounded-full overflow-hidden ring-1 ring-border">
                        <Image src={avatar} alt={displayName} fill className="object-cover" />
                      </div>
                      <span className="text-xs font-semibold text-foreground group-hover:underline">
                        {displayName} (@{username})
                      </span>
                    </Link>

                    <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-primary" /> {post.likeCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-primary" /> {post.commentCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col justify-end md:justify-center gap-2 shrink-0 border-t md:border-t-0 md:border-l md:border-border pt-4 md:pt-0 md:pl-6">
                  <Link href={`/posts/${post.publicId}`} target="_blank">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full gap-1.5 text-[11px] font-semibold h-8 px-3 border-border hover:bg-muted w-full"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Xem</span>
                    </Button>
                  </Link>

                  <Button
                    onClick={() => setActiveCommentsPost(post)}
                    variant="outline"
                    size="sm"
                    className="rounded-full gap-1.5 text-[11px] font-semibold h-8 px-3 border-border hover:bg-muted w-full"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Bình luận</span>
                  </Button>

                  {post.status === 'published' ? (
                    <Button
                      disabled={isBusy}
                      onClick={() => hidePost(post.publicId || post.id)}
                      variant="outline"
                      size="sm"
                      className="rounded-full gap-1.5 text-[11px] font-semibold h-8 px-3 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 w-full"
                    >
                      <EyeOff className="w-3 h-3" />
                      <span>Ẩn bài</span>
                    </Button>
                  ) : (
                    <Button
                      disabled={isBusy}
                      onClick={() => restorePost(post.publicId || post.id)}
                      variant="outline"
                      size="sm"
                      className="rounded-full gap-1.5 text-[11px] font-semibold h-8 px-3 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 w-full"
                    >
                      <RefreshCcw className="w-3 h-3" />
                      <span>Khôi phục</span>
                    </Button>
                  )}

                  <Button
                    disabled={isBusy}
                    onClick={() => {
                      if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
                        deletePost(post.publicId || post.id);
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="rounded-full gap-1.5 text-[11px] font-semibold h-8 px-3 border-destructive/30 text-destructive hover:bg-destructive/10 w-full"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {metadata && metadata.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl text-xs font-semibold">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isFetching}
            className="rounded-full h-8 px-4"
          >
            Trang trước
          </Button>
          <span className="text-muted-foreground">
            Trang {metadata.page} / {metadata.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(metadata.totalPages, p + 1))}
            disabled={page >= metadata.totalPages || isFetching}
            className="rounded-full h-8 px-4"
          >
            Trang sau
          </Button>
        </div>
      )}

      {/* Post Comments Modal */}
      {activeCommentsPost && (
        <PostCommentsModal
          isOpen={!!activeCommentsPost}
          onClose={() => setActiveCommentsPost(null)}
          post={activeCommentsPost}
        />
      )}
    </div>
  );
};
