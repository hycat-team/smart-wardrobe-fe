"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, Save, RefreshCw, Layers, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { aiApi } from "@/features/ai-stylist/api/ai.api";
import { AIOutfitRecommendationRes } from "@/features/ai-stylist/types";
import { useOutfitCanvas } from "@/features/outfits/hooks/useOutfitCanvas";
import { OutfitCanvasBoard } from "@/features/outfits/components/OutfitCanvasBoard";
import { wardrobeApi } from "@/features/wardrobe/api/wardrobe.api";
import { useCreateOutfit } from "@/features/outfits/queries/outfits.queries";
import { toast } from "sonner";
import { useB2BDemoStore } from "@/lib/mock-data/b2b/store";
import { uploadToCloudinary } from "@/lib/cloudinary";
import * as htmlToImage from "html-to-image";
import { Switch } from "@/components/ui/switch";
import { useGhostCloset } from "@/features/ghost-closet/hooks/useGhostCloset";
import { WardrobeImpactPanel } from "@/features/ghost-closet/components/WardrobeImpactPanel";
import { MOCK_GHOST_ITEM } from "@/features/ghost-closet/mock/ghostClosetMock";
import { GhostItem } from "@/features/ghost-closet/types";

import { OCCASIONS, STYLES, SEASONS, WEATHERS, COLOR_TONES, occasionMap } from "@/features/ai-stylist/components/AIQuickOptions";

function AIStylistContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);

  const [selectedOccasion, setSelectedOccasion] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [selectedWeather, setSelectedWeather] = useState<string>("");
  const [selectedColorTone, setSelectedColorTone] = useState<string>("");
  const [detailsInput, setDetailsInput] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [outfitData, setOutfitData] = useState<AIOutfitRecommendationRes | null>(null);

  const { ghostClosetEnabled, toggleGhostCloset, saveItem, joinWaitlist, hideBrand, logGhostAction } = useGhostCloset();
  const [activeGhostItem, setActiveGhostItem] = useState<GhostItem | null>(null);
  const [isImpactPanelOpen, setIsImpactPanelOpen] = useState(false);

  const [alternativeIndices, setAlternativeIndices] = useState<Record<string, number>>({});

  const {
    selectedItems,
    setSelectedItems,
    bringToFront,
    updateScale,
    handleDragEnd,
  } = useOutfitCanvas();

  const createOutfitMutation = useCreateOutfit();

  // Handle initialization from URL params if any
  useEffect(() => {
    const detailsParam = searchParams.get('details');
    if (detailsParam) {
      setDetailsInput(detailsParam);
      // Auto-generate could be triggered here if desired, but waiting for user to review and click is safer.
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    try {
      let safeDetails = detailsInput.trim();
      if (safeDetails) {
        let normalized = safeDetails.normalize('NFC');
        if (normalized.length > 1000) {
          safeDetails = normalized.substring(0, 1000);
        }
      }

      setIsGenerating(true);

      const res = await aiApi.getOutfitRecommendation({
        colorTone: selectedColorTone ? selectedColorTone.toLowerCase() : "",
        details: safeDetails,
        occasion: occasionMap[selectedOccasion] || selectedOccasion.trim(),
        season: selectedSeason ? selectedSeason.toLowerCase() : "",
        styleTarget: selectedStyle ? selectedStyle.toLowerCase() : "",
      });

      // Inject ghost item if enabled
      if (ghostClosetEnabled && res.items.length > 0) {
        let primaryGhost: any = MOCK_GHOST_ITEM;
        let altGhosts: any[] = [];
        try {
          const reportsStr = localStorage.getItem("digital_sample_lab_reports");
          if (reportsStr) {
            const reports = JSON.parse(reportsStr);
            if (reports && reports.length > 0) {
              const mappedGhosts = [...reports].reverse().map(r => ({
                ...MOCK_GHOST_ITEM,
                id: r.id,
                brandName: "My Brand",
                imageUrl: r.imageUrl || MOCK_GHOST_ITEM.imageUrl,
                color: r.variants?.[0]?.name || "Mặc định",
                colorHex: r.variants?.[0]?.color || "#000",
                price: parseInt(r.price) || 0,
              }));
              primaryGhost = mappedGhosts[0];
              altGhosts = mappedGhosts.slice(1);
            }
          }
        } catch (e) {
          console.error("Failed to load custom ghost item", e);
        }

        const ghostAsAIItem = {
          role: `Món đồ mới`,
          primary: primaryGhost,
          alternatives: altGhosts,
        };
        res.items.splice(1, 0, ghostAsAIItem);
      }

      setOutfitData(res);

      // Initialize selected items from the main items
      const initialItems = res.items.map(item => ({
        id: crypto.randomUUID(),
        clothingItemId: item.primary.id,
        imageUrl: item.primary.imageUrl,
        category: item.primary.category,
        _role: item.role,
        isGhost: (item.primary as any).isGhost,
        brandName: (item.primary as any).brandName,
        wardrobeImpact: (item.primary as any).wardrobeImpact,
        price: item.primary.price,
        x: Math.random() * 100 + 50,
        y: Math.random() * 100 + 50,
        scale: 100,
        zIndex: 1
      }));
      setSelectedItems(initialItems);
      setAlternativeIndices({});
      toast.success("Đã tạo bộ phối đồ thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể tạo gợi ý phối đồ");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSwap = (role: string) => {
    if (!outfitData) return;

    // Find the item by role
    const outfitItem = outfitData.items.find(i => i.role === role);

    if (!outfitItem || !outfitItem.alternatives || outfitItem.alternatives.length === 0) {
      toast.error("Không có lựa chọn thay thế cho món đồ này");
      return;
    }

    const currentIndex = alternativeIndices[outfitItem.role] || 0;

    // The items array to cycle through: [mainItem, ...alternatives]
    const allOptions = [outfitItem.primary, ...outfitItem.alternatives];

    // Calculate next index
    const nextIndex = (currentIndex + 1) % allOptions.length;

    // Update the state
    setAlternativeIndices(prev => ({
      ...prev,
      [outfitItem.role]: nextIndex
    }));

    const nextItem = allOptions[nextIndex];

    // Replace the item in the canvas
    setSelectedItems(prev => {
      const existingItemIndex = prev.findIndex(item => item._role === role);

      if (existingItemIndex === -1) return prev;

      const newItems = [...prev];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        clothingItemId: nextItem.id,
        imageUrl: nextItem.imageUrl,
        category: nextItem.category,
      };

      return newItems;
    });

    toast.success("Đã đổi sang món đồ khác");
  };

  const handleSaveOutfit = async () => {
    if (!outfitData || selectedItems.length === 0 || !canvasRef.current) return;

    try {
      setIsSaving(true);
      toast.loading("Đang tạo ảnh preview...", { id: "save_outfit" });

      const elementsToHide = canvasRef.current.querySelectorAll('.action-button');
      elementsToHide.forEach(el => (el as HTMLElement).style.display = 'none');

      const blob = await htmlToImage.toBlob(canvasRef.current, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: "transparent",
        cacheBust: true,
      });

      elementsToHide.forEach(el => (el as HTMLElement).style.display = '');

      if (!blob) {
        throw new Error("Không thể tạo ảnh từ Canvas");
      }

      toast.loading("Đang lưu hình ảnh...", { id: "save_outfit" });

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
      const uploadedUrl = uploadResData.secure_url;

      toast.loading("Đang lưu tủ đồ...", { id: "save_outfit" });

      await createOutfitMutation.mutateAsync({
        name: `Outfit ${new Date().toLocaleDateString('vi-VN')}`,
        description: outfitData.title || "Gợi ý từ AI",
        coverImageUrl: uploadedUrl,
        items: selectedItems.map((item) => ({
          wardrobeItemId: item.clothingItemId,
          positionX: Math.max(1, Math.abs(item.x || 0)),
          positionY: Math.max(1, Math.abs(item.y || 0)),
          scale: (item.scale || 100) / 100,
          layerOrder: item.zIndex || 1,
        })),
      });

      toast.success("Đã lưu bộ phối đồ thành công!", { id: "save_outfit" });
      router.push("/outfits");
    } catch (error) {
      console.error(error);
      toast.error("Không thể lưu bộ phối đồ", { id: "save_outfit" });
    } finally {
      setIsSaving(false);
    }
  };



  const hasSelectedOptions = !!(selectedOccasion || selectedStyle || selectedSeason || selectedWeather || selectedColorTone || detailsInput.trim());

  return (
    <div className="min-h-full flex flex-col pt-4 md:pt-8 bg-background max-w-[1600px] w-full mx-auto pb-10">
      <div className="flex flex-col h-full gap-6">

        {/* Header Section */}
        {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground uppercase flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8" strokeWidth={1.5} />
              AI STYLIST
            </h1>
            <p className="text-[13px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed border-l-2 border-foreground pl-3">
              CẤU HÌNH SỞ THÍCH CỦA BẠN ĐỂ KHÁM PHÁ BỘ PHỐI ĐỒ HÔM NAY
            </p>
          </div>
        </div> */}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1 items-start">

          {/* Left Column: Canvas (Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-0 relative min-h-[600px] h-[600px] lg:h-[800px] border border-border bg-card shadow-sm rounded-2xl overflow-hidden">
            {outfitData ? (
              <>
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground bg-card border border-border px-3 py-1.5 rounded-full flex items-center gap-2">
                    <Layers className="size-3.5" /> CANVAS STUDIO
                  </span>
                </div>

                {/* THE DRAG & DROP CANVAS */}
                <OutfitCanvasBoard
                  canvasRef={canvasRef}
                  selectedItems={selectedItems}
                  updateScale={updateScale}
                  bringToFront={bringToFront}
                  removeItem={(id) => setSelectedItems(prev => prev.filter(x => x.id !== id))}
                  handleDragEnd={handleDragEnd}
                  onSwap={handleSwap}
                  hasAlternativesCheck={(role) => {
                    const outfitItem = outfitData.items.find(i => i.role === role);
                    return !!(outfitItem && outfitItem.alternatives && outfitItem.alternatives.length > 0);
                  }}
                  onGhostItemClick={(item) => {
                    if (outfitData) {
                      const outfitItem = outfitData.items.find(i => i.role === item._role);
                      if (outfitItem) {
                        const allOptions = [outfitItem.primary, ...(outfitItem.alternatives || [])];
                        const realGhostItem = allOptions.find(i => i.id === item.clothingItemId);
                        if (realGhostItem) {
                          setActiveGhostItem(realGhostItem as any);
                          setIsImpactPanelOpen(true);
                          return;
                        }
                      }
                    }
                    setActiveGhostItem(item as any);
                    setIsImpactPanelOpen(true);
                  }}
                  emptyState={
                    <div className="text-center p-12">
                      <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">CHƯA CHỌN MÓN ĐỒ NÀO.</p>
                    </div>
                  }
                />

                {/* Action Footer */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center border-t border-border bg-card z-20">
                  <button
                    onClick={() => { setOutfitData(null); setSelectedItems([]); }}
                    className="w-1/2 px-6 py-4 border-r border-border text-foreground font-bold text-[11px] uppercase tracking-widest hover:bg-muted transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> LÀM MỚI
                  </button>
                  <button
                    onClick={handleSaveOutfit}
                    disabled={isSaving}
                    className="w-1/2 px-8 py-4 bg-primary text-primary-foreground font-bold text-[11px] uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> {isSaving ? "ĐANG LƯU..." : "LƯU VÀO TỦ ĐỒ"}
                  </button>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-8 overflow-hidden">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center gap-6">
                    <div className="w-12 h-12 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-foreground font-bold text-sm uppercase tracking-widest">ĐANG TẠO PHONG CÁCH CỦA BẠN...</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center max-w-md">
                    <Sparkles className="w-8 h-8 text-muted-foreground mb-6" strokeWidth={1} />
                    <h3 className="text-xl font-bold text-foreground uppercase tracking-tight mb-3">THE BLANK CANVAS</h3>
                    <p className="text-balance text-muted-foreground text-[13px] leading-relaxed">
                      Thiết lập thông số kỹ thuật và nhập ý tưởng thiết kế ở bảng điều khiển bên phải. Hệ thống CLOSY AI sẽ kiến tạo một bộ trang phục dành riêng cho bạn.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Configuration Form (Span 4) */}
          <div className="lg:col-span-4 h-auto lg:h-[800px] border border-border bg-card flex flex-col relative shadow-sm overflow-hidden rounded-2xl">

            {/* Form Header */}
            <div className="p-5 border-b border-border bg-muted flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-foreground" />
              <h3 className="font-bold text-[13px] text-foreground uppercase tracking-widest">THÔNG SỐ THIẾT KẾ</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">

              <div className="group flex flex-col gap-2 border-b border-border pb-4 focus-within:border-foreground transition-colors">
                <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest group-focus-within:text-foreground transition-colors">
                  DỊP (OCCASION)
                </label>
                <input
                  type="text"
                  placeholder="Bạn muốn phối đồ cho dịp nào?"
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  disabled={isGenerating}
                  className="w-full bg-transparent outline-none text-[15px] font-medium text-foreground placeholder:text-muted-foreground/50 placeholder:font-normal"
                />
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest mr-1 self-center">Gợi ý:</span>
                  {OCCASIONS.map(occ => (
                    <button
                      key={occ}
                      onClick={() => setSelectedOccasion(occ)}
                      disabled={isGenerating}
                      className={cn(
                        "px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors border rounded-full",
                        selectedOccasion === occ ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground"
                      )}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              {/* <div className="group flex flex-col gap-2 border-b border-border pb-4 focus-within:border-foreground transition-colors">
                <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest group-focus-within:text-foreground transition-colors">
                  PHONG CÁCH (STYLE)
                </label>
                <input
                  type="text"
                  placeholder="Phong cách bạn đang hướng tới?"
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  disabled={isGenerating}
                  className="w-full bg-transparent outline-none text-[15px] font-medium text-foreground placeholder:text-muted-foreground/50 placeholder:font-normal"
                />
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest mr-1 self-center">Gợi ý:</span>
                  {STYLES.map(style => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      disabled={isGenerating}
                      className={cn(
                        "px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors border rounded-full",
                        selectedStyle === style ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground"
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* <div className="group flex flex-col gap-2 border-b border-border pb-4 focus-within:border-foreground transition-colors">
                <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest group-focus-within:text-foreground transition-colors">
                  MÙA (SEASON)
                </label>
                <input
                  type="text"
                  placeholder="Mùa hiện tại hoặc sắp tới?"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  disabled={isGenerating}
                  className="w-full bg-transparent outline-none text-[15px] font-medium text-foreground placeholder:text-muted-foreground/50 placeholder:font-normal"
                />
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest mr-1 self-center">Gợi ý:</span>
                  {SEASONS.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSeason(s)}
                      disabled={isGenerating}
                      className={cn(
                        "px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors border rounded-full",
                        selectedSeason === s ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* <div className="group flex flex-col gap-2 border-b border-border pb-4 focus-within:border-foreground transition-colors">
                <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest group-focus-within:text-foreground transition-colors">
                  THỜI TIẾT (WEATHER)
                </label>
                <input
                  type="text"
                  placeholder="Thời tiết hôm nay thế nào?"
                  value={selectedWeather}
                  onChange={(e) => setSelectedWeather(e.target.value)}
                  disabled={isGenerating}
                  className="w-full bg-transparent outline-none text-[15px] font-medium text-foreground placeholder:text-muted-foreground/50 placeholder:font-normal"
                />
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest mr-1 self-center">Gợi ý:</span>
                  {WEATHERS.map(w => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeather(w)}
                      disabled={isGenerating}
                      className={cn(
                        "px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors border rounded-full",
                        selectedWeather === w ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground"
                      )}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div> */}

              <div className="group flex flex-col gap-2 border-b border-border pb-4 focus-within:border-foreground transition-colors">
                <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest group-focus-within:text-foreground transition-colors">
                  TÔNG MÀU (COLOR TONE)
                </label>
                <input
                  type="text"
                  placeholder="Màu sắc chủ đạo bạn thích?"
                  value={selectedColorTone}
                  onChange={(e) => setSelectedColorTone(e.target.value)}
                  disabled={isGenerating}
                  className="w-full bg-transparent outline-none text-[15px] font-medium text-foreground placeholder:text-muted-foreground/50 placeholder:font-normal"
                />
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest mr-1 self-center">Gợi ý:</span>
                  {COLOR_TONES.map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedColorTone(c)}
                      disabled={isGenerating}
                      className={cn(
                        "px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors border rounded-full",
                        selectedColorTone === c ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group flex flex-col gap-2 pt-2 focus-within:border-foreground transition-colors border-b border-transparent">
                <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest group-focus-within:text-foreground transition-colors">
                  GHI CHÚ THÊM (OPTIONAL)
                </label>
                <textarea
                  value={detailsInput}
                  onChange={(e) => setDetailsInput(e.target.value)}
                  disabled={isGenerating}
                  className="w-full min-h-[60px] bg-transparent outline-none text-[15px] font-medium text-foreground placeholder:text-muted-foreground/50 placeholder:font-normal transition-colors resize-none overflow-hidden"
                  placeholder="Mô tả cụ thể yêu cầu của bạn, ví dụ: 'Tôi muốn một phong cách cá tính nhưng vẫn thanh lịch...'"
                  maxLength={1000}
                />
              </div>

              <div className="flex items-center justify-between border border-border bg-muted p-4 mt-2 rounded-2xl">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-foreground">Phối đồ với các thương hiệu địa phương</p>
                  {/* <p className="text-[9px] text-muted-foreground mt-1 tracking-widest uppercase">Thử đồ mới từ brand địa phương</p> */}
                </div>
                <Switch checked={ghostClosetEnabled} onCheckedChange={toggleGhostCloset} />
              </div>

            </div>

            <div className="p-4 border-t border-border bg-card">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !hasSelectedOptions}
                className="w-full bg-primary text-primary-foreground text-[11px] font-bold py-4 rounded-full hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 tracking-widest uppercase shadow-sm"
              >
                <Sparkles className="w-4 h-4" /> TẠO TRANG PHỤC
              </button>
            </div>

          </div>
        </div>
      </div>

      <WardrobeImpactPanel
        isOpen={isImpactPanelOpen}
        onClose={() => setIsImpactPanelOpen(false)}
        item={activeGhostItem}
        onKeep={() => {
          if (activeGhostItem) logGhostAction(activeGhostItem.id, 'keep');
          setIsImpactPanelOpen(false);
        }}
        onSwap={() => {
          if (activeGhostItem) {
            const canvasItem = selectedItems.find(x => x.clothingItemId === activeGhostItem.id);
            if (canvasItem) handleSwap(canvasItem._role);
            logGhostAction(activeGhostItem.id, 'swap');
            setIsImpactPanelOpen(false);
          }
        }}
        onSave={() => {
          if (activeGhostItem) {
            saveItem(activeGhostItem.id);
            logGhostAction(activeGhostItem.id, 'save');
            toast.success("Đã lưu vào danh sách yêu thích!");
          }
        }}
        onWaitlist={() => {
          if (activeGhostItem) {
            joinWaitlist(activeGhostItem.id);
            logGhostAction(activeGhostItem.id, 'waitlist');

            // Add to mock cart
            const { addToCart } = useB2BDemoStore.getState();
            addToCart({
              productId: activeGhostItem.id,
              name: `${activeGhostItem.category?.name || "Sản phẩm"} ${activeGhostItem.color}`,
              price: activeGhostItem.price || 500000,
              quantity: 1,
              size: "M", // Default size for mock
              color: activeGhostItem.color || "Basic",
              imageUrl: activeGhostItem.imageUrl,
              brandId: activeGhostItem.brandId,
              brandName: activeGhostItem.brandName,
              selected: true,
            });

            toast.success("Đã thêm vào giỏ hàng!");
          }
        }}
        onHideBrand={() => {
          if (activeGhostItem) {
            hideBrand(activeGhostItem.brandId);
            setSelectedItems(prev => prev.filter(x => x.clothingItemId !== activeGhostItem.id));
            setIsImpactPanelOpen(false);
            toast.success("Sẽ không đề xuất brand này nữa.");
          }
        }}
        onNotMyStyle={() => {
          if (activeGhostItem) {
            logGhostAction(activeGhostItem.id, 'notMyStyle');
            setSelectedItems(prev => prev.filter(x => x.clothingItemId !== activeGhostItem.id));
            setIsImpactPanelOpen(false);
            toast.success("Đã ghi nhận, sẽ cải thiện đề xuất.");
          }
        }}
      />
    </div>
  );
}

export function AIStylistClient() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div></div>}>
      <AIStylistContent />
    </Suspense>
  );
}
