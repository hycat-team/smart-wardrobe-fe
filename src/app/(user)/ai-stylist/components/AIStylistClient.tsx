"use client";
import { useState } from "react";
import { Sparkles, Save, RefreshCw, Send, Image as ImageIcon, ZoomIn, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const OCCASIONS = ["🎓 Đi học", "💼 Đi làm", "🌙 Hẹn hò", "🎉 Tiệc", "🏃 Thể thao", "🏠 Ở nhà"];
const STYLES = ["Minimalist", "Casual", "Formal", "Trendy", "Vintage", "Streetwear"];

export function AIStylistClient() {
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
    <div className="flex-1 relative pb-32 md:pb-12 min-h-[calc(100vh-100px)] flex flex-col">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full flex-1 flex flex-col pt-8">
        {/* Page Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-display-lg-mobile md:font-display-lg text-primary mb-2">Today's Curated Look</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Optimized for your schedule and local conditions, drawing from your conscious wardrobe.
            </p>
          </div>
          {/* Context Chips */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-surface-container text-on-surface font-label-caps text-label-caps px-4 py-2 rounded-full flex items-center gap-2 border border-outline-variant/20">
              <span className="material-symbols-outlined text-[16px] text-secondary">sunny</span>
              <span>Sunny, 24°C</span>
            </div>
            <div className="bg-surface-container text-on-surface font-label-caps text-label-caps px-4 py-2 rounded-full flex items-center gap-2 border border-outline-variant/20">
              <span className="material-symbols-outlined text-[16px] text-secondary">business_center</span>
              <span>Office Days</span>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-1">
          {/* Left Column: Visual Outfit (Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-gutter">
            {/* Main Flat-lay Hero */}
            <div className="relative bg-surface-container-low rounded-xl overflow-hidden aspect-[4/3] md:aspect-[16/9] shadow-sm group border border-outline-variant/20">
              {hasResult ? (
                <img 
                  alt="Outfit Flat-lay" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgb-9GhUsL5ThxlKE9i7E6cwgP9eU-d_MF3p_m8Gv3YMHzDG1IpqRLO0ODAfUTYhruPUK5FCS4ZVxawYkeZgRDBdSepejgdXq2SQV_SurHt3o7PNWQCoLYMI6uWfx-FFL1_eBD1i45c8MJglx1mZlR1oPZMxJzZgpJMnQjDdNsW_OOPB41FyMIsGM4hGp3Ush0nMIgpQ0aTPI9tD888KFttjMjBxzlVKM7uXeLcHvdGnqzg4c1TFbR4Lx-D6OlH4_W-WvyCIwdVgk"
                />
              ) : isGenerating ? (
                <div className="w-full h-full flex items-center justify-center bg-surface-container-low animate-pulse">
                  <Sparkles className="size-10 text-primary opacity-50 animate-bounce" />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-low p-6 text-center">
                  <Sparkles className="size-12 text-primary/30 mb-4" />
                  <p className="text-primary font-title-lg text-lg mb-2">Chưa có outfit</p>
                  <p className="text-on-surface-variant text-sm max-w-sm">Hãy dùng trợ lý AI bên phải để phân tích tủ đồ và gợi ý trang phục cho hôm nay nhé.</p>
                </div>
              )}
              
              {/* Overlay gradient for luxury feel */}
              {hasResult && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <button className="absolute bottom-6 right-6 bg-surface-container-lowest/90 backdrop-blur-md text-primary p-3 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center">
                    <ZoomIn className="size-5" />
                  </button>
                </>
              )}
            </div>

            {/* Individual Items Breakdown */}
            {hasResult && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <h3 className="font-title-lg text-title-lg text-primary mb-4">Comprised Of</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Item 1 */}
                  <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm border border-surface-container hover:border-outline-variant/50 transition-colors cursor-pointer">
                    <div className="aspect-square rounded-md bg-surface-container-low mb-3 overflow-hidden">
                      <img alt="Linen Blazer" className="w-full h-full object-cover mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ0lti_lykgDsfbjNHTEiYPcstAhYAJGENTn_8cRgL5s65k89uXCuSOht8MxCeBvg816ioLzYlDUKpI5zZoGI_uu5kskg7Ptp7vUUdyN91ajxpQyiuQTxDF52GacdhzX6uoMAljTE8ZqZJekoQxDuYLT6A0saFuVZLhNs-FsWfRYQixPh-tTKu1g7U9NL1mbI4JGzZY9shDp6PqxVcCbLceY0IyA2lib7vw7_8W6w_YmN41PApeUAElkPAe7U8uY2nN05CrEyYSfA"/>
                    </div>
                    <p className="font-label-caps text-[10px] text-secondary mb-1">Organic Linen</p>
                    <p className="font-body-sm text-body-sm text-primary font-medium truncate">Structured Blazer</p>
                  </div>
                  {/* Item 2 */}
                  <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm border border-surface-container hover:border-outline-variant/50 transition-colors cursor-pointer">
                    <div className="aspect-square rounded-md bg-surface-container-low mb-3 overflow-hidden">
                      <img alt="Silk Camisole" className="w-full h-full object-cover mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFkr_4GoVG1aMoaXyg9-4dOYb4gQBDbSQ4Vskkg8zpuyRoHA5AizMwRYzaNJpOu-HTZIUPRDaC3w0cA3A_ZppccbUKKha-3xappmXhiVZgqm32TAUN2pvkAa2xuYr-Bzv26PAGzEYvOuWheV7d3SlhPJrAYWv5-hL8yRM7JMStKswWHKRAw0-CfZrRds5EnFOIoyqfNJvUMOlB7gj60JqiV_hN07oCHcDTIPbm4aJq_oFyFgeFPSXjr69EiW2rixnXvHRZJG6mJEM"/>
                    </div>
                    <p className="font-label-caps text-[10px] text-secondary mb-1">Upcycled Silk</p>
                    <p className="font-body-sm text-body-sm text-primary font-medium truncate">Draped Camisole</p>
                  </div>
                  {/* Item 3 */}
                  <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm border border-surface-container hover:border-outline-variant/50 transition-colors cursor-pointer">
                    <div className="aspect-square rounded-md bg-surface-container-low mb-3 overflow-hidden">
                      <img alt="Wide Leg Trousers" className="w-full h-full object-cover mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAjCO5c6YXH_kg2Z05YUKNXSOZ1So5Z7mzX0A_QK1k2x7q11z21-YcfNIrWuhsFO6vFURv9qKGRYabPpQ2d_fb7Wc5UIbyBDyMmj_voc9mzsjeatP2nPxwk_CGawbiZs9EycpBYKAv7tcGLmHlBBNHslAU_aKqkeaX4nXRhHoeqwA-fPhNn5G5iIUuAkg7WolMTSYEF5jdRpUPqj3YEsmWSk3i1g5bvrFD4otuVI0d2uGDKnDPGp0KNv9dzepczMQRe0aCfPNa01U"/>
                    </div>
                    <p className="font-label-caps text-[10px] text-secondary mb-1">Tencel Blend</p>
                    <p className="font-body-sm text-body-sm text-primary font-medium truncate">Flow Trousers</p>
                  </div>
                  {/* Item 4 */}
                  <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm border border-surface-container hover:border-outline-variant/50 transition-colors cursor-pointer">
                    <div className="aspect-square rounded-md bg-surface-container-low mb-3 overflow-hidden flex items-center justify-center">
                      <img alt="Leather Loafers" className="w-full h-full object-cover mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXXqUlhyepBsniCXWPaJC8EsBHofr0KjGrdT2juBazb13fYbjGNUl_yANyRQeafkYAt_2QjMFCvlRAXuDEatVRoY9CiSmWxusbfXi9D7lQCJHO9kwzOX2afDpEv4c-Zu63Rz19HNgY2ONVQwsGYRFUJjNJ8SmyxRiYVPC9T_aZLi9feWf6bN5K312c4hH_uUmUjUtePJWXFt6oD4JUUVW5nUWPCFtRh8u6bLRyfJ_GPLZLLd9MQHCokOl7TVVZCVq1OLoBdLZS1S4"/>
                    </div>
                    <p className="font-label-caps text-[10px] text-secondary mb-1">Vegan Leather</p>
                    <p className="font-body-sm text-body-sm text-primary font-medium truncate">Classic Loafer</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Chat Interface (Span 4) */}
          <div className="lg:col-span-4 h-[600px] lg:h-auto rounded-xl shadow-md border border-outline-variant/20 bg-surface-container-lowest/80 backdrop-blur-[20px] flex flex-col overflow-hidden relative">
            {/* Chat Header */}
            <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h3 className="font-title-lg text-[18px] text-primary">Ethos AI</h3>
                  <p className="font-body-sm text-[12px] text-on-surface-variant">Your Personal Stylist</p>
                </div>
              </div>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <MoreHorizontal className="size-5" />
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto no-scrollbar space-y-6 flex flex-col bg-surface/30">
              
              {/* Form Config inside Chat context if no result yet */}
              {!hasResult && !isGenerating && (
                 <div className="bg-surface-container-low text-on-surface p-4 rounded-2xl font-body-sm text-[14px] leading-relaxed shadow-sm border border-outline-variant/20 mb-4 animate-in fade-in">
                    <p className="mb-3 font-medium text-primary">Hãy thiết lập yêu cầu hôm nay:</p>
                    
                    <div className="mb-4">
                      <p className="text-xs text-on-surface-variant mb-2 font-label-caps">DỊP SỬ DỤNG</p>
                      <div className="flex flex-wrap gap-2">
                        {OCCASIONS.map(occ => (
                          <button 
                            key={occ} 
                            onClick={() => setSelectedOccasion(occ)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs transition-colors border", 
                              selectedOccasion === occ ? "bg-primary text-on-primary border-primary" : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-variant"
                            )}
                          >
                            {occ}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-on-surface-variant mb-2 font-label-caps">PHONG CÁCH</p>
                      <div className="flex flex-wrap gap-2">
                        {STYLES.map(style => (
                          <button 
                            key={style} 
                            onClick={() => setSelectedStyle(style)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs transition-colors border", 
                              selectedStyle === style ? "bg-primary text-on-primary border-primary" : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-variant"
                            )}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleGenerate}
                      className="w-full bg-primary text-on-primary font-body-lg text-[14px] font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors mt-2 flex justify-center items-center gap-2"
                    >
                      <Sparkles className="size-4" /> Bắt đầu phân tích
                    </button>
                 </div>
              )}

              {/* AI Message */}
              {hasResult && (
                <div className="flex flex-col gap-1 max-w-[85%] animate-in slide-in-from-left-2">
                  <div className="bg-surface-container-low text-on-surface p-4 rounded-2xl rounded-tl-none font-body-sm text-[15px] leading-relaxed shadow-sm">
                      Good morning. Based on today's forecast of 24°C and your schedule showing office hours followed by a light dinner, I've curated a breathable, structured look. The linen blend will keep you comfortable, while the tailoring maintains a professional silhouette.
                  </div>
                  <span className="text-[11px] text-on-surface-variant/60 ml-2">Just now</span>
                </div>
              )}

              {/* User Message */}
              {hasResult && (
                <div className="flex flex-col gap-1 max-w-[85%] self-end items-end animate-in slide-in-from-right-2">
                  <div className="bg-primary text-on-primary p-4 rounded-2xl rounded-tr-none font-body-sm text-[15px] leading-relaxed shadow-sm">
                      I love the silhouette. Could we swap the heels for something flatter? I'll be walking quite a bit.
                  </div>
                  <span className="text-[11px] text-on-surface-variant/60 mr-2">1 min ago</span>
                </div>
              )}

              {/* AI Message (Typing Indicator) */}
              {isGenerating && (
                <div className="flex flex-col gap-1 max-w-[85%] animate-in fade-in">
                  <div className="bg-surface-container-low text-on-surface p-4 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm w-16 h-12">
                    <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-surface-container-lowest/80 border-t border-outline-variant/20">
              <div className="relative flex items-center group">
                <input 
                  className="w-full bg-transparent border-0 border-b border-outline-variant/50 focus:border-transparent focus:ring-0 px-0 py-3 font-body-sm text-primary placeholder:text-on-surface-variant/50 transition-all peer focus:bg-surface-container-low focus:px-4 focus:rounded-lg" 
                  placeholder="Ask to adjust color, formality, or items..." 
                  type="text"
                />
                <button className="absolute right-2 text-primary opacity-50 hover:opacity-100 transition-opacity peer-focus:right-4">
                  <Send className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        {hasResult && (
          <div className="mt-8 flex justify-end gap-4 border-t border-outline-variant/20 pt-6 animate-in fade-in">
            <button 
              onClick={() => { setHasResult(false); setIsGenerating(false); }}
              className="px-8 py-3 rounded-none border border-secondary text-secondary font-body-lg text-[15px] font-medium hover:bg-secondary/5 transition-colors min-h-[48px] flex items-center gap-2"
            >
              <RefreshCw className="size-4" /> Regenerate
            </button>
            <button className="px-8 py-3 rounded-none bg-primary text-on-primary font-body-lg text-[15px] font-medium hover:bg-primary/90 transition-colors shadow-sm min-h-[48px] flex items-center gap-2">
              <Save className="size-4" /> Save Look to Wardrobe
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



