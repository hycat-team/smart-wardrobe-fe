const fs = require('fs');

const cardCode = `"use client";

import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles, Heart, Trash2, ArrowRight, Shirt } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { OutfitRes as Outfit } from "@/features/outfits/types";

gsap.registerPlugin(useGSAP);

interface OutfitCardProps {
  outfit: Outfit;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  index: number;
}

export function OutfitCard({ outfit, isFavorite, onToggleFavorite, onDelete, index }: OutfitCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: cardRef });

  const itemsInOutfit = outfit.items || [];
  const coverImage = outfit.coverImageUrl || itemsInOutfit[0]?.wardrobeItem?.imageUrl;

  const onMouseEnter = contextSafe(() => {
    gsap.to(imageRef.current, {
      scale: 1.05,
      duration: 1.2,
      ease: "expo.out"
    });
    gsap.to(infoRef.current, {
      y: -4,
      duration: 0.6,
      ease: "power2.out"
    });
  });

  const onMouseLeave = contextSafe(() => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 1,
      ease: "expo.out"
    });
    gsap.to(infoRef.current, {
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  });

  // Decide if this card should be a feature card (spans larger)
  const isFeature = index % 7 === 0;

  return (
    <div
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => router.push(\`/outfits/\${outfit.id}\`)}
      className={cn(
        "group cursor-pointer flex flex-col gap-5",
        isFeature ? "md:col-span-2 md:row-span-2" : "col-span-1"
      )}
    >
      {/* Editorial Image Container */}
      <div className={cn(
        "relative w-full overflow-hidden bg-[#e0dcd5]",
        isFeature ? "aspect-[3/4] md:aspect-[4/3]" : "aspect-[3/4]"
      )}>
        {coverImage ? (
          <Image
            ref={imageRef as any}
            src={coverImage}
            alt={outfit.name || "Outfit"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover mix-blend-multiply opacity-90 transition-opacity duration-700 group-hover:opacity-100"
            priority={index < 4}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Shirt className="size-12 stroke-1 text-ink/20" />
          </div>
        )}

        {/* Minimal Badges */}
        <div className="absolute top-4 left-4 z-10">
          {outfit.status === 1 && (
            <span className="text-[10px] font-mono px-3 py-1 bg-ink text-cream uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="size-3" /> AI
            </span>
          )}
        </div>

        {/* Action overlay (subtle) */}
        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => onToggleFavorite(outfit.id, e)}
            className="p-2.5 bg-cream/80 backdrop-blur hover:bg-cream text-ink hover:text-red-500 rounded-full transition-colors"
          >
            <Heart className={cn("size-4", isFavorite && "fill-red-500 text-red-500")} />
          </button>
          <button 
            onClick={(e) => onDelete(outfit.id, e)}
            className="p-2.5 bg-cream/80 backdrop-blur hover:bg-cream text-ink hover:text-red-500 rounded-full transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Info Area - Magazine Caption Style */}
      <div ref={infoRef} className="flex justify-between items-start gap-4 px-1">
        <div className="space-y-1.5">
          <h3 className={cn(
            "font-heading font-medium text-ink leading-tight",
            isFeature ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
          )}>
            {outfit.name}
          </h3>
          <p className="text-[10px] font-mono text-ink-muted uppercase tracking-[0.2em]">
            {outfit.description || "Everyday Look"}
          </p>
        </div>
        <div className="text-right flex flex-col items-end gap-2 shrink-0">
          <span className="text-[10px] font-mono text-ink/60 uppercase tracking-widest">
            {outfit.createdAt ? new Date(outfit.createdAt).toLocaleDateString("en-GB").replace(/\\//g, '.') : "00.00.00"}
          </span>
          <ArrowRight className="size-4 text-ink opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out" />
        </div>
      </div>
    </div>
  );
}
`;

