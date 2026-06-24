'use client';

import React from 'react';
import { CommunityList } from '@/features/community/components/CommunityList';
import { CreatePostModal } from '@/features/community/components/CreatePostModal';
import { useInfiniteCommunity } from '@/features/community/queries/community.queries';
import { PaginationResult } from '@/types/api';
import { PostRes } from '@/features/community/types';
import { Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Roboto_Mono } from 'next/font/google';
import { BrandDiscoverySidebar } from './BrandDiscoverySidebar';
import { BrandPostsFeed } from './BrandPostsFeed';

const robotoMono = Roboto_Mono({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
});

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

  const displayData = data || (initialData ? { pages: [initialData], pageParams: [1] } : undefined);

  return (
    <div className={`flex-1 bg-white text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-white pb-20 ${robotoMono.className}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <CommunityList 
              data={displayData}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage || false}
              isFetchingNextPage={isFetchingNextPage}
              isLoading={isLoading && !initialData}
            />

            {/* B2B Mock Brand Posts injected after API data */}
            <BrandPostsFeed />
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-12 sticky top-10 h-fit">
            
            {/* Brand Discovery (B2B Feature) */}
            <BrandDiscoverySidebar />
            
            {/* Trending Styles */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-xl tracking-tight text-black">Phong cách xu hướng</h3>
              <div className="flex flex-wrap gap-2">
                {['#MONOCHROME', '#UTILITYCHIC', '#QUIETLUXURY', '#OVERSIZEDTAILORING', '#ARCHIVEFASHION'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-[#F5F2EE] text-[#1A1A1A] text-xs font-bold uppercase tracking-wide cursor-pointer hover:bg-[#E5E2DE] transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Atelier Voices */}
            <div className="flex flex-col gap-5">
              <h3 className="font-bold text-xl tracking-tight text-black">Gương mặt nổi bật</h3>
              <div className="flex flex-col gap-5">
                {[
                  { name: "Elena R.", role: "Minimalist Curator", img: "" },
                  { name: "Marcus V.", role: "Street Tailoring", img: "" }
                ].map(voice => (
                  <div key={voice.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer group">
                      <Avatar className="w-10 h-10 ring-1 ring-black/5 group-hover:ring-black/20 transition-all">
                        <AvatarFallback className="bg-[#F5F2EE] text-[#1A1A1A] font-medium text-sm">
                          {voice.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-black group-hover:underline decoration-1 underline-offset-2">{voice.name}</span>
                        <span className="text-xs text-black/60 font-medium">{voice.role}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="h-8 rounded-none border-black/20 text-xs font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors px-4">
                      Theo dõi
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="border border-black/10 p-6 flex flex-col gap-6 mt-4">
              <div className="flex items-center gap-2 text-black">
                <Calendar className="w-5 h-5" />
                <h3 className="font-bold text-lg tracking-tight">Sắp diễn ra</h3>
              </div>
              
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1 cursor-pointer group">
                  <span className="font-bold text-sm text-black group-hover:underline decoration-1 underline-offset-2">Paris Fashion Week SS24 Debrief</span>
                  <span className="text-xs text-black/60 font-medium">Thảo luận trực tiếp • 12 Thg 10</span>
                </div>
                <div className="flex flex-col gap-1 cursor-pointer group">
                  <span className="font-bold text-sm text-black group-hover:underline decoration-1 underline-offset-2">Archive Sale: 90s Minimalism</span>
                  <span className="text-xs text-black/60 font-medium">Quyền truy cập đặc biệt • 15 Thg 10</span>
                </div>
              </div>

              <div className="pt-2">
                <button className="text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors">
                  Xem tất cả sự kiện
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
