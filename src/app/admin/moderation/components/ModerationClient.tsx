"use client";
import { useState } from "react";
import { Search, Loader2, Trash2, RefreshCcw, EyeOff, Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  useAdminPosts,
  useAdminPostItems,
  useDeletePost,
  useRestorePost,
  useHidePostItem,
  useDeletePostItem,
  usePostComments,
  useDeleteComment,
  useRestoreComment
} from "@/features/admin/queries/admin.queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ModerationClient() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full pb-24 text-[#111]">

      {/* High-end Editorial Header */}
      <div className="flex flex-col gap-8 pt-6 border-b border-black/10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-semibold font-medium text-[#111] leading-[1.1] uppercase">
              MODERATION
            </h1>
            <p className="text-[12px] text-[#666] font-semibold uppercase tracking-[0.1em] max-w-md leading-relaxed border-l-2 border-black/10 pl-4">
              Kiểm duyệt bài viết feed, bình luận và sản phẩm marketplace.
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 size-4 text-[#A3A3A3]" />
              <input
                type="text"
                placeholder="TÌM KIẾM NỘI DUNG..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full pl-8 pr-4 bg-transparent border-b border-black/10 focus:border-[#111] text-[11px] font-semibold uppercase tracking-widest transition-all outline-none rounded-none"
              />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-8 w-full justify-start border-b border-black/10 rounded-none bg-transparent h-auto p-0 gap-8">
          <TabsTrigger value="posts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#111] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-semibold text-[11px] uppercase tracking-widest text-[#A3A3A3] data-[state=active]:text-[#111]">
            FEED POSTS
          </TabsTrigger>
          <TabsTrigger value="listings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#111] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-semibold text-[11px] uppercase tracking-widest text-[#A3A3A3] data-[state=active]:text-[#111]">
            MARKETPLACE
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <PostsModerationList searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent value="listings">
          <ListingsModerationList searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PostsModerationList({ searchTerm }: { searchTerm: string }) {
  const [page, setPage] = useState(1);
  const [viewingCommentsPostId, setViewingCommentsPostId] = useState<string | null>(null);

  const { data, isLoading, isError } = useAdminPosts({ page, limit: 10, q: searchTerm });
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { mutate: restorePost, isPending: isRestoring } = useRestorePost();

  const posts = data?.items || [];
  const isBusy = isDeleting || isRestoring;

  return (
    <div className="space-y-0 border border-black/10 bg-white">
      {isLoading ? <LoadingState /> : isError ? <ErrorState /> : posts.length === 0 ? <EmptyState /> : (
        posts.map((post: any) => {
          const isDeleted = post.status === 'DELETED' || post.isDeleted;
          const imageUrl = post.mediaUrls?.[0] || post.imageUrl || post.media?.[0]?.mediaUrl || "https://placehold.co/200x200?text=No+Image";
          const authorName = post.author?.username || post.username || "Unknown";

          return (
            <div key={post.id || post.publicId} className={cn("p-6 border-b border-black/5 flex flex-col md:flex-row gap-6 hover:bg-[#F8F7F5] transition-colors", isDeleted && "opacity-60")}>
              <div className="flex gap-6 md:w-[40%] shrink-0">
                <div className="size-24 bg-black/5 relative shrink-0">
                  <img src={imageUrl} alt="Post content" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <h4 className="font-semibold font-medium text-xl text-[#111] line-clamp-2 leading-snug">{post.content || post.title || 'Không có nội dung'}</h4>
                  <p className="font-semibold text-[10px] uppercase tracking-widest text-[#666]">BY @{authorName}</p>
                </div>
              </div>

              <div className="hidden md:block w-px bg-black/10 my-2" />

              <div className="flex-1 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <div className="flex gap-4 font-semibold text-[10px] uppercase tracking-widest text-[#666]">
                    <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                    <span className={cn("font-medium", isDeleted ? "text-[#A3A3A3]" : "text-[#111]")}>{isDeleted ? 'DELETED' : 'ACTIVE'}</span>
                  </div>
                  <div className="flex items-center gap-6 text-[#111] font-semibold text-[11px]">
                    <span className="flex items-center gap-1.5"><Heart className="size-3" strokeWidth={1.5} /> {post.likeCount || 0}</span>
                    <span className="flex items-center gap-1.5"><MessageSquare className="size-3" strokeWidth={1.5} /> {post.commentCount || 0}</span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-end gap-3 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-black/10">
                  <Button variant="outline" onClick={() => setViewingCommentsPostId(post.publicId || post.id)} className="rounded-none border-black/10 font-semibold text-[10px] uppercase tracking-widest hover:bg-black/5 h-8">
                    COMMENTS
                  </Button>
                  {isDeleted ? (
                    <Button disabled={isBusy} onClick={() => restorePost(post.publicId || post.id)} variant="outline" className="rounded-none border-[#111] text-[#111] font-semibold text-[10px] uppercase tracking-widest hover:bg-[#111] hover:text-white h-8">
                      RESTORE
                    </Button>
                  ) : (
                    <Button disabled={isBusy} onClick={() => deletePost(post.publicId || post.id)} variant="outline" className="rounded-none border-black/10 text-red-600 font-semibold text-[10px] uppercase tracking-widest hover:bg-red-50 hover:border-red-600 h-8">
                      DELETE
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
      <PaginationControls page={page} setPage={setPage} totalPages={data?.metadata?.totalPages} />

      <Dialog open={!!viewingCommentsPostId} onOpenChange={(open) => !open && setViewingCommentsPostId(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto rounded-none border border-black/10 bg-white p-8">
          <DialogHeader className="border-b border-black/10 pb-4 mb-6">
            <DialogTitle className="font-semibold text-3xl font-medium text-[#111]">Comments</DialogTitle>
          </DialogHeader>
          <CommentsList postId={viewingCommentsPostId} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CommentsList({ postId }: { postId: string | null }) {
  const { data: comments, isLoading, isError } = usePostComments(postId);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();
  const { mutate: restoreComment, isPending: isRestoring } = useRestoreComment();

  if (!postId) return null;
  if (isLoading) return <div className="py-8 text-center"><Loader2 className="animate-spin size-5 mx-auto text-[#A3A3A3]" /></div>;
  if (isError) return <div className="py-8 text-center text-[#111] font-semibold text-[11px] uppercase tracking-widest">Lỗi khi tải bình luận.</div>;
  if (!comments || comments.length === 0) return <div className="py-8 text-center text-[#A3A3A3] font-semibold text-[11px] uppercase tracking-widest border border-black/10">Không có bình luận.</div>;

  return (
    <div className="space-y-0 border border-black/10">
      {comments.map((comment: any, index: number) => {
        const isDeleted = comment.isDeleted || comment.status === 'DELETED';
        return (
          <div key={comment.id} className={cn("p-6 flex gap-4 bg-white", index !== comments.length - 1 && "border-b border-black/10", isDeleted && "opacity-60")}>
            <div className="size-8 bg-black/5 shrink-0 flex items-center justify-center font-semibold text-lg text-[#111]">
              {comment.avatarUrl ? <img src={comment.avatarUrl} alt={comment.username} className="w-full h-full object-cover" /> : comment.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div className="font-semibold text-[10px] uppercase tracking-widest">
                  <span className="font-medium text-[#111] mr-2">@{comment.username}</span>
                  <span className="text-[#A3A3A3]">{new Date(comment.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                {isDeleted ? (
                  <button onClick={() => restoreComment(comment.id)} disabled={isRestoring} className="font-semibold text-[10px] uppercase tracking-widest text-[#111] hover:underline underline-offset-4">RESTORE</button>
                ) : (
                  <button onClick={() => deleteComment(comment.id)} disabled={isDeleting} className="font-semibold text-[10px] uppercase tracking-widest text-red-600 hover:underline underline-offset-4">DELETE</button>
                )}
              </div>
              <p className="text-sm font-semibold text-[#111] leading-relaxed">{comment.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ListingsModerationList({ searchTerm }: { searchTerm: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAdminPostItems({ page, limit: 10, q: searchTerm });
  const { mutate: hideItem, isPending: isHiding } = useHidePostItem();
  const { mutate: deleteItem, isPending: isDeleting } = useDeletePostItem();

  const items = data?.items || [];
  const isBusy = isHiding || isDeleting;

  return (
    <div className="space-y-0 border border-black/10 bg-white">
      {isLoading ? <LoadingState /> : isError ? <ErrorState /> : items.length === 0 ? <EmptyState /> : (
        items.map((item: any) => {
          const isHidden = item.status === 'HIDDEN' || item.isHidden;
          const imageUrl = item.imageUrl || item.images?.[0] || "https://placehold.co/200x200?text=No+Image";
          const sellerName = item.seller?.username || "Unknown";

          return (
            <div key={item.id} className={cn("p-6 border-b border-black/5 flex flex-col md:flex-row gap-6 hover:bg-[#F8F7F5] transition-colors", isHidden && "opacity-60")}>
              <div className="flex gap-6 md:w-[40%] shrink-0">
                <div className="size-24 bg-black/5 relative shrink-0">
                  <img src={imageUrl} alt="Item content" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <h4 className="font-semibold font-medium text-xl text-[#111] line-clamp-2 leading-snug">{item.name || item.title || 'Sản phẩm không có tên'}</h4>
                  <p className="font-semibold text-[10px] uppercase tracking-widest text-[#666]">SELLER @{sellerName}</p>
                </div>
              </div>

              <div className="hidden md:block w-px bg-black/10 my-2" />

              <div className="flex-1 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <p className="font-semibold text-lg font-medium text-[#111]">{item.price ? `${item.price.toLocaleString('vi-VN')} VNĐ` : 'THỎA THUẬN'}</p>
                  <p className={cn("font-semibold text-[10px] uppercase tracking-widest", isHidden ? "text-[#A3A3A3]" : "text-[#111]")}>{isHidden ? 'HIDDEN' : 'VISIBLE'}</p>
                </div>

                <div className="flex flex-row md:flex-col justify-end gap-3 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-black/10">
                  {!isHidden && (
                    <Button disabled={isBusy} onClick={() => hideItem(item.id)} variant="outline" className="rounded-none border-black/10 text-[#666] font-semibold text-[10px] uppercase tracking-widest hover:bg-black/5 h-8">
                      HIDE ITEM
                    </Button>
                  )}
                  <Button disabled={isBusy} onClick={() => deleteItem(item.id)} variant="outline" className="rounded-none border-black/10 text-red-600 font-semibold text-[10px] uppercase tracking-widest hover:bg-red-50 hover:border-red-600 h-8">
                    DELETE
                  </Button>
                </div>
              </div>
            </div>
          );
        })
      )}
      <PaginationControls page={page} setPage={setPage} totalPages={data?.metadata?.totalPages} />
    </div>
  );
}

function LoadingState() {
  return <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-[#A3A3A3] size-6" /></div>;
}

function ErrorState() {
  return <div className="py-24 text-center text-[#111] font-semibold text-[11px] uppercase tracking-widest">Lỗi khi tải dữ liệu</div>;
}

function EmptyState() {
  return <div className="py-24 text-center text-[#A3A3A3] font-semibold text-[11px] uppercase tracking-widest">Không có dữ liệu phù hợp.</div>;
}

function PaginationControls({ page, setPage, totalPages }: { page: number, setPage: (p: number | ((prev: number) => number)) => void, totalPages?: number }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="flex justify-between items-center p-6 border-t border-black/10 bg-white">
      <span className="font-semibold text-[10px] text-[#666] uppercase tracking-widest">
        TRANG {page} / {totalPages}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="rounded-none border-black/10 font-semibold text-[10px] uppercase tracking-widest text-[#111] hover:bg-black/5" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>TRƯỚC</Button>
        <Button variant="outline" size="sm" className="rounded-none border-black/10 font-semibold text-[10px] uppercase tracking-widest text-[#111] hover:bg-black/5" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>SAU</Button>
      </div>
    </div>
  );
}
