'use client';

import React from 'react';
import { mockBrands, mockBrandPosts, mockProducts } from '@/lib/mock-data/b2b';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Bookmark, Share2, BadgeCheck } from 'lucide-react';
import Link from 'next/link';

interface BrandProfileClientProps {
  brandId: string;
}

export default function BrandProfileClient({ brandId }: BrandProfileClientProps) {
  const brand = mockBrands.find(b => b.id === brandId);
  const brandPosts = mockBrandPosts.filter(p => p.brandId === brandId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const products = mockProducts.filter(p => p.brandId === brandId);

  if (!brand) return null;

  return (
    <div className="flex-1 bg-white pb-20">
      {/* Cover Image */}
      <div className="w-full h-[250px] md:h-[350px] relative bg-[#F5F2EE]">
        <img src={brand.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Header */}
        <div className="relative -mt-16 sm:-mt-24 mb-8 flex flex-col sm:flex-row gap-6 sm:items-end">
          <Avatar className="w-32 h-32 sm:w-40 sm:h-40 ring-4 ring-white shadow-xl rounded-sm">
            <AvatarImage src={brand.logoUrl} className="object-cover" />
            <AvatarFallback className="rounded-sm bg-black text-white text-3xl">{brand.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 flex flex-col gap-2 pb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">{brand.name}</h1>
              {brand.isVerified && <BadgeCheck className="w-6 h-6 text-blue-500" />}
            </div>
            <p className="text-black/60 font-medium text-sm sm:text-base max-w-[600px]">{brand.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex flex-col">
                <span className="font-bold text-black">{brand.followerCount.toLocaleString()}</span>
                <span className="text-black/50 text-xs uppercase tracking-wider">Followers</span>
              </div>
              <div className="w-px h-8 bg-black/10"></div>
              <div className="flex flex-col">
                <span className="font-bold text-black">{brand.memberCount.toLocaleString()}</span>
                <span className="text-black/50 text-xs uppercase tracking-wider">Members</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-2 w-full sm:w-auto">
            <Button variant={brand.isFollowing ? "outline" : "default"} className="flex-1 sm:flex-none rounded-none font-bold uppercase tracking-widest px-8">
              {brand.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
            </Button>
            <Button variant="default" className="flex-1 sm:flex-none rounded-none bg-[#D4AF37] hover:bg-[#B5952F] text-white font-bold uppercase tracking-widest px-8">
              Membership
            </Button>
          </div>
        </div>

        {/* Story & Tags */}
        <div className="bg-[#FAFAFA] border border-black/10 p-6 mb-10 flex flex-col gap-4">
          <h3 className="font-bold text-sm uppercase tracking-widest text-black/50">Về thương hiệu</h3>
          <p className="text-black leading-relaxed">{brand.story}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {brand.styles.map(style => (
              <span key={style} className="px-3 py-1 bg-white border border-black/10 text-xs font-bold uppercase tracking-wide">
                {style}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="shop" className="w-full">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-black/10 rounded-none mb-8 space-x-8">
            <TabsTrigger 
              value="shop" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 pt-2 font-bold text-base uppercase tracking-wider"
            >
              Cửa hàng
            </TabsTrigger>
            <TabsTrigger 
              value="posts" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 pt-2 font-bold text-base uppercase tracking-wider"
            >
              Lookbook & Bài viết
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shop" className="focus-visible:outline-none focus-visible:ring-0 mt-0">
            {products.length === 0 ? (
              <div className="text-center py-20 text-black/50 italic">Brand chưa đăng sản phẩm nào.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map(product => (
                  <Link key={product.id} href={`/products/${product.id}`} className="group flex flex-col gap-3">
                    <div className="relative aspect-[3/4] bg-[#F5F2EE] overflow-hidden">
                      <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      {product.discountPrice && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                          Sale
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold text-sm text-black group-hover:underline">{product.name}</h4>
                      <div className="flex items-center gap-2">
                        {product.discountPrice ? (
                          <>
                            <span className="text-sm font-bold text-red-600">{product.discountPrice.toLocaleString()}đ</span>
                            <span className="text-xs text-black/40 line-through">{product.price.toLocaleString()}đ</span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-black">{product.price.toLocaleString()}đ</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="posts" className="focus-visible:outline-none focus-visible:ring-0 mt-0">
            {brandPosts.length === 0 ? (
              <div className="text-center py-20 text-black/50 italic">Brand chưa có bài đăng nào.</div>
            ) : (
              <div className="max-w-[600px] mx-auto flex flex-col gap-10">
                {brandPosts.map(post => (
                  <div key={post.id} className="bg-white border border-black/10 rounded-sm overflow-hidden flex flex-col group">
                    <div className="p-4 flex items-center justify-between border-b border-black/5">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-1 ring-black/5 rounded-sm">
                          <AvatarImage src={brand.logoUrl} className="object-cover" />
                          <AvatarFallback className="rounded-sm bg-black text-white text-xs">{brand.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-black">{brand.name}</span>
                          <span className="text-[11px] font-medium text-black/50 uppercase tracking-wider">{post.type}</span>
                        </div>
                      </div>
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
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
