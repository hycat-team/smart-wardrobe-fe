'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Users, Grid, Sparkles, Loader2, Shirt, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCommunitySearch } from '@/features/community/queries/search.queries';
import { useMyWardrobe } from '@/features/wardrobe/queries/wardrobe.queries';
import { getWardrobeItemName } from '@/features/wardrobe/utils';
import { PostCard } from '@/features/community/components/PostCard';
import { FollowButton } from '@/features/community/components/FollowButton';
import { getCommunityUserAvatar, getCommunityUserDisplayName, formatGenderLabel } from '@/features/community/utils/community.utils';
import Image from 'next/image';
import Link from 'next/link';

type TabType = 'all' | 'users' | 'posts' | 'wardrobe';

export function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get('q') || '';
  const initialType = (searchParams.get('type') as TabType) || 'all';
  const initialPostType = (searchParams.get('postType') as 'outfit' | 'media') || undefined;

  const [searchInput, setSearchInput] = useState(query);
  const [activeTab, setActiveTab] = useState<TabType>(initialType);
  const [postTypeFilter, setPostTypeFilter] = useState<'outfit' | 'media' | undefined>(initialPostType);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const updateUrl = (newQuery: string, newTab: TabType, newPostType?: 'outfit' | 'media', newPage: number = 1) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newTab !== 'all') params.set('type', newTab);
    if (newPostType) params.set('postType', newPostType);
    if (newPage > 1) params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateUrl(searchInput.trim(), activeTab, postTypeFilter, 1);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
    updateUrl(query, tab, postTypeFilter, 1);
  };

  // Community Search
  const { data: searchData, isLoading: isCommunityLoading, isFetching } = useCommunitySearch({
    q: query,
    type: activeTab === 'wardrobe' ? 'all' : activeTab,
    postType: postTypeFilter,
    page,
    limit: 12,
  });

  // Local Wardrobe search
  const { data: myWardrobeData } = useMyWardrobe();
  const rawWardrobeItems = myWardrobeData ? myWardrobeData.items : [];
  const filteredWardrobeItems = query
    ? rawWardrobeItems.filter((item: any) => {
        const searchTokens = query.toLowerCase().split(/\s+/).filter(Boolean);
        const itemName = getWardrobeItemName(item).toLowerCase();
        const itemText = [
          itemName,
          (item.category?.name || '').toLowerCase(),
          ((item as any).name || '').toLowerCase(),
          (item.fashionItem?.color || item.color || '').toLowerCase(),
          (item.fashionItem?.material || item.material || '').toLowerCase(),
          (item.fashionItem?.style || item.style || '').toLowerCase(),
          (item.brand || '').toLowerCase(),
        ].join(' ');
        return searchTokens.every((token) => itemText.includes(token));
      })
    : [];

  const users = searchData?.users?.items || [];
  const usersMeta = searchData?.users?.metadata;
  const posts = searchData?.posts?.items || [];
  const postsMeta = searchData?.posts?.metadata;

  const totalResults =
    (usersMeta?.totalItems || 0) + (postsMeta?.totalItems || 0) + filteredWardrobeItems.length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 font-sans px-4 sm:px-6">
      {/* Search Header */}
      <div className="space-y-4 pt-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Khám phá & Tìm kiếm
        </h1>
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm người dùng, trang phục, bài viết hoặc tủ đồ..."
            className="w-full h-14 pl-12 pr-32 rounded-2xl bg-muted/60 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none"
          />
          <Button
            type="submit"
            className="absolute right-2 top-2 h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 text-xs font-bold uppercase tracking-wider"
          >
            Tìm kiếm
          </Button>
        </form>
      </div>

      {query && (
        <div className="space-y-6">
          {/* Tabs Control */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-2 gap-4">
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
                {
                  label: `Tủ đồ (${filteredWardrobeItems.length})`,
                  value: 'wardrobe' as TabType,
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

            <p className="text-xs text-muted-foreground font-medium">
              Tìm thấy kết quả cho &quot;{query}&quot;
            </p>
          </div>

          {/* Optional Post Type Filter when in Posts tab */}
          {activeTab === 'posts' && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground font-medium">Lọc loại bài:</span>
              <button
                onClick={() => {
                  setPostTypeFilter(undefined);
                  updateUrl(query, activeTab, undefined, 1);
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
                  updateUrl(query, activeTab, 'outfit', 1);
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
                  updateUrl(query, activeTab, 'media', 1);
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

          {/* Loading State */}
          {isCommunityLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm">Đang tìm kiếm thông tin...</span>
            </div>
          ) : (
            <div className="space-y-12">
              {/* 1. USERS SECTION */}
              {(activeTab === 'all' || activeTab === 'users') && users.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Users className="size-4 text-primary" />
                      <span>Mọi người</span>
                      {usersMeta && <span className="text-muted-foreground font-normal">({usersMeta.totalItems})</span>}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

              {/* 2. COMMUNITY POSTS SECTION */}
              {(activeTab === 'all' || activeTab === 'posts') && posts.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" />
                      <span>Bài viết phong cách</span>
                      {postsMeta && <span className="text-muted-foreground font-normal">({postsMeta.totalItems})</span>}
                    </h2>
                  </div>

                  <div className="flex flex-col gap-8 max-w-[550px] mx-auto">
                    {posts.map((post) => (
                      <PostCard key={post.id || post.publicId} post={post} />
                    ))}
                  </div>

                  {postsMeta && postsMeta.totalPages > 1 && activeTab === 'posts' && (
                    <div className="mt-8 flex items-center justify-center gap-4 text-xs">
                      <button
                        onClick={() => {
                          const prev = Math.max(1, page - 1);
                          setPage(prev);
                          updateUrl(query, activeTab, postTypeFilter, prev);
                        }}
                        disabled={page <= 1 || isFetching}
                        className="px-4 py-2 rounded-full border border-border font-semibold text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                      >
                        Trang trước
                      </button>
                      <span className="text-muted-foreground font-medium">
                        Trang {postsMeta.page} / {postsMeta.totalPages}
                      </span>
                      <button
                        onClick={() => {
                          const next = Math.min(postsMeta.totalPages, page + 1);
                          setPage(next);
                          updateUrl(query, activeTab, postTypeFilter, next);
                        }}
                        disabled={page >= postsMeta.totalPages || isFetching}
                        className="px-4 py-2 rounded-full border border-border font-semibold text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                      >
                        Trang sau
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 3. WARDROBE ITEMS SECTION */}
              {(activeTab === 'all' || activeTab === 'wardrobe') && filteredWardrobeItems.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Shirt className="size-4 text-primary" />
                    <span>Tủ đồ cá nhân ({filteredWardrobeItems.length})</span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredWardrobeItems.map((item: any) => {
                      const name = item.name || getWardrobeItemName(item);
                      const img = item.fashionItem?.imageUrl || item.imageUrl;

                      return (
                        <div
                          key={item.id}
                          onClick={() => router.push(`/wardrobe/item/${item.id}`)}
                          className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-sm"
                        >
                          <div className="aspect-[4/5] bg-muted/40 overflow-hidden relative">
                            {img ? (
                              <Image
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                src={img}
                                alt={name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                Không có ảnh
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h4 className="font-semibold text-sm text-foreground truncate">{name}</h4>
                            <div className="text-[11px] text-muted-foreground mt-1">
                              {item.category?.name || 'Trang phục'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty State when no results in any section */}
              {users.length === 0 && posts.length === 0 && filteredWardrobeItems.length === 0 && (
                <div className="text-center py-16 space-y-3 bg-muted/20 rounded-2xl border border-dashed border-border max-w-md mx-auto">
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    <Search className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">Không tìm thấy kết quả</h3>
                    <p className="text-xs text-muted-foreground">
                      Không có người dùng, bài viết hoặc món đồ nào khớp với &quot;{query}&quot;.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty State before search */}
      {!query && (
        <div className="text-center py-20 max-w-md mx-auto space-y-4">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Search className="size-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">Bắt đầu khám phá</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nhập từ khóa ở ô phía trên để tìm kiếm thành viên, phong cách bài đăng hoặc tra cứu nhanh trong tủ đồ của bạn.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