const clientCode = `"use client";
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
  
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
    toast.success("Saved to your curations.");
  };

  const handleDeleteOutfit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Permanently delete this look?")) {
      try {
        await deleteOutfitMutation.mutateAsync(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFilterChange = (filter: string) => {
    if (gridRef.current) {
      gsap.to(gridRef.current.children, {
        opacity: 0,
        y: 20,
        stagger: 0.02,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          const params = new URLSearchParams(searchParams);
          if (filter === "all") {
            params.delete("filter");
          } else {
            params.set("filter", filter);
          }
          router.push("?" + params.toString(), { scroll: false });
        }
      });
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
          stagger: 0.08,
          duration: 1,
          ease: "expo.out",
          clearProps: "all"
        }
      );
    }
  }, { dependencies: [filteredAndSortedOutfits], scope: containerRef });

  return (
    <div ref={containerRef} className="max-w-[1400px] mx-auto space-y-16 pb-32 px-4 sm:px-8 lg:px-12 font-sans selection:bg-ink selection:text-cream">
      
      {/* High-end Editorial Header */}
      <div className="flex flex-col gap-12 pt-16 md:pt-24 border-b border-ink/10 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6 max-w-2xl">
            <h1 className="text-6xl md:text-8xl lg:text-[140px] font-heading font-medium tracking-tighter text-ink leading-[0.85] uppercase">
              Curations
            </h1>
            <p className="text-sm md:text-base text-ink-muted font-mono uppercase tracking-[0.2em] max-w-md leading-relaxed border-l border-ink/20 pl-4">
              An archive of your personal style. 
              {outfits.length > 0 ? \` Documenting \${outfits.length} looks.\` : " Start composing your wardrobe."}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            <Button
              onClick={() => router.push("/ai-stylist")}
              variant="outline"
              className="rounded-none border-ink text-ink hover:bg-ink hover:text-cream text-xs font-mono tracking-[0.15em] h-14 px-8 transition-colors uppercase"
            >
              <Sparkles className="mr-2 size-4" /> AI Generate
            </Button>

            <Button 
              onClick={() => router.push("/outfits/create")}
              className="rounded-none bg-ink text-cream hover:bg-ink/80 text-xs font-mono tracking-[0.15em] h-14 px-8 transition-colors uppercase"
            >
              <Plus className="mr-2 size-4" /> Compose Look
            </Button>
          </div>
        </div>

        {/* Filters & Sorting - Magazine Index Style */}
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
                  "text-xs font-mono uppercase tracking-[0.2em] relative transition-colors group",
                  filterParam === tab.value 
                    ? "text-ink font-bold" 
                    : "text-ink-muted hover:text-ink"
                )}
              >
                {tab.label}
                <span className={cn(
                  "absolute -bottom-2 left-0 h-[1px] bg-ink transition-all duration-300",
                  filterParam === tab.value ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 border border-ink/20 px-4 py-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-muted">Sort</span>
            <select 
              value={sortParam}
              onChange={(e) => setSortParam(e.target.value as SortOption)}
              className="bg-transparent text-xs font-mono uppercase tracking-widest text-ink font-bold focus:outline-none focus:ring-0 cursor-pointer appearance-none"
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
          <div className="size-24 border border-ink/20 border-t-ink rounded-full animate-spin" />
          <p className="text-[10px] text-ink-muted font-mono tracking-[0.3em] uppercase">Curating Archive...</p>
        </div>
      ) : filteredAndSortedOutfits.length > 0 ? (
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 auto-rows-fr"
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
          <div className="size-24 bg-[#e0dcd5] flex items-center justify-center text-ink/40">
            <Shirt className="size-10 stroke-1" />
          </div>
          <div className="space-y-4">
            <h3 className="font-heading text-4xl text-ink uppercase tracking-tight">Void</h3>
            <p className="text-xs font-mono uppercase tracking-widest text-ink-muted leading-relaxed">
              No looks match your current filter. Return to the index or compose a new look.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => handleFilterChange("all")} 
            className="rounded-none border-ink text-ink hover:bg-ink hover:text-cream text-xs font-mono tracking-[0.2em] uppercase h-14 px-8 mt-4"
          >
            Clear Filters
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
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('d:\\\\Project\\\\smart-wardrobe\\\\smart-wardrobe-fe\\\\src\\\\app\\\\(user)\\\\outfits\\\\components\\\\OutfitCard.tsx', cardCode, 'utf8');
fs.writeFileSync('d:\\\\Project\\\\smart-wardrobe\\\\smart-wardrobe-fe\\\\src\\\\app\\\\(user)\\\\outfits\\\\components\\\\OutfitsClient.tsx', clientCode, 'utf8');

console.log('Design updated');
