import { Check, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { WardrobeItemRes as WardrobeItem } from "@/features/wardrobe/types";
import { applyCloudinaryTrim } from "@/lib/cloudinary";

interface WardrobeCardProps {
  item: WardrobeItem;
  isLocked: boolean;
  isProcessing: boolean;
  isSelectMode: boolean;
  isSelected: boolean;
  onClick: () => void;
  getWardrobeItemName: (item: WardrobeItem) => string;
}

export function WardrobeCard({
  item,
  isLocked,
  isProcessing,
  isSelectMode,
  isSelected,
  onClick,
  getWardrobeItemName,
}: WardrobeCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex flex-col cursor-pointer relative bg-[#F8F7F5] border border-black/5 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out",
        isSelectMode && isSelected && "border-2 border-[#111] shadow-none hover:translate-y-0",
        isLocked && "opacity-75"
      )}
    >
      {/* Image Area - 75% Visual Weight */}
      <div className="relative aspect-[4/5] bg-[#F7F6F4] p-[24px] overflow-hidden flex-shrink-0">
        <img
          alt={getWardrobeItemName(item)}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-250 group-hover:scale-[1.02]"
          src={applyCloudinaryTrim(item.imageUrl || undefined)}
        />
        
        {/* Selection State */}
        {isSelectMode ? (
          <div className="absolute top-4 right-4 z-20">
            {isSelected && (
              <div className="bg-[#111] text-white flex items-center justify-center size-5">
                <Check className="size-3.5" />
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Color Indicator */}
            {item.colorHex && (
              <div className="absolute top-4 right-4 z-10 transition-opacity duration-300 group-hover:opacity-0">
                <div
                  className="w-[14px] h-[14px] rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: item.colorHex }}
                  title={item.color || "Màu sắc"}
                />
              </div>
            )}
            
            {/* Hover Actions */}
            {!isLocked && !isProcessing && (
              <>
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="text-black/40 hover:text-black transition-colors" title="Save / Favorite">
                    <Heart className="size-5" />
                  </button>
                </div>
                
                <div className="absolute inset-0 bg-white/92 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col items-center justify-end pb-8 pointer-events-none">
                  <div className="flex flex-col items-center gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 delay-75">
                    <span className="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-widest text-[#666]">
                      Worn 14 Times
                    </span>
                    <span className="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-widest text-[#666]">
                      Matches 32 Items
                    </span>
                  </div>
                  <div className="text-black font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.12em] border-b border-black pb-0.5">
                    View Details
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Information Area - 25% Visual Weight */}
      <div className="flex flex-col p-4 pt-5 flex-grow justify-between gap-3 bg-white border-t border-black/5">
        <div>
          <h3 className="font-['Playfair_Display'] text-[22px] font-medium leading-[130%] text-[#111] line-clamp-2">
            {getWardrobeItemName(item)}
          </h3>
          <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.12em] text-[#666] mt-2 truncate">
            {(item as any).brand || (typeof item.category === 'object' ? (item.category as any)?.name : item.category) || "ACNE STUDIOS"}
          </p>
        </div>
        <div className="font-['IBM_Plex_Mono'] text-[11px] text-[#888]">
          <span>Size {(item as any).size || "S"}</span>
          {item.color && <span> • {item.color}</span>}
        </div>
      </div>
    </div>
  );
}
