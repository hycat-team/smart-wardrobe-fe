"use client";
import React from 'react';
import Link from 'next/link';
import { useGetActiveBrands } from '@/features/brands/queries/user-brands.queries';
import { Loader2, Store, MapPin, Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';


export default function BrandsClient() {
  const { data: brands, isLoading } = useGetActiveBrands();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-muted/30 border border-border/50 p-8 sm:p-12 mt-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Store className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Khám Phá Nhãn Hàng</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground">
            Thương Hiệu Nổi Bật
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
            Khám phá các nhãn hàng nội địa chất lượng cao, trở thành thành viên và tận hưởng các đặc quyền độc quyền dành riêng cho bạn.
          </p>
        </div>
      </div>

      {/* Brands Grid */}
      {brands && brands.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Link 
              key={brand.id} 
              href={`/brands/${brand.id}`}
              className="group flex flex-col bg-background border border-border/50 rounded-2xl overflow-hidden hover:border-border transition-colors hover:shadow-lg"
            >
              {/* Brand Cover / Logo Area */}
              <div className="relative h-48 bg-muted/20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <Store className="w-16 h-16 text-muted-foreground/30" />
                )}
                
                {/* Overlay Logo */}
                <div className="absolute bottom-4 left-6 z-20 flex items-end gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-background shadow-md bg-background flex-shrink-0">
                    {brand.logoUrl ? (
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Store className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Brand Info */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {brand.name}
                  </h3>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                  {brand.description || 'Chưa có thông tin mô tả cho nhãn hàng này.'}
                </p>

                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Việt Nam</span>
                  </div>
                  <span className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                    Vào cửa hàng <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/10 rounded-2xl border border-border/30">
          <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-1">Chưa có nhãn hàng nào</h3>
          <p className="text-sm text-muted-foreground">Hiện tại chưa có nhãn hàng nào đang hoạt động trên hệ thống.</p>
        </div>
      )}
    </div>
  );
}
