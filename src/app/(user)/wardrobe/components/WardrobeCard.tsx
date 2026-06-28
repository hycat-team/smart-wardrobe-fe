import { Check, Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { WardrobeItemRes as WardrobeItem } from "@/features/wardrobe/types";
import { applyCloudinaryTrim } from "@/lib/cloudinary";
import Image from "next/image";

interface WardrobeCardProps {
  item: WardrobeItem;
  isLocked: boolean;
  isProcessing: boolean;
  isSelectMode: boolean;
  isSelected: boolean;
  onClick: () => void;
  getWardrobeItemName: (item: WardrobeItem) => string;
  hideDetails?: boolean;
  hideTitle?: boolean;
  priority?: boolean;
}

export function WardrobeCard({
  item,
  isLocked,
  isProcessing,
  isSelectMode,
  isSelected,
  onClick,
  getWardrobeItemName,
  hideDetails = false,
  hideTitle = false,
  priority = false,
}: WardrobeCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        isSelectMode &&
        isSelected &&
        "border-2 border-primary shadow-none hover:translate-y-0",
        isLocked && "opacity-75",
      )}
    >
      {/* Image Area - 75% Visual Weight */}
      <div className="image-frame relative aspect-[4/5] flex-shrink-0 p-3 md:p-6">
        <Image
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, 33vw"
          alt={getWardrobeItemName(item)}
          className={cn(
            "h-full w-full object-contain drop-shadow-sm transition-transform duration-300",
            !isProcessing && "group-hover:scale-105",
            isProcessing && "blur-md opacity-60",
          )}
          src={applyCloudinaryTrim(item.imageUrl || undefined)}
        />
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="mb-3 size-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground"></div>
            <span className="rounded-full bg-card/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-card-foreground shadow-sm">
              AI ĐANG XỬ LÝ
            </span>
          </div>
        )}
        {/* Top-Left Selection State */}
        {isSelectMode && (
          <div className="absolute top-4 left-4 z-20">
            {isSelected ? (
              <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                <Check className="size-3.5" />
              </div>
            ) : (
              <div className="flex size-5 items-center justify-center rounded-full border border-border bg-card text-card-foreground opacity-0 shadow-sm transition-all duration-200 group-hover:opacity-100">
                <Plus className="size-3.5" />
              </div>
            )}
          </div>
        )}

        {/* Top-Right Color Indicator */}
        {item.colorHex && (
          <div className="absolute top-4 right-4 z-10 transition-opacity duration-300 group-hover:opacity-0">
            <div
              className="h-[14px] w-[14px] rounded-full border border-border shadow-sm"
              style={{ backgroundColor: item.colorHex }}
              title={item.color || "Màu sắc"}
            />
          </div>
        )}

        {/* Hover Actions (Only outside select mode) */}
        {!isSelectMode && !isLocked && !isProcessing && (
          <>
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                className="text-muted-foreground transition-colors hover:text-foreground"
                title="Save / Favorite">
                <Heart className="size-5" />
              </button>
            </div>

            {/* <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end bg-card/90 pb-8 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="flex flex-col items-center gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 delay-75">
                <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Worn 14 Times
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Matches 32 Items
                </span>
              </div>
              <div className="border-b border-foreground pb-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
                View Details
              </div>
            </div> */}
          </>
        )}
      </div>

      {/* Information Area - 25% Visual Weight */}
      <div className="flex flex-grow flex-col border-t border-border p-3 md:p-4 md:pt-5">
        <div>
          {!hideTitle && (
            <h3 className="line-clamp-2 text-[22px] font-semibold leading-[130%] text-card-foreground">
              {getWardrobeItemName(item)}
            </h3>
          )}
          {/* {item.style && (
            <p className="mt-1.5 truncate text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {item.style}
            </p>
          )} */}
        </div>

        {!hideDetails && (
          <>
            {/* <p className="mt-2 truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {(item as any).brand ||
                (typeof item.category === "object"
                  ? (item.category as any)?.name
                  : item.category) ||
                "ACNE STUDIOS"}
            </p> */}
            {/* <div className="font-semibold text-[11px] text-[#888] mt-auto pt-2">
              <span>Size {(item as any).size || "S"}</span>
              {item.color && <span> • {item.color}</span>}
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}
