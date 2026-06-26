import React from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, MoveUp, X, RefreshCcw, AlertCircle } from "lucide-react";
import { CanvasItem } from "@/features/outfits/hooks/useOutfitCanvas";
import { applyCloudinaryTrim } from "@/lib/cloudinary";
import { GhostItemBadge } from "@/features/ghost-closet/components/GhostItemBadge";

export interface OutfitCanvasBoardProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  selectedItems: CanvasItem[];
  updateScale: (id: string, newScale: number) => void;
  bringToFront: (id: string) => void;
  removeItem: (id: string) => void;
  handleDragEnd: (id: string, info: any) => void;
  onSwap?: (role: string) => void;
  emptyState?: React.ReactNode;
  hasAlternativesCheck?: (role: string) => boolean;
  onGhostItemClick?: (item: CanvasItem) => void;
}

export function OutfitCanvasBoard({
  canvasRef,
  selectedItems,
  updateScale,
  bringToFront,
  removeItem,
  handleDragEnd,
  onSwap,
  emptyState,
  hasAlternativesCheck,
  onGhostItemClick,
}: OutfitCanvasBoardProps) {
  return (
    <div className="flex-1 bg-[#F9F9F9] border border-[#E5E5E5] relative overflow-hidden flex items-center justify-center">
      {/* CANVAS REF TARGET FOR HTML-TO-IMAGE */}
      <div
        ref={canvasRef}
        className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center"
      >
        {selectedItems.length > 0 ? (
          selectedItems.map(item => {
            const hasAlternatives = item._role && hasAlternativesCheck ? hasAlternativesCheck(item._role) : false;

            return (
              <motion.div
                layout
                key={item._role || item.id}
                drag
                dragConstraints={canvasRef}
                dragMomentum={false}
                initial={{ x: item.x, y: item.y }}
                onDragEnd={(e, info) => handleDragEnd(item.id, info)}
                className="absolute cursor-grab active:cursor-grabbing group"
                style={{ zIndex: item.zIndex }}
                whileTap={{ scale: 1.02 }}
              >
                <div className="relative">
                  {/* Controls (Hidden during capture) */}
                  <div className="canvas-item-controls opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#1A1A1A] text-[#1A1A1A] flex items-center gap-0 shadow-sm z-50 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); updateScale(item.id, item.scale - 10); }}
                      className="hover:bg-[#1A1A1A] hover:text-white transition-colors p-2"
                      title="Thu nhỏ"
                    >
                      <ZoomOut className="size-3.5" />
                    </button>
                    <div className="w-px h-4 bg-[#E5E5E5]" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); updateScale(item.id, item.scale + 10); }}
                      className="hover:bg-[#1A1A1A] hover:text-white transition-colors p-2"
                      title="Phóng to"
                    >
                      <ZoomIn className="size-3.5" />
                    </button>
                    <div className="w-px h-4 bg-[#E5E5E5]" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); bringToFront(item.id); }}
                      className="hover:bg-[#1A1A1A] hover:text-white transition-colors flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold px-3 py-2"
                      title="Đưa lên trên"
                    >
                      <MoveUp className="size-3" /> LÊN TRÊN
                    </button>

                    {onSwap && hasAlternatives && (
                      <>
                        <div className="w-px h-4 bg-[#E5E5E5]" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onSwap(item._role!); }}
                          className="hover:bg-[#1A1A1A] hover:text-white transition-colors flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold px-3 py-2"
                          title="Thay thế"
                        >
                          <RefreshCcw className="size-3" /> THAY THẾ
                        </button>
                      </>
                    )}

                    {item.isGhost && onGhostItemClick && (
                      <>
                        <div className="w-px h-4 bg-[#E5E5E5]" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onGhostItemClick(item); }}
                          className="hover:bg-[#A0522D] hover:text-white text-[#A0522D] transition-colors flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold px-3 py-2"
                          title="Xem Wardrobe Impact"
                        >
                          {/* IMPACT tiếng viêt:  Xem thêm*/}
                          {/* IMPACT tiếng viêt:  */}
                          Xem thêm
                          {/*  */}
                        </button>
                      </>
                    )}

                    <div className="w-px h-4 bg-[#E5E5E5]" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                      className="hover:bg-[#1A1A1A] hover:text-white transition-colors p-2"
                      title="Xóa"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>

                  {/* Image */}
                  <div
                    className="pointer-events-none drop-shadow-xl ring-1 ring-transparent group-hover:ring-black/10 transition-all rounded-sm relative"
                    style={{
                      width: `${item.scale * 2.2}px`,
                      height: "auto",
                    }}
                  >
                    <img
                      src={item.isGhost ? item.imageUrl : applyCloudinaryTrim(item.imageUrl)}
                      alt="Outfit Item"
                      className="w-full h-auto object-contain filter drop-shadow-md"
                      draggable={false}
                    />
                    {item.isGhost && <GhostItemBadge brandName={item.brandName || 'Local Brand'} />}
                  </div>

                  {/* Role Label for AI Stylist */}
                  {item._role && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white border border-[#E5E5E5] px-2 py-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]">
                        {item._role}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          emptyState
        )}
      </div>

      {/* Quick tips footer inside canvas */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-bold text-[#888888] bg-white px-4 py-2 border border-[#E5E5E5] z-20 pointer-events-none shadow-sm whitespace-nowrap uppercase tracking-widest">
        <AlertCircle className="size-3.5 text-[#1A1A1A]" />
        <span>KÉO ĐỂ DI CHUYỂN • RÊ CHUỘT ĐỂ ĐỔI KÍCH THƯỚC</span>
      </div>
    </div>
  );
}
