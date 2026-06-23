"use client";
import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Sparkles, Shirt, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMyOutfits, useDeleteOutfit } from "@/features/outfits/queries/outfits.queries";
import { OutfitRes as Outfit } from "@/features/outfits/types";
import { OutfitCard } from "./OutfitCard";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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

gsap.registerPlugin(useGSAP);

interface OutfitsClientProps {
  initialOutfits?: Outfit[];
}

type SortOption = "Mới Nhất" | "Cũ Nhất"

export function OutfitsClient({ initialOutfits }: OutfitsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter") || "all";

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const { data, isLoading } = useMyOutfits(pageParam);
  const rawInitialOutfits = Array.isArray(initialOutfits) ? initialOutfits : ((initialOutfits as any)?.items || []);
  const outfits = data ? data.items : rawInitialOutfits;
  const metadata = data?.metadata;
  const deleteOutfitMutation = useDeleteOutfit();

  const searchParam = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(searchParam);
  const lastPushedQ = useRef(searchParam);

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [sortParam, setSortParam] = useState<SortOption>("Mới Nhất");
  const [outfitToDelete, setOutfitToDelete] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 220);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        const params = new URLSearchParams(searchParams);
        if (searchInput) {
          params.set("q", searchInput);
        } else {
          params.delete("q");
        }
        params.set("page", "1");
        router.push("?" + params.toString(), { scroll: false });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput, searchParam, searchParams, router]);

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
    toast.success("Đã lưu vào bộ sưu tập.");
  };

  const handleDeleteOutfit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOutfitToDelete(id);
  };

  const confirmDelete = async () => {
    if (!outfitToDelete) return;
    try {
      await deleteOutfitMutation.mutateAsync(outfitToDelete);
    } catch (err) {
      console.error(err);
    } finally {
      setOutfitToDelete(null);
    }
  };

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    params.set("page", "1");
    router.push("?" + params.toString(), { scroll: false });
  };

  const filteredAndSortedOutfits = useMemo(() => {
    const filtered = outfits.filter((o: Outfit) => {
      const isFavorite = favorites[o.id] || false;
      if (filterParam === "all") {}
      else if (filterParam === "ai" && o.status !== 1) return false;
      else if (filterParam === "manual" && o.status !== 0 && o.status !== 2) return false;
      else if (filterParam === "saved" && !isFavorite) return false;

      if (searchParam) {
        const q = searchParam.toLowerCase();
        const matchName = o.name?.toLowerCase().includes(q);
        const matchDesc = o.description?.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });

    return filtered.sort((a: Outfit, b: Outfit) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortParam === "Mới Nhất" ? dateB - dateA : dateA - dateB;
    });
  }, [outfits, filterParam, favorites, sortParam, searchParam]);

  useGSAP(() => {
    if (filteredAndSortedOutfits.length > 0) {
      gsap.fromTo(
        ".outfit-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.05, ease: "power3.out", duration: 0.6, clearProps: "all" }
      );
    }
  }, { dependencies: [filteredAndSortedOutfits], scope: containerRef });

  const renderActions = () => (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
      {/* Search Input */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchInput) params.set("q", searchInput);
        else params.delete("q");
        params.set("page", "1");
        router.push("?" + params.toString(), { scroll: false });
      }} className="relative w-full sm:w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] size-4" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full bg-[#F8F7F5] border border-black/10 focus:border-black focus:ring-0 pl-10 pr-4 py-3 rounded-none outline-none transition-all font-['IBM_Plex_Mono'] text-[11px] text-[#111] placeholder:text-[#888] uppercase tracking-widest"
          placeholder="TÌM KIẾM..."
        />
      </form>

      <button
        onClick={() => router.push("/ai-stylist")}
        className="h-12 px-6 border border-[#E5E5E5] text-[#111] font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest hover:border-[#111] transition-colors flex items-center justify-center gap-2"
      >
        <Sparkles className="size-3.5" /> Tạo bằng AI
      </button>

      <button
        onClick={() => router.push("/outfits/create")}
        className="h-12 px-8 bg-[#111] text-white font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/80 transition-colors"
      >
        <Plus className="size-4" /> Tạo Bộ Phối
      </button>
    </div>
  );

  return (
    <>
      {/* Sticky Top Action Bar */}
      <div 
        className={cn(
          "fixed top-0 left-0 md:left-[280px] right-0 z-40 bg-[#F4F1EE]/80 dark:bg-[#111]/80 backdrop-blur-xl border-b border-black/10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isScrolled ? "translate-y-0 shadow-sm opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="font-['Playfair_Display'] font-medium text-2xl text-[#111] uppercase tracking-wide">
              Curations
            </span>
          </div>
          {renderActions()}
        </div>
      </div>

      <div ref={containerRef} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full pb-24 text-[#111]">
        {/* High-end Editorial Header */}
      <div className="flex flex-col gap-8 pt-8 md:pt-12 border-b border-black/10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            {/* <h1 className="text-5xl md:text-6xl lg:text-[100px] font-heading font-medium tracking-tighter text-ink leading-[0.85] uppercase">
              Curations
            </h1> */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-medium text-[#111] leading-[1.1] uppercase">
              Curations
            </h1>
            <p className="text-[12px] text-[#666] font-['IBM_Plex_Mono'] uppercase tracking-[0.1em] max-w-md leading-relaxed border-l-2 border-black/10 pl-4">
              Kho lưu trữ phong cách cá nhân của bạn.
              {outfits.length > 0 ? ` Đang lưu trữ ${outfits.length} bộ phối.` : " Hãy bắt đầu tạo bộ phối của bạn."}
            </p>
          </div>

          {renderActions()}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            {[
              { label: "Tất cả", value: "all" },
              { label: "Tạo bởi AI", value: "ai" },
              { label: "Thủ công", value: "manual" },
              { label: "Đã lưu", value: "saved" }
            ].map(tab => {
              const isActive = filterParam === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleFilterChange(tab.value)}
                  className={cn(
                    "relative pb-2 px-1 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors group",
                    isActive ? "text-[#111] font-bold" : "text-[#888] hover:text-[#111] font-medium"
                  )}
                >
                  {tab.label}
                  <span className={cn(
                    "absolute bottom-0 left-0 h-[2px] bg-[#111] transition-all duration-300",
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-6">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#888] uppercase tracking-[0.15em]">Sort:</span>
              <Select value={sortParam} onValueChange={(value) => setSortParam(value as SortOption)}>
                <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-[11px] font-mono uppercase tracking-widest text-[#111] font-medium w-auto gap-1">
                  <SelectValue placeholder="Mới nhất" />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-none border-black/10 bg-white">
                  <SelectItem value="Mới Nhất" className="font-mono text-[11px] uppercase tracking-widest hover:bg-black/5">Mới nhất</SelectItem>
                  <SelectItem value="Cũ Nhất" className="font-mono text-[11px] uppercase tracking-widest hover:bg-black/5">Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Outfits Grid */}
      {isLoading && !outfits.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col h-full bg-[#F8F7F5] border border-black/5">
              <Skeleton className="relative w-full aspect-[3/4] bg-muted/60 overflow-hidden flex-shrink-0 rounded-none" />
              <div className="flex flex-col p-3 md:p-4 md:pt-5 flex-grow justify-between gap-2 md:gap-3 bg-white border-t border-black/5">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4 rounded-none bg-muted/60" />
                  <Skeleton className="h-3 w-1/2 rounded-none bg-muted/60 mt-2" />
                </div>
                <div className="flex justify-between items-center mt-3">
                  <Skeleton className="h-3 w-1/4 rounded-none bg-muted/60" />
                  <Skeleton className="h-3 w-1/4 rounded-none bg-muted/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAndSortedOutfits.length > 0 ? (
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8"
        >
          {filteredAndSortedOutfits.map((outfit: Outfit, index: number) => (
            <div key={outfit.id} className="outfit-card h-full">
              <OutfitCard
                outfit={outfit}
                index={index}
                isFavorite={favorites[outfit.id] || false}
                onToggleFavorite={toggleFavorite}
                onDelete={handleDeleteOutfit}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-8 text-center max-w-md mx-auto">
          <div className="size-20 bg-[#F7F6F4] border border-[#E5E5E5] flex items-center justify-center text-[#A3A3A3]">
            <Shirt className="size-8 stroke-1" />
          </div>
          <div className="space-y-4">
            <h3 className="font-['Playfair_Display'] text-3xl text-[#111] uppercase tracking-tight">Trống</h3>
            <p className="text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-widest text-[#666] leading-relaxed">
              Không có bộ phối nào phù hợp với bộ lọc hiện tại. Hãy chọn tất cả hoặc tạo bộ phối mới.
            </p>
          </div>
          <button
            onClick={() => handleFilterChange("all")}
            className="h-12 px-8 border border-[#111] text-[#111] font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors mt-4"
          >
            Xóa Bộ Lọc
          </button>
        </div>
      )}

      {metadata && metadata.totalPages > 1 && (
        <Pagination className="mt-16 pb-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pageParam > 1) {
                    const params = new URLSearchParams(searchParams);
                    params.set("page", (pageParam - 1).toString());
                    router.push("?" + params.toString(), { scroll: false });
                  }
                }}
                className={pageParam <= 1 ? "pointer-events-none opacity-50 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest" : "font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest"}
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
                        const params = new URLSearchParams(searchParams);
                        params.set("page", pageNum.toString());
                        router.push("?" + params.toString(), { scroll: false });
                      }}
                      className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest rounded-none border-black/10"
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
                  if (pageParam < metadata.totalPages) {
                    const params = new URLSearchParams(searchParams);
                    params.set("page", (pageParam + 1).toString());
                    router.push("?" + params.toString(), { scroll: false });
                  }
                }}
                className={pageParam >= metadata.totalPages ? "pointer-events-none opacity-50 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest" : "font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest"}
                text="SAU"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Delete Confirmation Popup */}
      <AlertDialog open={!!outfitToDelete} onOpenChange={(open) => !open && setOutfitToDelete(null)}>
        <AlertDialogContent className="rounded-none border border-black/10 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-['Playfair_Display'] text-2xl font-medium text-[#111]">Xóa Bộ Phối</AlertDialogTitle>
            <AlertDialogDescription className="font-['IBM_Plex_Mono'] text-[12px] text-[#666] leading-relaxed">
              Bạn có chắc chắn muốn xóa bộ phối này khỏi lưu trữ vĩnh viễn không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex gap-4">
            <AlertDialogCancel className="rounded-none border border-black/10 bg-white font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest flex-1 hover:bg-[#F8F7F5] transition-colors m-0">HỦY BỎ</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-none bg-red-600 text-white hover:bg-red-700 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest flex-1 transition-colors m-0"
            >
              ĐỒNG Ý XÓA
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      </div>
    </>
  );
}
