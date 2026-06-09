"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, MoreHorizontal, ShieldCheck, Users, Eye, EyeOff, Heart, MessageCircle, Share2, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAdminPosts } from "@/features/admin/queries/admin.queries";

export function TrendsClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrend, setSelectedTrend] = useState<any | null>(null);

  // Fetch real data
  const { data, isLoading, isError } = useAdminPosts({ limit: 20, q: searchTerm });
  const trends = data?.items || [];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">Xu Hướng Nổi Bật</h1>
          <p className="text-sm text-muted-foreground">Theo dõi và kiểm duyệt các bài viết có tương tác cao từ cộng đồng.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-3 rounded-xl shadow-sm">
        <div className="relative w-full sm:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Tìm theo nội dung..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full pl-9 pr-4 rounded-lg bg-secondary border-transparent focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all outline-none text-foreground"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="w-[300px]">Bài viết</TableHead>
              <TableHead>Nguồn Gốc</TableHead>
              <TableHead className="text-center">Tương Tác</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <Loader2 className="size-6 animate-spin mx-auto mb-2 text-primary" /> Đang tải dữ liệu xu hướng...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-red-500">
                  Lỗi khi tải dữ liệu.
                </TableCell>
              </TableRow>
            ) : trends.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Không tìm thấy xu hướng nào phù hợp.
                </TableCell>
              </TableRow>
            ) : trends.map((trend: any) => {
              const imageUrl = trend.media?.[0]?.mediaUrl || trend.imageUrl || "https://placehold.co/200x200?text=No+Image";
              const title = trend.title || trend.content || "Bài viết không có tiêu đề";
              const creator = trend.username || trend.author?.username || "Ẩn danh";
              const date = trend.createdAt ? new Date(trend.createdAt).toLocaleDateString('vi-VN') : "N/A";
              const isHidden = trend.isDeleted || trend.status === "DELETED";

              return (
                <TableRow key={trend.id || trend.publicId} className={cn(isHidden && "opacity-60 bg-muted/30")}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-lg bg-muted overflow-hidden shrink-0">
                        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm line-clamp-1">{title}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{date}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-purple-500/10 text-purple-500 text-xs font-medium border border-purple-500/20">
                      <Users className="size-3" /> Community
                    </span>
                    <div className="text-[10px] text-muted-foreground mt-1.5">@{creator}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground font-mono">
                      <span className="flex items-center gap-1"><Heart className="size-3 text-red-400" /> {trend.likeCount || 0}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="size-3" /> {trend.commentCount || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      !isHidden ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    )}>
                      {!isHidden ? "Đang chạy" : "Đã Xóa"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedTrend({ ...trend, title, creator, date, imageUrl })}
                      className="text-xs"
                    >
                      <Eye className="size-4 mr-2" /> Xem
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedTrend} onOpenChange={() => setSelectedTrend(null)}>
        <DialogContent className="sm:max-w-md font-sans bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading font-bold text-foreground">Chi tiết Xu Hướng</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Thông tin hiệu suất của xu hướng trên nền tảng.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTrend && (
            <div className="space-y-6 py-4">
              <div className="aspect-video w-full rounded-xl overflow-hidden relative">
                <img src={selectedTrend.imageUrl} alt={selectedTrend.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/90 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                    <Users className="size-3.5" /> Community
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold font-heading text-foreground line-clamp-2">{selectedTrend.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Đăng bởi <span className="font-medium text-foreground">@{selectedTrend.creator}</span> vào ngày {selectedTrend.date}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 p-4 rounded-xl flex flex-col justify-center gap-3 border border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><Heart className="size-4 text-red-400" /> Lượt tim</span>
                    <span className="font-mono font-medium text-foreground">{selectedTrend.likeCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><MessageCircle className="size-4" /> Bình luận</span>
                    <span className="font-mono font-medium text-foreground">{selectedTrend.commentCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
