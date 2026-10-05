'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  useAdminPosts,
  useAdminHidePost,
  useAdminRestorePost,
  useAdminDeletePost,
} from '@/features/admin/queries/community-admin.queries';
import { PostRes } from '@/features/community/types';
import { getCommunityUserAvatar, getCommunityUserDisplayName } from '@/features/community/utils/community.utils';
import { Button } from '@/components/ui/button';
import {
  Eye,
  EyeOff,
  RefreshCcw,
  Trash2,
  Heart,
  MessageSquare,
  Shirt,
  Video,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export interface PostModerationTableProps {
  searchTerm: string;
  onSelectPostPreview: (post: PostRes) => void;
  onOpenContextualComments: (post: PostRes) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

export function PostModerationTable({
  searchTerm,
  onSelectPostPreview,
  onOpenContextualComments,
  statusFilter = 'all',
  onStatusFilterChange,
}: PostModerationTableProps) {
  const [page, setPage] = useState(1);
  const [internalStatus, setInternalStatus] = useState<string>('all');
  const [postToDelete, setPostToDelete] = useState<PostRes | null>(null);

  const activeStatus = onStatusFilterChange ? statusFilter : internalStatus;
  const setStatus = onStatusFilterChange || setInternalStatus;

  const { data, isLoading, isError, isFetching, refetch } = useAdminPosts({
    q: searchTerm.trim() || undefined,
    status: activeStatus === 'all' ? undefined : activeStatus,
    page,
    limit: 10,
  });

  const { mutate: hidePost, isPending: isHiding } = useAdminHidePost();
  const { mutate: restorePost, isPending: isRestoring } = useAdminRestorePost();
  const { mutate: deletePost, isPending: isDeleting } = useAdminDeletePost();

  const posts = data?.items || [];
  const metadata = data?.metadata;
  const isBusy = isHiding || isRestoring || isDeleting;

  const handleDeleteConfirm = () => {
    if (postToDelete) {
      deletePost(postToDelete.id || postToDelete.publicId, {
        onSettled: () => setPostToDelete(null),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter and Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-3xl border border-border/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mr-1">
            Trạng thái:
          </span>
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'published', label: 'Công khai' },
            { key: 'hidden', label: 'Đang ẩn' },
            { key: 'deleted', label: 'Đã xóa' },
          ].map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => {
                setStatus(st.key);
                setPage(1);
              }}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer',
                activeStatus === st.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {st.label}
            </button>
          ))}
        </div>

        {metadata && (
          <span className="text-xs text-muted-foreground font-medium">
            Tổng cộng <strong className="text-foreground">{metadata.totalItems}</strong> bài viết
          </span>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground bg-card rounded-3xl border border-border">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="text-xs uppercase tracking-widest font-semibold">Đang tải danh sách bài viết...</span>
        </div>
      ) : isError ? (
        <div className="p-10 text-center bg-destructive/5 text-destructive rounded-3xl border border-destructive/20 space-y-3">
          <AlertCircle className="size-8 mx-auto text-destructive" />
          <p className="text-sm font-semibold">Có lỗi xảy ra khi tải danh sách bài viết.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-full text-xs font-semibold uppercase tracking-wider border-destructive/30 hover:bg-destructive/10"
          >
            Thử lại
          </Button>
        </div>
      ) : posts.length === 0 ? (
        <div className="p-16 text-center bg-card rounded-3xl border border-dashed border-border text-muted-foreground space-y-2">
          <p className="text-sm font-semibold text-foreground">Không tìm thấy bài viết nào</p>
          <p className="text-xs text-muted-foreground">
            {searchTerm ? `Không có bài viết khớp với từ khóa "${searchTerm}".` : 'Chưa có bài đăng nào trong trạng thái này.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const authorName = getCommunityUserDisplayName(post.user);
            const avatarUrl = getCommunityUserAvatar(post.user);
            const postId = post.id || post.publicId;

            return (
              <div
                key={postId}
                className={cn(
                  'group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-card border border-border/80 transition-all shadow-sm hover:border-primary/50 hover:shadow-md',
                  post.status === 'hidden' && 'border-amber-500/30 bg-amber-500/[0.02]',
                  post.status === 'deleted' && 'opacity-60 bg-muted/20'
                )}
              >
                {/* Left: Author & Content */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="relative size-12 rounded-full overflow-hidden bg-muted border border-border shrink-0 mt-0.5">
                    <Image
                      src={avatarUrl}
                      alt={authorName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-foreground truncate max-w-[200px]">
                        {authorName}
                      </span>
                      <span className="text-xs text-muted-foreground">@{post.user?.username || 'member'}</span>

                      {/* Post Type Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-muted text-foreground/80">
                        {post.postType === 'outfit' ? (
                          <>
                            <Shirt className="size-3 text-primary" /> Trang phục
                          </>
                        ) : (
                          <>
                            <Video className="size-3 text-blue-500" /> Tự do / Media
                          </>
                        )}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider',
                          post.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : post.status === 'hidden'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {post.status === 'published' ? 'Công khai' : post.status === 'hidden' ? 'Đang ẩn' : 'Đã xóa'}
                      </span>
                    </div>

                    {/* Title or Snippet */}
                    <p className="text-xs sm:text-sm text-foreground line-clamp-2 leading-relaxed">
                      {post.title ? (
                        <>
                          <strong className="text-foreground font-semibold">{post.title}</strong> — {post.content}
                        </>
                      ) : (
                        post.content
                      )}
                    </p>

                    {/* Engagement & Date Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Heart className="size-3.5 text-rose-500" /> {post.likeCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => onOpenContextualComments(post)}
                        className="flex items-center gap-1 font-medium text-blue-500 hover:underline cursor-pointer"
                      >
                        <MessageSquare className="size-3.5" /> {post.commentCount} bình luận
                      </button>
                      <span>
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 sm:self-center shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectPostPreview(post)}
                    className="rounded-full size-9 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="Xem chi tiết"
                  >
                    <Eye className="size-4" />
                  </Button>

                  {post.status === 'published' && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => hidePost(postId)}
                      className="rounded-full size-9 p-0 hover:bg-amber-500/10 text-muted-foreground hover:text-amber-600"
                      title="Ẩn bài viết"
                    >
                      <EyeOff className="size-4" />
                    </Button>
                  )}

                  {post.status === 'hidden' && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => restorePost(postId)}
                      className="rounded-full size-9 p-0 hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-600"
                      title="Khôi phục bài viết"
                    >
                      <RefreshCcw className="size-4" />
                    </Button>
                  )}

                  {post.status !== 'deleted' && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => setPostToDelete(post)}
                      className="rounded-full size-9 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      title="Xóa bài viết"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {metadata && metadata.totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 pt-6 px-2">
              <span className="text-xs text-muted-foreground">
                Trang <strong className="text-foreground">{metadata.page}</strong> / {metadata.totalPages}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-full size-8 p-0"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= metadata.totalPages || isFetching}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="rounded-full size-8 p-0"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent className="rounded-3xl max-w-md p-6 bg-card border-border">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-lg font-bold text-foreground">
              Xác nhận xóa bài viết?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Hành động này sẽ xóa vĩnh viễn hoặc đánh dấu xóa bài viết của tác giả{' '}
              <strong className="text-foreground">
                {postToDelete ? getCommunityUserDisplayName(postToDelete.user) : ''}
              </strong>
              . Bài viết sẽ không còn khả dụng trên bảng tin cộng đồng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-full text-xs font-semibold uppercase tracking-wider">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="rounded-full text-xs font-semibold uppercase tracking-wider bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="size-4 animate-spin" /> : 'Xóa bài viết'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
