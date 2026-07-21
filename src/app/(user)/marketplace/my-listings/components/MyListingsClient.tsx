"use client";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Tag, Search, MoreHorizontal, Edit, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const MY_LISTINGS = [
  {
    id: "l1",
    name: "Áo Blazer Zara Nâu Đất",
    price: 350000,
    status: "active", // active, sold, hidden
    views: 124,
    likes: 12,
    dateListed: "2026-05-10",
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "l2",
    name: "Quần Kaki Đen Dickies",
    price: 250000,
    status: "sold",
    views: 342,
    likes: 45,
    dateListed: "2026-04-20",
    img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "l3",
    name: "Sneaker Trắng Classic",
    price: 450000,
    status: "hidden",
    views: 89,
    likes: 5,
    dateListed: "2026-05-25",
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200",
  },
];

export function MyListingsClient() {
  return (
    <div className="flex flex-col h-full gap-8 animate-in fade-in duration-500 font-sans pb-16 pt-4 max-w-5xl mx-auto w-full px-4">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link 
          href="/marketplace" 
          className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-ink-muted hover:text-ink transition-colors w-fit"
        >
          <ArrowLeft className="size-3.5" /> QUAY LẠI CHỢ ĐỒ CŨ
        </Link>
        <h1 className="text-3xl font-heading font-bold tracking-wide text-ink mt-2">Quản lý tin đăng</h1>
        <p className="text-sm text-ink-muted">Theo dõi và quản lý các món đồ bạn đang bán trên Marketplace.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tổng doanh thu", value: "250.000đ", color: "text-terracotta" },
          { label: "Đang bán", value: "1 món", color: "text-ink" },
          { label: "Đã bán", value: "1 món", color: "text-ink-muted" },
          { label: "Lượt xem tin", value: "555 lượt", color: "text-ink" },
        ].map((stat, i) => (
          <div key={i} className="bg-cream border border-cream-dark p-4 rounded-2xl flex flex-col gap-1">
            <span className="text-[10px] font-mono text-ink-muted uppercase">{stat.label}</span>
            <span className={cn("text-2xl font-heading font-bold", stat.color)}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Listings Table/List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between bg-cream-dark/20">
          <h3 className="font-heading font-bold text-lg text-ink">Danh sách tin đăng ({MY_LISTINGS.length})</h3>
          <div className="relative w-48 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-ink-muted" />
            <input 
              type="text" 
              placeholder="Tìm tin đăng..." 
              className="h-8 w-full pl-8 pr-3 rounded-lg bg-background border border-border text-xs focus:ring-1 focus:ring-terracotta transition-all"
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {MY_LISTINGS.map(item => (
            <div key={item.id} className={cn("p-4 flex items-center gap-4 transition-colors hover:bg-cream-dark/10", item.status === "sold" && "opacity-60")}>
              {/* Item Image */}
              <div className="size-16 md:size-20 rounded-xl overflow-hidden bg-cream-dark shrink-0 relative">
                <Image fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={item.img} alt={item.name} className="w-full h-full object-cover" />
                {item.status === "sold" && (
                  <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Đã bán</span>
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-semibold text-ink text-base md:text-lg truncate">{item.name}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-terracotta font-bold text-sm">{item.price.toLocaleString("vi-VN")}đ</span>
                  <span className="text-[10px] text-ink-muted hidden sm:inline-block">Ngày đăng: {item.dateListed}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-ink-muted">
                  <span className="flex items-center gap-1" title="Lượt xem"><EyeOff className="size-3" /> {item.views}</span>
                  <span className="flex items-center gap-1" title="Lượt thích">❤️ {item.likes}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="hidden md:flex shrink-0 w-24 justify-end">
                <span className={cn(
                  "px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider",
                  item.status === "active" ? "bg-green-100 text-green-700 border border-green-200" :
                  item.status === "sold" ? "bg-cream-dark text-ink-muted" :
                  "bg-orange-100 text-orange-700 border border-orange-200"
                )}>
                  {item.status === "active" ? "Đang bán" : item.status === "sold" ? "Đã bán" : "Đang ẩn"}
                </span>
              </div>

              {/* Actions Dropdown */}
              <div className="shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-ink-muted hover:text-ink">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 font-sans">
                    {item.status === "active" && (
                      <>
                        <DropdownMenuItem className="text-xs cursor-pointer"><Edit className="mr-2 size-3.5" /> Sửa tin</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs cursor-pointer"><EyeOff className="mr-2 size-3.5" /> Ẩn tin</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs cursor-pointer text-terracotta font-medium"><CheckCircle2 className="mr-2 size-3.5" /> Đánh dấu đã bán</DropdownMenuItem>
                      </>
                    )}
                    {item.status === "hidden" && (
                      <DropdownMenuItem className="text-xs cursor-pointer"><Tag className="mr-2 size-3.5" /> Hiện tin lại</DropdownMenuItem>
                    )}
                    {item.status === "sold" && (
                      <DropdownMenuItem className="text-xs cursor-pointer"><Edit className="mr-2 size-3.5" /> Xem chi tiết</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}


