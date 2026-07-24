"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, Save, RefreshCw, Layers, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { aiApi } from "@/features/ai-stylist/api/ai.api";
import type { AIOutfitRecommendationRes } from "@/features/ai-stylist/types";
import { useOutfitCanvas } from "@/features/outfits/hooks/useOutfitCanvas";
import type { CanvasItem } from "@/features/outfits/hooks/useOutfitCanvas";
import { getBrandItemCanvasMetadata } from "@/features/ai-stylist/utils/brand-item-canvas";
import { OutfitCanvasBoard } from "@/features/outfits/components/OutfitCanvasBoard";
import { wardrobeApi } from "@/features/wardrobe/api/wardrobe.api";
import { useCreateOutfit } from "@/features/outfits/queries/outfits.queries";
import { useCreateSampleFeedback } from "@/features/brands/queries/user-brands.queries";
import { toast } from "sonner";
import { useB2BDemoStore } from "@/lib/mock-data/b2b/store";
import { uploadToCloudinary } from "@/lib/cloudinary";
import * as htmlToImage from "html-to-image";
import { Switch } from "@/components/ui/switch";
import { useGhostCloset } from "@/features/ghost-closet/hooks/useGhostCloset";
import { WardrobeImpactPanel } from "@/features/ghost-closet/components/WardrobeImpactPanel";
import { GhostItem } from "@/features/ghost-closet/types";
import { BrandItemFeedbackSheet } from "@/features/brands/components/BrandItemFeedbackSheet";

import { OCCASIONS, STYLES, occasionMap } from "@/features/ai-stylist/components/AIQuickOptions";

function isGhostItem(item: any): item is GhostItem {
  return item && item.isGhost === true;
}

function AIStylistContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);

  const [selectedOccasion, setSelectedOccasion] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [detailsInput, setDetailsInput] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [outfitData, setOutfitData] = useState<AIOutfitRecommendationRes | null>(null);

  const { ghostClosetEnabled, toggleGhostCloset, saveItem, joinWaitlist, hideBrand, logGhostAction } = useGhostCloset();
  const [activeGhostItem, setActiveGhostItem] = useState<GhostItem | null>(null);
  const [isImpactPanelOpen, setIsImpactPanelOpen] = useState(false);
  const [activeBrandFeedbackItem, setActiveBrandFeedbackItem] = useState<CanvasItem | null>(null);
  const [isBrandFeedbackOpen, setIsBrandFeedbackOpen] = useState(false);

  const [alternativeIndices, setAlternativeIndices] = useState<Record<string, number>>({});

  const {
    selectedItems,
    setSelectedItems,
    bringToFront,
    updateScale,
    handleDragEnd,
  } = useOutfitCanvas();

  const createOutfitMutation = useCreateOutfit();
  const createSampleFeedback = useCreateSampleFeedback();

  useEffect(() => {
    const detailsParam = searchParams.get('details');
    if (detailsParam) {
      setDetailsInput(detailsParam);
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    try {
      const safeDetails = detailsInput.trim().normalize('NFC').substring(0, 1000);
      setIsGenerating(true);

      const res = await aiApi.getOutfitRecommendation({
        details: safeDetails,
        occasion: occasionMap[selectedOccasion] || selectedOccasion.trim(),
        styleTarget: selectedStyle ? selectedStyle.toLowerCase() : "",
        include_brand_items: ghostClosetEnabled ? true : undefined,
      });

      setOutfitData(res);

      let brandYOffset = -150;
      let accessoryYOffset = -150;

      const initialItems = res.items.map(item => {
        const primary = item.primary;
        const brandItemMetadata = getBrandItemCanvasMetadata(item.itemContext, primary);
        const isBrand = brandItemMetadata.itemContext === "brand_item" || isGhostItem(primary) || !!(primary as GhostItem).brandName;
        let x = 0;
        let y = 0;
        let zIndex = 1;

        if (isBrand) {
          x = 280;
          y = brandYOffset;
          brandYOffset += 240;
          zIndex = 10;
        } else {
          const slug = (primary.category?.slug || '').toLowerCase();
          const role = (item.role || '').toLowerCase();

          if (slug.includes('phu-kien') || slug.includes('accessory') || role.includes('phụ kiện')) {
            x = -280;
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

        const ghostData = isGhostItem(primary) ? primary : undefined;

        return {
          id: crypto.randomUUID(),
          clothingItemId: primary.fashionItem?.id || primary.id,
          imageUrl: primary.fashionItem?.imageUrl || "",
          category: primary.category || primary.fashionItem?.category,
          _role: item.role,
          isGhost: ghostData?.isGhost,
          brandName:
            ghostData?.brandName ||
            brandItemMetadata.brandItemSnapshot?.brandName ||
            primary.brandName,
          wardrobeImpact: ghostData?.wardrobeImpact,
          price:
            brandItemMetadata.brandItemSnapshot?.price ?? primary.price,
          ...brandItemMetadata,
          x,
          y,
          scale: isBrand ? 80 : 100,
          zIndex
        };
      });
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

    const outfitItem = outfitData.items.find(i => i.role === role);
    if (!outfitItem || !outfitItem.alternatives || outfitItem.alternatives.length === 0) {
      toast.error("Không có lựa chọn thay thế cho món đồ này");
      return;
    }

    const currentIndex = alternativeIndices[outfitItem.role] || 0;
    const allOptions = [outfitItem.primary, ...outfitItem.alternatives];
    const nextIndex = (currentIndex + 1) % allOptions.length;

    setAlternativeIndices(prev => ({
      ...prev,
      [outfitItem.role]: nextIndex
    }));

    const nextItem = allOptions[nextIndex];
    const nextGhostData = isGhostItem(nextItem) ? nextItem : undefined;
    const brandItemMetadata = getBrandItemCanvasMetadata(outfitItem.itemContext, nextItem);

    setSelectedItems(prev => {
      const existingItemIndex = prev.findIndex(item => item._role === role);
      if (existingItemIndex === -1) return prev;

      const newItems = [...prev];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        clothingItemId: nextItem.fashionItem?.id || nextItem.id,
        imageUrl: nextItem.fashionItem?.imageUrl || "",
        category: nextItem.category || nextItem.fashionItem?.category,
        isGhost: nextGhostData?.isGhost,
        brandName:
          nextGhostData?.brandName ||
          brandItemMetadata.brandItemSnapshot?.brandName ||
          nextItem.brandName,
        wardrobeImpact: nextGhostData?.wardrobeImpact,
        price:
          brandItemMetadata.brandItemSnapshot?.price ?? nextItem.price,
        ...brandItemMetadata,
      };

      return newItems;
    });
  };

  const handleSaveOutfit = async () => {
    if (!outfitData || selectedItems.length === 0 || !canvasRef.current) return;

    try {
      const invalidItems = selectedItems.filter(item => !item.clothingItemId);
      if (invalidItems.length > 0) {
        toast.error("Một số trang phục không hợp lệ hoặc thiếu thông tin sản phẩm thời trang. Vui lòng chọn lại!");
        return;
      }

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

      if (!blob) throw new Error("Không thể tạo ảnh từ Canvas");

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
          fashionItemId: item.clothingItemId,
          positionX: Math.max(1, Math.abs(item.x || 0)),
          positionY: Math.max(1, Math.abs(item.y || 0)),
          scale: (item.scale || 100) / 100,
          layerOrder: item.zIndex || 1,
        })),
      });

      router.push("/outfits");
    } catch (error: any) {
      console.error(error);
      if (!error.isAxiosError) {
        toast.error(error.message || "Không thể lưu bộ phối đồ");
      }
    } finally {
      setIsSaving(false);
      toast.dismiss("save_outfit");
    }
  };

  const hasSelectedOptions = !!(selectedOccasion || selectedStyle || detailsInput.trim());

  return (
    <div className="min-h-full flex flex-col pt-4 md:pt-8 bg-background max-w-[1600px] w-full mx-auto pb-10">
      <div className="flex flex-col h-full gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1 items-start">
          <div className="lg:col-span-8 flex flex-col gap-0 relative min-h-[600px] h-[600px] lg:h-[800px] border border-border bg-card shadow-sm rounded-2xl overflow-hidden">
            {outfitData ? (
              <>
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground bg-card border border-border px-3 py-1.5 rounded-full flex items-center gap-2">
                    <Layers className="size-3.5" /> CANVAS STUDIO
                  </span>
                </div>

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
                  onBrandItemFeedbackClick={(item) => {
                    setActiveBrandFeedbackItem(item);
                    setIsBrandFeedbackOpen(true);
                  }}
                  onGhostItemClick={(item) => {
                    if (outfitData) {
                      const outfitItem = outfitData.items.find(i => i.role === item._role);
                      if (outfitItem) {
                        const allOptions = [outfitItem.primary, ...(outfitItem.alternatives || [])];
                        const realGhostItem = allOptions.find(i => (i.fashionItem?.id || i.id) === item.clothingItemId);
                        if (realGhostItem && isGhostItem(realGhostItem)) {
                          setActiveGhostItem(realGhostItem);
                          setIsImpactPanelOpen(true);
                          return;
                        }
                      }
                    }
                  }}
                  emptyState={
                    <div className="text-center p-12">
                      <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">CHƯA CHỌN MÓN ĐỒ NÀO.</p>
                    </div>
                  }
                />

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
                    <h3 className="text-xl font-bold text-foreground uppercase tracking-tight mb-3">Khung sáng tạo</h3>
                    <p className="text-balance text-muted-foreground text-[13px] leading-relaxed">
                      Thiết lập thông số kỹ thuật và nhập ý tưởng thiết kế ở bảng điều khiển bên phải. Hệ thống CLOSY AI sẽ kiến tạo một bộ trang phục dành riêng cho bạn.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 h-auto lg:h-[800px] border border-border bg-card flex flex-col relative shadow-sm overflow-hidden rounded-2xl">
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

              <div className="group flex flex-col gap-2 border-b border-border pb-4 focus-within:border-foreground transition-colors">
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
                  <p className="text-[9px] text-muted-foreground mt-1 tracking-widest uppercase">Thử nghiệm các mẫu thiết kế ảo</p>
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

      <BrandItemFeedbackSheet
        key={activeBrandFeedbackItem?.brandItemId || "brand-item-feedback"}
        isOpen={isBrandFeedbackOpen}
        onClose={() => {
          setIsBrandFeedbackOpen(false);
          setActiveBrandFeedbackItem(null);
        }}
        brandItemId={activeBrandFeedbackItem?.brandItemId}
        snapshot={activeBrandFeedbackItem?.brandItemSnapshot}
      />

      <WardrobeImpactPanel
        isOpen={isImpactPanelOpen}
        onClose={() => setIsImpactPanelOpen(false)}
        item={activeGhostItem}
        onFeedback={(itemId, payload) => createSampleFeedback.mutate({ itemId, payload })}
        onKeep={() => {
          if (activeGhostItem) logGhostAction(activeGhostItem.id, 'keep');
          setIsImpactPanelOpen(false);
        }}
        onSwap={() => {
          if (activeGhostItem) {
            const activeFashionId = activeGhostItem.fashionItem?.id || activeGhostItem.id;
            const canvasItem = selectedItems.find(x => x.clothingItemId === activeFashionId);
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
            const { addToCart } = useB2BDemoStore.getState();
            addToCart({
              productId: activeGhostItem.id,
              name: `${activeGhostItem.category?.name || "Sản phẩm"} ${activeGhostItem.fashionItem?.color || "Basic"}`,
              price: activeGhostItem.price || 500000,
              quantity: 1,
              size: "M",
              color: activeGhostItem.fashionItem?.color || "Basic",
              imageUrl: activeGhostItem.fashionItem?.imageUrl || "",
              brandId: activeGhostItem.brandId,
              brandName: activeGhostItem.brandName,
              selected: true,
            });
          }
        }}
        onHideBrand={() => {
          if (activeGhostItem) {
            hideBrand(activeGhostItem.brandId);
            const activeFashionId = activeGhostItem.fashionItem?.id || activeGhostItem.id;
            setSelectedItems(prev => prev.filter(x => x.clothingItemId !== activeFashionId));
            setIsImpactPanelOpen(false);
            toast.success("Sẽ không đề xuất brand này nữa.");
          }
        }}
        onNotMyStyle={() => {
          if (activeGhostItem) {
            logGhostAction(activeGhostItem.id, 'notMyStyle');
            const activeFashionId = activeGhostItem.fashionItem?.id || activeGhostItem.id;
            setSelectedItems(prev => prev.filter(x => x.clothingItemId !== activeFashionId));
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
