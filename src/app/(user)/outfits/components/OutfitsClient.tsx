"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Sparkles, User, Heart, Trash2, ArrowRight, Loader2, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMyOutfits, useDeleteOutfit } from "@/features/outfits/queries/outfits.queries";
import { OutfitRes as Outfit } from "@/features/outfits/types";

interface OutfitsClientProps {
  initialOutfits?: Outfit[];
}

export function OutfitsClient({ initialOutfits }: OutfitsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter") || "all";
  
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useMyOutfits();
  const rawInitialOutfits = Array.isArray(initialOutfits) ? initialOutfits : ((initialOutfits as any)?.items || []);
  const outfits = data ? data.pages.flatMap(p => p.items) : rawInitialOutfits;
  const deleteOutfitMutation = useDeleteOutfit();

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
    toast.success("Đã cập nhật trạng thái yêu thích!");
  };

  const handleDeleteOutfit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Bạn có chắc chắn muốn xóa bộ phối đồ này không?")) {
      try {
        await deleteOutfitMutation.mutateAsync(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    router.push("?" + params.toString());
  };

  // Filter outfits logic
  const filteredOutfits = outfits.filter((o: Outfit) => {
    const isFavorite = favorites[o.id] || false;
    
    if (filterParam === "all") return true;
    if (filterParam === "ai") return o.status === 1; // Assuming status 1 indicates AI generated in backend
    if (filterParam === "manual") return o.status === 0 || o.status === 2;
    if (filterParam === "saved") return isFavorite;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-medium tracking-wide text-ink">Bộ trang phục (Outfits)</h1>
          <p className="text-xs text-ink-muted font-mono uppercase tracking-wider mt-1">
            Tổng số: {outfits.length} bộ đã lưu phối
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
      {isLoading && !outfits.length ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loader2 className="size-10 text-terracotta animate-spin" />
          <p className="text-sm text-ink-muted font-mono">Đang tải danh sách phối đồ...</p>
        </div>
      ) : filteredOutfits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOutfits.map((outfit: Outfit) => {
            const itemsInOutfit = outfit.items || [];
            const isFavorite = favorites[outfit.id] || false;

            // Fallback preview cover image: either cover_image_url or first item's image
            const coverImage = outfit.cover_image_url || itemsInOutfit[0]?.wardrobe_item?.imageUrl;

            return (
              <div 
                key={outfit.id} 
                onClick={() => router.push(`/outfits/${outfit.id}`)}
                className="group bg-cream-dark/15 hover:bg-cream-dark/25 border border-cream-dark/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                
                {/* Outfit Collage Preview */}
                <div className="p-4 bg-cream-dark/20 border-b border-cream-dark/40 aspect-[4/3] flex gap-2">
                  {coverImage ? (
                    <>
                      {/* First large item / cover */}
                      <div className="flex-1 rounded-xl overflow-hidden bg-cream-dark/30 border border-cream-dark/60 relative">
                        <img 
                          src={coverImage} 
                          alt={outfit.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      {/* Remaining items list */}
                      {itemsInOutfit.length > 1 && (
                        <div className="w-1/3 flex flex-col gap-2">
                          {itemsInOutfit.slice(1, 3).map((item: any, idx: number) => (
                            <div key={idx} className="flex-1 rounded-lg overflow-hidden bg-cream-dark/30 border border-cream-dark/60">
                              <img 
                                src={item.wardrobe_item?.imageUrl} 
                                alt={item.wardrobe_item?.style} 
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
                    <div className="w-full h-full flex flex-col items-center justify-center text-xs text-ink-muted gap-2">
                      <Shirt className="size-8 stroke-1 text-ink-subtle" />
                      Không có trang phục
                    </div>
                  )}
                </div>

                {/* Outfit Info */}
                <div className="p-4 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">
                        Dịp: {outfit.description || "Hàng ngày"}
                      </span>
                      <span className={cn(
                        "text-[9px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1",
                        outfit.status === 1 
                          ? "bg-terracotta-light/20 text-terracotta border border-terracotta/25" 
                          : "bg-ink-muted/10 text-ink-muted border border-ink-muted/10"
                      )}>
                        {outfit.status === 1 ? (
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
                      Tạo ngày: {outfit.created_at ? new Date(outfit.created_at).toLocaleDateString("vi-VN") : "Gần đây"}
                    </span>

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => toggleFavorite(outfit.id, e)}
                        className="p-2 hover:bg-cream-dark/50 rounded-lg text-ink-muted hover:text-red-500 transition-colors"
                        title="Yêu thích"
                      >
                        <Heart className={cn("size-4", isFavorite && "fill-red-500 text-red-500")} />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteOutfit(outfit.id, e)}
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
      
      {hasNextPage && (
        <div className="mt-12 flex justify-center">
          <Button 
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            className="rounded-xl border-cream-dark hover:bg-cream-dark/50 text-xs font-mono tracking-wider h-11 text-ink disabled:opacity-50"
          >
            {isFetchingNextPage ? 'ĐANG TẢI...' : 'TẢI THÊM PHỐI ĐỒ'}
          </Button>
        </div>
      )}
      
    </div>
  );
}
