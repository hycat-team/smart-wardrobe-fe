"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useSystemCatalogItems, useInitClosetFromCatalog } from "@/features/wardrobe/queries/wardrobe.queries";
import { WardrobeItemRes } from "@/features/wardrobe/types";
import { Loader2, Plus, ArrowLeft, Search } from "lucide-react";
import { WardrobeCard } from "../../components/WardrobeCard";
import { Skeleton } from "@heroui/react";

export function SystemCatalogClient() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const actionBarRef = useRef<HTMLDivElement>(null);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Queries
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSystemCatalogItems(undefined, searchQuery);

  const { mutate: initCloset, isPending: isInitializing } = useInitClosetFromCatalog();

  const items = data?.pages.flatMap((page) => page.items) || [];

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
  }, { scope: containerRef, dependencies: [items.length] });

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

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-32 px-4 sm:px-8 lg:px-12 font-sans" ref={containerRef}>
      {/* High-end Editorial Header */}
      <div className="flex flex-col gap-8 pt-8 md:pt-12 border-b border-black/10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl flex items-center gap-4">
            {/* <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-[#F8F7F5] rounded-full transition-colors text-[#666] hover:text-[#111]"
              aria-label="Back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button> */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-medium text-[#111] leading-[1.1] uppercase">
                Explore
              </h1>
              <p className="text-[12px] text-[#666] font-['IBM_Plex_Mono'] uppercase tracking-[0.1em] max-w-md leading-relaxed border-l-2 border-black/10 pl-4 mt-4">
                Thêm nhanh các item từ hệ thống vào tủ đồ của bạn
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] size-4" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[#F8F7F5] border border-black/10 focus:border-black focus:ring-0 pl-10 pr-4 py-3 rounded-none outline-none transition-all font-['IBM_Plex_Mono'] text-[11px] text-[#111] placeholder:text-[#888] uppercase tracking-widest"
                placeholder="TÌM KIẾM..."
              />
            </form>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {[...Array(10)].map((_, i) => (
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
                  />
                </div>
              );
            })}
          </div>
        )}

        {hasNextPage && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-2 rounded-full border border-border hover:border-foreground hover:bg-muted transition-colors text-foreground font-medium text-sm flex items-center gap-2"
              aria-label="Tải thêm trang phục"
            >
              {isFetchingNextPage ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Tải thêm
            </button>
          </div>
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
  );
}
