"use client";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import Image from "next/image";
import { Sparkles, Save, RefreshCw, MoveRight, Layers, History, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { aiApi } from "@/features/ai-stylist/api/ai.api";
import { AIOutfitRecommendationRes, ChatMessage, ChatSessionRes } from "@/features/ai-stylist/types";
import { useChatSessions } from "@/features/ai-stylist/queries/ai.queries";
import { useOutfitCanvas } from "@/features/outfits/hooks/useOutfitCanvas";
import { OutfitCanvasBoard } from "@/features/outfits/components/OutfitCanvasBoard";
import { motion } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { wardrobeApi } from "@/features/wardrobe/api/wardrobe.api";
import { useCreateOutfit } from "@/features/outfits/queries/outfits.queries";
import { toast } from "sonner";

gsap.registerPlugin(useGSAP);

import { AIChatMessage } from "@/features/ai-stylist/components/AIChatMessage";
import { AIQuickOptions, OCCASIONS, STYLES, SEASONS, WEATHERS, COLOR_TONES, occasionMap } from "@/features/ai-stylist/components/AIQuickOptions";
import { AIChatHistorySidebar } from "@/features/ai-stylist/components/AIChatHistorySidebar";

export function AIStylistClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [selectedOccasion, setSelectedOccasion] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [selectedWeather, setSelectedWeather] = useState<string>("");
  const [selectedColorTone, setSelectedColorTone] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { data: chatSessionsData, isLoading: isLoadingSessions } = useChatSessions();

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

  const handleSelectSession = async (session: ChatSessionRes) => {
    setIsHistoryOpen(false);
    setContextID(session.id);
    setOutfitData(null); // Clear canvas to focus on chat
    setSelectedItems([]);
    setAlternativeIndices({});
    setChatMessages([]);
    
    try {
      toast.loading("Đang tải lịch sử...", { id: "load_history" });
      const res = await aiApi.getChatMessages(session.id, { limit: 100 });
      // Javascript Date().getTime() có thể bỏ qua microsecond.
      // Dùng localeCompare để so sánh chuỗi ISO gốc chính xác đến microsecond.
      // Nếu 2 tin nhắn có createdAt Y HỆT NHAU (do lưu cùng lúc vào DB), dùng originalIndex để gỡ hòa.
      // Backend mặc định trả về tin nhắn mới nhất trước (DESC), nên index lớn hơn là tin nhắn cũ hơn.
      const formattedMessages: ChatMessage[] = res.items.map((msg, index) => ({
        id: msg.id,
        role: (msg.sender.toLowerCase() === 'user' ? 'user' : 'ai') as 'user' | 'ai',
        content: msg.content,
        timestamp: new Date(msg.createdAt).getTime(),
        _rawTime: msg.createdAt,
        _originalIndex: index
      })).sort((a, b) => {
        const timeDiff = a._rawTime.localeCompare(b._rawTime);
        if (timeDiff !== 0) return timeDiff;
        return b._originalIndex - a._originalIndex;
      });
      
      setChatMessages(formattedMessages);
      toast.success("Đã tải lịch sử trò chuyện", { id: "load_history" });
    } catch (error: any) {
      console.error(error);
      toast.error("Không thể tải lịch sử", { id: "load_history" });
    }
  };

  const handleNewChat = () => {
    setContextID("");
    setOutfitData(null);
    setSelectedItems([]);
    setAlternativeIndices({});
    setChatMessages([]);
    setChatInput("");
    setIsHistoryOpen(false);
  };

  const handleGenerate = async (initialDetails?: string) => {
    try {
      setIsGenerating(true);

      const res = await aiApi.getOutfitRecommendation({
        colorTone: selectedColorTone ? selectedColorTone.toLowerCase() : "",
        details: initialDetails || "",
        occasion: occasionMap[selectedOccasion] || "",
        season: selectedSeason ? selectedSeason.toLowerCase() : "",
        styleTarget: selectedStyle ? selectedStyle.toLowerCase() : "",
        weather: selectedWeather ? selectedWeather.toLowerCase() : "",
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

      if (contextID) {
        setChatMessages(prev => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'ai',
            content: res.explanation,
            timestamp: Date.now(),
          }
        ]);
      } else {
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

  const hasSelectedOptions = !!(selectedOccasion || selectedStyle || selectedSeason || selectedWeather || selectedColorTone);

  const handleQuickGenerate = async () => {
    let finalInput = chatInput.trim();
    if (!finalInput && hasSelectedOptions) {
      const opts = [selectedOccasion, selectedStyle, selectedSeason, selectedWeather, selectedColorTone].filter(Boolean);
      finalInput = `Yêu cầu phối đồ: ${opts.join(', ')}`;
    }

    if (!finalInput) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: finalInput,
      timestamp: Date.now()
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    const inputForBackend = chatInput.trim();
    setChatInput("");
    setPopoverOpen(false);

    await handleGenerate(inputForBackend);
  };

  const handleSendMessage = async () => {
    if (isChatting) return;

    let finalInput = chatInput.trim();
    if (!finalInput && hasSelectedOptions) {
      const opts = [selectedOccasion, selectedStyle, selectedSeason, selectedWeather, selectedColorTone].filter(Boolean);
      finalInput = `Yêu cầu phối đồ: ${opts.join(', ')}`;
    }

    if (!finalInput) return;

    if (!outfitData && !contextID) {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: finalInput,
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, userMsg]);
      const inputForBackend = chatInput.trim();
      setChatInput("");
      setPopoverOpen(false);

      await handleGenerate(inputForBackend);
      return;
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: finalInput,
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

    setAlternativeIndices(prev => ({ ...prev, [role]: nextIndex }));

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

      // Reset state to initial
      setOutfitData(null);
      setSelectedItems([]);
      setChatMessages([]);
      setContextID("");
      setSelectedOccasion("");
      setSelectedStyle("");
      setSelectedSeason("");
      setSelectedWeather("");
      setSelectedColorTone("");
      setChatInput("");
      setAlternativeIndices({});

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
          {/* <div>
            
            <h1 className="text-5xl md:text-6xl lg:text-[60px] font-medium font-medium tracking-tighter text-ink leading-[0.85] uppercase">
              AI STYLIST
            </h1>
            <p className="text-xs md:text-sm text-[#666666] tracking-wide uppercase font-medium">
              {outfitData ? "BỘ SƯU TẬP ĐƯỢC CHỌN LỌC CHO NHỮNG KHOẢNH KHẮC CỦA BẠN" : "CẤU HÌNH SỞ THÍCH CỦA BẠN ĐỂ KHÁM PHÁ BỘ PHỐI ĐỒ HÔM NAY"}
            </p>
          </div> */}

          <div className="space-y-4 max-w-2xl">
            {/* <h1 className="text-5xl md:text-6xl lg:text-[100px] font-heading font-medium tracking-tighter text-ink leading-[0.85] uppercase">
              Wardrobe
            </h1> */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-medium text-[#111] leading-[1.1] uppercase">
              AI STYLIST
            </h1>
            <p className="text-sm text-ink-muted font-mono uppercase tracking-[0.1em] max-w-md leading-relaxed border-l border-ink/20 pl-4">
              CẤU HÌNH SỞ THÍCH CỦA BẠN ĐỂ KHÁM PHÁ <br /> BỘ PHỐI ĐỒ HÔM NAY
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
                    return !!(outfitItem && outfitItem.alternatives && outfitItem.alternatives.length > 0);
                  }}
                  emptyState={
                    <div className="text-center p-12">
                      <p className="text-[#666666] text-sm uppercase tracking-widest">CHƯA CHỌN MÓN ĐỒ NÀO.</p>
                    </div>
                  }
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-8 overflow-hidden">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center gap-6">
                    <div className="w-12 h-12 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#1A1A1A] font-bold text-sm uppercase tracking-widest">ĐANG TẠO PHONG CÁCH CỦA BẠN...</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center max-w-md">
                    <Sparkles className="w-8 h-8 text-[#A3A3A3] mb-6" strokeWidth={1} />
                    <h3 className="text-2xl font-bold text-[#1A1A1A] uppercase tracking-tight mb-4">THE BLANK CANVAS</h3>
                    <p className="text-[#666666] text-[13px] leading-relaxed">
                      Vui lòng thiết lập thông số dịp và phong cách ở khung bên phải để hệ thống gợi ý một bộ phối đồ dành riêng cho bạn.
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
                  <RefreshCw className="w-3.5 h-3.5" /> TẠO LẠI
                </button>
                <button
                  onClick={handleSaveOutfit}
                  disabled={isSaving}
                  className="w-full sm:w-1/2 px-8 py-4 bg-[#1A1A1A] text-white font-bold text-[11px] uppercase tracking-widest hover:bg-black/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" /> {isSaving ? "ĐANG LƯU..." : "LƯU VÀO TỦ ĐỒ"}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: AI Chat Interface & Form (Span 4) */}
          <div className="lg:col-span-4 h-[600px] lg:h-[800px] border border-[#E5E5E5] bg-white flex flex-col relative shadow-sm overflow-hidden">

            {/* Chat Header */}
            <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between bg-[#F9F9F9] z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[13px] text-[#1A1A1A] uppercase tracking-widest">CLOSY AI</h3>
                  <p className="text-[10px] text-[#888888] font-bold uppercase tracking-widest">TRỢ LÝ PHỐI ĐỒ</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleNewChat}
                  className="text-[#1A1A1A] bg-white border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors py-1.5 px-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                  title="Tạo phiên chat mới"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tạo mới</span>
                </button>
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-[#1A1A1A] bg-white border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors py-1.5 px-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                  title="Lịch sử trò chuyện"
                >
                  <History className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lịch sử</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-6 flex flex-col bg-white">

              {!outfitData && chatMessages.length === 0 && (
                <div className="flex flex-col gap-1.5 items-start w-full chat-intro">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#A3A3A3]">CLOSY AI</span>
                  <div className="bg-[#F9F9F9] text-[#1A1A1A] border border-[#E5E5E5] p-4 mr-6 md:mr-12 text-[13px] leading-relaxed">
                    Xin chào, tôi là CLOSY AI Stylist. Bạn muốn phối đồ cho dịp gì hôm nay?
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {chatMessages.map((msg) => (
                <AIChatMessage
                  key={msg.id}
                  msg={msg}
                  isChatting={isChatting}
                  isGenerating={isGenerating}
                  onGenerateRedirect={handleGenerate}
                  fullChatContext={chatMessages.filter(m => m.role === 'user').map(m => m.content).join('. ')}
                />
              ))}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-[#F9F9F9] border-t border-[#E5E5E5]">
              <div className="relative flex items-center bg-white border border-[#E5E5E5] focus-within:border-[#1A1A1A] transition-colors">
                <AIQuickOptions
                  popoverOpen={popoverOpen}
                  setPopoverOpen={setPopoverOpen}
                  selectedOccasion={selectedOccasion}
                  setSelectedOccasion={setSelectedOccasion}
                  selectedStyle={selectedStyle}
                  setSelectedStyle={setSelectedStyle}
                  selectedSeason={selectedSeason}
                  setSelectedSeason={setSelectedSeason}
                  selectedWeather={selectedWeather}
                  setSelectedWeather={setSelectedWeather}
                  selectedColorTone={selectedColorTone}
                  setSelectedColorTone={setSelectedColorTone}
                  handleSendMessage={handleQuickGenerate}
                  isGenerating={isGenerating}
                  hasSelectedOptions={hasSelectedOptions}
                  chatInput={chatInput}
                />

                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isChatting}
                  className="w-full bg-transparent border-none outline-none pl-2 pr-12 py-3.5 text-[13px] text-[#1A1A1A] placeholder:text-[#A3A3A3] disabled:opacity-50 font-medium"
                  placeholder="Nhập yêu cầu phối đồ của bạn..."
                  type="text"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isChatting || (!chatInput.trim() && !(!outfitData && hasSelectedOptions))}
                  className="absolute right-2 text-[#A3A3A3] hover:text-[#1A1A1A] p-2 transition-colors disabled:opacity-30 outline-none"
                >
                  <MoveRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat History Panel */}
            <AIChatHistorySidebar
              isHistoryOpen={isHistoryOpen}
              setIsHistoryOpen={setIsHistoryOpen}
              isLoadingSessions={isLoadingSessions}
              chatSessionsData={chatSessionsData}
              handleNewChat={handleNewChat}
              handleSelectSession={handleSelectSession}
              contextID={contextID}
            />

          </div>
        </div>
      </div>
    </div >
  );
}
