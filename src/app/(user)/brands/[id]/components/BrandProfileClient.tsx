'use client';

import React from 'react';
import { mockBrands, mockBrandPosts, mockProducts } from '@/lib/mock-data/b2b';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Bookmark, Share2, BadgeCheck, MapPin, Link as LinkIcon, Camera } from 'lucide-react';
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
      {/* <div className="w-full h-[300px] md:h-[450px] relative bg-[#F5F2EE] group overflow-hidden">
        <img src={brand.coverUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div> */}

      <div className="w-[calc(100%+2rem)] -mx-4 md:w-[calc(100%+4rem)] md:-mx-8 h-[300px] md:h-[450px] relative bg-[#F5F2EE] group overflow-hidden">
        <img src={brand.coverUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" />

        {/* Top-to-bottom gradient (đen nhẹ -> trắng) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white"></div>
        
        {/* Left & Right edge gradients to blend smoothly */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent"></div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Header */}
        <div className="relative -mt-24 sm:-mt-32 mb-12 flex flex-col lg:flex-row gap-8 lg:items-end">
          <Avatar className="w-40 h-40 sm:w-48 sm:h-48 shadow-xl rounded-full overflow-hidden border-4 border-white/50">
            <AvatarImage src={brand.logoUrl} className="object-cover" />
            <AvatarFallback className="bg-[#111] text-white text-4xl font-['Playfair_Display']">{brand.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 flex flex-col gap-4 pb-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl sm:text-5xl font-['Playfair_Display'] font-medium text-white lg:text-[#111] tracking-tight">{brand.name}</h1>
                {brand.isVerified && <BadgeCheck className="w-8 h-8 text-blue-500 bg-white rounded-full p-0.5" />}
              </div>
              <p className="text-white/90 lg:text-[#666] font-['IBM_Plex_Mono'] text-sm sm:text-base max-w-[800px] leading-relaxed">
                {brand.description}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 mt-4 text-sm font-['IBM_Plex_Mono']">
              <div className="flex items-center gap-2 text-white/90 lg:text-[#666]">
                <MapPin className="w-4 h-4" />
                <span>TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 lg:text-[#666] hover:text-[#111] transition-colors cursor-pointer">
                <LinkIcon className="w-4 h-4" />
                <span>{brand.name.toLowerCase().replace(/\s/g, '')}.vn</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 lg:text-[#666] hover:text-[#111] transition-colors cursor-pointer">
                <Camera className="w-4 h-4" />
                <span>@{brand.name.toLowerCase().replace(/\s/g, '')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pb-2 w-full lg:w-auto">
            <div className="flex items-center gap-8 px-8 py-3 bg-[#FAFAFA] rounded-full border border-black/5 shadow-sm w-full sm:w-auto justify-center">
              <div className="flex flex-col items-center">
                <span className="font-bold text-[#111] text-lg font-['IBM_Plex_Mono']">{brand.followerCount.toLocaleString()}</span>
                <span className="text-[#A3A3A3] text-[10px] uppercase tracking-widest">Followers</span>
              </div>
              <div className="w-px h-8 bg-black/10"></div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-[#111] text-lg font-['IBM_Plex_Mono']">{brand.memberCount.toLocaleString()}</span>
                <span className="text-[#A3A3A3] text-[10px] uppercase tracking-widest">Members</span>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button variant={brand.isFollowing ? "outline" : "default"} className="flex-1 sm:flex-none rounded-full font-['IBM_Plex_Mono'] text-xs font-medium uppercase tracking-widest px-8 h-12 shadow-sm border-black/20">
                {brand.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
              </Button>
              <Button variant="default" className="flex-1 sm:flex-none rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-white font-['IBM_Plex_Mono'] text-xs font-medium uppercase tracking-widest px-8 h-12 shadow-md border-0">
                Membership
              </Button>
            </div>
          </div>
        </div>

        {/* Story & Tags */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="font-['Playfair_Display'] text-2xl font-medium text-[#111] border-b border-black/10 pb-4">Câu chuyện thương hiệu</h3>
            <p className="text-[#666] leading-relaxed font-['IBM_Plex_Mono'] text-sm">{brand.story}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-['Playfair_Display'] text-2xl font-medium text-[#111] border-b border-black/10 pb-4">Phong cách</h3>
            <div className="flex flex-wrap gap-2">
              {brand.styles.map(style => (
                <span key={style} className="px-4 py-2 bg-[#FAFAFA] border border-black/5 rounded-full text-xs font-medium uppercase tracking-widest text-[#111] font-['IBM_Plex_Mono'] hover:bg-black hover:text-white transition-colors cursor-pointer">
                  {style}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="shop" className="w-full">
          <TabsList variant="line" className="w-full justify-start h-auto p-0 border-b border-black/10 mb-12 gap-8">
            <TabsTrigger 
              value="shop" 
              className="px-0 pb-4 pt-2 font-['IBM_Plex_Mono'] text-sm font-bold uppercase tracking-widest text-[#A3A3A3] data-[state=active]:text-[#111] bg-transparent data-[state=active]:bg-transparent"
            >
              Cửa hàng
            </TabsTrigger>
            <TabsTrigger 
              value="posts" 
              className="px-0 pb-4 pt-2 font-['IBM_Plex_Mono'] text-sm font-bold uppercase tracking-widest text-[#A3A3A3] data-[state=active]:text-[#111] bg-transparent data-[state=active]:bg-transparent"
            >
              Lookbook & Bài viết
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shop" className="focus-visible:outline-none focus-visible:ring-0 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {products.length === 0 ? (
              <div className="text-center py-20 text-[#A3A3A3] font-['IBM_Plex_Mono'] text-sm uppercase tracking-widest">Brand chưa đăng sản phẩm nào.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                {products.map(product => (
                  <Link key={product.id} href={`/products/${product.id}`} className="group flex flex-col gap-4">
                    <div className="relative aspect-[3/4] bg-[#F5F2EE] overflow-hidden rounded-md">
                      <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply" />
                      {product.discountPrice && (
                        <div className="absolute top-3 left-3 bg-[#111] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-full">
                          Sale
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="font-['Playfair_Display'] text-lg font-medium text-[#111] group-hover:underline leading-tight line-clamp-1">{product.name}</h4>
                      <div className="flex items-center gap-3 font-['IBM_Plex_Mono']">
                        {product.discountPrice ? (
                          <>
                            <span className="text-sm font-bold text-red-600">{product.discountPrice.toLocaleString()}đ</span>
                            <span className="text-xs text-[#A3A3A3] line-through">{product.price.toLocaleString()}đ</span>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-[#111]">{product.price.toLocaleString()}đ</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="posts" className="focus-visible:outline-none focus-visible:ring-0 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {brandPosts.length === 0 ? (
              <div className="text-center py-20 text-[#A3A3A3] font-['IBM_Plex_Mono'] text-sm uppercase tracking-widest">Brand chưa có bài đăng nào.</div>
            ) : (
              <div className="max-w-[700px] mx-auto flex flex-col gap-16">
                {brandPosts.map(post => (
                  <div key={post.id} className="bg-white border border-black/5 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-5 flex items-center justify-between border-b border-black/5 bg-[#FAFAFA]/50">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 ring-2 ring-white shadow-sm rounded-full bg-white">
                          <AvatarImage src={brand.logoUrl} className="object-cover" />
                          <AvatarFallback className="bg-[#111] text-white text-sm font-['Playfair_Display']">{brand.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-[#111] font-['IBM_Plex_Mono']">{brand.name}</span>
                          <span className="text-[10px] font-medium text-[#A3A3A3] uppercase tracking-widest mt-0.5">{post.type}</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-[#A3A3A3] uppercase tracking-widest font-['IBM_Plex_Mono']">
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    
                    <div className="relative aspect-[4/5] bg-[#F5F2EE] w-full overflow-hidden">
                      <img 
                        src={post.mediaUrls[0]} 
                        alt="Brand Post" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                      />
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
                        <span className="font-bold font-['IBM_Plex_Mono'] mr-3">{brand.name}</span>
                        <span className="text-[#666]">{post.caption}</span>
                      </div>
                      
                      <div className="text-[10px] text-[#A3A3A3] uppercase tracking-widest font-['IBM_Plex_Mono']">
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
