'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  useAdminComments,
  useAdminHideComment,
  useAdminRestoreComment,
  useAdminDeleteComment,
} from '@/features/admin/queries/community-admin.queries';
import { getCommunityUserAvatar, getCommunityUserDisplayName } from '@/features/community/utils/community.utils';
import { Button } from '@/components/ui/button';
import { EyeOff, RefreshCcw, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminCommentsModerationProps {
  searchTerm: string;
}

export const AdminCommentsModeration: React.FC<AdminCommentsModerationProps> = ({ searchTerm }) => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data, isLoading, isError, isFetching } = useAdminComments({
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

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trạng thái:</span>
          {['all', 'active', 'deleted'].map((st) => (
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
              {st === 'all' ? 'Tất cả' : st === 'active' ? 'Hoạt động' : 'Đã xóa / Ẩn'}
            </button>
          ))}
        </div>

        {metadata && (
          <span className="text-xs text-muted-foreground font-medium">
            Tổng cộng {metadata.totalItems} bình luận
          </span>
        )}
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs uppercase tracking-widest font-semibold">Đang tải danh sách bình luận...</span>
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 text-xs font-semibold">
          Có lỗi xảy ra khi tải danh sách bình luận kiểm duyệt.
        </div>
      ) : comments.length === 0 ? (
        <div className="p-16 text-center bg-muted/20 rounded-2xl border border-dashed border-border text-muted-foreground text-xs font-semibold uppercase tracking-widest">
          Không tìm thấy bình luận nào.
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => {
            const author = comment.user;
            const displayName = getCommunityUserDisplayName(author);
            const avatar = getCommunityUserAvatar(author);
            const username = author?.username || 'user';
            const isDeleted = comment.isDeleted;

            return (
              <div
                key={comment.id}
                className={cn(
                  'p-4 sm:p-5 border border-border bg-card shadow-sm rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-primary/40',
                  isDeleted && 'opacity-75 bg-muted/20'
                )}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-border bg-muted shrink-0 mt-0.5">
                    <Image src={avatar} alt={displayName} fill className="object-cover" />
                  </div>

                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/users/${username}`}
                        target="_blank"
                        className="font-bold text-xs text-foreground hover:underline"
                      >
                        {displayName} (@{username})
                      </Link>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      {isDeleted && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
                          ĐÃ XÓA
                        </span>
                      )}
                    </div>

                    <p className={cn('text-xs text-foreground/90 leading-relaxed break-words', isDeleted && 'italic text-muted-foreground')}>
                      {isDeleted ? 'Bình luận này đã bị xóa hoặc ẩn khỏi hệ thống.' : comment.content}
                    </p>

                    {comment.replyCount > 0 && (
                      <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MessageSquare className="w-3 h-3" /> {comment.replyCount} câu trả lời
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {isDeleted ? (
                    <Button
                      disabled={isBusy}
                      onClick={() => restoreComment(comment.id)}
                      variant="outline"
                      size="sm"
                      className="rounded-full gap-1 text-[11px] font-semibold h-8 px-3 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                    >
                      <RefreshCcw className="w-3 h-3" />
                      <span>Khôi phục</span>
                    </Button>
                  ) : (
                    <Button
                      disabled={isBusy}
                      onClick={() => hideComment(comment.id)}
                      variant="outline"
                      size="sm"
                      className="rounded-full gap-1 text-[11px] font-semibold h-8 px-3 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                    >
                      <EyeOff className="w-3 h-3" />
                      <span>Ẩn</span>
                    </Button>
                  )}

                  <Button
                    disabled={isBusy}
                    onClick={() => {
                      if (confirm('Bạn có chắc chắn muốn xóa vĩnh viễn bình luận này không?')) {
                        deleteComment(comment.id);
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="rounded-full gap-1 text-[11px] font-semibold h-8 px-3 border-destructive/30 text-destructive hover:bg-destructive/10"
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
    </div>
  );
};
