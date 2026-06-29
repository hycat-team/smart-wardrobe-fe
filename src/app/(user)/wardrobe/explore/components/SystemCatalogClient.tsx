"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useSystemCatalogItems, useInitClosetFromCatalog } from "@/features/wardrobe/queries/wardrobe.queries";
import { useUserCategories } from "@/features/admin/queries/admin.queries";
import { WardrobeItemRes } from "@/features/wardrobe/types";
import { Loader2, Plus, ArrowLeft, Search } from "lucide-react";
import { WardrobeCard } from "../../components/WardrobeCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";



export function SystemCatalogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { data: categoriesData } = useUserCategories();
  const categories = categoriesData || [];

  const categoryParam = searchParams.get("category") || "Tất cả";
  
  let slugToFetch: string | undefined = undefined;
  if (categoryParam !== "Tất cả") {
    const found = categories.find((c: any) => c.name === categoryParam);
    slugToFetch = found ? found.slug : categoryParam;
  }
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const containerRef = useRef<HTMLDivElement>(null);
  const actionBarRef = useRef<HTMLDivElement>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 220);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Queries
  const {
    data,
    isLoading,
  } = useSystemCatalogItems(slugToFetch, searchQuery, pageParam);

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

  const { mutate: initCloset, isPending: isInitializing } = useInitClosetFromCatalog();

  const items = data?.items || [];
  const metadata = data?.metadata;

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleAddSelected = () => {
    if (selectedIds.size === 0) return;
    initCloset(
      { catalogItemIds: Array.from(selectedIds) },
      {
        onSuccess: () => {
          setSelectedIds(new Set());
          router.push("/wardrobe");
        },
      }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    updateParams({ page: "1" });
  };

  // GSAP Animations
  useGSAP(() => {
    // Stagger entry for cards
    if (items.length > 0) {
      gsap.fromTo(
        ".catalog-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.05, ease: "power3.out", duration: 0.6, clearProps: "all" }
      );
    }
  }, { scope: containerRef, dependencies: [items.map((i) => i.id).join(",")] });

  useGSAP(() => {
    // Animate Action Bar up/down
    if (selectedIds.size > 0) {
      gsap.to(actionBarRef.current, {
        y: 0,
        opacity: 1,
        pointerEvents: "auto",
        ease: "back.out(1.5)",
        duration: 0.4,
      });
    } else {
      gsap.to(actionBarRef.current, {
        y: 100,
        opacity: 0,
        pointerEvents: "none",
        ease: "power3.in",
        duration: 0.3,
      });
    }
  }, { dependencies: [selectedIds.size] });

  const getWardrobeItemName = (item: WardrobeItemRes) => item.category?.name || "Trang phục";

  const renderActions = () => (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full bg-background border border-border focus:border-primary focus:ring-0 pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-200 text-xs font-semibold text-foreground placeholder:text-muted-foreground uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="TÌM KIẾM..."
        />
      </form>
    </div>
  );

  return (
    <>
      {/* Sticky Top Action Bar */}
      <div
        className={cn(
          "fixed top-0 left-0 md:left-[280px] right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isScrolled ? "translate-y-0 shadow-sm opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="font-semibold text-2xl text-foreground uppercase tracking-wide">
              Explore
            </span>
          </div>
          {renderActions()}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-8 pb-32 px-4 sm:px-8 lg:px-12 font-sans" ref={containerRef}>
        {/* High-end Editorial Header */}
        <div className="flex flex-col gap-8 pt-8 md:pt-12 border-b border-border pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl flex items-center gap-4">
              {/* <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button> */}
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.1] uppercase">
                  Explore
                </h1>
                <p className="text-[12px] text-muted-foreground font-semibold uppercase tracking-[0.1em] max-w-md leading-relaxed border-l-2 border-primary pl-4 mt-4">
                  Thêm nhanh các trang phục từ hệ thống vào tủ đồ của bạn
                </p>
              </div>
            </div>

            {renderActions()}
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              {[{ name: "Tất cả", slug: "tat-ca" }, ...categories].map((cat: any) => {
                const isActive = categoryParam === cat.name;
                const label = cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => updateParams({ category: cat.name === "Tất cả" ? null : cat.name, page: "1" })}
                    className={cn(
                      "text-[11px] font-semibold uppercase tracking-[0.2em] relative transition-colors duration-200 group pb-2",
                      isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {label}
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300",
                        isActive
                          ? "w-full"
                          : "w-0 group-hover:w-full",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="px-6 py-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex flex-col h-full bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                  <Skeleton className="relative aspect-[4/5] bg-muted p-3 md:p-6 overflow-hidden flex-shrink-0" />
                  <div className="flex flex-col p-3 md:p-4 md:pt-5 flex-grow justify-between gap-2 md:gap-3 bg-card border-t border-border">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4 rounded-full bg-muted" />
                      <Skeleton className="h-3 w-1/2 rounded-full bg-muted mt-2" />
                    </div>
                    <Skeleton className="h-3 w-1/3 rounded-full bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              Không có trang phục nào trong catalog.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {items.map((item) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <div key={item.id} className="catalog-card h-full">
                    <WardrobeCard
                      item={item}
                      isLocked={false}
                      isProcessing={false}
                      isSelectMode={true}
                      isSelected={isSelected}
                      onClick={() => handleToggleSelect(item.id)}
                      getWardrobeItemName={getWardrobeItemName}
                      hideDetails={true}
                      hideTitle={true}
                    />
                  </div>
                );
              })}
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
                      if (pageParam > 1) updateParams({ page: (pageParam - 1).toString() });
                    }}
                    className={pageParam <= 1 ? "pointer-events-none opacity-50 font-semibold text-[11px] uppercase tracking-widest rounded-full" : "font-semibold text-[11px] uppercase tracking-widest rounded-full hover:bg-muted"}
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
                          className={cn(
                            "font-semibold text-[11px] uppercase tracking-widest rounded-full transition-colors",
                            pageParam === pageNum 
                              ? "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent shadow-sm" 
                              : "hover:bg-muted border-transparent"
                          )}
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
                    className={pageParam >= metadata.totalPages ? "pointer-events-none opacity-50 font-semibold text-[11px] uppercase tracking-widest rounded-full" : "font-semibold text-[11px] uppercase tracking-widest rounded-full hover:bg-muted"}
                    text="SAU"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        {/* Floating Action Bar */}
        <div
          ref={actionBarRef}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 translate-y-[100px] opacity-0 pointer-events-none z-50 flex items-center gap-6 bg-background border border-foreground/10 shadow-2xl rounded-full px-6 py-3"
          role="region"
          aria-live="polite"
        >
          <span className="font-inter text-sm font-medium text-foreground">
            Đã chọn <strong className="text-lg mx-1">{selectedIds.size}</strong> item
          </span>
          <button
            onClick={handleAddSelected}
            disabled={isInitializing}
            className="bg-foreground text-background px-6 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
            aria-label="Thêm các mục đã chọn vào tủ đồ"
          >
            {isInitializing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang thêm...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Thêm vào tủ đồ
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
