'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Users } from 'lucide-react';
import { useUserFollows } from '../queries/user-social.queries';
import { FollowButton } from './FollowButton';
import { getCommunityUserAvatar, getCommunityUserDisplayName } from '../utils/community.utils';
import Image from 'next/image';
import Link from 'next/link';

interface UserFollowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  initialTab?: 'followers' | 'following';
}

export const UserFollowsModal: React.FC<UserFollowsModalProps> = ({
  isOpen,
  onClose,
  username,
  initialTab = 'followers',
}) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Sync initial tab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSearchQuery('');
      setPage(1);
    }
  }, [isOpen, initialTab]);

  const { data, isLoading, isFetching } = useUserFollows(
    username,
    {
      type: activeTab,
      q: searchQuery.trim() || undefined,
      page,
      limit: 20,
    },
    isOpen
  );

  const items = data?.items || [];
  const metadata = data?.metadata;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-background border-border text-foreground">
        <DialogHeader className="p-4 pb-2 border-b border-border">
          <DialogTitle className="text-center font-bold text-base">
            @{username}
          </DialogTitle>

          {/* Tabs */}
          <div className="flex border-b border-border mt-3">
            <button
              onClick={() => {
                setActiveTab('followers');
                setPage(1);
              }}
              className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'followers'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Người theo dõi
            </button>
            <button
              onClick={() => {
                setActiveTab('following');
                setPage(1);
              }}
              className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'following'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Đang theo dõi
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={`Tìm trong ${activeTab === 'followers' ? 'người theo dõi' : 'đang theo dõi'}...`}
              className="pl-9 h-9 text-xs bg-muted/50 border-border rounded-full focus-visible:ring-1"
            />
          </div>
        </DialogHeader>

        {/* Content List */}
        <div className="max-h-[380px] min-h-[220px] overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs">Đang tải danh sách...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground gap-2">
              <Users className="w-8 h-8 opacity-40" />
              <p className="text-sm font-medium">
                {searchQuery
                  ? `Không tìm thấy kết quả phù hợp với "${searchQuery}"`
                  : activeTab === 'followers'
                  ? 'Chưa có người theo dõi nào'
                  : 'Chưa theo dõi người dùng nào'}
              </p>
            </div>
          ) : (
            items.map((item) => {
              const user = item.user;
              const displayName = getCommunityUserDisplayName(user);
              const avatar = getCommunityUserAvatar(user);
              const isFollowing = item.relation === 'following';
              const targetUsername = user?.username || '';

              return (
                <div
                  key={user?.userId || targetUsername}
                  className="flex items-center justify-between gap-3 p-1 rounded-xl hover:bg-muted/40 transition-colors"
                >
                  <Link
                    href={`/users/${targetUsername}`}
                    onClick={onClose}
                    className="flex items-center gap-3 min-w-0 flex-1 group"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-border bg-muted shrink-0">
                      <Image
                        src={avatar}
                        alt={displayName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-xs text-foreground group-hover:underline truncate">
                        {displayName}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate">
                        @{targetUsername}
                      </span>
                    </div>
                  </Link>

                  <FollowButton
                    username={targetUsername}
                    isFollowing={isFollowing}
                    userId={user?.userId}
                    className="h-7 px-3 text-[11px]"
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Pagination footer if multi-page */}
        {metadata && metadata.totalPages > 1 && (
          <div className="p-3 border-t border-border flex items-center justify-between bg-muted/20 text-xs">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
              className="px-3 py-1 font-semibold text-foreground hover:bg-muted rounded-md disabled:opacity-40 transition-colors"
            >
              Trang trước
            </button>
            <span className="text-muted-foreground font-medium">
              Trang {metadata.page} / {metadata.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(metadata.totalPages, p + 1))}
              disabled={page >= metadata.totalPages || isFetching}
              className="px-3 py-1 font-semibold text-foreground hover:bg-muted rounded-md disabled:opacity-40 transition-colors"
            >
              Trang sau
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
