import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
interface GhostItemBadgeProps {
  brandName: string;
  className?: string;
}
export function GhostItemBadge({ brandName, className }: GhostItemBadgeProps) {
  return (
    <>
      {" "}
      <div
        className={cn(
          "absolute inset-0 border-2 border-dashed border-[#A0522D] pointer-events-none z-10 opacity-80",
          className
        )}
      />{" "}
      <div className="absolute top-2 left-2 bg-[#A0522D] text-white text-[9px] font-sans px-2 py-1 z-20 flex items-center gap-1 shadow-sm">
        {" "}
        <Sparkles className="size-3" /> Ghost · {brandName}{" "}
      </div>{" "}
      <div className="absolute inset-0 bg-[#A0522D]/5 pointer-events-none z-0 animate-pulse" />{" "}
    </>
  );
}
