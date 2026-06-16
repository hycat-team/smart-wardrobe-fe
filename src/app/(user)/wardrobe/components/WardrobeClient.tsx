"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Plus, Edit2, Tag, Search, Filter,
  X, Eye, Lock, Loader2, Sparkles, Check, Trash2
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMyWardrobe, useBulkDeleteWardrobeItems } from "@/features/wardrobe/queries/wardrobe.queries";
import { applyCloudinaryTrim } from "@/lib/cloudinary";
import { WardrobeItemStatus } from "@/features/wardrobe/types";
import { WardrobeCard } from "./WardrobeCard";
import { toast } from "sonner";

const CATEGORIES = ["Tất cả", "Áo", "Quần", "Váy", "Giày", "Phụ kiện"];

const CATEGORY_SLUG_MAP: Record<string, string> = {
  "Áo": "ao",
  "Quần": "quan",
  "Váy": "vay",
  "Giày": "giay",
  "Phụ kiện": "phu-kien",
  "Áo khoác": "ao-khoac",
  "Mũ": "mu",
  "Khác": "other"
};

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


import { getWardrobeItemName, getColorHex } from "@/features/wardrobe/utils";

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

export default function WardrobeClient({ initialData }: { initialData: any[] }) {
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

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDeleteWardrobeItems();

  const [searchInput, setSearchInput] = useState(searchParam);
  const lastPushedQ = useRef(searchParam);

  // Map category param to backend slug
  const slugToFetch = categoryParam === "Tất cả" ? undefined : CATEGORY_SLUG_MAP[categoryParam] || categoryParam;

  // Load real wardrobe items
  const {
    data,
    isLoading: isLoadingItems,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useMyWardrobe(slugToFetch);

  const rawInitialItems = Array.isArray(initialData) ? initialData : ((initialData as any)?.items || []);
  const realItems = data ? data.pages.flatMap(page => page.items) : rawInitialItems;

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
        // If the user starts typing a new search, clear the category to search all items
        updateParams({ q: searchInput, category: null });
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
    updateParams({ q: searchInput, category: null });
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
  const filteredItems = realItems.filter((item: any) => {
    const itemCatName = item.category?.name || "";
    const matchesCategory = categoryParam === "Tất cả" || itemCatName === categoryParam;

    const matchesColor = !colorParam || getColorValue(item.color || "") === colorParam;

    // Tag filter (for mock tags backward compatibility, or matching backend style/material)
    const mockTags = (item as any).tags || [];
    const backendTags = [item.style, item.material, item.pattern, item.seasonality].filter(Boolean);
    const matchesTag = !tagParam || mockTags.includes(tagParam) || backendTags.includes(tagParam);

    const searchTokens = searchParam.toLowerCase().split(/\s+/).filter(Boolean);
    const itemName = getWardrobeItemName(item).toLowerCase();

    // Combine all searchable text into one string
    const itemText = [
      itemName,
      itemCatName.toLowerCase(),
      ((item as any).name || "").toLowerCase(),
      (item.color || "").toLowerCase(),
      (item.material || "").toLowerCase(),
      (item.style || "").toLowerCase(),
      (item.brand || "").toLowerCase()
    ].join(" ");

    // Ensure EVERY word in the search query exists SOMEWHERE in the item's combined text (AND logic)
    const matchesSearch = !searchParam || searchTokens.every(token => itemText.includes(token));

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
    <div className="max-w-[1400px] mx-auto space-y-8 pb-16 px-4 sm:px-8 lg:px-12 font-sans selection:bg-ink selection:text-cream">
      {/* High-end Editorial Header */}
      <div className="flex flex-col gap-8 pt-8 md:pt-12 border-b border-ink/10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-[100px] font-heading font-medium tracking-tighter text-ink leading-[0.85] uppercase">
              Wardrobe
            </h1>
            <p className="text-sm text-ink-muted font-mono uppercase tracking-[0.1em] max-w-md leading-relaxed border-l border-ink/20 pl-4">
              Bộ sưu tập của bạn. 
              {realItems.length > 0 ? ` Đang lưu trữ ${realItems.length} món đồ.` : " Hãy bắt đầu thêm đồ."}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted size-4" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-cream border border-ink/20 focus:border-ink focus:ring-0 pl-10 pr-4 py-3 rounded-none outline-none transition-all font-mono text-xs text-ink placeholder:text-ink-muted uppercase tracking-widest"
                placeholder="TÌM KIẾM..."
              />
            </form>

            <Button 
              onClick={() => router.push("/wardrobe/upload")}
              className="rounded-none bg-ink text-cream hover:bg-ink/80 text-xs font-mono tracking-[0.15em] h-[42px] px-8 transition-colors uppercase"
            >
              <Plus className="mr-2 size-4" /> Thêm Món Đồ
            </Button>
            <Button 
              onClick={() => {
                setIsSelectMode(!isSelectMode);
                setSelectedIds([]);
              }}
              variant={isSelectMode ? "default" : "outline"}
              className={cn("rounded-none text-xs font-mono tracking-[0.15em] h-[42px] px-4 transition-colors uppercase", isSelectMode ? "bg-ink text-cream hover:bg-ink/90" : "border-ink text-ink")}
            >
              {isSelectMode ? "Hủy chọn" : "Chọn nhiều"}
            </Button>
            {isSelectMode && selectedIds.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    disabled={isDeleting}
                    className="rounded-none bg-[#D03027] hover:bg-[#A9221B] text-[#F3F0EA] text-xs font-mono tracking-[0.15em] h-[42px] px-4 transition-all uppercase shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] active:translate-y-[3px] active:translate-x-[3px] active:shadow-none border border-[#1A1A1A]"
                  >
                    {isDeleting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Trash2 className="size-4 mr-2" />}
                    Xóa ({selectedIds.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-none border-2 border-[#1A1A1A] bg-[#F3F0EA] p-8 shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] sm:max-w-md animate-in fade-in zoom-in-95 duration-200">
                  <AlertDialogHeader className="space-y-4 text-left">
                    <AlertDialogTitle className="font-heading text-4xl uppercase tracking-tighter text-[#1A1A1A] leading-none">
                      Cảnh báo <br/><span className="text-[#D03027]">Xóa Dữ Liệu</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-mono text-[11px] text-[#1A1A1A]/70 uppercase tracking-widest leading-relaxed border-l-2 border-[#D03027] pl-4 mt-6">
                      Bạn đang chuẩn bị xóa vĩnh viễn {selectedIds.length} trang phục khỏi hệ thống.
                      <br/><br/>
                      Hành động này không thể hoàn tác. Các item này sẽ bị gỡ bỏ khỏi mọi outfit liên quan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-10 flex gap-4 sm:space-x-0 w-full sm:justify-between">
                    <AlertDialogCancel className="flex-1 rounded-none border-2 border-[#1A1A1A] bg-transparent text-[#1A1A1A] font-mono text-xs tracking-widest uppercase hover:bg-[#1A1A1A] hover:text-[#F3F0EA] h-12 transition-all m-0 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none">
                      Hủy bỏ
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => {
                        bulkDelete({ ids: selectedIds }, {
                          onSuccess: () => {
                            setIsSelectMode(false);
                            setSelectedIds([]);
                          }
                        });
                      }}
                      className="flex-1 rounded-none border-2 border-[#1A1A1A] bg-[#D03027] text-[#F3F0EA] font-mono text-xs tracking-widest uppercase hover:bg-transparent hover:text-[#D03027] h-12 transition-all m-0 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none"
                    >
                      Xác nhận
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Categories / Tabs - Magazine Index Style */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {CATEGORIES.map((cat, idx) => {
              const label = cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "text-xs font-mono uppercase tracking-[0.2em] relative transition-colors group pb-2",
                    categoryParam === cat 
                      ? "text-ink font-bold" 
                      : "text-ink-muted hover:text-ink"
                  )}
                >
                  {label}
                  <span className={cn(
                    "absolute bottom-0 left-0 h-[2px] bg-ink transition-all duration-300",
                    categoryParam === cat ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 border border-ink/20 px-4 py-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-muted">Sắp xếp</span>
            <select 
              value={sortParam}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-transparent text-xs font-mono uppercase tracking-widest text-ink font-bold focus:outline-none focus:ring-0 cursor-pointer appearance-none"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="name">Theo tên</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {isLoadingItems ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
          <div className="size-24 border border-ink/20 border-t-ink rounded-full animate-spin" />
          <p className="text-[10px] text-ink-muted font-mono tracking-[0.3em] uppercase">Đang tải Tủ Đồ...</p>
        </div>
      ) : sortedItems.length > 0 ? (
        <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 transition-all duration-300", (isFetching && !isFetchingNextPage) && "opacity-60 blur-[1px]")}>
          {sortedItems.map((item: any) => {
            const isProcessing = item.status === WardrobeItemStatus.Processing;
            const isFailed = item.status === WardrobeItemStatus.Failed;
            const isLocked = item.isLocked;

            const handleCardClick = () => {
              if (isSelectMode) {
                if (selectedIds.includes(item.id)) {
                  setSelectedIds(selectedIds.filter(id => id !== item.id));
                } else {
                  setSelectedIds([...selectedIds, item.id]);
                }
                return;
              }
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
              <WardrobeCard
                key={item.id}
                item={item}
                isLocked={isLocked}
                isProcessing={isProcessing}
                isSelectMode={isSelectMode}
                isSelected={selectedIds.includes(item.id)}
                onClick={handleCardClick}
                getWardrobeItemName={getWardrobeItemName}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-8 text-center max-w-md mx-auto">
          <div className="size-24 bg-[#e0dcd5] flex items-center justify-center text-ink/40">
            <Tag className="size-10 stroke-1" />
          </div>
          <div className="space-y-4">
            <h3 className="font-heading text-4xl text-ink uppercase tracking-tight">Trống</h3>
            <p className="text-xs font-mono uppercase tracking-widest text-ink-muted leading-relaxed">
              Tủ đồ của bạn đang trống. Hãy bắt đầu số hóa các món đồ thực tế của bạn để tạo ra những bộ phối đồ mới.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.push("/wardrobe/upload")} 
            className="rounded-none border-ink text-ink hover:bg-ink hover:text-cream text-xs font-mono tracking-[0.2em] uppercase h-14 px-8 mt-4"
          >
            Thêm Món Đồ Mới
          </Button>
        </div>
      )}

      {hasNextPage && (
        <div className="mt-32 flex justify-center border-t border-ink/10 pt-16">
          <Button 
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="ghost"
            className="text-xs font-mono tracking-[0.3em] uppercase text-ink hover:bg-transparent hover:text-terracotta disabled:opacity-50 transition-colors"
          >
            {isFetchingNextPage ? 'Đang tải...' : 'Tải thêm'}
          </Button>
        </div>
      )}
    </div>
  );
}
