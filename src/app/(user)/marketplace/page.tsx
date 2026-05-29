"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Search, Filter, Tag, LayoutGrid, List, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MARKETPLACE_ITEMS = [
  {
    id: "m1",
    name: "Áo Blazer Zara Nâu Đất",
    brand: "Zara",
    price: 350000,
    originalPrice: 1200000,
    condition: "Like New",
    size: "M",
    sellerName: "lan_style",
    sellerRating: 4.8,
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "m2",
    name: "Quần Jeans Levi's 501",
    brand: "Levi's",
    price: 450000,
    originalPrice: 1500000,
    condition: "Good",
    size: "30",
    sellerName: "hieu_nguyen",
    sellerRating: 4.5,
    img: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "m3",
    name: "Áo Len Cổ Lọ Tăm",
    brand: "Uniqlo",
    price: 150000,
    originalPrice: 400000,
    condition: "Fair",
    size: "S",
    sellerName: "mai_vintage",
    sellerRating: 4.9,
    img: "https://images.unsplash.com/photo-1538329972958-465d6d2144ed?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "m4",
    name: "Váy Lụa Dáng Dài Họa Tiết",
    brand: "Mango",
    price: 550000,
    originalPrice: 1800000,
    condition: "Like New",
    size: "S",
    sellerName: "ha_fashion",
    sellerRating: 5.0,
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "m5",
    name: "Túi Tote Canvas Basic",
    brand: "Muji",
    price: 120000,
    originalPrice: 300000,
    condition: "Mới nguyên tag",
    size: "F",
    sellerName: "eco_life",
    sellerRating: 4.7,
    img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400",
  },
];

const CONDITIONS = ["Tất cả", "Mới nguyên tag", "Like New", "Good", "Fair"];

export default function Marketplace() {
  const router = useRouter();
  const [activeCondition, setActiveCondition] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredItems = activeCondition === "Tất cả" 
    ? MARKETPLACE_ITEMS 
    : MARKETPLACE_ITEMS.filter(x => x.condition === activeCondition);

  return (
    <div className="flex flex-col h-full gap-8 animate-in fade-in duration-500 font-sans pb-16 pt-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-wide text-ink">Chợ Đồ Cũ</h1>
          <p className="text-sm text-ink-muted mt-2">Mua bán, trao đổi trang phục và cùng nhau hướng tới thời trang bền vững.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => router.push("/marketplace/my-listings")}
            className="rounded-xl h-11 border-ink-subtle text-ink font-mono text-xs tracking-wider"
          >
            QUẢN LÝ TIN ĐĂNG
          </Button>
          <Button 
            onClick={() => router.push("/wardrobe")}
            className="rounded-xl h-11 bg-terracotta text-cream hover:bg-terracotta/90 font-mono text-xs tracking-wider border border-transparent shadow-sm"
          >
            ĐĂNG BÁN TỪ TỦ ĐỒ
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-[64px] bg-background/90 backdrop-blur-md z-20 py-2 border-b border-cream-dark">
        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-muted" />
          <input 
            type="text" 
            placeholder="Tìm theo tên, hãng..." 
            className="h-10 w-full pl-9 pr-4 rounded-xl bg-cream-dark/50 border-transparent focus:ring-1 focus:ring-terracotta focus:border-terracotta text-sm transition-all"
          />
        </div>

        {/* Filters & View Mode */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {CONDITIONS.map(cond => (
              <button
                key={cond}
                onClick={() => setActiveCondition(cond)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                  activeCondition === cond 
                    ? "bg-ink border-ink text-cream" 
                    : "bg-cream border-cream-dark text-ink-muted hover:border-ink/30"
                )}
              >
                {cond}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-cream-dark/50 rounded-lg p-1 shrink-0 ml-auto border border-cream-dark">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-1.5 rounded-md transition-colors", viewMode === "grid" ? "bg-cream text-ink shadow-sm" : "text-ink-muted")}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn("p-1.5 rounded-md transition-colors", viewMode === "list" ? "bg-cream text-ink shadow-sm" : "text-ink-muted")}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Items Grid/List */}
      <div className={cn(
        "gap-6",
        viewMode === "grid" 
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
          : "flex flex-col"
      )}>
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            className={cn(
              "group bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:border-terracotta/50 shadow-sm",
              viewMode === "list" && "flex h-40"
            )}
          >
            <div className={cn(
              "relative overflow-hidden bg-cream-dark/30",
              viewMode === "grid" ? "aspect-[4/5]" : "w-32 md:w-40 h-full shrink-0"
            )}>
              <img 
                src={item.img} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute top-2 left-2 bg-cream/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono font-bold text-ink flex items-center gap-1 shadow-sm">
                <Tag className="size-3" /> {item.condition}
              </div>
            </div>
            
            <div className={cn("p-4 flex flex-col justify-between flex-1", viewMode === "list" && "py-4 px-5")}>
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading font-bold text-base leading-tight text-ink line-clamp-2">
                    {item.name}
                  </h3>
                </div>
                <p className="text-[11px] font-mono text-ink-muted mt-1 uppercase">{item.brand} • Size {item.size}</p>
                
                {viewMode === "list" && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="size-5 rounded-full bg-cream-dark flex items-center justify-center text-[10px] font-bold text-ink">
                      {item.sellerName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-ink-muted">@{item.sellerName} (★ {item.sellerRating})</span>
                  </div>
                )}
              </div>

              <div className={cn("mt-4 flex", viewMode === "grid" ? "flex-col gap-2" : "items-center justify-between")}>
                <div className="space-y-0.5">
                  <div className="text-lg font-mono font-bold text-terracotta">
                    {item.price.toLocaleString("vi-VN")}đ
                  </div>
                  <div className="text-[10px] font-mono text-ink-subtle line-through">
                    Giá gốc: {item.originalPrice.toLocaleString("vi-VN")}đ
                  </div>
                </div>

                {viewMode === "list" ? (
                  <Button className="bg-ink text-cream hover:bg-ink/90 rounded-xl h-10 px-6 font-mono text-xs">
                    Xem Chi Tiết
                  </Button>
                ) : (
                  <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
                    <span className="text-[10px] text-ink-muted truncate max-w-[100px]">@{item.sellerName}</span>
                    <span className="text-[10px] font-bold text-ink bg-cream-dark px-1.5 py-0.5 rounded">★ {item.sellerRating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}


