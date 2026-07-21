'use client';

import React from 'react';
import { useB2BDemoStore } from '@/lib/mock-data/b2b/store';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { mockBrands } from '@/lib/mock-data/b2b';

export default function CartClient() {
  const { cart, removeFromCart, updateQuantity } = useB2BDemoStore();

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex-1 bg-background text-foreground min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Giỏ hàng trống</h1>
        <p className="text-muted-foreground mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <Link href="/community">
          <Button className="rounded-full font-bold uppercase tracking-widest px-8 h-12">
            Khám phá Brands
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background text-foreground min-h-screen pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-10">Giỏ hàng</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-border text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-3 text-right">Tổng</div>
              <div className="col-span-1"></div>
            </div>

            <div className="flex flex-col gap-6">
              {cart.map((item, idx) => {
                const brand = mockBrands.find(b => b.id === item.brandId);
                return (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-4 sm:py-0 border-b border-border sm:border-0">
                    <div className="col-span-1 sm:col-span-6 flex gap-4">
                      <div className="w-20 sm:w-24 aspect-[3/4] bg-muted overflow-hidden flex-shrink-0 rounded-2xl">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center gap-1">
                        <Link href={`/brands/${item.brandId}`} className="text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-wider">
                          {brand?.name}
                        </Link>
                        <Link href={`/products/${item.productId}`} className="font-bold text-sm hover:underline text-foreground">
                          {item.name}
                        </Link>
                        <div className="text-xs text-muted-foreground mt-1">
                          Size: <span className="font-bold text-foreground">{item.size}</span> | Màu: <span className="font-bold text-foreground">{item.color}</span>
                        </div>
                        <div className="text-sm font-bold mt-2 sm:hidden text-foreground">{item.price.toLocaleString()}đ</div>
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex items-center sm:justify-center">
                      <div className="flex items-center border border-border rounded-full h-10 overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.size, item.color, Math.max(1, item.quantity - 1))} 
                          className="px-3 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted h-full flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="font-bold text-sm w-6 text-center text-foreground">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)} 
                          className="px-3 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted h-full flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="hidden sm:block col-span-3 text-right font-bold text-foreground">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </div>

                    <div className="hidden sm:flex col-span-1 justify-end">
                      <button 
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Mobile delete button */}
                    <div className="col-span-1 sm:hidden flex justify-end -mt-8">
                      <button 
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-muted-foreground hover:text-destructive transition-colors text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Xoá
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-muted p-6 lg:p-8 flex flex-col gap-6 sticky top-10 rounded-3xl border border-border">
              <h2 className="font-bold text-lg uppercase tracking-widest border-b border-border pb-4 text-foreground">Tóm tắt đơn hàng</h2>
              
              <div className="flex flex-col gap-4 text-foreground">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-bold">{totalAmount.toLocaleString()}đ</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Phí giao hàng</span>
                  <span className="font-bold">Miễn phí</span>
                </div>
              </div>

              <div className="h-px w-full bg-border"></div>

              <div className="flex items-center justify-between text-lg text-foreground">
                <span className="font-bold">Tổng cộng</span>
                <span className="font-bold text-xl">{totalAmount.toLocaleString()}đ</span>
              </div>

              <Link href="/checkout" className="w-full mt-4">
                <Button className="w-full rounded-full h-14 font-bold uppercase tracking-widest flex items-center justify-center gap-2 group">
                  Tiến hành thanh toán
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
