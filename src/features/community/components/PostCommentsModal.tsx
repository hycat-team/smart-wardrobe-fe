import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePostComments, useAddComment, useDeleteComment } from '../queries/community.queries';
import { useProfile } from '@/features/profile/queries/profile.queries';
import { Loader2, X, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PostRes } from '../types';

interface PostCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostRes;
}

export const PostCommentsModal = ({ isOpen, onClose, post }: PostCommentsModalProps) => {
  const [commentContent, setCommentContent] = useState('');
  const { data: comments, isLoading } = usePostComments(post.publicId);
  const { mutate: addComment, isPending } = useAddComment();
  const { mutate: deleteComment, isPending: isDeletingComment } = useDeleteComment();
  const { data: profile } = useProfile();

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    addComment(
      { postPublicID: post.publicId, content: commentContent },
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

  const hasMedia = post.media && post.media.length > 0;
  const mediaUrl = hasMedia ? post.media[0].mediaUrl : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-[1000px] md:w-[85vw] bg-white border border-[#E5E5E5] text-[#1A1A1A] rounded-none p-0 overflow-hidden flex flex-col md:flex-row h-[80vh] shadow-xl [&>button]:hidden">
        
        {/* Left Side: Post Image */}
        <div className="hidden md:block w-[60%] h-full bg-[#F5F2EE] relative border-r border-[#E5E5E5]">
          {mediaUrl ? (
            <img 
              src={mediaUrl} 
              alt="Post" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-12 bg-black text-white">
               <div className="flex flex-col gap-4">
                 <h2 className="font-bold text-3xl">{post.title}</h2>
                 <p className="text-white/70">{post.content}</p>
               </div>
            </div>
          )}
        </div>

        {/* Right Side: Comments & Input */}
        <div className="w-full md:w-[40%] flex flex-col h-full bg-white relative">
          
          {/* Header (Author & Close) */}
          <div className="p-6 border-b border-[#E5E5E5] flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 ring-1 ring-black/5">
                  <AvatarImage src={post.avatarUrl || ''} />
                  <AvatarFallback className="bg-[#F5F2EE] text-[#1A1A1A] font-bold text-xs">
                    {getInitials(post.firstName, post.lastName, post.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[#1A1A1A]">{post.username || 'Atelier Curators'}</span>
                  <span className="text-xs text-[#666666] font-medium">Editorial Team</span>
                </div>
              </div>
              <button onClick={onClose} className="text-[#A3A3A3] hover:text-[#1A1A1A] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Post Caption as first comment */}
            <div className="text-sm text-[#1A1A1A] leading-relaxed">
              {post.title && <span className="font-bold mr-1">{post.title}.</span>}
              {post.content}
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-[#A3A3A3]" />
              </div>
            ) : comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                  <Avatar className="w-8 h-8 rounded-md ring-1 ring-black/5">
                    <AvatarImage src={comment.avatarUrl || ''} className="rounded-md" />
                    <AvatarFallback className="rounded-md text-[10px] bg-[#F5F2EE] text-[#1A1A1A] font-bold">
                      {getInitials(comment.firstName, comment.lastName, comment.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex justify-between items-start">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-bold text-xs text-[#1A1A1A]">
                        @{comment.username}
                      </p>
                      <p className="text-[13px] text-[#666666] leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                    {profile?.username === comment.username && (
                      <button
                        onClick={() => deleteComment({ postPublicID: post.publicId, commentID: comment.id })}
                        disabled={isDeletingComment}
                        className="opacity-0 group-hover:opacity-100 text-[#A3A3A3] hover:text-red-500 transition-all p-1"
                        title="Delete comment"
                      >
                        {isDeletingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#A3A3A3] space-y-2">
                <p className="text-sm">No comments yet.</p>
              </div>
            )}
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t border-[#E5E5E5] bg-white mt-auto">
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent border-none text-[13px] text-[#1A1A1A] placeholder:text-[#A3A3A3] outline-none"
              />
              <button
                type="submit"
                disabled={!commentContent.trim() || isPending}
                className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-black disabled:opacity-30 disabled:hover:text-[#1A1A1A] transition-colors px-2 py-1"
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
