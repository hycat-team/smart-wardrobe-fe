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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAdminPosts } from "@/features/admin/queries/admin.queries";
export function TrendsClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrend, setSelectedTrend] = useState<any | null>(null);
  const { data, isLoading, isError } = useAdminPosts({ limit: 20, q: searchTerm });
  const trends = data?.items || [];
  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full pb-24 text-[#111]">
      {" "}
      <div className="flex flex-col gap-8 pt-6 border-b border-black/10 pb-6">
        {" "}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {" "}
          <div className="space-y-4 max-w-2xl">
            {" "}
            <h1 className="text-5xl md:text-6xl font-sans font-medium text-[#111] leading-[1.1] ">
              {" "}
              TRENDS{" "}
            </h1>{" "}
            <p className="text-[12px] text-[#666] font-sans max-w-md leading-relaxed border-l-2 border-black/10 pl-4">
              {" "}
              Theo dõi và kiểm duyệt các bài viết có tương tác cao.{" "}
            </p>{" "}
          </div>{" "}
          <div className="flex gap-4 w-full md:w-auto">
            {" "}
            <div className="relative flex-1 md:w-64">
              {" "}
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 size-4 text-[#A3A3A3]" />{" "}
              <input
                type="text"
                placeholder="TÌM KIẾM NỘI DUNG..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full pl-8 pr-4 bg-transparent border-b border-black/10 focus:border-[#111] text-[11px] font-sans transition-all outline-none rounded-xl"
              />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="bg-white border border-black/10 shadow-sm p-6">
        {" "}
        <Table>
          {" "}
          <TableHeader>
            {" "}
            <TableRow className="hover:bg-transparent border-b border-black/10">
              {" "}
              <TableHead className="font-sans text-[10px] text-[#666] py-4 h-auto w-[350px]">
                Bài viết
              </TableHead>{" "}
              <TableHead className="font-sans text-[10px] text-[#666] py-4 h-auto">
                Người đăng
              </TableHead>{" "}
              <TableHead className="font-sans text-[10px] text-[#666] py-4 h-auto text-center">
                Tương tác
              </TableHead>{" "}
              <TableHead className="font-sans text-[10px] text-[#666] py-4 h-auto">
                Trạng thái
              </TableHead>{" "}
              <TableHead className="font-sans text-[10px] text-[#666] py-4 h-auto text-right">
                Thao tác
              </TableHead>{" "}
            </TableRow>{" "}
          </TableHeader>{" "}
          <TableBody>
            {" "}
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center border-b border-black/5">
                  <Loader2 className="animate-spin text-[#A3A3A3] mx-auto" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-[#111] font-sans text-[11px] border-b border-black/5"
                >
                  Lỗi tải dữ liệu.
                </TableCell>
              </TableRow>
            ) : trends.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-[#A3A3A3] font-sans text-[11px] border-b border-black/5"
                >
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            ) : (
              trends.map((trend: any) => {
                const imageUrl =
                  trend.media?.[0]?.mediaUrl ||
                  trend.imageUrl ||
                  "https://placehold.co/200x200?text=No+Image";
                const title = trend.title || trend.content || "Bài viết không có tiêu đề";
                const creator = trend.username || trend.author?.username || "Ẩn danh";
                const date = trend.createdAt
                  ? new Date(trend.createdAt).toLocaleDateString("vi-VN")
                  : "N/A";
                const isHidden = trend.isDeleted || trend.status === "DELETED";
                return (
                  <TableRow
                    key={trend.id || trend.publicId}
                    className={cn(
                      "border-b border-black/5 hover:bg-[#F8F7F5] transition-colors",
                      isHidden && "opacity-60"
                    )}
                  >
                    {" "}
                    <TableCell className="py-5">
                      {" "}
                      <div className="flex items-center gap-4">
                        {" "}
                        <div className="size-16 bg-black/5 overflow-hidden shrink-0">
                          {" "}
                          <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover"
                          />{" "}
                        </div>{" "}
                        <div className="flex flex-col">
                          {" "}
                          <span className="font-sans font-medium text-base text-[#111] line-clamp-2">
                            {title}
                          </span>{" "}
                          <span className="font-sans text-[10px] text-[#666] mt-1">
                            {date}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </TableCell>{" "}
                    <TableCell className="py-5 font-sans text-[12px] text-[#111]">
                      @{creator}
                    </TableCell>{" "}
                    <TableCell className="py-5">
                      {" "}
                      <div className="flex items-center justify-center gap-4 font-sans text-[11px] text-[#666]">
                        {" "}
                        <span className="flex items-center gap-1.5">
                          <Heart className="size-3" strokeWidth={1.5} /> {trend.likeCount || 0}
                        </span>{" "}
                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="size-3" strokeWidth={1.5} />{" "}
                          {trend.commentCount || 0}
                        </span>{" "}
                      </div>{" "}
                    </TableCell>{" "}
                    <TableCell className="py-5">
                      {" "}
                      <span
                        className={cn(
                          "font-sans text-[10px] font-medium border px-2 py-1",
                          !isHidden ? "text-[#111] border-[#111]" : "text-[#A3A3A3] border-black/10"
                        )}
                      >
                        {" "}
                        {!isHidden ? "ACTIVE" : "DELETED"}{" "}
                      </span>{" "}
                    </TableCell>{" "}
                    <TableCell className="text-right py-5">
                      {" "}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setSelectedTrend({ ...trend, title, creator, date, imageUrl })
                        }
                        className="text-[#A3A3A3] hover:text-[#111] hover:bg-transparent rounded-xl font-sans text-[10px] "
                      >
                        {" "}
                        <Eye className="size-4 mr-2" strokeWidth={1.5} /> VIEW{" "}
                      </Button>{" "}
                    </TableCell>{" "}
                  </TableRow>
                );
              })
            )}{" "}
          </TableBody>{" "}
        </Table>{" "}
      </div>{" "}
      <Dialog open={!!selectedTrend} onOpenChange={() => setSelectedTrend(null)}>
        {" "}
        <DialogContent className="sm:max-w-md font-sans bg-white border border-black/10 p-0 rounded-xl overflow-hidden">
          {" "}
          {selectedTrend && (
            <div className="flex flex-col">
              {" "}
              <div className="aspect-square w-full relative">
                {" "}
                <img
                  src={selectedTrend.imageUrl}
                  alt={selectedTrend.title}
                  className="w-full h-full object-cover"
                />{" "}
              </div>{" "}
              <div className="p-8 border-t border-black/10 space-y-6">
                {" "}
                <div>
                  {" "}
                  <h3 className="font-sans text-3xl font-medium text-[#111] line-clamp-3 leading-snug">
                    {selectedTrend.title}
                  </h3>{" "}
                  <p className="font-sans text-[10px] text-[#666] mt-4">
                    {" "}
                    TÁC GIẢ{" "}
                    <span className="text-[#111] font-medium">@{selectedTrend.creator}</span> —{" "}
                    {selectedTrend.date}{" "}
                  </p>{" "}
                </div>{" "}
                <div className="flex gap-8 border-t border-black/10 pt-6">
                  {" "}
                  <div className="space-y-1">
                    {" "}
                    <p className="font-sans text-[10px] text-[#A3A3A3]">LƯỢT THÍCH</p>{" "}
                    <p className="font-sans text-lg text-[#111]">
                      {selectedTrend.likeCount || 0}
                    </p>{" "}
                  </div>{" "}
                  <div className="space-y-1">
                    {" "}
                    <p className="font-sans text-[10px] text-[#A3A3A3]">BÌNH LUẬN</p>{" "}
                    <p className="font-sans text-lg text-[#111]">
                      {selectedTrend.commentCount || 0}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
        </DialogContent>{" "}
      </Dialog>{" "}
    </div>
  );
}
