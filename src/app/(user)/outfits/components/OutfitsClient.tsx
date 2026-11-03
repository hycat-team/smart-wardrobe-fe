"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, Sparkles, Shirt } from "lucide-react";
import { toast } from "sonner";
import { useMyOutfits, useDeleteOutfit } from "@/features/outfits/queries/outfits.queries";
import { OutfitRes as Outfit } from "@/features/outfits/types";
import { OutfitCardV2 } from "./OutfitCardV2";
import { useSidebarStore } from "@/store/useSidebarStore";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { PaginationResult } from "@/types/api";

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
import { Skeleton } from "@/components/ui/skeleton";

gsap.registerPlugin(useGSAP);

interface OutfitsClientProps {
  initialData?: PaginationResult<Outfit> | null;
}

export function OutfitsClient({ initialData }: OutfitsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const { data, isLoading, isFetching } = useMyOutfits(pageParam);

  const currentData = data || initialData;
  const outfits = currentData?.items || [];
  const metadata = currentData?.metadata;

  const deleteOutfitMutation = useDeleteOutfit();

  const [outfitToDelete, setOutfitToDelete] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

  // The list endpoint only supports page/limit and always returns newest first
  // (ORDER BY created_at DESC), so there is intentionally no client-side
  // sort/filter/search here.
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 220);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useGSAP(() => {
    if (outfits.length > 0 && !isFetching) {
      gsap.fromTo(
        ".outfit-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.05, ease: "power3.out", duration: 0.6, clearProps: "all" }
      );
    }
  }, { dependencies: [outfits.length, isFetching], scope: containerRef });

  const renderActions = () => (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
      <button
        onClick={() => router.push("/ai-stylist")}
        className="h-11 px-6 border border-border text-foreground font-semibold text-[11px] uppercase tracking-widest hover:border-foreground rounded-full transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <Sparkles className="size-3.5" /> Tạo bằng AI
      </button>

      <button
        onClick={() => router.push("/outfits/create")}
        className="h-11 px-8 bg-primary text-primary-foreground font-semibold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 rounded-full transition-colors duration-200"
      >
        <Plus className="size-4" /> Tạo Bộ Phối
      </button>
    </div>
  );

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCollapsed ? "md:left-[88px]" : "md:left-[280px]"
        } ${
          isScrolled
            ? "translate-y-0 shadow-sm opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="font-semibold text-2xl text-foreground uppercase tracking-wide">
              TRANG PHỤC
            </span>
          </div>
          {renderActions()}
        </div>
      </div>

      <div ref={containerRef} className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 w-full pb-24 text-foreground">
        <div className="flex flex-col gap-8 pt-8 md:pt-12 border-b border-border pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.1] uppercase whitespace-nowrap">
                TRANG PHỤC
              </h1>
              <p className="text-[12px] text-muted-foreground font-semibold uppercase tracking-[0.1em] max-w-md leading-relaxed border-l-2 border-border pl-4">
                Kho lưu trữ phong cách cá nhân của bạn. <br />
                {(metadata?.totalItems ?? outfits.length) > 0
                  ? ` Đang lưu trữ ${metadata?.totalItems ?? outfits.length} bộ phối.`
                  : " Hãy bắt đầu tạo bộ phối của bạn."}
              </p>
            </div>
            {renderActions()}
          </div>
        </div>

        {isLoading && !outfits.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border">
                <Skeleton className="relative w-full aspect-[3/4] bg-muted/60 overflow-hidden flex-shrink-0 rounded-none" />
                <div className="flex flex-col p-3 md:p-4 md:pt-5 flex-grow justify-between gap-2 md:gap-3 border-t border-border">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4 rounded-full bg-muted/60" />
                    <Skeleton className="h-3 w-1/2 rounded-full bg-muted/60 mt-2" />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <Skeleton className="h-3 w-1/4 rounded-full bg-muted/60" />
                    <Skeleton className="h-3 w-1/4 rounded-full bg-muted/60" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : outfits.length > 0 ? (
          <div
            ref={gridRef}
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8 transition-all duration-300 ${isFetching ? "opacity-60 blur-[1px]" : ""}`}
          >
            {outfits.map((outfit: Outfit, index: number) => (
              <div key={outfit.id} className="outfit-card h-full">
                <OutfitCardV2
                  outfit={outfit}
                  index={index}
                  onDelete={handleDeleteOutfit}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[460px] py-12 space-y-8 text-center max-w-md mx-auto">
            <div className="size-20 bg-muted border border-border rounded-2xl flex items-center justify-center text-muted-foreground">
              <Shirt className="size-8 stroke-1" />
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-3xl text-foreground uppercase tracking-tight">
                Chưa có bộ phối
              </h3>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground leading-relaxed">
                Kho trang phục của bạn đang trống. Hãy tạo bộ phối mới với AI Stylist hoặc tự phối thủ công.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => router.push("/ai-stylist")}
                className="h-11 px-6 border border-border text-foreground font-semibold text-[11px] uppercase tracking-widest hover:border-foreground rounded-full transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Sparkles className="size-3.5" /> Tạo bằng AI
              </button>
              <button
                onClick={() => router.push("/outfits/create")}
                className="h-11 px-8 bg-primary text-primary-foreground font-semibold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 rounded-full transition-colors duration-200"
              >
                <Plus className="size-4" /> Tạo Bộ Phối
              </button>
            </div>
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
                  className={pageParam <= 1 ? "pointer-events-none opacity-50 font-semibold text-[11px] uppercase tracking-widest" : "font-semibold text-[11px] uppercase tracking-widest transition-colors hover:text-foreground"}
                  text="TRƯỚC"
                />
              </PaginationItem>

              {[...Array(metadata.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (pageNum === 1 || pageNum === metadata.totalPages || (pageNum >= pageParam - 1 && pageNum <= pageParam + 1)) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={pageParam === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          updateParams({ page: pageNum.toString() });
                        }}
                        className="font-semibold text-[11px] uppercase tracking-widest rounded-full border-border"
                      >
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
                  className={pageParam >= metadata.totalPages ? "pointer-events-none opacity-50 font-semibold text-[11px] uppercase tracking-widest" : "font-semibold text-[11px] uppercase tracking-widest transition-colors hover:text-foreground"}
                  text="SAU"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <AlertDialog open={!!outfitToDelete} onOpenChange={(open) => !open && setOutfitToDelete(null)}>
          <AlertDialogContent className="rounded-2xl border border-border bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-semibold text-2xl text-foreground">Xóa Bộ Phối</AlertDialogTitle>
              <AlertDialogDescription className="font-semibold text-[12px] text-muted-foreground leading-relaxed">
                Bạn có chắc chắn muốn xóa bộ phối này khỏi lưu trữ vĩnh viễn không? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex gap-4">
              <AlertDialogCancel className="rounded-full border border-border bg-card font-semibold text-[11px] uppercase tracking-widest flex-1 hover:bg-muted transition-colors m-0">HỦY BỎ</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold text-[11px] uppercase tracking-widest flex-1 transition-colors m-0"
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
