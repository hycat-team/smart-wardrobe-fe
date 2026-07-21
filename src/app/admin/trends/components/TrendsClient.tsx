"use client";
import { useState } from "react";
import { Search, Loader2, Eye, Heart, MessageCircle } from "lucide-react";
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
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAdminPosts } from "@/features/admin/queries/admin.queries";

export function TrendsClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrend, setSelectedTrend] = useState<any | null>(null);

  const { data, isLoading, isError } = useAdminPosts({ limit: 20, q: searchTerm });
  const trends = data?.items || [];

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full pb-24 text-foreground">
      <div className="flex flex-col gap-8 pt-6 border-b border-border pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            {/* <h1 className="text-5xl md:text-6xl font-semibold font-medium text-foreground leading-[1.1] uppercase">
              XU HƯỚNG
            </h1> */}
            <p className="text-[12px] text-muted-foreground font-semibold uppercase tracking-[0.1em] max-w-md leading-relaxed border-l-2 border-border pl-4">
              Theo dõi và kiểm duyệt các bài viết có tương tác cao.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="TÌM KIẾM NỘI DUNG..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full pl-10 pr-4 bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-[11px] font-semibold uppercase tracking-widest transition-all outline-none rounded-2xl text-foreground placeholder:text-muted-foreground/60 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm p-6 rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.15em] py-4 h-auto w-[350px]">Bài viết</TableHead>
              <TableHead className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.15em] py-4 h-auto">Người đăng</TableHead>
              <TableHead className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.15em] py-4 h-auto text-center">Tương tác</TableHead>
              <TableHead className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.15em] py-4 h-auto">Trạng thái</TableHead>
              <TableHead className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.15em] py-4 h-auto text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center border-b border-border"><Loader2 className="animate-spin text-muted-foreground mx-auto" /></TableCell></TableRow>
            ) : isError ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center text-foreground font-semibold uppercase text-[11px] border-b border-border">Lỗi tải dữ liệu.</TableCell></TableRow>
            ) : trends.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-semibold uppercase text-[11px] tracking-widest border-b border-border">Không có dữ liệu.</TableCell></TableRow>
            ) : trends.map((trend: any) => {
              const imageUrl = trend.media?.[0]?.mediaUrl || trend.imageUrl || "https://placehold.co/200x200?text=No+Image";
              const title = trend.title || trend.content || "Bài viết không có tiêu đề";
              const creator = trend.username || trend.author?.username || "Ẩn danh";
              const date = trend.createdAt ? new Date(trend.createdAt).toLocaleDateString('vi-VN') : "N/A";
              const isHidden = trend.isDeleted || trend.status === "DELETED";

              return (
                <TableRow key={trend.id || trend.publicId} className={cn("border-b border-border hover:bg-muted/50 transition-colors", isHidden && "opacity-60")}>
                  <TableCell className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-16 bg-muted overflow-hidden shrink-0 rounded-2xl">
                        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold font-medium text-base text-foreground line-clamp-2">{title}</span>
                        <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{date}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 font-semibold text-[12px] text-foreground">@{creator}</TableCell>
                  <TableCell className="py-5">
                    <div className="flex items-center justify-center gap-4 font-semibold text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Heart className="size-3" strokeWidth={1.5} /> {trend.likeCount || 0}</span>
                      <span className="flex items-center gap-1.5"><MessageCircle className="size-3" strokeWidth={1.5} /> {trend.commentCount || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <span className={cn("font-semibold text-[10px] uppercase tracking-widest font-medium border px-3 py-1 rounded-full", !isHidden ? "text-foreground border-foreground bg-foreground/5" : "text-muted-foreground border-border bg-muted/50")}>
                      {!isHidden ? "ACTIVE" : "DELETED"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-5">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTrend({ ...trend, title, creator, date, imageUrl })} className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full font-semibold text-[10px] uppercase tracking-widest">
                      <Eye className="size-4 mr-2" strokeWidth={1.5} /> VIEW
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedTrend} onOpenChange={() => setSelectedTrend(null)}>
        <DialogContent className="sm:max-w-md font-sans bg-card border border-border p-0 rounded-3xl overflow-hidden shadow-xl">
          {selectedTrend && (
            <div className="flex flex-col">
              <div className="aspect-square w-full relative">
                <img src={selectedTrend.imageUrl} alt={selectedTrend.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 border-t border-border space-y-6">
                <div>
                  <h3 className="font-semibold text-3xl font-medium text-foreground line-clamp-3 leading-snug">{selectedTrend.title}</h3>
                  <p className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground mt-4">
                    TÁC GIẢ <span className="text-foreground font-medium">@{selectedTrend.creator}</span> — {selectedTrend.date}
                  </p>
                </div>
                <div className="flex gap-8 border-t border-border pt-6">
                  <div className="space-y-1">
                    <p className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground">LƯỢT THÍCH</p>
                    <p className="font-semibold text-lg text-foreground">{selectedTrend.likeCount || 0}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground">BÌNH LUẬN</p>
                    <p className="font-semibold text-lg text-foreground">{selectedTrend.commentCount || 0}</p>
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
