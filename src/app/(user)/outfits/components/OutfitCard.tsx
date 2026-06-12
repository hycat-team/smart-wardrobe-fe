"use client";

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

  return (
    <div
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => router.push(`/outfits/${outfit.id}`)}
      className="group cursor-pointer flex flex-col gap-5 col-span-1"
    >
      {/* Editorial Image Container */}
      <div className="relative w-full overflow-hidden bg-[#e0dcd5] aspect-[3/4]">
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
          <h3 className="font-heading font-medium text-ink leading-tight text-xl md:text-2xl">
            {outfit.name}
          </h3>
          <p className="text-[10px] font-mono text-ink-muted uppercase tracking-[0.2em]">
            {outfit.description || "Everyday Look"}
          </p>
        </div>
        <div className="text-right flex flex-col items-end gap-2 shrink-0">
          <span className="text-[10px] font-mono text-ink/60 uppercase tracking-widest">
            {outfit.createdAt ? new Date(outfit.createdAt).toLocaleDateString("en-GB").replace(/\//g, '.') : "00.00.00"}
          </span>
          <ArrowRight className="size-4 text-ink opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out" />
        </div>
      </div>
    </div>
  );
}
