"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { 
  Plus, Edit2, Tag, Search, Filter, 
  X, Eye 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const CATEGORIES = ["Tất cả", "Áo", "Quần", "Váy", "Giày", "Phụ kiện"];

const COLORS = [
  { name: "Trắng", value: "white", hex: "#FFFFFF" },
  { name: "Đen", value: "black", hex: "#1A1A1A" },
  { name: "Xanh dương", value: "blue", hex: "#2563EB" },
  { name: "Xám", value: "gray", hex: "#9CA3AF" },
  { name: "Đỏ", value: "red", hex: "#DC2626" },
  { name: "Vàng", value: "yellow", hex: "#F59E0B" },
  { name: "Be", value: "beige", hex: "#F5F5DC" },
];

const TAGS = ["Casual", "Minimalist", "Denim", "Elegant", "Summer", "Formal", "Workwear", "Sporty"];

export const MOCK_ITEMS = [
  { 
    id: "1", 
    name: "Áo Thun Basic", 
    category: "Áo", 
    color: "white", 
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400", 
    tags: ["Casual", "Minimalist"],
    brand: "Uniqlo",
    timesWorn: 18,
    dateAdded: "2026-04-10"
  },
  { 
    id: "2", 
    name: "Quần Jeans Xanh Slim", 
    category: "Quần", 
    color: "blue", 
    img: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400", 
    tags: ["Casual", "Denim"],
    brand: "Levi's",
    timesWorn: 34,
    dateAdded: "2026-03-15"
  },
  { 
    id: "3", 
    name: "Váy Liền Trắng Dáng Dài", 
    category: "Váy", 
    color: "white", 
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400", 
    tags: ["Elegant", "Summer"],
    brand: "Zara",
    timesWorn: 8,
    dateAdded: "2026-05-02"
  },
  { 
    id: "4", 
    name: "Blazer Xám Công Sở", 
    category: "Áo", 
    color: "gray", 
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400", 
    tags: ["Formal", "Workwear"],
    brand: "Mango",
    timesWorn: 12,
    dateAdded: "2026-04-20"
  },
  { 
    id: "5", 
    name: "Sneaker Trắng Classic", 
    category: "Giày", 
    color: "white", 
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400", 
    tags: ["Casual", "Sporty"], 
    selling: true,
    brand: "Adidas",
    timesWorn: 45,
    dateAdded: "2026-01-20"
  },
  { 
    id: "6", 
    name: "Áo Sơ Mi Linen Cổ Tàu", 
    category: "Áo", 
    color: "beige", 
    img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400", 
    tags: ["Minimalist", "Summer"], 
    brand: "Muji",
    timesWorn: 15,
    dateAdded: "2026-05-10"
  },
  { 
    id: "7", 
    name: "Quần Kaki Đen", 
    category: "Quần", 
    color: "black", 
    img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=400", 
    tags: ["Casual", "Workwear"], 
    brand: "Dickies",
    timesWorn: 22,
    dateAdded: "2026-02-18"
  },
];

