'use client';

import React from 'react';
import { ChevronLeft, Loader2, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetBrandItemDetail, useGetActiveBrandDetail } from '@/features/brands/queries/user-brands.queries';
import { BrandItemMetaPanel } from '@/features/brand-portal/components/BrandItemMeta';
import { isBrandFeatureEnabled } from '@/lib/brand-feature';

interface ProductDetailClientProps {
  productId: string;
}

function formatPrice(price?: number | null) {
  if (price == null) return 'Liên hệ để biết giá';
  return `${price.toLocaleString('vi-VN')}đ`;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const router = useRouter();
  const brandEnabled = isBrandFeatureEnabled();
  const { data: product, isLoading: isProductLoading } = useGetBrandItemDetail(productId);
  const { data: brand, isLoading: isBrandLoading } = useGetActiveBrandDetail(product?.brandId || '');

  if (isProductLoading || isBrandLoading) {
    return (
      <div className="flex-1 bg-background text-foreground min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
        <Tag className="size-10 text-muted-foreground" />
        <p className="text-lg font-semibold">Không tìm thấy sản phẩm</p>
        {brandEnabled && (
          <Link href="/brands" className="text-sm font-semibold underline">
            Khám phá thương hiệu khác
          </Link>
        )}
      </div>
    );
  }

  const imageUrl = product.fashionItem?.imageUrl;

  return (
    <div className="flex-1 bg-background text-foreground min-h-screen pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 group transition-colors"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="flex flex-col gap-4">
            <div className="aspect-[3/4] bg-secondary/20 overflow-hidden rounded-3xl relative">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name || 'Sản phẩm'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <Tag className="size-12 opacity-30" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {brandEnabled && brand && (
              <Link
                href={`/brands/${brand.slug || brand.id}`}
                className="text-muted-foreground font-bold uppercase tracking-widest text-sm hover:text-foreground transition-colors w-fit"
              >
                {brand.name}
              </Link>
            )}
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
            {product.productCode && (
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Mã sản phẩm: {product.productCode}
              </p>
            )}
            {product.description && (
              <p className="text-foreground/80 leading-relaxed">{product.description}</p>
            )}
            {brandEnabled && <BrandItemMetaPanel item={product} />}
          </div>
        </div>
      </div>
    </div>
  );
}
