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
import { Skeleton } from "@heroui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useMyWardrobe, useBulkDeleteWardrobeItems, useCategories } from "@/features/wardrobe/queries/wardrobe.queries";
import { applyCloudinaryTrim } from "@/lib/cloudinary";
import { WardrobeItemStatus } from "@/features/wardrobe/types";
import { WardrobeCard } from "./WardrobeCard";
import { toast } from "sonner";

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

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
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

  const containerRef = useRef<HTMLDivElement>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync Search state with query params
  const categoryParam = searchParams.get("category") || "Tất cả";
  const colorParam = searchParams.get("color") || "";
  const tagParam = searchParams.get("tag") || "";
  const sortParam = searchParams.get("sort") || "Mới nhất";
  const searchParam = searchParams.get("q") || "";

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDeleteWardrobeItems();

  const [searchInput, setSearchInput] = useState(searchParam);
  const lastPushedQ = useRef(searchParam);

  // Anti-spam refs for refetch
  const spamClickCount = useRef(0);
  const spamClickTimeout = useRef<NodeJS.Timeout | null>(null);

  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  // Fetch dynamic categories
  const { data: categoriesData = [] } = useCategories();

  const categories = [
    { name: "Tất cả", slug: "Tất cả" },
    ...categoriesData.map(c => ({ name: c.name, slug: c.slug }))
  ];

  // Map category param to backend slug
  const slugToFetch = categoryParam === "Tất cả" ? undefined : categoryParam;

  // Load real wardrobe items
  const {
    data,
    isLoading: isLoadingItems,
    isFetching,
    refetch
  } = useMyWardrobe(slugToFetch, pageParam);

  const rawInitialItems = Array.isArray(initialData) ? initialData : ((initialData as any)?.items || []);
  const realItems = data ? data.items : rawInitialItems;
  const metadata = data?.metadata;

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

  // Track scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 220);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    updateParams({ category: cat === "Tất cả" ? null : cat, page: "1" });
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
    updateParams({ q: searchInput, category: null, page: "1" });
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
    const itemCatSlug = item.category?.slug || "";
    const matchesCategory = categoryParam === "Tất cả" || itemCatSlug === categoryParam;

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

    if (sortParam === "Mới nhất" || sortParam === "newest") {
      return timeB - timeA;
    }
    if (sortParam === "Cũ nhất" || sortParam === "oldest") {
      return timeA - timeB;
    }
    if (sortParam === "Tên" || sortParam === "name") {
      return getWardrobeItemName(a).localeCompare(getWardrobeItemName(b));
    }
    return 0;
  });

  useGSAP(() => {
    if (sortedItems.length > 0 && !isFetching) {
      gsap.fromTo(
        ".wardrobe-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.05, ease: "power3.out", duration: 0.6, clearProps: "all" }
      );
    }
  }, { scope: containerRef, dependencies: [sortedItems.length, isFetching] });

  const renderActions = () => (
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
        <Plus className="mr-2 size-4" /> Thêm Đồ
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
              className="rounded-none bg-[#D03027] text-cream hover:bg-[#D03027]/90 text-xs font-mono tracking-[0.15em] h-[42px] px-4 transition-colors uppercase border-none"
            >
              {isDeleting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Trash2 className="size-[15px] mr-1.5" />}
              Xóa ({selectedIds.length})
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-none border border-ink/10 bg-cream p-8 shadow-xl sm:max-w-md animate-in fade-in zoom-in-95 duration-200">
            <AlertDialogHeader className="space-y-4 text-left">
              <AlertDialogTitle className="font-heading text-4xl uppercase tracking-tighter text-ink leading-none">
                Cảnh báo <br /><span className="text-[#D03027]">Xóa Dữ Liệu</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="font-mono text-[11px] text-ink-muted uppercase tracking-widest leading-relaxed border-l-2 border-[#D03027] pl-4 mt-6">
                Bạn đang chuẩn bị xóa vĩnh viễn {selectedIds.length} trang phục khỏi hệ thống.
                <br /><br />
                Hành động này không thể hoàn tác. Các item này sẽ bị gỡ bỏ khỏi mọi outfit liên quan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-10 flex gap-4 sm:space-x-0 w-full sm:justify-between">
              <AlertDialogCancel className="flex-1 rounded-none border border-ink/20 bg-transparent text-ink font-mono text-xs tracking-widest uppercase hover:bg-ink hover:text-cream h-12 transition-colors m-0">
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
                className="flex-1 rounded-none border-none bg-[#D03027] text-cream font-mono text-xs tracking-widest uppercase hover:bg-[#D03027]/90 h-12 transition-colors m-0"
              >
                Xác nhận
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );

  return (
    <>
      {/* Sticky Top Action Bar */}
      <div
        className={cn(
          "fixed top-0 left-0 md:left-[280px] right-0 z-40 bg-[#F4F1EE]/80 dark:bg-[#111]/80 backdrop-blur-xl border-b border-ink/10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isScrolled ? "translate-y-0 shadow-sm opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="font-['Playfair_Display'] font-medium text-2xl text-[#111] uppercase tracking-wide">
              Wardrobe
            </span>
          </div>
          {renderActions()}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-8 pb-16 px-4 sm:px-8 lg:px-12 font-sans selection:bg-ink selection:text-cream" ref={containerRef}>
        {/* High-end Editorial Header */}
        <div className="flex flex-col gap-8 pt-8 md:pt-12 border-b border-ink/10 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              {/* <h1 className="text-5xl md:text-6xl lg:text-[100px] font-heading font-medium tracking-tighter text-ink leading-[0.85] uppercase">
              Wardrobe
            </h1> */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-medium text-[#111] leading-[1.1] uppercase">
                Wardrobe
              </h1>
              <p className="text-sm text-ink-muted font-mono uppercase tracking-[0.1em] max-w-md leading-relaxed border-l border-ink/20 pl-4">
                Bộ sưu tập của bạn.
                {realItems.length > 0 ? ` Đang lưu trữ ${realItems.length} món đồ.` : " Hãy bắt đầu thêm đồ."}
              </p>
            </div>

            {renderActions()}
          </div>

          {/* Categories / Tabs - Magazine Index Style */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {categories.map((cat, idx) => {
                const label = cat.name;
                const isActive = categoryParam === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={cn(
                      "text-xs font-mono uppercase tracking-[0.2em] relative transition-colors group pb-2",
                      isActive
                        ? "text-ink font-bold"
                        : "text-ink-muted hover:text-ink"
                    )}
                  >
                    {label}
                    <span className={cn(
                      "absolute bottom-0 left-0 h-[2px] bg-ink transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )} />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 border border-ink/20 px-4 py-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-muted">Sắp xếp</span>
              <Select value={sortParam} onValueChange={(value) => handleSortChange(value as string)}>
                <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-xs font-mono uppercase tracking-widest text-ink font-bold w-auto">
                  <SelectValue placeholder="Mới nhất" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="end" sideOffset={4}>
                  <SelectItem value="Mới nhất" className="font-mono text-xs uppercase tracking-widest font-bold">Mới nhất</SelectItem>
                  <SelectItem value="Cũ nhất" className="font-mono text-xs uppercase tracking-widest font-bold">Cũ nhất</SelectItem>
                  <SelectItem value="Tên" className="font-mono text-xs uppercase tracking-widest font-bold">Theo tên</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Grid Content */}
        {isLoadingItems ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col h-full bg-[#F8F7F5] border border-black/5">
                <Skeleton className="relative aspect-[4/5] bg-muted/60 p-3 md:p-6 overflow-hidden flex-shrink-0 rounded-none" />
                <div className="flex flex-col p-3 md:p-4 md:pt-5 flex-grow justify-between gap-2 md:gap-3 bg-white border-t border-black/5">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4 rounded-none bg-muted/60" />
                    <Skeleton className="h-3 w-1/2 rounded-none bg-muted/60 mt-2" />
                  </div>
                  <Skeleton className="h-3 w-1/3 rounded-none bg-muted/60" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedItems.length > 0 ? (
          <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 transition-all duration-300", isFetching && "opacity-60 blur-[1px]")}>
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
                  if (isFetching) return; // Prevent concurrent fetches

                  if (spamClickCount.current >= 5) {
                    toast.error("Bạn thao tác quá nhanh, vui lòng chờ trong giây lát!");
                    return;
                  }

                  spamClickCount.current += 1;
                  if (spamClickTimeout.current) clearTimeout(spamClickTimeout.current);
                  spamClickTimeout.current = setTimeout(() => {
                    spamClickCount.current = 0;
                  }, 10000); // Reset limit after 10 seconds

                  toast.promise(refetch(), {
                    loading: 'Đang làm mới dữ liệu từ AI...',
                    success: 'Đã cập nhật kết quả mới nhất!',
                    error: 'Lỗi khi tải dữ liệu',
                  });
                  return;
                }
                router.push(`/wardrobe/item/${item.id}`);
              };

              return (
                <div key={item.id} className="wardrobe-card">
                  <WardrobeCard
                    item={item}
                    isLocked={isLocked}
                    isProcessing={isProcessing}
                    isSelectMode={isSelectMode}
                    isSelected={selectedIds.includes(item.id)}
                    onClick={handleCardClick}
                    getWardrobeItemName={getWardrobeItemName}
                  />
                </div>
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
              Thêm đồ
            </Button>
          </div>
        )}

        {metadata && metadata.totalPages > 1 && (
          <Pagination className="mt-16 pb-12 border-t border-ink/10 pt-16">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageParam > 1) updateParams({ page: (pageParam - 1).toString() });
                  }}
                  className={pageParam <= 1 ? "pointer-events-none opacity-50 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest" : "font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest hover:text-terracotta transition-colors"}
                  text="TRƯỚC"
                />
              </PaginationItem>

              {[...Array(metadata.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === metadata.totalPages ||
                  (pageNum >= pageParam - 1 && pageNum <= pageParam + 1)
                ) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={pageParam === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          updateParams({ page: pageNum.toString() });
                        }}
                        className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest rounded-none border-ink/10"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                if (pageNum === pageParam - 2 || pageNum === pageParam + 2) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageParam < metadata.totalPages) updateParams({ page: (pageParam + 1).toString() });
                  }}
                  className={pageParam >= metadata.totalPages ? "pointer-events-none opacity-50 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest" : "font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest hover:text-terracotta transition-colors"}
                  text="SAU"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
}
