'use client';

import React, { useState, useEffect } from 'react';
import { mockProducts, mockBrands } from '@/lib/mock-data/b2b';
import { useB2BDemoStore } from '@/lib/mock-data/b2b/store';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Sparkles, ShoppingBag, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProductDetailClientProps {
  productId: string;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(mockProducts.find(p => p.id === productId));
  const [brand, setBrand] = useState<any>(mockBrands.find(b => b.id === product?.brandId));

  useEffect(() => {
    if (!product) {
      try {
        const stored = localStorage.getItem("brand_custom_products");
        if (stored) {
          const customProducts = JSON.parse(stored);
          const customProduct = customProducts.find((p: any) => p.id === productId);
          if (customProduct) {
            setProduct(customProduct);
            setBrand(mockBrands.find(b => b.id === customProduct.brandId));
          }
        }
      } catch (e) {}
    }
  }, [productId, product]);

  const addToCart = useB2BDemoStore(state => state.addToCart);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!product || !brand) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Vui lòng chọn Kích cỡ');
      return;
    }
    if (!selectedColor) {
      toast.error('Vui lòng chọn Màu sắc');
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      imageUrl: product.imageUrls[0],
      brandId: brand.id,
      brandName: brand.name,
      selected: true
    });

    // toast.success('Đã thêm vào giỏ hàng');
  };

  return (
    <div className="flex-1 bg-white text-black min-h-screen pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-black/60 hover:text-black mb-8 group transition-colors"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Images */}
          <div className="flex flex-col gap-4">
            <div className="aspect-[3/4] bg-[#F5F2EE] overflow-hidden rounded-sm relative">
              <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
              {product.discountPrice && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
                  Sale
                </div>
              )}
            </div>
            {product.imageUrls.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {product.imageUrls.slice(1).map((url: string, idx: number) => (
                  <div key={idx} className="aspect-[3/4] bg-[#F5F2EE] overflow-hidden rounded-sm">
                    <img src={url} alt={`${product.name} view ${idx + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div className="flex flex-col sticky top-10 h-fit">
            <Link href={`/brands/${brand.id}`} className="text-black/50 font-bold uppercase tracking-widest text-sm mb-3 hover:text-black transition-colors">
              {brand.name}
            </Link>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              {product.discountPrice ? (
                <>
                  <span className="text-2xl font-bold text-red-600">{product.discountPrice.toLocaleString('vi-VN')}đ</span>
                  <span className="text-lg text-black/40 line-through">{product.price.toLocaleString('vi-VN')}đ</span>
                </>
              ) : (
                <span className="text-2xl font-bold">{product.price.toLocaleString('vi-VN')}đ</span>
              )}
            </div>

            <p className="text-black/80 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="h-px w-full bg-black/10 mb-8"></div>

            {/* Colors */}
            <div className="flex flex-col gap-4 mb-8">
              <span className="font-bold text-sm uppercase tracking-widest">Màu sắc</span>
              <div className="flex flex-wrap gap-3">
                {(product.colors || ['Mặc định']).map((color: string) => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-12 px-6 border font-bold text-sm uppercase tracking-widest transition-colors
                      ${selectedColor === color 
                        ? 'border-black bg-black text-white' 
                        : 'border-black/20 text-black/70 hover:border-black'}
                    `}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm uppercase tracking-widest">Kích cỡ</span>
                <button className="text-xs font-bold underline decoration-1 underline-offset-2 text-black/50 hover:text-black">Hướng dẫn chọn size</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {(product.sizes || ['Freesize']).map((size: string) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-16 h-16 flex items-center justify-center border text-sm font-bold transition-all ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-black/20 text-black hover:border-black/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-black/20 h-14">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-black/50 hover:text-black transition-colors">-</button>
                  <span className="font-bold w-6 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 text-black/50 hover:text-black transition-colors">+</button>
                </div>
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 h-14 rounded-none bg-black hover:bg-black/90 text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Thêm vào giỏ
                </Button>
                <Button variant="outline" className="h-14 w-14 p-0 rounded-none border-black/20 hover:bg-black/5 flex-shrink-0">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Style with My Wardrobe CTA */}
              <Button 
                variant="outline"
                className="w-full h-14 rounded-none border-black hover:bg-black hover:text-white font-bold tracking-wide flex items-center justify-center gap-2 group transition-all"
                onClick={() => toast('Tính năng AI Styling đang phát triển')}
              >
                <Sparkles className="w-5 h-5 text-[#D4AF37] group-hover:text-white transition-colors" />
                Style with My Wardrobe
              </Button>
            </div>

            {/* Accordion Info */}
            <div className="flex flex-col border-t border-black/10">
              {['Chi tiết chất liệu', 'Giao hàng & Đổi trả', 'Hướng dẫn bảo quản'].map((item) => (
                <div key={item} className="flex items-center justify-between py-4 border-b border-black/10 cursor-pointer group">
                  <span className="font-bold text-sm tracking-wide group-hover:text-black/60 transition-colors">{item}</span>
                  <span className="text-black/40 text-xl font-light">+</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
