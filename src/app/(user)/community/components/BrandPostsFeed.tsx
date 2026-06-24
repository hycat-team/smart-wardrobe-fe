import React from 'react';
import { mockBrandPosts, mockBrands } from '@/lib/mock-data/b2b';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import Link from 'next/link';

export function BrandPostsFeed() {
  // Sort posts by date descending
  const sortedPosts = [...mockBrandPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col gap-6 mb-10">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px bg-black/10 flex-1"></div>
        <span className="text-xs font-bold uppercase tracking-widest text-black/40 px-4">Local Brand Updates</span>
        <div className="h-px bg-black/10 flex-1"></div>
      </div>

      {sortedPosts.map(post => {
        const brand = mockBrands.find(b => b.id === post.brandId);
        if (!brand) return null;

        return (
          <div key={post.id} className="bg-white border border-black/10 p-0 rounded-sm overflow-hidden flex flex-col group">
            <div className="p-4 flex items-center justify-between border-b border-black/5">
              <Link href={`/brands/${brand.id}`} className="flex items-center gap-3">
                <Avatar className="w-10 h-10 ring-1 ring-black/5 rounded-sm">
                  <AvatarImage src={brand.logoUrl} className="object-cover" />
                  <AvatarFallback className="rounded-sm bg-black text-white text-xs">{brand.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-black hover:underline">{brand.name}</span>
                  <span className="text-[11px] font-medium text-black/50 uppercase tracking-wider">{post.type}</span>
                </div>
              </Link>
              <div className="text-xs text-black/40 font-medium">
                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
            
            <div className="relative aspect-[4/5] bg-[#F5F2EE] w-full overflow-hidden">
              <img 
                src={post.mediaUrls[0]} 
                alt="Brand Post" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {post.taggedProductIds.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 flex items-center gap-2 shadow-sm rounded-sm">
                  <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
                  <span className="text-xs font-bold text-black uppercase tracking-wider">Shoppable Look</span>
                </div>
              )}
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="text-black hover:text-black/60 transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="text-black hover:text-black/60 transition-colors">
                    <MessageCircle className="w-6 h-6" />
                  </button>
                  <button className="text-black hover:text-black/60 transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
                <button className="text-black hover:text-black/60 transition-colors">
                  <Bookmark className="w-6 h-6" />
                </button>
              </div>

              <div className="text-sm text-black">
                <span className="font-bold mr-2">{brand.name}</span>
                <span className="text-black/80">{post.caption}</span>
              </div>
              
              <div className="text-xs text-black/50 font-medium">
                {post.likeCount.toLocaleString()} lượt thích • {post.commentCount} bình luận
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
