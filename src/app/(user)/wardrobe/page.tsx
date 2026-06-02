"use client";
import { useState, useEffect, Suspense } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { 
  Plus, Edit2, Tag, Search, Filter, 
  X, Eye, Lock, Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMyWardrobe, useSearchWardrobeItems } from "@/features/wardrobe/queries/wardrobe.queries";
import { WardrobeItemStatus } from "@/features/wardrobe/types";
import { toast } from "sonner";

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


// Helper to format item display name
export function getWardrobeItemName(item: any): string {
  if (item.name) return item.name;
  const categoryName = item.category?.name || "Trang phục";
  const colorStr = item.color ? `màu ${item.color}` : "";
  const styleStr = item.style ? `phong cách ${item.style}` : "";
  return [categoryName, colorStr, styleStr].filter(Boolean).join(" ");
}

// Helper to normalize color to HEX
export function getColorHex(colorName: string): string {
  const c = COLORS.find(x => x.name.toLowerCase() === colorName.toLowerCase() || x.value === colorName.toLowerCase());
  return c ? c.hex : "#CCCCCC";
}

// Helper to map color string to standard filter value
const getColorValue = (color: string) => {
  const map: Record<string, string> = {
    "Trắng": "white",
    "Đen": "black",
    "Xanh dương": "blue",
    "Xanh": "blue",
    "Xám": "gray",
    "Đỏ": "red",
    "Vàng": "yellow",
    "Be": "beige",
  };
  return map[color] || color?.toLowerCase() || "";
};

