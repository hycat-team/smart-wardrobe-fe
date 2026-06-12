"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Save, X, Grid, AlertCircle, ZoomIn, ZoomOut, CloudRain, Sun, Loader2, Layers, MoveUp, Trash2 } from "lucide-react";
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
import { motion } from "framer-motion";
import * as htmlToImage from "html-to-image";

const OCCASIONS = ["Casual", "Workwear", "Summer", "Party", "Formal", "Sporty"];

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
  const [occasion, setOccasion] = useState("Casual");
  const [customOccasion, setCustomOccasion] = useState("");
  const [selectedMoodboard, setSelectedMoodboard] = useState("");
  const [useWeather, setUseWeather] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [isSaving, setIsSaving] = useState(false);

  // Canvas State
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  // Load real wardrobe items
  const { data, isLoading: isLoadingWardrobe } = useMyWardrobe();
  const realItems = data ? data.pages.flatMap(p => p.items) : [];
  const { data: outfit, isLoading: isLoadingOutfit } = useOutfitDetail(outfitId, initialOutfit);
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
      
      const initialItems = (outfit.items || []).map((item: any) => ({
        ...(item.wardrobeItem || {}),
        scale: Math.round((item.scale || 1) * 100),
        x: item.positionX || 0,
        y: item.positionY || 0,
        zIndex: item.layerOrder || 1,
      })).filter((x: any) => x.id);
      
      setSelectedItems(initialItems);
    }
  }, [outfit]);

  // Bring to Front (Layering)
  const bringToFront = (id: string) => {
    setSelectedItems(prev => {
      const maxZ = Math.max(...prev.map(i => i.zIndex || 0), 0);
      return prev.map(item => item.id === id ? { ...item, zIndex: maxZ + 1 } : item);
    });
  };

  // Selection handler
  const handleItemToggle = (item: any) => {
    if (selectedItems.some(x => x.id === item.id)) {
      setSelectedItems(prev => prev.filter(x => x.id !== item.id));
    } else {
      const maxZ = Math.max(...selectedItems.map(i => i.zIndex || 0), 0);
      setSelectedItems(prev => [
        ...prev, 
        { 
          ...item, 
          scale: 100, 
          x: 0, 
          y: 0, 
          zIndex: maxZ + 1 
        }
      ]);
      toast.success(`Đã thêm ${getWardrobeItemName(item)} vào bàn phối!`);
    }
  };

  // Canvas manipulations
  const updateScale = (id: string, newScale: number) => {
    setSelectedItems(prev => prev.map(x => x.id === id ? { ...x, scale: Math.max(30, Math.min(250, newScale)) } : x));
  };

  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(x => x.id !== id));
  };

  // Update item coordinates after drag
  const handleDragEnd = (id: string, info: any) => {
    setSelectedItems(prev => prev.map(x => {
      if (x.id === id) {
        return {
          ...x,
          x: x.x + info.offset.x,
          y: x.y + info.offset.y
        };
      }
      return x;
    }));
  };

  // AI Auto-matching magic button
  const handleAIMatch = () => {
    const tops = realItems.filter(x => x.category?.name === "Áo" && !x.isLocked && x.status === WardrobeItemStatus.InWardrobe);
    const bottoms = realItems.filter(x => x.category?.name === "Quần" && !x.isLocked && x.status === WardrobeItemStatus.InWardrobe);
    const shoes = realItems.filter(x => x.category?.name === "Giày" && !x.isLocked && x.status === WardrobeItemStatus.InWardrobe);

    if (tops.length === 0 || bottoms.length === 0) {
      toast.error("Không đủ quần áo trong tủ đồ để thực hiện AI match! Cần có ít nhất 1 Áo và 1 Quần.");
      return;
    }

    const randomTop = tops[Math.floor(Math.random() * tops.length)];
    const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    const randomShoes = shoes.length > 0 ? shoes[Math.floor(Math.random() * shoes.length)] : null;

    let z = 1;
    const matched = [
      { ...randomTop, scale: 100, x: 0, y: -80, zIndex: z++ },
      { ...randomBottom, scale: 100, x: 0, y: 100, zIndex: z++ }
    ];

    if (randomShoes) {
      matched.push({ ...randomShoes, scale: 70, x: 0, y: 240, zIndex: z++ });
    }

    setSelectedItems(matched);
    setOutfitName("AI Styled Outfit " + Math.floor(Math.random() * 100));
    toast.success("AI Stylist đã gợi ý bộ phối hợp hoàn chỉnh!");
  };

  // Upload canvas image to Cloudinary
  const uploadCanvasImage = async (blob: Blob): Promise<string> => {
    try {
      const signatureResult = await wardrobeApi.getUploadSignature();
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzvwkngxu";
      const formData = new FormData();
      formData.append("file", blob, "outfit_cover.png");
      formData.append("api_key", signatureResult.apiKey);
      formData.append("timestamp", signatureResult.timestamp.toString());
      formData.append("signature", signatureResult.signature);
      formData.append("folder", signatureResult.folder);
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Lỗi upload Cloudinary:", error);
      throw error;
    }
  };

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
      const coverImageUrl = await uploadCanvasImage(blob);

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
    <div className="max-w-7xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500 pb-16 font-sans px-4 sm:px-6">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-dark pb-4 pt-4">
        <div className="space-y-1">
          <Link 
            href="/outfits" 
            className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" /> QUAY LẠI OUTFITS
          </Link>
          <h1 className={cn("text-3xl font-heading font-medium tracking-wide text-ink")}>Mix & Match Canvas</h1>
        </div>

        {/* Action triggers */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            type="button"
            onClick={handleAIMatch}
            className="flex-1 sm:flex-none h-11 rounded-xl bg-terracotta-light/10 text-terracotta border border-terracotta/20 hover:bg-terracotta-light/20 text-xs font-mono tracking-wider flex items-center justify-center gap-1.5"
          >
            <Sparkles className="size-4" /> AI TỰ PHỐI
          </Button>

          <Button
            type="button"
            onClick={handleSaveOutfit}
            disabled={isSaving}
            className="flex-1 sm:flex-none h-11 rounded-xl bg-ink text-cream hover:bg-ink/90 px-6 text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 shadow-md disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isSaving ? "ĐANG LƯU..." : "CẬP NHẬT PHỐI ĐỒ"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: THE CLOSET & SETTINGS (LG: 4/12) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col-reverse lg:flex-col">
          
          {/* THE CLOSET */}
          <div className="border border-cream-dark/60 rounded-3xl p-5 bg-cream-dark/10 shadow-sm flex flex-col max-h-[500px]">
            <div className="space-y-1 mb-4">
              <h3 className="font-heading font-bold text-xl text-ink">Tủ đồ cá nhân</h3>
              <p className="text-[11px] text-ink-muted font-mono uppercase tracking-wider">Chọn đồ kéo vào bàn phối</p>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto gap-2 no-scrollbar pb-3 border-b border-cream-dark/40 shrink-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-mono tracking-widest whitespace-nowrap transition-all border",
                    activeCategory === cat 
                      ? "bg-ink border-ink text-cream" 
                      : "bg-transparent border-cream-dark text-ink-muted hover:border-ink hover:text-ink"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="flex-1 overflow-y-auto pr-2 mt-4 custom-scrollbar">
              {isLoadingWardrobe ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="size-6 text-terracotta animate-spin" />
                  <span className="text-[10px] text-ink-muted font-mono uppercase tracking-widest">Đang tải tủ đồ...</span>
                </div>
              ) : filteredCloset.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {filteredCloset.map(item => {
                    const isSelected = selectedItems.some(x => x.id === item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleItemToggle(item)}
                        className={cn(
                          "relative rounded-2xl overflow-hidden aspect-square border cursor-pointer bg-cream transition-all select-none group",
                          isSelected 
                            ? "border-terracotta ring-2 ring-terracotta/50 shadow-md" 
                            : "border-cream-dark/60 hover:border-ink/30 hover:shadow-sm"
                        )}
                      >
                        <img src={item.imageUrl} alt={getWardrobeItemName(item)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-terracotta/10 flex items-center justify-center backdrop-blur-[1px]">
                            <span className="bg-terracotta text-cream size-6 rounded-full flex items-center justify-center font-bold text-sm shadow-md">✓</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-ink-muted font-mono uppercase tracking-widest border border-dashed border-cream-dark/50 rounded-2xl">
                  Trống
                </div>
              )}
            </div>
          </div>

          {/* OUTFIT FORM SETTINGS */}
          <div className="border border-cream-dark/60 rounded-3xl p-5 bg-cream-dark/10 shadow-sm shrink-0">
            <h3 className="font-heading font-bold text-lg text-ink mb-4">Thông tin bộ phối</h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="outfit-name" className="text-[10px] font-mono uppercase tracking-widest text-ink font-bold">Tên bộ phối <span className="text-terracotta">*</span></Label>
                <Input
                  id="outfit-name"
                  type="text"
                  required
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  placeholder="VD: Look đi cafe cuối tuần..."
                  className="h-12 bg-cream border-cream-dark focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink rounded-xl text-sm"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-mono uppercase tracking-widest text-ink font-bold">Dịp sử dụng</Label>
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
                        "px-4 py-1.5 rounded-full text-xs font-mono tracking-widest transition-all border",
                        occasion === occ && !customOccasion
                          ? "bg-ink border-ink text-cream" 
                          : "bg-cream border-cream-dark text-ink-muted hover:border-ink/50"
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
        <div className="lg:col-span-8 h-full flex flex-col relative min-h-[600px]">
          
          <div className="flex items-center justify-between z-20 mb-3 px-1">
            <span className="text-xs font-mono text-ink-muted uppercase tracking-widest font-bold flex items-center gap-2">
              <Layers className="size-4" /> Canvas Studio 
              <span className="bg-ink text-cream px-2 py-0.5 rounded-full text-[10px]">{selectedItems.length} MÓN</span>
            </span>

            {selectedItems.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedItems([]);
                  setOutfitName("");
                }}
                className="text-[10px] font-mono text-terracotta hover:bg-terracotta/10 px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 transition-colors font-bold"
              >
                <Trash2 className="size-3" /> Làm mới
              </button>
            )}
          </div>

          {/* THE DRAG & DROP CANVAS */}
          <div 
            className="flex-1 bg-cream border-2 border-cream-dark/50 rounded-[2.5rem] relative overflow-hidden shadow-inner flex items-center justify-center"
          >
            {/* Background texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#1A1A1A_0.6px,transparent_0.6px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />

            {/* CANVAS REF TARGET FOR HTML-TO-IMAGE */}
            <div 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full bg-cream/0 flex items-center justify-center"
            >
              {selectedItems.length > 0 ? (
                selectedItems.map(item => (
                  <motion.div 
                    key={item.id}
                    drag
                    dragConstraints={canvasRef}
                    dragMomentum={false}
                    initial={{ x: item.x, y: item.y }}
                    onDragEnd={(e, info) => handleDragEnd(item.id, info)}
                    className="absolute cursor-grab active:cursor-grabbing group"
                    style={{ 
                      zIndex: item.zIndex,
                    }}
                    whileTap={{ scale: 1.02 }}
                  >
                    <div className="relative">
                      {/* Controls (Hidden during capture) */}
                      <div className="canvas-item-controls opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 left-1/2 -translate-x-1/2 bg-ink text-cream flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg z-50 whitespace-nowrap border border-ink-muted/30">
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); updateScale(item.id, item.scale - 10); }}
                          className="hover:text-terracotta transition-colors"
                          title="Thu nhỏ"
                        >
                          <ZoomOut className="size-3.5" />
                        </button>
                        <span className="text-[10px] font-mono w-8 text-center">{item.scale}%</span>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); updateScale(item.id, item.scale + 10); }}
                          className="hover:text-terracotta transition-colors"
                          title="Phóng to"
                        >
                          <ZoomIn className="size-3.5" />
                        </button>
                        <div className="w-px h-3 bg-cream/30 mx-1" />
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); bringToFront(item.id); }}
                          className="hover:text-terracotta transition-colors flex items-center gap-1 text-[9px] uppercase tracking-widest font-mono"
                          title="Đưa lên trên"
                        >
                          <MoveUp className="size-3" /> Lên trên
                        </button>
                        <div className="w-px h-3 bg-cream/30 mx-1" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="size-4" />
                        </button>
                      </div>

                      {/* Image */}
                      <div 
                        className="pointer-events-none drop-shadow-xl"
                        style={{ 
                          width: `${item.scale * 1.5}px`, // base size 150px when scale is 100
                          height: "auto",
                        }}
                      >
                        <img 
                          src={item.imageUrl} 
                          alt="Outfit Item" 
                          className="w-full h-full object-contain filter drop-shadow-md" 
                          draggable={false}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center space-y-4 p-10 max-w-sm">
                  <div className="size-16 border-2 border-dashed border-ink/20 rounded-full flex items-center justify-center mx-auto text-ink/30">
                    <Grid className="size-8" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-heading font-bold text-ink">Canvas trống</p>
                    <p className="text-xs font-mono text-ink-muted leading-relaxed">
                      Kéo các trang phục từ tủ đồ vào đây để bắt đầu ghép phối. Bạn có thể tự do phóng to, thu nhỏ và kéo thả.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick tips footer inside canvas */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-mono text-ink-muted bg-cream/80 backdrop-blur-md px-4 py-2 rounded-full border border-cream-dark/50 z-20 pointer-events-none shadow-sm whitespace-nowrap">
              <AlertCircle className="size-3.5 text-terracotta" />
              <span>Gợi ý: Kéo thả để di chuyển. Hover vào item để đổi kích thước & lớp.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}


