"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Plus, Edit2, Tag, Search, Filter,
  X, Eye, Lock, Loader2, Sparkles
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMyWardrobe } from "@/features/wardrobe/queries/wardrobe.queries";
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
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.isPremium;
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync Search state with query params
  const categoryParam = searchParams.get("category") || "Tất cả";
  const colorParam = searchParams.get("color") || "";
  const tagParam = searchParams.get("tag") || "";
  const sortParam = searchParams.get("sort") || "newest";
  const searchParam = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(searchParam);
  const lastPushedQ = useRef(searchParam);

  // Load real wardrobe items
  const { data: realItems = [], isLoading: isLoadingItems } = useMyWardrobe();

  // Sync Search state with query params ONLY if changed externally
  useEffect(() => {
    if (searchParam !== lastPushedQ.current) {
      setSearchInput(searchParam);
      lastPushedQ.current = searchParam;
    }
  }, [searchParam]);

  // Debounced Search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchParam && searchInput !== lastPushedQ.current) {
        lastPushedQ.current = searchInput;
        updateParams({ q: searchInput });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput, searchParam]);

  // Update query parameters helper
  const updateParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
    router.push(pathname, { scroll: false });
    setSearchInput("");
  };

  // Active filters counting
  const activeFiltersCount =
    (colorParam ? 1 : 0) +
    (tagParam ? 1 : 0) +
    (searchParam ? 1 : 0);

  // Filter & Sort Logic
  const filteredItems = realItems.filter(item => {
    const itemCatName = item.category?.name || "";
    const matchesCategory = categoryParam === "Tất cả" || itemCatName === categoryParam;

    const matchesColor = !colorParam || getColorValue(item.color || "") === colorParam;

    // Tag filter (for mock tags backward compatibility, or matching backend style/material)
    const mockTags = (item as any).tags || [];
    const backendTags = [item.style, item.material, item.pattern, item.seasonality].filter(Boolean);
    const matchesTag = !tagParam || mockTags.includes(tagParam) || backendTags.includes(tagParam);

    const searchLower = searchParam.toLowerCase();
    const matchesSearch = !searchParam ||
      itemCatName.toLowerCase().includes(searchLower) ||
      ((item as any).name && (item as any).name.toLowerCase().includes(searchLower)) ||
      (item.color && item.color.toLowerCase().includes(searchLower)) ||
      (item.material && item.material.toLowerCase().includes(searchLower)) ||
      (item.style && item.style.toLowerCase().includes(searchLower));

    return matchesCategory && matchesColor && matchesTag && matchesSearch;
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
    <div className="animate-in fade-in duration-500 w-full max-w-[1200px] mx-auto pt-6">
      {/* Page Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-display-lg text-4xl md:text-5xl text-primary tracking-tight mb-2 font-bold">My Wardrobe</h1>
          <p className="font-body-lg text-base text-muted-foreground">{realItems.length} items curated for you.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-secondary/50 border border-border focus:border-primary focus:bg-background pl-9 pr-4 py-2.5 rounded-lg outline-none transition-all font-body-sm text-sm text-primary placeholder:text-muted-foreground"
              placeholder="Search items..."
            />
          </form>

          {/* Filter Button */}
          <button className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all whitespace-nowrap",
            activeFiltersCount > 0
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-primary hover:bg-secondary/50"
          )}>
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters</span>
          </button>
        </div>
      </div>

      {/* Selected Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Active:</span>
          {colorParam && (
            <span className="inline-flex items-center gap-1 bg-secondary border border-border text-primary px-2.5 py-1 rounded-full text-xs font-medium">
              Màu: {COLORS.find(c => c.value === colorParam)?.name}
              <button onClick={() => updateParams({ color: null })} className="hover:text-muted-foreground">
                <X className="size-3" />
              </button>
            </span>
          )}
          {tagParam && (
            <span className="inline-flex items-center gap-1 bg-secondary border border-border text-primary px-2.5 py-1 rounded-full text-xs font-medium">
              #{tagParam}
              <button onClick={() => updateParams({ tag: null })} className="hover:text-muted-foreground">
                <X className="size-3" />
              </button>
            </span>
          )}
          {searchParam && (
            <span className="inline-flex items-center gap-1 bg-secondary border border-border text-primary px-2.5 py-1 rounded-full text-xs font-medium">
              "{searchParam}"
              <button onClick={() => updateParams({ q: null })} className="hover:text-muted-foreground">
                <X className="size-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Categories / Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-8 mb-8 pb-[1px] border-b border-border/50">
        {CATEGORIES.map((cat, idx) => {
          // Adjust labels to match English design if standard
          const label = cat === "Tất cả" ? "All Items" :
            cat === "Áo" ? "Tops" :
              cat === "Quần" ? "Bottoms" :
                cat === "Váy" ? "Dresses" :
                  cat === "Áo khoác" ? "Outerwear" :
                    cat === "Phụ kiện" ? "Shoes & Accessories" : cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "font-body-sm text-[14px] pb-3 whitespace-nowrap transition-all tracking-wide relative",
                categoryParam === cat
                  ? "font-bold text-primary"
                  : "text-muted-foreground font-medium hover:text-primary"
              )}
            >
              {label}
              {categoryParam === cat && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Grid Content */}
      {isLoadingItems ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loader2 className="size-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-mono">Loading wardrobe...</p>
        </div>
      ) : sortedItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                onClick={handleCardClick}
                className={cn(
                  "group bg-background rounded-[16px] overflow-hidden transition-all duration-300 cursor-pointer relative flex flex-col p-3 border border-transparent hover:border-border hover:shadow-sm",
                  isLocked && "opacity-75"
                )}
              >
                <div className="relative aspect-[3/4] bg-secondary rounded-[12px] overflow-hidden mb-4">
                  <img
                    alt={getWardrobeItemName(item)}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                    src={item.imageUrl || undefined}
                  />
                  {item.material && (
                    <div className="absolute top-2 left-2 flex gap-2 z-10">
                      <span className="bg-[#D9C5B2]/80 text-primary font-label-caps text-[10px] px-2 py-1 rounded-[4px] backdrop-blur-sm uppercase tracking-wider font-bold">
                        {item.material}
                      </span>
                    </div>
                  )}

                  {!isLocked && !isProcessing && (
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/wardrobe/item/${item.id}`);
                        }}
                        className="size-9 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm bg-background text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Eye className="size-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col px-1">
                  <h3 className="font-title-lg text-[15px] text-primary truncate font-semibold mb-1">{getWardrobeItemName(item)}</h3>
                  <p className="font-body-sm text-[13px] text-muted-foreground flex items-center justify-between">
                    <span className="truncate">{item.brand || "Acne Studios"} • Size {item.size || "S"}</span>
                  </p>
                </div>
              </div>
            );
          })}

          {/* Add New Item Card */}
          <div
            onClick={() => router.push("/wardrobe/upload")}
            className="group rounded-[16px] border-2 border-dashed border-border hover:border-primary/50 bg-transparent transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[300px] text-muted-foreground hover:text-primary hover:bg-secondary/20"
          >
            <div className="size-12 rounded-full border-2 border-current flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
              <Plus className="size-6 transition-transform duration-500 group-hover:rotate-[360deg]" />
            </div>
            <span className="font-body-sm text-[14px] font-medium">Thêm món mới</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            onClick={() => router.push("/wardrobe/upload")}
            className="group rounded-[16px] border-2 border-dashed border-border hover:border-primary/50 bg-transparent transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[300px] text-muted-foreground hover:text-primary hover:bg-secondary/20"
          >
            <div className="size-12 rounded-full border-2 border-current flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
              <Plus className="size-6 transition-transform duration-500 group-hover:rotate-[360deg]" />
            </div>
            <span className="font-body-sm text-[14px] font-medium">Thêm món mới</span>
          </div>
        </div>
      )}

      {/* {sortedItems.length > 0 && (
        <div className="mt-16 flex justify-center">
          <button className="px-8 py-2.5 border border-primary text-primary font-body-sm text-[14px] font-medium rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm">
            Load More Items
          </button>
        </div>
      )} */}
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
