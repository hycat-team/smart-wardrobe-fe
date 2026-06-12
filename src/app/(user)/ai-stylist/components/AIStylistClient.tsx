"use client";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import Image from "next/image";
import { Sparkles, Save, RefreshCw, Send, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { aiApi } from "@/features/ai-stylist/api/ai.api";
import { AIOutfitRecommendationRes, ChatMessage } from "@/features/ai-stylist/types";

gsap.registerPlugin(useGSAP);

const OCCASIONS = ["🎓 Đi học", "💼 Đi làm", "🌙 Hẹn hò", "🎉 Tiệc", "🏃 Thể thao", "🏠 Ở nhà"];
const STYLES = ["Minimalist", "Casual", "Formal", "Trendy", "Vintage", "Streetwear"];

export function AIStylistClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [selectedOccasion, setSelectedOccasion] = useState(OCCASIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [outfitData, setOutfitData] = useState<AIOutfitRecommendationRes | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [contextID, setContextID] = useState<string>("");
  const [chatInput, setChatInput] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatting]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const animateResults = contextSafe(() => {
    gsap.fromTo(
      ".outfit-item",
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.15, duration: 1, ease: "power4.out" }
    );
  });

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      
      const occasionClean = selectedOccasion.replace(/^[\u{1F300}-\u{1F9FF}\s]+/gu, '');

      const res = await aiApi.getOutfitRecommendation({
        occasion: occasionClean,
        styleTarget: selectedStyle,
        season: 'all',
        weather: 'warm',
        colorTone: 'neutral',
        details: 'đơn giản',
      });

      setOutfitData(res);
      setChatMessages([
        {
          id: crypto.randomUUID(),
          role: 'ai',
          content: res.explanation,
          timestamp: Date.now(),
        }
      ]);

      try {
        const session = await aiApi.createChatSession({ title: res.title });
        setContextID(session.id);
      } catch (e) {
        console.error("Failed to create chat session", e);
      }

      requestAnimationFrame(() => {
        animateResults();
      });
    } catch (error) {
      console.error("Lỗi lấy đề xuất:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatting || !contextID) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: chatInput,
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatting(true);

    const aiMsgId = crypto.randomUUID();
    setChatMessages(prev => [
      ...prev,
      { id: aiMsgId, role: 'ai', content: '', timestamp: Date.now() }
    ]);

    abortControllerRef.current = new AbortController();

    await aiApi.sendChatMessageStream(
      contextID,
      userMsg.content,
      (chunk) => {
        setChatMessages(prev =>
          prev.map(msg => msg.id === aiMsgId ? { ...msg, content: msg.content + chunk } : msg)
        );
      },
      (fullText) => {
        setIsChatting(false);
        setChatMessages(prev =>
          prev.map(msg => msg.id === aiMsgId ? { ...msg, content: fullText } : msg)
        );
      },
      (error) => {
        console.error("Lỗi stream chat:", error);
        setIsChatting(false);
      },
      abortControllerRef.current.signal
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div ref={containerRef} className="flex-1 relative pb-32 md:pb-12 min-h-[calc(100vh-100px)] flex flex-col bg-surface/50">
      {/* Texture overlay for editorial feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
      
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full flex-1 flex flex-col pt-8 relative z-10">
        
        {/* Page Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-display-lg-mobile md:font-display-lg text-primary mb-2 font-serif tracking-tight">
              {outfitData?.title || "Your Daily Lookbook"}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl italic">
              A curated selection designed for your specific moments.
            </p>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">
          
          {/* Left Column: Visual Outfit (Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {outfitData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
                {outfitData.items.map((item, index) => {
                  const isMain = index === 0;
                  return (
                    <div 
                      key={item.primary.id || index} 
                      className={cn(
                        "outfit-item group relative rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/30 shadow-sm transition-all duration-500 hover:shadow-md",
                        isMain ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"
                      )}
                    >
                      <Image 
                        src={item.primary.imageUrl} 
                        alt={item.role} 
                        fill 
                        priority={isMain}
                        sizes={isMain ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                        className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="font-label-caps text-[10px] text-white/80 uppercase tracking-widest mb-1">{item.primary.material || item.role}</p>
                        <p className="font-title-sm text-white font-medium truncate">{item.primary.category?.name || "Premium Item"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="relative bg-surface-container-lowest rounded-xl overflow-hidden aspect-[4/3] md:aspect-[16/9] border border-outline-variant/30 flex items-center justify-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center">
                    <Sparkles className="size-10 text-primary opacity-50 animate-bounce mb-4" />
                    <p className="text-primary font-serif italic text-lg tracking-wide">Curating your style...</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center opacity-60">
                    <Sparkles className="size-12 text-primary/30 mb-4" />
                    <p className="text-primary font-serif text-2xl mb-2 tracking-wide">The Blank Canvas</p>
                    <p className="text-on-surface-variant text-sm max-w-sm">Configure your occasion and style on the right to discover today&apos;s curation.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: AI Chat Interface (Span 4) */}
          <div className="lg:col-span-4 h-[600px] lg:h-auto rounded-xl shadow-lg border border-outline-variant/20 bg-surface-container-lowest/90 backdrop-blur-[24px] flex flex-col overflow-hidden relative">
            
            {/* Chat Header */}
            <div className="p-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h3 className="font-serif text-[18px] text-primary tracking-wide">Ethos Stylist</h3>
                  <p className="font-body-sm text-[12px] text-on-surface-variant tracking-wider uppercase">AI Assistant</p>
                </div>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 flex flex-col bg-surface-container-lowest/30 scroll-smooth">
              
              {!outfitData && !isGenerating && (
                 <div className="bg-surface text-on-surface p-5 rounded-2xl font-body-sm text-[14px] leading-relaxed shadow-sm border border-outline-variant/20 mb-4">
                    <p className="mb-4 font-serif text-lg text-primary">Set the stage</p>
                    
                    <div className="mb-5">
                      <p className="text-xs text-on-surface-variant mb-2 font-label-caps uppercase tracking-wider">Occasion</p>
                      <div className="flex flex-wrap gap-2">
                        {OCCASIONS.map(occ => (
                          <button 
                            key={occ} 
                            onClick={() => setSelectedOccasion(occ)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs transition-all border", 
                              selectedOccasion === occ ? "bg-primary text-on-primary border-primary shadow-md" : "bg-transparent text-on-surface border-outline-variant/50 hover:border-primary/50"
                            )}
                          >
                            {occ}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs text-on-surface-variant mb-2 font-label-caps uppercase tracking-wider">Style Direction</p>
                      <div className="flex flex-wrap gap-2">
                        {STYLES.map(style => (
                          <button 
                            key={style} 
                            onClick={() => setSelectedStyle(style)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs transition-all border", 
                              selectedStyle === style ? "bg-primary text-on-primary border-primary shadow-md" : "bg-transparent text-on-surface border-outline-variant/50 hover:border-primary/50"
                            )}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full bg-primary text-on-primary font-body-lg text-[14px] font-medium py-3 rounded-lg hover:bg-primary/90 transition-all flex justify-center items-center gap-2 shadow-sm disabled:opacity-70"
                    >
                      <Sparkles className="size-4" /> Discover Look
                    </button>
                 </div>
              )}

              {chatMessages.map((msg) => (
                <div key={msg.id} className={cn("flex flex-col gap-1 max-w-[85%]", msg.role === 'user' ? "self-end items-end" : "self-start")}>
                  <div className={cn(
                    "p-4 rounded-2xl font-body-sm text-[14px] leading-relaxed shadow-sm",
                    msg.role === 'user' ? "bg-primary text-on-primary rounded-tr-none" : "bg-surface text-on-surface rounded-tl-none border border-outline-variant/20"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isChatting && (
                <div className="flex flex-col gap-1 max-w-[85%] self-start animate-pulse">
                  <div className="bg-surface text-on-surface p-4 rounded-2xl rounded-tl-none border border-outline-variant/20 shadow-sm w-16 h-12 flex items-center justify-center gap-1">
                    <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-surface/80 border-t border-outline-variant/20 backdrop-blur-md">
              <div className="relative flex items-center group">
                <input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!outfitData || isChatting}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full pl-5 pr-12 py-3 font-body-sm text-primary placeholder:text-on-surface-variant/50 transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-50" 
                  placeholder={outfitData ? "Ask for adjustments..." : "Generate an outfit first..."} 
                  type="text"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isChatting || !outfitData}
                  className="absolute right-2 text-primary p-2 rounded-full hover:bg-surface-variant transition-colors disabled:opacity-30"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        {outfitData && (
          <div className="mt-8 flex justify-end gap-4 border-t border-outline-variant/20 pt-6">
            <button 
              onClick={() => { setOutfitData(null); setChatMessages([]); setContextID(""); }}
              className="px-8 py-3 rounded-none border border-secondary text-secondary font-body-lg text-[15px] font-medium hover:bg-secondary/5 transition-colors min-h-[48px] flex items-center gap-2 tracking-wide"
            >
              <RefreshCw className="size-4" /> RESET
            </button>
            <button className="px-8 py-3 rounded-none bg-primary text-on-primary font-body-lg text-[15px] font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg min-h-[48px] flex items-center gap-2 tracking-wide uppercase">
              <Save className="size-4" /> Save to Wardrobe
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
