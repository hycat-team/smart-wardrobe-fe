'use client';

import React from 'react';
import { CommunityList } from '@/features/community/components/CommunityList';
import { PostComposerModal } from '@/features/community/components/PostComposerModal';
import { useInfiniteCommunity } from '@/features/community/queries/community.queries';
import { PaginationResult } from '@/types/api';
import { PostRes } from '@/features/community/types';
import { CommunitySearch } from './CommunitySearch';

interface CommunityClientProps {
  initialData: PaginationResult<PostRes> | null;
}

export default function CommunityClient({ initialData }: CommunityClientProps) {
  const [feedType, setFeedType] = React.useState<'explore' | 'following'>('explore');
  const [feedSort, setFeedSort] = React.useState<'hot' | 'latest'>('hot');
  const [editingPost, setEditingPost] = React.useState<PostRes | null>(null);
  const [isComposerOpen, setIsComposerOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteCommunity({
    type: feedType,
    sort: feedSort,
  });

  const displayData = data || (initialData ? { pages: [initialData], pageParams: [1] } : undefined);
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="flex-1 bg-background text-foreground pb-20">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* ── SEARCH BAR ── */}
        <CommunitySearch
          query={searchQuery}
          onQueryChange={setSearchQuery}
        />

        {/* ── MAIN FEED ── */}
        {!isSearching && (
          <CommunityList
            data={displayData}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage || false}
            isFetchingNextPage={isFetchingNextPage}
            isLoading={isLoading && !initialData}
            feedType={feedType}
            onFeedTypeChange={setFeedType}
            feedSort={feedSort}
            onFeedSortChange={setFeedSort}
            onOpenComposer={() => {
              setEditingPost(null);
              setIsComposerOpen(true);
            }}
            onEditPost={(post) => {
              setEditingPost(post);
              setIsComposerOpen(true);
            }}
          />
        )}
      </div>

      <PostComposerModal
        isOpen={isComposerOpen}
        onClose={() => {
          setIsComposerOpen(false);
          setEditingPost(null);
        }}
        editingPost={editingPost}
      />
    </div>
  );
}
