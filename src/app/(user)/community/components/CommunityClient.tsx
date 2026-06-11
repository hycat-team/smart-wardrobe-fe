'use client';

import React from 'react';
import { Search, MoreHorizontal, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommunityList } from '@/features/community/components/CommunityList';
import { CreatePostModal } from '@/features/community/components/CreatePostModal';
import { useInfiniteCommunity } from '@/features/community/queries/community.queries';
import { PaginationResult } from '@/types/api';
import { PostRes } from '@/features/community/types';

interface CommunityClientProps {
  initialData: PaginationResult<PostRes> | null;
}

export default function CommunityClient({ initialData }: CommunityClientProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteCommunity();

  // If initialData exists, TanStack query usually needs it via hydration,
  // or we can just pass initialData to the query hook. But since we use initialData
  // directly in the hook's placeholderData or similar, we can just render using 
  // the fetched data or fallback to initialData if data is not yet available.
  const displayData = data || (initialData ? { pages: [initialData], pageParams: [1] } : undefined);

  return (
    <div className="flex-1 flex overflow-hidden bg-background">
      {/* Gallery Feed Canvas */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 md:py-12 scroll-smooth">
        <header className="mb-14 pb-8 border-b border-border/40 flex flex-col md:flex-row md:justify-between md:items-end gap-6 max-w-2xl mx-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[1px] bg-[#D9C5B2]"></span>
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#D9C5B2]">
                Ethos Atelier
              </span>
            </div>
            <h1 className="font-display-lg text-4xl md:text-5xl font-light tracking-tighter text-primary mt-1">
              Community<span className="italic font-serif text-[#D9C5B2]">.</span>
            </h1>
            <p className="text-[14px] text-muted-foreground mt-2 max-w-sm leading-relaxed">
              Curated inspiration from conscious creators and sustainable fashion enthusiasts.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Desktop & Mobile Create Post Button */}
            <CreatePostModal />
            
            {/* Mobile trigger for connections */}
            <button className="xl:hidden text-primary flex items-center gap-2 font-label-caps text-label-caps uppercase tracking-widest border-b border-primary/30 pb-1 hover:border-primary transition-colors text-[11px]">
              Connections
            </button>
          </div>
        </header>

        <CommunityList 
          data={displayData}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage || false}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading && !initialData}
        />
        
        {/* Spacer for bottom */}
        <div className="h-24 md:h-12"></div>
      </div>

      {/* Right Sidebar: Instagram Style */}
      <aside className="hidden xl:flex w-[320px] bg-background flex-col h-dvh sticky top-0 pt-10 pl-8 pr-4">
        {/* Current User Profile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 cursor-pointer">
             <Avatar className="w-11 h-11">
               <AvatarImage src="" alt="Gia Huy" />
               <AvatarFallback className="bg-muted text-primary font-medium text-sm">
                 GH
               </AvatarFallback>
             </Avatar>
             <div className="flex flex-col">
               <span className="font-semibold text-[14px] text-foreground">n.gia_huy</span>
               <span className="text-[14px] text-muted-foreground">Gia Huy</span>
             </div>
          </div>
          <button className="text-[12px] font-semibold text-blue-500 hover:text-foreground transition-colors outline-none">
            Chuyển
          </button>
        </div>

        {/* Suggestions Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[14px] font-semibold text-muted-foreground">Gợi ý cho bạn</span>
          <button className="text-[12px] font-semibold text-foreground hover:text-muted-foreground transition-colors outline-none">
            Xem tất cả
          </button>
        </div>
        
        {/* Suggestions List */}
        <div className="flex flex-col gap-3.5">
          {/* Connection 1 */}
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3 cursor-pointer">
               <Avatar className="w-11 h-11">
                 <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVmMYLmeTdGkQOY0Y1hxQOteZosrB5vQW-m71mNsMw9Jty6fFVdRdCex6V1uK3KWXFkGNcMwHAz2lF9nfygavyuu2nw7iFjFZOlJl3x0uq51CKM8HAHVIUEmwy1sX8PCBN6lsHZBd4OOLJ0iQ4YgCBBhJHaKStX_Z4ehYQcOUlcF_K_FF8aBklc1yWjmUYMr-jexKkCY4szEK2-3vtZDVRXGUX2ZahW0KRV1YiUxxqk1KBeEsGEMcrRla4Jgwh8PGs1q00ws743bI" alt="H My" />
               </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-[14px] text-foreground">H My</span>
                <span className="text-[12px] text-muted-foreground">Gợi ý cho bạn</span>
              </div>
            </div>
            <button className="text-[12px] font-semibold text-blue-500 hover:text-foreground transition-colors outline-none">
              Theo dõi
            </button>
          </div>
          
          {/* Connection 2 */}
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3 cursor-pointer">
               <Avatar className="w-11 h-11">
                 <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIAWSsMeFUiNJWAyljmFVeuKXW1T5ZUnmxsd6h1VVxvemL9agvdDl6OJFeZeoxVG4zX3KgLS6o1cttikb-zy2F-N12K3XxYU7S-l6Q-8dKbn7GUm8x_qzWfLuzhmUrQmz_47j74JSsQV6B8HkAOT7RIPteBnScENJw0HRVWON6UnBMXsid3OBeLwD0I0Rc2wjVll_dsK5WQKQsZJwACrYJQox1H3tywQeLeJSlt8nL0I5Z67I6c7SNNokgj_pqiOI79_b_2x6cnZ8" alt="Ngọc Trâm" />
               </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-[14px] text-foreground">Ngọc Trâm</span>
                <span className="text-[12px] text-muted-foreground">Gợi ý cho bạn</span>
              </div>
            </div>
            <button className="text-[12px] font-semibold text-blue-500 hover:text-foreground transition-colors outline-none">
              Theo dõi
            </button>
          </div>

          {/* Connection 3 */}
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3 cursor-pointer">
               <Avatar className="w-11 h-11">
                 <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPS8msxZ3gCfXqvv1UcAsSQ01zPeqw203bdFXZaS59SWnkv8thgvZZkdTnuRwESJJzY9c2zA7C98kVHgU_X2dn048nBm5IGCmPjvjENF39QK1U7Fxy_9_-SEDl5pafTXkO5jeDZgP-gmWVv-NlnsKx3Pe0YKpQRNHDcJORvt1zN4CJ2Kb4tJjJ56MoyXYd2hKObLAFZ2xnax8yBVmj39Ek4PB_7o7Dy3H8-xNXl4jWAKiZUgjAs53kr1m1Nqx9KNrBSD7-ig9x-Xk" alt="Thu Hà" />
               </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-[14px] text-foreground">Thu Hà</span>
                <span className="text-[12px] text-muted-foreground">Gợi ý cho bạn</span>
              </div>
            </div>
            <button className="text-[12px] font-semibold text-blue-500 hover:text-foreground transition-colors outline-none">
              Theo dõi
            </button>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-10 flex flex-col gap-4">
          <div className="flex flex-wrap gap-x-1.5 gap-y-1 text-[12px] text-muted-foreground/80 max-w-[280px]">
            <a href="#" className="hover:underline">Giới thiệu</a>
            <span>•</span>
            <a href="#" className="hover:underline">Trợ giúp</a>
            <span>•</span>
            <a href="#" className="hover:underline">Báo chí</a>
            <span>•</span>
            <a href="#" className="hover:underline">API</a>
            <span>•</span>
            <a href="#" className="hover:underline">Việc làm</a>
            <span>•</span>
            <a href="#" className="hover:underline">Quyền riêng tư</a>
            <span>•</span>
            <a href="#" className="hover:underline">Điều khoản</a>
            <span>•</span>
            <a href="#" className="hover:underline">Vị trí</a>
            <span>•</span>
            <a href="#" className="hover:underline">Ngôn ngữ</a>
            <span>•</span>
            <a href="#" className="hover:underline">Meta đã xác minh</a>
          </div>
          <span className="text-[12px] text-muted-foreground/80 uppercase">© 2026 SMART WARDROBE FROM CLOSY</span>
        </div>
      </aside>
    </div>
  );
}
