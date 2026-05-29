"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Plus, Sparkles, User, Heart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { MOCK_ITEMS } from "../wardrobe/page";

// Mock outfits database
export const MOCK_OUTFITS = [
  {
    id: "o1",
    name: "Casual Dạo Phố Mùa Hè",
    occasion: "Casual",
    source: "manual", // manual or ai
    favorite: true,
    items: ["1", "2", "5"], // IDs from MOCK_ITEMS
    dateCreated: "2026-05-12"
  },
  {
    id: "o2",
    name: "Công Sở Thanh Lịch",
    occasion: "Workwear",
    source: "ai",
    favorite: true,
    items: ["4", "6", "7"],
    dateCreated: "2026-05-18"
  },
  {
    id: "o3",
    name: "Summer Picnic Chic",
    occasion: "Summer",
    source: "manual",
    favorite: false,
    items: ["3", "6", "5"],
    dateCreated: "2026-05-24"
  }
];

export default function Outfits() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSearchParams = (p: any) => { const q = new URLSearchParams(searchParams.toString()); for(const k in p) q.set(k, p[k]); router.push('?' + q.toString()); };
  const filterParam = searchParams.get("filter") || "all";
  
  const [outfitsList, setOutfitsList] = useState(MOCK_OUTFITS);

  const handleFilterChange = (filter: string) => {
    setSearchParams({ filter });
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOutfitsList(prev => prev.map(o => o.id === id ? { ...o, favorite: !o.favorite } : o));
    toast.success("Đã cập nhật trạng thái yêu thích!");
  };

  const deleteOutfit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOutfitsList(prev => prev.filter(o => o.id !== id));
    toast.success("Đã xóa bộ trang phục!");
  };

  // Filter outfits logic
  const filteredOutfits = outfitsList.filter(o => {
    if (filterParam === "all") return true;
    if (filterParam === "ai") return o.source === "ai";
    if (filterParam === "manual") return o.source === "manual";
    if (filterParam === "saved") return o.favorite;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-medium tracking-wide text-ink">Bộ trang phục (Outfits)</h1>
          <p className="text-xs text-ink-muted font-mono uppercase tracking-wider mt-1">
            Tổng số: {outfitsList.length} bộ đã lưu phối
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              toast.success("Đang mở AI Stylist để tạo gợi ý...");
              router.push("/ai-stylist");
            }}
            variant="outline"
            className="rounded-xl border-cream-dark hover:bg-cream-dark/50 text-xs font-mono tracking-wider h-11 text-terracotta"
          >
            <Sparkles className="mr-1.5 size-4" /> PHỐI ĐỒ AI
          </Button>

          <Button 
            onClick={() => router.push("/outfits/create")}
            className="rounded-xl bg-ink text-cream hover:bg-ink/90 font-medium px-5 h-11 transition-all active:scale-[0.98] shadow-sm"
          >
            <Plus className="mr-2 size-4" /> Phối đồ thủ công
          </Button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="border-b border-cream-dark pb-2 flex overflow-x-auto gap-4 no-scrollbar">
        {[
          { label: "Tất cả", value: "all" },
          { label: "Do AI đề xuất", value: "ai" },
          { label: "Tự phối thủ công", value: "manual" },
          { label: "Bộ yêu thích", value: "saved" }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => handleFilterChange(tab.value)}
            className={cn(
              "pb-3 text-sm font-medium tracking-wider relative transition-all whitespace-nowrap",
              filterParam === tab.value 
                ? "text-ink font-semibold" 
                : "text-ink-muted hover:text-ink"
            )}
          >
            {tab.label}
            {filterParam === tab.value && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Outfits Grid */}
      {filteredOutfits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOutfits.map(outfit => {
            // Map outfit item IDs to actual items
            const itemsInOutfit = outfit.items
              .map(id => MOCK_ITEMS.find(item => item.id === id))
              .filter(Boolean);

            return (
              <div 
                key={outfit.id} 
                onClick={() => router.push(`/outfits/${outfit.id}`)}
                className="group bg-cream-dark/15 hover:bg-cream-dark/25 border border-cream-dark/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                
                {/* Outfit Collage Preview */}
                <div className="p-4 bg-cream-dark/20 border-b border-cream-dark/40 aspect-[4/3] flex gap-2">
                  {itemsInOutfit.length > 0 ? (
                    <>
                      {/* First large item */}
                      <div className="flex-1 rounded-xl overflow-hidden bg-cream-dark/30 border border-cream-dark/60 relative">
                        <img 
                          src={itemsInOutfit[0]?.img} 
                          alt={itemsInOutfit[0]?.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      {/* Remaining items list */}
                      {itemsInOutfit.length > 1 && (
                        <div className="w-1/3 flex flex-col gap-2">
                          {itemsInOutfit.slice(1, 3).map((item, idx) => (
                            <div key={idx} className="flex-1 rounded-lg overflow-hidden bg-cream-dark/30 border border-cream-dark/60">
                              <img 
                                src={item?.img} 
                                alt={item?.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          ))}
                          {/* If more than 3 items */}
                          {itemsInOutfit.length > 3 && (
                            <div className="h-8 rounded-lg bg-ink text-cream text-[10px] font-mono font-bold flex items-center justify-center">
                              +{itemsInOutfit.length - 3} MÓN
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-ink-muted">
                      Trống
                    </div>
                  )}
                </div>

                {/* Outfit Info */}
                <div className="p-4 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">
                        Dành cho: {outfit.occasion}
                      </span>
                      <span className={cn(
                        "text-[9px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1",
                        outfit.source === "ai" 
                          ? "bg-terracotta-light/20 text-terracotta border border-terracotta/25" 
                          : "bg-ink-muted/10 text-ink-muted border border-ink-muted/10"
                      )}>
                        {outfit.source === "ai" ? (
                          <>
                            <Sparkles className="size-2.5" /> AI STYLIST
                          </>
                        ) : (
                          <>
                            <User className="size-2.5" /> THỦ CÔNG
                          </>
                        )}
                      </span>
                    </div>
                    
                    <h3 className="font-heading font-semibold text-lg text-ink truncate group-hover:underline">
                      {outfit.name}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-cream-dark/30 pt-3">
                    <span className="text-[10px] font-mono text-ink-muted">
                      Tạo ngày: {outfit.dateCreated}
                    </span>

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => toggleFavorite(outfit.id, e)}
                        className="p-2 hover:bg-cream-dark/50 rounded-lg text-ink-muted hover:text-red-500 transition-colors"
                        title="Yêu thích"
                      >
                        <Heart className={cn("size-4", outfit.favorite && "fill-red-500 text-red-500")} />
                      </button>
                      <button 
                        onClick={(e) => deleteOutfit(outfit.id, e)}
                        className="p-2 hover:bg-cream-dark/50 rounded-lg text-ink-muted hover:text-terracotta transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="size-4" />
                      </button>
                      <button 
                        className="p-2 hover:bg-cream-dark/50 rounded-lg text-ink-muted hover:text-ink transition-colors"
                        title="Xem chi tiết"
                      >
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="border border-dashed border-cream-dark p-12 text-center rounded-2xl bg-cream-dark/10 max-w-md mx-auto my-12 space-y-4">
          <div className="size-12 bg-cream-dark rounded-full flex items-center justify-center mx-auto text-ink-muted">
            <Heart className="size-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-lg font-bold text-ink">Chưa có bộ trang phục nào</h3>
            <p className="text-sm text-ink-muted">
              Không tìm thấy bộ trang phục nào khớp với bộ lọc hiện tại.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleFilterChange("all")} 
              className="rounded-xl h-10 text-xs font-mono"
            >
              TẤT CẢ OUTFIT
            </Button>
            <Button 
              onClick={() => router.push("/outfits/create")} 
              className="bg-ink text-cream hover:bg-ink/90 rounded-xl h-10 text-xs font-mono"
            >
              TẠO OUTFIT
            </Button>
          </div>
        </div>
      )}
      
    </div>
  );
}