export default function Wardrobe() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.isPremium;
  const searchParams = useSearchParams();
  const setSearchParams = (p: any) => { const q = new URLSearchParams(searchParams.toString()); for(const k in p) q.set(k, p[k]); router.push('?' + q.toString()); };
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync Search state with query params
  const categoryParam = searchParams.get("category") || "Tất cả";
  const colorParam = searchParams.get("color") || "";
  const tagParam = searchParams.get("tag") || "";
  const sortParam = searchParams.get("sort") || "newest";
  const searchParam = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(searchParam);

  // Update local search input state when searchParam changes in URL
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Update query parameters helper
  const updateParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handleCategoryChange = (cat: string) => {
    updateParams({ category: cat === "Tất cả" ? null : cat });
  };

  const handleColorChange = (color: string) => {
    updateParams({ color: colorParam === color ? null : color });
  };

  const handleTagChange = (tag: string) => {
    updateParams({ tag: tagParam === tag ? null : tag });
  };

  const handleSortChange = (sort: string) => {
    updateParams({ sort });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchInput });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchInput("");
  };

  // Active filters counting
  const activeFiltersCount = 
    (colorParam ? 1 : 0) + 
    (tagParam ? 1 : 0) + 
    (searchParam ? 1 : 0);

  // Filter & Sort Logic
  const filteredItems = MOCK_ITEMS.filter(item => {
    const matchesCategory = categoryParam === "Tất cả" || item.category === categoryParam;
    const matchesColor = !colorParam || item.color === colorParam;
    const matchesTag = !tagParam || item.tags.includes(tagParam);
    const matchesSearch = !searchParam || 
      item.name.toLowerCase().includes(searchParam.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchParam.toLowerCase());
    
    return matchesCategory && matchesColor && matchesTag && matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortParam === "newest") {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
    if (sortParam === "oldest") {
      return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
    }
    if (sortParam === "worn-most") {
      return b.timesWorn - a.timesWorn;
    }
    if (sortParam === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="flex flex-col h-full gap-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={cn("text-3xl font-heading font-medium tracking-wide text-ink")}>Tủ đồ cá nhân</h1>
          {isPremium ? (
            <div className="mt-4 max-w-lg border-l-2 border-primary pl-4 py-1">
              <p className="text-sm font-heading italic text-muted-foreground leading-relaxed">
                "Bạn có {MOCK_ITEMS.length} item — hôm nay bạn nên thử phong cách Capsule Wardrobe với 2 item đã lâu không mặc. <a href="#" className="text-primary not-italic font-sans text-xs uppercase tracking-widest font-bold hover:underline ml-2">✦ Xem gợi ý</a>"
              </p>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-4 text-xs font-mono text-ink-muted">
              <span>Sức chứa: {MOCK_ITEMS.length} / 50 món</span>
              <div className="w-32 h-1 bg-cream-dark rounded-full overflow-hidden">
                <div className="h-full bg-terracotta transition-all" style={{ width: `${(MOCK_ITEMS.length / 50) * 100}%` }} />
              </div>
              <span>{Math.round((MOCK_ITEMS.length / 50) * 100)}%</span>
            </div>
          )}
        </div>
        <Button 
          onClick={() => router.push("/wardrobe/upload")}
          className={cn(
            "rounded-xl font-medium px-5 h-11 transition-all active:scale-[0.98] shadow-sm",
            isPremium ? "bg-transparent border border-primary text-primary hover:bg-primary/10 hover:text-primary" : "bg-ink text-cream hover:bg-ink/90"
          )}
        >
          <Plus className="mr-2 size-4" /> Thêm đồ mới
        </Button>
      </div>

      {/* Primary Category Selector & Quick Bar */}
      <div className="flex flex-col gap-4 border-b border-cream-dark pb-4 sticky top-[64px] bg-[#FAF7F2]/90 backdrop-blur-md z-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          {/* Categories Horizontal Tabs */}
          <div className="flex overflow-x-auto gap-1.5 no-scrollbar py-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-medium tracking-wider whitespace-nowrap transition-all",
                  categoryParam === cat 
                    ? "bg-ink text-cream font-semibold shadow-sm" 
                    : "bg-cream-dark/50 text-ink-muted hover:text-ink hover:bg-cream-dark"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search & Filter Drawer Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-ink-muted" />
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm sản phẩm, nhãn hiệu..." 
                className="h-9 pl-9 pr-4 rounded-xl bg-cream-dark/50 border-transparent focus:ring-1 focus:ring-terracotta focus:border-terracotta text-xs w-full transition-all"
              />
            </form>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "rounded-xl h-9 border-cream-dark hover:bg-cream-dark/50 text-xs font-mono tracking-wider relative",
                    activeFiltersCount > 0 && "border-terracotta text-terracotta bg-terracotta-light/10 hover:bg-terracotta-light/20"
                  )}
                >
                  <Filter className="mr-1.5 size-3.5" /> 
                  BỘ LỌC
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-terracotta text-cream text-[9px] font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[340px] sm:w-[400px] border-l border-cream-dark bg-cream p-6 flex flex-col justify-between font-sans">
                <div className="space-y-6">
                  <SheetHeader className="border-b border-cream-dark pb-4">
                    <SheetTitle className="font-heading text-xl text-ink font-semibold tracking-wide flex items-center justify-between">
                      Bộ lọc tủ đồ
                      {activeFiltersCount > 0 && (
                        <button 
                          onClick={handleResetFilters} 
                          className="text-xs font-mono font-medium text-terracotta hover:underline"
                        >
                          Xóa tất cả
                        </button>
                      )}
                    </SheetTitle>
                    <SheetDescription className="text-xs text-ink-muted">
                      Tinh chỉnh tủ đồ theo các bộ lọc thuộc tính.
                    </SheetDescription>
                  </SheetHeader>

                  {/* Color Selector */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-ink font-semibold">Màu Sắc</h4>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map(color => {
                        const isSelected = colorParam === color.value;
                        return (
                          <button
                            key={color.value}
                            onClick={() => handleColorChange(color.value)}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all",
                              isSelected 
                                ? "border-ink bg-ink text-cream" 
                                : "border-cream-dark hover:border-ink/30 bg-transparent text-ink-muted"
                            )}
                          >
                            <span 
                              className="size-3.5 rounded-full border border-black/10 inline-block"
                              style={{ backgroundColor: color.hex }}
                            />
                            {color.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Style Tags Selector */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-ink font-semibold">Phong cách / Tag</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {TAGS.map(tag => {
                        const isSelected = tagParam === tag;
                        return (
                          <button
                            key={tag}
                            onClick={() => handleTagChange(tag)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs transition-all border",
                              isSelected 
                                ? "bg-terracotta border-terracotta text-cream font-medium" 
                                : "bg-cream-dark/30 border-transparent text-ink-muted hover:bg-cream-dark/50"
                            )}
                          >
                            #{tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sort Order Selector */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-ink font-semibold">Sắp xếp</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Mới nhất", value: "newest" },
                        { label: "Cũ nhất", value: "oldest" },
                        { label: "Mặc nhiều nhất", value: "worn-most" },
                        { label: "Tên A-Z", value: "name" },
                      ].map(opt => {
                        const isSelected = sortParam === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => handleSortChange(opt.value)}
                            className={cn(
                              "px-3 py-2 rounded-xl text-xs text-left border transition-all",
                              isSelected 
                                ? "border-ink bg-ink text-cream font-medium" 
                                : "border-cream-dark text-ink-muted hover:bg-cream-dark/20"
                            )}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="border-t border-cream-dark pt-4 flex gap-3">
                  <Button 
                    className="flex-1 bg-ink text-cream hover:bg-ink/90 rounded-xl"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Xem {sortedItems.length} kết quả
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Selected Filter Chips Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">Đang lọc:</span>
            {colorParam && (
              <span className="inline-flex items-center gap-1 bg-cream-dark text-ink px-2.5 py-1 rounded-full text-xs font-medium">
                Màu: {COLORS.find(c => c.value === colorParam)?.name}
                <button onClick={() => updateParams({ color: null })} className="hover:text-terracotta">
                  <X className="size-3" />
                </button>
              </span>
            )}
            {tagParam && (
              <span className="inline-flex items-center gap-1 bg-cream-dark text-ink px-2.5 py-1 rounded-full text-xs font-medium">
                #{tagParam}
                <button onClick={() => updateParams({ tag: null })} className="hover:text-terracotta">
                  <X className="size-3" />
                </button>
              </span>
            )}
            {searchParam && (
              <span className="inline-flex items-center gap-1 bg-cream-dark text-ink px-2.5 py-1 rounded-full text-xs font-medium">
                "{searchParam}"
                <button onClick={() => updateParams({ q: null })} className="hover:text-terracotta">
                  <X className="size-3" />
                </button>
              </span>
            )}
            <button 
              onClick={handleResetFilters}
              className="text-[11px] font-medium text-terracotta hover:underline ml-1"
            >
              Thiết lập lại
            </button>
          </div>
        )}
      </div>

      {/* Grid Content */}
      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sortedItems.map(item => {
            const isForgotten = item.timesWorn < 10;
            return (
            <div 
              key={item.id} 
              className={cn(
                "group relative rounded-2xl overflow-hidden border transition-all duration-300",
                isPremium 
                  ? "bg-card hover:border-primary/50 border-border" 
                  : "bg-cream-dark/20 hover:bg-cream-dark/30 border-cream-dark/50 hover:border-ink-subtle"
              )}
            >
              {item.selling && (
                <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-[9px] font-mono font-bold text-terracotta flex items-center gap-1 shadow-sm border border-terracotta-light">
                  <Tag className="size-3 text-terracotta" /> SALE
                </div>
              )}
              {isPremium && isForgotten && (
                <div className="absolute top-3 right-3 z-10 bg-secondary/80 backdrop-blur-sm px-2 py-1 rounded text-[9px] font-heading italic text-primary border border-primary/20">
                  FORGOTTEN
                </div>
              )}
              
              <div 
                onClick={() => router.push(`/wardrobe/item/${item.id}`)}
                className={cn(
                  "aspect-[4/5] relative overflow-hidden cursor-pointer",
                  isPremium ? "bg-muted" : "bg-cream-dark/40"
                )}
              >
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
                />
                
                {/* Elegant Hover overlay */}
                <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/wardrobe/item/${item.id}`);
                    }}
                    className={cn(
                      "size-10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md",
                      isPremium ? "bg-primary text-primary-foreground" : "bg-cream text-ink hover:bg-ink hover:text-cream"
                    )}
                    title="Chi tiết"
                  >
                    <Eye className="size-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/wardrobe/item/${item.id}/edit`);
                    }}
                    className={cn(
                      "size-10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md",
                      isPremium ? "bg-primary text-primary-foreground" : "bg-cream text-ink hover:bg-ink hover:text-cream"
                    )}
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="size-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/wardrobe/item/${item.id}/sell`);
                    }}
                    className={cn(
                      "size-10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md",
                      isPremium 
                        ? "bg-primary text-primary-foreground"
                        : (item.selling ? "bg-terracotta text-cream hover:bg-terracotta/90" : "bg-cream text-ink hover:bg-ink hover:text-cream")
                    )}
                    title={item.selling ? "Quản lý bài đăng bán" : "Đăng bán đồ"}
                  >
                    <Tag className="size-4" />
                  </button>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-1.5">
                  <h3 
                    onClick={() => router.push(`/wardrobe/item/${item.id}`)}
                    className={cn(
                      "font-semibold text-sm md:text-base leading-tight hover:underline cursor-pointer truncate text-ink",
                      isPremium ? "font-sans font-light" : "font-heading"
                    )}
                  >
                    {item.name}
                  </h3>
                  <span 
                    className="size-3 rounded-full border border-black/10 shrink-0 inline-block mt-1" 
                    style={{ backgroundColor: COLORS.find(c => c.value === item.color)?.hex || "#CCCCCC" }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
                  <span className="font-medium">{item.brand}</span>
                  <span>Mặc: {item.timesWorn} lần</span>
                </div>

                <div className={cn("flex flex-wrap gap-1 pt-1", isPremium && "opacity-60")}>
                  {item.tags.map(t => (
                    <span 
                      key={t} 
                      onClick={() => handleTagChange(t)}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground hover:text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            );
          })}

          {/* Inline Add Item CTA Card */}
          <div 
            onClick={() => router.push("/wardrobe/upload")}
            className="group border border-dashed border-ink-subtle hover:border-terracotta rounded-2xl flex flex-col items-center justify-center aspect-[4/5] gap-3 text-ink-muted hover:text-terracotta transition-all duration-300 cursor-pointer bg-cream-dark/10 hover:bg-terracotta-light/5"
          >
            <div className="size-11 rounded-full bg-cream-dark/50 flex items-center justify-center group-hover:bg-terracotta/10 group-hover:scale-110 transition-all">
              <Plus className="size-5 transition-transform group-hover:rotate-90" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-xs tracking-wider uppercase">Thêm đồ mới</p>
              <p className="text-[10px] text-ink-subtle mt-0.5 font-mono">Quét QR hoặc tải ảnh</p>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="border border-dashed border-cream-dark p-12 text-center rounded-2xl bg-cream-dark/10 max-w-md mx-auto my-12 space-y-4">
          <div className="size-12 bg-cream-dark rounded-full flex items-center justify-center mx-auto text-ink-muted">
            <Search className="size-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-lg font-bold text-ink">Không tìm thấy quần áo</h3>
            <p className="text-sm text-ink-muted">
              Không có món đồ nào trong tủ khớp với bộ lọc hiện tại của bạn.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={handleResetFilters} className="rounded-xl h-10 text-xs font-mono">
              XÓA BỘ LỌC
            </Button>
            <Button onClick={() => router.push("/wardrobe/upload")} className="bg-ink text-cream hover:bg-ink/90 rounded-xl h-10 text-xs font-mono">
              THÊM ĐỒ MỚI
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}



