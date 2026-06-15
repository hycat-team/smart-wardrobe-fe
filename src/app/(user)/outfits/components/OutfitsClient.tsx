"use client";
import { useState, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Sparkles, Shirt } from "lucide-react";
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

gsap.registerPlugin(useGSAP);

interface OutfitsClientProps {
  initialOutfits?: Outfit[];
}

type SortOption = "newest" | "oldest";

export function OutfitsClient({ initialOutfits }: OutfitsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter") || "all";
  
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useMyOutfits();
  const rawInitialOutfits = Array.isArray(initialOutfits) ? initialOutfits : ((initialOutfits as any)?.items || []);
  const outfits = data ? data.pages.flatMap(p => p.items) : rawInitialOutfits;
  const deleteOutfitMutation = useDeleteOutfit();

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [sortParam, setSortParam] = useState<SortOption>("newest");
  const [outfitToDelete, setOutfitToDelete] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
    toast.success("Saved to your curations.");
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
    const changeRoute = () => {
      const params = new URLSearchParams(searchParams);
      if (filter === "all") {
        params.delete("filter");
      } else {
        params.set("filter", filter);
      }
      router.push("?" + params.toString(), { scroll: false });
    };

    if (gridRef.current && gridRef.current.children.length > 0) {
      gsap.to(gridRef.current.children, {
        opacity: 0,
        y: 20,
        stagger: 0.02,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: changeRoute
      });
    } else {
      changeRoute();
    }
  };

  const filteredAndSortedOutfits = useMemo(() => {
    const filtered = outfits.filter((o: Outfit) => {
      const isFavorite = favorites[o.id] || false;
      if (filterParam === "all") return true;
      if (filterParam === "ai") return o.status === 1; 
      if (filterParam === "manual") return o.status === 0 || o.status === 2;
      if (filterParam === "saved") return isFavorite;
      return true;
    });

    return filtered.sort((a: Outfit, b: Outfit) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortParam === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [outfits, filterParam, favorites, sortParam]);

  useGSAP(() => {
    if (gridRef.current && filteredAndSortedOutfits.length > 0) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.04,
          duration: 0.8,
          ease: "expo.out",
          clearProps: "all"
        }
      );
    }
  }, { dependencies: [filteredAndSortedOutfits], scope: containerRef });

  return (
    <div ref={containerRef} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full pb-24 text-[#111]">
      
      {/* High-end Editorial Header */}
      <div className="flex flex-col gap-8 pt-8 md:pt-12 border-b border-black/10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-medium text-[#111] leading-[1.1]">
              Curations
            </h1>
            <p className="text-[12px] text-[#666] font-['IBM_Plex_Mono'] uppercase tracking-[0.1em] max-w-md leading-relaxed border-l-2 border-black/10 pl-4">
              An archive of your personal style. 
              {outfits.length > 0 ? ` Documenting ${outfits.length} looks.` : " Start composing your wardrobe."}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => router.push("/ai-stylist")}
              className="h-12 px-6 border border-[#E5E5E5] text-[#111] font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest hover:border-[#111] transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="size-3.5" /> AI Generate
            </button>

            <button 
              onClick={() => router.push("/outfits/create")}
              className="h-12 px-8 bg-[#111] text-white font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/80 transition-colors"
            >
              <Plus className="size-4" /> Compose Look
            </button>
          </div>
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-4">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {[
              { label: "Index", value: "all" },
              { label: "AI Assisted", value: "ai" },
              { label: "Manual", value: "manual" },
              { label: "Archive", value: "saved" }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => handleFilterChange(tab.value)}
                className={cn(
                  "text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-[0.12em] relative transition-colors group pb-1",
                  filterParam === tab.value 
                    ? "text-[#111] font-medium border-b border-[#111]" 
                    : "text-[#666] hover:text-[#111] border-b border-transparent hover:border-[#111]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 border border-black/10 px-4 py-2 bg-[#F8F7F5]">
            <span className="text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-[0.2em] text-[#888]">Sort</span>
            <select 
              value={sortParam}
              onChange={(e) => setSortParam(e.target.value as SortOption)}
              className="bg-transparent text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-widest text-[#111] font-medium focus:outline-none focus:ring-0 cursor-pointer appearance-none"
            >
              <option value="newest">Latest</option>
              <option value="oldest">Earliest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Outfits Grid */}
      {isLoading && !outfits.length ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
          <div className="size-10 border border-[#111] border-t-transparent rounded-full animate-spin" />
          <p className="text-[11px] text-[#666] font-['IBM_Plex_Mono'] tracking-[0.2em] uppercase animate-pulse">Curating Archive...</p>
        </div>
      ) : filteredAndSortedOutfits.length > 0 ? (
        <div 
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8"
        >
          {filteredAndSortedOutfits.map((outfit: Outfit, index: number) => (
            <OutfitCard 
              key={outfit.id} 
              outfit={outfit} 
              index={index}
              isFavorite={favorites[outfit.id] || false}
              onToggleFavorite={toggleFavorite}
              onDelete={handleDeleteOutfit}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-8 text-center max-w-md mx-auto">
          <div className="size-20 bg-[#F7F6F4] border border-[#E5E5E5] flex items-center justify-center text-[#A3A3A3]">
            <Shirt className="size-8 stroke-1" />
          </div>
          <div className="space-y-4">
            <h3 className="font-['Playfair_Display'] text-3xl text-[#111] uppercase tracking-tight">Void</h3>
            <p className="text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-widest text-[#666] leading-relaxed">
              No looks match your current filter. Return to the index or compose a new look.
            </p>
          </div>
          <button 
            onClick={() => handleFilterChange("all")} 
            className="h-12 px-8 border border-[#111] text-[#111] font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors mt-4"
          >
            Clear Filters
          </button>
        </div>
      )}
      
      {hasNextPage && (
        <div className="mt-16 flex justify-center border-t border-black/10 pt-12">
          <button 
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-[11px] font-['IBM_Plex_Mono'] tracking-[0.2em] uppercase text-[#666] hover:text-[#111] disabled:opacity-50 transition-colors border-b border-transparent hover:border-[#111] pb-1"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      <AlertDialog open={!!outfitToDelete} onOpenChange={(open) => !open && setOutfitToDelete(null)}>
        <AlertDialogContent className="rounded-none border border-black/10 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-['Playfair_Display'] text-2xl font-medium text-[#111]">Void Look</AlertDialogTitle>
            <AlertDialogDescription className="font-['IBM_Plex_Mono'] text-[12px] text-[#666] leading-relaxed">
              Are you sure you want to permanently delete this look from your archive? This action cannot be undone.
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
  );
}
