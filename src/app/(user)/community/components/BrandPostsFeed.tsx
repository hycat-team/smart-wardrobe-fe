import React from 'react';
import { mockBrandPosts, mockBrands } from '@/lib/mock-data/b2b';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import Link from 'next/link';

export function BrandPostsFeed() {
  // Sort posts by date descending
  const sortedPosts = [...mockBrandPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col gap-12 mb-10">
      <div className="flex items-center gap-4 mb-2">
        <h3 className="font-semibold text-2xl font-medium text-[#111]">Local Brand Updates</h3>
        <div className="h-px bg-black/10 flex-1"></div>
      </div>

      {sortedPosts.map(post => {
        const brand = mockBrands.find(b => b.id === post.brandId);
        if (!brand) return null;

        return (
          <div key={post.id} className="bg-white border border-black/5 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow group">
            <div className="p-5 flex items-center justify-between border-b border-black/5 bg-[#FAFAFA]/50">
              <Link href={`/brands/${brand.id}`} className="flex items-center gap-4">
                <Avatar className="w-12 h-12 ring-2 ring-white shadow-sm rounded-full bg-white">
                  <AvatarImage src={brand.logoUrl} className="object-cover" />
                  <AvatarFallback className="bg-[#111] text-white text-sm font-semibold">{brand.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[#111] font-semibold leading-tight hover:underline">{brand.name}</span>
                  <span className="text-[10px] font-medium text-[#A3A3A3] uppercase tracking-widest mt-0.5">{post.type}</span>
                </div>
              </Link>
              <div className="text-[10px] text-[#A3A3A3] uppercase tracking-widest font-semibold">
                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>

            <div className="relative aspect-[4/5] bg-[#F5F2EE] w-full overflow-hidden">
              <img
                src={post.mediaUrls[0]}
                alt="Brand Post"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              {post.taggedProductIds.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 flex items-center gap-2 shadow-sm rounded-full cursor-pointer hover:bg-white transition-colors">
                  <div className="w-1.5 h-1.5 bg-[#111] rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#111] font-semibold">Shoppable Look</span>
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col gap-5 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button className="text-[#111] hover:text-[#A3A3A3] hover:scale-110 transition-all">
                    <Heart className="w-6 h-6" strokeWidth={1.5} />
                  </button>
                  <button className="text-[#111] hover:text-[#A3A3A3] hover:scale-110 transition-all">
                    <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
                  </button>
                  <button className="text-[#111] hover:text-[#A3A3A3] hover:scale-110 transition-all">
                    <Share2 className="w-6 h-6" strokeWidth={1.5} />
                  </button>
                </div>
                <button className="text-[#111] hover:text-[#A3A3A3] hover:scale-110 transition-all">
                  <Bookmark className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>

              <div className="text-sm text-[#111] leading-relaxed">
                <span className="font-bold font-semibold mr-3">{brand.name}</span>
                <span className="text-[#666]">{post.caption}</span>
              </div>

              <div className="text-[10px] text-[#A3A3A3] uppercase tracking-widest font-semibold">
                {post.likeCount.toLocaleString()} lượt thích • {post.commentCount} bình luận
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
