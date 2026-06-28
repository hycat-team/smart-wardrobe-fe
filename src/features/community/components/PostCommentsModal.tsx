import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePostComments, useAddComment, useDeleteComment } from '../queries/community.queries';
import { useProfile } from '@/features/profile/queries/profile.queries';
import { Loader2, X, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PostRes } from '../types';
import { CommentItem } from './CommentItem';
import Image from 'next/image';
import { getUserAvatar } from '@/lib/utils';

interface PostCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostRes;
}

export const PostCommentsModal = ({ isOpen, onClose, post }: PostCommentsModalProps) => {
  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; username: string } | null>(null);
  const { data: comments, isLoading } = usePostComments(post.publicId, isOpen);
  const { mutate: addComment, isPending } = useAddComment();
  const { mutate: deleteComment, isPending: isDeletingComment } = useDeleteComment();
  const { data: profile } = useProfile();

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    addComment(
      { postPublicID: post.publicId, content: commentContent, parentCommentId: replyingTo?.commentId },
      {
        onSuccess: () => {
          setCommentContent('');
          setReplyingTo(null);
        },
      }
    );
  };

  const handleReply = (commentId: string, username: string) => {
    setReplyingTo({ commentId, username });
  };

  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`;
    if (firstName) return firstName[0];
    if (username) return username[0].toUpperCase();
    return 'U';
  };

  const hasMedia = post.media && post.media.length > 0;
  const mediaUrl = hasMedia ? post.media[0].mediaUrl : null;
  const isPostOwner = profile?.id === post.userId || profile?.username === post.username;
  const postDisplayAvatar = isPostOwner && profile ? getUserAvatar(profile) : (post.avatarUrl || '/images-male.png');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent aria-describedby={undefined} className="w-[95vw] sm:max-w-[1200px] md:w-[85vw] bg-background border border-border text-foreground rounded-3xl p-0 overflow-hidden flex flex-col md:flex-row h-[80vh] shadow-xl [&>button]:hidden">
        <DialogTitle className="sr-only">Chi tiết bài viết và bình luận</DialogTitle>
        {/* Left Side: Post Image */}
        <div className="hidden md:block w-[60%] h-full bg-muted relative border-r border-border">
          {mediaUrl ? (
            <Image fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={mediaUrl}
              alt="Post"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-12 bg-muted text-foreground">
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-3xl">{post.title}</h2>
                <p className="text-muted-foreground">{post.content}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Comments & Input */}
        <div className="w-full md:w-[40%] flex flex-col h-full bg-background relative">

          {/* Header (Author & Close) */}
          <div className="p-6 border-b border-border flex flex-col gap-4 bg-muted/20">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Image
                  src={postDisplayAvatar}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-border shrink-0"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-foreground">{post.username || 'Atelier Curators'}</span>
                  <span className="text-xs text-muted-foreground font-medium">Editorial Team</span>

                </div>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Post Caption as first comment */}
            <div className="text-sm text-foreground leading-relaxed">
              {post.title && <span className="font-bold mr-1">{post.title}.</span>}
              {post.content}
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : comments && comments.length > 0 ? (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  postPublicID={post.publicId}
                  onReply={handleReply}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
                <p className="text-sm">No comments yet.</p>
              </div>
            )}
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t border-border bg-background mt-auto flex flex-col gap-2">
            {replyingTo && (
              <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground px-2 py-1 bg-muted rounded-full">
                <span>Replying to <span className="font-bold text-foreground">@{replyingTo.username}</span></span>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="hover:text-foreground p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent border-none text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                type="submit"
                disabled={!commentContent.trim() || isPending}
                className="text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary disabled:opacity-30 disabled:hover:text-foreground transition-colors px-2 py-1"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
              </button>
            </form>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};
