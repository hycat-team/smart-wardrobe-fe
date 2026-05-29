"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Save, RefreshCw, Send, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const OCCASIONS = ["🎓 Đi học", "💼 Đi làm", "🌙 Hẹn hò", "🎉 Tiệc", "🏃 Thể thao", "🏠 Ở nhà"];
const STYLES = ["Minimalist", "Casual", "Formal", "Trendy", "Vintage", "Streetwear"];

export default function AIStylist() {
  const [activeTab, setActiveTab] = useState<"suggest" | "chat">("suggest");
  const [selectedOccasion, setSelectedOccasion] = useState(OCCASIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasResult(true);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-150px)] max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-heading font-bold text-ink flex items-center gap-2">
          <Sparkles className="text-primary size-6" /> AI Stylist
        </h1>
        <div className="text-sm font-medium bg-secondary px-3 py-1 rounded-full text-ink border border-border">
          Lượt còn lại: <span className="text-primary">2/3</span> (Free)
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="flex border-b border-border mb-6">
        <button 
          onClick={() => setActiveTab("suggest")}
          className={cn(
            "px-6 py-3 font-medium text-sm transition-all border-b-2",
            activeTab === "suggest" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-ink"
          )}
        >
          Gợi Ý Outfit
        </button>
        <button 
          onClick={() => setActiveTab("chat")}
          className={cn(
            "px-6 py-3 font-medium text-sm transition-all border-b-2",
            activeTab === "chat" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-ink"
          )}
        >
          Chat với Stylist
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "suggest" ? (
          <div className="h-full overflow-y-auto no-scrollbar space-y-8 pb-10">
            {/* Form */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-ink mb-3">Dịp nào?</h3>
                  <div className="flex flex-wrap gap-2">
                    {OCCASIONS.map(occ => (
                      <button 
                        key={occ} 
                        onClick={() => setSelectedOccasion(occ)}
                        className={cn("px-4 py-2 rounded-full text-sm border transition-colors", selectedOccasion === occ ? "bg-ink text-cream border-ink" : "bg-background text-ink-muted border-border hover:bg-secondary")}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-ink mb-3">Phong cách mong muốn?</h3>
                  <div className="flex flex-wrap gap-2">
                    {STYLES.map(style => (
                      <button 
                        key={style} 
                        onClick={() => setSelectedStyle(style)}
                        className={cn("px-4 py-2 rounded-full text-sm border transition-colors", selectedStyle === style ? "bg-ink text-cream border-ink" : "bg-background text-ink-muted border-border hover:bg-secondary")}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                  <span className="text-sm text-ink-muted">Thời tiết hôm nay: <span className="font-medium text-ink">☀️ 32°C (Hồ Chí Minh)</span></span>
                  <Button onClick={handleGenerate} disabled={isGenerating} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-full px-6">
                    {isGenerating ? "✦ Đang phân tích..." : "✦ Gợi Ý Outfit"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            {isGenerating && (
              <div className="space-y-4 animate-pulse">
                <div className="h-40 bg-secondary rounded-2xl" />
                <div className="h-40 bg-secondary rounded-2xl" />
              </div>
            )}

            {hasResult && !isGenerating && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="font-heading text-2xl font-bold text-ink">Outfit Đề Xuất</h2>
                
                {/* Outfit Card 1 */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row">
                  <div className="w-full md:w-2/5 p-6 bg-secondary/30 flex items-center justify-center gap-2">
                     <div className="w-24 aspect-[3/4] bg-muted rounded-lg shadow-sm overflow-hidden relative">
                       <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
                       <span className="absolute bottom-1 left-1 text-[9px] bg-background/80 px-1 rounded">Áo</span>
                     </div>
                     <span className="text-muted-foreground">+</span>
                     <div className="w-24 aspect-[3/4] bg-muted rounded-lg shadow-sm overflow-hidden relative">
                       <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
                       <span className="absolute bottom-1 left-1 text-[9px] bg-background/80 px-1 rounded">Quần</span>
                     </div>
                     <span className="text-muted-foreground">+</span>
                     <div className="w-20 aspect-square bg-muted rounded-lg shadow-sm overflow-hidden relative self-end mb-4">
                       <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
                       <span className="absolute bottom-1 left-1 text-[9px] bg-background/80 px-1 rounded">Giày</span>
                     </div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col">
                    <h3 className="font-heading font-bold text-xl mb-3">#1 Trẻ trung đến lớp</h3>
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                      <p className="text-sm text-ink-muted leading-relaxed">
                        <span className="font-bold text-primary">💬 AI giải thích:</span> Sự kết hợp trắng-xanh navy tạo độ tương phản rõ ràng theo nguyên tắc màu bổ túc. Chất liệu cotton và denim phù hợp với thời tiết 32°C. Giày trắng giúp outfit sáng và nhẹ nhàng hơn.
                      </p>
                    </div>
                    <div className="mt-auto flex gap-3">
                      <Button className="rounded-full bg-ink text-cream hover:bg-ink/90 flex-1"><Save className="size-4 mr-2" /> Lưu Outfit</Button>
                      <Button variant="outline" className="rounded-full"><RefreshCw className="size-4 mr-2" /> Thay đổi</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
             {/* Chat History */}
             <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="flex gap-4">
                   <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                     <Sparkles className="size-4 text-primary" />
                   </div>
                   <div className="bg-secondary p-4 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-ink leading-relaxed">
                     Xin chào! Tôi là stylist AI của bạn. Hôm nay bạn muốn mặc gì? 😊
                   </div>
                </div>
                
                <div className="flex gap-4 flex-row-reverse">
                   <div className="bg-primary p-4 rounded-2xl rounded-tr-none max-w-[80%] text-sm text-primary-foreground leading-relaxed shadow-sm">
                     Tôi cần outfit đi phỏng vấn tuần tới, muốn trông professional nhưng không quá cứng nhắc.
                   </div>
                </div>

                <div className="flex gap-4">
                   <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                     <Sparkles className="size-4 text-primary" />
                   </div>
                   <div className="bg-secondary p-4 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-ink leading-relaxed">
                     Tuyệt! Trong tủ đồ của bạn, tôi thấy có áo sơ mi trắng lụa và quần tây ống rộng xám. <br/><br/>
                     Gợi ý: Kết hợp sơ mi trắng (sơ vin) với quần xám, đi kèm giày loafer đen. Style "Smart Casual" rất phù hợp cho phỏng vấn hiện đại. Bạn có muốn xem hình ảnh outfit này không?
                   </div>
                </div>
             </div>
             
             {/* Chat Input */}
             <div className="p-4 bg-background border-t border-border">
                <div className="relative flex items-center">
                  <button className="absolute left-3 text-muted-foreground hover:text-primary transition-colors">
                    <ImageIcon className="size-5" />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Nhập tin nhắn..." 
                    className="w-full bg-secondary h-12 rounded-full pl-11 pr-12 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                  <button className="absolute right-1 size-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-transform hover:scale-105">
                    <Send className="size-4 ml-0.5" />
                  </button>
                </div>
                <div className="text-center mt-2">
                  <span className="text-[10px] text-muted-foreground">AI có thể mắc lỗi. Vui lòng kiểm tra lại.</span>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}


