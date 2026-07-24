"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Search, Tag, Trash2, UploadCloud, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  useMyWardrobe,
  useBulkDeleteWardrobeItems,
  useWardrobeCategoryDistribution,
  useCategories,
  useWardrobeStats,
} from "@/features/wardrobe/queries/wardrobe.queries";
import {
  WardrobeCategoryDistribution,
  WardrobeItemRes as WardrobeItem,
  WardrobeItemStatus,
} from "@/features/wardrobe/types";
import { getWardrobeItemName } from "@/features/wardrobe/utils";
import { WardrobeCard } from "./WardrobeCard";
import { WardrobeCategoryDistributionPanel } from "./WardrobeCategoryDistributionPanel";
import { useSidebarStore } from "@/store/useSidebarStore";
import { toast } from "sonner";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMySubscription } from "@/features/subscription/queries/subscription.queries";
import { PaginationResult } from "@/types/api";

const getColorValue = (color: string) => {
  const map: Record<string, string> = {
    Trắng: "white",
    Đen: "black",
    "Xanh dương": "blue",
    Xanh: "blue",
    Xám: "gray",
    Đỏ: "red",
    Vàng: "yellow",
    Be: "beige",
  };
  return map[color] || color?.toLowerCase() || "";
};

const getCategoryName = (item: WardrobeItem) =>
  item.category?.name || item.fashionItem?.category?.name || "";

