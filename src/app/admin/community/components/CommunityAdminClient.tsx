'use client';

import React, { useState } from 'react';
import { Search, Sparkles, MessageSquareText, RefreshCw, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CommunityKpiGrid } from './CommunityKpiGrid';
import { PostModerationTable } from './PostModerationTable';
import { CommentModerationTable } from './CommentModerationTable';
import { PostDetailPreviewModal } from './PostDetailPreviewModal';
import { ContextualCommentsModal } from './ContextualCommentsModal';
import {
  useAdminCommunityMetrics,
  useAdminHidePost,
  useAdminRestorePost,
  useAdminDeletePost,
} from '@/features/admin/queries/community-admin.queries';
import { PostRes } from '@/features/community/types';
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
import { getCommunityUserDisplayName } from '@/features/community/utils/community.utils';
import { Loader2 } from 'lucide-react';

export function CommunityAdminClient() {
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [postStatusFilter, setPostStatusFilter] = useState('all');

  // Modals state
  const [selectedPostPreview, setSelectedPostPreview] = useState<PostRes | null>(null);
  const [contextualCommentsPost, setContextualCommentsPost] = useState<PostRes | null>(null);
  const [postToDelete, setPostToDelete] = useState<PostRes | null>(null);

  // Queries & Mutations
  const { data: metrics, isLoading: isMetricsLoading, refetch: refetchMetrics } = useAdminCommunityMetrics();
  const { mutate: hidePost, isPending: isHiding } = useAdminHidePost();
  const { mutate: restorePost, isPending: isRestoring } = useAdminRestorePost();
  const { mutate: deletePost, isPending: isDeleting } = useAdminDeletePost();

  const handleFilterHiddenPosts = () => {
    setActiveTab('posts');
    setPostStatusFilter('hidden');
  };

  const handleDeletePostConfirm = () => {
    if (postToDelete) {
      deletePost(postToDelete.id || postToDelete.publicId, {
        onSettled: () => setPostToDelete(null),
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full pb-24 text-foreground px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-6 pt-4 border-b border-border/80 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
              <MessageSquareText className="size-4" /> Quản trị nội dung Closy
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Quản trị Cộng đồng & Kiểm duyệt
            </h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider leading-relaxed border-l-2 border-primary pl-3">
              Theo dõi sức khỏe thảo luận, kiểm duyệt bài đăng phong cách và duy trì tiêu chuẩn cộng đồng an toàn, văn minh.
            </p>
          </div>

          {/* Search bar & Refresh */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={
                  activeTab === 'posts'
                    ? 'Tìm bài viết, tác giả, hashtag...'
                    : 'Tìm bình luận, người gửi...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 w-full pl-10 pr-9 bg-card border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-medium transition-all outline-none rounded-full text-foreground placeholder:text-muted-foreground shadow-sm"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => refetchMetrics()}
              className="rounded-full size-11 shrink-0 border-border/80 hover:bg-muted"
              title="Làm mới số liệu"
            >
              <RefreshCw className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <CommunityKpiGrid
        totalPosts={metrics?.totalPosts}
        hiddenPosts={metrics?.hiddenPosts}
        totalComments={metrics?.totalComments}
        activeComments={metrics?.activeComments}
        isLoading={isMetricsLoading}
        onFilterHiddenPosts={handleFilterHiddenPosts}
      />

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as 'posts' | 'comments')}
        className="w-full space-y-6"
      >
        <TabsList className="rounded-full bg-muted/60 p-1 border border-border/60">
          <TabsTrigger
            value="posts"
            className="rounded-full px-6 py-2.5 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            BÀI ĐĂNG PHONG CÁCH
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="rounded-full px-6 py-2.5 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            BÌNH LUẬN TOÀN SÀN
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6 outline-none">
          <PostModerationTable
            searchTerm={searchTerm}
            statusFilter={postStatusFilter}
            onStatusFilterChange={setPostStatusFilter}
            onSelectPostPreview={(post) => setSelectedPostPreview(post)}
            onOpenContextualComments={(post) => setContextualCommentsPost(post)}
          />
        </TabsContent>

        <TabsContent value="comments" className="space-y-6 outline-none">
          <CommentModerationTable searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      <PostDetailPreviewModal
        isOpen={!!selectedPostPreview}
        onClose={() => setSelectedPostPreview(null)}
        post={selectedPostPreview}
        onHide={(id) => {
          hidePost(id);
          setSelectedPostPreview((prev) => (prev ? { ...prev, status: 'hidden' } : null));
        }}
        onRestore={(id) => {
          restorePost(id);
          setSelectedPostPreview((prev) => (prev ? { ...prev, status: 'published' } : null));
        }}
        onDeleteRequest={(post) => setPostToDelete(post)}
        onOpenComments={(post) => setContextualCommentsPost(post)}
        isActionPending={isHiding || isRestoring}
      />

      {/* Contextual Comments Modal */}
      <ContextualCommentsModal
        isOpen={!!contextualCommentsPost}
        onClose={() => setContextualCommentsPost(null)}
        post={contextualCommentsPost}
      />

      {/* Global Delete Alert Dialog for preview modal trigger */}
      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent className="rounded-3xl max-w-md p-6 bg-card border-border">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-lg font-bold text-foreground">
              Xác nhận xóa bài viết?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Hành động này sẽ xóa vĩnh viễn hoặc đánh dấu xóa bài viết của tác giả{' '}
              <strong className="text-foreground">
                {postToDelete ? getCommunityUserDisplayName(postToDelete.user) : ''}
              </strong>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-full text-xs font-semibold uppercase tracking-wider">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePostConfirm}
              className="rounded-full text-xs font-semibold uppercase tracking-wider bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="size-4 animate-spin" /> : 'Xóa bài viết'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
