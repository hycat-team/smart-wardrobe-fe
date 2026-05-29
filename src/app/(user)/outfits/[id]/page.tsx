"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles, Save, X, Grid, AlertCircle, ZoomIn, ZoomOut, CloudRain, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MOCK_ITEMS } from "../../wardrobe/page";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

const OCCASIONS = ["Casual", "Workwear", "Summer", "Party", "Formal", "Sporty"];

const MOODBOARDS = [
  { id: "clean-girl", name: "Clean Girl", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200" },
  { id: "dark-academia", name: "Dark Academia", img: "https://images.unsplash.com/photo-1550614000-4b95d466f2c8?auto=format&fit=crop&q=80&w=200" },
  { id: "street-luxe", name: "Street Luxe", img: "https://images.unsplash.com/photo-1511511450040-677116ff389e?auto=format&fit=crop&q=80&w=200" },
  { id: "coastal", name: "Coastal", img: "https://images.unsplash.com/photo-1499939667766-4afceb292d05?auto=format&fit=crop&q=80&w=200" },
  { id: "business", name: "Business Core", img: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=200" },
  { id: "y2k", name: "Y2K Revival", img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=200" },
];

export default function CreateOutfit() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.isPremium;
  const [outfitName, setOutfitName] = useState("");
  const [occasion, setOccasion] = useState("Casual");
  const [customOccasion, setCustomOccasion] = useState("");
  const [selectedMoodboard, setSelectedMoodboard] = useState("");
  const [useWeather, setUseWeather] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  // Selection handler
  const handleItemToggle = (item: any) => {
    if (selectedItems.some(x => x.id === item.id)) {
      setSelectedItems(prev => prev.filter(x => x.id !== item.id));
    } else {
      setSelectedItems(prev => [...prev, { ...item, scale: 100, rotation: 0 }]);
      toast.success(`Đã thêm ${item.name} vào canvas!`);
    }
  };

  // Canvas manipulations
  const updateScale = (id: string, newScale: number) => {
    setSelectedItems(prev => prev.map(x => x.id === id ? { ...x, scale: Math.max(50, Math.min(150, newScale)) } : x));
  };

  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(x => x.id !== id));
  };

  // AI Auto-matching magic button
  const handleAIMatch = () => {
    // Pick 1 Top, 1 Bottom, and 1 Shoes from the wardrobe mocks
    const tops = MOCK_ITEMS.filter(x => x.category === "Áo");
    const bottoms = MOCK_ITEMS.filter(x => x.category === "Quần");
    const shoes = MOCK_ITEMS.filter(x => x.category === "Giày");

    if (tops.length === 0 || bottoms.length === 0) {
      toast.error("Không đủ quần áo trong tủ đồ để thực hiện AI match!");
      return;
    }

    const randomTop = tops[Math.floor(Math.random() * tops.length)];
    const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    const randomShoes = shoes.length > 0 ? shoes[Math.floor(Math.random() * shoes.length)] : null;

    const matched = [
      { ...randomTop, scale: 100, rotation: 0 },
      { ...randomBottom, scale: 100, rotation: 0 }
    ];

    if (randomShoes) {
      matched.push({ ...randomShoes, scale: 95, rotation: 0 });
    }

    setSelectedItems(matched);
    setOutfitName("AI Suggested Outfit " + Math.floor(Math.random() * 100));
    toast.success("AI Stylist đã gợi ý bộ phối hợp hoàn chỉnh!");
  };

  // Submit
  const handleSaveOutfit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length < 2) {
      toast.error("Vui lòng chọn tối thiểu 2 món đồ để tạo thành một Outfit phối hợp.");
      return;
    }
    if (!outfitName) {
      toast.error("Vui lòng đặt tên cho bộ trang phục phối này.");
      return;
    }

    toast.success("Đã tạo mới bộ phối đồ thành công!");
    router.push("/outfits");
  };

  // Filter closet items by category
  const categories = ["Tất cả", "Áo", "Quần", "Váy", "Giày", "Phụ kiện"];
  const filteredCloset = activeCategory === "Tất cả" 
    ? MOCK_ITEMS 
    : MOCK_ITEMS.filter(x => x.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500 pb-16 font-sans">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-dark pb-4">
        <div className="space-y-1">
          <Link 
            href="/outfits" 
            className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" /> QUAY LẠI OUTFITS
          </Link>
          <h1 className={cn("text-2xl font-heading font-medium tracking-wide text-ink")}>Mix & Match Canvas</h1>
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
            className="flex-1 sm:flex-none h-11 rounded-xl bg-ink text-cream hover:bg-ink/90 px-6 text-xs font-mono tracking-wider flex items-center justify-center gap-1.5"
          >
            <Save className="size-4" /> LƯU PHỐI ĐỒ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: THE CLOSET (LG: 5/12) */}
        <div className="lg:col-span-5 space-y-4">
          <div className={cn("border rounded-2xl p-4 md:p-6 space-y-4", isPremium ? "bg-card border-border shadow-sm" : "bg-cream-dark/15 border-cream-dark/60")}>
            
            <div className="space-y-1">
              <h3 className={cn("font-heading font-bold text-lg text-ink")}>Tủ đồ cá nhân</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Chọn các món đồ để mang lên bàn phối đồ.</p>
            </div>

            {/* Categories horizontal tabs */}
            <div className="flex overflow-x-auto gap-1 no-scrollbar pb-1 border-b border-cream-dark/40">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                    activeCategory === cat 
                      ? "bg-ink text-cream" 
                      : "text-ink-muted hover:text-ink hover:bg-cream-dark/50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Closet Items Grid */}
            <div className="grid grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
              {filteredCloset.map(item => {
                const isSelected = selectedItems.some(x => x.id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemToggle(item)}
                    className={cn(
                      "relative rounded-xl overflow-hidden aspect-square border cursor-pointer bg-cream-dark/20 transition-all select-none",
                      isSelected 
                        ? "border-terracotta ring-1 ring-terracotta" 
                        : "border-cream-dark/80 hover:border-ink/20"
                    )}
                  >
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/40 text-[9px] text-white p-1 text-center font-mono truncate">
                      {item.brand}
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-terracotta/25 flex items-center justify-center">
                        <span className="bg-cream text-terracotta size-5 rounded-full flex items-center justify-center font-bold text-xs shadow-sm">✓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* OUTFIT FORM SETTINGS */}
          <div className={cn("border rounded-2xl p-4 md:p-6 space-y-4", isPremium ? "bg-card border-border shadow-sm" : "bg-cream-dark/15 border-cream-dark/60")}>
            <h3 className={cn("font-heading font-bold text-lg text-ink")}>Thiết lập bộ trang phục</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="outfit-name" className="text-xs font-mono uppercase tracking-wider text-ink font-semibold">Tên bộ phối</Label>
                <Input
                  id="outfit-name"
                  type="text"
                  required
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  placeholder="Ví dụ: Phối đồ Đi cafe Cuối tuần"
                  className="h-11 bg-cream border-cream-dark focus-visible:ring-1 focus-visible:ring-terracotta focus-visible:border-terracotta rounded-xl text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">Dịp sử dụng</Label>
                <div className="flex flex-wrap gap-1.5">
                  {OCCASIONS.map(occ => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => {
                        setOccasion(occ);
                        setCustomOccasion("");
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs transition-all border",
                        occasion === occ && !customOccasion
                          ? "bg-primary border-primary text-primary-foreground font-medium" 
                          : "bg-transparent border-border text-muted-foreground hover:bg-secondary/50"
                      )}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
                {isPremium && (
                  <Input
                    type="text"
                    value={customOccasion}
                    onChange={(e) => setCustomOccasion(e.target.value)}
                    placeholder="Mô tả dịp cụ thể (VD: Hẹn hò mùa đông)..."
                    className="h-10 mt-2 bg-transparent border-border focus-visible:ring-1 focus-visible:ring-primary rounded-xl text-sm"
                  />
                )}
              </div>

              {isPremium && (
                <>
                  <div className="space-y-2 pt-2">
                    <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex justify-between items-center">
                      Mood Board
                      <span className="text-[9px] text-primary normal-case italic font-sans tracking-normal">✦ Premium AI</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {MOODBOARDS.map((mood) => (
                        <div 
                          key={mood.id} 
                          onClick={() => setSelectedMoodboard(mood.id)}
                          className={cn(
                            "relative aspect-video rounded-lg overflow-hidden cursor-pointer group border-2 transition-all",
                            selectedMoodboard === mood.id ? "border-primary shadow-sm" : "border-transparent"
                          )}
                        >
                          <img src={mood.img} alt={mood.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-[9px] font-mono font-bold text-white tracking-widest text-center px-1">{mood.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setUseWeather(!useWeather)}
                      className={cn(
                        "w-full h-10 rounded-xl text-xs font-mono tracking-wider flex items-center gap-2 transition-all",
                        useWeather 
                          ? "border-primary text-primary bg-primary/10" 
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {useWeather ? <Sun className="size-4" /> : <CloudRain className="size-4" />}
                      {useWeather ? "ĐÃ BẬT TÍNH NĂNG THỜI TIẾT" : "TÍNH ĐẾN THỜI TIẾT (24°C, MƯA NHẸ)"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STYLING CANVAS (LG: 7/12) */}
        <div className="lg:col-span-7 space-y-4">
          <div className={cn(
            "border rounded-2xl p-6 h-[460px] md:h-[600px] relative flex flex-col justify-between overflow-hidden shadow-inner",
            isPremium ? "bg-card/50 border-border" : "bg-[#EFEBE3]/30 border-cream-dark/80"
          )}>
            
            {/* Grid layout decoration */}
            <div className={cn(
              "absolute inset-0 pointer-events-none opacity-20",
              isPremium ? "bg-[radial-gradient(#B8975A_0.5px,transparent_0.5px)] [background-size:24px_24px]" : "bg-[radial-gradient(#1A1A1A_0.4px,transparent_0.4px)] [background-size:20px_20px]"
            )} />

            {/* Canvas Header Toolbar */}
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider bg-cream/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-cream-dark/40 shadow-sm">
                Bàn Phối Đồ ({selectedItems.length} sản phẩm)
              </span>

              {selectedItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItems([]);
                    setOutfitName("");
                  }}
                  className="text-xs font-mono text-terracotta hover:underline flex items-center gap-1 bg-cream/80 backdrop-blur-sm px-2 py-1 rounded-md border border-cream-dark/40 shadow-sm"
                >
                  <X className="size-3" /> Làm mới canvas
                </button>
              )}
            </div>

            {/* Canvas viewport space */}
            <div className="flex-1 relative flex items-center justify-center p-8 select-none">
              {selectedItems.length > 0 ? (
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 max-w-full">
                  {selectedItems.map(item => (
                    <div 
                      key={item.id} 
                      className="relative bg-cream border border-cream-dark/80 p-3 rounded-2xl shadow-md transition-all flex flex-col items-center max-w-[120px] md:max-w-[140px]"
                      style={{ 
                        transform: `scale(${item.scale / 100})`,
                      }}
                    >
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-terracotta text-cream flex items-center justify-center hover:bg-terracotta/90 transition-colors shadow-sm"
                      >
                        <X className="size-3" />
                      </button>

                      {/* Image */}
                      <div className="w-20 md:w-24 aspect-[4/5] rounded-xl overflow-hidden bg-cream-dark/20">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Info & Adjuster */}
                      <p className="text-[10px] font-medium text-ink truncate w-full text-center mt-2">{item.name}</p>
                      
                      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-cream-dark/40 w-full justify-between">
                        <button 
                          type="button" 
                          onClick={() => updateScale(item.id, item.scale - 10)}
                          className="size-4 hover:bg-cream-dark rounded flex items-center justify-center text-ink-muted"
                          title="Thu nhỏ"
                        >
                          <ZoomOut className="size-2.5" />
                        </button>
                        <span className="text-[9px] font-mono text-ink-muted">{item.scale}%</span>
                        <button 
                          type="button" 
                          onClick={() => updateScale(item.id, item.scale + 10)}
                          className="size-4 hover:bg-cream-dark rounded flex items-center justify-center text-ink-muted"
                          title="Phóng to"
                        >
                          <ZoomIn className="size-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center space-y-3 p-8 border border-dashed border-cream-dark/80 rounded-2xl max-w-sm bg-cream/40 backdrop-blur-[2px]">
                  <div className="size-11 bg-cream rounded-full flex items-center justify-center mx-auto text-ink-muted shadow-sm">
                    <Grid className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-ink">Bàn phối trống</p>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      Chọn các trang phục bên trái hoặc nhấp <span className="text-terracotta font-semibold hover:underline cursor-pointer" onClick={handleAIMatch}>AI Tự Phối</span> để bắt đầu phối đồ.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick tips footer */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-ink-muted bg-cream/70 backdrop-blur-sm p-2 rounded-xl border border-cream-dark/40 mt-auto z-10 justify-center">
              <AlertCircle className="size-3.5 text-terracotta" />
              <span>Gợi ý: Phối ít nhất 1 món Áo + 1 món Quần/Váy để có Outfit hợp lệ.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}



