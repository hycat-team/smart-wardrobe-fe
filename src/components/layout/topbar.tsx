"use client";

import Link from "next/link";
import { Sparkles, UserCircle } from "lucide-react";
import { cn, getUserAvatar } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";

export function Topbar() {
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.isPremium;

  return (
    <>
      {/* Mobile Topbar */}
      <header className="md:hidden h-16 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background/80 backdrop-blur-md z-40">
        <Link href="/" className={cn("text-xl font-heading font-bold text-ink", isPremium && "tracking-[2px]")}>
          {isPremium ? "S W" : "SW"}
        </Link>
        <div className="flex items-center gap-3">
          {!isPremium && (
            <div className="px-3 py-1 bg-secondary rounded-full text-xs font-medium flex items-center gap-1 text-ink border border-border/50">
              <Sparkles className="size-3 text-primary" /> 2/3 AI
            </div>
          )}
          <Link href="/settings">
            <Avatar className="size-8 cursor-pointer">
              <AvatarImage src={getUserAvatar(user)} alt={user?.username} className="object-cover" />
              <AvatarFallback>{user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      {/* Desktop Topbar */}
      <div className="hidden md:flex h-16 border-b border-border items-center justify-between px-8 sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <div className="flex-1 flex items-center max-w-md relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="size-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            className={cn(
              "w-full text-sm border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-full pl-10 pr-4 py-2 transition-all outline-none",
              isPremium ? "bg-muted" : "bg-secondary"
            )}
            placeholder="Tìm kiếm outfit, tags..."
          />
        </div>
        
        <div className="flex items-center gap-4">
            {!isPremium && (
              <div className="px-3 py-1.5 bg-secondary rounded-full text-xs font-medium flex items-center gap-1.5 text-ink shadow-sm border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                <Sparkles className="size-3.5 text-primary fill-primary/20" /> 
                <span>2/3 AI Quota</span>
              </div>
            )}
        </div>
      </div>
    </>
  );
}
