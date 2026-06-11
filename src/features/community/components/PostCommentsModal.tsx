import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePostComments, useAddComment } from '../queries/community.queries';
import { Send, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PostCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postPublicID: string;
}

export const PostCommentsModal = ({ isOpen, onClose, postPublicID }: PostCommentsModalProps) => {
  const [commentContent, setCommentContent] = useState('');
  const { data: comments, isLoading } = usePostComments(postPublicID);
  const { mutate: addComment, isPending } = useAddComment();

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    addComment(
      { postPublicID, content: commentContent },
      {
        onSuccess: () => {
          setCommentContent('');
        },
      }
    );
  };

  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`;
    if (firstName) return firstName[0];
    if (username) return username[0].toUpperCase();
    return 'U';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background border-border/40 text-foreground rounded-3xl p-0 overflow-hidden flex flex-col max-h-[85vh]">
        <DialogHeader className="px-6 py-4 border-b border-border/40 bg-muted/10">
          <DialogTitle className="font-display-lg text-lg font-bold tracking-tight">Bình luận</DialogTitle>
        </DialogHeader>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="w-8 h-8 ring-1 ring-border/50">
                  <AvatarImage src={comment.avatarUrl || ''} />
                  <AvatarFallback className="text-[10px] bg-primary/5 text-primary font-medium">
                    {getInitials(comment.firstName, comment.lastName, comment.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted/30 px-4 py-3 rounded-2xl rounded-tl-sm border border-border/40">
                    <p className="font-semibold text-sm text-foreground mb-1">
                      {comment.firstName ? `${comment.firstName} ${comment.lastName || ''}` : comment.username}
                    </p>
                    <p className="text-[13px] text-foreground/80 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground px-2 mt-1 block">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
              <MessageCircleOff className="w-8 h-8 opacity-20" />
              <p className="text-sm">Chưa có bình luận nào.</p>
              <p className="text-xs opacity-70">Hãy là người đầu tiên chia sẻ cảm nghĩ!</p>
            </div>
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-border/40 bg-muted/10">
          <form onSubmit={handleAddComment} className="flex items-end gap-2 relative">
            <Input
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Thêm bình luận..."
              className="pr-12 bg-background border-border/60 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 rounded-full h-11 shadow-sm"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!commentContent.trim() || isPending}
              className="absolute right-1 bottom-1 w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 -ml-0.5" />}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Simple icon for empty state
function MessageCircleOff(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.5 14.9A9 9 0 0 0 9.1 3.5" />
      <path d="m2 2 20 20" />
      <path d="M5.6 5.6C3 7.9 2 11 3 14l-1 4 4-1c3 1 6.1 0 8.4-2.6" />
    </svg>
  );
}
