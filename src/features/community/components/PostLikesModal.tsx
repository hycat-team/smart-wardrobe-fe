'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePostLikes } from '../queries/community.queries';
import { getCommunityUserAvatar, getCommunityUserDisplayName, formatGenderLabel } from '../utils/community.utils';
import { Loader2, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PostLikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  postPublicId: string;
}

export const PostLikesModal: React.FC<PostLikesModalProps> = ({
  isOpen,
  onClose,
  postPublicId,
}) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePostLikes(postPublicId, page, isOpen);

  const users = data?.items || [];
  const metadata = data?.metadata;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background rounded-3xl border border-border shadow-xl">
        <DialogHeader className="px-6 py-4 border-b border-border flex items-center justify-between">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Heart className="w-4 h-4 fill-destructive text-destructive" />
            <span>Lượt thích ({metadata?.totalItems || users.length})</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 flex flex-col gap-2 max-h-[420px] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs">Đang tải danh sách...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-xs font-medium">
              Chưa có lượt thích nào cho bài viết này.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {users.map((user) => {
                const avatar = getCommunityUserAvatar(user);
                const displayName = getCommunityUserDisplayName(user);
                const gender = formatGenderLabel(user.gender);

                return (
                  <Link
                    key={user.userId || user.username}
                    href={`/users/${user.username}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2 rounded-2xl hover:bg-muted/60 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full relative overflow-hidden bg-muted ring-1 ring-border shrink-0">
                        <Image src={avatar} alt={user.username} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-foreground truncate group-hover:underline">
                            {displayName}
                          </span>
                          {gender && (
                            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                              {gender}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground truncate">
                          @{user.username}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination controls if totalPages > 1 */}
        {metadata && metadata.totalPages > 1 && (
          <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground bg-muted/20">
            <span>
              Trang {metadata.page} / {metadata.totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 w-8 p-0 rounded-full"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={page >= metadata.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 w-8 p-0 rounded-full"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
