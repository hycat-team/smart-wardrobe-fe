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
          <div key={post.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow group text-card-foreground">
            <div className="p-2.5 flex items-center justify-between border-b border-border bg-muted/30">
              <Link href={`/brands/${brand.id}`} className="flex items-center gap-2.5">
                <Avatar className="w-8 h-8 ring-1 ring-background shadow-sm rounded-full bg-muted">
                  <AvatarImage src={brand.logoUrl} className="object-cover" />
                  <AvatarFallback className="bg-foreground text-background text-[10px] font-semibold">{brand.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-foreground leading-tight hover:underline">{brand.name}</span>
                  <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">{post.type}</span>
                </div>
              </Link>
              <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">
                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>

            <div className="relative aspect-square bg-muted w-full overflow-hidden">
              <img
                src={post.mediaUrls[0]}
                alt="Brand Post"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              {post.taggedProductIds.length > 0 && (
                <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 flex items-center gap-1 shadow-sm rounded-full cursor-pointer hover:bg-background transition-colors border border-border">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-[8px] font-bold tracking-widest uppercase text-foreground">Shoppable Look</span>
                </div>
              )}
            </div>

            <div className="p-3 flex flex-col gap-2.5 bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="text-foreground hover:text-muted-foreground hover:scale-110 transition-all">
                    <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  </button>
                  <button className="text-foreground hover:text-muted-foreground hover:scale-110 transition-all">
                    <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  </button>
                  <button className="text-foreground hover:text-muted-foreground hover:scale-110 transition-all">
                    <Share2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  </button>
                </div>
                <button className="text-foreground hover:text-muted-foreground hover:scale-110 transition-all">
                  <Bookmark className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
              </div>

              <div className="text-xs text-foreground leading-relaxed">
                <span className="font-bold mr-2">{brand.name}</span>
                <span className="text-muted-foreground">{post.caption}</span>
              </div>

              <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">
                {post.likeCount.toLocaleString()} lượt thích • {post.commentCount} bình luận
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
