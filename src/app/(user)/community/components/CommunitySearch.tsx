'use client';

import React, { useState } from 'react';
import { Search, Users, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCommunitySearch } from '@/features/community/queries/search.queries';
import { PostCard } from '@/features/community/components/PostCard';
import { FollowButton } from '@/features/community/components/FollowButton';
import {
  getCommunityUserAvatar,
  getCommunityUserDisplayName,
  formatGenderLabel,
} from '@/features/community/utils/community.utils';
import Image from 'next/image';
import Link from 'next/link';

type TabType = 'all' | 'users' | 'posts';

interface CommunitySearchProps {
  query: string;
  onQueryChange: (q: string) => void;
}

export function CommunitySearch({ query, onQueryChange }: CommunitySearchProps) {
  const [searchInput, setSearchInput] = useState(query);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [postTypeFilter, setPostTypeFilter] = useState<'outfit' | 'media' | undefined>(undefined);
  const [page, setPage] = useState(1);

  const trimmedQuery = query.trim();

  const { data: searchData, isLoading: isCommunityLoading, isFetching } = useCommunitySearch({
    q: trimmedQuery,
    type: activeTab,
    postType: postTypeFilter,
    page,
    limit: 12,
  });

  const users = searchData?.users?.items || [];
  const usersMeta = searchData?.users?.metadata;
  const posts = searchData?.posts?.items || [];
  const postsMeta = searchData?.posts?.metadata;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    onQueryChange(searchInput.trim());
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Tìm kiếm người dùng, bài viết phong cách..."
          className="w-full h-12 pl-12 pr-32 rounded-2xl bg-muted/60 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none"
        />
        <Button
          type="submit"
          className="absolute right-2 top-2 h-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-5 text-xs font-bold uppercase tracking-wider"
        >
          Tìm kiếm
        </Button>
      </form>

      {/* {!trimmedQuery && (
        <p className="text-xs text-muted-foreground px-1">
          Nhập từ khóa để tìm kiếm thành viên và bài viết trong cộng đồng.
        </p>
      )} */}

      {trimmedQuery && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-2 gap-4">
            <div className="flex overflow-x-auto gap-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { label: 'Tất cả', value: 'all' as TabType },
                {
                  label: `Người dùng ${usersMeta ? `(${usersMeta.totalItems})` : ''}`,
                  value: 'users' as TabType,
                },
                {
                  label: `Bài viết ${postsMeta ? `(${postsMeta.totalItems})` : ''}`,
                  value: 'posts' as TabType,
                },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={cn(
                    'pb-3 text-xs sm:text-sm font-semibold tracking-wide relative transition-all whitespace-nowrap',
                    activeTab === tab.value
                      ? 'text-foreground font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.label}
                  {activeTab === tab.value && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground font-medium shrink-0">
              Kết quả cho &quot;{trimmedQuery}&quot;
            </p>
          </div>

          {activeTab === 'posts' && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground font-medium">Lọc loại bài:</span>
              <button
                onClick={() => {
                  setPostTypeFilter(undefined);
                  setPage(1);
                }}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                  postTypeFilter === undefined
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
                )}
              >
                Tất cả
              </button>
              <button
                onClick={() => {
                  setPostTypeFilter('outfit');
                  setPage(1);
                }}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                  postTypeFilter === 'outfit'
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
                )}
              >
                Outfit
              </button>
              <button
                onClick={() => {
                  setPostTypeFilter('media');
                  setPage(1);
                }}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                  postTypeFilter === 'media'
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
                )}
              >
                Ảnh & Video
              </button>
            </div>
          )}

          {isCommunityLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm">Đang tìm kiếm...</span>
            </div>
          ) : (
            <div className="space-y-10">
              {(activeTab === 'all' || activeTab === 'users') && users.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Users className="size-4 text-primary" />
                    <span>Mọi người</span>
                    {usersMeta && (
                      <span className="text-muted-foreground font-normal">({usersMeta.totalItems})</span>
                    )}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {users.map((user) => {
                      const displayName = getCommunityUserDisplayName(user);
                      const avatar = getCommunityUserAvatar(user);
                      const gender = formatGenderLabel(user.gender);

                      return (
                        <div
                          key={user.userId || user.username}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border shadow-sm hover:border-border/80 transition-all gap-3"
                        >
                          <Link
                            href={`/users/${user.username}`}
                            className="flex items-center gap-3 min-w-0 flex-1 group"
                          >
                            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-border bg-muted shrink-0">
                              <Image
                                src={avatar}
                                alt={displayName}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-sm text-foreground truncate group-hover:underline">
                                {displayName}
                              </span>
                              <span className="text-xs text-muted-foreground truncate">
                                @{user.username} {gender ? `• ${gender}` : ''}
                              </span>
                            </div>
                          </Link>

                          <FollowButton
                            username={user.username}
                            userId={user.userId}
                            className="h-8 px-3.5 text-xs"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'posts') && posts.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <span>Bài viết phong cách</span>
                    {postsMeta && (
                      <span className="text-muted-foreground font-normal">({postsMeta.totalItems})</span>
                    )}
                  </h2>

                  <div className="flex flex-col gap-8 max-w-[550px] mx-auto">
                    {posts.map((post) => (
                      <PostCard key={post.id || post.publicId} post={post} />
                    ))}
                  </div>

                  {postsMeta && postsMeta.totalPages > 1 && activeTab === 'posts' && (
                    <div className="mt-8 flex items-center justify-center gap-4 text-xs">
                      <button
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page <= 1 || isFetching}
                        className="px-4 py-2 rounded-full border border-border font-semibold text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                      >
                        Trang trước
                      </button>
                      <span className="text-muted-foreground font-medium">
                        Trang {postsMeta.page} / {postsMeta.totalPages}
                      </span>
                      <button
                        onClick={() => setPage((prev) => Math.min(postsMeta.totalPages, prev + 1))}
                        disabled={page >= postsMeta.totalPages || isFetching}
                        className="px-4 py-2 rounded-full border border-border font-semibold text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                      >
                        Trang sau
                      </button>
                    </div>
                  )}
                </div>
              )}

              {users.length === 0 && posts.length === 0 && (
                <div className="text-center py-16 space-y-3 bg-muted/20 rounded-2xl border border-dashed border-border max-w-md mx-auto">
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    <Search className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">Không tìm thấy kết quả</h3>
                    <p className="text-xs text-muted-foreground">
                      Không có người dùng hoặc bài viết nào khớp với &quot;{trimmedQuery}&quot;.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}