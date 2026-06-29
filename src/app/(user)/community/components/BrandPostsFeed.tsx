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
        <h3 className="font-semibold text-2xl font-medium text-foreground">Local Brand Updates</h3>
        <div className="h-px bg-border flex-1"></div>
      </div>

      {sortedPosts.map(post => {
        const brand = mockBrands.find(b => b.id === post.brandId);
        if (!brand) return null;

        return (
          <div key={post.id} className="mx-auto max-w-[550px] w-full flex flex-col bg-card text-card-foreground border border-border rounded-2xl overflow-hidden transition-colors">
            {/* Header Section */}
            <div className="px-3 py-2.5 flex items-center justify-between bg-card">
              <Link href={`/brands/${brand.id}`} className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity">
                <Avatar className="w-8 h-8 rounded-full relative overflow-hidden flex-shrink-0 ring-1 ring-border bg-muted">
                  <AvatarImage src={brand.logoUrl} className="object-cover" />
                  <AvatarFallback className="bg-foreground text-background text-[10px] font-semibold">{brand.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[13px] text-foreground leading-tight truncate">
                      {brand.name}
                    </span>
                    <span className="text-muted-foreground text-[11px] leading-tight">•</span>
                    <span className="text-muted-foreground text-[11px] leading-tight">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground mt-0.5">{post.type}</span>
                </div>
              </Link>
            </div>

            {/* Media Section */}
            <div className="relative w-full aspect-[4/5] bg-muted/20 overflow-hidden flex items-center justify-center border-y border-border">
              <img
                src={post.mediaUrls[0]}
                alt="Brand Post"
                className="object-cover w-full h-full transition-opacity duration-300"
              />
              {post.taggedProductIds.length > 0 && (
                <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 flex items-center gap-1 shadow-sm rounded-full cursor-pointer hover:bg-background transition-colors border border-border">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-[8px] font-bold tracking-widest uppercase text-foreground">Shoppable Look</span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="px-3 pt-1.5 pb-2 flex flex-col bg-card">
              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5 -ml-2">
                  <button className="text-foreground hover:text-muted-foreground active:scale-95 transition-all outline-none p-2 rounded-full">
                    <Heart className="w-5.5 h-5.5" strokeWidth={1.8} />
                  </button>
                  <button className="text-foreground hover:text-muted-foreground active:scale-95 transition-all outline-none p-2 rounded-full">
                    <MessageCircle className="w-5.5 h-5.5" strokeWidth={1.8} />
                  </button>
                  <button className="text-foreground hover:text-muted-foreground active:scale-95 transition-all outline-none p-2 rounded-full">
                    <Share2 className="w-5.5 h-5.5" strokeWidth={1.8} />
                  </button>
                </div>
                <button className="text-foreground hover:text-muted-foreground active:scale-95 transition-all outline-none p-2 rounded-full -mr-2">
                  <Bookmark className="w-5.5 h-5.5" strokeWidth={1.8} />
                </button>
              </div>

              {/* Likes */}
              {post.likeCount > 0 && (
                <div className="mt-0.5 text-[13px] font-semibold text-foreground">
                  {post.likeCount.toLocaleString()} lượt thích
                </div>
              )}

              {/* Title & Content */}
              <div className="mt-1 text-[13px] text-foreground leading-relaxed break-words line-clamp-2">
                <Link href={`/brands/${brand.id}`} className="font-semibold mr-1.5 hover:underline cursor-pointer">
                  {brand.name}
                </Link>
                <span>{post.caption}</span>
              </div>

              {/* Comments Link */}
              {post.commentCount > 0 && (
                <button className="mt-1.5 text-[13px] text-muted-foreground text-left hover:text-foreground transition-colors w-fit">
                  Xem tất cả {post.commentCount} bình luận
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
