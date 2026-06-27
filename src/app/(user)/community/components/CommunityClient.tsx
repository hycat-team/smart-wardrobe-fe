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
import { mockBrands } from '@/lib/mock-data/b2b';
import Link from 'next/link';

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
    <div className="flex-1 bg-background text-foreground pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-8 flex flex-col gap-8 lg:gap-10">
            
            {/* Mobile Responsive: Brand Stories & Trending Tags (Hidden on Desktop) */}
            <div className="flex flex-col gap-6 lg:hidden mb-4">
              {/* Brand Stories */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-lg tracking-tight text-foreground px-1">Khám phá Brands</h3>
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {mockBrands.map(brand => (
                    <Link key={brand.id} href={`/brands/${brand.id}`} className="flex flex-col items-center gap-2 min-w-[80px] snap-start group">
                      <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-muted-foreground/20 to-muted-foreground/40 group-hover:from-muted-foreground/50 group-hover:to-muted-foreground transition-all">
                        <Avatar className="w-full h-full border-2 border-background">
                          <AvatarImage src={brand.logoUrl} className="object-cover" />
                          <AvatarFallback className="bg-muted text-foreground font-medium text-xs">
                            {brand.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-[11px] font-bold text-center leading-tight w-full px-1 line-clamp-2">{brand.name}</span>
                    </Link>
                  ))}
                  <Link href="/brands" className="flex flex-col items-center justify-center gap-2 min-w-[80px] snap-start group">
                    <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center group-hover:border-foreground/30 transition-all">
                      <span className="text-xl text-muted-foreground">+</span>
                    </div>
                    <span className="text-[11px] font-medium text-center text-muted-foreground pt-1">Xem tất cả</span>
                  </Link>
                </div>
              </div>

              {/* Trending Tags */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-lg tracking-tight text-foreground px-1">Xu hướng</h3>
                <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {['#MONOCHROME', '#UTILITYCHIC', '#QUIETLUXURY', '#OVERSIZEDTAILORING', '#ARCHIVEFASHION'].map(tag => (
                    <span key={tag} className="whitespace-nowrap px-4 py-2 rounded-full border border-border bg-muted text-foreground text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-muted/80 active:bg-muted/60 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

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
              <h3 className="font-bold text-xl tracking-tight text-foreground">Phong cách xu hướng</h3>
              <div className="flex flex-wrap gap-2">
                {['#MONOCHROME', '#UTILITYCHIC', '#QUIETLUXURY', '#OVERSIZEDTAILORING', '#ARCHIVEFASHION'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-muted text-foreground border border-border rounded-full text-[11px] font-bold uppercase tracking-wide cursor-pointer hover:bg-muted/80 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Atelier Voices */}
            {/* <div className="flex flex-col gap-5">
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
            </div> */}

            {/* Upcoming Events */}
            {/* <div className="border border-black/10 p-6 flex flex-col gap-6 mt-4">
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
            </div> */}

          </div>
        </div>
      </div>
    </div>
  );
}
