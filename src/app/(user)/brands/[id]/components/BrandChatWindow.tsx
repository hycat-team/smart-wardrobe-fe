"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useGetConversation, useSendConversationMessage, useMarkConversationRead } from '@/features/brands/queries/user-brands.queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConversationMessage } from '@/features/brand-portal/types';

export default function BrandChatWindow({ brandId, isOpen, onClose }: { brandId: string, isOpen: boolean, onClose: () => void }) {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversation, isLoading, error } = useGetConversation(brandId);
  const { mutate: sendMessage, isPending: isSending } = useSendConversationMessage();
  const { mutate: markRead } = useMarkConversationRead();

  const isNotMember = error && (error as any)?.response?.status === 400;

  // Mark as read when opened
  useEffect(() => {
    if (isOpen && conversation?.unreadCount && conversation.unreadCount > 0) {
      markRead(brandId);
    }
  }, [isOpen, conversation?.unreadCount, brandId, markRead]);

  // Scroll to bottom when new messages arrive or when opened
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, conversation]); 

  const messages: ConversationMessage[] = (conversation as any)?.messages || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || isSending) return;
    sendMessage({ brandId, message: messageText });
    setMessageText("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-[350px] h-[500px] max-h-[80vh] bg-background border border-border shadow-2xl rounded-2xl flex flex-col z-[100] overflow-hidden animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-foreground text-background">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-bold text-sm uppercase tracking-widest">Hỗ trợ trực tuyến</h3>
        </div>
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-muted/10">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : isNotMember ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 text-muted-foreground gap-2">
            <MessageCircle className="w-8 h-8 opacity-20" />
            <p className="text-sm font-medium">Bạn chưa là thành viên</p>
            <p className="text-xs">Vui lòng nhấn nút "Membership" trên trang nhãn hàng để tham gia và bắt đầu trò chuyện.</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 text-muted-foreground gap-2">
            <MessageCircle className="w-8 h-8 opacity-20" />
            <p className="text-sm font-medium">Bắt đầu trò chuyện với nhãn hàng</p>
            <p className="text-xs">Nhân viên sẽ phản hồi bạn sớm nhất có thể.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.senderType === 'USER';
            return (
              <div key={msg.id || idx} className={`flex flex-col max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${isUser ? 'bg-foreground text-background rounded-tr-sm' : 'bg-muted text-foreground border border-border rounded-tl-sm'}`}>
                  {msg.message}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                  {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 bg-background border-t border-border flex items-center gap-2">
        <Input 
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Nhập tin nhắn..."
          disabled={isNotMember}
          className="flex-1 rounded-full text-sm border-border focus-visible:ring-1 focus-visible:ring-foreground"
        />
        <Button type="submit" size="icon" disabled={!messageText.trim() || isSending || isNotMember} className="rounded-full w-10 h-10 shrink-0">
          {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  );
}
