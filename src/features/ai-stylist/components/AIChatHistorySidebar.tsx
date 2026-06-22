import { cn } from "@/lib/utils";
import { X, Plus, MessageSquare, MoveRight } from "lucide-react";
import { ChatSessionRes } from "@/features/ai-stylist/types";

interface AIChatHistorySidebarProps {
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
  isLoadingSessions: boolean;
  chatSessionsData: ChatSessionRes[] | undefined;
  handleNewChat: () => void;
  handleSelectSession: (session: ChatSessionRes) => void;
  contextID: string;
}

export function AIChatHistorySidebar({
  isHistoryOpen,
  setIsHistoryOpen,
  isLoadingSessions,
  chatSessionsData,
  handleNewChat,
  handleSelectSession,
  contextID
}: AIChatHistorySidebarProps) {
  return (
    <div className={cn(
      "absolute inset-0 bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out",
      isHistoryOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between bg-[#F9F9F9]">
        <div>
          <h3 className="font-bold text-[13px] text-[#1A1A1A] uppercase tracking-widest">LỊCH SỬ</h3>
          <p className="text-[10px] text-[#888888] font-bold uppercase tracking-widest">CÁC PHIÊN TRÒ CHUYỆN</p>
        </div>
        <button 
          onClick={() => setIsHistoryOpen(false)}
          className="text-[#A3A3A3] hover:text-[#1A1A1A] transition-colors p-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
        <button
          onClick={handleNewChat}
          className="w-full text-left p-4 border-2 border-dashed border-[#E5E5E5] hover:border-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors group relative overflow-hidden bg-white mb-4"
        >
          <div className="flex items-center justify-center gap-2">
            <Plus className="w-4 h-4 text-[#1A1A1A]" />
            <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest">
              TẠO PHIÊN CHAT MỚI
            </span>
          </div>
        </button>
        
        {isLoadingSessions ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !chatSessionsData || chatSessionsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
            <MessageSquare className="w-8 h-8 mb-4 text-[#A3A3A3]" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A]">CHƯA CÓ LỊCH SỬ</p>
          </div>
        ) : (
          chatSessionsData.map((session) => (
            <button
              key={session.id}
              onClick={() => handleSelectSession(session)}
              className={cn(
                "w-full text-left p-4 border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors group relative overflow-hidden bg-[#F9F9F9] hover:bg-white",
                contextID === session.id && "border-[#1A1A1A] bg-white ring-1 ring-[#1A1A1A]"
              )}
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider truncate pr-4">
                  {session.title || "PHIÊN TRÒ CHUYỆN MỚI"}
                </span>
                <span className="text-[9px] font-bold text-[#888888] uppercase tracking-widest">
                  {new Date(session.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <MoveRight className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#1A1A1A]" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
