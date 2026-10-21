'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PostRes, CommentRes } from '@/features/community/types';
import {
  useAdminPostComments,
  useAdminHideComment,
  useAdminRestoreComment,
  useAdminDeleteComment,
} from '@/features/admin/queries/community-admin.queries';
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
  Loader2,
  MessageSquare,
  AlertCircle,
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

export interface ContextualCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostRes | null;
}

export function ContextualCommentsModal({
  isOpen,
  onClose,
  post,
}: ContextualCommentsModalProps) {
  const [commentToDelete, setCommentToDelete] = useState<CommentRes | null>(null);

  const postIdentifier = post ? post.publicId || post.id : null;
  const { data: comments = [], isLoading, isError, refetch } = useAdminPostComments(postIdentifier);

  const { mutate: hideComment, isPending: isHiding } = useAdminHideComment();
  const { mutate: restoreComment, isPending: isRestoring } = useAdminRestoreComment();
  const { mutate: deleteComment, isPending: isDeleting } = useAdminDeleteComment();

  const isBusy = isHiding || isRestoring || isDeleting;

  if (!post) return null;

  const authorName = getCommunityUserDisplayName(post.user);

  const handleDeleteConfirm = () => {
    if (commentToDelete) {
      deleteComment(commentToDelete.id, {
        onSettled: () => setCommentToDelete(null),
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col rounded-3xl p-6 sm:p-8 bg-card border-border shadow-2xl">
          <DialogHeader className="space-y-2 pb-4 border-b border-border/80 shrink-0">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
              <MessageSquare className="size-4" /> Bình luận bài viết
            </div>
            <DialogTitle className="text-base sm:text-lg font-bold text-foreground line-clamp-1">
              {post.title || post.content.slice(0, 80) || 'Bài viết'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Đăng bởi <strong className="text-foreground">{authorName}</strong> (@{post.user?.username || 'member'})
            </p>
          </DialogHeader>

          {/* Comments List Container */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar pr-1">
            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="size-7 animate-spin text-primary" />
                <span className="text-xs uppercase tracking-widest font-semibold">Đang tải bình luận...</span>
              </div>
            ) : isError ? (
              <div className="p-8 text-center bg-destructive/5 text-destructive rounded-2xl border border-destructive/20 space-y-2">
                <AlertCircle className="size-6 mx-auto text-destructive" />
                <p className="text-xs font-semibold">Không thể tải bình luận của bài viết này.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="rounded-full text-xs"
                >
                  Thử lại
                </Button>
              </div>
            ) : comments.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground space-y-1">
                <p className="text-sm font-semibold text-foreground">Chưa có bình luận nào</p>
                <p className="text-xs text-muted-foreground">Bài viết này hiện chưa có thảo luận nào.</p>
              </div>
            ) : (
              comments.map((comment) => {
                const commentUser = getCommunityUserDisplayName(comment.user);
                const avatarUrl = getCommunityUserAvatar(comment.user);
                const isDeleted = comment.isDeleted;

                return (
                  <div
                    key={comment.id}
                    className={cn(
                      'flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border/70 transition-all',
                      isDeleted && 'opacity-60 bg-muted/10'
                    )}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="relative size-8 rounded-full overflow-hidden bg-muted border border-border shrink-0 mt-0.5">
                        <Image
                          src={avatarUrl}
                          alt={commentUser}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-foreground truncate">{commentUser}</span>
                          <span className="text-[10px] text-muted-foreground">@{comment.user?.username || 'user'}</span>
                          {isDeleted && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-muted text-muted-foreground">
                              Đã ẩn/xóa
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
                          {comment.content || <span className="italic text-muted-foreground">[Đã xóa]</span>}
                        </p>

                        <span className="text-[10px] text-muted-foreground block">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleString('vi-VN', {
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

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0 self-center">
                      {!isDeleted ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={isBusy}
                          onClick={() => hideComment(comment.id)}
                          className="rounded-full size-8 p-0 text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10"
                          title="Ẩn bình luận"
                        >
                          <EyeOff className="size-3.5" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={isBusy}
                          onClick={() => restoreComment(comment.id)}
                          className="rounded-full size-8 p-0 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10"
                          title="Khôi phục"
                        >
                          <RefreshCcw className="size-3.5" />
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => setCommentToDelete(comment)}
                        className="rounded-full size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Xóa bình luận"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-3 border-t border-border flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!commentToDelete} onOpenChange={(open) => !open && setCommentToDelete(null)}>
        <AlertDialogContent className="rounded-3xl max-w-md p-6 bg-card border-border">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-lg font-bold text-foreground">
              Xác nhận xóa bình luận?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Hành động này sẽ xóa vĩnh viễn bình luận này khỏi bài viết.
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
    </>
  );
}
