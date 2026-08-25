'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  BadgeCheck,
  MapPin,
  Link as LinkIcon,
  Camera,
  Loader2,
  ArrowLeft,
  Check,
  ArrowUpRight,
  Gift,
  Ticket,
  Star,
  Sparkles,
  ChevronRight,
  X,
  Copy
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useGetActiveBrandDetail,
  useJoinLoyalty,
  useGetBrandItems,
  useGetMyLoyaltyAtBrand,
  useGetBrandBenefits,
  useGetMyBenefitRedemptions,
} from '@/features/brands/queries/user-brands.queries';
import { toast } from 'sonner';
import BrandChatWindow from './BrandChatWindow';
import Image from 'next/image';

interface BrandProfileClientProps {
  brandId: string;
}

export default function BrandProfileClient({ brandId }: BrandProfileClientProps) {
  const router = useRouter();
  const { data: brand, isLoading } = useGetActiveBrandDetail(brandId);
  const { data: brandItems } = useGetBrandItems(brandId);
  const { data: loyaltyData } = useGetMyLoyaltyAtBrand(brandId);
  const { data: brandBenefits } = useGetBrandBenefits(brandId);
  const { data: myRedemptions } = useGetMyBenefitRedemptions(brandId);
  const { mutateAsync: joinLoyalty, isPending: isJoining } = useJoinLoyalty();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBenefitsOpen, setIsBenefitsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
      </div>
    );
  }

  if (!brand) return null;

  const products = brandItems || [];
  const activeProducts = products.filter((p: any) =>
    !p.status || p.status === 'ACTIVE' || p.status === 'active' || p.stockStatus === 'IN_STOCK'
  );

  const benefits = brandBenefits?.items || [];
  const activeBenefits = benefits.filter((b: any) => !b.status || b.status === 'active' || b.status === 'ACTIVE');

  const brandRedemptions = myRedemptions?.filter((r: any) => 
    r.brand?.id === brandId ||
    r.benefit?.brand?.id === brandId || 
    r.brandBenefit?.brand?.id === brandId ||
    r.id // If it's returning the brand benefits directly, just show them
  ) || [];

  const handleRedeem = (benefit: any) => {
    if (!loyaltyData) {
      toast.error('Vui lòng đăng ký Membership trước khi đổi quà.');
      return;
    }
    const currentPts = loyaltyData.currentPoints || 0;
    if (currentPts < (benefit.requiredPoints || 0)) {
      toast.error(`Bạn cần thêm ${((benefit.requiredPoints || 0) - currentPts).toLocaleString()} điểm để đổi quà này.`);
      return;
    }
    setIsBenefitsOpen(false);
    router.push(`/brands/${brandId}/benefits/${benefit.id}`);
  };

  return (
    <div className="flex-1 bg-background pb-20">
      {/* Cover */}
      <div className="w-[calc(100%+2rem)] -mx-4 md:w-[calc(100%+4rem)] md:-mx-8 h-[300px] md:h-[450px] relative bg-muted group overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-20 bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <img src={brand.backgroundUrl || 'https://placehold.co/1200x400?text=Brand+Cover'} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent" />
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
                {(brand as any).isVerified && <BadgeCheck className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 bg-background rounded-full p-0.5" />}
              </div>
              {brand.description && (
                <p className="text-muted-foreground font-semibold text-sm sm:text-base max-w-[800px] leading-relaxed mx-auto lg:mx-0">
                  {brand.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 mt-2 text-xs sm:text-sm font-semibold w-full">
              {brand.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{brand.location}</span>
                </div>
              )}
              {brand.website && (
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <LinkIcon className="w-4 h-4" />
                  <span>{brand.website.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
              {brand.instagram && (
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <span>@{brand.instagram.replace(/^@/, '')}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-2 w-full lg:w-auto shrink-0 mt-4 lg:mt-0">
            {/* Members count pill */}
            <div className="flex items-center justify-center gap-8 px-6 lg:px-8 py-3 bg-muted rounded-3xl border border-border shadow-sm w-full sm:w-auto">
              <div className="flex flex-col items-center">
                <span className="font-bold text-foreground text-lg font-semibold">{((brand as any).totalCustomer || (brand as any).memberCount || 0).toLocaleString()}</span>
                <span className="text-muted-foreground text-[10px] uppercase tracking-widest">Members</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 w-full sm:w-auto flex-wrap justify-center">
              {/* Benefits button — shown only when benefits exist */}
              {activeBenefits.length > 0 && (
                <button
                  onClick={() => setIsBenefitsOpen(true)}
                  className="relative inline-flex items-center gap-2 rounded-full border border-dashed border-[#D4AF37]/60 bg-gradient-to-r from-[#D4AF37]/8 to-[#B5952F]/8 text-[#9A7820] hover:from-[#D4AF37]/15 hover:to-[#B5952F]/15 hover:border-[#D4AF37] transition-all duration-200 font-semibold text-xs uppercase tracking-widest px-5 h-12 group"
                >
                  <Gift className="w-4 h-4 text-[#C49B28] group-hover:rotate-12 transition-transform duration-300" />
                  <span>Quà tặng</span>
                  {/* badge */}
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#D4AF37] text-white text-[9px] font-black leading-none">
                    {activeBenefits.length}
                  </span>
                </button>
              )}

              <Button
                variant="outline"
                onClick={() => setIsChatOpen(true)}
                className="flex-1 sm:flex-none rounded-full font-semibold text-xs font-medium uppercase tracking-widest px-6 lg:px-8 h-12 shadow-sm transition-colors"
              >
                Nhắn tin
              </Button>

              {loyaltyData ? (
                <Link
                  href={`/brands/${brandId}/loyalty`}
                  className="flex items-center justify-center flex-1 sm:flex-none rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-[#B5952F]/10 hover:from-[#D4AF37]/20 hover:to-[#B5952F]/20 text-[#B5952F] font-semibold text-xs font-bold uppercase tracking-widest px-6 lg:px-8 h-12 border border-[#D4AF37]/30 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Thẻ Thành Viên
                </Link>
              ) : (
                <Button
                  variant="default"
                  onClick={() => joinLoyalty(brandId)}
                  disabled={isJoining}
                  className="flex-1 sm:flex-none rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-white font-semibold text-xs font-medium uppercase tracking-widest px-6 lg:px-8 h-12 shadow-md border-0 disabled:opacity-50"
                >
                  {isJoining ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Đăng ký Membership'}
                </Button>
              )}
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
            {/* <TabsTrigger
              value="my_benefits"
              className="px-0 pb-4 pt-2 font-semibold text-sm font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground bg-transparent data-[state=active]:bg-transparent"
            >
              Quà của tôi {brandRedemptions.length > 0 && <span className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{brandRedemptions.length}</span>}
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="shop" className="focus-visible:outline-none focus-visible:ring-0 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeProducts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground font-semibold text-sm uppercase tracking-widest">Brand chưa đăng sản phẩm nào.</div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 lg:gap-y-10">
                {activeProducts.map((product: any) => (
                  <Link key={product.id} href={`/products/${product.id}`} className="group flex flex-col gap-3 lg:gap-4">
                    <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden rounded-2xl isolate">
                      <img
                        src={product.fashionItem?.imageUrl || product.imageUrls?.[0]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 z-10" />
                      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                        {product.discountPrice && (
                          <span className="bg-foreground text-background text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest rounded-sm">Sale</span>
                        )}
                        {product.status && product.status !== 'active' && product.status !== 'ACTIVE' && (
                          <span className="bg-zinc-100/90 backdrop-blur-sm text-zinc-600 text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {product.status}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-3 z-20 bg-background/90 backdrop-blur-sm text-foreground p-2 rounded-full shadow-sm translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 px-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-sm text-foreground line-clamp-1">{product.name}</h4>
                        {product.productCode && (
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider shrink-0">{product.productCode}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {product.discountPrice ? (
                          <>
                            <span className="text-sm font-semibold text-destructive">{product.discountPrice.toLocaleString()}đ</span>
                            <span className="text-xs text-muted-foreground line-through">{product.price.toLocaleString()}đ</span>
                          </>
                        ) : (
                          <span className="text-sm text-zinc-500">{product.price.toLocaleString()}đ</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my_benefits" className="focus-visible:outline-none focus-visible:ring-0 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {brandRedemptions.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground font-semibold text-sm uppercase tracking-widest">
                Bạn chưa đổi quà tặng nào từ brand này.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brandRedemptions.map((redemption: any) => {
                  const benefit = redemption.benefit || redemption.brandBenefit || redemption;
                  return (
                    <div key={redemption.id} className="relative p-5 rounded-2xl bg-zinc-50 border border-border hover:border-border/80 transition-all duration-300 group overflow-hidden">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-[#B5952F]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                          {benefit?.benefitType === 'voucher' || benefit?.benefitType === 'VOUCHER' ? (
                            <Ticket className="w-5 h-5 text-[#C49B28]" />
                          ) : (
                            <Gift className="w-5 h-5 text-[#C49B28]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h4 className="font-semibold text-sm text-foreground line-clamp-1">{benefit?.name || 'Quà tặng'}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Đổi ngày: {new Date(redemption.redeemedAt || redemption.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      
                      {redemption.voucherCode && benefit?.benefitType !== 'feature_access' && (
                        <div className="mt-5 pt-4 border-t border-border/50">
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Mã Voucher</p>
                          <div className="flex items-center justify-between bg-white border border-border rounded-lg p-2 pl-3">
                            <code className="text-sm font-bold tracking-wider font-mono text-zinc-800 line-clamp-1">{redemption.voucherCode}</code>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(redemption.voucherCode);
                                toast.success('Đã sao chép mã voucher!');
                              }}
                              className="w-8 h-8 flex shrink-0 items-center justify-center rounded-md hover:bg-zinc-100 text-zinc-500 transition-colors ml-2"
                              title="Sao chép"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {benefit?.benefitType === 'feature_access' && (
                        <div className="mt-5 pt-4 border-t border-border/50">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Đặc quyền được kích hoạt</span>
                          </div>
                        </div>
                      )}
                      
                      {(redemption.status === 'used' || redemption.status === 'USED') && (
                        <div className="absolute top-4 right-4 bg-zinc-200 text-zinc-500 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-sm">
                          Đã dùng
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* === BENEFITS DIALOG === */}
      <Dialog open={isBenefitsOpen} onOpenChange={setIsBenefitsOpen}>
        <DialogContent className="max-w-md w-[95vw] max-h-[85vh] rounded-3xl p-0 flex flex-col gap-0 border-0 overflow-hidden shadow-2xl [&>button]:hidden">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-5 border-b border-border/60 shrink-0 bg-background z-10 relative">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#B5952F]/20 flex items-center justify-center">
                    <Gift className="w-4 h-4 text-[#C49B28]" />
                  </span>
                  Đặc quyền & Quà tặng
                </DialogTitle>
                <p className="text-sm text-muted-foreground ml-10">
                  {loyaltyData
                    ? `${(loyaltyData.currentPoints || 0).toLocaleString()} điểm khả dụng`
                    : 'Đăng ký Membership để đổi quà'}
                </p>
              </div>
              <button
                onClick={() => setIsBenefitsOpen(false)}
                className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </DialogHeader>

          {/* Benefits list */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
            {activeBenefits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Chưa có quà tặng nào</p>
                  <p className="text-sm text-muted-foreground mt-1">Thương hiệu chưa thiết lập chương trình ưu đãi.</p>
                </div>
              </div>
            ) : (
              activeBenefits.map((benefit: any) => {
                const isPointBenefit = benefit.unlockType === 'POINT_REDEMPTION' || benefit.unlockType === 'point_redemption';
                const userPoints = loyaltyData?.currentPoints || 0;
                const requiredPoints = benefit.requiredPoints || 0;
                const canAfford = isPointBenefit ? userPoints >= requiredPoints : false;

                return (
                  <div
                    key={benefit.id}
                    className="group relative flex items-start gap-4 p-4 rounded-2xl bg-zinc-50/70 border border-border/40 hover:border-border/80 hover:bg-zinc-50 transition-all duration-200"
                  >
                    {/* Icon */}
                    <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${isPointBenefit ? 'bg-gradient-to-br from-[#D4AF37]/15 to-[#B5952F]/15 border border-[#D4AF37]/25' : 'bg-muted border border-border'}`}>
                      {benefit.benefitType === 'VOUCHER' || benefit.benefitType === 'voucher'
                        ? <Ticket className={`w-5 h-5 ${isPointBenefit ? 'text-[#C49B28]' : 'text-zinc-500'}`} />
                        : <Gift className={`w-5 h-5 ${isPointBenefit ? 'text-[#C49B28]' : 'text-zinc-500'}`} />
                      }
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground line-clamp-1">{benefit.name}</h4>
                          {benefit.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{benefit.description}</p>
                          )}
                        </div>

                        {/* Redeem button */}
                        {isPointBenefit ? (
                          <button
                            onClick={() => handleRedeem(benefit)}
                            disabled={!loyaltyData}
                            className={`shrink-0 h-8 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:cursor-not-allowed ${
                              !loyaltyData
                                ? 'bg-muted text-muted-foreground border border-border'
                                : canAfford
                                ? 'bg-foreground text-background hover:opacity-80'
                                : 'bg-muted text-muted-foreground border border-border opacity-60'
                            }`}
                          >
                            {!loyaltyData ? (
                              'Tham gia'
                            ) : canAfford ? (
                              'Đổi ngay'
                            ) : (
                              'Thiếu điểm'
                            )}
                          </button>
                        ) : (
                          <span className="shrink-0 inline-flex items-center gap-1 h-8 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
                            <BadgeCheck className="w-3 h-3" />
                            Đặc quyền
                          </span>
                        )}
                      </div>

                      {/* Points footer */}
                      {isPointBenefit && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                            <span className="text-xs font-bold text-foreground">{requiredPoints.toLocaleString()} điểm</span>
                          </div>
                          {loyaltyData && !canAfford && (
                            <span className="text-[10px] text-muted-foreground">
                              Thiếu {(requiredPoints - userPoints).toLocaleString()} điểm
                            </span>
                          )}
                          {loyaltyData && canAfford && (
                            <span className="text-[10px] text-emerald-600 font-semibold">Đủ điều kiện</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer — only when not a member */}
          {!loyaltyData && (
            <div className="px-6 py-4 border-t border-border/60 bg-background shrink-0">
              <Button
                onClick={() => {
                  joinLoyalty(brandId);
                  setIsBenefitsOpen(false);
                }}
                disabled={isJoining}
                className="w-full rounded-full h-12 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-white font-semibold text-sm uppercase tracking-widest"
              >
                {isJoining ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Đăng ký Membership để đổi quà'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat Window */}
      <BrandChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        brandId={brandId}
      />
    </div>
  );
}
