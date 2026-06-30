"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useGetConversations, useGetConversationMessages, useSendConversationMessage } from '@/features/brand-portal/queries/brand-portal.queries';
import { Send, Loader2, MessageSquare, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ChatInboxClient() {
  const params = useParams();
  const brandId = params.brandId as string;

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: isLoadingConvs } = useGetConversations(brandId);
  const { data: messages, isLoading: isLoadingMessages } = useGetConversationMessages(brandId, activeConversationId);
  const { mutateAsync: sendMessage, isPending: isSending } = useSendConversationMessage(brandId, activeConversationId || '');

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversationId || isSending) return;

    try {
      await sendMessage(messageInput);
      setMessageInput('');
    } catch (error) {
      console.error(error);
    }
  };

  const activeConvDetails = conversations?.find(c => c.id === activeConversationId);

  return (
    <div className="w-full flex h-[calc(100vh-8rem)] bg-background overflow-hidden border-t border-border">
      {/* Sidebar - Conversations */}
      <div className="w-1/3 min-w-[300px] border-r border-border bg-card flex flex-col h-full">
        <div className="p-4 border-b border-border bg-muted/20 shrink-0">
          <h2 className="font-bold text-lg tracking-tight">Hội thoại</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoadingConvs ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : !conversations || conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-sm text-center px-4">
              <MessageSquare className="w-8 h-8 opacity-20 mb-2" />
              Chưa có hội thoại nào
            </div>
          ) : (
            conversations.map((conv) => (
              <div 
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`flex items-start gap-3 p-4 border-b border-border cursor-pointer transition-colors ${
                  activeConversationId === conv.id ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
                  <User className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm truncate">{conv.customerName || conv.userDisplayName || 'Khách hàng'}</h3>
                    {conv.staffUnreadCount > 0 ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                        {conv.staffUnreadCount}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString('vi-VN') : 'Chưa có tin nhắn'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background h-full min-w-0">
        {!activeConversationId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <MessageSquare className="w-16 h-16 opacity-10 mb-4" />
            <p>Chọn một cuộc hội thoại để bắt đầu</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-border bg-card flex items-center px-6 shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
                  <User className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <div>
                  <h2 className="font-bold text-sm">{activeConvDetails?.customerName || activeConvDetails?.userDisplayName || 'Khách hàng'}</h2>
                  <p className="text-xs text-muted-foreground">ID: {activeConvDetails?.userId}</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {isLoadingMessages ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : messages?.map((msg) => {
                const isBrand = msg.senderRole === 'staff';
                return (
                  <div key={msg.id} className={`flex flex-col max-w-[75%] ${isBrand ? 'self-end items-end' : 'self-start items-start'}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      isBrand 
                        ? 'bg-primary text-primary-foreground rounded-br-sm' 
                        : 'bg-muted text-foreground border border-border rounded-bl-sm'
                    }`}>
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                      {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-card shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                  className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:bg-background"
                  placeholder="Nhập tin nhắn..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="rounded-full shrink-0" 
                  disabled={!messageInput.trim() || isSending}
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