function WardrobeContent() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.isPremium;
  const searchParams = useSearchParams();
  
  const setSearchParams = (p: any) => { 
    const q = new URLSearchParams(searchParams.toString()); 
    for(const k in p) q.set(k, p[k]); 
    router.push('?' + q.toString()); 
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync Search state with query params
  const categoryParam = searchParams.get("category") || "Tất cả";
  const colorParam = searchParams.get("color") || "";
  const tagParam = searchParams.get("tag") || "";
  const sortParam = searchParams.get("sort") || "newest";
  const searchParam = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(searchParam);

  // Load real wardrobe items
  const { data: realItems = [], isLoading: isLoadingItems } = useMyWardrobe();
  // Load ES search results if search is active
  const { data: searchResults = [], isLoading: isSearching } = useSearchWardrobeItems(searchParam);

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

  // Choose source database (Search results vs normal lists)
  const activeSourceItems = searchParam ? searchResults : realItems;

  // Filter & Sort Logic
  const filteredItems = activeSourceItems.filter(item => {
    const itemCatName = item.category?.name || "";
    const matchesCategory = categoryParam === "Tất cả" || itemCatName === categoryParam;
    
    const matchesColor = !colorParam || getColorValue(item.color || "") === colorParam;
    
    // Tag filter (for mock tags backward compatibility, or matching backend style/material)
    const mockTags = (item as any).tags || [];
    const backendTags = [item.style, item.material, item.pattern, item.seasonality].filter(Boolean);
    const matchesTag = !tagParam || mockTags.includes(tagParam) || backendTags.includes(tagParam);
    
    return matchesCategory && matchesColor && matchesTag;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const timeA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : ((a as any).dateAdded ? new Date((a as any).dateAdded).getTime() : 0);
    const timeB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : ((b as any).dateAdded ? new Date((b as any).dateAdded).getTime() : 0);

    if (sortParam === "newest") {
      return timeB - timeA;
    }
    if (sortParam === "oldest") {
      return timeA - timeB;
    }
    if (sortParam === "name") {
      return getWardrobeItemName(a).localeCompare(getWardrobeItemName(b));
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
                "Bạn có {realItems.length} item — hôm nay bạn nên thử phong cách Capsule Wardrobe với 2 item đã lâu không mặc. <a href="#" className="text-primary not-italic font-sans text-xs uppercase tracking-widest font-bold hover:underline ml-2">✦ Xem gợi ý</a>"
              </p>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-4 text-xs font-mono text-ink-muted">
              <span>Sức chứa: {realItems.length} / 50 món</span>
              <div className="w-32 h-1 bg-cream-dark rounded-full overflow-hidden">
                <div className="h-full bg-terracotta transition-all" style={{ width: `${(realItems.length / 50) * 100}%` }} />
              </div>
              <span>{Math.round((realItems.length / 50) * 100)}%</span>
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
              {isSearching ? (
                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-ink-muted animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-ink-muted" />
              )}
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm trang phục thông minh..." 
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
      {isLoadingItems ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loader2 className="size-10 text-terracotta animate-spin" />
          <p className="text-sm text-ink-muted font-mono">Đang tải tủ đồ...</p>
        </div>
      ) : sortedItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sortedItems.map((item: any) => {
            const isProcessing = item.status === WardrobeItemStatus.Processing;
            const isFailed = item.status === WardrobeItemStatus.Failed;
            const isLocked = item.isLocked;

            const handleCardClick = () => {
              if (isLocked) {
                toast.error("Trang phục bị khóa do vượt quá hạn ngạch. Vui lòng nâng cấp gói cước!");
                return;
              }
              if (isProcessing) {
                toast.info("AI đang xử lý hình ảnh này. Vui lòng đợi trong giây lát!");
                return;
              }
              router.push(`/wardrobe/item/${item.id}`);
            };

            return (
              <div 
                key={item.id} 
                className={cn(
                  "group relative rounded-2xl overflow-hidden border transition-all duration-300",
                  isPremium 
                    ? "bg-card hover:border-primary/50 border-border" 
                    : "bg-cream-dark/20 hover:bg-cream-dark/30 border-cream-dark/50 hover:border-ink-subtle",
                  isLocked && "opacity-75"
                )}
              >
                {/* Lock overlay */}
                {isLocked && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center text-white gap-2 p-4 text-center">
                    <Lock className="size-6 text-yellow-500" />
                    <span className="text-xs font-bold font-mono tracking-wider">ĐÃ KHÓA</span>
                    <span className="text-[10px] opacity-80">Gói Free hết hạn ngạch</span>
                  </div>
                )}

                {/* Processing overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-cream/70 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-ink gap-2">
                    <Loader2 className="size-6 text-terracotta animate-spin" />
                    <span className="text-[10px] font-mono font-bold text-ink-muted">AI ĐANG PHÂN TÍCH...</span>
                  </div>
                )}

                {isFailed && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold">
                    AI LỖI
                  </div>
                )}
                
                <div 
                  onClick={handleCardClick}
                  className={cn(
                    "aspect-[4/5] relative overflow-hidden cursor-pointer",
                    isPremium ? "bg-muted" : "bg-cream-dark/40"
                  )}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={getWardrobeItemName(item)} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
                  />
                  
                  {/* Elegant Hover overlay (hide when locked or processing) */}
                  {!isLocked && !isProcessing && (
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
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-1.5">
                    <h3 
                      onClick={handleCardClick}
                      className={cn(
                        "font-semibold text-sm md:text-base leading-tight hover:underline cursor-pointer truncate text-ink",
                        isPremium ? "font-sans font-light" : "font-heading"
                      )}
                    >
                      {getWardrobeItemName(item)}
                    </h3>
                    <span 
                      className="size-3 rounded-full border border-black/10 shrink-0 inline-block mt-1" 
                      style={{ backgroundColor: getColorHex(item.color || "") }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
                    <span className="font-medium">{item.style || "Hàng ngày"}</span>
                    <span>{item.material || "Chưa rõ"}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1 opacity-70">
                    {item.fit && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        #{item.fit}
                      </span>
                    )}
                    {item.seasonality && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        #{item.seasonality}
                      </span>
                    )}
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

export default function Wardrobe() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-10 text-terracotta animate-spin" />
        <p className="text-sm text-ink-muted font-mono">Đang khởi tạo tủ đồ...</p>
      </div>
    }>
      <WardrobeContent />
    </Suspense>
  );
}
