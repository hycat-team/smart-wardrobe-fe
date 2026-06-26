"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles, Heart, Trash2, ArrowRight, Shirt } from "lucide-react";
import { cn } from "@/lib/utils";
import { OutfitRes as Outfit } from "@/features/outfits/types";
interface OutfitCardProps {
  outfit: Outfit;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  index: number;
}
export function OutfitCard({
  outfit,
  isFavorite,
  onToggleFavorite,
  onDelete,
  index,
}: OutfitCardProps) {
  const router = useRouter();
  const itemsInOutfit = outfit.items || [];
  const coverImage = outfit.coverImageUrl || itemsInOutfit[0]?.wardrobeItem?.imageUrl;
  return (
    <div
      onClick={() => router.push(`/outfits/${outfit.id}`)}
      className="group flex flex-col h-full cursor-pointer relative bg-[#F8F7F5] border border-black/5 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out"
    >
      {" "}
      {/* Image Area - Keep old image styling but in new card design */}{" "}
      <div className="relative w-full overflow-hidden bg-[#e0dcd5] aspect-[3/4] flex-shrink-0">
        {" "}
        {coverImage ? (
          <Image
            src={coverImage}
            alt={outfit.name || "Outfit"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover mix-blend-multiply opacity-90 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.02]"
            priority={index < 4}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {" "}
            <Shirt className="size-12 stroke-1 text-black/20" />{" "}
          </div>
        )}{" "}
        {/* Minimal Badges */}{" "}
        <div className="absolute top-4 left-4 z-10">
          {" "}
          {outfit.status === 1 && (
            <span className="text-[9px] font-sans px-3 py-1.5 bg-[#111] text-white flex items-center gap-1.5">
              {" "}
              <Sparkles className="size-3" /> AI{" "}
            </span>
          )}{" "}
        </div>{" "}
        {/* Action overlay (subtle) */}{" "}
        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {" "}
          <button
            onClick={(e) => onToggleFavorite(outfit.id, e)}
            className="text-black/40 hover:text-black transition-colors"
          >
            {" "}
            <Heart className={cn("size-5", isFavorite && "fill-red-500 text-red-500")} />{" "}
          </button>{" "}
          <button
            onClick={(e) => onDelete(outfit.id, e)}
            className="text-black/40 hover:text-red-500 transition-colors"
          >
            {" "}
            <Trash2 className="size-5" />{" "}
          </button>{" "}
        </div>{" "}
        {/* Hover View Details */}{" "}
        <div className="absolute inset-0 bg-white/92 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col items-center justify-end pb-8 pointer-events-none">
          {" "}
          <div className="flex flex-col items-center gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 delay-75">
            {" "}
            <span className="font-sans text-[9px] text-[#666]">
              {" "}
              {itemsInOutfit.length} Items{" "}
            </span>{" "}
            <span className="font-sans text-[9px] text-[#666]">
              {" "}
              {outfit.description || "Everyday Look"}{" "}
            </span>{" "}
          </div>{" "}
          <div className="text-black font-sans text-[11px] border-b border-black pb-0.5">
            {" "}
            View Details{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Information Area - 25% Visual Weight */}{" "}
      <div className="flex flex-col p-3 md:p-4 md:pt-5 flex-grow justify-between gap-2 md:gap-3 bg-white border-t border-black/5">
        {" "}
        <div>
          {" "}
          <h3 className="font-sans text-[22px] font-medium leading-[130%] text-[#111] line-clamp-2">
            {" "}
            {outfit.name}{" "}
          </h3>{" "}
          <p className="font-sans text-[11px] text-[#666] mt-2 truncate">
            {" "}
            {outfit.description || "Curated Outfit"}{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex justify-between items-center font-sans text-[11px] text-[#888]">
          {" "}
          <span>{itemsInOutfit.length} Pieces</span>{" "}
          <span>
            {outfit.createdAt
              ? new Date(outfit.createdAt).toLocaleDateString("en-GB").replace(/\//g, ".")
              : "00.00.00"}
          </span>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
