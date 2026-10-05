'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  useAdminComments,
  useAdminHideComment,
  useAdminRestoreComment,
  useAdminDeleteComment,
} from '@/features/admin/queries/community-admin.queries';
import { CommentRes } from '@/features/community/types';
import { getCommunityUserAvatar, getCommunityUserDisplayName } from '@/features/community/utils/community.utils';
import { Button } from '@/components/ui/button';
import {
  EyeOff,
  RefreshCcw,
  Trash2,
  Loader2,
  AlertCircle,
  MessageSquare,
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

export interface CommentModerationTableProps {
  searchTerm: string;
}

export function CommentModerationTable({ searchTerm }: CommentModerationTableProps) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [commentToDelete, setCommentToDelete] = useState<CommentRes | null>(null);

  const { data, isLoading, isError, isFetching, refetch } = useAdminComments({
    q: searchTerm.trim() || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: 15,
  });

  const { mutate: hideComment, isPending: isHiding } = useAdminHideComment();
  const { mutate: restoreComment, isPending: isRestoring } = useAdminRestoreComment();
  const { mutate: deleteComment, isPending: isDeleting } = useAdminDeleteComment();

  const comments = data?.items || [];
  const metadata = data?.metadata;
  const isBusy = isHiding || isRestoring || isDeleting;

  const handleDeleteConfirm = () => {
    if (commentToDelete) {
      deleteComment(commentToDelete.id, {
        onSettled: () => setCommentToDelete(null),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-3xl border border-border/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mr-1">
            Trạng thái:
          </span>
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'active', label: 'Hoạt động' },
            { key: 'hidden', label: 'Đang ẩn' },
            { key: 'deleted', label: 'Đã xóa' },
          ].map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => {
                setStatusFilter(st.key);
                setPage(1);
              }}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer',
                statusFilter === st.key
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
            Tổng cộng <strong className="text-foreground">{metadata.totalItems}</strong> bình luận
          </span>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground bg-card rounded-3xl border border-border">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="text-xs uppercase tracking-widest font-semibold">Đang tải danh sách bình luận...</span>
        </div>
      ) : isError ? (
        <div className="p-10 text-center bg-destructive/5 text-destructive rounded-3xl border border-destructive/20 space-y-3">
          <AlertCircle className="size-8 mx-auto text-destructive" />
          <p className="text-sm font-semibold">Có lỗi xảy ra khi tải danh sách bình luận.</p>
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
      ) : comments.length === 0 ? (
        <div className="p-16 text-center bg-card rounded-3xl border border-dashed border-border text-muted-foreground space-y-2">
          <p className="text-sm font-semibold text-foreground">Không tìm thấy bình luận nào</p>
          <p className="text-xs text-muted-foreground">
            {searchTerm ? `Không có bình luận khớp với từ khóa "${searchTerm}".` : 'Chưa có bình luận nào trong trạng thái này.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => {
            const authorName = getCommunityUserDisplayName(comment.user);
            const avatarUrl = getCommunityUserAvatar(comment.user);
            const isCommentDeleted = comment.isDeleted;

            return (
              <div
                key={comment.id}
                className={cn(
                  'group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-card border border-border/80 transition-all shadow-sm hover:border-primary/50 hover:shadow-md',
                  isCommentDeleted && 'opacity-60 bg-muted/20'
                )}
              >
                {/* Left: User & Comment Text */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="relative size-10 rounded-full overflow-hidden bg-muted border border-border shrink-0 mt-0.5">
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
                      <span className="text-xs text-muted-foreground">@{comment.user?.username || 'member'}</span>

                      {/* Status Badge */}
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider',
                          !isCommentDeleted
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {!isCommentDeleted ? 'Hoạt động' : 'Đã xóa / Ẩn'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {comment.content || (
                        <span className="italic text-muted-foreground">[Nội dung bình luận đã bị xóa]</span>
                      )}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-1">
                      {comment.parentCommentId && (
                        <span className="text-primary font-medium flex items-center gap-1">
                          <MessageSquare className="size-3" /> Phản hồi bình luận
                        </span>
                      )}
                      <span>
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 sm:self-center shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                  {!isCommentDeleted ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => hideComment(comment.id)}
                      className="rounded-full size-9 p-0 hover:bg-amber-500/10 text-muted-foreground hover:text-amber-600"
                      title="Ẩn bình luận"
                    >
                      <EyeOff className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => restoreComment(comment.id)}
                      className="rounded-full size-9 p-0 hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-600"
                      title="Khôi phục bình luận"
                    >
                      <RefreshCcw className="size-4" />
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isBusy}
                    onClick={() => setCommentToDelete(comment)}
                    className="rounded-full size-9 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    title="Xóa bình luận"
                  >
                    <Trash2 className="size-4" />
                  </Button>
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
      <AlertDialog open={!!commentToDelete} onOpenChange={(open) => !open && setCommentToDelete(null)}>
        <AlertDialogContent className="rounded-3xl max-w-md p-6 bg-card border-border">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-lg font-bold text-foreground">
              Xác nhận xóa bình luận?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Hành động này sẽ xóa vĩnh viễn bình luận của{' '}
              <strong className="text-foreground">
                {commentToDelete ? getCommunityUserDisplayName(commentToDelete.user) : ''}
              </strong>
              .
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
              {isDeleting ? <Loader2 className="size-4 animate-spin" /> : 'Xóa bình luận'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
