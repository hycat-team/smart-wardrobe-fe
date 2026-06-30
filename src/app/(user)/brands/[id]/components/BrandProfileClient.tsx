'use client';

import React, { useState, useEffect } from 'react';
import { mockBrands, mockBrandPosts } from '@/lib/mock-data/b2b';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Bookmark, Share2, BadgeCheck, MapPin, Link as LinkIcon, Camera, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetActiveBrandDetail, useJoinLoyalty, useGetBrandItems } from '@/features/brands/queries/user-brands.queries';
import BrandChatWindow from './BrandChatWindow';

interface BrandProfileClientProps {
  brandId: string;
}

export default function BrandProfileClient({ brandId }: BrandProfileClientProps) {
  const router = useRouter();
  const { data: brandData, isLoading } = useGetActiveBrandDetail(brandId);
  const { data: brandItems } = useGetBrandItems(brandId);
  const { mutateAsync: joinLoyalty, isPending: isJoining } = useJoinLoyalty();


  // We merge API data with mock base to keep the rich UI for missing fields (cover, story)
  const baseBrand = mockBrands.find(b => b.id === brandId) || mockBrands[0];
  const [displayBrand, setDisplayBrand] = useState<any>(baseBrand);

  const [brandPosts, setBrandPosts] = useState(mockBrandPosts.filter(p => p.brandId === brandId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  const [products, setProducts] = useState<any[]>([]);

  // Follow button state
  const [isFollowing, setIsFollowing] = useState(baseBrand?.isFollowing || false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Load custom brand profile
    try {
      const storedProfile = localStorage.getItem("custom_brand_profile");
      if (storedProfile && baseBrand) {
        const customProfile = JSON.parse(storedProfile);
        setDisplayBrand({
          ...baseBrand,
          ...customProfile,
        });
      }
    } catch (e) { }

    // Load custom posts
    try {
      const stored = localStorage.getItem("brand_custom_posts");
      if (stored) {
        const customPosts = JSON.parse(stored);
        const defaultPosts = mockBrandPosts.filter(p => p.brandId === brandId);
        const overriddenIds = customPosts.map((p: any) => p.id);
        const filteredDefaults = defaultPosts.filter(p => !overriddenIds.includes(p.id));

        setBrandPosts(
          [...customPosts.filter((p: any) => p.brandId === brandId), ...filteredDefaults]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
      }
    } catch (e) { }

    if (brandData) {
      setDisplayBrand((prev: any) => ({
        ...prev,
        ...brandData,
        // Ensure name and logo are overridden by API
        name: brandData.name || prev.name,
        logoUrl: brandData.logoUrl || prev.logoUrl,
        description: brandData.description || prev.description,
      }));
    }

    if (brandItems) {
      setProducts(brandItems);
    }
  }, [brandId, baseBrand, brandData, brandItems]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
      </div>
    );
  }

  if (!displayBrand) return null;
  const brand = displayBrand;

  const activeProducts = products.filter(p => 
    !p.status || p.status === 'ACTIVE' || p.status === 'active' || p.stockStatus === 'IN_STOCK'
  );

  return (
    <div className="flex-1 bg-background pb-20">
      {/* Cover Image */}
      {/* <div className="w-full h-[300px] md:h-[450px] relative bg-muted group overflow-hidden">
        <img src={brand.coverUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div> */}

      <div className="w-[calc(100%+2rem)] -mx-4 md:w-[calc(100%+4rem)] md:-mx-8 h-[300px] md:h-[450px] relative bg-muted group overflow-hidden">
        {/* Nút Back */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 z-20 bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <img src={brand.coverUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" />

        {/* Top-to-bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background"></div>

        {/* Left & Right edge gradients to blend smoothly */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent"></div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Header */}
        <div className="relative -mt-24 sm:-mt-32 mb-12 flex flex-col lg:flex-row items-center lg:items-end gap-6 lg:gap-8">
          <Avatar className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 shadow-xl rounded-full overflow-hidden border-4 border-background z-10 shrink-0">
            <AvatarImage src={brand.logoUrl} className="object-cover" />
            <AvatarFallback className="bg-muted text-foreground text-4xl font-semibold">{brand.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 flex flex-col items-center lg:items-start gap-4 pb-2 text-center lg:text-left w-full mt-2 lg:mt-0">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-medium text-foreground tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{brand.name}</h1>
                {brand.isVerified && <BadgeCheck className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 bg-background rounded-full p-0.5" />}
              </div>
              <p className="text-muted-foreground font-semibold text-sm sm:text-base max-w-[800px] leading-relaxed mx-auto lg:mx-0">
                {brand.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 mt-2 text-xs sm:text-sm font-semibold w-full">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <LinkIcon className="w-4 h-4" />
                <span>{brand.name.toLowerCase().replace(/\s/g, '')}.vn</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <Camera className="w-4 h-4" />
                <span>@{brand.name.toLowerCase().replace(/\s/g, '')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pb-2 w-full lg:w-auto shrink-0 mt-4 lg:mt-0">
            <div className="flex items-center justify-center gap-8 px-6 lg:px-8 py-3 bg-muted rounded-3xl border border-border shadow-sm w-full sm:w-auto">
              <div className="flex flex-col items-center">
                <span className="font-bold text-foreground text-lg font-semibold">{brand.followerCount.toLocaleString()}</span>
                <span className="text-muted-foreground text-[10px] uppercase tracking-widest">Followers</span>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-foreground text-lg font-semibold">{brand.memberCount.toLocaleString()}</span>
                <span className="text-muted-foreground text-[10px] uppercase tracking-widest">Members</span>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant={isFollowing ? "outline" : "default"}
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex-1 sm:flex-none min-w-[140px] rounded-full font-semibold text-xs font-medium uppercase tracking-widest px-6 lg:px-8 h-12 shadow-sm transition-colors`}
              >
                {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsChatOpen(true)}
                className="flex-1 sm:flex-none rounded-full font-semibold text-xs font-medium uppercase tracking-widest px-6 lg:px-8 h-12 shadow-sm transition-colors"
              >
                Nhắn tin
              </Button>
              <Button 
                variant="default" 
                onClick={() => joinLoyalty(brandId)}
                disabled={isJoining}
                className="flex-1 sm:flex-none rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-white font-semibold text-xs font-medium uppercase tracking-widest px-6 lg:px-8 h-12 shadow-md border-0 disabled:opacity-50"
              >
                {isJoining ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Membership'}
              </Button>
            </div>
          </div>
        </div>

        {/* Story & Tags */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="font-semibold text-2xl font-medium text-foreground border-b border-border pb-4">Câu chuyện thương hiệu</h3>
            <p className="text-muted-foreground leading-relaxed font-semibold text-sm">{brand.story}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-2xl font-medium text-foreground border-b border-border pb-4">Phong cách</h3>
            <div className="flex flex-wrap gap-2">
              {brand.styles?.map((style: string) => (
                <span key={style} className="px-4 py-2 bg-muted border border-border rounded-full text-xs font-medium uppercase tracking-widest text-foreground font-semibold hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                  {style}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="shop" className="w-full">
          <TabsList variant="line" className="w-full justify-start h-auto p-0 border-b border-border mb-8 lg:mb-12 gap-6 lg:gap-8 overflow-x-auto flex-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsTrigger
              value="shop"
              className="px-0 pb-4 pt-2 font-semibold text-sm font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground bg-transparent data-[state=active]:bg-transparent"
            >
              Cửa hàng
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="px-0 pb-4 pt-2 font-semibold text-sm font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground bg-transparent data-[state=active]:bg-transparent"
            >
              Lookbook & Bài viết
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shop" className="focus-visible:outline-none focus-visible:ring-0 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeProducts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground font-semibold text-sm uppercase tracking-widest">Brand chưa đăng sản phẩm nào.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                {activeProducts.map(product => (
                  <Link key={product.id} href={`/products/${product.id}`} className="group flex flex-col gap-4">
                    <div className="relative aspect-[3/4] bg-muted overflow-hidden rounded-2xl">
                      <img src={product.imageUrls?.[0] || 'https://placehold.co/300x400?text=No+Image'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply" />
                      {product.discountPrice && (
                        <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-full">
                          Sale
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="font-semibold text-lg font-medium text-foreground group-hover:underline leading-tight line-clamp-1">{product.name}</h4>
                      <div className="flex items-center gap-3 font-semibold">
                        {product.discountPrice ? (
                          <>
                            <span className="text-sm font-bold text-destructive">{product.discountPrice.toLocaleString()}đ</span>
                            <span className="text-xs text-muted-foreground line-through">{product.price.toLocaleString()}đ</span>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-foreground">{product.price.toLocaleString()}đ</span>
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
              <div className="text-center py-20 text-muted-foreground font-semibold text-sm uppercase tracking-widest">Brand chưa có bài đăng nào.</div>
            ) : (
              <div className="max-w-[700px] mx-auto flex flex-col gap-12">
                {brandPosts.map(post => (
                  <div key={post.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow group text-card-foreground">
                    <div className="p-2.5 flex items-center justify-between border-b border-border bg-muted/30">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-8 h-8 ring-1 ring-background shadow-sm rounded-full bg-muted">
                          <AvatarImage src={brand.logoUrl} className="object-cover" />
                          <AvatarFallback className="bg-foreground text-background text-[10px] font-semibold">{brand.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-foreground leading-tight">{brand.name}</span>
                          <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">{post.type}</span>
                        </div>
                      </div>
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
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BrandChatWindow brandId={brandId} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

