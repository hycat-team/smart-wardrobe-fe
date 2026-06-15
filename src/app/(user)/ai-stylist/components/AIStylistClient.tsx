"use client";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import Image from "next/image";
import { Sparkles, Save, RefreshCw, MoveRight, ZoomOut, ZoomIn, MoveUp, RefreshCcw, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { aiApi } from "@/features/ai-stylist/api/ai.api";
import { AIOutfitRecommendationRes, ChatMessage } from "@/features/ai-stylist/types";
import { useOutfitCanvas } from "@/features/outfits/hooks/useOutfitCanvas";
import { OutfitCanvasBoard } from "@/features/outfits/components/OutfitCanvasBoard";
import { motion } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { wardrobeApi } from "@/features/wardrobe/api/wardrobe.api";
import { useCreateOutfit } from "@/features/outfits/queries/outfits.queries";
import { toast } from "sonner";

gsap.registerPlugin(useGSAP);

const OCCASIONS = ["🎓 Đi học", "💼 Đi làm", "🌙 Hẹn hò", "🎉 Tiệc", "🏃 Thể thao", "🏠 Ở nhà"];
const STYLES = ["Minimalist", "Casual", "Formal", "Trendy", "Vintage", "Streetwear"];

export function AIStylistClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [selectedOccasion, setSelectedOccasion] = useState(OCCASIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [outfitData, setOutfitData] = useState<AIOutfitRecommendationRes | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [contextID, setContextID] = useState<string>("");
  const [chatInput, setChatInput] = useState("");

  const [alternativeIndices, setAlternativeIndices] = useState<Record<string, number>>({});

  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    selectedItems,
    setSelectedItems,
    bringToFront,
    updateScale,
    handleDragEnd,
  } = useOutfitCanvas();

  const createOutfitMutation = useCreateOutfit();

  useEffect(() => {
    if (chatMessages.length > 0 || isChatting) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chatMessages, isChatting]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const animateChatIntro = contextSafe(() => {
    gsap.fromTo(
      ".chat-intro",
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.8, delay: 0.3, ease: "power3.out" }
    );
  });

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      
      const occasionMap: Record<string, string> = {
        "🎓 Đi học": "casual",
        "💼 Đi làm": "formal",
        "🌙 Hẹn hò": "casual",
        "🎉 Tiệc": "party",
        "🏃 Thể thao": "sport",
        "🏠 Ở nhà": "casual",
      };

      const res = await aiApi.getOutfitRecommendation({
        colorTone: "light",
        details: "string",
        occasion: occasionMap[selectedOccasion] || "casual",
        season: "spring",
        styleTarget: selectedStyle.toLowerCase(),
        weather: "warm",
      });

      setOutfitData(res);
      setAlternativeIndices({});
      
      // Setup canvas items
      if (res.items && res.items.length > 0) {
        const initialSelected = res.items.map((item, idx) => ({
          ...item.primary,
          scale: 100,
          x: (idx % 2 === 0 ? -1 : 1) * 30, // slight offset to prevent full overlap
          y: idx * 80 - 100,
          zIndex: idx + 1,
          _role: item.role
        }));
        setSelectedItems(initialSelected);
      } else {
        setSelectedItems([]);
      }

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
        animateChatIntro();
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

  const handleSwap = (role: string) => {
    const outfitItem = outfitData?.items.find(i => i.role === role);
    if (!outfitItem || !outfitItem.alternatives || outfitItem.alternatives.length === 0) return;
    
    const currentIndex = alternativeIndices[role] ?? -1;
    const totalOptions = outfitItem.alternatives.length + 1;
    const nextIndex = ((currentIndex + 2) % totalOptions) - 1;
    
    setAlternativeIndices(prev => ({...prev, [role]: nextIndex}));
    
    const newItem = nextIndex === -1 ? outfitItem.primary : outfitItem.alternatives[nextIndex];
    
    setSelectedItems(prev => prev.map(item => {
      if (item._role === role) {
        return {
          ...newItem,
          scale: item.scale,
          x: item.x,
          y: item.y,
          zIndex: item.zIndex,
          _role: role
        };
      }
      return item;
    }));
  };

  const handleSaveOutfit = async () => {
    if (selectedItems.length < 2) {
      toast.error("Vui lòng chọn tối thiểu 2 món đồ trên canvas.");
      return;
    }
    if (!outfitData?.title) return;

    if (!canvasRef.current) return;

    try {
      setIsSaving(true);
      toast.loading("Đang lưu phối đồ...", { id: "saving_outfit" });

      const controls = document.querySelectorAll(".canvas-item-controls");
      controls.forEach((el) => ((el as HTMLElement).style.opacity = "0"));

      await new Promise(resolve => setTimeout(resolve, 100));

      const blob = await htmlToImage.toBlob(canvasRef.current, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: "transparent",
        cacheBust: true,
      });

      controls.forEach((el) => ((el as HTMLElement).style.opacity = "1"));

      if (!blob) throw new Error("Không thể tạo ảnh từ Canvas");

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

      const payload = {
        name: outfitData.title,
        description: `AI Stylist: ${selectedOccasion} - ${selectedStyle}`,
        coverImageUrl: coverImageUrl,
        items: selectedItems.map((item) => ({
          wardrobeItemId: item.id,
          positionX: Math.max(1, Math.abs(item.x || 0)),
          positionY: Math.max(1, Math.abs(item.y || 0)),
          scale: (item.scale || 100) / 100,
          layerOrder: item.zIndex || 1,
        })),
      };

      await createOutfitMutation.mutateAsync(payload);
      toast.success("Lưu bộ phối đồ thành công!", { id: "saving_outfit" });
      
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Đã xảy ra lỗi khi lưu.", { id: "saving_outfit" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div ref={containerRef} className="flex-1 min-h-screen bg-white text-[#1A1A1A] pb-24 md:pb-12 font-sans selection:bg-[#1A1A1A] selection:text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col pt-8 lg:pt-12">
        
        {/* Page Header */}
        <div className="mb-8 md:mb-10 border-b border-[#E5E5E5] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] mb-2 uppercase">
              {outfitData?.title || "ATELIER STYLIST"}
            </h2>
            <p className="text-xs md:text-sm text-[#666666] tracking-wide uppercase font-medium">
              {outfitData ? "A CURATED SELECTION DESIGNED FOR YOUR SPECIFIC MOMENTS" : "CONFIGURE YOUR PREFERENCES TO DISCOVER TODAY'S CURATION"}
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 flex-1 items-start">
          
          {/* Left Column: Canvas (Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-8 relative min-h-[600px] h-[600px] lg:h-[800px] border border-[#E5E5E5] bg-[#F9F9F9]">
            {outfitData ? (
              <>
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] bg-white border border-[#E5E5E5] px-3 py-1.5 flex items-center gap-2">
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
                    return outfitItem && outfitItem.alternatives && outfitItem.alternatives.length > 0;
                  }}
                  emptyState={
                    <div className="text-center p-12">
                      <p className="text-[#666666] text-sm uppercase tracking-widest">NO ITEMS SELECTED.</p>
                    </div>
                  }
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-8 overflow-hidden">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center gap-6">
                    <div className="w-12 h-12 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#1A1A1A] font-bold text-sm uppercase tracking-widest">CURATING YOUR STYLE...</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center max-w-md">
                    <Sparkles className="w-8 h-8 text-[#A3A3A3] mb-6" strokeWidth={1} />
                    <h3 className="text-2xl font-bold text-[#1A1A1A] uppercase tracking-tight mb-4">THE BLANK CANVAS</h3>
                    <p className="text-[#666666] text-[13px] leading-relaxed">
                      Please configure your occasion and style preferences on the right panel to generate a bespoke outfit curation.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Action Footer */}
            {outfitData && (
              <div className="absolute bottom-0 left-0 right-0 flex flex-col sm:flex-row justify-between items-center border-t border-[#E5E5E5] bg-white z-20">
                <button 
                  onClick={() => { setOutfitData(null); setSelectedItems([]); setChatMessages([]); setContextID(""); }}
                  className="w-full sm:w-1/2 px-6 py-4 border-r border-[#E5E5E5] text-[#1A1A1A] font-bold text-[11px] uppercase tracking-widest hover:bg-[#F9F9F9] transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> RE-GENERATE
                </button>
                <button 
                  onClick={handleSaveOutfit}
                  disabled={isSaving}
                  className="w-full sm:w-1/2 px-8 py-4 bg-[#1A1A1A] text-white font-bold text-[11px] uppercase tracking-widest hover:bg-black/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" /> {isSaving ? "SAVING..." : "SAVE TO WARDROBE"}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: AI Chat Interface & Form (Span 4) */}
          <div className="lg:col-span-4 h-[600px] lg:h-[800px] border border-[#E5E5E5] bg-white flex flex-col relative shadow-sm">
            
            {/* Chat Header */}
            <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between bg-[#F9F9F9]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[13px] text-[#1A1A1A] uppercase tracking-widest">ETHOS AI</h3>
                  <p className="text-[10px] text-[#888888] font-bold uppercase tracking-widest">STYLIST ASSISTANT</p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-6 flex flex-col bg-white">
              
              {!outfitData && !isGenerating && (
                 <div className="flex flex-col gap-8">
                    <div className="border-b border-[#E5E5E5] pb-4">
                      <p className="text-xl font-bold text-[#1A1A1A] tracking-tight uppercase">PARAMETERS</p>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <p className="text-[10px] text-[#888888] font-bold uppercase tracking-widest">OCCASION</p>
                      <div className="flex flex-wrap gap-2">
                        {OCCASIONS.map(occ => (
                          <button 
                            key={occ} 
                            onClick={() => setSelectedOccasion(occ)}
                            className={cn(
                              "px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors border", 
                              selectedOccasion === occ ? "bg-black text-white border-black" : "bg-transparent text-[#1A1A1A] border-[#E5E5E5] hover:border-black"
                            )}
                          >
                            {occ}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <p className="text-[10px] text-[#888888] font-bold uppercase tracking-widest">STYLE DIRECTION</p>
                      <div className="flex flex-wrap gap-2">
                        {STYLES.map(style => (
                          <button 
                            key={style} 
                            onClick={() => setSelectedStyle(style)}
                            className={cn(
                              "px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors border", 
                              selectedStyle === style ? "bg-black text-white border-black" : "bg-transparent text-[#1A1A1A] border-[#E5E5E5] hover:border-black"
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
                      className="mt-6 w-full bg-[#1A1A1A] text-white text-[11px] font-bold py-4 hover:bg-black/80 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 tracking-widest uppercase"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> GENERATE LOOKBOOK
                    </button>
                 </div>
              )}

              {/* Chat Messages */}
              {chatMessages.map((msg) => (
                <div key={msg.id} className={cn("chat-intro flex flex-col gap-1.5 w-full", msg.role === 'user' ? "items-end" : "items-start")}>
                  {msg.role === 'ai' && <span className="text-[9px] font-bold uppercase tracking-widest text-[#A3A3A3]">ETHOS AI</span>}
                  {msg.role === 'user' && <span className="text-[9px] font-bold uppercase tracking-widest text-[#A3A3A3]">YOU</span>}
                  
                  <div className={cn(
                    "p-4 text-[13px] leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-[#1A1A1A] text-white ml-6 md:ml-12" 
                      : "bg-[#F9F9F9] text-[#1A1A1A] border border-[#E5E5E5] mr-6 md:mr-12"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isChatting && (
                <div className="flex flex-col gap-1.5 items-start w-full">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#A3A3A3]">ETHOS AI</span>
                  <div className="bg-[#F9F9F9] text-[#1A1A1A] border border-[#E5E5E5] p-4 mr-12 flex items-center justify-center gap-1.5 min-w-[60px] h-[52px]">
                    <div className="w-1.5 h-1.5 bg-[#A3A3A3] animate-pulse" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-[#A3A3A3] animate-pulse" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-[#A3A3A3] animate-pulse" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-[#F9F9F9] border-t border-[#E5E5E5]">
              <div className="relative flex items-center bg-white border border-[#E5E5E5] focus-within:border-[#1A1A1A] transition-colors">
                <input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!outfitData || isChatting}
                  className="w-full bg-transparent border-none outline-none pl-4 pr-12 py-3.5 text-[13px] text-[#1A1A1A] placeholder:text-[#A3A3A3] disabled:opacity-50 font-medium" 
                  placeholder={outfitData ? "Type a message..." : "Generate an outfit first..."} 
                  type="text"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isChatting || !outfitData}
                  className="absolute right-2 text-[#A3A3A3] hover:text-[#1A1A1A] p-2 transition-colors disabled:opacity-30 outline-none"
                >
                  <MoveRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
