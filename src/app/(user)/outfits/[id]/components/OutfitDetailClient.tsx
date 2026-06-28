"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Save, X, Grid, AlertCircle, ZoomIn, ZoomOut, CloudRain, Sun, Loader2, Layers, MoveUp, Trash2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useMyWardrobe } from "@/features/wardrobe/queries/wardrobe.queries";
import { useOutfitDetail, useUpdateOutfit } from "@/features/outfits/queries/outfits.queries";
import { OutfitRes as Outfit } from "@/features/outfits/types";
import { WardrobeItemStatus } from "@/features/wardrobe/types";
import { getWardrobeItemName } from "@/features/wardrobe/utils";
import { wardrobeApi } from "@/features/wardrobe/api/wardrobe.api";
import * as htmlToImage from "html-to-image";
import { useOutfitCanvas } from "@/features/outfits/hooks/useOutfitCanvas";
import { OutfitCanvasBoard } from "@/features/outfits/components/OutfitCanvasBoard";
import { uploadToCloudinary, applyCloudinaryTrim } from "@/lib/cloudinary";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";


gsap.registerPlugin(useGSAP);

const OCCASIONS = ["Bình thường", "Đi làm", "Hè", "Dự tiệc", "Trang trọng", "Thể thao"];

const MOODBOARDS = [
  { id: "clean-girl", name: "Clean Girl", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200" },
  { id: "dark-academia", name: "Dark Academia", img: "https://images.unsplash.com/photo-1550614000-4b95d466f2c8?auto=format&fit=crop&q=80&w=200" },
  { id: "street-luxe", name: "Street Luxe", img: "https://images.unsplash.com/photo-1511511450040-677116ff389e?auto=format&fit=crop&q=80&w=200" },
  { id: "coastal", name: "Coastal", img: "https://images.unsplash.com/photo-1499939667766-4afceb292d05?auto=format&fit=crop&q=80&w=200" },
  { id: "business", name: "Business Core", img: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=200" },
  { id: "y2k", name: "Y2K Revival", img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=200" },
];

interface OutfitDetailClientProps {
  outfitId: string;
  initialOutfit?: Outfit;
}

export function OutfitDetailClient({ outfitId, initialOutfit }: OutfitDetailClientProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.isPremium;

  const [outfitName, setOutfitName] = useState("");
  const [occasion, setOccasion] = useState("Bình thường");
  const [customOccasion, setCustomOccasion] = useState("");
  const [selectedMoodboard, setSelectedMoodboard] = useState("");
  const [useWeather, setUseWeather] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [isSaving, setIsSaving] = useState(false);

  // Canvas State
  const canvasRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    selectedItems,
    setSelectedItems,
    bringToFront,
    handleItemToggle,
    updateScale,
    removeItem,
    handleDragEnd,
    handleAIMatch: handleAIMatchHook,
  } = useOutfitCanvas();

  const handleAIMatch = () => handleAIMatchHook(realItems, setOutfitName);

  const { contextSafe } = useGSAP({ scope: containerRef });

  useGSAP(() => {
    gsap.fromTo(
      ".outfit-panel",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );
  }, { scope: containerRef });

  // Load real wardrobe items
  const { data, isLoading: isLoadingWardrobe } = useMyWardrobe();
  const realItems = data ? data.items : [];
  const { data: outfit, isLoading: isLoadingOutfit } = useOutfitDetail(outfitId, initialOutfit);
  console.log(outfit)
  const updateOutfitMutation = useUpdateOutfit();

  // Populate data when outfit is loaded
  useEffect(() => {
    if (outfit) {
      setOutfitName(outfit.name);
      if (OCCASIONS.includes(outfit.description || "")) {
        setOccasion(outfit.description || "Casual");
        setCustomOccasion("");
      } else {
        setOccasion("Casual");
        setCustomOccasion(outfit.description || "");
      }

      let brandYOffset = -150;
      let accessoryYOffset = -150;
      
      const initialItems = (outfit.items || []).map((item: any) => {
        const wardrobeItem = item.wardrobeItem || {};
        let x = item.positionX || 0;
        let y = item.positionY || 0;
        let zIndex = item.layerOrder || 1;
        
        // Apply smart fallback positioning if coordinates are near 0 or missing
        if (Math.abs(x) < 5 && Math.abs(y) < 5) {
          const isBrand = wardrobeItem.isGhost || wardrobeItem.brandName;
          
          if (isBrand) {
            x = 280; // Right side
            y = brandYOffset;
            brandYOffset += 240;
            zIndex = 10;
          } else {
            const slug = (wardrobeItem.category?.slug || '').toLowerCase();
            const role = (wardrobeItem.role || '').toLowerCase();
            
            if (slug === 'phu-kien' || slug.startsWith('phu-kien-') || slug.includes('accessory') || role.includes('phụ kiện')) {
              x = -280; // Left side
              y = accessoryYOffset;
              accessoryYOffset += 240;
              zIndex = 5;
            } else if (slug === 'mu' || slug === 'non' || slug.includes('hat') || role.includes('mũ') || role.includes('nón')) {
              y = -350;
              zIndex = 4;
            } else if (slug === 'ao' || slug.startsWith('ao-') || slug.includes('top') || slug.includes('jacket') || role.includes('áo')) {
              y = -180;
              zIndex = 3;
            } else if (slug === 'quan' || slug === 'vay' || slug.startsWith('quan-') || slug.startsWith('vay-') || slug.includes('bottom') || slug.includes('skirt') || role.includes('quần') || role.includes('váy')) {
              y = 120;
              zIndex = 2;
            } else if (slug === 'giay' || slug.startsWith('giay-') || slug.includes('shoes') || slug.includes('footwear') || role.includes('giày')) {
              y = 270;
              zIndex = 3;
            } else {
              y = (Math.random() * 80 - 40);
              x = (Math.random() * 80 - 40);
            }
          }
        }

        return {
          ...wardrobeItem,
          scale: Math.round((item.scale || 1) * 100),
          x,
          y,
          zIndex,
        };
      }).filter((x: any) => x.id);

      setSelectedItems(initialItems);
    }
  }, [outfit]);



  // Submit Outfit
  const handleSaveOutfit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length < 2) {
      toast.error("Vui lòng chọn tối thiểu 2 món đồ để tạo thành một Outfit phối hợp.");
      return;
    }
    if (!outfitName) {
      toast.error("Vui lòng đặt tên cho bộ trang phục phối này.");
      return;
    }

    if (!canvasRef.current) return;

    try {
      setIsSaving(true);
      toast.loading("Đang chụp ảnh Canvas và cập nhật phối đồ...", { id: "saving_outfit" });

      // 1. Chụp ảnh Canvas bằng html-to-image (ẩn controls)
      const controls = document.querySelectorAll(".canvas-item-controls");
      controls.forEach((el) => ((el as HTMLElement).style.opacity = "0"));

      // Đợi DOM cập nhật CSS
      await new Promise(resolve => setTimeout(resolve, 100));

      const blob = await htmlToImage.toBlob(canvasRef.current, {
        quality: 1,
        pixelRatio: 3, // Tăng độ phân giải lên 3x một cách tự nhiên (an toàn nhất)
        backgroundColor: "transparent",
        cacheBust: true,
      });

      controls.forEach((el) => ((el as HTMLElement).style.opacity = "1"));

      if (!blob) {
        throw new Error("Không thể tạo ảnh từ Canvas");
      }

      // 2. Upload ảnh lên Cloudinary
      const signatureResult = await wardrobeApi.getUploadSignature();
      const uploadResData = await uploadToCloudinary({
        file: blob,
        signatureParams: {
          apiKey: signatureResult.apiKey,
          timestamp: signatureResult.timestamp,
          signature: signatureResult.signature,
          folder: signatureResult.folder,
        },
      });
      const coverImageUrl = uploadResData.secure_url;

      // 3. Chuẩn bị payload và gửi API tạo Outfit
      // Tính toán position % tương đối để dễ lưu (mặc dù ảnh cover đã có đầy đủ rồi)
      const payload = {
        name: outfitName,
        description: customOccasion || occasion,
        coverImageUrl: coverImageUrl,
        items: selectedItems.map((item) => ({
          wardrobeItemId: item.id,
          positionX: Math.max(1, Math.abs(item.x || 0)),
          positionY: Math.max(1, Math.abs(item.y || 0)),
          scale: (item.scale || 100) / 100,
          layerOrder: item.zIndex || 1,
        })),
      };

      await updateOutfitMutation.mutateAsync({ id: outfitId, data: payload });
      toast.success("Cập nhật bộ phối đồ thành công!", { id: "saving_outfit" });
      router.push("/outfits");

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Đã xảy ra lỗi khi lưu.", { id: "saving_outfit" });
    } finally {
      setIsSaving(false);
    }
  };

  // Filter closet items by category, status InWardrobe, and isLocked === false
  const categories = ["Tất cả", "Áo", "Quần", "Váy", "Giày", "Phụ kiện"];

  const activeClosetItems = realItems.filter(
    item => item.status === WardrobeItemStatus.InWardrobe && !item.isLocked
  );

  const filteredCloset = activeCategory === "Tất cả"
    ? activeClosetItems
    : activeClosetItems.filter(x => x.category?.name === activeCategory);

  return (
    <div ref={containerRef} className="flex-1 min-h-screen bg-background text-foreground pb-24 md:pb-12 font-sans selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col pt-8 lg:pt-12">

        {/* Page Header */}
        <div className="mb-8 md:mb-10 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 outfit-panel">
          <div>
            <Link
              href="/outfits"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="size-3.5" /> QUAY LẠI OUTFITS
            </Link>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-2 uppercase">
              BẢNG THIẾT KẾ
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground tracking-wide uppercase font-medium">
              Phối và kết hợp để tạo nên phong cách dành riêng cho bạn.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* <button
              type="button"
              onClick={handleAIMatch}
              className="flex-1 sm:flex-none px-6 py-3 border border-border text-foreground font-bold text-[11px] uppercase tracking-widest hover:bg-foreground hover:text-background rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="size-3.5" /> AI TỰ PHỐI
            </button> */}

            <button
              type="button"
              onClick={handleSaveOutfit}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-8 py-3 bg-primary text-primary-foreground font-bold text-[11px] uppercase tracking-widest hover:bg-primary/90 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              {isSaving ? "ĐANG LƯU..." : "CẬP NHẬT PHỐI ĐỒ"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT COLUMN: THE CLOSET & SETTINGS (LG: 4/12) */}
          <div className="lg:col-span-4 space-y-8 flex flex-col-reverse lg:flex-col">

            {/* THE CLOSET */}
            <div className="outfit-panel flex flex-col h-[500px] border border-border bg-card rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-border bg-muted">
                <h3 className="font-bold text-[13px] text-foreground uppercase tracking-widest">TỦ ĐỒ CÁ NHÂN</h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">CHỌN ĐỒ KÉO VÀO BÀN PHỐI</p>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 p-4 border-b border-border shrink-0 bg-card">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors border whitespace-nowrap rounded-full",
                      activeCategory === cat
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground border-border hover:border-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Items Grid */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-card">
                {isLoadingWardrobe ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">ĐANG TẢI TỦ ĐỒ...</span>
                  </div>
                ) : filteredCloset.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {filteredCloset.map(item => {
                      const isSelected = selectedItems.some(x => x.id === item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleItemToggle(item)}
                          className={cn(
                            "relative aspect-square border cursor-pointer transition-all select-none group bg-muted overflow-hidden rounded-xl",
                            isSelected
                              ? "border-foreground shadow-sm"
                              : "border-border hover:border-foreground"
                          )}
                        >
                          <img src={applyCloudinaryTrim(item.imageUrl)} alt={getWardrobeItemName(item)} className="w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                          {isSelected && (
                            <div className="absolute inset-0 border-[3px] border-foreground flex flex-col items-end justify-start p-1 pointer-events-none rounded-xl">
                              <div className="bg-foreground size-4 flex items-center justify-center rounded-sm">
                                <span className="text-background text-[10px] font-bold leading-none">✓</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">TRỐNG</span>
                  </div>
                )}
              </div>
            </div>

            {/* OUTFIT FORM SETTINGS */}
            <div className="outfit-panel border border-border bg-card rounded-2xl overflow-hidden flex flex-col shadow-sm">
              <div className="p-5 border-b border-border bg-muted">
                <h3 className="font-bold text-[13px] text-foreground uppercase tracking-widest">THÔNG TIN BỘ PHỐI</h3>
              </div>

              <div className="p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <label htmlFor="outfit-name" className="text-[10px] font-bold uppercase tracking-widest text-foreground">TÊN BỘ PHỐI *</label>
                  <input
                    id="outfit-name"
                    type="text"
                    required
                    value={outfitName}
                    onChange={(e) => setOutfitName(e.target.value)}
                    placeholder="Tên bộ trang phục..."
                    className="w-full bg-transparent border-b border-border focus:border-foreground outline-none pb-2 text-[13px] font-medium text-foreground placeholder:text-muted-foreground transition-colors rounded-none"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground">DỊP SỬ DỤNG</label>
                  <div className="flex flex-wrap gap-2">
                    {OCCASIONS.map(occ => (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => {
                          setOccasion(occ);
                          setCustomOccasion("");
                        }}
                        className={cn(
                          "px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors border rounded-full",
                          occasion === occ && !customOccasion
                            ? "bg-foreground text-background border-foreground"
                            : "bg-transparent text-foreground border-border hover:border-foreground"
                        )}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STYLING CANVAS (LG: 8/12) */}
          <div className="lg:col-span-8 flex flex-col gap-0 relative min-h-[600px] h-[600px] lg:h-[800px] border border-border bg-card shadow-sm rounded-2xl overflow-hidden outfit-panel">

            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground bg-card border border-border px-3 py-1.5 rounded-full flex items-center gap-2">
                <Layers className="size-3.5" /> CANVAS STUDIO
                <span className="bg-muted text-foreground px-1.5 py-0.5 rounded-full text-[9px]">{selectedItems.length} MÓN</span>
              </span>

              {selectedItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItems([]);
                  }}
                  className="text-[10px] text-foreground bg-card border border-border px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 transition-colors font-bold hover:bg-muted"
                >
                  <RefreshCcw className="size-3.5" /> LÀM MỚI
                </button>
              )}
            </div>

            {/* THE DRAG & DROP CANVAS */}
            <OutfitCanvasBoard
              canvasRef={canvasRef}
              selectedItems={selectedItems}
              updateScale={updateScale}
              bringToFront={bringToFront}
              removeItem={removeItem}
              handleDragEnd={handleDragEnd}
              emptyState={
                <div className="text-center space-y-6 p-12">
                  <div className="w-16 h-16 border border-border rounded-2xl flex items-center justify-center mx-auto text-muted-foreground bg-card">
                    <Grid className="w-6 h-6" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-2xl font-bold text-foreground uppercase tracking-tight">CANVAS TRỐNG</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed max-w-sm mx-auto">
                      Kéo các trang phục từ tủ đồ vào đây để bắt đầu ghép phối. Bạn có thể tự do phóng to, thu nhỏ và kéo thả.
                    </p>
                  </div>
                </div>
              }
            />
          </div>

        </div>

      </div>
    </div>
  );
}

