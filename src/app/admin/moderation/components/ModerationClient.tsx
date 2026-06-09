"use client";
import { useState } from "react";
import { Search, Loader2, ExternalLink, Trash2, ShieldAlert, CheckCircle2, RefreshCcw, EyeOff } from "lucide-react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";

export function ModerationClient() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground flex items-center gap-2">
            Quản Lý Cộng Đồng
          </h1>
          <p className="text-sm text-muted-foreground">Kiểm duyệt bài viết Feed, bình luận và các sản phẩm đăng bán Marketplace.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Tìm kiếm nội dung..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full pl-9 pr-4 rounded-xl bg-secondary border-transparent focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all outline-none text-foreground"
          />
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="posts">Bài viết Feed</TabsTrigger>
          <TabsTrigger value="listings">Sản phẩm Marketplace</TabsTrigger>
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
    <div className="space-y-4">
      {isLoading ? <LoadingState /> : isError ? <ErrorState /> : posts.length === 0 ? <EmptyState /> : (
        posts.map((post: any) => {
          const isDeleted = post.status === 'DELETED' || post.isDeleted;
          const imageUrl = post.mediaUrls?.[0] || post.imageUrl || post.media?.[0]?.mediaUrl || "https://placehold.co/200x200?text=No+Image";
          const authorName = post.author?.username || post.username || "Unknown";

          return (
            <div key={post.id || post.publicId} className={cn("bg-card border rounded-xl p-4 md:p-6 transition-all duration-300 flex flex-col md:flex-row gap-6", isDeleted ? "opacity-60 bg-muted/20" : "")}>
              <div className="flex gap-4 md:w-1/3 shrink-0">
                <div className="size-20 md:size-24 rounded-lg overflow-hidden bg-muted relative shrink-0">
                  <img src={imageUrl} alt="Post content" className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                    FEED
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-medium text-sm md:text-base text-foreground line-clamp-2">{post.content || post.title || 'Bài viết không có nội dung'}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Bởi <span className="font-medium text-foreground">@{authorName}</span></p>
                </div>
              </div>

              <div className="hidden md:block w-px bg-border my-2" />

              <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2 flex-1 flex flex-col justify-center">
                  <p className="text-sm">Trạng thái: <span className={cn("font-bold", isDeleted ? "text-red-500" : "text-green-500")}>{isDeleted ? 'Đã Xóa' : 'Hoạt động'}</span></p>
                  {post.createdAt && <p className="text-xs text-muted-foreground">Tạo lúc: {new Date(post.createdAt).toLocaleString('vi-VN')}</p>}
                </div>

                <div className="flex flex-row justify-end gap-2 shrink-0 items-center border-t md:border-t-0 pt-4 md:pt-0 border-border">
                  <Button variant="outline" onClick={() => setViewingCommentsPostId(post.publicId || post.id)} className="border-border text-foreground hover:bg-secondary">
                    <MessageSquare className="size-4 mr-2" /> Xem bình luận
                  </Button>
                  {isDeleted ? (
                    <Button disabled={isBusy} onClick={() => restorePost(post.publicId || post.id)} variant="outline" className="border-green-500/30 text-green-500 hover:bg-green-500/10">
                      <RefreshCcw className="size-4 mr-2" /> Khôi phục
                    </Button>
                  ) : (
                    <Button disabled={isBusy} onClick={() => deletePost(post.publicId || post.id)} variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10">
                      <Trash2 className="size-4 mr-2" /> Xóa bài viết
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
      <PaginationControls page={page} setPage={setPage} totalPages={data?.metadata?.totalPages} />
      
      {/* Comments Dialog */}
      <Dialog open={!!viewingCommentsPostId} onOpenChange={(open) => !open && setViewingCommentsPostId(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bình luận bài viết</DialogTitle>
            <DialogDescription>Quản lý các bình luận của bài viết này.</DialogDescription>
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
  if (isLoading) return <div className="py-8 text-center text-muted-foreground"><Loader2 className="animate-spin size-5 mx-auto" /></div>;
  if (isError) return <div className="py-8 text-center text-red-500">Lỗi khi tải bình luận.</div>;
  if (!comments || comments.length === 0) return <div className="py-8 text-center text-muted-foreground border border-dashed rounded-xl">Chưa có bình luận nào.</div>;

  return (
    <div className="space-y-4 mt-4">
      {comments.map((comment: any) => {
        const isDeleted = comment.isDeleted || comment.status === 'DELETED';
        return (
          <div key={comment.id} className={cn("p-4 border rounded-xl flex gap-3", isDeleted && "bg-red-500/5 border-red-500/20 opacity-70")}>
            <div className="size-8 rounded-full bg-secondary overflow-hidden shrink-0">
              {comment.avatarUrl ? <img src={comment.avatarUrl} alt={comment.username} className="w-full h-full object-cover" /> : null}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-sm text-foreground">{comment.username}</span>
                  <span className="text-xs text-muted-foreground ml-2">{new Date(comment.createdAt).toLocaleString('vi-VN')}</span>
                </div>
                {isDeleted ? (
                  <Button variant="ghost" size="sm" onClick={() => restoreComment(comment.id)} disabled={isRestoring} className="h-7 text-xs text-green-500 hover:text-green-600 hover:bg-green-500/10">Khôi phục</Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id)} disabled={isDeleting} className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10">Xóa</Button>
                )}
              </div>
              <p className="text-sm text-foreground/90">{comment.content}</p>
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

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (items.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      {items.map((item: any) => {
        const isHidden = item.status === 'HIDDEN' || item.isHidden;
        const imageUrl = item.imageUrl || item.images?.[0] || "https://placehold.co/200x200?text=No+Image";
        const sellerName = item.seller?.username || "Unknown";

        return (
          <div key={item.id} className={cn("bg-card border rounded-xl p-4 md:p-6 transition-all duration-300 flex flex-col md:flex-row gap-6", isHidden ? "opacity-60 bg-muted/20" : "")}>
            <div className="flex gap-4 md:w-1/3 shrink-0">
              <div className="size-20 md:size-24 rounded-lg overflow-hidden bg-muted relative shrink-0">
                <img src={imageUrl} alt="Item content" className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-primary/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                  MARKET
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-medium text-sm md:text-base text-foreground line-clamp-2">{item.name || item.title || 'Sản phẩm không có tên'}</h4>
                <p className="text-xs text-muted-foreground mt-1">Người bán: <span className="font-medium text-foreground">@{sellerName}</span></p>
                <p className="text-xs font-bold text-primary mt-1">{item.price ? `${item.price.toLocaleString('vi-VN')} ₫` : 'Thỏa thuận'}</p>
              </div>
            </div>

            <div className="hidden md:block w-px bg-border my-2" />

            <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2 flex-1 flex flex-col justify-center">
                <p className="text-sm">Trạng thái: <span className={cn("font-bold", isHidden ? "text-orange-500" : "text-green-500")}>{isHidden ? 'Đã Ẩn' : 'Hiển thị'}</span></p>
              </div>

              <div className="flex flex-row justify-end gap-2 shrink-0 items-center border-t md:border-t-0 pt-4 md:pt-0 border-border">
                {!isHidden && (
                  <Button disabled={isBusy} onClick={() => hideItem(item.id)} variant="outline" className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10">
                    <EyeOff className="size-4 mr-2" /> Ẩn SP
                  </Button>
                )}
                <Button disabled={isBusy} onClick={() => deleteItem(item.id)} variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10">
                  <Trash2 className="size-4 mr-2" /> Xóa vĩnh viễn
                </Button>
              </div>
            </div>
          </div>
        );
      })}
      <PaginationControls page={page} setPage={setPage} totalPages={data?.metadata?.totalPages} />
    </div>
  );
}

function LoadingState() {
  return <div className="py-12 flex justify-center border border-dashed rounded-xl"><Loader2 className="animate-spin text-muted-foreground size-6" /></div>;
}

function ErrorState() {
  return <div className="py-12 text-center text-red-500 border border-dashed rounded-xl border-red-500/20 bg-red-500/5">Lỗi khi tải dữ liệu</div>;
}

function EmptyState() {
  return <div className="py-12 text-center text-muted-foreground border border-dashed rounded-xl bg-card">Không có dữ liệu phù hợp.</div>;
}

function PaginationControls({ page, setPage, totalPages }: { page: number, setPage: (p: number | ((prev: number) => number)) => void, totalPages?: number }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Trang trước</Button>
      <div className="flex items-center text-sm px-2 text-muted-foreground">{page} / {totalPages}</div>
      <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Trang sau</Button>
    </div>
  );
}