export default function WardrobeClient({
  initialData,
  initialDistribution,
}: {
  initialData?: PaginationResult<WardrobeItem> | null;
  initialDistribution?: WardrobeCategoryDistribution | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data: category } = useCategories();

  // URL state
  const categoryParam = searchParams.get("categorySlug") || "";
  const colorParam = searchParams.get("color") || "";
  const tagParam = searchParams.get("tag") || "";
  const sortParam = searchParams.get("sort") || "Mới nhất";
  const searchParam = searchParams.get("q") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  // Local state
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParam);
  const lastPushedQ = useRef(searchParam);

  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDeleteWardrobeItems();
  const { data: subscription } = useMySubscription();
  const maxWardrobeItems = subscription?.maxWardrobeItems || 0;
  const maxOutfits = subscription?.maxOutfits || 0;
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  
  const { data: stats } = useWardrobeStats();

  // Anti-spam refs
  const spamClickCount = useRef(0);
  const spamClickTimeout = useRef<NodeJS.Timeout | null>(null);

  // Data fetching
  const {
    data,
    isLoading: isLoadingItems,
    isFetching,
    refetch,
  } = useMyWardrobe(categoryParam || undefined, pageParam);

  const distributionQuery = useWardrobeCategoryDistribution(
    initialDistribution,
  );
  const currentData = data || initialData;
  const items = currentData?.items || [];
  const metadata = currentData?.metadata;

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
  const updateSearchParams = useEffectEvent((value: string) => {
    updateParams({ q: value, categorySlug: null, page: "1" });
  });
  // Sync Search state with query params
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
        updateSearchParams(searchInput);
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


  const handleCategoryChange = (slug: string) => {
    updateParams({ categorySlug: slug === "" ? null : slug, page: "1" });
  };

  const handleSortChange = (sort: string) => {
    updateParams({ sort });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchInput, categorySlug: null, page: "1" });
  };

  // Client-side filtering (Color, Tag, Search, Category)
  const filteredItems = items.filter((item) => {
    const itemCatSlug = item.category?.slug || item.fashionItem?.category?.slug || "";
    const matchesCategory = !categoryParam || itemCatSlug === categoryParam;
    const matchesColor = !colorParam || getColorValue(item.fashionItem?.color || "") === colorParam;
    
    const backendTags = [
      item.fashionItem?.style,
      item.fashionItem?.material,
      item.fashionItem?.pattern,
      item.fashionItem?.seasonality,
    ].filter(Boolean);
    const matchesTag = !tagParam || backendTags.includes(tagParam);

    const searchTokens = searchParam.toLowerCase().split(/\s+/).filter(Boolean);
    const itemText = [
      getWardrobeItemName(item).toLowerCase(),
      getCategoryName(item).toLowerCase(),
      (item.fashionItem?.color || "").toLowerCase(),
      (item.fashionItem?.material || "").toLowerCase(),
      (item.fashionItem?.style || "").toLowerCase(),
    ].join(" ");

    const matchesSearch = !searchParam || searchTokens.every((token) => itemText.includes(token));

    return matchesCategory && matchesColor && matchesTag && matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();

    if (sortParam === "Mới nhất" || sortParam === "newest") return timeB - timeA;
    if (sortParam === "Cũ nhất" || sortParam === "oldest") return timeA - timeB;
    if (sortParam === "Tên" || sortParam === "name") return getWardrobeItemName(a).localeCompare(getWardrobeItemName(b));
    
    return 0;
  });

  useGSAP(() => {
    if (sortedItems.length > 0 && !isFetching) {
      gsap.fromTo(
        ".wardrobe-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "power3.out",
          duration: 0.6,
          clearProps: "all",
        },
      );
    }
  }, { scope: containerRef, dependencies: [sortedItems.length, isFetching] });

  const renderActions = () => (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
      <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full bg-background border border-border focus:border-primary focus:ring-0 pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-200 text-xs font-semibold text-foreground placeholder:text-muted-foreground uppercase tracking-widest"
          placeholder="TÌM KIẾM..."
        />
      </form>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-[42px] rounded-full bg-primary px-8 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 size-4" /> Thêm Đồ
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] rounded-2xl border border-border bg-card p-2 shadow-xl">
          <DropdownMenuItem onClick={() => router.push("/wardrobe/upload")} className="cursor-pointer rounded-xl px-3 py-2.5 font-semibold text-[11px] uppercase tracking-widest text-foreground hover:bg-muted flex items-center gap-2">
            <UploadCloud className="w-4 h-4" /> Tự tải lên ảnh
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/wardrobe/explore")} className="cursor-pointer rounded-xl px-3 py-2.5 font-semibold text-[11px] uppercase tracking-widest text-foreground hover:bg-muted mt-1 flex items-center gap-2">
            <Library className="w-4 h-4" /> Lấy từ thư viện
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        onClick={() => {
          setIsSelectMode(!isSelectMode);
          setSelectedIds([]);
        }}
        variant={isSelectMode ? "default" : "outline"}
        className={cn(
          "rounded-full text-xs font-semibold tracking-[0.15em] h-[42px] px-4 transition-all duration-200 uppercase",
          isSelectMode ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-border text-foreground hover:bg-muted"
        )}
      >
        {isSelectMode ? "Hủy chọn" : "Xóa nhiều"}
      </Button>

      {isSelectMode && selectedIds.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isDeleting} className="h-[42px] rounded-full border-none bg-destructive px-4 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:bg-destructive/90">
              {isDeleting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Trash2 className="size-[15px] mr-1.5" />}
              Xóa ({selectedIds.length})
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl border border-border bg-card p-8 shadow-lg sm:max-w-md">
            <AlertDialogHeader className="space-y-4 text-left">
              <AlertDialogTitle className="text-4xl font-semibold uppercase tracking-tighter leading-none text-card-foreground">
                Cảnh báo <br />
                <span className="text-destructive">Xóa Dữ Liệu</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-6 border-l-2 border-destructive pl-4 text-[11px] font-semibold uppercase tracking-widest leading-relaxed text-muted-foreground">
                Bạn đang chuẩn bị xóa vĩnh viễn {selectedIds.length} trang phục. Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-10 flex w-full justify-between gap-4">
              <AlertDialogCancel className="m-0 h-12 flex-1 rounded-xl border border-border text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-muted">Hủy bỏ</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => bulkDelete({ ids: selectedIds }, { onSuccess: () => { setIsSelectMode(false); setSelectedIds([]); } })}
                className="m-0 h-12 flex-1 rounded-xl border-none bg-destructive text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-destructive/90"
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
      <div className={cn("fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-500", isCollapsed ? "md:left-[88px]" : "md:left-[280px]", isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none")}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-2xl font-semibold uppercase tracking-wide text-foreground whitespace-nowrap">Tủ đồ</span>
          </div>
          {renderActions()}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-8 pb-16 px-4 sm:px-8 lg:px-12 font-sans" ref={containerRef}>
        <div className="flex flex-col gap-8 pt-8 md:pt-12 border-b border-border pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.1] uppercase whitespace-nowrap">Tủ đồ</h1>
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-[0.1em] max-w-md leading-relaxed border-l border-border pl-4">
                {items.length > 0 ? ` Bạn đang lưu trữ ${stats?.activeItemsCount ?? metadata?.totalItems ?? items.length} / ${maxWardrobeItems || '-'} món đồ` : "Hãy bắt đầu thêm đồ."}
              </p>
            </div>
            {renderActions()}
          </div>

          <WardrobeCategoryDistributionPanel
            data={distributionQuery.data}
            isLoading={distributionQuery.isLoading}
            isFetching={distributionQuery.isFetching}
            error={distributionQuery.error}
            onRetry={() => void distributionQuery.refetch()}
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <button
                onClick={() => handleCategoryChange("")}
                className={cn("text-xs font-semibold uppercase tracking-[0.2em] relative transition-colors duration-200 group pb-2", !categoryParam ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                Tất cả
                <span className={cn("absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300", !categoryParam ? "w-full" : "w-0 group-hover:w-full")} />
              </button>
              {category?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={cn("text-xs font-semibold uppercase tracking-[0.2em] relative transition-colors duration-200 group pb-2", categoryParam === cat.slug ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  {cat.name}
                  <span className={cn("absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300", categoryParam === cat.slug ? "w-full" : "w-0 group-hover:w-full")} />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-border px-4 py-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Sắp xếp</span>
              <Select value={sortParam} onValueChange={(value) => handleSortChange(value as string)}>
                <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-xs font-semibold uppercase tracking-widest text-foreground w-auto">
                  <SelectValue placeholder="Mới nhất" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="end" sideOffset={4}>
                  <SelectItem value="Mới nhất" className="text-xs font-semibold uppercase tracking-widest">Mới nhất</SelectItem>
                  <SelectItem value="Cũ nhất" className="text-xs font-semibold uppercase tracking-widest">Cũ nhất</SelectItem>
                  <SelectItem value="Tên" className="text-xs font-semibold uppercase tracking-widest">Theo tên</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoadingItems && !items.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col h-full rounded-2xl border border-border bg-card">
                <Skeleton className="image-frame relative aspect-[4/5] flex-shrink-0 bg-muted/60 p-3 md:p-6" />
                <div className="flex flex-col p-3 md:p-4 border-t border-border gap-2">
                  <Skeleton className="h-6 w-3/4 bg-muted/60" />
                  <Skeleton className="h-3 w-1/2 bg-muted/60" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedItems.length > 0 ? (
          <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 transition-all duration-300", isFetching && "opacity-60 blur-[1px]")}>
            {sortedItems.map((item, index) => {
              const isProcessing = item.status === WardrobeItemStatus.Processing;

              const handleCardClick = () => {
                if (isSelectMode) {
                  setSelectedIds((prev) => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]);
                  return;
                }
                if (item.isLocked) {
                  toast.error("Trang phục bị khóa do vượt quá hạn ngạch. Vui lòng nâng cấp gói cước!");
                  return;
                }
                if (isProcessing) {
                  if (isFetching) return;
                  if (spamClickCount.current >= 5) {
                    toast.error("Bạn thao tác quá nhanh, vui lòng chờ trong giây lát!");
                    return;
                  }
                  spamClickCount.current += 1;
                  if (spamClickTimeout.current) clearTimeout(spamClickTimeout.current);
                  spamClickTimeout.current = setTimeout(() => { spamClickCount.current = 0; }, 10000);
                  toast.promise(refetch(), { loading: "Đang làm mới dữ liệu từ AI...", success: "Đã cập nhật kết quả mới nhất!", error: "Lỗi khi tải dữ liệu" });
                  return;
                }
                router.push(`/wardrobe/item/${item.id}`);
              };

              return (
                <div key={item.id} className="wardrobe-card">
                  <WardrobeCard
                    item={item}
                    isLocked={!!item.isLocked}
                    isProcessing={isProcessing}
                    isSelectMode={isSelectMode}
                    isSelected={selectedIds.includes(item.id)}
                    onClick={handleCardClick}
                    getWardrobeItemName={getWardrobeItemName}
                    priority={index < 4}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-8 text-center max-w-md mx-auto">
            <div className="flex size-24 items-center justify-center rounded-2xl bg-accent-soft text-muted-foreground">
              <Tag className="size-10 stroke-1" />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-semibold text-foreground uppercase tracking-tight">Trống</h3>
              <p className="text-xs font-semibold uppercase tracking-widest leading-relaxed text-muted-foreground">
                Tủ đồ của bạn đang trống. Hãy bắt đầu số hóa các món đồ thực tế của bạn để tạo ra những bộ phối đồ mới.
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="mt-4 h-14 rounded-full border-border px-8 text-xs font-semibold uppercase tracking-[0.2em] text-foreground hover:bg-muted">
                  <Plus className="mr-2 size-4" /> Thêm đồ
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[200px] rounded-2xl border border-border bg-card p-2 shadow-xl">
                <DropdownMenuItem onClick={() => router.push("/wardrobe/upload")} className="cursor-pointer rounded-xl px-3 py-2.5 font-semibold text-[11px] uppercase tracking-widest text-foreground hover:bg-muted flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" /> Tự tải lên ảnh
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/wardrobe/explore")} className="cursor-pointer rounded-xl px-3 py-2.5 font-semibold text-[11px] uppercase tracking-widest text-foreground hover:bg-muted mt-1 flex items-center gap-2">
                  <Library className="w-4 h-4" /> Lấy từ thư viện
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {metadata && metadata.totalPages > 1 && (
          <Pagination className="mt-16 border-t border-border pb-12 pt-16">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageParam > 1) updateParams({ page: (pageParam - 1).toString() });
                  }}
                  className={pageParam <= 1 ? "pointer-events-none text-[11px] font-semibold uppercase tracking-widest opacity-50" : "text-[11px] font-semibold uppercase tracking-widest transition-colors hover:text-foreground"}
                  text="TRƯỚC"
                />
              </PaginationItem>
              {[...Array(metadata.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (pageNum === 1 || pageNum === metadata.totalPages || (pageNum >= pageParam - 1 && pageNum <= pageParam + 1)) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink href="#" isActive={pageParam === pageNum} onClick={(e) => { e.preventDefault(); updateParams({ page: pageNum.toString() }); }} className="rounded-xl border-border text-[11px] font-semibold uppercase tracking-widest">
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (pageNum === pageParam - 2 || pageNum === pageParam + 2) return <PaginationItem key={pageNum}><PaginationEllipsis /></PaginationItem>;
                return null;
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageParam < metadata.totalPages) updateParams({ page: (pageParam + 1).toString() });
                  }}
                  className={pageParam >= metadata.totalPages ? "pointer-events-none text-[11px] font-semibold uppercase tracking-widest opacity-50" : "text-[11px] font-semibold uppercase tracking-widest transition-colors hover:text-foreground"}
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
